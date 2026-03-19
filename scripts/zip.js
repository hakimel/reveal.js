import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { globSync } from 'glob';

function switchToStaticScripts(htmlContent) {
	// Look for the module script block and capture indentation
	const moduleScriptPattern = /(\s*)<script type="module">([\s\S]*?)<\/script>/;
	const match = htmlContent.match(moduleScriptPattern);

	if (!match) return htmlContent;

	const indentation = match[1].replace(/\n/g, '');
	let moduleCode = match[2];
	const scriptPaths = [];
	const pluginAliasMap = new Map();
	const moduleAliasMap = new Map();

	const addScriptPath = (scriptPath) => {
		if (!scriptPaths.includes(scriptPath)) {
			scriptPaths.push(scriptPath);
		}
	};

	const replaceIdentifier = (code, identifier, replacement) => {
		if (!identifier || identifier === replacement) return code;
		const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return code.replace(new RegExp(`\\b${escaped}\\b`, 'g'), replacement);
	};

	// Replace main reveal.js import.
	moduleCode = moduleCode.replace(
		/^\s*import\s+(\w+)\s+from\s+['"]reveal\.js['"]\s*;?\s*$/gm,
		(match, revealVar) => {
			addScriptPath('dist/reveal.js');
			moduleAliasMap.set(revealVar, 'Reveal');
			return '';
		}
	);

	// Replace plugin imports
	moduleCode = moduleCode.replace(
		/^\s*import\s+(\w+)\s+from\s+['"]reveal\.js\/plugin\/(\w+)['"]\s*;?\s*$/gm,
		(match, pluginVar, pluginName) => {
			const pluginGlobal = `Reveal${pluginName.charAt(0).toUpperCase()}${pluginName.slice(1)}`;
			addScriptPath(`dist/plugin/${pluginName}.js`);
			pluginAliasMap.set(pluginVar, pluginGlobal);
			return '';
		}
	);

	for (const [pluginVar, pluginGlobal] of pluginAliasMap) {
		moduleCode = replaceIdentifier(moduleCode, pluginVar, pluginGlobal);
	}
	for (const [moduleVar, moduleGlobal] of moduleAliasMap) {
		moduleCode = replaceIdentifier(moduleCode, moduleVar, moduleGlobal);
	}

	// Clean up any remaining empty lines and trim
	moduleCode = moduleCode.replace(/^\s*[\r\n]/gm, '').trim();

	const scriptTags = scriptPaths.map((scriptPath) => `${indentation}<script src="${scriptPath}"></script>`);
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
	const zip = new JSZip();

	// Parse command line arguments for HTML file target
	const args = process.argv.slice(2);
	const htmlTargets = args.length > 0 ? args : ['index.html'];
	for (const htmlTarget of htmlTargets) {
		// Ensure relative paths are read from cwd while keeping absolute paths intact
		const targetFile = path.isAbsolute(htmlTarget)
			? htmlTarget
			: htmlTarget.startsWith('./')
				? htmlTarget
				: `./${htmlTarget}`;

		console.log(`Packaging presentation with target file: ${targetFile}`);

		// Read the HTML file
		let htmlContent = fs.readFileSync(targetFile, 'utf8');

		// Switch from Vite's dynamic imports to static ones so that
		// this presentation can run anywhere (including offline via
		// file:// protocol)
		htmlContent = switchToStaticScripts(htmlContent);
		htmlContent = switchToStaticStyles(htmlContent);

		// Add the modified HTML file first
		const htmlFileName = htmlTarget.replace(/\.\//, '');
		zip.file(htmlFileName, htmlContent);
	}

	const filesToInclude = ['./dist/**', './*/*.md'];

	if (fs.existsSync('./lib')) filesToInclude.push('./lib/**');
	if (fs.existsSync('./images')) filesToInclude.push('./images/**');
	if (fs.existsSync('./slides')) filesToInclude.push('./slides/**');

	for (const pattern of filesToInclude) {
		const files = globSync(pattern, {
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
