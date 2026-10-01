import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'reveal.js': resolve(__dirname, '../js/index.ts'),
			'vue': 'vue/dist/vue.esm-bundler.js',
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/__tests__/setup.ts'],
	},
});
