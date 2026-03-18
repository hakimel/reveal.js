import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@revealjs/vue': resolve(__dirname, '../src/index.ts'),
		},
	},
});
