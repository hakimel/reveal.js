/* Local progress, account scopes, question revisions and portable export/import. */
(() => {
 const baseKey='agent-lab-interactive-v1';let key=baseKey;
 const setScope=userId=>{key=typeof userId==='string'&&userId?baseKey+'-user-'+encodeURIComponent(userId):baseKey;};
 const empty=()=>({version:2,lastLesson:null,completed:[],read:[],practiced:[],answers:{},quizRevisions:{},motionPaused:false,practiceMode:'predict',readingMode:'compact',focusMode:false,tutorialDone:false,tutorialStep:1,hintsSeen:{},mission:window.AgentLessonMission?.empty()||null,lastActivity:'lesson'});
 function normalize(input,lessons){
  if(!input||![1,2].includes(input.version)||!Array.isArray(input.completed)||!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))throw Error('ھۆججەتنىڭ تەرەققىيات قۇرۇلمىسى توغرا ئەمەس.');
  const s=empty(),ids=new Set(lessons.map(l=>l.id));
  const list=x=>Array.isArray(x)?[...new Set(x.filter(n=>ids.has(n)))]:[];
  s.lastLesson=ids.has(input.lastLesson)?input.lastLesson:null;
  s.read=list([...(Array.isArray(input.read)?input.read:[]),...input.completed]);
  s.practiced=list(input.practiced);s.motionPaused=input.motionPaused===true;
  s.practiceMode=input.practiceMode==='explore'?'explore':'predict';
  s.readingMode=input.readingMode==='comfort'?'comfort':'compact';
  s.focusMode=input.focusMode===true;s.tutorialDone=input.tutorialDone===true;
  s.tutorialStep=[1,2,3].includes(input.tutorialStep)?input.tutorialStep:1;
  s.lastActivity=input.lastActivity==='mission'?'mission':'lesson';
  s.mission=window.AgentLessonMission?.normalize(input.mission)||null;
  for(const l of lessons){const n=input.hintsSeen?.[l.id];if(Number.isInteger(n))s.hintsSeen[l.id]=Math.max(0,Math.min(n,l.learningSupport?.hints?.length||0));}

  for(const l of lessons){
   const n=input.answers[l.id],expected=l.quiz.revision||0,actual=input.quizRevisions?.[l.id]||0;
   if(Number.isInteger(n)&&n>=0&&n<l.quiz.choices.length&&expected===actual){s.answers[l.id]=n;s.quizRevisions[l.id]=expected;}
  }
  s.completed=list(input.completed).filter(id=>s.practiced.includes(id)&&s.answers[id]===lessons.find(l=>l.id===id).quiz.correct);
  return s;
 }
 function load(lessons){
  let storageOK=true,migrated=false,quizUpdated=false,s=empty();
  try{
   const raw=localStorage.getItem(key);
   if(raw){
    const data=JSON.parse(raw);s=normalize(data,lessons);migrated=data.version===1;
    quizUpdated=lessons.some(l=>Number.isInteger(data.answers?.[l.id])&&(data.quizRevisions?.[l.id]||0)!==(l.quiz.revision||0));
    if(migrated)localStorage.setItem(key+'-backup',raw);
    if(quizUpdated&&!localStorage.getItem(key+'-quiz-backup'))localStorage.setItem(key+'-quiz-backup',raw);
   }
  }catch(e){storageOK=e.name==='SyntaxError'||e instanceof Error&&e.message.includes('قۇرۇلمىسى');}
  return {state:s,storageOK,migrated,quizUpdated};
 }
 const save=s=>{try{localStorage.setItem(key,JSON.stringify(s));return true;}catch{return false;}};
 window.AgentLessonProgress={empty,normalize,load,save,setScope};
})();
