import { resolve } from 'path';
import { defineConfig } from 'vite'
import { appendExtension } from '../../vite.config.ts';

// Once Vite supports multiple entries for plugins, this build can
// be merged into the main vite.config.ts.
// See https://github.com/vitejs/vite/pull/10609

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      formats: ['es', 'umd'],
      entry: {
        'plugin/notes': resolve(__dirname, 'index.js'),
      },
      name: 'RevealNotes',
      fileName: appendExtension
    }
  },
  plugins: [],
})
