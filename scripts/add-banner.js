import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { LICENSE_BANNER } from './banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const targets = process.argv.slice(2);

for (const target of targets) {
	const absolutePath = resolve(root, target);
	const contents = await readFile(absolutePath, 'utf8');
	const withoutBanner = contents.startsWith(LICENSE_BANNER)
		? contents.slice(LICENSE_BANNER.length).trimStart()
		: contents.trimStart();

	await writeFile(absolutePath, `${LICENSE_BANNER}\n${withoutBanner}`, 'utf8');
}
