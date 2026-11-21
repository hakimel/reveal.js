import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
try{
 const page=await browser.newPage();await page.goto(pathToFileURL(path.resolve('assets/ai-agent/workshop-guide.html')).href,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
 await fs.mkdir('output/pdf',{recursive:true});await page.pdf({path:'output/pdf/ai-agent-workbook.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
 console.log('Exported workbook PDF with embedded local fonts.');
}finally{await browser.close();}
