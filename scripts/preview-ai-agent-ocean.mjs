import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});
try{
 await fs.mkdir('docs/ai-agent/deep-sea',{recursive:true});
 await page.setViewport({width:1440,height:1080,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:8004/AI_agent_lesson.html#home',{waitUntil:'networkidle0'});await page.waitForSelector('.home-bento');await page.evaluate(()=>document.fonts.ready);await new Promise(r=>setTimeout(r,1300));
 await page.screenshot({path:'docs/ai-agent/deep-sea/desktop.png'});
 await page.setViewport({width:390,height:844});await new Promise(r=>setTimeout(r,500));await page.screenshot({path:'docs/ai-agent/deep-sea/mobile.png',fullPage:true});
 await page.setViewport({width:1440,height:1000});await page.$eval('#desktopLessons [data-open-lesson="1"]',e=>e.click());await new Promise(r=>setTimeout(r,1200));await page.screenshot({path:'docs/ai-agent/deep-sea/lesson.png'});
 console.log({errors,title:await page.title(),orbCount:await page.$$('.fisheye-orb').then(x=>x.length)});
}finally{await browser.close();}
