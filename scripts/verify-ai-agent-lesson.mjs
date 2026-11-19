import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const lessons=JSON.parse(await fs.readFile('assets/ai-agent/lessons.json','utf8'));
const url=pathToFileURL(path.resolve('AI_agent_lesson.html')).href;
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const page=await browser.newPage();
const errors=[],network=[],layouts=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
const tap=async selector=>{await page.$eval(selector,e=>e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'}));await new Promise(r=>setTimeout(r,70));await page.click(selector);};
const status=()=>page.$eval('.result-summary',e=>[...e.classList].find(c=>c.startsWith('status-')).slice(7));
const open=async id=>{await tap(`#desktopLessons [data-open-lesson="${id}"]`);await page.waitForSelector(`.lesson-page[data-lesson-id="${id}"]`);};
const set=async(id,value)=>{await page.$eval(`[data-demo-field="${id}"]`,(e,v)=>{if(e.type==='checkbox')e.checked=v;else e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);if(['TEXTAREA'].includes(await page.$eval(`[data-demo-field="${id}"]`,e=>e.tagName))||await page.$eval(`[data-demo-field="${id}"]`,e=>e.type)==='text')await new Promise(r=>setTimeout(r,350));};
const click=async action=>tap(`[data-demo-action="${action}"]`);
try{
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});await page.setOfflineMode(true);await page.goto(url,{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('20px Bahij')));checks.push('embedded local Uyghur font loads from file://');
 assert(await page.$('.home-page'));assert.equal(await page.$$eval('.home-lesson-card',s=>s.length),lessons.length);checks.push('home contains intro, 18 lessons and start');
 await page.screenshot({path:'docs/ai-agent/interactive-home.png'});
 await open(1);assert(await page.$('.prediction-placeholder'));await click('run');assert(await page.$('.prediction-placeholder'));await page.select('#predictionChoice','tool');await click('next');assert(await page.$('.result-summary'));assert(await page.$eval('#completeButton',e=>e.disabled));await page.select('#learningMode','explore');checks.push('prediction-first mode hides results until a choice and completion is gated');
 for(const l of lessons){
  await open(l.id);
  assert.equal(await page.$eval('html',e=>e.lang),'ug');assert.equal(await page.$eval('html',e=>e.dir),'rtl');
  assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--accent')),l.theme.accent);
  assert(await page.$eval('.result-reason',e=>e.textContent.length>10));
  assert.equal(await page.$eval('.toc-lesson[aria-current="step"]',e=>Number(e.dataset.openLesson)),l.id);
  if(l.demo.type==='memory')await click('store');else if(l.demo.type==='computer')await click('click');else await click('run');
  if(l.demo.type==='workflow')await page.waitForFunction(()=>document.querySelector('.result-summary').classList.contains('status-Completed'));
  const wrong=(l.quiz.correct+1)%l.quiz.choices.length;
  await tap(`#quizForm input[value="${wrong}"]`);await tap('#quizForm button[type="submit"]');assert(await page.$('#quizFeedback.is-incorrect'));assert((await page.$eval('#quizFeedback',e=>e.textContent)).includes(l.quiz.feedbackByChoice[wrong]));
  await tap(`#quizForm input[value="${l.quiz.correct}"]`);await tap('#quizForm button[type="submit"]');assert(await page.$('#quizFeedback.is-correct'));
  await tap('#completeButton');assert(await page.$eval('#completeButton',e=>e.disabled));
 }
 checks.push('all 18 themes, demos, wrong/right feedback and manual completion');
 await open(4);await set('request','{');assert.equal(await status(),'Failed');await tap('[data-demo-preset="0"]');assert.equal(await status(),'Completed');assert((await page.$eval('#demoOutput',e=>e.textContent)).includes('13.5'));
 await open(5);await set('document',false);await set('record',false);assert.equal(await status(),'Pending');await set('record',true);await set('question','date');assert.equal(await status(),'Pending');await set('question','hours');assert.equal(await status(),'Completed');
 await open(6);assert.equal(await status(),'Pending');await click('deny');assert.equal(await status(),'Denied');await click('reset');assert.equal(await status(),'Pending');await click('approve');assert.equal(await status(),'Completed');await set('permission',false);assert.equal(await status(),'Failed');
 await open(7);assert.equal(await status(),'Failed');await set('second','verify');await set('third','save');assert.equal(await status(),'Completed');await set('toolFailed',true);assert.equal(await status(),'Pending');
 await open(9);await set('actual','DEMO-A205');assert.equal(await status(),'Failed');assert(await page.$('.character-row .different'));await set('actual','');assert.equal(await status(),'Pending');await set('actual','DEMO-A204');await set('buggy',true);assert(await page.$('.test-fail'));
 await open(12);await set('unknown',true);assert.equal(await status(),'Completed');await set('debug',true);assert.equal(await status(),'Failed');
 await open(13);await set('target','persistent');await click('store');assert.equal(await status(),'Denied');await set('consent',true);await click('store');assert.equal(await page.$$eval('.memory-note',s=>s.length),1);await click('new-session');assert.equal(await page.$$eval('.memory-note',s=>s.length),1);await click('delete');assert.equal(await page.$$eval('.memory-note',s=>s.length),0);
 await open(15);await click('click');assert.equal(await status(),'Pending');await click('observe');assert.equal(await status(),'Completed');await set('outcome','failed');await click('click');await click('observe');assert.equal(await status(),'Failed');
 await open(16);await set('elapsed',5);assert.equal(await status(),'Failed');await set('cancelled',true);assert.equal(await status(),'Cancelled');await click('reset');await set('duplicate',true);assert((await page.$eval('.code-result',e=>e.textContent)).includes('"writes": 0'));
 await open(17);await set('tool','remote');assert.equal(await status(),'Failed');await open(18);await set('decision','obey');assert.equal(await status(),'Failed');
 checks.push('decision branches, Pending/Failed separation, approval/denial, reset, comparison tests, memory, GUI verification, deadline, locality and untrusted data');
 // Pause decoration and retain functional manual simulation controls.
 await tap('#motionButton');assert.equal(await page.$eval('#motionButton',e=>e.getAttribute('aria-pressed')),'true');
 await open(1);await click('next');assert((await page.$eval('.result-summary h3',e=>e.textContent)).includes('1 / 4'));assert.equal(await page.$eval('.result-summary h3 bdi',e=>e.dir),'ltr');await click('reset');await click('run');assert.equal(await status(),'Completed');
 // Restore a chosen final lesson, then open a second page to simulate closing/reopening.
 await open(11);await page.reload({waitUntil:'networkidle0'});assert.equal(await page.$eval('.lesson-page',e=>Number(e.dataset.lessonId)),11);assert.equal(await page.$eval('#desktopProgress',e=>e.textContent),'18 / 18');assert.equal(await page.$eval('#motionButton',e=>e.getAttribute('aria-pressed')),'true');
 const reopened=await browser.newPage();await reopened.setOfflineMode(true);await reopened.goto(url,{waitUntil:'networkidle0'});assert.equal(await reopened.$eval('.lesson-page',e=>Number(e.dataset.lessonId)),11);await reopened.close();checks.push('resume after reload and reopening, completed lessons and motion setting retained');
 // Layout, every lesson, desktop and phone; intentional code/table scrollers are contained.
 for(const [width,height] of [[1440,1000],[1280,720],[390,844],[360,800]]){
  await page.setViewport({width,height});
  for(const l of lessons){
   if(width<=760){await tap('#mobileMenuButton');await tap(`#mobileLessons [data-open-lesson="${l.id}"]`);}else await open(l.id);
   const issues=await page.evaluate(()=>{
    const result=[];if(document.documentElement.scrollWidth>innerWidth+2)result.push('page horizontal overflow');
    for(const q of ['.app-header','.lesson-heading','.demo-panel','.quiz-panel','#lessonFooter']){const r=document.querySelector(q).getBoundingClientRect();if(r.left < -2 || r.right > innerWidth+2)result.push(q+' outside viewport');}
    return result;
   });if(issues.length)layouts.push({width,height,id:l.id,issues});
  }
 }
 checks.push('18 lessons at 1440, 1280, 390 and 360 pixels; mobile contents closes on selection');
 await page.setViewport({width:390,height:844});await tap('#mobileMenuButton');await page.keyboard.press('Escape');assert.equal(await page.$eval('#mobileToc',e=>e.open),false);
 // Re-open a lesson through keyboard focus and activate a simulation button with Enter.
 await tap('#mobileMenuButton');await tap('#mobileLessons [data-open-lesson="1"]');await page.focus('[data-demo-action="next"]');await page.keyboard.press('Enter');assert((await page.$eval('.result-summary h3',e=>e.textContent)).includes('1 / 4'));
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);assert.equal(await page.$eval('.ambient-glow',e=>getComputedStyle(e).animationName),'none');await click('reset');await click('next');assert((await page.$eval('.result-summary h3',e=>e.textContent)).includes('1 / 4'));checks.push('keyboard controls, Escape, reduced motion and manual steps');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.$eval('.lesson-heading h1',e=>e.focus({preventScroll:true}));await page.screenshot({path:'docs/ai-agent/interactive-phone.png'});
 await page.setViewport({width:1440,height:1000});await open(9);await page.screenshot({path:'docs/ai-agent/interactive-lesson.png'});
 await page.$eval('#demoPanel',e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:'docs/ai-agent/interactive-demo.png'});
 // Storage-denied path still permits the entire course and gives an honest notice.
 const blocked=await browser.newPage();await blocked.setOfflineMode(true);await blocked.evaluateOnNewDocument(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});await blocked.goto(url,{waitUntil:'networkidle0'});assert(!(await blocked.$eval('#storageNotice',e=>e.hidden)));await blocked.click('#desktopLessons [data-open-lesson="4"]');assert(await blocked.$('.demo-panel'));await blocked.close();checks.push('storage unavailable fallback');
 assert.equal(network.length,0);assert.deepEqual(errors,[]);assert.deepEqual(layouts,[]);checks.push('direct file:// opening offline; zero HTTP requests and zero browser errors');
 const report={lessons:lessons.length,file_url_works:true,offline:true,http_requests:network,errors,layouts,checks};await fs.writeFile('docs/ai-agent/interactive-validation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}catch(error){console.log('AT FAILURE',await page.evaluate(()=>({lesson:document.querySelector('.lesson-page')?.dataset.lessonId,selected:document.querySelector('#quizForm input:checked')?.value,feedback:document.querySelector('#quizFeedback')?.outerHTML})));await page.screenshot({path:'/tmp/interactive-failure.png'});throw error;}finally{await browser.close();}
