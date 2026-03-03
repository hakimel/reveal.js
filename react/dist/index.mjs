import { createContext as E, useRef as C, useState as L, useEffect as v, useLayoutEffect as $, useContext as g } from "react";
import { jsx as c } from "react/jsx-runtime";
import q from "reveal.js";
const w = E(null);
function N(e, t) {
  e && (typeof e == "function" ? e(t) : typeof e == "object" && (e.current = t));
}
function J({
  config: e,
  plugins: t = [],
  onReady: u,
  onSync: i,
  onSlideChange: l,
  onSlideTransitionEnd: a,
  onFragmentShown: d,
  onFragmentHidden: h,
  onOverviewShown: p,
  onOverviewHidden: y,
  onPaused: x,
  onResumed: R,
  deckRef: k,
  className: j,
  style: z,
  children: B
}) {
  const D = C(null), r = C(null), [s, b] = L(null);
  return v(() => {
    if (r.current) return;
    let m = !0;
    const n = new q(D.current, {
      ...e,
      plugins: t
    });
    return r.current = n, n.initialize().then(() => {
      m && (b(n), N(k, n), u?.(n));
    }), () => {
      m = !1;
      try {
        n.destroy();
      } catch {
      }
      r.current = null, b(null), N(k, null);
    };
  }, []), v(() => {
    if (!s) return;
    const m = [
      ["sync", i],
      ["slidechanged", l],
      ["slidetransitionend", a],
      ["fragmentshown", d],
      ["fragmenthidden", h],
      ["overviewshown", p],
      ["overviewhidden", y],
      ["paused", x],
      ["resumed", R]
    ], n = [];
    for (const [o, f] of m)
      f && (s.on(o, f), n.push([o, f]));
    return () => {
      for (const [o, f] of n)
        s.off(o, f);
    };
  }, [
    s,
    i,
    l,
    a,
    d,
    h,
    p,
    y,
    x,
    R
  ]), v(() => {
    r.current && r.current.configure({
      ...e,
      plugins: t
    });
  }, [e, t]), $(() => {
    r.current?.isReady() && r.current.sync();
  }), /* @__PURE__ */ c(w.Provider, { value: s, children: /* @__PURE__ */ c("div", { className: j ? `reveal ${j}` : "reveal", style: z, ref: D, children: /* @__PURE__ */ c("div", { className: "slides", children: B }) }) });
}
function K({ children: e, ...t }) {
  return /* @__PURE__ */ c("section", { ...t, children: e });
}
function M({ className: e, style: t, children: u }) {
  return /* @__PURE__ */ c("section", { className: e, style: t, children: u });
}
function P({
  animation: e,
  index: t,
  as: u = "span",
  className: i,
  style: l,
  children: a
}) {
  const d = ["fragment", e, i].filter(Boolean).join(" ");
  return /* @__PURE__ */ c(u, { className: d, style: l, "data-fragment-index": t, children: a });
}
function Q() {
  return g(w);
}
export {
  J as Deck,
  P as Fragment,
  w as RevealContext,
  K as Slide,
  M as Stack,
  Q as useReveal
};
