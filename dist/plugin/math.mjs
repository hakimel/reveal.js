const M = () => {
  let a, s = {
    version: "latest",
    delimiters: [
      { left: "$$", right: "$$", display: !0 },
      // Note: $$ has to come before $
      { left: "$", right: "$", display: !1 },
      { left: "\\(", right: "\\)", display: !1 },
      { left: "\\[", right: "\\]", display: !0 }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"]
  };
  const r = (t) => {
    let n = document.createElement("link");
    n.rel = "stylesheet", n.href = t, document.head.appendChild(n);
  }, o = (t) => new Promise((n, i) => {
    const l = document.createElement("script");
    l.type = "text/javascript", l.onload = n, l.onerror = i, l.src = t, document.head.append(l);
  });
  async function e(t) {
    for (const n of t)
      await o(n);
  }
  return {
    id: "katex",
    init: function(t) {
      a = t;
      let n = a.getConfig().katex || {}, i = { ...s, ...n };
      const { local: l, version: u, extensions: k, ...m } = i;
      let p = i.local || "https://cdn.jsdelivr.net/npm/katex", c = i.local ? "" : "@" + i.version, f = p + c + "/dist/katex.min.css", y = p + c + "/dist/katex.min.js", j = p + c + "/dist/contrib/mhchem.min.js", g = p + c + "/dist/contrib/auto-render.min.js", d = [y];
      i.extensions && i.extensions.includes("mhchem") && d.push(j), d.push(g);
      const h = () => {
        renderMathInElement(t.getSlidesElement(), m), a.layout();
      };
      r(f), e(d).then(() => {
        a.isReady() ? h() : a.on("ready", h.bind(this));
      });
    }
  };
}, x = () => {
  let a, s = {
    messageStyle: "none",
    tex2jax: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      skipTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    },
    skipStartupTypeset: !0
  };
  function r(o, e) {
    let t = document.querySelector("head"), n = document.createElement("script");
    n.type = "text/javascript", n.src = o;
    let i = () => {
      typeof e == "function" && (e.call(), e = null);
    };
    n.onload = i, n.onreadystatechange = () => {
      this.readyState === "loaded" && i();
    }, t.appendChild(n);
  }
  return {
    id: "mathjax2",
    init: function(o) {
      a = o;
      let e = a.getConfig().mathjax2 || a.getConfig().math || {}, t = { ...s, ...e }, n = t.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js", i = t.config || "TeX-AMS_HTML-full", l = n + "?config=" + i;
      t.tex2jax = { ...s.tex2jax, ...e.tex2jax }, t.mathjax = t.config = null, r(l, function() {
        MathJax.Hub.Config(t), MathJax.Hub.Queue(["Typeset", MathJax.Hub, a.getRevealElement()]), MathJax.Hub.Queue(a.layout), a.on("slidechanged", function(u) {
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, u.currentSlide]);
        });
      });
    }
  };
}, J = () => {
  let a, s = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]]
    },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    },
    startup: {
      ready: () => {
        MathJax.startup.defaultReady(), MathJax.startup.promise.then(() => {
          a.layout();
        });
      }
    }
  };
  function r(o, e) {
    let t = document.createElement("script");
    t.type = "text/javascript", t.id = "MathJax-script", t.src = o, t.async = !0, t.onload = () => {
      typeof e == "function" && (e.call(), e = null);
    }, document.head.appendChild(t);
  }
  return {
    id: "mathjax3",
    init: function(o) {
      a = o;
      let e = a.getConfig().mathjax3 || {}, t = { ...s, ...e };
      t.tex = { ...s.tex, ...e.tex }, t.options = { ...s.options, ...e.options }, t.startup = { ...s.startup, ...e.startup };
      let n = t.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
      t.mathjax = null, window.MathJax = t, r(n, function() {
        a.addEventListener("slidechanged", function(i) {
          MathJax.typeset();
        });
      });
    }
  };
}, v = () => {
  let a, s = {
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]]
    },
    options: {
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"]
    },
    startup: {
      ready: () => {
        MathJax.startup.defaultReady(), MathJax.startup.promise.then(() => {
          a.layout();
        });
      }
    }
  };
  function r(o, e) {
    let t = document.createElement("script");
    t.type = "text/javascript", t.id = "MathJax-script", t.src = o, t.async = !0, t.onload = () => {
      typeof e == "function" && (e.call(), e = null);
    }, document.head.appendChild(t);
  }
  return {
    id: "mathjax4",
    init: function(o) {
      a = o;
      let e = a.getConfig().mathjax4 || {}, t = { ...s, ...e };
      t.tex = { ...s.tex, ...e.tex }, t.options = { ...s.options, ...e.options }, t.startup = { ...s.startup, ...e.startup };
      let n = t.mathjax || "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js";
      t.mathjax = null, window.MathJax = t, r(n, function() {
        MathJax.startup.promise.then(() => {
          MathJax.typeset(), a.addEventListener("slidechanged", function(i) {
            MathJax.typeset();
          });
        });
      });
    }
  };
}, S = x;
/*!
 * This plugin is a wrapper for the MathJax2,
 * MathJax3, MathJax4 and KaTeX typesetter plugins.
 */
const $ = Plugin = Object.assign(S(), {
  KaTeX: M,
  MathJax2: x,
  MathJax3: J,
  MathJax4: v
});
export {
  $ as default
};
