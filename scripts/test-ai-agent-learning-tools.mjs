import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const store=new Map(),ctx={window:{},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};vm.createContext(ctx);
for(const f of ['ai-agent-mission.js','ai-agent-progress.js'])vm.runInContext(fs.readFileSync('js/'+f,'utf8'),ctx);
const m=ctx.window.AgentLessonMission,p=ctx.window.AgentLessonProgress,lessons=JSON.parse(fs.readFileSync('assets/ai-agent/lessons.json'));
let checks=0;const eq=(a,b)=>{assert.equal(a,b);checks++;};
let s=m.empty(),r=m.evaluate(s);eq(r.step,1);eq(r.status,'Pending');eq(r.hours,null);eq(r.writes,0);
s.tool='model';eq(m.evaluate(s).status,'Failed');eq(m.evaluate(s).hours,null);
s.tool='calculator';eq(m.evaluate(s).step,2);eq(m.evaluate(s).hours,13.5);
s.source='verified';s.instruction='ignore';
for(const id of ['DEMO-A205','DEMO-a204','DEMO-A204 ','DEMO-A204x']){s.actualId=id;r=m.evaluate(s);eq(r.step,2);eq(r.status,'Failed');eq(r.writes,0);}
s.actualId='';eq(m.evaluate(s).status,'Pending');s.actualId='DEMO-A204';s.source='draft';eq(m.evaluate(s).status,'Failed');s.source='verified';s.instruction='obey';eq(m.evaluate(s).status,'Failed');s.instruction='ignore';eq(m.evaluate(s).step,3);
s.approval='deny';eq(m.evaluate(s).status,'Denied');eq(m.evaluate(s).writes,0);s.approval='approve';eq(m.evaluate(s).step,4);eq(m.evaluate(s).status,'Pending');
s.finish='assume';eq(m.evaluate(s).status,'Failed');s.finish='verify';eq(m.evaluate(s).status,'Failed');s.finish='retry';r=m.evaluate(s);eq(r.completed,true);eq(r.writes,1);eq(r.trace.filter(t=>t.status==='Failed').length,1);s.receipt=true;eq(m.evaluate(s).writes,0);
s.tool='model';eq(m.evaluate(s).completed,false);eq(m.evaluate(s).writes,0);s.tool='calculator';s.approval='deny';eq(m.evaluate(s).status,'Denied');eq(m.evaluate(s).writes,0);
s={...s,scenario:'success',approval:'approve',receipt:false,finish:'retry'};eq(m.evaluate(s).status,'Failed');s.finish='verify';eq(m.evaluate(s).completed,true);eq(m.evaluate(s).trace.filter(t=>t.status==='Failed').length,0);eq(m.evaluate(s).writes,1);
for(const step of [1,2,3]){const back=m.rewind(s,step);eq(m.evaluate(back).step,step);eq(back.receipt,false);eq(m.evaluate(back).writes,0);}
const unsafe=m.normalize({scenario:'unknown',actualId:'x'.repeat(999),tool:'malicious',receipt:'yes'});eq(unsafe.actualId.length,40);eq(unsafe.tool,'');eq(unsafe.receipt,false);
for(const l of lessons){eq(l.learningSupport.hints.length,3);eq(l.learningSupport.hints.every(h=>typeof h==='string'&&h.length>20),true);}
const saved={...p.empty(),lastLesson:9,lastActivity:'mission',focusMode:true,tutorialDone:true,tutorialStep:3,hintsSeen:{1:999,9:2,77:1},mission:s};const normalized=p.normalize(saved,lessons);eq(normalized.hintsSeen[1],3);eq(normalized.hintsSeen[9],2);eq(normalized.hintsSeen[77],undefined);eq(normalized.focusMode,true);eq(normalized.tutorialDone,true);eq(normalized.lastActivity,'mission');eq(m.evaluate(normalized.mission).completed,true);
p.setScope('learner-a');p.save(normalized);p.setScope('learner-b');eq(p.load(lessons).state.focusMode,false);eq(Object.keys(p.load(lessons).state.hintsSeen).length,0);eq(m.evaluate(p.load(lessons).state.mission).completed,false);p.setScope('learner-a');eq(p.load(lessons).state.hintsSeen[9],2);eq(p.load(lessons).state.tutorialDone,true);
const legacy=p.normalize({version:2,completed:[],answers:{},read:[4]},lessons);eq(legacy.read[0],4);eq(legacy.tutorialDone,false);eq(legacy.focusMode,false);
const report={checks,mission_paths:true,progress_roundtrip:true,account_scope:true,result:'passed'};fs.mkdirSync('docs/ai-agent/learning-tools',{recursive:true});fs.writeFileSync('docs/ai-agent/learning-tools/unit-validation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
