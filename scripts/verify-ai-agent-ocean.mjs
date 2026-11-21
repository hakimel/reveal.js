import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const page=await browser.newPage(),errors=[],requests=[],issues=[],checks=[];
const url=pathToFileURL(path.resolve('AI_agent_lesson.html')).href;
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const click=async q=>{await page.$eval(q,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await page.click(q);};
try{
 await page.setOfflineMode(true);await page.setViewport({width:1440,height:1000});await page.goto(url+'#home',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);await wait(1100);
 assert.equal(await page.$$eval('.home-lesson-card',es=>es.length),18);assert.equal(await page.$$eval('.fisheye-orb',es=>es.length),1);assert(await page.$('.sea-nettle'));
 assert.equal(await page.$eval('.nettle-bell',e=>getComputedStyle(e).animationName),'nettle-pulse');
 assert.equal(await page.$eval('.home-intro',e=>getComputedStyle(e).fontSize),'12px');
 await page.focus('[data-pearl-listen]');await page.keyboard.press('Enter');
 assert.equal(await page.$eval('body',e=>e.dataset.agentState),'listening');assert((await page.$eval('[data-pearl-message]',e=>e.textContent)).includes('قوبۇل'));
 assert(await page.$('.pearl-responding'));checks.push('living nettle, glass orb, compact local-font text and keyboard-operated pearl feedback');
 await page.$eval('#desktopLessons [data-open-lesson="1"]',e=>e.click());
 assert.equal(await page.$eval('body',e=>e.dataset.agentState),'listening');
 await page.select('#predictionChoice','tool');await click('[data-demo-action="run"]');
 await page.waitForFunction(()=>document.body.dataset.agentState==='processing');await page.waitForFunction(()=>document.body.dataset.agentState==='completed');
 await wait(700);assert.equal(await page.$eval('body',e=>e.dataset.agentState),'completed');
 const correct=await page.$eval('#courseData',e=>JSON.parse(e.textContent).lessons[0].quiz.correct);
 await click(`#quizForm input[value="${(correct+1)%3}"]`);await click('#quizForm button');assert.equal(await page.$eval('body',e=>e.dataset.agentState),'blocked');
 await click(`#quizForm input[value="${correct}"]`);await click('#quizForm button');assert.equal(await page.$eval('body',e=>e.dataset.agentState),'completed');
 await click('#completeButton');await click('#homeButton');assert.equal(await page.$eval('[data-ocean-completed]',e=>e.textContent),'1');assert.equal(await page.$$eval('.depth-track .is-lit',es=>es.length),1);
 await page.reload({waitUntil:'networkidle0'});assert.equal(await page.$eval('[data-ocean-completed]',e=>e.textContent),'1');checks.push('agent states follow real simulation and quiz results; depth progress resumes after reload');
 await page.addStyleTag({content:'.ocean-visible{animation:none!important}'});
 let layouts=0;
 for(const [width,height] of [[1920,1080],[1440,900],[1280,720],[1024,768],[844,390],[768,1024],[760,800],[390,844],[360,640],[320,568]]){
  await page.setViewport({width,height});await wait(50);
  const problems=await page.evaluate(()=>{
   const problems=[];if(document.documentElement.scrollWidth>innerWidth+2)problems.push('document horizontal overflow');
   const header=document.querySelector('.app-header').getBoundingClientRect();
   for(const e of document.querySelectorAll('.home-bento>.ocean-card,.home-lesson-card,.course-path>div,.ocean-masthead')){
    const r=e.getBoundingClientRect();if(r.left< -2||r.right>innerWidth+2)problems.push(e.className+' outside viewport');
    if(!e.matches('.home-lesson-card')&&e.scrollWidth>e.clientWidth+3)problems.push(e.className+' clipped text');
    for(const text of e.querySelectorAll('strong,small')){const t=text.getBoundingClientRect();if(text.scrollWidth>text.clientWidth+3||t.left<r.left-2||t.right>r.right+2)problems.push('lesson title/summary clipped');}
   }
   const orb=document.querySelector('.fisheye-orb').getBoundingClientRect(),habitat=document.querySelector('.agent-habitat').getBoundingClientRect();
   if(orb.left<habitat.left||orb.right>habitat.right||orb.top<habitat.top||orb.bottom>habitat.bottom)problems.push('orb outside habitat');
   const cards=[...document.querySelectorAll('.home-bento>.ocean-card')].map(e=>e.getBoundingClientRect());
   for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){const a=cards[i],b=cards[j];if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2)problems.push('bento cards overlap');}
   if(header.height>innerHeight*.35)problems.push('header too tall');return problems;
  });layouts++;if(problems.length)issues.push({width,height,problems});
 }
 checks.push('home bento, glass orb and all lesson cards at ten viewports, including 320px and landscape');
 await page.setViewport({width:1440,height:1000});await page.evaluate(()=>scrollTo(0,0));
 const rect=await page.$eval('.agent-habitat',e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width*.75,y:r.y+r.height*.3};});await page.mouse.move(rect.x,rect.y);await wait(50);
 assert(await page.$eval('.agent-habitat',e=>e.style.getPropertyValue('--ocean-rx')!==''));
 await click('#motionButton');
 assert.equal(await page.$eval('.nettle-bell',e=>getComputedStyle(e).animationName),'none');assert.equal(await page.$eval('.ocean-rays',e=>getComputedStyle(e).animationName),'none');
 assert.equal(await page.$eval('.agent-habitat',e=>getComputedStyle(e).transform),'none');
 await click('[data-pearl-listen]');assert((await page.$eval('[data-pearl-message]',e=>e.textContent)).includes('قوبۇل'));
 await page.$eval('#desktopLessons [data-open-lesson="1"]',e=>e.click());await page.select('#predictionChoice','tool');await click('[data-demo-action="next"]');assert(await page.$('.result-summary'));
 await click('#motionButton');await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);assert.equal(await page.$eval('.nettle-bell',e=>getComputedStyle(e).animationName),'none');
 checks.push('pointer tilt resets when paused; pearl feedback and manual practice work without animation; OS reduced motion respected');
 assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const report={result:'passed',layouts,checks,issues,errors,http_requests:requests,offline:true,no_microphone:true};await fs.writeFile('docs/ai-agent/deep-sea/validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
}catch(e){console.log('DETAILS',JSON.stringify({issues,errors}));await page.screenshot({path:'/private/tmp/deep-sea-failure.png'});throw e;}finally{await browser.close();}
