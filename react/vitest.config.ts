import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'reveal.js': resolve(__dirname, '../js/index.ts'),
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/__tests__/setup.ts'],
	},
});
