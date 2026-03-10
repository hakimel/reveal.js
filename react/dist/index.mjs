import { createContext as Y, useRef as f, useState as $, useEffect as O, useLayoutEffect as B, useContext as z, useMemo as J } from "react";
import { jsx as v } from "react/jsx-runtime";
import W from "reveal.js";
const P = Y(null), H = [];
function Q(e, t) {
  if (e === t) return !1;
  if (!e || !t) return e !== t;
  const n = Object.keys(e), a = Object.keys(t);
  if (n.length !== a.length) return !0;
  for (const i of n)
    if (!(i in t) || e[i] !== t[i])
      return !0;
  return !1;
}
function G(e, t) {
  e && (typeof e == "function" ? e(t) : e.current = t);
}
function ot({
  config: e,
  plugins: t = H,
  onReady: n,
  onSync: a,
  onSlideSync: i,
  onSlideChange: u,
  onSlideTransitionEnd: s,
  onFragmentShown: p,
  onFragmentHidden: S,
  onOverviewShown: D,
  onOverviewHidden: I,
  onPaused: T,
  onResumed: C,
  deckRef: g,
  className: R,
  style: j,
  children: k
}) {
  const m = f(null), r = f(null), [l, N] = $(null), o = f(t), b = f(!1), y = f(e), h = f(!1), E = f(0);
  return O(() => {
    if (h.current = !0, E.current += 1, r.current)
      r.current.isReady() && N(r.current);
    else {
      const c = new W(m.current, {
        ...e,
        plugins: o.current
      });
      y.current = e, r.current = c, c.initialize().then(() => {
        !h.current || r.current !== c || (N(c), n?.(c));
      });
    }
    return () => {
      h.current = !1;
      const c = r.current;
      if (!c) return;
      const _ = ++E.current;
      Promise.resolve().then(() => {
        if (!(h.current || E.current !== _) && r.current === c) {
          try {
            c.destroy();
          } catch {
          }
          r.current === c && (r.current = null);
        }
      });
    };
  }, []), O(() => (G(g, l), () => G(g, null)), [g, l]), O(() => {
    if (!l) return;
    const _ = [
      ["sync", a],
      ["slidesync", i],
      ["slidechanged", u],
      ["slidetransitionend", s],
      ["fragmentshown", p],
      ["fragmenthidden", S],
      ["overviewshown", D],
      ["overviewhidden", I],
      ["paused", T],
      ["resumed", C]
    ].filter((A) => A[1] != null);
    for (const [A, d] of _)
      l.on(A, d);
    return () => {
      for (const [A, d] of _)
        l.off(A, d);
    };
  }, [
    l,
    a,
    i,
    u,
    s,
    p,
    S,
    D,
    I,
    T,
    C
  ]), B(() => {
    !l || !r.current?.isReady() || Q(y.current, e) && (b.current = !0, r.current.configure(e ?? {}), y.current = e);
  }, [l, e]), B(() => {
    const c = b.current;
    b.current = !1, r.current?.isReady() && !c && r.current.sync();
  }, [l, k, e]), /* @__PURE__ */ v(P.Provider, { value: l, children: /* @__PURE__ */ v("div", { className: R ? `reveal ${R}` : "reveal", style: j, ref: m, children: /* @__PURE__ */ v("div", { className: "slides", children: k }) }) });
}
const X = "[]", Z = {
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
function F(e) {
  return JSON.stringify(
    Object.entries(e).filter(([t]) => t.startsWith("data-")).sort(([t], [n]) => t.localeCompare(n))
  );
}
function tt(e, t) {
  const n = { ...e }, a = n;
  for (const [i, u] of Object.entries(Z)) {
    if (a[u] !== void 0) continue;
    const s = t[i];
    if (s !== void 0) {
      if (s === !1) {
        i === "autoAnimateUnmatched" && (a[u] = "false");
        continue;
      }
      a[u] = typeof s == "boolean" ? "" : s;
    }
  }
  return n;
}
function ut({
  children: e,
  background: t,
  backgroundImage: n,
  backgroundVideo: a,
  backgroundVideoLoop: i,
  backgroundVideoMuted: u,
  backgroundIframe: s,
  backgroundColor: p,
  backgroundGradient: S,
  backgroundSize: D,
  backgroundPosition: I,
  backgroundRepeat: T,
  backgroundOpacity: C,
  backgroundTransition: g,
  visibility: R,
  autoAnimate: j,
  autoAnimateId: k,
  autoAnimateRestart: m,
  autoAnimateUnmatched: r,
  autoAnimateEasing: l,
  autoAnimateDuration: N,
  autoAnimateDelay: o,
  transition: b,
  transitionSpeed: y,
  autoSlide: h,
  notes: E,
  backgroundInteractive: c,
  preload: _,
  ...A
}) {
  const d = z(P), M = f(null), w = f(null), U = f(null), V = tt(A, {
    background: t,
    backgroundImage: n,
    backgroundVideo: a,
    backgroundVideoLoop: i,
    backgroundVideoMuted: u,
    backgroundIframe: s,
    backgroundColor: p,
    backgroundGradient: S,
    backgroundSize: D,
    backgroundPosition: I,
    backgroundRepeat: T,
    backgroundOpacity: C,
    backgroundTransition: g,
    visibility: R,
    autoAnimate: j,
    autoAnimateId: k,
    autoAnimateRestart: m,
    autoAnimateUnmatched: r,
    autoAnimateEasing: l,
    autoAnimateDuration: N,
    autoAnimateDelay: o,
    transition: b,
    transitionSpeed: y,
    autoSlide: h,
    notes: E,
    backgroundInteractive: c,
    preload: _
  }), L = F(V);
  return B(() => {
    const x = M.current;
    if (!d || !x || typeof d.syncSlide != "function") return;
    if (w.current !== d) {
      w.current = d, U.current = L;
      return;
    }
    if (L === X) return;
    const q = w.current === d, K = U.current === L;
    q && K || (d.syncSlide(x), w.current = d, U.current = L);
  }, [d, L]), /* @__PURE__ */ v("section", { ref: M, ...V, children: e });
}
function st({ className: e, style: t, children: n }) {
  return /* @__PURE__ */ v("section", { className: e, style: t, children: n });
}
function ct({
  animation: e,
  index: t,
  as: n = "span",
  className: a,
  style: i,
  children: u
}) {
  const s = ["fragment", e, a].filter(Boolean).join(" ");
  return /* @__PURE__ */ v(n, { className: s, style: i, "data-fragment-index": t, children: u });
}
function et(e) {
  const t = e.replace(/\r\n/g, `
`).split(`
`);
  for (; t.length && t[0].trim().length === 0; ) t.shift();
  for (; t.length && t[t.length - 1].trim().length === 0; ) t.pop();
  if (!t.length) return "";
  const n = t.filter((a) => a.trim().length > 0).reduce(
    (a, i) => Math.min(a, i.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return t.map((a) => a.slice(n)).join(`
`);
}
function nt(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((n) => {
    n !== e && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function lt({
  children: e,
  code: t,
  language: n,
  trim: a = !0,
  lineNumbers: i,
  startFrom: u,
  noEscape: s,
  codeClassName: p,
  codeStyle: S,
  codeProps: D,
  className: I,
  style: T,
  ...C
}) {
  const g = z(P), R = f(null), j = f(""), k = typeof t == "string" ? t : typeof e == "string" ? e : "", m = J(() => a ? et(k) : k, [k, a]), r = i === !0 ? "" : i === !1 || i == null ? void 0 : String(i), l = [n, p].filter(Boolean).join(" "), N = ["code-wrapper", I].filter(Boolean).join(" ");
  return B(() => {
    const o = R.current;
    if (!o || !g) return;
    const b = g.getPlugin?.("highlight");
    if (!b || typeof b.highlightBlock != "function") return;
    const y = [
      m,
      n || "",
      p || "",
      r == null ? "__none__" : `lineNumbers:${r}`,
      u == null ? "" : String(u),
      s ? "1" : "0"
    ].join("::");
    if (j.current === y && o.getAttribute("data-highlighted") === "yes")
      return;
    nt(o), o.textContent = m, o.removeAttribute("data-highlighted"), o.classList.remove("hljs"), o.classList.remove("has-highlights"), r == null ? o.removeAttribute("data-line-numbers") : o.setAttribute("data-line-numbers", r), u == null ? o.removeAttribute("data-ln-start-from") : o.setAttribute("data-ln-start-from", String(u)), s ? o.setAttribute("data-noescape", "") : o.removeAttribute("data-noescape"), b.highlightBlock(o);
    const h = typeof o.closest == "function" ? o.closest("section") : null;
    h && typeof g.syncFragments == "function" && g.syncFragments(h), j.current = y;
  }, [g, m, n, p, r, u, s]), /* @__PURE__ */ v("pre", { className: N, style: T, ...C, children: /* @__PURE__ */ v(
    "code",
    {
      ...D,
      ref: R,
      className: l || void 0,
      style: S,
      "data-line-numbers": r,
      "data-ln-start-from": u,
      "data-noescape": s ? "" : void 0,
      children: m
    }
  ) });
}
function dt() {
  return z(P);
}
export {
  lt as Code,
  ot as Deck,
  ct as Fragment,
  P as RevealContext,
  ut as Slide,
  st as Stack,
  dt as useReveal
};
