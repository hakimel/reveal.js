import { createContext as E, useRef as m, useState as P, useEffect as w, useLayoutEffect as _, useContext as x, useMemo as z } from "react";
import { jsx as h } from "react/jsx-runtime";
import M from "reveal.js";
const B = E(null), T = [];
function G(e, t) {
  if (e === t) return !1;
  if (!e || !t) return e !== t;
  const n = Object.keys(e), s = Object.keys(t);
  if (n.length !== s.length) return !0;
  for (const l of n)
    if (!(l in t) || e[l] !== t[l])
      return !0;
  return !1;
}
function D(e, t) {
  e && (typeof e == "function" ? e(t) : typeof e == "object" && (e.current = t));
}
function Y({
  config: e,
  plugins: t = T,
  onReady: n,
  onSync: s,
  onSlideChange: l,
  onSlideTransitionEnd: o,
  onFragmentShown: a,
  onFragmentHidden: p,
  onOverviewShown: j,
  onOverviewHidden: k,
  onPaused: A,
  onResumed: S,
  deckRef: v,
  className: f,
  style: I,
  children: b
}) {
  const y = m(null), u = m(null), [i, L] = P(null), N = m(t), r = m(!1), d = m(e);
  return w(() => {
    if (u.current) return;
    let g = !0;
    const c = new M(y.current, {
      ...e,
      plugins: N.current
    });
    return d.current = e, u.current = c, c.initialize().then(() => {
      g && (L(c), n?.(c));
    }), () => {
      g = !1;
      try {
        c.destroy();
      } catch {
      }
      u.current = null, L(null);
    };
  }, []), w(() => (D(v, i), () => D(v, null)), [v, i]), w(() => {
    if (!i) return;
    const g = [
      ["sync", s],
      ["slidechanged", l],
      ["slidetransitionend", o],
      ["fragmentshown", a],
      ["fragmenthidden", p],
      ["overviewshown", j],
      ["overviewhidden", k],
      ["paused", A],
      ["resumed", S]
    ], c = [];
    for (const [C, R] of g)
      R && (i.on(C, R), c.push([C, R]));
    return () => {
      for (const [C, R] of c)
        i.off(C, R);
    };
  }, [
    i,
    s,
    l,
    o,
    a,
    p,
    j,
    k,
    A,
    S
  ]), _(() => {
    !i || !u.current?.isReady() || G(d.current, e) && (r.current = !0, u.current.configure({
      ...e
    }), d.current = e);
  }, [i, e]), _(() => {
    if (u.current?.isReady()) {
      if (r.current) {
        r.current = !1;
        return;
      }
      u.current.sync();
    }
  }, [i, b, e]), /* @__PURE__ */ h(B.Provider, { value: i, children: /* @__PURE__ */ h("div", { className: f ? `reveal ${f}` : "reveal", style: I, ref: y, children: /* @__PURE__ */ h("div", { className: "slides", children: b }) }) });
}
function q({ children: e, ...t }) {
  return /* @__PURE__ */ h("section", { ...t, children: e });
}
function H({ className: e, style: t, children: n }) {
  return /* @__PURE__ */ h("section", { className: e, style: t, children: n });
}
function J({
  animation: e,
  index: t,
  as: n = "span",
  className: s,
  style: l,
  children: o
}) {
  const a = ["fragment", e, s].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(n, { className: a, style: l, "data-fragment-index": t, children: o });
}
function K(e) {
  const t = e.replace(/\r\n/g, `
`).split(`
`);
  for (; t.length && t[0].trim().length === 0; ) t.shift();
  for (; t.length && t[t.length - 1].trim().length === 0; ) t.pop();
  if (!t.length) return "";
  const n = t.filter((s) => s.trim().length > 0).reduce(
    (s, l) => Math.min(s, l.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return t.map((s) => s.slice(n)).join(`
`);
}
function O(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((n) => {
    n !== e && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function Q({
  children: e,
  code: t,
  language: n,
  trim: s = !0,
  lineNumbers: l,
  startFrom: o,
  noEscape: a,
  codeClassName: p,
  codeStyle: j,
  codeProps: k,
  className: A,
  style: S,
  ...v
}) {
  const f = x(B), I = m(null), b = m(""), y = typeof t == "string" ? t : typeof e == "string" ? e : "", u = z(() => s ? K(y) : y, [y, s]), i = l === !0 ? "" : l === !1 || l == null ? void 0 : String(l), L = [n, p].filter(Boolean).join(" "), N = ["code-wrapper", A].filter(Boolean).join(" ");
  return _(() => {
    const r = I.current;
    if (!r || !f) return;
    const d = f.getPlugin?.("highlight");
    if (!d || typeof d.highlightBlock != "function") return;
    const g = [
      u,
      n || "",
      p || "",
      i == null ? "__none__" : `lineNumbers:${i}`,
      o == null ? "" : String(o),
      a ? "1" : "0"
    ].join("::");
    if (b.current === g && r.getAttribute("data-highlighted") === "yes")
      return;
    O(r), r.textContent = u, r.removeAttribute("data-highlighted"), r.classList.remove("hljs"), r.classList.remove("has-highlights"), i == null ? r.removeAttribute("data-line-numbers") : r.setAttribute("data-line-numbers", i), o == null ? r.removeAttribute("data-ln-start-from") : r.setAttribute("data-ln-start-from", String(o)), a ? r.setAttribute("data-noescape", "") : r.removeAttribute("data-noescape"), d.highlightBlock(r);
    const c = typeof r.closest == "function" ? r.closest("section") : null;
    c && typeof f.syncSlide == "function" && f.syncSlide(c), b.current = g;
  }, [f, u, n, p, i, o, a]), /* @__PURE__ */ h("pre", { className: N, style: S, ...v, children: /* @__PURE__ */ h(
    "code",
    {
      ...k,
      ref: I,
      className: L || void 0,
      style: j,
      "data-line-numbers": i,
      "data-ln-start-from": o,
      "data-noescape": a ? "" : void 0,
      children: u
    }
  ) });
}
function W() {
  return x(B);
}
export {
  Q as Code,
  Y as Deck,
  J as Fragment,
  B as RevealContext,
  q as Slide,
  H as Stack,
  W as useReveal
};
