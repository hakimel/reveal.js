const M = () => {
  let n, s = {
    version: "latest",
    delimiters: [
      { left: "$$", right: "$$", display: !0 },
      // Note: $$ has to come before $
      { left: "$", right: "$", display: !1 },
      { left: "\\(", right: "\\)", display: !1 },
      { left: "\\[", right: "\\]", display: !0 }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre"]
  };
  const r = (t) => {
    let e = document.createElement("link");
    e.rel = "stylesheet", e.href = t, document.head.appendChild(e);
  }, l = (t) => new Promise((e, i) => {
    const o = document.createElement("script");
    o.type = "text/javascript", o.onload = e, o.onerror = i, o.src = t, document.head.append(o);
  });
  async function a(t) {
    for (const e of t)
      await l(e);
  }
  return {
    id: "katex",
    init: function(t) {
      n = t;
      let e = n.getConfig().katex || {}, i = { ...s, ...e };
      const { local: o, version: u, extensions: k, ...m } = i;
      let c = i.local || "https://cdn.jsdelivr.net/npm/katex", d = i.local ? "" : "@" + i.version, f = c + d + "/dist/katex.min.css", y = c + d + "/dist/katex.min.js", g = c + d + "/dist/contrib/mhchem.min.js", j = c + d + "/dist/contrib/auto-render.min.js", p = [y];
      i.extensions && i.extensions.includes("mhchem") && p.push(g), p.push(j);
      const h = () => {
        renderMathInElement(t.getSlidesElement(), m), n.layout();
      };
      r(f), a(p).then(() => {
        n.isReady() ? h() : n.on("ready", h.bind(this));
      });
    }
  };
}, x = () => {
  let n, s = {
    messageStyle: "none",
    tex2jax: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      skipTags: ["script", "noscript", "style", "textarea", "pre"]
    },
    skipStartupTypeset: !0
  };
  function r(l, a) {
    let t = document.querySelector("head"), e = document.createElement("script");
    e.type = "text/javascript", e.src = l;
    let i = () => {
      typeof a == "function" && (a.call(), a = null);
    };
    e.onload = i, e.onreadystatechange = () => {
      this.readyState === "loaded" && i();
    }, t.appendChild(e);
  }
  return {
    id: "mathjax2",
    init: function(l) {
      n = l;
      let a = n.getConfig().mathjax2 || n.getConfig().math || {}, t = { ...s, ...a }, e = t.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js", i = t.config || "TeX-AMS_HTML-full", o = e + "?config=" + i;
      t.tex2jax = { ...s.tex2jax, ...a.tex2jax }, t.mathjax = t.config = null, r(o, function() {
        MathJax.Hub.Config(t), MathJax.Hub.Queue(["Typeset", MathJax.Hub, n.getRevealElement()]), MathJax.Hub.Queue(n.layout), n.on("slidechanged", function(u) {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, u.currentSlide]);
        });
      });
    }
  };
}, v = () => {
  let n, s = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]]
    },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"]
    },
    startup: {
      ready: () => {
        MathJax.startup.defaultReady(), MathJax.startup.promise.then(() => {
          n.layout();
        });
      }
    }
  };
  function r(l, a) {
    let t = document.createElement("script");
    t.type = "text/javascript", t.id = "MathJax-script", t.src = l, t.async = !0, t.onload = () => {
      typeof a == "function" && (a.call(), a = null);
    }, document.head.appendChild(t);
  }
  return {
    id: "mathjax3",
    init: function(l) {
      n = l;
      let a = n.getConfig().mathjax3 || {}, t = { ...s, ...a };
      t.tex = { ...s.tex, ...a.tex }, t.options = { ...s.options, ...a.options }, t.startup = { ...s.startup, ...a.startup };
      let e = t.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      t.mathjax = null, window.MathJax = t, r(e, function() {
        n.addEventListener("slidechanged", function(i) {
          MathJax.typeset();
        });
      });
    }
  };
}, J = x;
/*!
 * This plugin is a wrapper for the MathJax2,
 * MathJax3 and KaTeX typesetter plugins.
 */
const S = Plugin = Object.assign(J(), {
  KaTeX: M,
  MathJax2: x,
  MathJax3: v
});
export {
  S as default
};
