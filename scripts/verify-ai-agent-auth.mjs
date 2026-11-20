/* Exercise the official SDK against intercepted synthetic Auth responses; no real email is sent. */
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),errors=[],requests=[],checks=[];
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep))throw Error();const body=await fs.readFile(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(body);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`,url=origin+'/AI_agent_lesson.html';
const browser=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
let configured=false,rejectedKey=false,rateLimited=false,activeEmail='one@example.test';
const user=()=>({id:activeEmail.startsWith('two')?'22222222-2222-4222-8222-222222222222':'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',email:activeEmail,email_confirmed_at:'2026-11-20T00:00:00Z',created_at:'2026-11-20T00:00:00Z',app_metadata:{provider:'email',providers:['email']},user_metadata:{display_name:'<img src=x onerror=alert(1)>'},identities:[]});
const jwt=()=>{const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url');return enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:user().id,aud:'authenticated',role:'authenticated',email:activeEmail,exp:Math.floor(Date.now()/1000)+3600,iat:Math.floor(Date.now()/1000)})+'.mock-signature';};
const session=()=>({access_token:jwt(),refresh_token:'synthetic-refresh-token',token_type:'bearer',expires_in:3600,user:user()});
const p=await browser.newPage();await p.setCacheEnabled(false);p.on('pageerror',e=>errors.push(e.message));await p.setRequestInterception(true);
p.on('request',async req=>{
 try{
  const u=new URL(req.url());
  if(u.pathname.endsWith('/js/ai-agent-auth-config.js'))return req.respond({status:200,contentType:'text/javascript',body:`window.AgentLessonAuthConfig=${JSON.stringify({url:configured?'https://synthetic.supabase.co':'',publishableKey:rejectedKey?'sb_secret_rejected':'sb_publishable_synthetic_test_key'})}`});
  if(u.hostname==='synthetic.supabase.co'){
   const headers={'access-control-allow-origin':origin,'access-control-allow-headers':'authorization, apikey, content-type, x-client-info, x-supabase-api-version','access-control-allow-methods':'GET,POST,PUT,OPTIONS','x-supabase-api-version':'2024-01-01','access-control-expose-headers':'x-supabase-api-version'};
   if(req.method()==='OPTIONS')return req.respond({status:204,headers});
   const body=JSON.parse(req.postData()||'{}');requests.push({path:u.pathname,query:u.search,method:req.method(),body});
   let status=200,result={};
   if(u.pathname.endsWith('/signup')){if(rateLimited){status=429;result={code:'over_email_send_rate_limit',msg:'Rate limited'};}else{activeEmail=body.email;result=user();}}
   else if(u.pathname.endsWith('/token')){if(body.password==='WrongPassword123'){status=400;result={code:'invalid_credentials',msg:'Invalid login credentials'};}else{activeEmail=body.email||'one@example.test';result=session();}}
   else if(u.pathname.endsWith('/user'))result=user();
   else if(u.pathname.endsWith('/logout'))status=204;
   return req.respond({status,headers,contentType:'application/json',body:status===204?'':JSON.stringify(result)});
  }
  if(u.origin!==origin&&u.protocol!=='file:'&&u.protocol!=='data:')throw Error('Unexpected external request '+u.href);
  return req.continue();
 }catch(e){errors.push(e.message);await req.abort();}
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function click(q){await p.$eval(q,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.click(q);}
async function fill(q,value){await p.$eval(q,(e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));},value);}
async function text(q){return p.$eval(q,e=>e.textContent);}
async function opened(){await click('#accountButton');await p.waitForSelector('#authDialog[open]');}
async function idle(){await p.waitForFunction(()=>document.querySelector('#authForm').getAttribute('aria-busy')==='false');}
try{
 await p.goto(url+'#lesson-1');await p.evaluate(()=>document.fonts.ready);await opened();assert(await p.$eval('#authSubmit',e=>e.disabled));assert((await text('#authUnavailable')).includes('تېخى ئۇلانمىدى'));await p.keyboard.press('Escape');assert.equal(requests.length,0);checks.push('Unconfigured auth cannot submit; offline guest lesson stays usable');
 configured=true;await p.goto(url+'?test=configured#lesson-1');await opened();await click('#authSignupTab');
 await fill('#authName','Test learner');await fill('#authEmail','one@example.test');await fill('#authPassword','TestPassword123');await fill('#authConfirm','DifferentPassword123');await click('#authSubmit');assert.equal(requests.length,0);assert.equal(await p.$eval('#authConfirm',e=>e.checkValidity()),false);
 await fill('#authConfirm','TestPassword123');await click('#authSubmit');await idle();assert(requests.some(r=>r.path.endsWith('/signup')&&r.body.code_challenge_method==='s256'));assert((await text('#authMessage')).includes('جەزملەشتۈرۈڭ'));assert.equal(await text('#accountButton'),'كىرىش / تىزىملىتىش');checks.push('Sign-up uses PKCE, validates confirmation, and requires email confirmation');
 await fill('#authEmail','one@example.test');await fill('#authPassword','WrongPassword123');await click('#authSubmit');await idle();assert((await text('#authMessage')).includes('توغرا ئەمەس'));assert.equal(await p.$eval('#authPassword',e=>e.value),'');
 await fill('#authPassword','TestPassword123');await click('#authSubmit');await idle();await p.waitForFunction(()=>window.AgentLessonAuth.currentUser?.id==='11111111-1111-4111-8111-111111111111');assert.equal(await text('#accountButton'),'ھېساباتىم');assert.equal(await text('#authAccountEmail'),'one@example.test');assert.equal(await p.$eval('#authName',e=>e.value),'Test learner');checks.push('Sign-in rejects wrong password and accepts a server-confirmed session');
 await p.keyboard.press('Escape');await p.evaluate(()=>location.hash='lesson-2');await wait(100);assert(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1-user-11111111-1111-4111-8111-111111111111')).read.includes(2)));
 await p.reload();await p.waitForFunction(()=>window.AgentLessonAuth.currentUser?.id==='11111111-1111-4111-8111-111111111111');await opened();await click('#authSignout');await idle();await p.waitForFunction(()=>!window.AgentLessonAuth.currentUser);assert(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1')).read.includes(1)));assert(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1')).read.includes(2))));checks.push('Session restores on reload; sign-out restores separate guest progress');
 await fill('#authEmail','two@example.test');await fill('#authPassword','TestPassword123');await click('#authSubmit');await idle();await p.waitForFunction(()=>window.AgentLessonAuth.currentUser?.email==='two@example.test');assert(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1-user-22222222-2222-4222-8222-222222222222')||'{"read":[]}').read.includes(2))));await click('#authSignout');await idle();checks.push('A second account does not inherit the first account’s progress');
 await click('#authForgotPassword');await fill('#authEmail','one@example.test');await click('#authSubmit');await idle();assert(requests.some(r=>r.path.endsWith('/recover')&&r.body.code_challenge));assert((await text('#authMessage')).includes('ئەگەر'));
 await p.goto(url+'?code=synthetic-recovery-code');await p.waitForFunction(()=>document.querySelector('#authDialog').open&&document.querySelector('#authTitle').textContent==='يېڭى پارول بەلگىلەش');assert(!new URL(p.url()).searchParams.has('code'));await fill('#authPassword','UpdatedPassword123');await fill('#authConfirm','UpdatedPassword123');await click('#authSubmit');await idle();assert(requests.some(r=>r.path.endsWith('/user')&&r.method==='PUT'&&r.body.password==='UpdatedPassword123'));assert((await text('#authMessage')).includes('يېڭىلاندى'));checks.push('Password reset exchanges a PKCE code and updates through the authenticated SDK');
 const stored=await p.evaluate(()=>Object.values(localStorage).join(''));for(const secret of ['TestPassword123','WrongPassword123','UpdatedPassword123'])assert(!stored.includes(secret));checks.push('No submitted password is stored in browser storage');
 await click('#authSignout');await idle();await click('#authSignupTab');rateLimited=true;await fill('#authEmail','one@example.test');await fill('#authPassword','TestPassword123');await fill('#authConfirm','TestPassword123');await click('#authSubmit');await idle();assert((await text('#authMessage')).includes('بەك كۆپ'));rateLimited=false;checks.push('Provider rate limits receive a translated error');
 for(const width of[1440,390,360]){await p.setViewport({width,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert(await p.$eval('#authDialog',e=>e.getBoundingClientRect().width<=innerWidth));if(width===390)await p.screenshot({path:'docs/ai-agent/auth-mobile.png'});}await p.keyboard.press('Escape');assert.equal(await p.$eval('#authDialog',e=>e.open),false);checks.push('Keyboard close and responsive forms at 1440, 390 and 360px');
 rejectedKey=true;const previous=requests.length;await p.reload();await opened();assert(await p.$eval('#authSubmit',e=>e.disabled));assert.equal(requests.length,previous);checks.push('Secret-key configuration is rejected before SDK initialization');
 assert.deepEqual(errors,[]);const report={result:'passed',sdk:'@supabase/supabase-js 2.119.2',provider:'intercepted synthetic Auth API; no live accounts or emails',checks,authRequests:requests.length,errors};await fs.writeFile('docs/ai-agent/auth-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){await p.screenshot({path:'/private/tmp/ai-agent-auth-failure.png'});console.log('UI failure:',await p.evaluate(()=>({title:document.querySelector('#authTitle')?.textContent,message:document.querySelector('#authMessage')?.textContent,ready:document.querySelector('#authUnavailable')?.textContent,open:document.querySelector('#authDialog')?.open})));throw e;}
finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
