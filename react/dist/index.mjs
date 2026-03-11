import { createContext as K, useRef as l, useState as W, useEffect as M, useLayoutEffect as P, useContext as V, Children as Y, isValidElement as H, Fragment as Q, cloneElement as X, useMemo as Z } from "react";
import { jsx as R } from "react/jsx-runtime";
import tt from "reveal.js";
const x = K(null), et = [];
function nt(e, t) {
  if (e === t) return !1;
  if (!e || !t) return e !== t;
  const n = Object.keys(e), a = Object.keys(t);
  if (n.length !== a.length) return !0;
  for (const r of n)
    if (!(r in t) || e[r] !== t[r])
      return !0;
  return !1;
}
function F(e, t) {
  e && (typeof e == "function" ? e(t) : e.current = t);
}
function rt(e) {
  return e.tagName === "SECTION";
}
function $(e, t, n) {
  return Array.from(e.children).filter(rt).map((a) => {
    let r = t.get(a);
    r === void 0 && (r = n.current++, t.set(a, r));
    const i = $(a, t, n);
    return i.length > 0 ? [r, i] : r;
  });
}
function at(e, t, n) {
  return e ? JSON.stringify($(e, t, n)) : "[]";
}
function ht({
  config: e,
  plugins: t = et,
  onReady: n,
  onSync: a,
  onSlideSync: r,
  onSlideChange: i,
  onSlideTransitionEnd: u,
  onFragmentShown: h,
  onFragmentHidden: C,
  onOverviewShown: d,
  onOverviewHidden: y,
  onPaused: w,
  onResumed: E,
  deckRef: b,
  className: N,
  style: I,
  children: T
}) {
  const v = l(null), p = l(null), s = l(null), [f, o] = W(null), D = l(t), S = l(!1), A = l(e), L = l(null), B = l(/* @__PURE__ */ new WeakMap()), U = l(1), j = l(!1), m = l(0);
  return M(() => {
    if (j.current = !0, m.current += 1, s.current)
      s.current.isReady() && o(s.current);
    else {
      const c = new tt(v.current, {
        ...e,
        plugins: D.current
      });
      A.current = e, s.current = c, c.initialize().then(() => {
        !j.current || s.current !== c || (o(c), n?.(c));
      });
    }
    return () => {
      j.current = !1;
      const c = s.current;
      if (!c) return;
      const g = ++m.current;
      Promise.resolve().then(() => {
        if (!(j.current || m.current !== g) && s.current === c) {
          try {
            c.destroy();
          } catch {
          }
          s.current === c && (s.current = null);
        }
      });
    };
  }, []), M(() => (F(b, f), () => F(b, null)), [b, f]), M(() => {
    if (!f) return;
    const g = [
      ["sync", a],
      ["slidesync", r],
      ["slidechanged", i],
      ["slidetransitionend", u],
      ["fragmentshown", h],
      ["fragmenthidden", C],
      ["overviewshown", d],
      ["overviewhidden", y],
      ["paused", w],
      ["resumed", E]
    ].filter((k) => k[1] != null);
    for (const [k, _] of g)
      f.on(k, _);
    return () => {
      for (const [k, _] of g)
        f.off(k, _);
    };
  }, [
    f,
    a,
    r,
    i,
    u,
    h,
    C,
    d,
    y,
    w,
    E
  ]), P(() => {
    !f || !s.current?.isReady() || nt(A.current, e) && (S.current = !0, s.current.configure(e ?? {}), A.current = e);
  }, [f, e]), P(() => {
    const c = S.current;
    S.current = !1;
    const g = at(
      p.current,
      B.current,
      U
    );
    if (c) {
      L.current = g;
      return;
    }
    s.current?.isReady() && L.current !== g && (s.current.sync(), L.current = g);
  }), /* @__PURE__ */ R(x.Provider, { value: f, children: /* @__PURE__ */ R("div", { className: N ? `reveal ${N}` : "reveal", style: I, ref: v, children: /* @__PURE__ */ R("div", { className: "slides", ref: p, children: T }) }) });
}
const it = "[]", ot = {
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
function ut(e) {
  return JSON.stringify(
    Object.entries(e).filter(([t]) => t.startsWith("data-")).sort(([t], [n]) => t.localeCompare(n))
  );
}
function st(e, t) {
  const n = { ...e }, a = n;
  for (const [r, i] of Object.entries(ot)) {
    if (a[i] !== void 0) continue;
    const u = t[r];
    if (u !== void 0) {
      if (u === !1) {
        r === "autoAnimateUnmatched" && (a[i] = "false");
        continue;
      }
      a[i] = typeof u == "boolean" ? "" : u;
    }
  }
  return n;
}
function bt({
  children: e,
  background: t,
  backgroundImage: n,
  backgroundVideo: a,
  backgroundVideoLoop: r,
  backgroundVideoMuted: i,
  backgroundIframe: u,
  backgroundColor: h,
  backgroundGradient: C,
  backgroundSize: d,
  backgroundPosition: y,
  backgroundRepeat: w,
  backgroundOpacity: E,
  backgroundTransition: b,
  visibility: N,
  autoAnimate: I,
  autoAnimateId: T,
  autoAnimateRestart: v,
  autoAnimateUnmatched: p,
  autoAnimateEasing: s,
  autoAnimateDuration: f,
  autoAnimateDelay: o,
  transition: D,
  transitionSpeed: S,
  autoSlide: A,
  notes: L,
  backgroundInteractive: B,
  preload: U,
  ...j
}) {
  const m = V(x), c = l(null), g = l(null), k = l(null), _ = st(j, {
    background: t,
    backgroundImage: n,
    backgroundVideo: a,
    backgroundVideoLoop: r,
    backgroundVideoMuted: i,
    backgroundIframe: u,
    backgroundColor: h,
    backgroundGradient: C,
    backgroundSize: d,
    backgroundPosition: y,
    backgroundRepeat: w,
    backgroundOpacity: E,
    backgroundTransition: b,
    visibility: N,
    autoAnimate: I,
    autoAnimateId: T,
    autoAnimateRestart: v,
    autoAnimateUnmatched: p,
    autoAnimateEasing: s,
    autoAnimateDuration: f,
    autoAnimateDelay: o,
    transition: D,
    transitionSpeed: S,
    autoSlide: A,
    notes: L,
    backgroundInteractive: B,
    preload: U
  }), O = ut(_);
  return P(() => {
    const z = c.current;
    if (!m || !z || typeof m.syncSlide != "function") return;
    if (g.current !== m) {
      g.current = m, k.current = O;
      return;
    }
    if (O === it) return;
    const q = g.current === m, J = k.current === O;
    q && J || (m.syncSlide(z), g.current = m, k.current = O);
  }, [m, O]), /* @__PURE__ */ R("section", { ref: c, ..._, children: e });
}
function pt({ className: e, style: t, children: n }) {
  return /* @__PURE__ */ R("section", { className: e, style: t, children: n });
}
function G(...e) {
  return e.filter(Boolean).join(" ");
}
function ct(e, t) {
  return e ? t ? {
    ...e,
    ...t
  } : e : t;
}
function kt({
  animation: e,
  index: t,
  as: n,
  asChild: a,
  className: r,
  style: i,
  children: u
}) {
  const h = G("fragment", e, r);
  if (a) {
    let d;
    try {
      d = Y.only(u);
    } catch {
      throw new Error("Fragment with asChild expects exactly one React element child.");
    }
    if (!H(d) || d.type === Q)
      throw new Error("Fragment with asChild expects exactly one non-Fragment React element child.");
    const y = {
      className: G(d.props.className, h),
      style: ct(d.props.style, i)
    };
    return t !== void 0 && (y["data-fragment-index"] = t), X(d, y);
  }
  return /* @__PURE__ */ R(n ?? "span", { className: h, style: i, "data-fragment-index": t, children: u });
}
function lt(e) {
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
function dt(e) {
  const t = e.parentElement;
  t && Array.from(t.children).forEach((n) => {
    n !== e && n instanceof HTMLElement && n.tagName === "CODE" && n.classList.contains("fragment") && n.remove();
  });
}
function yt({
  children: e,
  code: t,
  language: n,
  trim: a = !0,
  lineNumbers: r,
  startFrom: i,
  noEscape: u,
  codeClassName: h,
  codeStyle: C,
  codeProps: d,
  className: y,
  style: w,
  ...E
}) {
  const b = V(x), N = l(null), I = l(""), T = typeof t == "string" ? t : typeof e == "string" ? e : "", v = Z(() => a ? lt(T) : T, [T, a]), p = r === !0 ? "" : r === !1 || r == null ? void 0 : String(r), s = [n, h].filter(Boolean).join(" "), f = ["code-wrapper", y].filter(Boolean).join(" ");
  return P(() => {
    const o = N.current;
    if (!o || !b) return;
    const D = b.getPlugin?.("highlight");
    if (!D || typeof D.highlightBlock != "function") return;
    const S = [
      v,
      n || "",
      h || "",
      p == null ? "__none__" : `lineNumbers:${p}`,
      i == null ? "" : String(i),
      u ? "1" : "0"
    ].join("::");
    if (I.current === S && o.getAttribute("data-highlighted") === "yes")
      return;
    dt(o), o.textContent = v, o.removeAttribute("data-highlighted"), o.classList.remove("hljs"), o.classList.remove("has-highlights"), p == null ? o.removeAttribute("data-line-numbers") : o.setAttribute("data-line-numbers", p), i == null ? o.removeAttribute("data-ln-start-from") : o.setAttribute("data-ln-start-from", String(i)), u ? o.setAttribute("data-noescape", "") : o.removeAttribute("data-noescape"), D.highlightBlock(o);
    const A = typeof o.closest == "function" ? o.closest("section") : null;
    A && typeof b.syncFragments == "function" && b.syncFragments(A), I.current = S;
  }, [b, v, n, h, p, i, u]), /* @__PURE__ */ R("pre", { className: f, style: w, ...E, children: /* @__PURE__ */ R(
    "code",
    {
      ...d,
      ref: N,
      className: s || void 0,
      style: C,
      "data-line-numbers": p,
      "data-ln-start-from": i,
      "data-noescape": u ? "" : void 0,
      children: v
    }
  ) });
}
function vt() {
  return V(x);
}
export {
  yt as Code,
  ht as Deck,
  kt as Fragment,
  x as RevealContext,
  bt as Slide,
  pt as Stack,
  vt as useReveal
};
