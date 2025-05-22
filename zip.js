import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import {glob} from 'glob';

async function main() {
  const zip = new JSZip();
  const filesToInclude = [
    './index.html',
    './dist/**',
    './*/*.md'
  ];

  if (fs.existsSync('./lib')) filesToInclude.push('./lib/**');
  if (fs.existsSync('./images')) filesToInclude.push('./images/**');
  if (fs.existsSync('./slides')) filesToInclude.push('./slides/**');

  for (const pattern of filesToInclude) {
    const files = glob.sync(pattern, {
      nodir: true,
      dot: true,
      ignore: ['./examples/**', './test/**']
    });
    for (const file of files) {
      const filePath = path.resolve(file);
      const relativePath = path.relative(process.cwd(), filePath);
      const fileData = fs.readFileSync(filePath);
      zip.file(relativePath, fileData);
    }
  }

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('reveal-js-presentation.zip', content);
  console.log('Presentation packaged successfully: reveal-js-presentation.zip');
}

main().catch(error => {
  console.error('Error packaging presentation:', error);
  process.exit(1);
});
