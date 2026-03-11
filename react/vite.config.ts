import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: [resolve(__dirname, 'src')],
			exclude: [resolve(__dirname, 'src/__tests__')],
			tsconfigPath: resolve(__dirname, 'tsconfig.json'),
		}),
	],
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
