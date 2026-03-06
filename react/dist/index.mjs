import { createContext as O, useRef as f, useState as U, useEffect as L, useLayoutEffect as _, useContext as P, useMemo as M } from "react";
import { jsx as h } from "react/jsx-runtime";
import z from "reveal.js";
const w = O(null), G = [];
function q(t, e) {
  if (t === e) return !1;
  if (!t || !e) return t !== e;
  const n = Object.keys(t), s = Object.keys(e);
  if (n.length !== s.length) return !0;
  for (const i of n)
    if (!(i in e) || t[i] !== e[i])
      return !0;
  return !1;
}
function x(t, e) {
  t && (typeof t == "function" ? t(e) : t.current = e);
}
function Q({
  config: t,
  plugins: e = G,
  onReady: n,
  onSync: s,
  onSlideSync: i,
  onSlideChange: c,
  onSlideTransitionEnd: l,
  onFragmentShown: g,
  onFragmentHidden: R,
  onOverviewShown: v,
  onOverviewHidden: C,
  onPaused: j,
  onResumed: D,
  deckRef: d,
  className: k,
  style: I,
  children: S
}) {
  const m = f(null), r = f(null), [a, N] = U(null), u = f(e), y = f(!1), b = f(t), p = f(!1), B = f(0);
  return L(() => {
    if (p.current = !0, B.current += 1, r.current)
      r.current.isReady() && N(r.current);
    else {
      const o = new z(m.current, {
        ...t,
        plugins: u.current
      });
      b.current = t, r.current = o, o.initialize().then(() => {
        !p.current || r.current !== o || (N(o), n?.(o));
      });
    }
    return () => {
      p.current = !1;
      const o = r.current;
      if (!o) return;
      const T = ++B.current;
      Promise.resolve().then(() => {
        if (!(p.current || B.current !== T) && r.current === o) {
          try {
            o.destroy();
          } catch {
          }
          r.current === o && (r.current = null);
        }
      });
    };
  }, []), L(() => (x(d, a), () => x(d, null)), [d, a]), L(() => {
    if (!a) return;
    const T = [
      ["sync", s],
      ["slidesync", i],
      ["slidechanged", c],
      ["slidetransitionend", l],
      ["fragmentshown", g],
      ["fragmenthidden", R],
      ["overviewshown", v],
      ["overviewhidden", C],
      ["paused", j],
      ["resumed", D]
    ].filter((A) => A[1] != null);
    for (const [A, E] of T)
      a.on(A, E);
    return () => {
      for (const [A, E] of T)
        a.off(A, E);
    };
  }, [
    a,
    s,
    i,
    c,
    l,
    g,
    R,
    v,
    C,
    j,
    D
  ]), _(() => {
    !a || !r.current?.isReady() || q(b.current, t) && (y.current = !0, r.current.configure(t ?? {}), b.current = t);
  }, [a, t]), _(() => {
    const o = y.current;
    y.current = !1, r.current?.isReady() && !o && r.current.sync();
  }, [a, S, t]), /* @__PURE__ */ h(w.Provider, { value: a, children: /* @__PURE__ */ h("div", { className: k ? `reveal ${k}` : "reveal", style: I, ref: m, children: /* @__PURE__ */ h("div", { className: "slides", children: S }) }) });
}
const K = "[]";
function V(t) {
  return JSON.stringify(
    Object.entries(t).filter(([e]) => e.startsWith("data-")).sort(([e], [n]) => e.localeCompare(n))
  );
}
function X({ children: t, ...e }) {
  const n = P(w), s = f(null), i = f(null), c = f(null), l = M(() => V(e), [e]);
  return _(() => {
    if (!n || !s.current || typeof n.syncSlide != "function" || !(i.current !== null || c.current !== null) && l === K) return;
    const R = i.current === n, v = c.current === l;
    R && v || (n.syncSlide(s.current), i.current = n, c.current = l);
  }, [n, l]), /* @__PURE__ */ h("section", { ref: s, ...e, children: t });
}
function Z({ className: t, style: e, children: n }) {
  return /* @__PURE__ */ h("section", { className: t, style: e, children: n });
}
function F({
  animation: t,
  index: e,
  as: n = "span",
  className: s,
  style: i,
  children: c
}) {
  const l = ["fragment", t, s].filter(Boolean).join(" ");
  return /* @__PURE__ */ h(n, { className: l, style: i, "data-fragment-index": e, children: c });
}
function Y(t) {
  const e = t.replace(/\r\n/g, `
`).split(`
`);
  for (; e.length && e[0].trim().length === 0; ) e.shift();
  for (; e.length && e[e.length - 1].trim().length === 0; ) e.pop();
  if (!e.length) return "";
  const n = e.filter((s) => s.trim().length > 0).reduce(
    (s, i) => Math.min(s, i.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return e.map((s) => s.slice(n)).join(`
`);
}
function $(t) {
  const e = t.parentElement;
  e && Array.from(e.children).forEach((n) => {
    n !== t && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function ee({
  children: t,
  code: e,
  language: n,
  trim: s = !0,
  lineNumbers: i,
  startFrom: c,
  noEscape: l,
  codeClassName: g,
  codeStyle: R,
  codeProps: v,
  className: C,
  style: j,
  ...D
}) {
  const d = P(w), k = f(null), I = f(""), S = typeof e == "string" ? e : typeof t == "string" ? t : "", m = M(() => s ? Y(S) : S, [S, s]), r = i === !0 ? "" : i === !1 || i == null ? void 0 : String(i), a = [n, g].filter(Boolean).join(" "), N = ["code-wrapper", C].filter(Boolean).join(" ");
  return _(() => {
    const u = k.current;
    if (!u || !d) return;
    const y = d.getPlugin?.("highlight");
    if (!y || typeof y.highlightBlock != "function") return;
    const b = [
      m,
      n || "",
      g || "",
      r == null ? "__none__" : `lineNumbers:${r}`,
      c == null ? "" : String(c),
      l ? "1" : "0"
    ].join("::");
    if (I.current === b && u.getAttribute("data-highlighted") === "yes")
      return;
    $(u), u.textContent = m, u.removeAttribute("data-highlighted"), u.classList.remove("hljs"), u.classList.remove("has-highlights"), r == null ? u.removeAttribute("data-line-numbers") : u.setAttribute("data-line-numbers", r), c == null ? u.removeAttribute("data-ln-start-from") : u.setAttribute("data-ln-start-from", String(c)), l ? u.setAttribute("data-noescape", "") : u.removeAttribute("data-noescape"), y.highlightBlock(u);
    const p = typeof u.closest == "function" ? u.closest("section") : null;
    p && typeof d.syncSlide == "function" && d.syncSlide(p), I.current = b;
  }, [d, m, n, g, r, c, l]), /* @__PURE__ */ h("pre", { className: N, style: j, ...D, children: /* @__PURE__ */ h(
    "code",
    {
      ...v,
      ref: k,
      className: a || void 0,
      style: R,
      "data-line-numbers": r,
      "data-ln-start-from": c,
      "data-noescape": l ? "" : void 0,
      children: m
    }
  ) });
}
function te() {
  return P(w);
}
export {
  ee as Code,
  Q as Deck,
  F as Fragment,
  w as RevealContext,
  X as Slide,
  Z as Stack,
  te as useReveal
};
