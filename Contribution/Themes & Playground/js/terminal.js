// terminal.js
(function initTerminal(){
  const term = document.getElementById('term');
  if(!term) return;
  const out = document.getElementById('term-out');
  const inp = document.getElementById('term-in');

  const fs = {
    README: 'Themes & Playground — try commands: help, ls, cat README, theme set dark, palette new triad, run sample',
    'sample.html': '<h3>Sample</h3><p>Generated from terminal.</p>',
    'sample.css': '.sample{color:rebeccapurple}',
    'sample.js': 'console.log("Sample from terminal")'
  };

  const history = [];
  let hIndex = 0;

  function print(text){ 
    const line = document.createElement('div');
    line.className = 'term-line';
    line.textContent = text;
    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }
  function prompt(){ print('$ ' + inp.value) }

  const commands = {
    help(){
      print('Commands:');
      print('  help, ls, cat <file>, echo <text>, date, clear');
      print('  theme set <name>, palette new <mode>, run sample');
    },
    ls(){
      print(Object.keys(fs).join('  '));
    },
    cat(args){
      const f = args[0];
      if(fs[f]) print(fs[f]); else print('No such file: ' + f);
    },
    echo(args){
      print(args.join(' '));
    },
    date(){
      print(new Date().toString());
    },
    clear(){
      out.innerHTML='';
    },
    theme(args){
      if(args[0]==='set' && args[1]){
        const name = args[1];
        document.body.className = `theme-${name}`;
        localStorage.setItem('tp-theme', name);
        print('Theme set to ' + name);
      }else{
        print('Usage: theme set <light|dark|solarized|midnight|pastel>');
      }
    },
    palette(args){
      if(args[0]==='new' && args[1]){
        const mode = args[1];
        const base = '#6754e2';
        const cols = generatePalette(base, mode);
        localStorage.setItem('tp-palette-last', JSON.stringify(cols));
        print('Palette generated ('+mode+'): ' + cols.join(' '));
      }else{
        print('Usage: palette new <complementary|triad|tetrad|analogous|golden>');
      }
    },
    run(args){
      if(args[0]==='sample'){
        // load into playground if exists
        const fr = document.getElementById('pg-output');
        if(fr){
          fr.srcdoc = `<!doctype html><html><head><style>${fs['sample.css']}</style></head><body class="sample">
          ${fs['sample.html']}
          <script>${fs['sample.js']}<\/script>
          </body></html>`;
          print('Loaded sample into playground output.');
        }else{
          print('Playground not found.');
        }
      }else{
        print('Usage: run sample');
      }
    }
  };

  function handle(cmdline){
    const parts = cmdline.trim().split(/\s+/);
    const cmd = parts.shift() || '';
    if(!cmd) return;
    prompt();
    const fn = commands[cmd];
    if(fn) fn(parts);
    else print('Command not found: ' + cmd);
  }

  inp.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){
      const v = inp.value;
      history.push(v); hIndex = history.length;
      handle(v);
      inp.value='';
    }else if(e.key==='ArrowUp'){
      if(hIndex>0){ hIndex--; inp.value = history[hIndex] || ''; setTimeout(()=>inp.setSelectionRange(inp.value.length, inp.value.length)); }
      e.preventDefault();
    }else if(e.key==='ArrowDown'){
      if(hIndex < history.length){ hIndex++; inp.value = history[hIndex] || ''; setTimeout(()=>inp.setSelectionRange(inp.value.length, inp.value.length)); }
      e.preventDefault();
    }
  });

  // Greeting
  print('Welcome to TP-Terminal. Type `help` to start.');
})();
