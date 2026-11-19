import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('js/ai-agent-demos.js','utf8'),sandbox);
const {simulate,state,arithmetic,validateRequest}=sandbox.window.AgentLessonDemos;
const lessons=JSON.parse(fs.readFileSync('assets/ai-agent/lessons.json','utf8'));
const values=l=>Object.fromEntries(l.demo.fields.map(f=>[f.id,f.value]));
let assertions=0;
const check=(condition,message)=>{assert(condition,message);assertions++;};
const run=(id,changes={},action='run',s=state())=>{const lesson=lessons.find(l=>l.id===id);return simulate(lesson.demo,{...values(lesson),...changes},s,action);};
for(const l of lessons){const r=simulate(l.demo,values(l),state());check(Boolean(r.reason?.length),'Every demo explains its reason');check(Boolean(r.title),'Every demo names its outcome');check(Boolean(l.quiz.explanation),'Every quiz has feedback');check(l.demo.label==='مەشىق مىسالى','Added demo is marked');}
check(arithmetic('18*45/60')===13.5);check(arithmetic('-(2+3)/2')===-2.5);
for(const e of ['1/0','2**3','alert(1)','1.2.3','1e99','9'.repeat(121),'('.repeat(30)+'1'+')'.repeat(30)]){assert.throws(()=>arithmetic(e));assertions++;}
for(const e of ['{','[]','{"name":"unknown_tool","arguments":{}}','{"name":"safe_calculate","arguments":{"city":"Demo"}}','{"name":"safe_calculate","arguments":{"expression":"1+1","extra":1}}']){assert.throws(()=>validateRequest(e));assertions++;}
let s=state();for(let i=0;i<4;i++){const r=run(1,{},'next',s);check(r.status===(i===3?'Completed':'Pending'));}check(s.step===4);
check(run(2,{retry:true}).nodes[1].state==='active');check(run(3,{pattern:'multi'}).status==='Failed');check(run(3).status==='Completed');
check(run(4).code.result===13.5);check(run(4,{request:'{'}).status==='Failed');
check(run(5,{document:false,record:false}).status==='Pending');check(run(5,{question:'date'}).status==='Pending');check(run(5).status==='Completed');
s=state();check(run(6,{},'preview',s).status==='Pending');check(run(6,{},'deny',s).status==='Denied');check(run(6,{},'approve',s).status==='Completed');check(run(6,{permission:false},'approve',s).status==='Failed');
check(run(7).status==='Failed');check(run(7,{second:'verify',third:'save'}).status==='Completed');check(run(7,{second:'verify',third:'save',toolFailed:true}).status==='Pending');
check(run(8).status==='Pending');check(run(8,{unknown:true}).status==='Completed');
check(run(9).status==='Completed');check(run(9,{actual:'DEMO-A205'}).status==='Failed');check(run(9,{actual:''}).status==='Pending');check(run(9,{buggy:true}).tests.some(t=>!t.pass));check(run(9,{buggy:false}).tests.every(t=>t.pass));
check(run(10,{raw:true}).status==='Failed');check(run(10,{raw:false,failure:true}).code.status==='Failed');
check(run(11,{protocol:'A2A'}).status==='Failed');check(run(11,{protocol:'A2A',target:'agent'}).status==='Completed');check(run(11,{authorized:false}).status==='Denied');
check(run(12).status==='Failed');check(run(12,{unknown:true}).status==='Completed');check(run(12,{unknown:true,debug:true}).status==='Failed');check(run(12,{permission:false,unknown:true}).status==='Failed');
s=state();check(run(13,{target:'persistent'},'store',s).status==='Denied');run(13,{target:'persistent',consent:true},'store',s);check(s.persistent.length===1);run(13,{},'new-session',s);check(s.persistent.length===1&&s.working.length===0);run(13,{},'delete',s);check(s.persistent.length===0);run(13,{target:'working'},'store',s);check(s.working.length===1);run(13,{},'new-session',s);check(s.working.length===0);
check(run(14,{shared:false}).status==='Failed');check(run(14,{input:'invalid'}).panels.every(p=>p.body==='رەت قىلىندى'));
s=state();check(run(15,{},'click',s).status==='Pending');check(run(15,{},'observe',s).status==='Completed');s=state();run(15,{outcome:'failed'},'click',s);check(run(15,{outcome:'failed'},'observe',s).status==='Failed');check(run(15,{api:true}).status==='Completed');
check(run(16,{cancelled:true}).status==='Cancelled');check(run(16,{elapsed:5}).status==='Failed');check(run(16,{duplicate:true}).code.writes===0);check(run(16).code.total_records===1);
check(run(17).status==='Completed');for(const field of ['model','tool','logging'])check(run(17,{[field]:'remote'}).status==='Failed');
check(run(18).code.permissions_changed===false);check(run(18,{decision:'obey'}).status==='Failed');check(run(18,{decision:'obey'}).code.new_permission_granted===false);
console.log(JSON.stringify({assertions,lessons:lessons.length,network_calls:0,result:'passed'},null,2));
