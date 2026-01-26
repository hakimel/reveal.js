
/* RevealTerminal: simple simulated CLI */
var RevealTerminal = window.RevealTerminal || (function(){
  const { el, keyToggle } = window.RTP_SHARED;
  let history = [], histIdx = -1;

  function build(){
    const box = el('div', { class: 'rtp-term', id: 'rtp-term' }, [
      el('div', { class: 'rtp-term-header' }, [
        el('div', { class: 'rtp-term-title' }, 'Reveal Terminal'),
        el('div', { class: 'rtp-term-actions' }, [
          el('button', { class:'rtp-small-btn', onclick: clearOut }, 'Clear'),
          el('button', { class:'rtp-small-btn', onclick: () => toggle(false) }, 'Close')
        ])
      ]),
      el('div', { class: 'rtp-term-body', id: 'rtp-term-body' }),
      el('input', { class: 'rtp-term-input', id: 'rtp-term-input', placeholder: 'Type a command (try: help)' })
    ]);
    document.body.appendChild(box);
    const input = box.querySelector('#rtp-term-input');
    input.addEventListener('keydown', onInputKey);
    return box;
  }

  function toggle(show){
    let t = document.getElementById('rtp-term');
    if (!t) t = build();
    t.style.display = (show ?? (t.style.display === 'none')) ? 'flex' : 'none';
    if (t.style.display === 'flex') t.querySelector('#rtp-term-input').focus();
  }

  function out(text){
    const body = document.getElementById('rtp-term-body');
    body.appendChild(el('div', { class: 'rtp-term-row' }, text));
    body.scrollTop = body.scrollHeight;
  }
  function clearOut(){ document.getElementById('rtp-term-body').innerHTML = ''; }

  function onInputKey(e){
    const input = e.target;
    if (e.key === 'Enter'){
      const cmd = input.value.trim();
      if (!cmd) return;
      history.push(cmd); histIdx = history.length;
      out(el('span', { class: 'rtp-term-prompt' }, `> ${cmd}`));
      input.value='';
      execute(cmd);
    } else if (e.key === 'ArrowUp'){
      if (histIdx > 0){ histIdx--; input.value = history[histIdx]; setTimeout(()=>input.setSelectionRange(input.value.length, input.value.length),0); }
      e.preventDefault();
    } else if (e.key === 'ArrowDown'){
      if (histIdx < history.length-1){ histIdx++; input.value = history[histIdx]; } else { input.value=''; histIdx = history.length; }
      e.preventDefault();
    }
  }

  function execute(cmd){
    const [head, ...rest] = cmd.split(' ');
    const argstr = rest.join(' ');
    switch(head){
      case 'help':
        out([
          'Commands:',
          '  help                 Show this help',
          '  echo <text>          Print text',
          '  theme <name>         Switch theme (minimal-dark, neon-night, solarized-plus, aurora, paper, oceanic)',
          '  palette set <hue>    Set accent hue (0-360)',
          '  js <code>            Run JS in slide context',
          '  date                 Show current date/time',
          '  history              Show entered commands',
          '  clear                Clear the terminal'
        ].join('\\n'));
        break;
      case 'echo':
        out(argstr);
        break;
      case 'theme':
        if (argstr) {
          const link = document.getElementById('rtp-theme-link') || document.createElement('link');
          link.id = 'rtp-theme-link'; link.rel='stylesheet'; link.href=`./plugin/themes/${argstr}.css`;
          if (!link.parentNode) document.head.appendChild(link);
          document.documentElement.setAttribute('data-rtp-theme', argstr);
          localStorage.setItem('rtp-theme', argstr);
          out('Theme switched to ' + argstr);
        } else out('Usage: theme <name>');
        break;
      case 'palette':
        if (rest[0] === 'set' && rest[1]){
          const hue = Number(rest[1]);
          document.documentElement.style.setProperty('--rtp-accent-h', hue);
          localStorage.setItem('rtp-hue', hue);
          out('Hue set to ' + hue);
        } else {
          out('Usage: palette set <hue>');
        }
        break;
      case 'js':
        try {
          const res = window.eval(argstr);
          out(String(res));
        } catch (e){
          out(String(e));
        }
        break;
      case 'date':
        out(new Date().toString());
        break;
      case 'history':
        out(history.map((c,i)=>`${i+1}: ${c}`).join('\\n'));
        break;
      case 'clear':
        clearOut();
        break;
      default:
        out('Unknown command. Try "help".');
    }
  }

  function mountButton(){
    const bar = document.querySelector('.rtp-floating');
    const btn = el('button', { class: 'rtp-btn', onclick: () => toggle() }, 'Terminal');
    if (bar) bar.appendChild(btn); else document.body.appendChild(el('div', { class: 'rtp-floating' }, [btn]));
    keyToggle('`', () => btn.click());
  }

  return {
    id: 'Terminal',
    init: function(deck){
      mountButton();
    }
  };
})();
