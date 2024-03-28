import { resolve } from 'path'
import { ModuleFormat } from 'rollup';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export const appendExtension = (format:ModuleFormat, name:String) : string => {
  if( format === 'es' ) {
    return `${name}.mjs`;
  }
  else {
    return `${name}.js`;
  }
}

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      formats: ['es', 'umd'],
      entry:  resolve(__dirname, 'js/index.ts'),
      name: 'Reveal',
      fileName: (format, entryName) => {
        return appendExtension(format, 'reveal');
      }
    },
    rollupOptions: {
      output: {
        assetFileNames: "reveal.[ext]",
      },
    },
  },
  resolve: {
    alias: {
      // Matches the exported paths in package.json
      'reveal.js/plugin': './plugin',
      'reveal.js': '/js',
    },
  },
  plugins: [
    dts({ insertTypesEntry: true }),
  ],
})
