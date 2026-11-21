/* A deterministic capstone. No model, service or real file write. */
(() => {
 'use strict';
 const empty=()=>({scenario:'timeout',tool:'',actualId:'DEMO-A204',source:'',instruction:'',approval:'',finish:'',receipt:false});
 const pick=(v,allowed)=>allowed.includes(v)?v:'';
 function normalize(input){
  const s=empty();if(!input||typeof input!=='object')return s;
  s.scenario=input.scenario==='success'?'success':'timeout';s.tool=pick(input.tool,['calculator','model']);
  s.actualId=typeof input.actualId==='string'?input.actualId.slice(0,40):s.actualId;
  s.source=pick(input.source,['verified','draft']);s.instruction=pick(input.instruction,['ignore','obey']);
  s.approval=pick(input.approval,['approve','deny']);s.finish=pick(input.finish,['verify','retry','assume']);
  s.receipt=input.receipt===true;
  // Downstream choices never bypass an upstream gate, including imported drafts.
  return s;
 }
 function evaluate(input){
  const s=normalize(input),trace=[];
  const result=(step,status,reason,extra={})=>({step,status,reason,trace:[...trace],hours:trace.some(t=>t.step===1&&t.status==='Completed')?13.5:null,writes:0,completed:false,...extra});
  if(!s.tool)return result(1,'Pending','دەرس سانى ۋە ھەر دەرسنىڭ ۋاقتى بېرىلدى. ئالدى بىلەن ھېسابلاش ئۇسۇلىنى تاللاڭ.');
  if(s.tool!=='calculator')return result(1,'Failed','مودېلنىڭ پەرەزى ھېسابلاش دەلىلى ئەمەس. ئېنىق ھېسابلاش قورالى بىلەن سان ۋە بىرلىكنى تەكشۈرۈڭ.');
  trace.push({step:1,status:'Completed',detail:'18 × 45 ÷ 60 = 13.5 hours'});
  if(!s.actualId||!s.source||!s.instruction)return result(2,'Pending','بەلگە، مەنبە ۋە ھۆججەت ئىچىدىكى كۆرسەتمىنى قانداق بىر تەرەپ قىلىدىغانلىقىڭىزنى تولدۇرۇڭ.');
  if(s.actualId!=='DEMO-A204')return result(2,'Failed','بەلگە تولۇق ماس كەلمىدى. بىرلا ھەرپ ياكى رەقەم پەرقىمۇ باشقا خاتىرىنى كۆرسىتىشى مۇمكىن؛ ھازىرچە ساقلاشقا ئۆتۈلمەيدۇ.');
  if(s.source!=='verified')return result(2,'Failed','دەسلەپكى قەغەزدىكى سان دەلىللەنمىگەن. يېڭىلانغان دەلىللەنگەن مەنبە بىلەن ھېسابنى سېلىشتۇرۇڭ.');
  if(s.instruction!=='ignore')return result(2,'Failed','ھۆججەتتىكى پاكىتنى ئىشلىتىشكە بولىدۇ، ئەمما ئۇنىڭ ئىچىدىكى بۇيرۇق ئاگېنتنىڭ ھوقۇقىنى ئۆزگەرتەلمەيدۇ.');
  trace.push({step:2,status:'Completed',detail:'DEMO-A204 · verified source · untrusted instruction ignored'});
  if(!s.approval)return result(3,'Pending','دەلىل تەكشۈرۈلدى. پىلاننى ساقلاشتىن بۇرۇن شۇ مەزمۇن ئۈچۈن ئېنىق تەستىق كېرەك.');
  if(s.approval==='deny')return result(3,'Denied','تەستىق رەت قىلىندى، شۇڭا ھېچقانداق خاتىرە يېزىلمىدى. بۇ ھوقۇق چېگراسىنىڭ توغرا ئىشلىگەنلىكىنى كۆرسىتىدۇ.');
  trace.push({step:3,status:'Completed',detail:'Approved: DEMO-A204 · 13.5 hours'});
  if(!s.finish)return result(4,'Pending',s.scenario==='timeout'?'ساقلاش جاۋابى ۋاقىت چېكىدە كەلمىدى. قايتا يېزىشتىن بۇرۇن ئوخشاش مەشغۇلات بەلگىسى بىلەن ئىجرا خاتىرىسىنى تەكشۈرۈڭ.':'ساقلاش قورالى مۇۋەپپەقىيەت ھالىتى قايتۇردى. ئاخىرقى جاۋابتىن بۇرۇن خاتىرىنى قايتا ئوقۇپ دەلىللەڭ.');
  if(s.finish==='assume')return result(4,'Failed','جاۋاب كەلمىگەنلىكى ياكى بىر كۇنۇپكا بېسىلغانلىقىلا ساقلاشنىڭ تاماملانغانلىقىنى ئىسپاتلىمايدۇ. چىققان ھالەتنى دەلىللەش كېرەك.');
  if(s.scenario==='timeout'&&s.finish!=='retry')return result(4,'Failed','ۋاقىت چېكىدىن كېيىنلا توختاپ قېلىش يېتەرلىك ئەمەس. ئالدىنقى ئىجرا خاتىرىسىنى تەكشۈرۈپ، زۆرۈر بولسا بىر قېتىملا قايتا سىناڭ.');
  if(s.scenario==='success'&&s.finish!=='verify')return result(4,'Failed','مۇۋەپپەقىيەت جاۋابى بار ۋاقىتتا قايتا ساقلاشنىڭ ئورنىغا، ساقلانغان مەزمۇننى قايتا ئوقۇپ تەكشۈرۈڭ.');
  if(s.receipt){trace.push({step:4,status:'Completed',detail:'Saved receipt found · writes_this_run = 0'});return result(4,'Completed','ئوخشاش ۋەزىپە بۇرۇن دەلىللەنگەن. ساقلانغان نەتىجە قايتۇرۇلدى؛ قايتا يېزىش تەقلىد قىلىنمىدى.',{completed:true,writes:0});}
  if(s.scenario==='timeout')trace.push({step:4,status:'Failed',detail:'Attempt 1 timed out before saving · no receipt found'});
  trace.push({step:4,status:'Completed',detail:s.scenario==='timeout'?'Retry limit: 1 · same operation ID · saved and verified':'Saved record re-read and verified'});
  return result(4,'Completed','13.5 سائەتلىك پىلان مەنبە بىلەن دەلىللەندى، تەستىق ئېلىندى ۋە ساقلاش نەتىجىسى قايتا تەكشۈرۈلدى. بىرلا خاتىرە يېزىش تەقلىد قىلىندى.',{completed:true,writes:1});
 }
 function rewind(input,step){const s=normalize(input);if(step<=1)s.tool='';if(step<=2){s.source='';s.instruction='';}if(step<=3)s.approval='';s.finish='';s.receipt=false;return s;}
 window.AgentLessonMission={empty,normalize,evaluate,rewind};
})();
