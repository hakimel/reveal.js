import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [react(), dts({ include: ['src'], exclude: ['src/__tests__'] })],
	build: {
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
			fileName: () => 'index.mjs',
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', 'reveal.js'],
		},
	},
});
