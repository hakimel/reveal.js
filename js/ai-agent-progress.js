/* Local-only progress validation, migration and portable export/import. */
(() => {
 const baseKey='agent-lab-interactive-v1';let key=baseKey;
 const setScope=userId=>{key=typeof userId==='string'&&userId?baseKey+'-user-'+encodeURIComponent(userId):baseKey;};
 const empty=()=>({version:2,lastLesson:null,completed:[],read:[],practiced:[],answers:{},motionPaused:false,practiceMode:'predict'});
 function normalize(input,lessons){
  if(!input||![1,2].includes(input.version)||!Array.isArray(input.completed)||!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))throw Error('ھۆججەتنىڭ تەرەققىيات قۇرۇلمىسى توغرا ئەمەس.');
  const s=empty(),ids=new Set(lessons.map(l=>l.id));
  const list=x=>Array.isArray(x)?[...new Set(x.filter(n=>ids.has(n)))]:[];
  s.lastLesson=ids.has(input.lastLesson)?input.lastLesson:null;s.read=list([...(Array.isArray(input.read)?input.read:[]),...input.completed]);s.practiced=list(input.practiced);s.motionPaused=input.motionPaused===true;s.practiceMode=input.practiceMode==='explore'?'explore':'predict';
  for(const l of lessons){const n=input.answers[l.id];if(Number.isInteger(n)&&n>=0&&n<l.quiz.choices.length)s.answers[l.id]=n;}
  s.completed=list(input.completed).filter(id=>s.practiced.includes(id)&&s.answers[id]===lessons.find(l=>l.id===id).quiz.correct);
  return s;
 }
 function load(lessons){let storageOK=true,migrated=false,s=empty();try{const raw=localStorage.getItem(key);if(raw){const data=JSON.parse(raw);s=normalize(data,lessons);migrated=data.version===1;if(migrated)localStorage.setItem(key+'-backup',raw);}}catch(e){storageOK=e.name==='SyntaxError'||e instanceof Error&&e.message.includes('قۇرۇلمىسى');}return {state:s,storageOK,migrated};}
 const save=s=>{try{localStorage.setItem(key,JSON.stringify(s));return true;}catch{return false;}};
 window.AgentLessonProgress={empty,normalize,load,save,setScope};
})();
