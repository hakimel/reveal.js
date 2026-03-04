import { createContext as z, useRef as f, useState as M, useEffect as B, useLayoutEffect as D, useContext as E, useMemo as T } from "react";
import { jsx as d } from "react/jsx-runtime";
import q from "reveal.js";
const P = z(null), G = [];
function K(e, t) {
  if (e === t) return !1;
  if (!e || !t) return e !== t;
  const n = Object.keys(e), u = Object.keys(t);
  if (n.length !== u.length) return !0;
  for (const c of n)
    if (!(c in t) || e[c] !== t[c])
      return !0;
  return !1;
}
function x(e, t) {
  e && (typeof e == "function" ? e(t) : typeof e == "object" && (e.current = t));
}
function H({
  config: e,
  plugins: t = G,
  onReady: n,
  onSync: u,
  onSlideChange: c,
  onSlideTransitionEnd: l,
  onFragmentShown: a,
  onFragmentHidden: p,
  onOverviewShown: k,
  onOverviewHidden: A,
  onPaused: S,
  onResumed: w,
  deckRef: R,
  className: h,
  style: I,
  children: b
}) {
  const y = f(null), s = f(null), [i, L] = M(null), _ = f(t), r = f(!1), g = f(e), m = f(!1), v = f(0);
  return B(() => {
    if (m.current = !0, v.current += 1, s.current)
      s.current.isReady() && L(s.current);
    else {
      const o = new q(y.current, {
        ...e,
        plugins: _.current
      });
      g.current = e, s.current = o, o.initialize().then(() => {
        !m.current || s.current !== o || (L(o), n?.(o));
      });
    }
    return () => {
      m.current = !1;
      const o = s.current;
      if (!o) return;
      const N = ++v.current;
      Promise.resolve().then(() => {
        if (!(m.current || v.current !== N) && s.current === o) {
          try {
            o.destroy();
          } catch {
          }
          s.current === o && (s.current = null);
        }
      });
    };
  }, []), B(() => (x(R, i), () => x(R, null)), [R, i]), B(() => {
    if (!i) return;
    const o = [
      ["sync", u],
      ["slidechanged", c],
      ["slidetransitionend", l],
      ["fragmentshown", a],
      ["fragmenthidden", p],
      ["overviewshown", k],
      ["overviewhidden", A],
      ["paused", S],
      ["resumed", w]
    ], N = [];
    for (const [C, j] of o)
      j && (i.on(C, j), N.push([C, j]));
    return () => {
      for (const [C, j] of N)
        i.off(C, j);
    };
  }, [
    i,
    u,
    c,
    l,
    a,
    p,
    k,
    A,
    S,
    w
  ]), D(() => {
    !i || !s.current?.isReady() || K(g.current, e) && (r.current = !0, s.current.configure({
      ...e
    }), g.current = e);
  }, [i, e]), D(() => {
    if (s.current?.isReady()) {
      if (r.current) {
        r.current = !1;
        return;
      }
      s.current.sync();
    }
  }, [i, b, e]), /* @__PURE__ */ d(P.Provider, { value: i, children: /* @__PURE__ */ d("div", { className: h ? `reveal ${h}` : "reveal", style: I, ref: y, children: /* @__PURE__ */ d("div", { className: "slides", children: b }) }) });
}
function J({ children: e, ...t }) {
  return /* @__PURE__ */ d("section", { ...t, children: e });
}
function Q({ className: e, style: t, children: n }) {
  return /* @__PURE__ */ d("section", { className: e, style: t, children: n });
}
function W({
  animation: e,
  index: t,
  as: n = "span",
  className: u,
  style: c,
  children: l
}) {
  const a = ["fragment", e, u].filter(Boolean).join(" ");
  return /* @__PURE__ */ d(n, { className: a, style: c, "data-fragment-index": t, children: l });
}
function O(e) {
  const t = e.replace(/\r\n/g, `
`).split(`
`);
  for (; t.length && t[0].trim().length === 0; ) t.shift();
  for (; t.length && t[t.length - 1].trim().length === 0; ) t.pop();
  if (!t.length) return "";
  const n = t.filter((u) => u.trim().length > 0).reduce(
    (u, c) => Math.min(u, c.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return t.map((u) => u.slice(n)).join(`
`);
}
function U(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((n) => {
    n !== e && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function X({
  children: e,
  code: t,
  language: n,
  trim: u = !0,
  lineNumbers: c,
  startFrom: l,
  noEscape: a,
  codeClassName: p,
  codeStyle: k,
  codeProps: A,
  className: S,
  style: w,
  ...R
}) {
  const h = E(P), I = f(null), b = f(""), y = typeof t == "string" ? t : typeof e == "string" ? e : "", s = T(() => u ? O(y) : y, [y, u]), i = c === !0 ? "" : c === !1 || c == null ? void 0 : String(c), L = [n, p].filter(Boolean).join(" "), _ = ["code-wrapper", S].filter(Boolean).join(" ");
  return D(() => {
    const r = I.current;
    if (!r || !h) return;
    const g = h.getPlugin?.("highlight");
    if (!g || typeof g.highlightBlock != "function") return;
    const m = [
      s,
      n || "",
      p || "",
      i == null ? "__none__" : `lineNumbers:${i}`,
      l == null ? "" : String(l),
      a ? "1" : "0"
    ].join("::");
    if (b.current === m && r.getAttribute("data-highlighted") === "yes")
      return;
    U(r), r.textContent = s, r.removeAttribute("data-highlighted"), r.classList.remove("hljs"), r.classList.remove("has-highlights"), i == null ? r.removeAttribute("data-line-numbers") : r.setAttribute("data-line-numbers", i), l == null ? r.removeAttribute("data-ln-start-from") : r.setAttribute("data-ln-start-from", String(l)), a ? r.setAttribute("data-noescape", "") : r.removeAttribute("data-noescape"), g.highlightBlock(r);
    const v = typeof r.closest == "function" ? r.closest("section") : null;
    v && typeof h.syncSlide == "function" && h.syncSlide(v), b.current = m;
  }, [h, s, n, p, i, l, a]), /* @__PURE__ */ d("pre", { className: _, style: w, ...R, children: /* @__PURE__ */ d(
    "code",
    {
      ...A,
      ref: I,
      className: L || void 0,
      style: k,
      "data-line-numbers": i,
      "data-ln-start-from": l,
      "data-noescape": a ? "" : void 0,
      children: s
    }
  ) });
}
function Z() {
  return E(P);
}
export {
  X as Code,
  H as Deck,
  W as Fragment,
  P as RevealContext,
  J as Slide,
  Q as Stack,
  Z as useReveal
};
