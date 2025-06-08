import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { glob } from 'glob';

function switchToStaticScripts(htmlContent) {
	// Look for the module script block and capture indentation
	const moduleScriptPattern = /(\s*)<script type="module">([\s\S]*?)<\/script>/;
	const match = htmlContent.match(moduleScriptPattern);

	if (!match) return htmlContent;

	const indentation = match[1].replace(/\n/g, '');
	let moduleCode = match[2];
	let scriptPaths = [];

	// Replace main reveal.js import
	if (moduleCode.includes("import Reveal from 'reveal.js';")) {
		scriptPaths.push('dist/reveal.js');
		moduleCode = moduleCode.replace("import Reveal from 'reveal.js';", '');
	}

	// Replace plugin imports
	moduleCode = moduleCode.replace(
		/import\s+(\w+)\s+from\s+'reveal\.js\/plugin\/(\w+)';/g,
		(match, pluginVar, pluginName) => {
			scriptPaths.push(`dist/plugin/${pluginName}.js`);
			return '';
		}
	);

	// Clean up any remaining empty lines and trim
	moduleCode = moduleCode.replace(/^\s*[\r\n]/gm, '').trim();

	const scriptTags = scriptPaths.map((path) => `${indentation}<script src="${path}"></script>`);
	const replacement =
		'\n\n' +
		scriptTags.join('\n') +
		`\n${indentation}<script>\n${indentation}\t${moduleCode}\n${indentation}</script>`;

	return htmlContent.replace(moduleScriptPattern, replacement);
}

/**
 * Replace paths to dynamic CSS/SCSS files with static ones.
 */
function switchToStaticStyles(htmlContent) {
	// Replace /css/* links with /dist/*
	htmlContent = htmlContent.replace(/href="css\/([^"]+\.(css|scss))"/g, (match, filePath) => {
		const cssPath = filePath.replace(/\.scss$/, '.css');
		return `href="dist/${cssPath}"`;
	});

	// Replace /plugin/* links with /dist/plugin/*
	htmlContent = htmlContent.replace(/href="plugin\/([^"]+\.(css|scss))"/g, (match, filePath) => {
		const cssPath = filePath.replace(/\.scss$/, '.css');
		return `href="dist/plugin/${cssPath}"`;
	});

	return htmlContent;
}

async function main() {
	// Parse command line arguments for HTML file target
	const args = process.argv.slice(2);
	const htmlTarget = args.length > 0 ? args[0] : 'index.html';

	// Ensure the target has ./ prefix if it's a relative path
	const targetFile = htmlTarget.startsWith('./') ? htmlTarget : `./${htmlTarget}`;

	console.log(`Packaging presentation with target file: ${targetFile}`);

	// Read the HTML file
	let htmlContent = fs.readFileSync(targetFile, 'utf8');

	// Switch from Vite's dynamic imports to static ones so that
	// this presentation can run anywhere (including offline via
	// file:// protocol)
	htmlContent = switchToStaticScripts(htmlContent);
	htmlContent = switchToStaticStyles(htmlContent);

	const zip = new JSZip();
	const filesToInclude = ['./dist/**', './*/*.md'];

	if (fs.existsSync('./lib')) filesToInclude.push('./lib/**');
	if (fs.existsSync('./images')) filesToInclude.push('./images/**');
	if (fs.existsSync('./slides')) filesToInclude.push('./slides/**');

	// Add the modified HTML file first
	const htmlFileName = htmlTarget.replace(/\.\//, '');
	zip.file(htmlFileName, htmlContent);

	for (const pattern of filesToInclude) {
		const files = glob.sync(pattern, {
			nodir: true,
			dot: false,
			ignore: ['./examples/**', './test/**'],
		});
		for (const file of files) {
			const filePath = path.resolve(file);
			const relativePath = path.relative(process.cwd(), filePath);
			const fileData = fs.readFileSync(filePath);
			zip.file(relativePath, fileData);
		}
	}

	const content = await zip.generateAsync({ type: 'nodebuffer' });
	const zipFileName = `presentation.zip`;
	fs.writeFileSync(zipFileName, content);
	console.log(`Presentation packaged successfully: ${zipFileName}`);
}

main().catch((error) => {
	console.error('Error packaging presentation:', error);
	process.exit(1);
});
