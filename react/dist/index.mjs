import { createContext as E, useRef as g, useState as P, useEffect as N, useLayoutEffect as _, useContext as D, useMemo as z } from "react";
import { jsx as h } from "react/jsx-runtime";
import M from "reveal.js";
const w = E(null), T = [];
function B(e, t) {
  e && (typeof e == "function" ? e(t) : typeof e == "object" && (e.current = t));
}
function q({
  config: e,
  plugins: t = T,
  onReady: r,
  onSync: s,
  onSlideChange: u,
  onSlideTransitionEnd: o,
  onFragmentShown: a,
  onFragmentHidden: p,
  onOverviewShown: C,
  onOverviewHidden: j,
  onPaused: x,
  onResumed: S,
  deckRef: y,
  className: f,
  style: k,
  children: b
}) {
  const v = g(null), l = g(null), [i, I] = P(null), L = g(t), n = g(!1), d = g(e);
  return N(() => {
    if (l.current) return;
    let m = !0;
    const c = new M(v.current, {
      ...e,
      plugins: L.current
    });
    return d.current = e, l.current = c, c.initialize().then(() => {
      m && (I(c), r?.(c));
    }), () => {
      m = !1;
      try {
        c.destroy();
      } catch {
      }
      l.current = null, I(null);
    };
  }, []), N(() => (B(y, i), () => B(y, null)), [y, i]), N(() => {
    if (!i) return;
    const m = [
      ["sync", s],
      ["slidechanged", u],
      ["slidetransitionend", o],
      ["fragmentshown", a],
      ["fragmenthidden", p],
      ["overviewshown", C],
      ["overviewhidden", j],
      ["paused", x],
      ["resumed", S]
    ], c = [];
    for (const [R, A] of m)
      A && (i.on(R, A), c.push([R, A]));
    return () => {
      for (const [R, A] of c)
        i.off(R, A);
    };
  }, [
    i,
    s,
    u,
    o,
    a,
    p,
    C,
    j,
    x,
    S
  ]), _(() => {
    !i || !l.current?.isReady() || d.current !== e && (n.current = !0, l.current.configure({
      ...e
    }), d.current = e);
  }, [i, e]), _(() => {
    if (l.current?.isReady()) {
      if (n.current) {
        n.current = !1;
        return;
      }
      l.current.sync();
    }
  }, [i, b, e]), /* @__PURE__ */ h(w.Provider, { value: i, children: /* @__PURE__ */ h("div", { className: f ? `reveal ${f}` : "reveal", style: k, ref: v, children: /* @__PURE__ */ h("div", { className: "slides", children: b }) }) });
}
function H({ children: e, ...t }) {
  return /* @__PURE__ */ h("section", { ...t, children: e });
}
function J({ className: e, style: t, children: r }) {
  return /* @__PURE__ */ h("section", { className: e, style: t, children: r });
}
function K({
  animation: e,
  index: t,
  as: r = "span",
  className: s,
  style: u,
  children: o
}) {
  const a = ["fragment", e, s].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(r, { className: a, style: u, "data-fragment-index": t, children: o });
}
function G(e) {
  const t = e.replace(/\r\n/g, `
`).split(`
`);
  for (; t.length && t[0].trim().length === 0; ) t.shift();
  for (; t.length && t[t.length - 1].trim().length === 0; ) t.pop();
  if (!t.length) return "";
  const r = t.filter((s) => s.trim().length > 0).reduce(
    (s, u) => Math.min(s, u.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return t.map((s) => s.slice(r)).join(`
`);
}
function U(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((r) => {
    r !== e && r instanceof HTMLElement && r.tagName === "CODE" && r.classList.contains("fragment") && r.remove();
  });
}
function O({
  children: e,
  code: t,
  language: r,
  trim: s = !0,
  lineNumbers: u,
  startFrom: o,
  noEscape: a,
  codeClassName: p,
  codeStyle: C,
  codeProps: j,
  className: x,
  style: S,
  ...y
}) {
  const f = D(w), k = g(null), b = g(""), v = typeof t == "string" ? t : typeof e == "string" ? e : "", l = z(() => s ? G(v) : v, [v, s]), i = u === !0 ? "" : u === !1 || u == null ? void 0 : String(u), I = [r, p].filter(Boolean).join(" "), L = ["code-wrapper", x].filter(Boolean).join(" ");
  return _(() => {
    const n = k.current;
    if (!n || !f) return;
    const d = f.getPlugin?.("highlight");
    if (!d || typeof d.highlightBlock != "function") return;
    const m = [
      l,
      r || "",
      p || "",
      i == null ? "__none__" : `lineNumbers:${i}`,
      o == null ? "" : String(o),
      a ? "1" : "0"
    ].join("::");
    if (b.current === m && n.getAttribute("data-highlighted") === "yes")
      return;
    U(n), n.textContent = l, n.removeAttribute("data-highlighted"), n.classList.remove("hljs"), n.classList.remove("has-highlights"), i == null ? n.removeAttribute("data-line-numbers") : n.setAttribute("data-line-numbers", i), o == null ? n.removeAttribute("data-ln-start-from") : n.setAttribute("data-ln-start-from", String(o)), a ? n.setAttribute("data-noescape", "") : n.removeAttribute("data-noescape"), d.highlightBlock(n);
    const c = typeof n.closest == "function" ? n.closest("section") : null;
    c && typeof f.syncSlide == "function" && f.syncSlide(c), b.current = m;
  }, [f, l, r, p, i, o, a]), /* @__PURE__ */ h("pre", { className: L, style: S, ...y, children: /* @__PURE__ */ h(
    "code",
    {
      ...j,
      ref: k,
      className: I || void 0,
      style: C,
      "data-line-numbers": i,
      "data-ln-start-from": o,
      "data-noescape": a ? "" : void 0,
      children: l
    }
  ) });
}
function Q() {
  return D(w);
}
export {
  O as Code,
  q as Deck,
  K as Fragment,
  w as RevealContext,
  H as Slide,
  J as Stack,
  Q as useReveal
};
