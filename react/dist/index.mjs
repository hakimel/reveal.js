import { createContext as O, useRef as f, useState as U, useEffect as B, useLayoutEffect as _, useContext as P, useMemo as M } from "react";
import { jsx as g } from "react/jsx-runtime";
import z from "reveal.js";
const w = O(null), G = [];
function q(t, e) {
  if (t === e) return !1;
  if (!t || !e) return t !== e;
  const n = Object.keys(t), i = Object.keys(e);
  if (n.length !== i.length) return !0;
  for (const r of n)
    if (!(r in e) || t[r] !== e[r])
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
  onSync: i,
  onSlideSync: r,
  onSlideChange: c,
  onSlideTransitionEnd: l,
  onFragmentShown: d,
  onFragmentHidden: R,
  onOverviewShown: v,
  onOverviewHidden: C,
  onPaused: j,
  onResumed: D,
  deckRef: h,
  className: k,
  style: I,
  children: b
}) {
  const m = f(null), s = f(null), [a, N] = U(null), u = f(e), y = f(!1), A = f(t), p = f(!1), E = f(0);
  return B(() => {
    if (p.current = !0, E.current += 1, s.current)
      s.current.isReady() && N(s.current);
    else {
      const o = new z(m.current, {
        ...t,
        plugins: u.current
      });
      A.current = t, s.current = o, o.initialize().then(() => {
        !p.current || s.current !== o || (N(o), n?.(o));
      });
    }
    return () => {
      p.current = !1;
      const o = s.current;
      if (!o) return;
      const T = ++E.current;
      Promise.resolve().then(() => {
        if (!(p.current || E.current !== T) && s.current === o) {
          try {
            o.destroy();
          } catch {
          }
          s.current === o && (s.current = null);
        }
      });
    };
  }, []), B(() => (x(h, a), () => x(h, null)), [h, a]), B(() => {
    if (!a) return;
    const T = [
      ["sync", i],
      ["slidesync", r],
      ["slidechanged", c],
      ["slidetransitionend", l],
      ["fragmentshown", d],
      ["fragmenthidden", R],
      ["overviewshown", v],
      ["overviewhidden", C],
      ["paused", j],
      ["resumed", D]
    ].filter((S) => S[1] != null);
    for (const [S, L] of T)
      a.on(S, L);
    return () => {
      for (const [S, L] of T)
        a.off(S, L);
    };
  }, [
    a,
    i,
    r,
    c,
    l,
    d,
    R,
    v,
    C,
    j,
    D
  ]), _(() => {
    !a || !s.current?.isReady() || q(A.current, t) && (y.current = !0, s.current.configure(t ?? {}), A.current = t);
  }, [a, t]), _(() => {
    const o = y.current;
    y.current = !1, s.current?.isReady() && !o && s.current.sync();
  }, [a, b, t]), /* @__PURE__ */ g(w.Provider, { value: a, children: /* @__PURE__ */ g("div", { className: k ? `reveal ${k}` : "reveal", style: I, ref: m, children: /* @__PURE__ */ g("div", { className: "slides", children: b }) }) });
}
const K = "[]";
function V(t) {
  return JSON.stringify(
    Object.entries(t).filter(([e]) => e.startsWith("data-")).sort(([e], [n]) => e.localeCompare(n))
  );
}
function X({ children: t, ...e }) {
  const n = P(w), i = f(null), r = f(null), c = f(null), l = M(() => V(e), [e]);
  return _(() => {
    const d = i.current;
    if (!n || !d || typeof n.syncSlide != "function") return;
    if (r.current !== n) {
      r.current = n, c.current = l;
      return;
    }
    if (l === K) return;
    const R = r.current === n, v = c.current === l;
    R && v || (n.syncSlide(d), r.current = n, c.current = l);
  }, [n, l]), /* @__PURE__ */ g("section", { ref: i, ...e, children: t });
}
function Z({ className: t, style: e, children: n }) {
  return /* @__PURE__ */ g("section", { className: t, style: e, children: n });
}
function F({
  animation: t,
  index: e,
  as: n = "span",
  className: i,
  style: r,
  children: c
}) {
  const l = ["fragment", t, i].filter(Boolean).join(" ");
  return /* @__PURE__ */ g(n, { className: l, style: r, "data-fragment-index": e, children: c });
}
function Y(t) {
  const e = t.replace(/\r\n/g, `
`).split(`
`);
  for (; e.length && e[0].trim().length === 0; ) e.shift();
  for (; e.length && e[e.length - 1].trim().length === 0; ) e.pop();
  if (!e.length) return "";
  const n = e.filter((i) => i.trim().length > 0).reduce(
    (i, r) => Math.min(i, r.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return e.map((i) => i.slice(n)).join(`
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
  trim: i = !0,
  lineNumbers: r,
  startFrom: c,
  noEscape: l,
  codeClassName: d,
  codeStyle: R,
  codeProps: v,
  className: C,
  style: j,
  ...D
}) {
  const h = P(w), k = f(null), I = f(""), b = typeof e == "string" ? e : typeof t == "string" ? t : "", m = M(() => i ? Y(b) : b, [b, i]), s = r === !0 ? "" : r === !1 || r == null ? void 0 : String(r), a = [n, d].filter(Boolean).join(" "), N = ["code-wrapper", C].filter(Boolean).join(" ");
  return _(() => {
    const u = k.current;
    if (!u || !h) return;
    const y = h.getPlugin?.("highlight");
    if (!y || typeof y.highlightBlock != "function") return;
    const A = [
      m,
      n || "",
      d || "",
      s == null ? "__none__" : `lineNumbers:${s}`,
      c == null ? "" : String(c),
      l ? "1" : "0"
    ].join("::");
    if (I.current === A && u.getAttribute("data-highlighted") === "yes")
      return;
    $(u), u.textContent = m, u.removeAttribute("data-highlighted"), u.classList.remove("hljs"), u.classList.remove("has-highlights"), s == null ? u.removeAttribute("data-line-numbers") : u.setAttribute("data-line-numbers", s), c == null ? u.removeAttribute("data-ln-start-from") : u.setAttribute("data-ln-start-from", String(c)), l ? u.setAttribute("data-noescape", "") : u.removeAttribute("data-noescape"), y.highlightBlock(u);
    const p = typeof u.closest == "function" ? u.closest("section") : null;
    p && typeof h.syncFragments == "function" && h.syncFragments(p), I.current = A;
  }, [h, m, n, d, s, c, l]), /* @__PURE__ */ g("pre", { className: N, style: j, ...D, children: /* @__PURE__ */ g(
    "code",
    {
      ...v,
      ref: k,
      className: a || void 0,
      style: R,
      "data-line-numbers": s,
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
