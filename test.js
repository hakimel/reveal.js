import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';
import { runQunitPuppeteer, printFailedTests } from 'node-qunit-puppeteer';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = glob.sync('test/*.html');

const combinedResults = { passed: 0, failed: 0, total: 0, runtime: 0 };

// Create and start Vite server
const startServer = async () => {
	const server = await createServer({
		root: __dirname,
		server: {
			port: 8009,
		},
	});
	await server.listen();
	return server;
};

// Run tests
const runTests = async (server) => {
	await Promise.all(
		testFiles.map(async (file) => {
			const qunitArgs = {
				targetUrl: `http://localhost:8009/${file}`,
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

	// Exit with status code 1 if any tests failed, otherwise exit with 0
	process.exit(combinedResults.failed > 0 ? 1 : 0);
};

// Main execution
(async () => {
	try {
		const server = await startServer();
		await runTests(server);
		await server.close();
	} catch (error) {
		console.error('An error occurred:', error);
		process.exit(1);
	}
})();
