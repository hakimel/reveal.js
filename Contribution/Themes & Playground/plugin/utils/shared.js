
/* Shared helpers for all plugins */
(function () {
  const NS = 'rtp'; // reveal themes playground
  const BUS = document.createElement('div');
  BUS.id = 'rtp-bus';
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('rtp-bus')) document.body.appendChild(BUS);
  });

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else if (k === 'style') Object.assign(e.style, v);
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.substring(2), v);
      else e.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function hsl(h, s, l) { return `hsl(${h}deg ${s}% ${l}%)`; }

  function setCSSVars(vars) {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function keyToggle(key, handler) {
    document.addEventListener('keydown', (e) => {
      if (e.key === key && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handler();
      }
    });
  }

  window.RTP_SHARED = { NS, BUS, el, hsl, setCSSVars, keyToggle };
})();
