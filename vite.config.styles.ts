import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      formats: ['es'],
      entry: {
        'reveal': resolve(__dirname, 'css/reveal.scss'),
        'reset': resolve(__dirname, 'css/reset.css'),

        'theme/black': resolve(__dirname, 'css/theme/black.scss'),
      },
    }
  },
  plugins: [],
})
