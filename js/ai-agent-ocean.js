/* Deep-sea visual system. Local SVG/CSS only; never requests microphone access. */
(() => {
  'use strict';
  let instance=0,observer,feedbackTimer;
  const stateLabels={idle:'ئۆگىنىشكە تەييار',listening:'تاللىشىڭىزنى كۈتمەكتە',processing:'قەدەملەرنى ئىجرا قىلىۋاتىدۇ',completed:'نەتىجە تەكشۈرۈلدى',waiting:'داۋاملاشتۇرۇشنى كۈتمەكتە',blocked:'قارارنى قايتا تەكشۈرۈڭ'};
  function nettle(){
    const id='nettle-'+(++instance);
    return `<svg class="sea-nettle" viewBox="0 0 400 470" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${id}-bell" cx=".4" cy=".18" r=".84"><stop stop-color="#ffe6dd" stop-opacity=".95"/><stop offset=".3" stop-color="#edb9ac" stop-opacity=".64"/><stop offset=".64" stop-color="#9b8eb7" stop-opacity=".3"/><stop offset="1" stop-color="#82e3cf" stop-opacity=".07"/></radialGradient>
        <linearGradient id="${id}-arm" x1="180" y1="170" x2="240" y2="425" gradientUnits="userSpaceOnUse"><stop stop-color="#f6d4c8" stop-opacity=".8"/><stop offset=".55" stop-color="#dea8a9" stop-opacity=".5"/><stop offset="1" stop-color="#82e3cf" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}-thread" x1="0" y1="145" x2="0" y2="440" gradientUnits="userSpaceOnUse"><stop stop-color="#c9eee2" stop-opacity=".7"/><stop offset=".55" stop-color="#93cecf" stop-opacity=".42"/><stop offset="1" stop-color="#93cecf" stop-opacity="0"/></linearGradient>
      </defs>
      <g class="nettle-drift">
        <g class="nettle-tentacles" stroke="url(#${id}-thread)" stroke-width="1.25" stroke-linecap="round">
          <path d="M111 150C79 213 139 237 104 294S113 371 86 421"/><path d="M130 162C91 232 156 258 129 321S132 401 113 454"/>
          <path d="M150 170C123 224 165 279 143 330S162 397 145 456"/><path d="M174 172C146 248 192 262 171 330S179 409 165 449"/>
          <path d="M221 174C251 242 207 275 239 335S219 398 242 461"/><path d="M245 169C280 226 228 270 269 325S259 394 285 443"/>
          <path d="M269 162C307 223 261 257 295 312S288 384 321 421"/><path d="M286 149C335 195 291 242 324 286S324 358 342 385"/>
        </g>
        <g class="nettle-arms" fill="url(#${id}-arm)">
          <path d="M169 155C148 184 180 211 159 237S172 276 158 307S194 355 167 395C211 366 177 337 193 310S176 265 196 238S171 201 195 165Z"/>
          <path d="M198 154C184 193 220 210 197 248S230 293 208 324S229 374 212 419C247 389 225 356 245 330S214 279 237 250S205 208 229 166Z"/>
          <path d="M232 158C213 192 249 220 231 248S265 288 250 323S274 369 263 394C295 357 270 328 281 304S253 262 266 238S238 196 259 159Z"/>
        </g>
        <g class="nettle-bell">
          <path d="M96 149C99 95 132 59 185 52C246 44 294 84 304 145C284 163 267 153 251 166C232 159 220 174 201 168C181 177 170 161 151 165C131 151 114 165 96 149Z" fill="url(#${id}-bell)" stroke="#d5eee4" stroke-opacity=".5"/>
          <path d="M97 149C132 119 260 119 304 145" stroke="#fbe0d4" stroke-opacity=".65" stroke-width="1.6"/>
          <ellipse cx="200" cy="146" rx="89" ry="15" fill="#b8dccb" fill-opacity=".07" stroke="#c9e6d6" stroke-opacity=".26"/>
          <g stroke="#ffe0d8" stroke-opacity=".3"><path d="M188 53C146 83 139 107 138 137"/><path d="M193 54C179 84 171 108 173 133"/><path d="M205 53C229 79 236 106 234 134"/><path d="M211 55C260 79 276 111 279 138"/></g>
          <path d="M121 112C130 87 151 72 174 68" stroke="#fff5e9" stroke-opacity=".74" stroke-width="3" stroke-linecap="round"/>
          <g fill="#f2d4d0" fill-opacity=".4"><ellipse cx="179" cy="119" rx="13" ry="6" transform="rotate(-25 179 119)"/><ellipse cx="203" cy="111" rx="11" ry="6"/><ellipse cx="225" cy="121" rx="12" ry="6" transform="rotate(25 225 121)"/></g>
        </g>
      </g>
    </svg>`;
  }
  function agentCard({compact=false}={}){
    return `<section class="ocean-card agent-habitat ${compact?'is-compact':''}" data-ocean-reveal aria-label="دېڭىز چايىنى شەكلىدىكى ئاگېنت ھالەت كۆرسەتكۈچى">
      <div class="habitat-topline"><span class="ocean-overline">جانلىق ئاگېنت</span><span class="habitat-id" dir="ltr">NETTLE / 01</span></div>
      <div class="orb-stage"><div class="orb-halo"></div><div class="fisheye-orb"><div class="orb-latitude"></div>${nettle()}<i class="orb-glint glint-one"></i><i class="orb-glint glint-two"></i><div class="orb-dust"><i></i><i></i><i></i><i></i><i></i></div></div><div class="orb-shadow"></div></div>
      <div class="habitat-caption"><div><span class="agent-status-light" aria-hidden="true"></span><span data-agent-state-label>${stateLabels.idle}</span></div><span class="habitat-medium">ھالەت تەسۋىرى</span></div>
    </section>`;
  }
  function pearlCard(){
    return `<section class="ocean-card pearl-card" data-ocean-reveal><div class="pearl-heading"><span class="ocean-overline">تاللاش ۋە ئىنكاس</span><span class="pearl-badge">تەقلىدىي ھالەت</span></div><div class="pearl-content"><button type="button" class="listening-pearl" data-pearl-listen aria-label="ئاگېنتنىڭ ئىنكاسىنى سىناش"><span class="pearl-ring"></span><span class="pearl-core"></span></button><div><h2>بىر تاللاش. بىر يېڭى قەدەم.</h2><p data-pearl-message>مەرۋايىتنى چېكىپ، ئاگېنتنىڭ ئىنكاسىنى كۆرۈڭ.</p></div></div><div class="pearl-bottom"><span>ئاۋاز خاتىرىلەنمەيدۇ</span><span class="ocean-wave" aria-hidden="true">${'<i></i>'.repeat(14)}</span></div></section>`;
  }
  function depthCard({completed=0,total=18}={}){
    return `<section class="ocean-card depth-card" data-ocean-reveal><div class="pearl-heading"><span class="ocean-overline">ئۆگىنىش چوڭقۇرلۇقى</span><bdi class="depth-total" dir="ltr"><span data-ocean-completed>${completed}</span> / ${total}</bdi></div><div class="depth-track" aria-hidden="true">${Array.from({length:total},(_,i)=>`<span data-depth-mark="${i+1}" class="${i<completed?'is-lit':''}" style="--depth-order:${i}"></span>`).join('')}</div><div class="depth-footer"><p>ھەر بىر تاماملانغان دەرس — تېخىمۇ چوڭقۇر بىر قەدەم.</p><button type="button" data-open-progress class="depth-progress-button">تەرەققىياتنى كۆرۈش</button></div></section>`;
  }
  function setState(state='idle',message){
    document.body.dataset.agentState=state;
    document.querySelectorAll('[data-agent-state-label]').forEach(el=>{el.textContent=stateLabels[state]||stateLabels.idle;});
    if(message)document.querySelectorAll('[data-pearl-message]').forEach(el=>{el.textContent=message;});
  }
  function sync({completed=[],total=18}={}){
    document.querySelectorAll('[data-ocean-completed]').forEach(el=>el.textContent=completed.length);
    document.querySelectorAll('[data-depth-mark]').forEach((el,i)=>el.classList.toggle('is-lit',i<completed.length));
    document.querySelectorAll('[data-depth-fill]').forEach(el=>el.style.setProperty('--depth-progress',`${completed.length/total*100}%`));
  }
  function mount(){
    clearTimeout(feedbackTimer);resetTilt();observer?.disconnect();
    const cards=document.querySelectorAll('#pageContent [data-ocean-reveal],#pageContent .home-lesson-card,#pageContent .course-path>div,#pageContent .learning-bridge,#pageContent .lesson-explanation,#pageContent .learning-objective,#pageContent .demo-panel,#pageContent .quiz-panel');
    if(!('IntersectionObserver' in window))return;
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('ocean-visible');observer.unobserve(entry.target);}}),{threshold:.06});
    cards.forEach((el,i)=>{el.classList.add('ocean-reveal');el.style.setProperty('--rise-delay',`${i%5*75}ms`);observer.observe(el);});
  }
  function setupAmbient(){
    const ambient=document.querySelector('.ambient');if(!ambient)return;
    const rays=document.createElement('div');rays.className='ocean-rays';
    const motes=document.createElement('div');motes.className='ocean-motes';
    for(let i=0;i<24;i++){const dot=document.createElement('i');dot.style.cssText=`--x:${i*37.17%100}%;--y:${i*63.31%100}%;--size:${i%3+1}px;--duration:${18+i%9*3}s;--delay:-${i*.93}s`;motes.append(dot);}
    ambient.append(rays,motes);
  }
  const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');let tilted=null,tiltFrame=null;
  function resetTilt(){if(tiltFrame)cancelAnimationFrame(tiltFrame);tiltFrame=null;if(!tilted)return;tilted.style.removeProperty('--ocean-rx');tilted.style.removeProperty('--ocean-ry');tilted=null;}
  document.addEventListener('pointermove',event=>{
    if(!fine.matches||reduced.matches||document.body.classList.contains('motion-paused'))return;
    const card=event.target.closest('.home-lesson-card,.agent-habitat,.pearl-card');if(!card){resetTilt();return;}
    if(tilted!==card){resetTilt();tilted=card;}if(tiltFrame)cancelAnimationFrame(tiltFrame);
    const x=event.clientX,y=event.clientY;tiltFrame=requestAnimationFrame(()=>{if(!card.isConnected)return;const r=card.getBoundingClientRect();card.style.setProperty('--ocean-rx',`${-(y-r.top-r.height/2)/r.height*3}deg`);card.style.setProperty('--ocean-ry',`${(x-r.left-r.width/2)/r.width*3}deg`);});
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(tilted&&!tilted.contains(event.relatedTarget))resetTilt();});
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-pearl-listen]')){
      clearTimeout(feedbackTimer);setState('listening','تاللىشىڭىز قوبۇل قىلىندى. ھازىر بىر دەرسنى ئېچىپ سىناپ بېقىڭ.');
      document.querySelector('.pearl-card')?.classList.add('pearl-responding');feedbackTimer=setTimeout(()=>{document.querySelector('.pearl-card')?.classList.remove('pearl-responding');setState('idle');},2200);
    }
    if(event.target.closest('#motionButton'))resetTilt();
  });
  reduced.addEventListener('change',resetTilt);document.addEventListener('visibilitychange',()=>{if(document.hidden)resetTilt();});
  window.AgentOcean={agentCard,pearlCard,depthCard,setState,sync,mount};setupAmbient();
})();
