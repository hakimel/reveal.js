import { access, copyFile, mkdir, readdir } from 'node:fs/promises';

const pluginDirectories = await readdir(new URL('../plugin/', import.meta.url), {
	withFileTypes: true,
});

await mkdir(new URL('../dist/plugin/', import.meta.url), { recursive: true });

await Promise.all(
	pluginDirectories
		.filter(entry => entry.isDirectory())
		.map(async entry => {
			const source = new URL(`../plugin/${entry.name}/index.d.ts`, import.meta.url);
			const destination = new URL(`../dist/plugin/${entry.name}.d.ts`, import.meta.url);

			try {
				await access(source);
				await copyFile(source, destination);
			}
			catch (error) {
				if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
					return;
				}

				throw error;
			}
		}),
);
