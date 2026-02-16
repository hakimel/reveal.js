import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

// List all theme files in the css/theme directory
const themeFiles = fs
	.readdirSync(resolve(__dirname, 'css/theme'))
	.filter((file) => file.endsWith('.scss'));

const themeEntries = themeFiles.reduce((acc, file) => {
	acc[`theme/${file.replace('.scss', '')}`] = resolve(__dirname, `css/theme/${file}`);
	return acc;
}, {});

export default defineConfig({
	root: './',
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
			},
		},
	},
	build: {
		emptyOutDir: false,
		cssCodeSplit: true,
		lib: {
			formats: ['es'],
			entry: {
				reveal: resolve(__dirname, 'css/reveal.scss'),
				reset: resolve(__dirname, 'css/reset.css'),

				...themeEntries,
			},
		},
	},
	plugins: [],
});
