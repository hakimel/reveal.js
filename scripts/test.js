import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { glob } from 'glob';
import { runQunitPuppeteer, printFailedTests } from 'node-qunit-puppeteer';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const testFiles = glob.sync('test/*.html', { cwd: root });

const combinedResults = { passed: 0, failed: 0, total: 0, runtime: 0 };

// Create and start Vite server (root = project root)
const startServer = async () => {
	const server = await createServer({
		root,
		server: {
			port: 8009
		},
	});
	await server.listen();

	const baseUrl = server.resolvedUrls?.local?.[0] || 'http://127.0.0.1:8009/';
	return { server, baseUrl };
};

// Run tests
const runTests = async (baseUrl) => {
	await Promise.all(
		testFiles.map(async (file) => {
			const qunitArgs = {
				targetUrl: new URL(file, baseUrl).href,
				timeout: 30000,
				redirectConsole: false,
				puppeteerArgs: ['--allow-file-access-from-files'],
			};

			try {
				const result = await runQunitPuppeteer(qunitArgs);
				combinedResults.passed += result.stats.passed;
				combinedResults.failed += result.stats.failed;
				combinedResults.total += result.stats.total;
				combinedResults.runtime += result.stats.runtime;

				if (result.stats.failed > 0) {
					console.log(
						`${'!'} ${file} [${result.stats.passed}/${result.stats.total}] in ${
							result.stats.runtime
						}ms`.red
					);
					printFailedTests(result, console);
				} else {
					console.log(
						`${'✔'} ${file} [${result.stats.passed}/${result.stats.total}] in ${
							result.stats.runtime
						}ms`.green
					);
				}
			} catch (error) {
				console.error(`Error running tests for ${file}:`, error);
			}
		})
	);

	console.log(
		`\n${combinedResults.passed}/${combinedResults.total} tests passed, ${combinedResults.failed} failed, ${combinedResults.runtime}ms runtime`
	);

	return combinedResults.failed > 0 ? 1 : 0;
};

// Main execution
(async () => {
	let server;

	try {
		const startedServer = await startServer();
		server = startedServer.server;

		process.exitCode = await runTests(startedServer.baseUrl);
	} catch (error) {
		console.error('An error occurred:', error);
		process.exitCode = 1;
	} finally {
		if (server) {
			await server.close();
		}
	}
})();
