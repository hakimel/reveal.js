import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.AGENT_LESSON_URL||'http://127.0.0.1:8001';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const page=await browser.newPage();
const errors=[], fail=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
const tests=[];
try {
 await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
 await page.goto(base+'/AI_agent_presentation.html',{waitUntil:'networkidle0'});
 await page.evaluate(()=>document.fonts.ready);
 const total=await page.$$eval('.slide',s=>s.length);assert.equal(total,42);
 await page.addStyleTag({content:'.slides-container{transition:none!important}.slide.active .lesson-workbench,.slide.active .lesson-number{animation:none!important}'});
 const fontStatus=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status})));
 assert(fontStatus.every(f=>f.status==='loaded'));tests.push('local fonts');
 const layouts=[];
 for(const [width,height] of [[1440,900],[1280,720],[1920,1080],[390,844]]){
  await page.setViewport({width,height,deviceScaleFactor:1});
  for(let i=0;i<total;i++){
   await page.evaluate(i=>window.agentLesson.goToSlide(i),i);
   const r=await page.$eval('.slide.active',el=>{const r=el.getBoundingClientRect(),c=el.querySelector('.slide-content').getBoundingClientRect();return {slide:el.id,scroll:el.scrollHeight>el.clientHeight+3,horizontal:el.scrollWidth>el.clientWidth+3,top:Math.round(c.top-r.top),bottom:Math.round(c.bottom-r.top),available:el.clientHeight};});
   if(r.horizontal||(width>900&&(r.scroll||r.top<0||r.bottom>r.available+3)))layouts.push({width,height,...r});
  }
 }
 console.log('LAYOUT',JSON.stringify(layouts));
 await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
 await page.evaluate(()=>window.agentLesson.goToSlide(document.querySelector('[data-lesson="1"]').id.split('-')[1]-1));
 await page.click('.slide.active [data-activity]');assert(await page.$eval('#activityDialog',e=>e.open));
 await page.type('#activityDialog [data-answer]','سىناق جاۋابى');await page.click('#activityDialog [data-complete]');
 await page.click('#activityDialog .worked-answer summary');assert(await page.$eval('#activityDialog details',e=>e.open));
 await page.keyboard.press('Escape');
 await page.click('.slide.active [data-notes]');assert(await page.$eval('#notesDialog',e=>e.open));await page.keyboard.press('Escape');
 tests.push('18 exercises, worked answers and notes');
 await page.click('#workshopToggle');assert.equal(await page.$eval('#courseProgress',e=>e.textContent),'1 / 18');
 await page.click('#workshopDialog [data-route="workshop-1"]');
 const routes={};
 for(const name of ['overview','workshop-1','workshop-2','workshop-3','workshop-4','workshop-5','all']){
  await page.evaluate(n=>window.agentLesson.setRoute(n),name);
  const info=await page.evaluate(()=>window.agentLesson.getRoute());routes[name]=info.count;assert(info.count>0);
  const count=await page.$$eval('.slide:not([hidden])',s=>s.length);assert.equal(count,info.count);
  await page.click('#nextSlide');
  const geometric=await page.$eval('.slide.active',e=>({top:e.getBoundingClientRect().top,deck:document.querySelector('#deck').getBoundingClientRect().top}));assert(Math.abs(geometric.top-geometric.deck)<2);
  await page.keyboard.press('End');assert(await page.$eval('#nextSlide',e=>e.disabled));
 }
 tests.push('all five workshop paths, overview, boundaries and stage alignment');
 await page.reload({waitUntil:'networkidle0'});
 await page.addStyleTag({content:'.slides-container{transition:none!important}.slide.active .lesson-workbench,.slide.active .lesson-number{animation:none!important}'});
 await page.evaluate(()=>window.agentLesson.goToSlide(document.querySelector('[data-lesson="1"]').id.split('-')[1]-1));
 await page.click('.slide.active [data-activity]');assert.equal(await page.$eval('#activityDialog textarea',e=>e.value),'سىناق جاۋابى');assert(await page.$eval('#activityDialog input',e=>e.checked));await page.keyboard.press('Escape');
 await page.click('#readerToggle');assert.equal(await page.$eval('#read-1 [data-answer]',e=>e.value),'سىناق جاۋابى');await page.click('#readerToggle');tests.push('browser-local progress survives reload and syncs with reader');
 await page.evaluate(()=>window.agentLesson.goToSlide([...document.querySelectorAll('.slide')].findIndex(s=>s.classList.contains('demo-slide'))));
 for(let i=0;i<3;i++)await page.click('#demoNext');await page.click('[data-approve="no"]');assert(await page.$eval('#demoTrace',e=>e.textContent.includes('خاتىرە ساقلانمىدى')));
 await page.click('#demoReset');for(let i=0;i<3;i++)await page.click('#demoNext');await page.click('[data-approve="yes"]');assert(await page.$eval('#demoTrace',e=>e.textContent.includes('"simulation": true')));tests.push('simulation approval and denial');
 await page.click('#workshopToggle');await page.click('#clearCourse');assert.equal(await page.$eval('#courseProgress',e=>e.textContent),'0 / 18');await page.keyboard.press('Escape');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);assert.equal(await page.$eval('.ring-a',e=>getComputedStyle(e).animationName),'none');tests.push('reduced motion');await page.emulateMediaFeatures([]);
 await page.evaluate(()=>window.agentLesson.setRoute('all'));
 await page.screenshot({path:'docs/ai-agent/preview.png'});
 // Contact sheet of every slide at classroom resolution.
 await page.setViewport({width:1280,height:720});
 await page.addStyleTag({content:'*{animation:none!important}.slides-container{transition:none!important}'});
 const imgs=[];
 for(let i=0;i<total;i++){await page.evaluate(i=>window.agentLesson.goToSlide(i),i);imgs.push(await page.screenshot({encoding:'base64'}));}
 const sheet=await browser.newPage();await sheet.setViewport({width:1600,height:2200});
 await sheet.setContent('<body style="margin:0;background:#262738;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;font:14px monospace;color:white">'+imgs.map((s,i)=>`<div><div style="padding:5px">${i+1}</div><img style="width:100%;display:block" src="data:image/png;base64,${s}"></div>`).join('')+'</body>');
 await sheet.screenshot({path:'/tmp/agent-course-contact.png',fullPage:true});await sheet.close();
 await page.setViewport({width:390,height:844});await page.click('#workshopToggle');assert(await page.$eval('#workshopDialog',e=>e.scrollWidth<=e.clientWidth+2));await page.screenshot({path:'/tmp/agent-workshop-mobile.png'});await page.keyboard.press('Escape');
 await page.goto(base+'/assets/ai-agent/workshop-guide.html',{waitUntil:'networkidle0'});assert.equal(await page.$$eval('.workbook-lesson',s=>s.length),18);assert.equal(await page.$$eval('.workshop-card',s=>s.length),5);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
 await page.emulateMediaType('print');await page.setViewport({width:794,height:1123});await page.screenshot({path:'/tmp/agent-workbook-print.png'});tests.push('phone workbook and print media');
 const report={total,viewports:[[1440,900],[1280,720],[1920,1080],[390,844]],routes,fontStatus,layouts,errors,tests};
 await fs.writeFile('docs/ai-agent/presentation-validation.json',JSON.stringify(report,null,2)+'\n');
 assert.equal(errors.length,0);assert.equal(layouts.length,0);
 console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
