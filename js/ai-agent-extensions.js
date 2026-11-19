/* Lesson-specific refinements. All records and traces below are synthetic. */
(() => {
  'use strict';
  const api=window.AgentLessonDemos, base=api.simulate;
  const extra=(title,body,code)=>({title,body,code});
  api.predictionOutcome=(config,values,result)=>config.prediction?.kind==='workflow'?(values.task==='calculate'?'tool':'direct'):result.status;
  api.simulate=(c,v,s,action='preview')=>{
    if(c.type==='computer'&&action==='refresh-screen'){s.freshScreen=true;s.clicked=false;s.observed=false;action='preview';}
    if(c.type==='memory'&&action.startsWith('delete-catalog:')){
      const id=action.slice('delete-catalog:'.length);
      if(c.catalog?.some(n=>n.id===id)){s.deletedCatalog=[...new Set([...(s.deletedCatalog||[]),id])];}
      action='preview';
    }
    const stale=c.type==='computer'&&v.stale&&!v.api&&!s.freshScreen;
    let r=base(c,v,s,stale?'preview':action);r.extras=[];
    switch(c.type){
      case 'workflow':
        if(s.step>=3)r.extras.push(extra('تاللانغان يول',v.task==='calculate'?'ھېسابلاش ئۈچۈن قورال تاللاندى.':'ئاددىي سالامغا بىۋاسىتە جاۋاب يېتەرلىك.'));
        break;
      case 'framework':{
        const features=[v.retry?'قايتا سىناش':null,v.stream?'ئېقىملىق جاۋاب':null,v.handoff?'ماسلاشتۇرۇش':null].filter(Boolean);
        r.snippets=[{title:'رامكىسىز · چۈشەندۈرۈش كودى',code:'reply = call_model(messages)\nvalidate_tool_arguments(reply)\ncheck_permission(reply)\n# Add retry / stream / handoff plumbing manually.'},
          {title:'رامكا بىلەن · چۈشەندۈرۈش كودى',code:'agent = Agent(tools=[validated_tool])\nreply = agent.run(goal)\n# validated_tool still checks arguments and permission.'}];
        r.extras.push(extra('تاللىغان قۇلايلىقلار',features.length?features.join('، ')+' رامكىنىڭ ئۇلاش خىزمىتىنى يېنىكلىتىشى مۇمكىن؛ ھوقۇق تەكشۈرۈشى ساقلىنىدۇ.':'ھازىر ئاددىي دەۋرىيلىك يېتەرلىك؛ ئېھتىياج كۆپەيگەندە رامكا قوشۇشقا بولىدۇ.'));break;
      }
      case 'patterns':
        if(v.task==='tool'&&v.pattern==='tool-check'){
          r.status='Completed';r.title='مۇمكىن بولغان، ئەمما مۇرەككەپرەك يول';
          r.reason='قورال نەتىجىسىنى قوشۇمچە تەكشۈرۈش ئارقىلىق بۇ ۋەزىپىنى ھەل قىلىشقا بولىدۇ. ئاددىي ھېساب ئۈچۈن قوشۇلغان قاتلامنىڭ پايدىسىنى ۋاقىت ۋە مۇرەككەپلىك بەدىلى بىلەن سېلىشتۇرۇڭ.';
          r.nodes=[{label:'ھېسابلاش قورالى',state:'pass'},{label:'قوشۇمچە تەكشۈرۈش',state:'pass'},{label:'جاۋاب',state:'pass'}];
        }
        r.extras.push(extra('تاللاش مۇتلەق قانۇن ئەمەس','بۇ مەشىق ئەڭ بىۋاسىتە يولنى تاللاشقا ياردەم بېرىدۇ. باشقا قۇرۇلمىلارمۇ ئىشلىشى مۇمكىن؛ زۆرۈر بولمىغان قاتلاملارنىڭ بەدىلىنى ئېنىق چۈشەندۈرۈڭ.'));break;
      case 'validation':
        r.extras.push(extra('بىر مەيدانلىق تۈزىتىش',c.challenge?.hint||'پارامېتىر نامى ۋە تىپىنى تەكشۈرۈڭ.'));break;
      case 'rag':
        r.sources=[{id:'study-01',claim:'13.5 سائەت',evidence:'18 × 45 ÷ 60 ھېسابلاش خاتىرىسى بار',supported:true},{id:'draft-02',claim:'15 سائەت',evidence:'تەكشۈرۈلمىگەن لايىھە؛ ھېسابلاش دەلىلى يوق',supported:false}];
        if((v.document||v.record)&&v.question==='hours'&&v.claim==='draft'){
          r.status='Failed';r.title='تاللىغان دەۋانىڭ دەلىلى يوق';r.reason='draft-02 دىكى 15 سائەت تەكشۈرۈلمىگەن. study-01 دىكى 18 × 45 ÷ 60 ھېسابى 13.5 سائەتنى قوللايدۇ؛ دەلىل بار مەنبەنى تاللاڭ.';
        }
        break;
      case 'approval':
        if(v.operation==='read'){
          r.status=v.permission?'Completed':'Denied';r.title=v.permission?'رۇخسەت قىلىنغان پىلان ئوقۇلدى':'ئوقۇش ئىجازىتى يوق';r.reason=v.permission?'بۇ مەشىقتە ئوقۇشقا ئالدىن ھوقۇق بېرىلگەن، ئۆزگەرتىش يوق. يېزىشنى تاللىسىڭىز، قوشۇمچە تەستىق دەرۋازىسى يەنە كۆرۈنىدۇ.':'ئوقۇش مەشغۇلاتىمۇ ئىجازەتكە بويسۇنىدۇ. قورال نامىنىڭ بارلىقى يالغۇز يېتەرلىك ئەمەس.';r.approval=false;r.code={operation:'read',modified:false,simulation:true};
          r.nodes=[{label:'ئوقۇش تەلىپى',state:'pass'},{label:'ئوقۇش ھوقۇقى',state:v.permission?'pass':'fail'},{label:'ئۆزگەرتىش',state:'idle',detail:'يوق'}];
        }
        break;
      case 'planning':
        if(v.toolFailed&&v.replan==='ignore'){r.status='Failed';r.title='دەلىللەنمىگەن نەتىجىنى ساقلىماڭ';r.reason='ھېسابلاش مەغلۇپ بولدى. بۇ قەدەمگە تايىنىپ ساقلاشقا ئۆتۈشنىڭ ئورنىغا كىرگۈزۈشنى تۈزىتىش ياكى كەم ئۇچۇرنى سوراش كېرەك.';}
        if(v.toolFailed&&['retry','ask'].includes(v.replan)){
          r.status='Pending';r.title=v.replan==='retry'?'بىر قېتىملىق قايتا سىناش پىلانى':'ئېنىقلاش سوئالى تەييار';r.reason=v.replan==='retry'?'كىرگۈزۈشنى تۈزىتىپ، بىر قېتىم قايتا سىناش تاللاندى. نەتىجە دەلىللەنمىگۈچە ساقلاشقا ئۆتۈلمەيدۇ.':'كەم ئۇچۇرنى ئىشلەتكۈچىدىن سوراش تاللاندى. جاۋاب كەلگۈچە بېقىنىشلىق قەدەملەر توختىتىلىدۇ.';r.code={next_action:v.replan,retry_limit:1,save_allowed:false};
        }
        break;
      case 'handoff':
        r.extras.push(extra('ساختا يازغۇچى لايىھەسى',`ئۆگىنىش ۋاقتى 13.5 سائەت${v.source?' [calc-01]':' [مەنبە يوق]'}. ${v.unknown?'باشلىنىش كۈنى بېكىتىلمىدى؛ ئىشلەتكۈچىدىن سوراش كېرەك.':'بۇ لايىھە باشلىنىش كۈنىنىڭ نامەلۇم ئىكەنلىكىنى يەتكۈزمىدى.'} ${v.contract?'ساقلاش ئۈچۈن تەستىق لازىم.':'ساقلاش ئىجازىتىنىڭ شەرتى تاپشۇرۇلمىدى.'}`));break;
      case 'verification':
        if(v.buggy)r.extras.push(extra('تۈزىتىش نىشانى','ئاخىرقى بەلگىنى تاشلاپ سېلىشتۇرۇشنىڭ ئورنىغا تولۇق ئىككى قىممەتنى سېلىشتۇرۇڭ. تۈزەتكەندىن كېيىن ئوخشاش ئۈچ سىناقنى قايتا ئىجرا قىلىڭ.'));break;
      case 'observability':
        r.trace=[{step:1,tool:'goal_input',status:'Completed'},{step:2,tool:'search_notes',status:'Failed'},{step:3,tool:'final_answer',status:'Pending'}];
        if(!v.raw&&v.metadata&&v.failedStep!=='2'){r.status='Failed';r.title='مەغلۇپ بولغان قەدەمنى قايتا ئىزدەڭ';r.reason='ساختا ئىزدا 2-قەدەمدىكى search_notes مەغلۇپ بولغان. 3-قەدەم نەتىجىنى كۈتۈۋاتىدۇ؛ Pending بىلەن Failed نى ئايرىڭ.';}
        r.extras.push(extra('ئىزنىڭ جاۋابى',v.failedStep==='2'?'توغرا: ئىزدەش قورالى مەغلۇپ بولدى؛ ئاخىرقى جاۋاب كۈتۈلمەكتە.':'تاللىغان قەدەمنىڭ ھالەت نامىنى ئىزدىكى خاتىرە بىلەن سېلىشتۇرۇڭ.'));break;
      case 'protocol':
        r.snippets=[{title:'ئوخشاش نىشان · قورال ئارقىلىق ئىزدەش',code:'MCP tool call:\nsearch_notes({"query":"study plan"})\n# Result: source IDs + note snippets.'},{title:'ئوخشاش نىشان · ئاگېنتقا ۋەزىپە تاپشۇرۇش',code:'A2A task:\n{"task":"research study plan",\n "output":"facts with source IDs"}\n# Another agent owns the delegated task.'}];break;
      case 'context':
        r.extras.push(extra('قىسقارتىشتىن بۇرۇنقى توغرا جاۋاب','ۋاقىت 13.5 سائەت [study-01]. ساقلاشقا ئىجازەت يوق؛ باشلىنىش كۈنى تېخى نامەلۇم.'));
        r.extras.push(extra('تاللانغان مەزمۇن بىلەن چىققان ساختا لايىھە',`${v.fact?'ۋاقىت 13.5 سائەت':'ۋاقىتنى ئىسپاتلايدىغان نەتىجە كەم'}${v.source?' [study-01]':' [مەنبە يوق]'}. ${v.permission?'ساقلاشقا ئىجازەت يوق.':'ئىجازەت چەكلىمىسى جاۋابتىن چۈشۈپ قالدى — بۇ لايىھە ئىشەنچلىك ئەمەس.'} ${v.unknown?'باشلىنىش كۈنى نامەلۇم.':'باشلىنىش كۈنىنىڭ نامەلۇم ئىكەنلىكى يوقاپ كەتتى.'}`));break;
      case 'memory':{
        const query=String(v.query||'').trim().toLowerCase();
        r.catalog=[...(c.catalog||[]).filter(n=>!s.deletedCatalog?.includes(n.id)),...s.persistent].filter(n=>(n.content+' '+n.source).toLowerCase().includes(query));
        r.extras.push(extra('ئىزدەش دائىرىسى','بۇلار پەقەت مەشىق ئۈچۈن ئالدىن تەييارلانغان ساختا خاتىرىلەر. ئىزدەش، مەنبە، ۋاقىت ۋە ئۆچۈرۈش مۇشۇ بەتنىڭ ۋاقىتلىق ھالىتىدىلا ئىشلەيدۇ.'));break;
      }
      case 'migration':
        r.snippets=[{title:'ساپ Python · ئوخشاش كىرگۈزۈش',code:'dispatch("safe_calculate",\n  {"expression":"18*45/60"})\n# 13.5\ndispatch("safe_calculate", {"city":"Demo"})\n# rejected'},{title:'رامكا قورالى · ئوخشاش قائىدە',code:'def calculate_tool(expression):\n    return shared_dispatch("safe_calculate",\n      {"expression": expression})\n# Same validator; wrong keys still rejected.'}];break;
      case 'computer':
        if(r.screen)r.screen.version=v.stale?2:1;
        if(stale){s.clicked=false;s.observed=false;r.status='Pending';r.title='ئېكران ھالىتى كونا';r.reason='ساختا كۇنۇپكىنىڭ ئورنى ئۆزگەردى. كونا كۆزىتىشكە تايىنىپ چېكىش توسىلدى؛ ئاۋۋال «ئېكراننى قايتا كۆزىتىش» نى بېسىڭ.';if(r.screen)r.screen.stale=true;}
        r.extras.push(extra('ئېكران نۇسخىسى',v.stale?(s.freshScreen?'2-نۇسخا يېڭىدىن كۆزىتىلدى؛ ئاندىن چېكىپ، نەتىجىنى دەلىللەڭ.':'قولىڭىزدىكى 1-نۇسخا كونا؛ نۆۋەتتىكى ئېكران 2-نۇسخا.'): '1-نۇسخا نۆۋەتتىكى ئېكرانغا ماس.'));break;
      case 'queue':
        if(v.twoJobs&&!v.cancelled&&Number(v.elapsed)<c.deadline){
          s.jobs=s.jobs||{};let writes=0;
          const jobs=[['first','job-demo-01'],['second','job-demo-02']].map(([key,id])=>{
            const previous=s.jobs[id];let status=previous||'Pending';
            if(action==='run'&&!previous){status=v.cancelJob===key?'Cancelled':'Completed';s.jobs[id]=status;if(status==='Completed')writes++;}
            return {id,status,writes:status==='Completed'?1:0,cancelPlanned:!previous&&v.cancelJob===key};
          });
          r.jobs=jobs;r.status=action==='preview'&&!Object.keys(s.jobs).length?'Pending':'Completed';r.title='ئىككى ۋەزىپە ۋە يېزىش سانى';r.reason='بىكار قىلىنغان ۋەزىپە ئىجرا قىلىنمايدۇ. بۇرۇن تاماملانغان مەشغۇلاتنى قايتا ئىجرا قىلىش يېڭى خاتىرە قوشمايدۇ.';r.code={writes_this_run:writes,total_records:jobs.reduce((n,j)=>n+j.writes,0),simulation:true};
        }break;
      case 'locality':{
        const sent=[];if(v.model==='remote')sent.push({boundary:'مودېل مۇلازىمىتى',fields:{goal:'draft a study plan',evidence:'13.5 hours'}});if(v.tool==='remote')sent.push({boundary:'ئىزدەش API سى',fields:{query:'study plan'}});if(v.logging==='remote')sent.push({boundary:'ئىجرا خاتىرىسى مۇلازىمىتى',fields:{step:2,tool:'search_notes',status:'Completed'}});
        r.extras.push(extra('تاللانغان تور چېگراسىدىن چىقىدىغان ساختا مەيدانلار',sent.length?'تۆۋەندىكىسى پەقەت كۆرسەتمە؛ ھېچقانداق سانلىق مەلۇمات تورغا ئەۋەتىلمىدى.':'بارلىق بۆلەكلەر يەرلىك قىلىپ تاللاندى؛ بۇ تەقلىدتە چىقىدىغان مەيدان يوق.',sent));break;
      }
      case 'security':
        r.classification={fact:v.factSentence,injection:v.injectionSentence};
        if(v.decision==='extract'&&(v.factSentence!=='fact'||v.injectionSentence!=='injection')){
          const missing=v.factSentence==='none'||v.injectionSentence==='none';r.status=missing?'Pending':'Failed';r.title=missing?'ئىككى جۈملىنى ئايرىم بەلگىلەڭ':'پاكىت بىلەن كۆرسەتمە ئالماشتۇرۇلدى';r.reason='«دەرس ۋاقتى 13.5 سائەت» پاكىت دەۋاسى؛ «ئالدىنقى كۆرسەتمىنى ئۇنتۇ» بولسا ئىشەنچسىز كۆرسەتمە قىستۇرۇش. ئىككىسىنى توغرا پەرقلەندۈرۈپ ئاندىن نەتىجىنى تەكشۈرۈڭ.';
        }break;
    }
    return r;
  };
})();
