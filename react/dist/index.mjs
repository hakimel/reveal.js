import { createContext as W, useRef as l, useState as Y, useEffect as z, useLayoutEffect as B, useContext as V, useMemo as $ } from "react";
import { jsx as v } from "react/jsx-runtime";
import H from "reveal.js";
const P = W(null), Q = [];
function X(e, t) {
  if (e === t) return !1;
  if (!e || !t) return e !== t;
  const n = Object.keys(e), a = Object.keys(t);
  if (n.length !== a.length) return !0;
  for (const r of n)
    if (!(r in t) || e[r] !== t[r])
      return !0;
  return !1;
}
function G(e, t) {
  e && (typeof e == "function" ? e(t) : e.current = t);
}
function Z(e) {
  return e.tagName === "SECTION";
}
function q(e, t, n) {
  return Array.from(e.children).filter(Z).map((a) => {
    let r = t.get(a);
    r === void 0 && (r = n.current++, t.set(a, r));
    const u = q(a, t, n);
    return u.length > 0 ? [r, u] : r;
  });
}
function F(e, t, n) {
  return e ? JSON.stringify(q(e, t, n)) : "[]";
}
function ct({
  config: e,
  plugins: t = Q,
  onReady: n,
  onSync: a,
  onSlideSync: r,
  onSlideChange: u,
  onSlideTransitionEnd: s,
  onFragmentShown: k,
  onFragmentHidden: I,
  onOverviewShown: T,
  onOverviewHidden: C,
  onPaused: N,
  onResumed: j,
  deckRef: m,
  className: A,
  style: E,
  children: R
}) {
  const p = l(null), h = l(null), o = l(null), [d, i] = Y(null), D = l(t), y = l(!1), S = l(e), L = l(null), U = l(/* @__PURE__ */ new WeakMap()), M = l(1), _ = l(!1), g = l(0);
  return z(() => {
    if (_.current = !0, g.current += 1, o.current)
      o.current.isReady() && i(o.current);
    else {
      const c = new H(p.current, {
        ...e,
        plugins: D.current
      });
      S.current = e, o.current = c, c.initialize().then(() => {
        !_.current || o.current !== c || (i(c), n?.(c));
      });
    }
    return () => {
      _.current = !1;
      const c = o.current;
      if (!c) return;
      const f = ++g.current;
      Promise.resolve().then(() => {
        if (!(_.current || g.current !== f) && o.current === c) {
          try {
            c.destroy();
          } catch {
          }
          o.current === c && (o.current = null);
        }
      });
    };
  }, []), z(() => (G(m, d), () => G(m, null)), [m, d]), z(() => {
    if (!d) return;
    const f = [
      ["sync", a],
      ["slidesync", r],
      ["slidechanged", u],
      ["slidetransitionend", s],
      ["fragmentshown", k],
      ["fragmenthidden", I],
      ["overviewshown", T],
      ["overviewhidden", C],
      ["paused", N],
      ["resumed", j]
    ].filter((b) => b[1] != null);
    for (const [b, w] of f)
      d.on(b, w);
    return () => {
      for (const [b, w] of f)
        d.off(b, w);
    };
  }, [
    d,
    a,
    r,
    u,
    s,
    k,
    I,
    T,
    C,
    N,
    j
  ]), B(() => {
    !d || !o.current?.isReady() || X(S.current, e) && (y.current = !0, o.current.configure(e ?? {}), S.current = e);
  }, [d, e]), B(() => {
    const c = y.current;
    y.current = !1;
    const f = F(
      h.current,
      U.current,
      M
    );
    if (c) {
      L.current = f;
      return;
    }
    o.current?.isReady() && L.current !== f && (o.current.sync(), L.current = f);
  }), /* @__PURE__ */ v(P.Provider, { value: d, children: /* @__PURE__ */ v("div", { className: A ? `reveal ${A}` : "reveal", style: E, ref: p, children: /* @__PURE__ */ v("div", { className: "slides", ref: h, children: R }) }) });
}
const tt = "[]", et = {
  background: "data-background",
  backgroundImage: "data-background-image",
  backgroundVideo: "data-background-video",
  backgroundVideoLoop: "data-background-video-loop",
  backgroundVideoMuted: "data-background-video-muted",
  backgroundIframe: "data-background-iframe",
  backgroundColor: "data-background-color",
  backgroundGradient: "data-background-gradient",
  backgroundSize: "data-background-size",
  backgroundPosition: "data-background-position",
  backgroundRepeat: "data-background-repeat",
  backgroundOpacity: "data-background-opacity",
  backgroundTransition: "data-background-transition",
  visibility: "data-visibility",
  autoAnimate: "data-auto-animate",
  autoAnimateId: "data-auto-animate-id",
  autoAnimateRestart: "data-auto-animate-restart",
  autoAnimateUnmatched: "data-auto-animate-unmatched",
  autoAnimateEasing: "data-auto-animate-easing",
  autoAnimateDuration: "data-auto-animate-duration",
  autoAnimateDelay: "data-auto-animate-delay",
  transition: "data-transition",
  transitionSpeed: "data-transition-speed",
  autoSlide: "data-autoslide",
  notes: "data-notes",
  backgroundInteractive: "data-background-interactive",
  preload: "data-preload"
};
function nt(e) {
  return JSON.stringify(
    Object.entries(e).filter(([t]) => t.startsWith("data-")).sort(([t], [n]) => t.localeCompare(n))
  );
}
function rt(e, t) {
  const n = { ...e }, a = n;
  for (const [r, u] of Object.entries(et)) {
    if (a[u] !== void 0) continue;
    const s = t[r];
    if (s !== void 0) {
      if (s === !1) {
        r === "autoAnimateUnmatched" && (a[u] = "false");
        continue;
      }
      a[u] = typeof s == "boolean" ? "" : s;
    }
  }
  return n;
}
function lt({
  children: e,
  background: t,
  backgroundImage: n,
  backgroundVideo: a,
  backgroundVideoLoop: r,
  backgroundVideoMuted: u,
  backgroundIframe: s,
  backgroundColor: k,
  backgroundGradient: I,
  backgroundSize: T,
  backgroundPosition: C,
  backgroundRepeat: N,
  backgroundOpacity: j,
  backgroundTransition: m,
  visibility: A,
  autoAnimate: E,
  autoAnimateId: R,
  autoAnimateRestart: p,
  autoAnimateUnmatched: h,
  autoAnimateEasing: o,
  autoAnimateDuration: d,
  autoAnimateDelay: i,
  transition: D,
  transitionSpeed: y,
  autoSlide: S,
  notes: L,
  backgroundInteractive: U,
  preload: M,
  ..._
}) {
  const g = V(P), c = l(null), f = l(null), b = l(null), w = rt(_, {
    background: t,
    backgroundImage: n,
    backgroundVideo: a,
    backgroundVideoLoop: r,
    backgroundVideoMuted: u,
    backgroundIframe: s,
    backgroundColor: k,
    backgroundGradient: I,
    backgroundSize: T,
    backgroundPosition: C,
    backgroundRepeat: N,
    backgroundOpacity: j,
    backgroundTransition: m,
    visibility: A,
    autoAnimate: E,
    autoAnimateId: R,
    autoAnimateRestart: p,
    autoAnimateUnmatched: h,
    autoAnimateEasing: o,
    autoAnimateDuration: d,
    autoAnimateDelay: i,
    transition: D,
    transitionSpeed: y,
    autoSlide: S,
    notes: L,
    backgroundInteractive: U,
    preload: M
  }), O = nt(w);
  return B(() => {
    const x = c.current;
    if (!g || !x || typeof g.syncSlide != "function") return;
    if (f.current !== g) {
      f.current = g, b.current = O;
      return;
    }
    if (O === tt) return;
    const J = f.current === g, K = b.current === O;
    J && K || (g.syncSlide(x), f.current = g, b.current = O);
  }, [g, O]), /* @__PURE__ */ v("section", { ref: c, ...w, children: e });
}
function dt({ className: e, style: t, children: n }) {
  return /* @__PURE__ */ v("section", { className: e, style: t, children: n });
}
function ft({
  animation: e,
  index: t,
  as: n = "span",
  className: a,
  style: r,
  children: u
}) {
  const s = ["fragment", e, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ v(n, { className: s, style: r, "data-fragment-index": t, children: u });
}
function at(e) {
  const t = e.replace(/\r\n/g, `
`).split(`
`);
  for (; t.length && t[0].trim().length === 0; ) t.shift();
  for (; t.length && t[t.length - 1].trim().length === 0; ) t.pop();
  if (!t.length) return "";
  const n = t.filter((a) => a.trim().length > 0).reduce(
    (a, r) => Math.min(a, r.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return t.map((a) => a.slice(n)).join(`
`);
}
function it(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((n) => {
    n !== e && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function gt({
  children: e,
  code: t,
  language: n,
  trim: a = !0,
  lineNumbers: r,
  startFrom: u,
  noEscape: s,
  codeClassName: k,
  codeStyle: I,
  codeProps: T,
  className: C,
  style: N,
  ...j
}) {
  const m = V(P), A = l(null), E = l(""), R = typeof t == "string" ? t : typeof e == "string" ? e : "", p = $(() => a ? at(R) : R, [R, a]), h = r === !0 ? "" : r === !1 || r == null ? void 0 : String(r), o = [n, k].filter(Boolean).join(" "), d = ["code-wrapper", C].filter(Boolean).join(" ");
  return B(() => {
    const i = A.current;
    if (!i || !m) return;
    const D = m.getPlugin?.("highlight");
    if (!D || typeof D.highlightBlock != "function") return;
    const y = [
      p,
      n || "",
      k || "",
      h == null ? "__none__" : `lineNumbers:${h}`,
      u == null ? "" : String(u),
      s ? "1" : "0"
    ].join("::");
    if (E.current === y && i.getAttribute("data-highlighted") === "yes")
      return;
    it(i), i.textContent = p, i.removeAttribute("data-highlighted"), i.classList.remove("hljs"), i.classList.remove("has-highlights"), h == null ? i.removeAttribute("data-line-numbers") : i.setAttribute("data-line-numbers", h), u == null ? i.removeAttribute("data-ln-start-from") : i.setAttribute("data-ln-start-from", String(u)), s ? i.setAttribute("data-noescape", "") : i.removeAttribute("data-noescape"), D.highlightBlock(i);
    const S = typeof i.closest == "function" ? i.closest("section") : null;
    S && typeof m.syncFragments == "function" && m.syncFragments(S), E.current = y;
  }, [m, p, n, k, h, u, s]), /* @__PURE__ */ v("pre", { className: d, style: N, ...j, children: /* @__PURE__ */ v(
    "code",
    {
      ...T,
      ref: A,
      className: o || void 0,
      style: I,
      "data-line-numbers": h,
      "data-ln-start-from": u,
      "data-noescape": s ? "" : void 0,
      children: p
    }
  ) });
}
function mt() {
  return V(P);
}
export {
  gt as Code,
  ct as Deck,
  ft as Fragment,
  P as RevealContext,
  lt as Slide,
  dt as Stack,
  mt as useReveal
};
