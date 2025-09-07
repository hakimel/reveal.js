// code-playground.js
(function initPlayground(){
  const tabs = document.querySelectorAll('.tab');
  const out = document.getElementById('pg-output');
  const btnRun = document.getElementById('pg-run');
  const btnReset = document.getElementById('pg-reset');
  const btnShare = document.getElementById('pg-share');

  const edHTML = CodeMirror.fromTextArea(document.getElementById('ed-html'), {mode:'xml', lineNumbers:true});
  const edCSS  = CodeMirror.fromTextArea(document.getElementById('ed-css'),  {mode:'css', lineNumbers:true});
  const edJS   = CodeMirror.fromTextArea(document.getElementById('ed-js'),   {mode:'javascript', lineNumbers:true});

  function updateOutput(){
    const doc = `<!doctype html><html><head><style>${edCSS.getValue()}</style></head><body>
    ${edHTML.getValue()}
    <script>${edJS.getValue()}<\/script>
    </body></html>`;
    out.srcdoc = doc;
  }

  tabs.forEach(t=>t.addEventListener('click', ()=>{
    document.querySelector('.tab.active')?.classList.remove('active');
    t.classList.add('active');
  }));

  btnRun?.addEventListener('click', updateOutput);
  btnReset?.addEventListener('click', ()=>{
    edHTML.setValue('<div class="card">\n  <h3>Hello, Reveal!</h3>\n  <p>Change me and press Run ▶</p>\n  <button onclick="alert(\'Hi!\')">Click</button>\n</div>');
    edCSS.setValue('.card{font-family:system-ui;padding:1rem;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 6px 16px rgba(0,0,0,.08)}');
    edJS.setValue("console.log('Playground ready');");
    updateOutput();
  });
  btnShare?.addEventListener('click', ()=>{
    const payload = {h: edHTML.getValue(), c: edCSS.getValue(), j: edJS.getValue()};
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = location.origin + location.pathname + '#pg=' + b64;
    navigator.clipboard.writeText(url).then(()=> alert('Share link copied to clipboard!'));
  });

  // decode from URL hash if present
  const hash = location.hash.replace(/^#/, '');
  const m = hash.match(/pg=(.+)$/);
  if(m){
    try{
      const payload = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      edHTML.setValue(payload.h||'');
      edCSS.setValue(payload.c||'');
      edJS.setValue(payload.j||'');
    }catch(e){}
  }
  // initial run
  updateOutput();
})();
