/* Real SDK + synthetic OAuth redirects. Never signs in to a real Google account. */
import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
const root=process.cwd(),requests=[],errors=[],checks=[];
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(await fs.readFile(file));}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`,url=origin+'/AI_agent_lesson.html';
const b=await puppeteer.launch({headless:'shell',args:['--no-sandbox']});
const p=await b.newPage();await p.setCacheEnabled(false);await p.setRequestInterception(true);p.on('pageerror',e=>errors.push(e.message));
let enabled=false,networkFailure=false,uid='33333333-3333-4333-8333-333333333333',callbackProof=null;
const user=()=>({id:uid,aud:'authenticated',role:'authenticated',email:'google-learner@example.test',email_confirmed_at:'2026-11-21T00:00:00Z',created_at:'2026-11-21T00:00:00Z',app_metadata:{provider:'google',providers:['google']},user_metadata:{full_name:'<img src=x onerror=alert(1)>'},identities:[]});
const session=()=>{const enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url');return{access_token:enc({alg:'HS256',typ:'JWT'})+'.'+enc({sub:uid,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})+'.test',refresh_token:'synthetic-google-refresh',token_type:'bearer',expires_in:3600,user:user()};};
p.on('request',async req=>{try{
 const u=new URL(req.url());
 if(u.pathname.endsWith('/js/ai-agent-auth-config.js'))return req.respond({status:200,contentType:'text/javascript',body:`window.AgentLessonAuthConfig=${JSON.stringify({url:'https://synthetic.supabase.co',publishableKey:'sb_publishable_synthetic_test_key',google:true,emailPassword:false})}`});
 if(u.hostname==='synthetic.supabase.co'){
  const headers={'access-control-allow-origin':origin,'access-control-allow-headers':'authorization, apikey, content-type, x-client-info, x-supabase-api-version','access-control-allow-methods':'GET,POST,PUT,OPTIONS','x-supabase-api-version':'2024-01-01','access-control-expose-headers':'x-supabase-api-version'};
  if(req.method()==='OPTIONS')return req.respond({status:204,headers});
  const body=JSON.parse(req.postData()||'{}');requests.push({path:u.pathname,query:Object.fromEntries(u.searchParams),method:req.method(),body});
  if(u.pathname.endsWith('/settings')){if(networkFailure)return req.abort();return req.respond({status:200,headers,contentType:'application/json',body:JSON.stringify({external:{google:enabled,email:true}})});}
  if(u.pathname.endsWith('/authorize')){
   assert.equal(u.searchParams.get('provider'),'google');assert.equal(u.searchParams.get('redirect_to'),url);assert.equal(u.searchParams.get('code_challenge_method'),'s256');assert(u.searchParams.get('code_challenge'));assert.equal(u.searchParams.get('scopes'),'openid email profile');assert.equal(u.searchParams.get('prompt'),'select_account');callbackProof=u.searchParams.get('code_challenge');
   return req.respond({status:302,headers:{...headers,location:url+'?code=synthetic-google-auth-code'}});
  }
  if(u.pathname.endsWith('/token')){assert.equal(u.searchParams.get('grant_type'),'pkce');assert.equal(body.auth_code,'synthetic-google-auth-code');assert(body.code_verifier);return req.respond({status:200,headers,contentType:'application/json',body:JSON.stringify(session())});}
  if(u.pathname.endsWith('/user'))return req.respond({status:200,headers,contentType:'application/json',body:JSON.stringify(user())});
  if(u.pathname.endsWith('/logout'))return req.respond({status:204,headers});
  throw Error('Unexpected auth endpoint '+u.pathname);
 }
 if(u.origin!==origin&&u.protocol!=='data:')throw Error('Unexpected external request '+u.href);
 return req.continue();
}catch(e){errors.push(e.message);await req.abort();}});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function click(q){await p.$eval(q,e=>e.scrollIntoView({block:'center',behavior:'instant'}));await p.click(q);}
async function open(){await click('#accountButton');await p.waitForSelector('#authDialog[open]');}
try{
 await p.goto(url+'#lesson-1');await p.evaluate(()=>document.fonts.ready);await open();
 assert(await p.$eval('#authForm',e=>e.hidden));assert(await p.$eval('.auth-tabs',e=>e.hidden));assert(await p.$eval('#authForgotPassword',e=>e.hidden));assert.equal(await p.$eval('#authGoogleSection',e=>e.hidden),false);assert.equal(await p.$eval('#authGoogle',e=>e.disabled),false);checks.push('Google is the primary option; SMTP-dependent email forms are hidden');
 await click('#authGoogle');await p.waitForFunction(()=>document.querySelector('#authMessage').textContent.includes('تېخى تەييار بولمىدى'));assert.equal(new URL(p.url()).origin,origin);assert.equal(requests.filter(r=>r.path.endsWith('/authorize')).length,0);checks.push('Disabled provider stays on the lesson with a clear translated message');
 networkFailure=true;await click('#authGoogle');await p.waitForFunction(()=>document.querySelector('#authGoogle').disabled===false);assert.equal(new URL(p.url()).origin,origin);assert(await p.$eval('#authMessage',e=>e.dataset.kind==='error'));networkFailure=false;checks.push('Network failure restores the Google button without redirecting');
 for(const width of[1440,390,360]){await p.setViewport({width,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert(await p.$eval('#authDialog',e=>e.getBoundingClientRect().width<=innerWidth));if(width===390)await p.screenshot({path:'docs/ai-agent/google-signin-mobile.png'});}checks.push('Compact Google dialog fits desktop and both phone sizes');
 enabled=true;await click('#authGoogle');await p.waitForFunction(()=>window.AgentLessonAuth?.currentUser?.id==='33333333-3333-4333-8333-333333333333');assert(callbackProof);assert(!new URL(p.url()).searchParams.has('code'));assert.equal(await p.$eval('#accountButton',e=>e.textContent),'ھېساباتىم');assert(requests.some(r=>r.path.endsWith('/token')&&r.body.code_verifier));checks.push('Official SDK completes Google authorize → PKCE exchange → session restoration');
 await open();assert(await p.$eval('#authChangePassword',e=>e.hidden));assert.equal(await p.$eval('#authAccountEmail',e=>e.textContent),'google-learner@example.test');await p.keyboard.press('Escape');await p.evaluate(()=>location.hash='lesson-3');await wait(100);assert(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1-user-33333333-3333-4333-8333-333333333333')).read.includes(3)));
 await p.reload();await p.waitForFunction(()=>window.AgentLessonAuth?.currentUser?.id==='33333333-3333-4333-8333-333333333333');await open();await click('#authSignout');await p.waitForFunction(()=>!window.AgentLessonAuth.currentUser);assert.equal(await p.$eval('#authForm',e=>e.hidden),true);assert.equal(await p.$eval('#authGoogleSection',e=>e.hidden),false);assert(!(await p.evaluate(()=>JSON.parse(localStorage.getItem('agent-lab-interactive-v1')).read.includes(3))));checks.push('Google account progress survives reload and remains separate from guest progress');
 assert.equal(requests.some(r=>/signup|recover/.test(r.path)),false);assert.deepEqual(errors,[]);checks.push('No email/password signup, recovery, SMTP request, or real Google login occurs in tests');
 const report={result:'passed',provider:'synthetic Google OAuth + real bundled Supabase SDK',checks,authRequests:requests.length,errors};await fs.writeFile('docs/ai-agent/google-auth-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}catch(e){await p.screenshot({path:'/private/tmp/ai-agent-google-auth-failure.png'});console.log(await p.evaluate(()=>({url:location.href,message:document.querySelector('#authMessage')?.textContent})));throw e;}
finally{await b.close();await new Promise(resolve=>server.close(resolve));}
