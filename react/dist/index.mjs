import { createContext as F, useRef as k, useState as O, useEffect as x, useLayoutEffect as b, useContext as H } from "react";
import { jsx as r } from "react/jsx-runtime";
import P from "reveal.js";
const N = F(null);
function C(e, n) {
  e && (typeof e == "function" ? e(n) : typeof e == "object" && (e.current = n));
}
function T(e) {
  const {
    plugins: n,
    onReady: o,
    onSlideChange: a,
    onSlideTransitionEnd: l,
    onFragmentShown: d,
    onFragmentHidden: f,
    onOverviewShown: v,
    onOverviewHidden: h,
    onPaused: p,
    onResumed: g,
    deckRef: R,
    className: w,
    style: j,
    children: D,
    ...E
  } = e, y = k(null), s = k(null), [i, S] = O(null);
  return x(() => {
    if (s.current) return;
    let m = !0;
    const t = new P(y.current, {
      ...E,
      plugins: n ?? []
    });
    return s.current = t, t.initialize().then(() => {
      m && (S(t), C(R, t), o?.(t));
    }), () => {
      m = !1;
      try {
        t.destroy();
      } catch {
      }
      s.current = null, S(null), C(R, null);
    };
  }, []), x(() => {
    if (!i) return;
    const m = [
      ["slidechanged", a],
      ["slidetransitionend", l],
      ["fragmentshown", d],
      ["fragmenthidden", f],
      ["overviewshown", v],
      ["overviewhidden", h],
      ["paused", p],
      ["resumed", g]
    ], t = [];
    for (const [c, u] of m)
      u && (i.on(c, u), t.push([c, u]));
    return () => {
      for (const [c, u] of t)
        i.off(c, u);
    };
  }, [
    i,
    a,
    l,
    d,
    f,
    v,
    h,
    p,
    g
  ]), b(() => {
    s.current?.isReady() && s.current.sync();
  }), /* @__PURE__ */ r(N.Provider, { value: i, children: /* @__PURE__ */ r("div", { className: w ? `reveal ${w}` : "reveal", style: j, ref: y, children: /* @__PURE__ */ r("div", { className: "slides", children: D }) }) });
}
function $({ children: e, ...n }) {
  return /* @__PURE__ */ r("section", { ...n, children: e });
}
function q({ className: e, style: n, children: o }) {
  return /* @__PURE__ */ r("section", { className: e, style: n, children: o });
}
function A({
  animation: e,
  index: n,
  as: o = "span",
  className: a,
  style: l,
  children: d
}) {
  const f = ["fragment", e, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ r(o, { className: f, style: l, "data-fragment-index": n, children: d });
}
function G() {
  return H(N);
}
export {
  T as Deck,
  A as Fragment,
  N as RevealContext,
  $ as Slide,
  q as Stack,
  G as useReveal
};
