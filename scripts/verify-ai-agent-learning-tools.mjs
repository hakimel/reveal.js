import puppeteer from 'puppeteer';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import{pathToFileURL}from'node:url';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});const p=await browser.newPage(),errors=[],requests=[],checks=[],issues=[];const url=pathToFileURL(path.resolve('AI_agent_lesson.html')).href;
p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=async q=>{await p.$eval(q,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(40);await p.click(q);};
const open=async id=>p.$eval(`#desktopLessons [data-open-lesson="${id}"]`,e=>e.click());
const choose=async(name,value)=>click(`#missionForm input[name="${name}"][value="${value}"]`);
const submit=()=>click('#missionForm button[type=submit]');
const step=()=>p.$eval('#missionForm',e=>Number(e.dataset.missionStep));
const result=()=>p.$eval('.mission-result pre code',e=>JSON.parse(e.textContent));
try{
 await fs.mkdir('docs/ai-agent/learning-tools',{recursive:true});await p.setOfflineMode(true);await p.setViewport({width:1440,height:1000});await p.goto(url+'#home',{waitUntil:'networkidle0'});await p.evaluate(()=>document.fonts.ready);
 assert(await p.$('.first-visit-guide'));assert.equal(await p.$eval('.tour-topline>span:last-child',e=>e.textContent),'1 / 3');
 await click('[data-tour-next]');await click('[data-tour-next]');assert.equal(await p.$eval('.tour-topline>span:last-child',e=>e.textContent),'3 / 3');await click('[data-tour-next]');assert.equal(await p.$eval('.lesson-page',e=>e.dataset.lessonId),'1');
 assert.equal(await p.$$eval('.hint-list li',es=>es.length),0);
 await p.focus('.hint-dock .listening-pearl');await p.keyboard.press('Enter');assert.equal(await p.$$eval('.hint-list li',es=>es.length),1);
 await click('.hint-dock>.text-button');assert.equal(await p.$$eval('.hint-list li',es=>es.length),2);await click('.hint-dock>.text-button');assert.equal(await p.$$eval('.hint-list li',es=>es.length),3);assert(await p.$eval('.hint-dock>.text-button',e=>e.disabled));
 await p.reload({waitUntil:'networkidle0'});assert.equal(await p.$$eval('.hint-list li',es=>es.length),3);checks.push('three-step first visit, keyboard pearl hints revealed individually and saved per lesson');
 await click('[data-focus-toggle]');assert(await p.$('body.focus-mode'));assert.equal(await p.$eval('.nettle-bell',e=>getComputedStyle(e).animationPlayState),'paused');assert.equal(await p.$eval('#motionButton',e=>e.getAttribute('aria-pressed')),'false');await p.reload({waitUntil:'networkidle0'});assert(await p.$('body.focus-mode'));await click('[data-focus-toggle]');assert(!(await p.$('body.focus-mode')));checks.push('focus setting persists, pauses decoration and leaves the motion preference separate');
 await click('#homeButton');assert(!(await p.$('.first-visit-guide')));assert((await p.$eval('.resume-learning',e=>e.textContent)).includes('تەجرىبىنى'));await click('.resume-learning [data-resume-learning]');assert.equal(await p.evaluate(()=>document.activeElement.id),'demoHeading');
 await click('#motionButton');await p.select('#predictionChoice','tool');await click('[data-demo-action="run"]');await click('#homeButton');assert((await p.$eval('.resume-learning',e=>e.textContent)).includes('سوئالىغا'));
 await click('.resume-learning [data-resume-learning]');assert.equal(await p.evaluate(()=>document.activeElement.id),'quizHeading');const answer=await p.$eval('#courseData',e=>JSON.parse(e.textContent).lessons[0].quiz.correct);await click(`#quizForm input[value="${answer}"]`);await click('#quizForm button');await click('#homeButton');assert((await p.$eval('.resume-learning',e=>e.textContent)).includes('تاماملاندى'));await click('.resume-learning [data-resume-learning]');assert.equal(await p.evaluate(()=>document.activeElement.id),'completeButton');await click('#completeButton');await click('#homeButton');assert((await p.$eval('.resume-learning h2',e=>e.textContent)).includes('رامكا'));checks.push('continue card targets practice, quiz, completion and then the next unfinished lesson');
 await click('[data-tour-open]');assert(await p.$('.first-visit-guide'));await click('[data-tour-skip]');await p.reload({waitUntil:'networkidle0'});assert(!(await p.$('.first-visit-guide')));
 await p.$eval('[data-open-mission]',e=>e.click());assert.equal(await step(),1);assert.equal((await result()).hours,null);
 await choose('tool','model');await submit();assert.equal((await result()).status,'Failed');assert.equal(await step(),1);assert.equal((await result()).writes_this_run,0);
 await choose('tool','calculator');await submit();assert.equal(await step(),2);await p.reload({waitUntil:'networkidle0'});assert.equal(await step(),2);
 await choose('source','verified');await choose('instruction','ignore');await p.$eval('[name=actualId]',e=>e.value='DEMO-A205');await submit();assert.equal((await result()).status,'Failed');assert.equal(await step(),2);
 await p.$eval('[name=actualId]',e=>e.value='DEMO-A204');await choose('instruction','obey');await submit();assert.equal((await result()).status,'Failed');
 await choose('instruction','ignore');await submit();assert.equal(await step(),3);await choose('approval','deny');await submit();assert.equal((await result()).status,'Denied');assert.equal((await result()).writes_this_run,0);assert.equal(await step(),3);
 await choose('approval','approve');await submit();assert.equal(await step(),4);await choose('finish','assume');await submit();assert.equal((await result()).status,'Failed');await choose('finish','retry');await submit();assert(await p.$('.mission-success'));assert.equal((await result()).status,'Completed');assert.equal((await result()).writes_this_run,1);
 await click('[data-mission-verify]');assert.equal((await result()).writes_this_run,0);await p.reload({waitUntil:'networkidle0'});assert(await p.$('.mission-success'));assert.equal((await result()).writes_this_run,0);assert.equal(await p.$eval('#desktopProgress',e=>e.textContent),'1 / 18');checks.push('resumable mission: tool failure, exact comparison, injection, denial, timeout recovery, verification and duplicate prevention');
 const download=await fs.mkdtemp('/tmp/agent-mission-export-'),cdp=await p.createCDPSession();await cdp.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:download});await click('[data-mission-export]');let file=path.join(download,'agent-mission-result.json');for(let i=0;i<30;i++){try{await fs.access(file);break;}catch{await wait(100);}}const exported=JSON.parse(await fs.readFile(file));assert(exported.simulation&&exported.completed);assert.equal(exported.writes,0);checks.push('mission results export contains simulated status and trace');
 await p.select('#missionScenario','success');assert.equal(await step(),1);await choose('tool','calculator');await submit();await choose('source','verified');await choose('instruction','ignore');await submit();await choose('approval','approve');await submit();await choose('finish','retry');await submit();assert.equal((await result()).status,'Failed');await choose('finish','verify');await submit();assert(await p.$('.mission-success'));checks.push('direct-success scenario requires read-back instead of unnecessary retry');
 // All new panels must fit both compact and comfort mode on narrow/short screens.
 let layouts=0;
 for(const [width,height] of [[1440,1000],[1024,640],[844,390],[390,844],[360,640],[320,568]]){
  await p.setViewport({width,height});
  for(const route of ['home','lesson','mission']){
   if(route==='home'){await click('#homeButton');await p.$eval('[data-tour-open]',e=>e.click());}
   if(route==='lesson')await open(18);
   if(route==='mission'){await p.$eval('[data-open-mission]',e=>e.click());await p.select('#missionScenario','timeout');await choose('tool','calculator');await submit();}
   for(const comfort of [false,true]){
    await p.evaluate(c=>document.body.classList.toggle('reading-comfort',c),comfort);await wait(40);
    const bad=await p.evaluate(()=>{
     const bad=[];if(document.documentElement.scrollWidth>innerWidth+2)bad.push('document overflow');
     for(const e of document.querySelectorAll('.resume-learning,.first-visit-guide,.hint-dock,.mission-teaser,.mission-workspace,.mission-result,.mission-settings,.mission-stage-list')){const r=e.getBoundingClientRect();if(r.left< -2||r.right>innerWidth+2)bad.push(e.className+' outside');if(e.scrollWidth>e.clientWidth+3)bad.push(e.className+' clipped');}
     if(document.querySelector('.app-header').getBoundingClientRect().height>innerHeight*.4)bad.push('header too tall');return bad;
    });layouts++;if(bad.length)issues.push({width,height,route,comfort,bad});
   }
  }
 }
 await p.setViewport({width:390,height:844});await p.evaluate(()=>{document.body.classList.remove('reading-comfort');scrollTo(0,0);});await p.screenshot({path:'docs/ai-agent/learning-tools/mission-phone.png',fullPage:true});await click('#homeButton');await p.screenshot({path:'docs/ai-agent/learning-tools/home-phone.png',fullPage:true});await p.setViewport({width:1440,height:1000});await open(9);await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'docs/ai-agent/learning-tools/lesson-desktop.png'});
 await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);assert.equal(await p.$eval('.nettle-bell',e=>getComputedStyle(e).animationName),'none');await click('.hint-dock>.text-button');assert.equal(await p.$$eval('.hint-list li',es=>es.length),1);checks.push('new home, hint and mission panels fit six viewports in both reading modes; reduced-motion hints remain usable');
 assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);const report={result:'passed',layouts,checks,issues,errors,http_requests:requests,offline:true};await fs.writeFile('docs/ai-agent/learning-tools/browser-validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}catch(e){console.log('FAIL',await p.evaluate(()=>({hash:location.hash,stage:document.querySelector('#missionForm')?.dataset.missionStep,error:document.querySelector('.mission-reason')?.textContent})),issues,errors);await p.screenshot({path:'/private/tmp/agent-learning-tools-failure.png'});throw e;}finally{await browser.close();}
