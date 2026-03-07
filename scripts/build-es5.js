import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'esbuild';
import ts from 'typescript';
import { LICENSE_BANNER } from './banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const inputPath = resolve(root, 'dist/reveal.js');
const outputPath = resolve(root, 'dist/reveal.es5.js');

try {
	const source = await readFile(inputPath, 'utf8');
	const result = ts.transpileModule(source, {
		compilerOptions: {
			target: ts.ScriptTarget.ES5,
			module: ts.ModuleKind.UMD,
			downlevelIteration: true,
			removeComments: false,
		},
		fileName: 'reveal.js',
		reportDiagnostics: true,
	});

	if (result.diagnostics?.length) {
		const errors = result.diagnostics
			.filter(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error)
			.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));

		if (errors.length) {
			throw new Error(`TypeScript transpilation failed:\n${errors.join('\n')}`);
		}
	}

	const minified = await transform(result.outputText, {
		loader: 'js',
		target: ['es5'],
		minify: true,
		legalComments: 'none',
	});

	await writeFile(outputPath, `${LICENSE_BANNER}\n${minified.code.trimStart()}`, 'utf8');

	console.log(`Built ES5 UMD bundle: ${outputPath} (target: es5, minified)`);
} catch (error) {
	if (error?.code === 'ENOENT') {
		console.error(`Could not find ${inputPath}. Run "npm run build" first.`);
		process.exit(1);
	}

	throw error;
}
