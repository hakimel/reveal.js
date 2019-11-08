#!/usr/bin/env node

const JsZip = require('jszip');
const { resolve: resolvePath } = require('path');
const { readFileSync, createWriteStream } = require('fs');

process.stdout.write('Compressing presentation!\n');

const htmlFilePath = resolvePath(__dirname, 'dist', 'index.html');
const outputContent = readFileSync(htmlFilePath, 'utf8');
const zipFilePath = resolvePath(__dirname, 'dist', 'index.zip');

new JsZip()
  .file(`index.html`, outputContent)
  .generateNodeStream({
    type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE', compressionOptions: { level: 9 },
  })
  .pipe(createWriteStream(zipFilePath))
  .on('finish', () => {
    process.stdout.write('Presentation compressed!\n');
  });
