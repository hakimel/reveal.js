import { createContext as D, useRef as v, useState as E, useEffect as _, useLayoutEffect as L, useContext as B, useMemo as z } from "react";
import { jsx as m } from "react/jsx-runtime";
import M from "reveal.js";
const N = D(null), P = [];
function w(t, e) {
  t && (typeof t == "function" ? t(e) : typeof t == "object" && (t.current = e));
}
function Y({
  config: t,
  plugins: e = P,
  onReady: r,
  onSync: s,
  onSlideChange: c,
  onSlideTransitionEnd: u,
  onFragmentShown: a,
  onFragmentHidden: g,
  onOverviewShown: A,
  onOverviewHidden: C,
  onPaused: j,
  onResumed: k,
  deckRef: x,
  className: f,
  style: S,
  children: y
}) {
  const p = v(null), l = v(null), [i, I] = E(null), b = v(!1), n = v({
    config: t,
    plugins: e
  });
  return _(() => {
    if (l.current) return;
    let d = !0;
    const o = new M(p.current, {
      ...t,
      plugins: e
    });
    return n.current = { config: t, plugins: e }, l.current = o, o.initialize().then(() => {
      d && (I(o), w(x, o), r?.(o));
    }), () => {
      d = !1;
      try {
        o.destroy();
      } catch {
      }
      l.current = null, I(null), w(x, null);
    };
  }, []), _(() => {
    if (!i) return;
    const d = [
      ["sync", s],
      ["slidechanged", c],
      ["slidetransitionend", u],
      ["fragmentshown", a],
      ["fragmenthidden", g],
      ["overviewshown", A],
      ["overviewhidden", C],
      ["paused", j],
      ["resumed", k]
    ], o = [];
    for (const [h, R] of d)
      R && (i.on(h, R), o.push([h, R]));
    return () => {
      for (const [h, R] of o)
        i.off(h, R);
    };
  }, [
    i,
    s,
    c,
    u,
    a,
    g,
    A,
    C,
    j,
    k
  ]), L(() => {
    !i || !l.current?.isReady() || n.current.config === t && n.current.plugins === e || (b.current = !0, l.current.configure({
      ...t,
      plugins: e
    }), n.current = { config: t, plugins: e });
  }, [i, t, e]), L(() => {
    if (l.current?.isReady()) {
      if (b.current) {
        b.current = !1;
        return;
      }
      l.current.sync();
    }
  }, [i, y, t, e]), /* @__PURE__ */ m(N.Provider, { value: i, children: /* @__PURE__ */ m("div", { className: f ? `reveal ${f}` : "reveal", style: S, ref: p, children: /* @__PURE__ */ m("div", { className: "slides", children: y }) }) });
}
function q({ children: t, ...e }) {
  return /* @__PURE__ */ m("section", { ...e, children: t });
}
function H({ className: t, style: e, children: r }) {
  return /* @__PURE__ */ m("section", { className: t, style: e, children: r });
}
function J({
  animation: t,
  index: e,
  as: r = "span",
  className: s,
  style: c,
  children: u
}) {
  const a = ["fragment", t, s].filter(Boolean).join(" ");
  return /* @__PURE__ */ m(r, { className: a, style: c, "data-fragment-index": e, children: u });
}
function T(t) {
  const e = t.replace(/\r\n/g, `
`).split(`
`);
  for (; e.length && e[0].trim().length === 0; ) e.shift();
  for (; e.length && e[e.length - 1].trim().length === 0; ) e.pop();
  if (!e.length) return "";
  const r = e.filter((s) => s.trim().length > 0).reduce(
    (s, c) => Math.min(s, c.match(/^\s*/)?.[0].length ?? 0),
    Number.POSITIVE_INFINITY
  );
  return e.map((s) => s.slice(r)).join(`
`);
}
function G(t) {
  const e = t.parentElement;
  e && Array.from(e.children).forEach((r) => {
    r !== t && r instanceof HTMLElement && r.tagName === "CODE" && r.classList.contains("fragment") && r.remove();
  });
}
function K({
  children: t,
  code: e,
  language: r,
  trim: s = !0,
  lineNumbers: c,
  startFrom: u,
  noEscape: a,
  codeClassName: g,
  codeStyle: A,
  codeProps: C,
  className: j,
  style: k,
  ...x
}) {
  const f = B(N), S = v(null), y = v(""), p = typeof e == "string" ? e : typeof t == "string" ? t : "", l = z(() => s ? T(p) : p, [p, s]), i = c === !0 ? "" : c === !1 || c == null ? void 0 : String(c), I = [r, g].filter(Boolean).join(" "), b = ["code-wrapper", j].filter(Boolean).join(" ");
  return L(() => {
    const n = S.current;
    if (!n || !f) return;
    const d = f.getPlugin?.("highlight");
    if (!d || typeof d.highlightBlock != "function") return;
    const o = [
      l,
      r || "",
      g || "",
      i == null ? "__none__" : `lineNumbers:${i}`,
      u == null ? "" : String(u),
      a ? "1" : "0"
    ].join("::");
    if (y.current === o && n.getAttribute("data-highlighted") === "yes")
      return;
    G(n), n.textContent = l, n.removeAttribute("data-highlighted"), n.classList.remove("hljs"), n.classList.remove("has-highlights"), i == null ? n.removeAttribute("data-line-numbers") : n.setAttribute("data-line-numbers", i), u == null ? n.removeAttribute("data-ln-start-from") : n.setAttribute("data-ln-start-from", String(u)), a ? n.setAttribute("data-noescape", "") : n.removeAttribute("data-noescape"), d.highlightBlock(n);
    const h = typeof n.closest == "function" ? n.closest("section") : null;
    h && typeof f.syncSlide == "function" && f.syncSlide(h), y.current = o;
  }, [f, l, r, g, i, u, a]), /* @__PURE__ */ m("pre", { className: b, style: k, ...x, children: /* @__PURE__ */ m(
    "code",
    {
      ...C,
      ref: S,
      className: I || void 0,
      style: A,
      "data-line-numbers": i,
      "data-ln-start-from": u,
      "data-noescape": a ? "" : void 0,
      children: l
    }
  ) });
}
function O() {
  return B(N);
}
export {
  K as Code,
  Y as Deck,
  J as Fragment,
  N as RevealContext,
  q as Slide,
  H as Stack,
  O as useReveal
};
