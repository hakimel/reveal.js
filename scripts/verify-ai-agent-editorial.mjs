import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const lessons=JSON.parse(await fs.readFile('assets/ai-agent/lessons.json','utf8'));
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const page=await browser.newPage(),errors=[],failures=[];let layouts=0,selects=0;
page.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(path.resolve('AI_agent_lesson.html')).href;
try{
 await page.setOfflineMode(true);await page.setViewport({width:1440,height:900});
 await page.goto(url,{waitUntil:'networkidle0'});
 await page.evaluate(()=>{
  localStorage.setItem('agent-lab-interactive-v1',JSON.stringify({version:2,lastLesson:14,completed:[1],read:[1,14],practiced:[1],answers:{1:1},readingMode:'compact'}));history.replaceState(null,'','#lesson-14');
 });
 await page.reload({waitUntil:'networkidle0'});
 assert.equal(await page.$eval('.lesson-page',e=>e.dataset.lessonId),'14');
 assert.equal(await page.$eval('#desktopProgress',e=>e.textContent),'0 / 18');
 assert(await page.evaluate(()=>!!localStorage.getItem('agent-lab-interactive-v1-quiz-backup')));
 assert(await page.$('.learning-bridge'));assert(await page.$('.implementation-notes'));
 await page.$eval('.reading-tools [data-reading-toggle]',e=>e.click());
 await page.reload({waitUntil:'networkidle0'});assert(await page.$('body.reading-comfort'));
 assert.equal(await page.$eval('.learning-bridge p',e=>getComputedStyle(e).fontSize),'15px');
 await page.$eval('.reading-tools [data-reading-toggle]',e=>e.click());
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
 for(const [width,height] of [[1440,900],[1024,640],[844,390],[390,844],[360,640],[320,568]]){
  await page.setViewport({width,height});
  for(const comfort of [false,true]){
   await page.evaluate(comfort=>document.body.classList.toggle('reading-comfort',comfort),comfort);
   for(const l of lessons){
    await page.$eval(`#desktopLessons [data-open-lesson="${l.id}"]`,e=>e.click());
    await page.$eval('.learning-bridge details',e=>e.open=true);
    await new Promise(r=>setTimeout(r,25));
    // Navigation restores the persisted setting; select each test mode afterwards.
    await page.evaluate(c=>document.body.classList.toggle('reading-comfort',c),comfort);
    const issues=await page.evaluate(()=>{
     const issues=[],h=document.querySelector('.app-header').getBoundingClientRect(),f=document.querySelector('#lessonFooter').getBoundingClientRect();
     if(document.documentElement.scrollWidth>innerWidth+2)issues.push('document overflow');
     if(h.bottom>=f.top)issues.push('chrome overlaps');
     for(const e of document.querySelectorAll('.learning-bridge,.quiz-choice,.demo-panel,.reading-tools,#lessonFooter button')){
      const r=e.getBoundingClientRect();if(r.left< -2||r.right>innerWidth+2)issues.push(e.className+' outside viewport');
      if(e.scrollWidth>e.clientWidth+3)issues.push(e.className+' clipped horizontally');
     }
     for(const e of document.querySelectorAll('.lesson-heading h1,.learning-bridge summary,.learning-level,.quiz-choice span'))if(getComputedStyle(e).letterSpacing!=='normal')issues.push('Arabic tracking');
     window.scrollTo(0,document.documentElement.scrollHeight);
     const last=document.querySelector('#quizFeedback').getBoundingClientRect();
     if(last.bottom>f.top+2)issues.push('lesson end hidden behind footer');
     return issues;
    });layouts++;if(issues.length)failures.push({width,height,id:l.id,comfort,issues});
    const summaries=await page.$$eval('#demoPanel select',es=>es.every(e=>{
     const v=e.selectedOptions[0]?.textContent||'',s=e.nextElementSibling;
     return s?.classList.contains('select-value')&&(v.length<24||!e.value||(!s.hidden&&s.textContent===v));
    }));assert(summaries,`select label lesson ${l.id}`);selects++;
   }
  }
 }
 await page.setViewport({width:390,height:844});await page.$eval('#desktopLessons [data-open-lesson="14"]',e=>e.click());
 await page.$eval('.learning-bridge details',e=>e.open=true);await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:'docs/ai-agent/editorial-phone.png',fullPage:true});
 let slideLayouts=0,keyboardScroll=false;
 await page.goto(pathToFileURL(path.resolve('AI_agent_presentation.html')).href,{waitUntil:'networkidle0'});
 await page.addStyleTag({content:'.slides-container{transition:none!important}'});
 for(const [width,height] of [[320,568],[844,390]]){
  await page.setViewport({width,height});
  for(let i=0;i<42;i++){
   await page.evaluate(i=>window.agentLesson.goToSlide(i),i);
   const result=await page.$eval('.slide.active',e=>{
    e.scrollTop=e.scrollHeight;
    const r=e.getBoundingClientRect(),c=e.querySelector('.slide-content').getBoundingClientRect();
    return {horizontal:e.scrollWidth>e.clientWidth+2,hiddenBottom:c.bottom>r.bottom+2,overflow:e.scrollHeight>e.clientHeight+3};
   });slideLayouts++;
   if(result.horizontal||result.hiddenBottom)failures.push({slide:i+1,width,height,...result});
   if(result.overflow&&!keyboardScroll){
    await page.$eval('.slide.active',e=>e.scrollTop=0);await page.evaluate(()=>document.activeElement?.blur());
    await page.keyboard.press('ArrowDown');
    assert(await page.$eval('.slide.active',e=>e.scrollTop>0));keyboardScroll=true;
   }
  }
 }
 assert(keyboardScroll);
 assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);
 const report={layouts,slideLayouts,keyboardScroll,select_label_checks:selects,viewports:6,reading_modes:2,lessons:18,revised_quiz_migration:true,reading_preference_persistence:true,errors,failures};
 await fs.writeFile('docs/ai-agent/editorial-browser-validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await browser.close();}
