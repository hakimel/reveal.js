/* Pure classroom simulations: no fetch, credentials, model calls or user-file writes. */
(() => {
  'use strict';
  const node = (label, state='idle', detail='') => ({label,state,detail});
  const result = (status, title, reason, nodes=[], extra={}) => ({status,title,reason,nodes,...extra});
  const pending = (reason, nodes=[]) => result('Pending','تەييار ياكى كېيىنكى قەدەمنى كۈتۈۋاتىدۇ',reason,nodes);
  const state = () => ({step:0,approval:null,clicked:false,observed:false,working:[],persistent:[],removed:false});
  function arithmetic(source) {
    if(typeof source!=='string'||source.length>120||!source.trim())throw Error('ھېسابلاش ئىپادىسى 1–120 بەلگە بولۇشى كېرەك.');
    const tokens=source.match(/\d+(?:\.\d+)?|[()+*/-]/g)||[];
    if(tokens.join('')!==source.replace(/\s/g,'')||tokens.length>64)throw Error('پەقەت سان، تىرناق ۋە + - * / بەلگىلىرىگە رۇخسەت قىلىنىدۇ.');
    let i=0,depth=0;
    const bounded=x=>{if(!Number.isFinite(x)||Math.abs(x)>1e12)throw Error('ھېسابلاش نەتىجىسى رۇخسەت قىلىنغان چەكتىن ئاشتى.');return x;};
    function atom(){if(++depth>24)throw Error('تىرناق قاتلىمى بەك كۆپ.');let value;
      if(tokens[i]==='+'||tokens[i]==='-'){const sign=tokens[i++]==='-'?-1:1;value=sign*atom();}
      else if(tokens[i]==='('){i++;value=sum();if(tokens[i++]!==')')throw Error('تىرناق ماس كەلمىدى.');}
      else {const t=tokens[i++];if(!t||!/^\d/.test(t))throw Error('سان ياكى تىرناق كۈتۈلدى.');value=Number(t);}
      depth--;return bounded(value);
    }
    function product(){let v=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],b=atom();if(op==='/'&&b===0)throw Error('نۆلگە بۆلۈشكە بولمايدۇ.');v=bounded(op==='*'?v*b:v/b);}return v;}
    function sum(){let v=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],b=product();v=bounded(op==='+'?v+b:v-b);}return v;}
    const value=sum();if(i!==tokens.length)throw Error('ئىپادىدە ئارتۇق ياكى خاتا بەلگە بار.');return Math.round(value*10000)/10000;
  }
  function validateRequest(raw){
    if(typeof raw!=='string'||raw.length>2000)throw Error('تەلەپ بەك ئۇزۇن.');
    let request;try{request=JSON.parse(raw);}catch{throw Error('JSON قۇرۇلمىسى خاتا؛ تىرناق ۋە پەشلەرنى تەكشۈرۈڭ.');}
    if(!request||Array.isArray(request)||typeof request!=='object')throw Error('تەلەپ JSON ئوبيېكتى بولۇشى كېرەك.');
    if(request.name!=='safe_calculate')throw Error('قورال نامى رۇخسەت تىزىملىكىدە يوق.');
    if(Object.keys(request).sort().join(',')!=='arguments,name')throw Error('تەلەپتە پەقەت name ۋە arguments بولۇشى كېرەك.');
    const args=request.arguments;
    if(!args||Array.isArray(args)||typeof args!=='object'||Object.keys(args).join(',')!=='expression'||typeof args.expression!=='string')throw Error('پارامېتىردا پەقەت تېكىست تىپىدىكى expression بولۇشى كېرەك.');
    return arithmetic(args.expression);
  }
  function simulate(config,v,s,action='preview'){
    switch(config.type){
      case 'workflow': {
        if(action==='next')s.step=Math.min(config.steps.length,s.step+1);
        const math=v.task==='calculate';
        const details=math?['18 دەرس × 45 مىنۇت','سان ۋە بىرلىكنى تەكشۈرۈش','safe_calculate قورالىنى تاللاش','13.5 سائەتلىك نەتىجە']:['سالاملىشىش تەلىپى','بۇ تەلەپكە تاشقى سانلىق مەلۇمات كېرەك ئەمەس','بىۋاسىتە قىسقا جاۋاب تاللاش','مۇناسىۋەتلىك جاۋاب قايتۇرۇش'];
        const nodes=config.steps.map((t,i)=>node(t,i<s.step?'pass':i===s.step?'active':'idle',details[i]));
        const reasons=['«قەدەممۇ قەدەم» ياكى «ئىجرا قىلىش» نى بېسىڭ. ھەر قەدەم كېيىنكى قارارغا ئۇچۇر بېرىدۇ.', 'تەلەپتىن نىشان ئايرىلدى. كېيىن ھالەت ۋە كېرەكلىك ئۇچۇر تەكشۈرۈلىدۇ.', 'ھالەت تەكشۈرۈلدى. ئاگېنت ھازىر ۋەزىپىگە ماس ھەرىكەتنى تاللايدۇ.',math?'ھېسابلاش ئۈچۈن قورال تاللاندى؛ نەتىجىنى تەكشۈرمەي تاماملاندى دېيىلمەيدۇ.':'بۇ ئاددىي سالامغا قورال كېرەك ئەمەس؛ بىۋاسىتە جاۋاب يېتەرلىك.',math?'18 × 45 ÷ 60 = 13.5. قورال نەتىجىسى تەلەپ قىلىنغان سائەت بىرلىكىدە دەلىللەندى.':'تەلەپكە ماس سالام جاۋابى تەييارلاندى؛ زۆرۈر بولمىغان قورال چاقىرىقى قوشۇلمىدى.'];
        return result(s.step===config.steps.length?'Completed':'Pending',s.step===config.steps.length?(math?'13.5 سائەت':'سالام! سىزگە قانداق ياردەم بېرەلەيمەن؟'):`${s.step} / ${config.steps.length} قەدەم`,reasons[s.step],nodes,{layout:'pipeline'});
      }
      case 'framework': {
        const count=[v.retry,v.stream,v.handoff].filter(Boolean).length;
        return result('Completed',count?'رامكا تەكرار ئۇلاش خىزمىتىنى يېنىكلىتىشى مۇمكىن':'ئاددىي Python دەۋرىيلىكىدىن باشلاشقا بولىدۇ',count?'بەلگىلىگەن ئېھتىياجلار ئۈچۈن رامكىنىڭ تەييار ئىقتىدارلىرىنى باھالاڭ. قورال ئىجازىتى ۋە پارامېتىر تەكشۈرۈشى يەنىلا سىزنىڭ ئىجرا پروگراممىڭىزدا قالىدۇ.':'ھازىر مۇرەككەپ ماسلاشتۇرۇش ئېھتىياجى يوق. ئالدى بىلەن ئاددىي دەۋرىيلىكنى چۈشىنىپ، كېيىن زۆرۈر قۇلايلىقلارنى قوشۇڭ.',[node('مودېل','pass','ھەرىكەتنى تەكلىپ قىلىش'),node('SDK',count?'active':'idle',count?'قايتا سىناش، ئېقىم ۋە ماسلاشتۇرۇش':'زۆرۈر بولغاندا قوشۇش'),node('ئىجرا پروگراممىسى','pass','ھوقۇق، دەلىللەش ۋە قورال ئىجراسى')],{layout:'layers'});
      }
      case 'patterns': {
        const labels={tool:'قورال دەۋرىيلىكى',reflection:'تەكشۈرۈش ۋە تۈزىتىش',plan:'پىلانلاپ ئىجرا قىلىش',multi:'كۆپ ئاگېنتلىق ھەمكارلىق'};
        const match=v.task===v.pattern;
        return result(match?'Completed':'Failed',match?'ئەندىزە ۋەزىپىگە ماس كەلدى':'تاللاشنى قايتا باھالاڭ',match?'تاللىغان ئەندىزە بۇ مەشىقنىڭ ئاساسلىق ئېھتىياجىنى بىۋاسىتە ھەل قىلىدۇ. ئەمەلىي تۈردە سۈپەت ۋە مۇرەككەپلىك بەدىلىنىمۇ ئۆلچەڭ.':`بۇ مەشىقتە «${labels[v.task]}» ئاساسلىق ئېھتىياجغا تېخىمۇ ماس. قوشۇمچە قاتلامنى ئېنىق سەۋەب بولغاندىلا قوشۇڭ.`,Object.entries(labels).map(([k,t])=>node(t,k===v.pattern?(match?'pass':'fail'):k===v.task?'active':'idle',k===v.task?'بۇ ۋەزىپىنىڭ مۇۋاپىق يولى':'')),{layout:'routes'});
      }
      case 'validation': {
        try{const answer=validateRequest(v.request);return result('Completed',`دەلىللەنگەن نەتىجە: ${answer}`,'قورال نامى، پارامېتىر شەكلى ۋە ھېسابلاش ئىپادىسى تەكشۈرۈشتىن ئۆتتى. ھېسابلاش پەقەت مۇشۇ بەتتىكى چەكلىك تەقلىدتە ئورۇندالدى.',[node('JSON','pass'),node('رۇخسەت تىزىملىكى','pass'),node('پارامېتىر','pass'),node('ھېسابلاش','pass')],{code:{result:answer},layout:'pipeline'});}catch(e){return result('Failed','تەلەپ ئىجرا قىلىنمىدى',e.message,[node('ساختا تەلەپ','pass'),node('دەلىللەش','fail'),node('قورال ئىجراسى','idle','ئىجرا قىلىنمىدى')],{layout:'pipeline'});}
      }
      case 'rag': {
        const nodes=[node('ھۆججەت',v.document?'pass':'pending',v.document?'بار':'تېپىلمىدى'),node('ساندان خاتىرىسى',v.record?'pass':'pending',v.record?'study-01':'تېپىلمىدى')];
        if(!v.document&&!v.record)return pending('ھېچقانداق دەلىل تېپىلمىدى. جاۋابنى توقۇپ تولدۇرماي، مەنبە تەمىنلەش ياكى قايتا ئىزدەش كېرەك.',nodes);
        if(v.question==='date')return result('Pending','باشلىنىش كۈنى نامەلۇم','study-01 دا ۋاقىت بار، ئەمما باشلىنىش كۈنى يوق. ئىشلەتكۈچىدىن باشلىنىش كۈنىنى ئېنىقلاش سورىلىدۇ.',[...nodes,node('كۈننى ئېنىقلاش','pending')],{code:config.record,layout:'evidence'});
        return result('Completed','ئومۇمىي ۋاقىت: 13.5 سائەت [study-01]','ساختا مەنبەدە 13.5 سائەتلىك دەلىل بار. جاۋاب شۇ مەنبە بەلگىسىگە باغلاندى؛ باشقا ئۇچۇر قوشۇلمىدى.',[...nodes,node('مەنبەلىك جاۋاب','pass')],{code:config.record,layout:'evidence'});
      }
      case 'approval': {
        if(action==='approve'&&v.permission)s.approval=true;
        if(action==='deny')s.approval=false;
        if(!v.permission)return result('Failed','قورالنىڭ يېزىش ھوقۇقى يوق','ئىنسان تەستىقى يالغۇز يېتەرلىك ئەمەس؛ ئاۋۋال قورالنىڭ يېزىش ھوقۇقى بولۇشى كېرەك.',[node('تەلەپ','pass'),node('قورال ھوقۇقى','fail'),node('ساقلاش','idle')],{layout:'gate'});
        if(s.approval===null)return result('Pending','ئىنسان تەستىقى كۈتۈلمەكتە','ھوقۇق بار، ئەمما ساقلاش تېخى تەستىقلانمىدى. تەستىقلاش ياكى رەت قىلىشنى ئۆزىڭىز تاللاڭ.',[node('قورال ھوقۇقى','pass'),node('تەستىق','pending'),node('ساقلاش','idle')],{approval:true,code:{draft:config.note,saved:false},layout:'gate'});
        return result(s.approval?'Completed':'Denied',s.approval?'ساقلاش تەقلىد قىلىندى':'ساقلاش رەت قىلىندى',s.approval?'ھوقۇق ۋە ئىنسان تەستىقى تەكشۈرۈلدى. بۇ پەقەت تەقلىد؛ ھەقىقىي ھۆججەت يېزىلمىدى.':'رەت قىلىنغان تەلەپ ساقلاشقا ئۆتمىدى. ئاخىرقى جاۋابتا «ساقلاندى» دەپ دەۋا قىلىشقا بولمايدۇ.',[node('ھوقۇق','pass'),node('تەستىق',s.approval?'pass':'fail'),node('ساقلاش',s.approval?'pass':'idle')],{code:{saved:Boolean(s.approval),simulation:true},layout:'gate'});
      }
      case 'planning': {
        const order=[v.first,v.second,v.third],labels={calculate:'ھېسابلاش',verify:'دەلىللەش',save:'تەستىق بىلەن ساقلاش'};
        if(new Set(order).size!==3)return result('Failed','پىلاندا قەدەم تەكرارلاندى','ھەر باسقۇچنىڭ مەسئۇلىيىتى ئايرىم بولۇشى كېرەك. ھېسابلاش، دەلىللەش ۋە ساقلاشنى بىر قېتىمدىن ئورۇنلاشتۇرۇڭ.',order.map(t=>node(labels[t],'fail')),{layout:'pipeline'});
        if(order.join(',')!=='calculate,verify,save')return result('Failed','بېقىنىش تەرتىپى خاتا','نەتىجىنى دەلىللەش ھېسابلاشتىن كېيىن، ساقلاش بولسا دەلىللەش ۋە تەستىقتىن كېيىن كېلىشى كېرەك.',order.map((t,i)=>node(labels[t],t===['calculate','verify','save'][i]?'pass':'fail')),{layout:'pipeline'});
        if(v.toolFailed)return result('Pending','قايتا پىلانلاش كېرەك','ھېسابلاش مەغلۇپ بولغاچقا ساقلاشقا ئۆتۈلمەيدۇ. سەۋەبنى تەكشۈرۈپ، چەكلىك قايتا سىناش ياكى ئېنىقلاش يولى تاللىنىدۇ.',[node('ھېسابلاش','fail'),node('قايتا پىلانلاش','active'),node('ساقلاش','idle')],{layout:'pipeline'});
        return result('Completed','پىلاننىڭ تەرتىپى توغرا','ھەر قەدەم ئۆزىدىن بۇرۇنقى نەتىجىگە تايىنىدۇ. ئاخىرقى ساقلاش ئۈچۈن يەنىلا ئىجازەت ۋە تەستىق كېرەك.',order.map(t=>node(labels[t],'pass')),{code:{calculate:13.5,verified:true,write:'requires_approval'},layout:'pipeline'});
      }
      case 'handoff': {
        const payload={facts:['13.5 سائەت'],...(v.source?{source_id:config.source}:{}),...(v.unknown?{unknown:['start_date']}:{}),...(v.contract?{language:'ug',write:'requires_approval'}:{})};
        const ok=v.source&&v.unknown&&v.contract;
        return result(ok?'Completed':'Pending',ok?'تاپشۇرۇش شەرتى تولۇق':'تاپشۇرۇش ئۇچۇرىنى تولۇقلاڭ',ok?'يازغۇچى پاكىت، مەنبە، نامەلۇم ئۇچۇر ۋە چىقىرىش شەرتىنى قوبۇل قىلدى. بۇ كېلىشىم مەنبە سىرتىدا ئۇچۇر قوشۇشنىڭ ئالدىنى ئېلىشقا ياردەم بېرىدۇ.':'مەنبە، نامەلۇم ئۇچۇر ياكى چىقىرىش شەرتى كەم. يازغۇچىغا تولۇق دەلىل ۋە ئېنىق ھوقۇق چېكىنى تاپشۇرۇڭ.',[node('تەتقىقاتچى','pass','ساختا پاكىت توپلاش'),node('تاپشۇرۇش',ok?'pass':'pending'),node('يازغۇچى',ok?'active':'idle','مەنبەگە تايىنىپ يېزىش')],{code:payload,layout:'handoff'});
      }
      case 'verification': {
        const compare=(a,b)=>v.buggy?a.slice(0,-1)===b.slice(0,-1):a===b;
        const tests=config.testCases.map(t=>({label:t.label,expected:t.expected===t.actual?'قوبۇل قىلىش':'رەت قىلىش',actual:compare(t.expected,t.actual)?'قوبۇل قىلىش':'رەت قىلىش',pass:(t.expected===t.actual)===compare(t.expected,t.actual)}));
        const all=tests.every(t=>t.pass),same=v.expected===v.actual;
        const extra={comparison:{expected:v.expected,actual:v.actual},tests,layout:'compare'};
        if(!v.expected||!v.actual)return result('Pending','ئىككى بەلگىنىمۇ تولدۇرۇڭ','بىر تەرەپتىكى ئۇچۇر كەم بولسا، سېلىشتۇرۇش تاماملانمىدى. بۇ ماس كەلمەسلىك خاتالىقىدىن ئايرىم ھالەت.',[],extra);
        if(!all)return result('Failed','سىناق سېلىشتۇرغۇچتىكى خاتالىقنى تاپتى','خاتا سېلىشتۇرغۇچ ئاخىرقى بەلگىنى تەكشۈرمىگەچكە، A204 بىلەن A205 نى خاتا قوبۇل قىلىدۇ. كۈتۈلگەن ۋە چىققان نەتىجىنىڭ پەرقى بۇ خاتالىقنى ئاشكارىلىدى.',[],extra);
        return result(same?'Completed':'Failed',same?'ئىككى بەلگە تولۇق ماس كەلدى':'بەلگىلەر ماس كەلمىدى',same?'ھەر بىر ھەرپ ۋە رەقەم ماس كەلدى. سىناق مىساللىرىدا ماس كەلمىگەن بەلگىلەرمۇ كۈتۈلگەندەك رەت قىلىندى.':'بىر ياكى بىر نەچچە بەلگە پەرقلىق. بۇ مەشىقنىڭ قائىدىسى تولۇق ماس كېلىش؛ پەرقنى پەرەز بىلەن تۈزىتىشكە بولمايدۇ.',[],extra);
      }
      case 'observability': {
        const log=v.metadata?{...config.sample,status:v.failure?'Failed':'Completed'}:{};
        if(v.raw)log.raw='مەشىق تېكىستى / DEMO-KEY — ھەقىقىي مەخپىي ئۇچۇر ئەمەس';
        if(v.raw)return result('Failed','خاتىرە دائىرىسىنى قىسقارتىڭ','خام كۆرسەتمە ۋە ئاچقۇچ مەيدانلىرىنى خاتىرىلەش زۆرۈر ئەمەس. بۇ مىسال ساختا بولسىمۇ، ئەمەلىي ئىجرادا بۇنداق ئۇچۇرنى چىقىرىپ تاشلاش كېرەك.',[],{code:log,layout:'console'});
        if(!v.metadata)return pending('مەزمۇننى خاتىرىلىمەي تۇرۇپمۇ، قورال نامى ۋە ئىجرا ھالىتىنى خاتىرىلەش كېرەك. پايدىلىق قۇرۇلمىلىق مەيدانلارنى تاللاڭ.');
        return result('Completed',v.failure?'خاتالىق ھالىتى مەخپىي مەزمۇنسىز خاتىرىلەندى':'ئىجرا ھالىتى قۇرۇلمىلىق خاتىرىلەندى','قورال نامى، ۋاقىت ۋە ھالەت سەۋەبنى ئىزدەشكە ياردەم بېرىدۇ. كۆرسىتىلگەن سانلار تەقلىدىي؛ ھەقىقىي ئىجرا ئۆلچىمى ئەمەس.',[],{code:log,layout:'console'});
      }
      case 'protocol': {
        const correct=v.target==='tool'?'MCP':'A2A',match=v.protocol===correct;
        return result(!v.authorized?'Denied':match?'Completed':'Failed',!v.authorized?'كىرىش ئىجازىتى يوق':match?'كېلىشىم نىشانغا ماس':'كېلىشىم نىشانغا ماس ئەمەس',!v.authorized?'توغرا كېلىشىم تاللانغان بولسىمۇ، ئۇلىنىشنىڭ ئۆزى ھوقۇق بەرمەيدۇ. ئاۋۋال مەنبەگە كىرىش ئىجازىتىنى تەكشۈرۈڭ.':match?'بۇ مىسالدا MCP قورال ۋە مەزمۇنغا، A2A مۇستەقىل ئاگېنتقا ۋەزىپە تاپشۇرۇشقا ئىشلىتىلدى.':`بۇ نىشان ئۈچۈن ${correct} نى باھالاش كېرەك. قورال ئۇلاش بىلەن ئاگېنتلار ھەمكارلىقىنى ئايرىڭ.`,[node('ئاگېنت','pass'),node('MCP',v.protocol==='MCP'?(match?'pass':'fail'):'idle','قورال ۋە مەزمۇن'),node('A2A',v.protocol==='A2A'?(match?'pass':'fail'):'idle','مۇستەقىل ئاگېنت'),node('ئىجازەت',v.authorized?'pass':'fail')],{layout:'routes'});
      }
      case 'context': {
        const required=['fact','source','permission','unknown'],cost=required.filter(k=>v[k]).length+(v.debug?4:0);
        const payload={goal:'draft a study plan',...(v.fact?{hours:13.5}:{}),...(v.source?{source:'study-01'}:{}),...(v.permission?{write_allowed:false}:{}),...(v.unknown?{unknown:['start_date']}:{}),...(v.debug?{debug:'مۇناسىۋەتسىز تۆت بۆلەك'}:{})};
        const missing=required.filter(k=>!v[k]),ok=!missing.length&&cost<=config.budget;
        return result(ok?'Completed':'Failed',ok?'مۇھىم مەزمۇن ساقلاپ قېلىندى':cost>config.budget?'مەزمۇن خامچوتى ئېشىپ كەتتى':'مۇھىم شەرت يوقاپ كەتتى',ok?'نەتىجە، مەنبە، ئىجازەت ۋە نامەلۇم ئۇچۇر ساقلاندى. مۇناسىۋەتسىز قۇرلار قوشۇلمىدى.':cost>config.budget?'بۇ مەشىقتە بەش ئۇچۇر بۆلىكىگە ئورۇن بار. مۇناسىۋەتسىز خاتىرىنى چىقىرىپ، مۇھىم شەرتلەرنى ساقلاڭ.':'قىسقارتىشتا پاكىت، مەنبە، ئىجازەت ۋە نامەلۇم ئۇچۇرنىڭ بىرى يوقاپ كەتتى. بۇنىڭ نەتىجىسىدە جاۋاب ياكى ئىجازەت قارارى خاتالىشىشى مۇمكىن.',[],{code:payload,capacity:{used:cost,total:config.budget,label:'تەقلىدىي ئۇچۇر بۆلىكى؛ توكېن سانى ئەمەس'},layout:'context'});
      }
      case 'memory': {
        if(action==='store'){
          if(v.target==='persistent'&&!v.consent)return result('Denied','ساقلاش تەستىقلانمىدى','ئۇزۇن مۇددەتلىك ساقلاشقا تەستىق يوق. ساختا خاتىرە ساقلىغۇچقا قوشۇلمىدى.',[],{memory:{working:s.working,persistent:s.persistent},layout:'memory'});
          const target=v.target==='working'?s.working:s.persistent;
          if(!target.some(n=>n.id===config.note.id))target.push({...config.note});
          s.removed=false;
        }
        if(action==='new-session')s.working=[];
        if(action==='delete'){s.persistent=[];s.removed=true;}
        const memory={working:s.working,persistent:s.persistent};
        return result(action==='preview'?'Pending':'Completed',action==='new-session'?'يېڭى سۆھبەت تەقلىد قىلىندى':s.removed?'ئۇزۇن مۇددەتلىك خاتىرە ئۆچۈرۈلدى':action==='store'?'خاتىرە تاللىغان ئورۇنغا قويۇلدى':'خاتىرىنى قەيەرگە قويۇشنى تاللاڭ',action==='new-session'?'خىزمەت ھالىتى تازىلاندى؛ تەستىقلانغان ئۇزۇن مۇددەتلىك خاتىرە قالدى. بۇ ساقلىغۇچمۇ پەقەت مۇشۇ تەجرىبىنىڭ ۋاقىتلىق ھالىتى.':s.removed?'پەقەت ساختا ئۇزۇن مۇددەتلىك خاتىرە ئۆچۈرۈلدى. مەنبە، ۋاقىت ۋە كۆرۈش/ئۆچۈرۈش يولى ئەستە ساقلاش لايىھەسىنىڭ بىر قىسمى.':'خىزمەت ھالىتى نۆۋەتتىكى سۆھبەتكە تەۋە. ئۇزۇن مۇددەتلىك ساقلاشقا مەنبە، ۋاقىت ۋە ئىشلەتكۈچى تەستىقى لازىم.',[],{memory,layout:'memory'});
      }
      case 'migration': {
        const valid=v.input==='valid',plain=valid?'13.5':'رەت قىلىندى',framework=v.shared?plain:valid?'13.5':'تەكشۈرۈشتىن ئۆتمەي قوبۇل قىلىندى';
        return result(v.shared?'Completed':'Failed',v.shared?'ئىككى يول ئوخشاش قائىدىگە ئەمەل قىلدى':'رامكا يولىدا تەكشۈرۈش يوقاپ كەتتى',v.shared?'ساپ دەۋرىيلىك بىلەن رامكا ئوخشاش قورال فۇنكسىيەسى ۋە دەلىللەشنى ئىشلەتتى. خاتا كىرگۈزۈشمۇ ھەر ئىككى يولدا رەت قىلىنىدۇ.':'توغرا كىرگۈزۈشتە نەتىجە ئوخشاش كۆرۈنسىمۇ، خاتا كىرگۈزۈشتە پەرق چىقىدۇ. رامكىغا كۆچۈرگەندە قورالنىڭ تەكشۈرۈش چېگراسىنى ساقلاڭ.',[],{panels:[{title:'ساپ Python',body:plain,state:valid?'pass':'fail'},{title:'رامكا يولى',body:framework,state:v.shared?'pass':'fail'}],layout:'compare'});
      }
      case 'computer': {
        if(v.api)return result('Completed','قۇرۇلمىلىق API يولىنى ئالدى بىلەن باھالاڭ','بۇ ۋەزىپە ئۈچۈن مۇۋاپىق API بار؛ ئۇنى ۋە ئۇنىڭ ئىجازىتىنى ئالدى بىلەن باھالاش قولايلىق. بۇ قارار ئىجرا تاماملاندى دېگەنلىك ئەمەس، API نەتىجىسىمۇ كېيىن دەلىللىنىشى كېرەك.',[node('ۋەزىپە','pass'),node('API','active'),node('نەتىجىنى دەلىللەش','pending','ئىجرا نەتىجىسى يەنە تەكشۈرۈلىدۇ')],{screen:{clicked:false,observed:false},layout:'screen'});
        if(action==='click') {s.clicked=true;s.observed=false;}
        if(action==='observe'&&s.clicked)s.observed=true;
        const screen={clicked:s.clicked,observed:s.observed,outcome:v.outcome};
        if(!s.clicked)return result('Pending','ساختا ئارايۈز تەييار','كۇنۇپكىنى چېكىپ، ئاندىن يېڭى ھالەتنى كۆزىتىڭ. بۇ پەقەت مۇشۇ بەتتىكى سىناق ئارايۈزى.',[],{screen,layout:'screen'});
        if(!s.observed)return result('Pending','چېكىش بولدى؛ نەتىجە تېخى دەلىللەنمىدى','ھەرىكەتنىڭ يۈز بېرىشى تاماملىنىشنىڭ دەلىلى ئەمەس. «يېڭى ھالەتنى كۆزىتىش» نى بېسىپ تەكشۈرۈڭ.',[],{screen,layout:'screen'});
        return result(v.outcome==='saved'?'Completed':'Failed',v.outcome==='saved'?'ساقلانغان ھالەت دەلىللەندى':'ساقلاش مەغلۇبىيىتى بايقالدى',v.outcome==='saved'?'ساختا ئارايۈز «ساقلاندى» ھالىتىنى قايتۇردى؛ كۈتۈلگەن نەتىجە بىلەن ماس. ھەقىقىي ھۆججەت يېزىلمىدى.':'يېڭى ھالەت ساقلاشنىڭ مەغلۇپ بولغانلىقىنى كۆرسەتتى. چېكىش بولغان دەپلا «تاماملاندى» دېيىشكە بولمايدۇ.',[],{screen,layout:'screen'});
      }
      case 'queue': {
        const nodes=[node('ۋەزىپە نۆۋىتى','pass',config.jobId),node('كونترول تەكشۈرۈشى','active'),node('ئىجرا','idle'),node('نەتىجە','idle')];
        if(v.cancelled)return result('Cancelled','ۋەزىپە بىكار قىلىندى','ئىشلەتكۈچىنىڭ بىكار قىلىش تەلىپى ئىجرادىن بۇرۇن تەكشۈرۈلدى؛ يېڭى ساقلاش بولمايدۇ.',[nodes[0],node('بىكار قىلىش','fail'),nodes[2],nodes[3]],{layout:'pipeline'});
        if(Number(v.elapsed)>=config.deadline)return result('Failed','ۋاقىت چېكى توشتى',`بۇ مەشىقتە ۋاقىت چېكى ${config.deadline} سېكۇنت. چېكىگە يەتكەن ياكى ئۇنىڭدىن ئۆتكەن ۋەزىپە ئىجرا قىلىنمايدۇ.`,[nodes[0],node('ۋاقىت چېكى','fail'),nodes[2],nodes[3]],{layout:'pipeline'});
        return result('Completed',v.duplicate?'بۇرۇنقى نەتىجە قايتۇرۇلدى':'ۋەزىپە بىر قېتىم ئىجرا قىلىندى',v.duplicate?'بۇ مەشغۇلات بەلگىسى بۇرۇن ساقلانغان. تەكرار يېزىشنىڭ ئورنىغا مەۋجۇت نەتىجە قايتۇرۇلدى.':'ۋاقىت ۋە بىكار قىلىش تەكشۈرۈشىدىن ئۆتتى. بۇ ساختا ئىجرادا بىر خاتىرە قوشۇلغان ھالەت تەقلىد قىلىندى.',[nodes[0],node('كونترول','pass'),node(v.duplicate?'تەكرار ئىجرانى توسۇش':'ئىجرا','pass'),node('بىر خاتىرە','pass')],{code:{job_id:config.jobId,writes:v.duplicate?0:1,total_records:1,simulation:true},layout:'pipeline'});
      }
      case 'locality': {
        const names={model:'مودېل',tool:'ئىزدەش قورالى',logging:'ئىجرا خاتىرىسى'},remote=Object.keys(names).filter(k=>v[k]==='remote');
        return result(remote.length?'Failed':'Completed',remote.length?'پۈتۈن خىزمەت ئېقىمى تورسىز ئەمەس':'بۇ تەقلىدتىكى بارلىق بۆلەك يەرلىك',remote.length?`${remote.map(k=>names[k]).join('، ')} سىرتقى مۇلازىمەتتە. مودېل يەرلىك بولسىمۇ، بۇ يوللار ئارقىلىق ئۇچۇر ئۈسكۈنىدىن چىقىشى مۇمكىن.`:'مودېل، قورال ۋە خاتىرە ساقلاشنىڭ ھەممىسى ئۈسكۈنىدە قىلىپ تاللاندى. ئەمەلىي تۈردە تور تەڭشىكى ۋە باشقا ئۇلىنىشلارنىمۇ تەكشۈرۈش كېرەك.',Object.entries(names).map(([k,t])=>node(t,v[k]==='local'?'pass':'fail',v[k]==='local'?'ئۈسكۈنىدە':'تورغا چىقىش يولى')),{layout:'boundary'});
      }
      case 'security': {
        const safe=v.decision==='extract';
        return result(safe?'Completed':'Failed',safe?'پاكىت ئايرىلدى، ھوقۇق ئۆزگەرمىدى':'ئىشەنچسىز كۆرسەتمىگە ئەگىشىش خاتا',safe?'13.5 سائەتلىك پاكىت مەنبە بەلگىسى بىلەن ئايرىلدى. «كۆرسەتمىنى ئۇنتۇ» دېگەن جۈملە ئىجرا قىلىنمىدى؛ قورال ئىجازىتى بۇرۇنقىدەك قالدى.':'تاشقى ھۆججەتتىكى جۈملە ئىشلەتكۈچىنىڭ نىشانى ياكى سىستېما ئىجازىتىنى ئۆزگەرتەلمەيدۇ. پاكىتنى ئايرىپ، قىستۇرۇلغان كۆرسەتمىنى بۇيرۇق دەپ قوبۇل قىلماڭ.',[node('تاشقى ھۆججەت','pass','ئىشەنچسىز مەزمۇن'),node('مەزمۇننى پەرقلەندۈرۈش',safe?'pass':'fail'),node('ئىجازەت چېگراسى','pass','يېڭى ھوقۇق بېرىلمىدى')],{fixture:config.fixture,code:safe?{hours:13.5,source_id:config.source,permissions_changed:false}:{attempted_instruction:'BANANA',new_permission_granted:false},layout:'security'});
      }
      default:return pending('بۇ تەجرىبە تىپى تېخى تىزىملانمىغان.');
    }
  }
  window.AgentLessonDemos={simulate,state,arithmetic,validateRequest};
})();
