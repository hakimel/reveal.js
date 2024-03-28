var ne = Object.defineProperty;
var ie = (a, n, t) => n in a ? ne(a, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[n] = t;
var B = (a, n, t) => (ie(a, typeof n != "symbol" ? n + "" : n, t), t);
function X() {
  return {
    async: !1,
    baseUrl: null,
    breaks: !1,
    extensions: null,
    gfm: !0,
    headerIds: !0,
    headerPrefix: "",
    highlight: null,
    hooks: null,
    langPrefix: "language-",
    mangle: !0,
    pedantic: !1,
    renderer: null,
    sanitize: !1,
    sanitizer: null,
    silent: !1,
    smartypants: !1,
    tokenizer: null,
    walkTokens: null,
    xhtml: !1
  };
}
let L = X();
function se(a) {
  L = a;
}
const G = /[&<>"']/, re = new RegExp(G.source, "g"), W = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, le = new RegExp(W.source, "g"), ae = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, U = (a) => ae[a];
function z(a, n) {
  if (n) {
    if (G.test(a))
      return a.replace(re, U);
  } else if (W.test(a))
    return a.replace(le, U);
  return a;
}
const oe = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function J(a) {
  return a.replace(oe, (n, t) => (t = t.toLowerCase(), t === "colon" ? ":" : t.charAt(0) === "#" ? t.charAt(1) === "x" ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""));
}
const ce = /(^|[^\[])\^/g;
function S(a, n) {
  a = typeof a == "string" ? a : a.source, n = n || "";
  const t = {
    replace: (e, i) => (i = i.source || i, i = i.replace(ce, "$1"), a = a.replace(e, i), t),
    getRegex: () => new RegExp(a, n)
  };
  return t;
}
const he = /[^\w:]/g, ue = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function Z(a, n, t) {
  if (a) {
    let e;
    try {
      e = decodeURIComponent(J(t)).replace(he, "").toLowerCase();
    } catch {
      return null;
    }
    if (e.indexOf("javascript:") === 0 || e.indexOf("vbscript:") === 0 || e.indexOf("data:") === 0)
      return null;
  }
  n && !ue.test(t) && (t = de(n, t));
  try {
    t = encodeURI(t).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return t;
}
const C = {}, pe = /^[^:]+:\/*[^/]*$/, fe = /^([^:]+:)[\s\S]*$/, ge = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function de(a, n) {
  C[" " + a] || (pe.test(a) ? C[" " + a] = a + "/" : C[" " + a] = D(a, "/", !0)), a = C[" " + a];
  const t = a.indexOf(":") === -1;
  return n.substring(0, 2) === "//" ? t ? n : a.replace(fe, "$1") + n : n.charAt(0) === "/" ? t ? n : a.replace(ge, "$1") + n : a + n;
}
const P = { exec: function() {
} };
function H(a, n) {
  const t = a.replace(/\|/g, (s, l, o) => {
    let h = !1, w = l;
    for (; --w >= 0 && o[w] === "\\"; )
      h = !h;
    return h ? "|" : " |";
  }), e = t.split(/ \|/);
  let i = 0;
  if (e[0].trim() || e.shift(), e.length > 0 && !e[e.length - 1].trim() && e.pop(), e.length > n)
    e.splice(n);
  else
    for (; e.length < n; )
      e.push("");
  for (; i < e.length; i++)
    e[i] = e[i].trim().replace(/\\\|/g, "|");
  return e;
}
function D(a, n, t) {
  const e = a.length;
  if (e === 0)
    return "";
  let i = 0;
  for (; i < e; ) {
    const s = a.charAt(e - i - 1);
    if (s === n && !t)
      i++;
    else if (s !== n && t)
      i++;
    else
      break;
  }
  return a.slice(0, e - i);
}
function ke(a, n) {
  if (a.indexOf(n[1]) === -1)
    return -1;
  const t = a.length;
  let e = 0, i = 0;
  for (; i < t; i++)
    if (a[i] === "\\")
      i++;
    else if (a[i] === n[0])
      e++;
    else if (a[i] === n[1] && (e--, e < 0))
      return i;
  return -1;
}
function me(a) {
  a && a.sanitize && !a.silent && console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
}
function j(a, n) {
  if (n < 1)
    return "";
  let t = "";
  for (; n > 1; )
    n & 1 && (t += a), n >>= 1, a += a;
  return t + a;
}
function F(a, n, t, e) {
  const i = n.href, s = n.title ? z(n.title) : null, l = a[1].replace(/\\([\[\]])/g, "$1");
  if (a[0].charAt(0) !== "!") {
    e.state.inLink = !0;
    const o = {
      type: "link",
      raw: t,
      href: i,
      title: s,
      text: l,
      tokens: e.inlineTokens(l)
    };
    return e.state.inLink = !1, o;
  }
  return {
    type: "image",
    raw: t,
    href: i,
    title: s,
    text: z(l)
  };
}
function xe(a, n) {
  const t = a.match(/^(\s+)(?:```)/);
  if (t === null)
    return n;
  const e = t[1];
  return n.split(`
`).map((i) => {
    const s = i.match(/^\s+/);
    if (s === null)
      return i;
    const [l] = s;
    return l.length >= e.length ? i.slice(e.length) : i;
  }).join(`
`);
}
class N {
  constructor(n) {
    this.options = n || L;
  }
  space(n) {
    const t = this.rules.block.newline.exec(n);
    if (t && t[0].length > 0)
      return {
        type: "space",
        raw: t[0]
      };
  }
  code(n) {
    const t = this.rules.block.code.exec(n);
    if (t) {
      const e = t[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: t[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? e : D(e, `
`)
      };
    }
  }
  fences(n) {
    const t = this.rules.block.fences.exec(n);
    if (t) {
      const e = t[0], i = xe(e, t[3] || "");
      return {
        type: "code",
        raw: e,
        lang: t[2] ? t[2].trim().replace(this.rules.inline._escapes, "$1") : t[2],
        text: i
      };
    }
  }
  heading(n) {
    const t = this.rules.block.heading.exec(n);
    if (t) {
      let e = t[2].trim();
      if (/#$/.test(e)) {
        const i = D(e, "#");
        (this.options.pedantic || !i || / $/.test(i)) && (e = i.trim());
      }
      return {
        type: "heading",
        raw: t[0],
        depth: t[1].length,
        text: e,
        tokens: this.lexer.inline(e)
      };
    }
  }
  hr(n) {
    const t = this.rules.block.hr.exec(n);
    if (t)
      return {
        type: "hr",
        raw: t[0]
      };
  }
  blockquote(n) {
    const t = this.rules.block.blockquote.exec(n);
    if (t) {
      const e = t[0].replace(/^ *>[ \t]?/gm, ""), i = this.lexer.state.top;
      this.lexer.state.top = !0;
      const s = this.lexer.blockTokens(e);
      return this.lexer.state.top = i, {
        type: "blockquote",
        raw: t[0],
        tokens: s,
        text: e
      };
    }
  }
  list(n) {
    let t = this.rules.block.list.exec(n);
    if (t) {
      let e, i, s, l, o, h, w, x, b, c, r, m, g = t[1].trim();
      const y = g.length > 1, p = {
        type: "list",
        raw: "",
        ordered: y,
        start: y ? +g.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      g = y ? `\\d{1,9}\\${g.slice(-1)}` : `\\${g}`, this.options.pedantic && (g = y ? g : "[*+-]");
      const k = new RegExp(`^( {0,3}${g})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      for (; n && (m = !1, !(!(t = k.exec(n)) || this.rules.block.hr.test(n))); ) {
        if (e = t[0], n = n.substring(e.length), x = t[2].split(`
`, 1)[0].replace(/^\t+/, (T) => " ".repeat(3 * T.length)), b = n.split(`
`, 1)[0], this.options.pedantic ? (l = 2, r = x.trimLeft()) : (l = t[2].search(/[^ ]/), l = l > 4 ? 1 : l, r = x.slice(l), l += t[1].length), h = !1, !x && /^ *$/.test(b) && (e += b + `
`, n = n.substring(b.length + 1), m = !0), !m) {
          const T = new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), $ = new RegExp(`^ {0,${Math.min(3, l - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), R = new RegExp(`^ {0,${Math.min(3, l - 1)}}(?:\`\`\`|~~~)`), A = new RegExp(`^ {0,${Math.min(3, l - 1)}}#`);
          for (; n && (c = n.split(`
`, 1)[0], b = c, this.options.pedantic && (b = b.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), !(R.test(b) || A.test(b) || T.test(b) || $.test(n))); ) {
            if (b.search(/[^ ]/) >= l || !b.trim())
              r += `
` + b.slice(l);
            else {
              if (h || x.search(/[^ ]/) >= 4 || R.test(x) || A.test(x) || $.test(x))
                break;
              r += `
` + b;
            }
            !h && !b.trim() && (h = !0), e += c + `
`, n = n.substring(c.length + 1), x = b.slice(l);
          }
        }
        p.loose || (w ? p.loose = !0 : /\n *\n *$/.test(e) && (w = !0)), this.options.gfm && (i = /^\[[ xX]\] /.exec(r), i && (s = i[0] !== "[ ] ", r = r.replace(/^\[[ xX]\] +/, ""))), p.items.push({
          type: "list_item",
          raw: e,
          task: !!i,
          checked: s,
          loose: !1,
          text: r
        }), p.raw += e;
      }
      p.items[p.items.length - 1].raw = e.trimRight(), p.items[p.items.length - 1].text = r.trimRight(), p.raw = p.raw.trimRight();
      const _ = p.items.length;
      for (o = 0; o < _; o++)
        if (this.lexer.state.top = !1, p.items[o].tokens = this.lexer.blockTokens(p.items[o].text, []), !p.loose) {
          const T = p.items[o].tokens.filter((R) => R.type === "space"), $ = T.length > 0 && T.some((R) => /\n.*\n/.test(R.raw));
          p.loose = $;
        }
      if (p.loose)
        for (o = 0; o < _; o++)
          p.items[o].loose = !0;
      return p;
    }
  }
  html(n) {
    const t = this.rules.block.html.exec(n);
    if (t) {
      const e = {
        type: "html",
        raw: t[0],
        pre: !this.options.sanitizer && (t[1] === "pre" || t[1] === "script" || t[1] === "style"),
        text: t[0]
      };
      if (this.options.sanitize) {
        const i = this.options.sanitizer ? this.options.sanitizer(t[0]) : z(t[0]);
        e.type = "paragraph", e.text = i, e.tokens = this.lexer.inline(i);
      }
      return e;
    }
  }
  def(n) {
    const t = this.rules.block.def.exec(n);
    if (t) {
      const e = t[1].toLowerCase().replace(/\s+/g, " "), i = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline._escapes, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline._escapes, "$1") : t[3];
      return {
        type: "def",
        tag: e,
        raw: t[0],
        href: i,
        title: s
      };
    }
  }
  table(n) {
    const t = this.rules.block.table.exec(n);
    if (t) {
      const e = {
        type: "table",
        header: H(t[1]).map((i) => ({ text: i })),
        align: t[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
        rows: t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split(`
`) : []
      };
      if (e.header.length === e.align.length) {
        e.raw = t[0];
        let i = e.align.length, s, l, o, h;
        for (s = 0; s < i; s++)
          /^ *-+: *$/.test(e.align[s]) ? e.align[s] = "right" : /^ *:-+: *$/.test(e.align[s]) ? e.align[s] = "center" : /^ *:-+ *$/.test(e.align[s]) ? e.align[s] = "left" : e.align[s] = null;
        for (i = e.rows.length, s = 0; s < i; s++)
          e.rows[s] = H(e.rows[s], e.header.length).map((w) => ({ text: w }));
        for (i = e.header.length, l = 0; l < i; l++)
          e.header[l].tokens = this.lexer.inline(e.header[l].text);
        for (i = e.rows.length, l = 0; l < i; l++)
          for (h = e.rows[l], o = 0; o < h.length; o++)
            h[o].tokens = this.lexer.inline(h[o].text);
        return e;
      }
    }
  }
  lheading(n) {
    const t = this.rules.block.lheading.exec(n);
    if (t)
      return {
        type: "heading",
        raw: t[0],
        depth: t[2].charAt(0) === "=" ? 1 : 2,
        text: t[1],
        tokens: this.lexer.inline(t[1])
      };
  }
  paragraph(n) {
    const t = this.rules.block.paragraph.exec(n);
    if (t) {
      const e = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return {
        type: "paragraph",
        raw: t[0],
        text: e,
        tokens: this.lexer.inline(e)
      };
    }
  }
  text(n) {
    const t = this.rules.block.text.exec(n);
    if (t)
      return {
        type: "text",
        raw: t[0],
        text: t[0],
        tokens: this.lexer.inline(t[0])
      };
  }
  escape(n) {
    const t = this.rules.inline.escape.exec(n);
    if (t)
      return {
        type: "escape",
        raw: t[0],
        text: z(t[1])
      };
  }
  tag(n) {
    const t = this.rules.inline.tag.exec(n);
    if (t)
      return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
        type: this.options.sanitize ? "text" : "html",
        raw: t[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(t[0]) : z(t[0]) : t[0]
      };
  }
  link(n) {
    const t = this.rules.inline.link.exec(n);
    if (t) {
      const e = t[2].trim();
      if (!this.options.pedantic && /^</.test(e)) {
        if (!/>$/.test(e))
          return;
        const l = D(e.slice(0, -1), "\\");
        if ((e.length - l.length) % 2 === 0)
          return;
      } else {
        const l = ke(t[2], "()");
        if (l > -1) {
          const h = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + l;
          t[2] = t[2].substring(0, l), t[0] = t[0].substring(0, h).trim(), t[3] = "";
        }
      }
      let i = t[2], s = "";
      if (this.options.pedantic) {
        const l = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);
        l && (i = l[1], s = l[3]);
      } else
        s = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), /^</.test(i) && (this.options.pedantic && !/>$/.test(e) ? i = i.slice(1) : i = i.slice(1, -1)), F(t, {
        href: i && i.replace(this.rules.inline._escapes, "$1"),
        title: s && s.replace(this.rules.inline._escapes, "$1")
      }, t[0], this.lexer);
    }
  }
  reflink(n, t) {
    let e;
    if ((e = this.rules.inline.reflink.exec(n)) || (e = this.rules.inline.nolink.exec(n))) {
      let i = (e[2] || e[1]).replace(/\s+/g, " ");
      if (i = t[i.toLowerCase()], !i) {
        const s = e[0].charAt(0);
        return {
          type: "text",
          raw: s,
          text: s
        };
      }
      return F(e, i, e[0], this.lexer);
    }
  }
  emStrong(n, t, e = "") {
    let i = this.rules.inline.emStrong.lDelim.exec(n);
    if (!i || i[3] && e.match(/[\p{L}\p{N}]/u))
      return;
    const s = i[1] || i[2] || "";
    if (!s || s && (e === "" || this.rules.inline.punctuation.exec(e))) {
      const l = i[0].length - 1;
      let o, h, w = l, x = 0;
      const b = i[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      for (b.lastIndex = 0, t = t.slice(-1 * n.length + l); (i = b.exec(t)) != null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o)
          continue;
        if (h = o.length, i[3] || i[4]) {
          w += h;
          continue;
        } else if ((i[5] || i[6]) && l % 3 && !((l + h) % 3)) {
          x += h;
          continue;
        }
        if (w -= h, w > 0)
          continue;
        h = Math.min(h, h + w + x);
        const c = n.slice(0, l + i.index + (i[0].length - o.length) + h);
        if (Math.min(l, h) % 2) {
          const m = c.slice(1, -1);
          return {
            type: "em",
            raw: c,
            text: m,
            tokens: this.lexer.inlineTokens(m)
          };
        }
        const r = c.slice(2, -2);
        return {
          type: "strong",
          raw: c,
          text: r,
          tokens: this.lexer.inlineTokens(r)
        };
      }
    }
  }
  codespan(n) {
    const t = this.rules.inline.code.exec(n);
    if (t) {
      let e = t[2].replace(/\n/g, " ");
      const i = /[^ ]/.test(e), s = /^ /.test(e) && / $/.test(e);
      return i && s && (e = e.substring(1, e.length - 1)), e = z(e, !0), {
        type: "codespan",
        raw: t[0],
        text: e
      };
    }
  }
  br(n) {
    const t = this.rules.inline.br.exec(n);
    if (t)
      return {
        type: "br",
        raw: t[0]
      };
  }
  del(n) {
    const t = this.rules.inline.del.exec(n);
    if (t)
      return {
        type: "del",
        raw: t[0],
        text: t[2],
        tokens: this.lexer.inlineTokens(t[2])
      };
  }
  autolink(n, t) {
    const e = this.rules.inline.autolink.exec(n);
    if (e) {
      let i, s;
      return e[2] === "@" ? (i = z(this.options.mangle ? t(e[1]) : e[1]), s = "mailto:" + i) : (i = z(e[1]), s = i), {
        type: "link",
        raw: e[0],
        text: i,
        href: s,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  url(n, t) {
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let i, s;
      if (e[2] === "@")
        i = z(this.options.mangle ? t(e[0]) : e[0]), s = "mailto:" + i;
      else {
        let l;
        do
          l = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])[0];
        while (l !== e[0]);
        i = z(e[0]), e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: i,
        href: s,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(n, t) {
    const e = this.rules.inline.text.exec(n);
    if (e) {
      let i;
      return this.lexer.state.inRawBlock ? i = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(e[0]) : z(e[0]) : e[0] : i = z(this.options.smartypants ? t(e[0]) : e[0]), {
        type: "text",
        raw: e[0],
        text: i
      };
    }
  }
}
const d = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
  def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: P,
  lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};
d._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
d._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
d.def = S(d.def).replace("label", d._label).replace("title", d._title).getRegex();
d.bullet = /(?:[*+-]|\d{1,9}[.)])/;
d.listItemStart = S(/^( *)(bull) */).replace("bull", d.bullet).getRegex();
d.list = S(d.list).replace(/bull/g, d.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + d.def.source + ")").getRegex();
d._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
d._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
d.html = S(d.html, "i").replace("comment", d._comment).replace("tag", d._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
d.paragraph = S(d._paragraph).replace("hr", d.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", d._tag).getRegex();
d.blockquote = S(d.blockquote).replace("paragraph", d.paragraph).getRegex();
d.normal = { ...d };
d.gfm = {
  ...d.normal,
  table: "^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  // Cells
};
d.gfm.table = S(d.gfm.table).replace("hr", d.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", d._tag).getRegex();
d.gfm.paragraph = S(d._paragraph).replace("hr", d.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("table", d.gfm.table).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", d._tag).getRegex();
d.pedantic = {
  ...d.normal,
  html: S(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", d._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: P,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: S(d.normal._paragraph).replace("hr", d.hr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", d.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
};
const u = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: P,
  tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
  // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: "reflink|nolink(?!\\()",
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
    // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: P,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};
u._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
u.punctuation = S(u.punctuation).replace(/punctuation/g, u._punctuation).getRegex();
u.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
u.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;
u._comment = S(d._comment).replace("(?:-->|$)", "-->").getRegex();
u.emStrong.lDelim = S(u.emStrong.lDelim).replace(/punct/g, u._punctuation).getRegex();
u.emStrong.rDelimAst = S(u.emStrong.rDelimAst, "g").replace(/punct/g, u._punctuation).getRegex();
u.emStrong.rDelimUnd = S(u.emStrong.rDelimUnd, "g").replace(/punct/g, u._punctuation).getRegex();
u._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
u._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
u._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
u.autolink = S(u.autolink).replace("scheme", u._scheme).replace("email", u._email).getRegex();
u._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
u.tag = S(u.tag).replace("comment", u._comment).replace("attribute", u._attribute).getRegex();
u._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
u._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
u._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
u.link = S(u.link).replace("label", u._label).replace("href", u._href).replace("title", u._title).getRegex();
u.reflink = S(u.reflink).replace("label", u._label).replace("ref", d._label).getRegex();
u.nolink = S(u.nolink).replace("ref", d._label).getRegex();
u.reflinkSearch = S(u.reflinkSearch, "g").replace("reflink", u.reflink).replace("nolink", u.nolink).getRegex();
u.normal = { ...u };
u.pedantic = {
  ...u.normal,
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: S(/^!?\[(label)\]\((.*?)\)/).replace("label", u._label).getRegex(),
  reflink: S(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", u._label).getRegex()
};
u.gfm = {
  ...u.normal,
  escape: S(u.escape).replace("])", "~|])").getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
u.gfm.url = S(u.gfm.url, "i").replace("email", u.gfm._extended_email).getRegex();
u.breaks = {
  ...u.gfm,
  br: S(u.br).replace("{2,}", "*").getRegex(),
  text: S(u.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
function be(a) {
  return a.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
}
function Q(a) {
  let n = "", t, e;
  const i = a.length;
  for (t = 0; t < i; t++)
    e = a.charCodeAt(t), Math.random() > 0.5 && (e = "x" + e.toString(16)), n += "&#" + e + ";";
  return n;
}
class E {
  constructor(n) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = n || L, this.options.tokenizer = this.options.tokenizer || new N(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      block: d.normal,
      inline: u.normal
    };
    this.options.pedantic ? (t.block = d.pedantic, t.inline = u.pedantic) : this.options.gfm && (t.block = d.gfm, this.options.breaks ? t.inline = u.breaks : t.inline = u.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: d,
      inline: u
    };
  }
  /**
   * Static Lex Method
   */
  static lex(n, t) {
    return new E(t).lex(n);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(n, t) {
    return new E(t).inlineTokens(n);
  }
  /**
   * Preprocessing
   */
  lex(n) {
    n = n.replace(/\r\n|\r/g, `
`), this.blockTokens(n, this.tokens);
    let t;
    for (; t = this.inlineQueue.shift(); )
      this.inlineTokens(t.src, t.tokens);
    return this.tokens;
  }
  /**
   * Lexing
   */
  blockTokens(n, t = []) {
    this.options.pedantic ? n = n.replace(/\t/g, "    ").replace(/^ +$/gm, "") : n = n.replace(/^( *)(\t+)/gm, (o, h, w) => h + "    ".repeat(w.length));
    let e, i, s, l;
    for (; n; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((o) => (e = o.call({ lexer: this }, n, t)) ? (n = n.substring(e.raw.length), t.push(e), !0) : !1))) {
        if (e = this.tokenizer.space(n)) {
          n = n.substring(e.raw.length), e.raw.length === 1 && t.length > 0 ? t[t.length - 1].raw += `
` : t.push(e);
          continue;
        }
        if (e = this.tokenizer.code(n)) {
          n = n.substring(e.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(e);
          continue;
        }
        if (e = this.tokenizer.fences(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.heading(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.hr(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.blockquote(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.list(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.html(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.def(n)) {
          n = n.substring(e.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += `
` + e.raw, i.text += `
` + e.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[e.tag] || (this.tokens.links[e.tag] = {
            href: e.href,
            title: e.title
          });
          continue;
        }
        if (e = this.tokenizer.table(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.lheading(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (s = n, this.options.extensions && this.options.extensions.startBlock) {
          let o = 1 / 0;
          const h = n.slice(1);
          let w;
          this.options.extensions.startBlock.forEach(function(x) {
            w = x.call({ lexer: this }, h), typeof w == "number" && w >= 0 && (o = Math.min(o, w));
          }), o < 1 / 0 && o >= 0 && (s = n.substring(0, o + 1));
        }
        if (this.state.top && (e = this.tokenizer.paragraph(s))) {
          i = t[t.length - 1], l && i.type === "paragraph" ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(e), l = s.length !== n.length, n = n.substring(e.raw.length);
          continue;
        }
        if (e = this.tokenizer.text(n)) {
          n = n.substring(e.raw.length), i = t[t.length - 1], i && i.type === "text" ? (i.raw += `
` + e.raw, i.text += `
` + e.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(e);
          continue;
        }
        if (n) {
          const o = "Infinite loop on byte: " + n.charCodeAt(0);
          if (this.options.silent) {
            console.error(o);
            break;
          } else
            throw new Error(o);
        }
      }
    return this.state.top = !0, t;
  }
  inline(n, t = []) {
    return this.inlineQueue.push({ src: n, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(n, t = []) {
    let e, i, s, l = n, o, h, w;
    if (this.tokens.links) {
      const x = Object.keys(this.tokens.links);
      if (x.length > 0)
        for (; (o = this.tokenizer.rules.inline.reflinkSearch.exec(l)) != null; )
          x.includes(o[0].slice(o[0].lastIndexOf("[") + 1, -1)) && (l = l.slice(0, o.index) + "[" + j("a", o[0].length - 2) + "]" + l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (o = this.tokenizer.rules.inline.blockSkip.exec(l)) != null; )
      l = l.slice(0, o.index) + "[" + j("a", o[0].length - 2) + "]" + l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (o = this.tokenizer.rules.inline.escapedEmSt.exec(l)) != null; )
      l = l.slice(0, o.index + o[0].length - 2) + "++" + l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex), this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
    for (; n; )
      if (h || (w = ""), h = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((x) => (e = x.call({ lexer: this }, n, t)) ? (n = n.substring(e.raw.length), t.push(e), !0) : !1))) {
        if (e = this.tokenizer.escape(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.tag(n)) {
          n = n.substring(e.raw.length), i = t[t.length - 1], i && e.type === "text" && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : t.push(e);
          continue;
        }
        if (e = this.tokenizer.link(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.reflink(n, this.tokens.links)) {
          n = n.substring(e.raw.length), i = t[t.length - 1], i && e.type === "text" && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : t.push(e);
          continue;
        }
        if (e = this.tokenizer.emStrong(n, l, w)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.codespan(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.br(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.del(n)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (e = this.tokenizer.autolink(n, Q)) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (!this.state.inLink && (e = this.tokenizer.url(n, Q))) {
          n = n.substring(e.raw.length), t.push(e);
          continue;
        }
        if (s = n, this.options.extensions && this.options.extensions.startInline) {
          let x = 1 / 0;
          const b = n.slice(1);
          let c;
          this.options.extensions.startInline.forEach(function(r) {
            c = r.call({ lexer: this }, b), typeof c == "number" && c >= 0 && (x = Math.min(x, c));
          }), x < 1 / 0 && x >= 0 && (s = n.substring(0, x + 1));
        }
        if (e = this.tokenizer.inlineText(s, be)) {
          n = n.substring(e.raw.length), e.raw.slice(-1) !== "_" && (w = e.raw.slice(-1)), h = !0, i = t[t.length - 1], i && i.type === "text" ? (i.raw += e.raw, i.text += e.text) : t.push(e);
          continue;
        }
        if (n) {
          const x = "Infinite loop on byte: " + n.charCodeAt(0);
          if (this.options.silent) {
            console.error(x);
            break;
          } else
            throw new Error(x);
        }
      }
    return t;
  }
}
class q {
  constructor(n) {
    this.options = n || L;
  }
  code(n, t, e) {
    const i = (t || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const s = this.options.highlight(n, i);
      s != null && s !== n && (e = !0, n = s);
    }
    return n = n.replace(/\n$/, "") + `
`, i ? '<pre><code class="' + this.options.langPrefix + z(i) + '">' + (e ? n : z(n, !0)) + `</code></pre>
` : "<pre><code>" + (e ? n : z(n, !0)) + `</code></pre>
`;
  }
  /**
   * @param {string} quote
   */
  blockquote(n) {
    return `<blockquote>
${n}</blockquote>
`;
  }
  html(n) {
    return n;
  }
  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(n, t, e, i) {
    if (this.options.headerIds) {
      const s = this.options.headerPrefix + i.slug(e);
      return `<h${t} id="${s}">${n}</h${t}>
`;
    }
    return `<h${t}>${n}</h${t}>
`;
  }
  hr() {
    return this.options.xhtml ? `<hr/>
` : `<hr>
`;
  }
  list(n, t, e) {
    const i = t ? "ol" : "ul", s = t && e !== 1 ? ' start="' + e + '"' : "";
    return "<" + i + s + `>
` + n + "</" + i + `>
`;
  }
  /**
   * @param {string} text
   */
  listitem(n) {
    return `<li>${n}</li>
`;
  }
  checkbox(n) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
  }
  /**
   * @param {string} text
   */
  paragraph(n) {
    return `<p>${n}</p>
`;
  }
  /**
   * @param {string} header
   * @param {string} body
   */
  table(n, t) {
    return t && (t = `<tbody>${t}</tbody>`), `<table>
<thead>
` + n + `</thead>
` + t + `</table>
`;
  }
  /**
   * @param {string} content
   */
  tablerow(n) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n, t) {
    const e = t.header ? "th" : "td";
    return (t.align ? `<${e} align="${t.align}">` : `<${e}>`) + n + `</${e}>
`;
  }
  /**
   * span level renderer
   * @param {string} text
   */
  strong(n) {
    return `<strong>${n}</strong>`;
  }
  /**
   * @param {string} text
   */
  em(n) {
    return `<em>${n}</em>`;
  }
  /**
   * @param {string} text
   */
  codespan(n) {
    return `<code>${n}</code>`;
  }
  br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }
  /**
   * @param {string} text
   */
  del(n) {
    return `<del>${n}</del>`;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(n, t, e) {
    if (n = Z(this.options.sanitize, this.options.baseUrl, n), n === null)
      return e;
    let i = '<a href="' + n + '"';
    return t && (i += ' title="' + t + '"'), i += ">" + e + "</a>", i;
  }
  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(n, t, e) {
    if (n = Z(this.options.sanitize, this.options.baseUrl, n), n === null)
      return e;
    let i = `<img src="${n}" alt="${e}"`;
    return t && (i += ` title="${t}"`), i += this.options.xhtml ? "/>" : ">", i;
  }
  text(n) {
    return n;
  }
}
class K {
  // no need for block level renderers
  strong(n) {
    return n;
  }
  em(n) {
    return n;
  }
  codespan(n) {
    return n;
  }
  del(n) {
    return n;
  }
  html(n) {
    return n;
  }
  text(n) {
    return n;
  }
  link(n, t, e) {
    return "" + e;
  }
  image(n, t, e) {
    return "" + e;
  }
  br() {
    return "";
  }
}
class Y {
  constructor() {
    this.seen = {};
  }
  /**
   * @param {string} value
   */
  serialize(n) {
    return n.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
  }
  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(n, t) {
    let e = n, i = 0;
    if (this.seen.hasOwnProperty(e)) {
      i = this.seen[n];
      do
        i++, e = n + "-" + i;
      while (this.seen.hasOwnProperty(e));
    }
    return t || (this.seen[n] = i, this.seen[e] = 0), e;
  }
  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(n, t = {}) {
    const e = this.serialize(n);
    return this.getNextSafeSlug(e, t.dryrun);
  }
}
class I {
  constructor(n) {
    this.options = n || L, this.options.renderer = this.options.renderer || new q(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new K(), this.slugger = new Y();
  }
  /**
   * Static Parse Method
   */
  static parse(n, t) {
    return new I(t).parse(n);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(n, t) {
    return new I(t).parseInline(n);
  }
  /**
   * Parse Loop
   */
  parse(n, t = !0) {
    let e = "", i, s, l, o, h, w, x, b, c, r, m, g, y, p, k, _, T, $, R;
    const A = n.length;
    for (i = 0; i < A; i++) {
      if (r = n[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[r.type] && (R = this.options.extensions.renderers[r.type].call({ parser: this }, r), R !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(r.type))) {
        e += R || "";
        continue;
      }
      switch (r.type) {
        case "space":
          continue;
        case "hr": {
          e += this.renderer.hr();
          continue;
        }
        case "heading": {
          e += this.renderer.heading(
            this.parseInline(r.tokens),
            r.depth,
            J(this.parseInline(r.tokens, this.textRenderer)),
            this.slugger
          );
          continue;
        }
        case "code": {
          e += this.renderer.code(
            r.text,
            r.lang,
            r.escaped
          );
          continue;
        }
        case "table": {
          for (b = "", x = "", o = r.header.length, s = 0; s < o; s++)
            x += this.renderer.tablecell(
              this.parseInline(r.header[s].tokens),
              { header: !0, align: r.align[s] }
            );
          for (b += this.renderer.tablerow(x), c = "", o = r.rows.length, s = 0; s < o; s++) {
            for (w = r.rows[s], x = "", h = w.length, l = 0; l < h; l++)
              x += this.renderer.tablecell(
                this.parseInline(w[l].tokens),
                { header: !1, align: r.align[l] }
              );
            c += this.renderer.tablerow(x);
          }
          e += this.renderer.table(b, c);
          continue;
        }
        case "blockquote": {
          c = this.parse(r.tokens), e += this.renderer.blockquote(c);
          continue;
        }
        case "list": {
          for (m = r.ordered, g = r.start, y = r.loose, o = r.items.length, c = "", s = 0; s < o; s++)
            k = r.items[s], _ = k.checked, T = k.task, p = "", k.task && ($ = this.renderer.checkbox(_), y ? k.tokens.length > 0 && k.tokens[0].type === "paragraph" ? (k.tokens[0].text = $ + " " + k.tokens[0].text, k.tokens[0].tokens && k.tokens[0].tokens.length > 0 && k.tokens[0].tokens[0].type === "text" && (k.tokens[0].tokens[0].text = $ + " " + k.tokens[0].tokens[0].text)) : k.tokens.unshift({
              type: "text",
              text: $
            }) : p += $), p += this.parse(k.tokens, y), c += this.renderer.listitem(p, T, _);
          e += this.renderer.list(c, m, g);
          continue;
        }
        case "html": {
          e += this.renderer.html(r.text);
          continue;
        }
        case "paragraph": {
          e += this.renderer.paragraph(this.parseInline(r.tokens));
          continue;
        }
        case "text": {
          for (c = r.tokens ? this.parseInline(r.tokens) : r.text; i + 1 < A && n[i + 1].type === "text"; )
            r = n[++i], c += `
` + (r.tokens ? this.parseInline(r.tokens) : r.text);
          e += t ? this.renderer.paragraph(c) : c;
          continue;
        }
        default: {
          const v = 'Token with "' + r.type + '" type was not found.';
          if (this.options.silent) {
            console.error(v);
            return;
          } else
            throw new Error(v);
        }
      }
    }
    return e;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(n, t) {
    t = t || this.renderer;
    let e = "", i, s, l;
    const o = n.length;
    for (i = 0; i < o; i++) {
      if (s = n[i], this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[s.type] && (l = this.options.extensions.renderers[s.type].call({ parser: this }, s), l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type))) {
        e += l || "";
        continue;
      }
      switch (s.type) {
        case "escape": {
          e += t.text(s.text);
          break;
        }
        case "html": {
          e += t.html(s.text);
          break;
        }
        case "link": {
          e += t.link(s.href, s.title, this.parseInline(s.tokens, t));
          break;
        }
        case "image": {
          e += t.image(s.href, s.title, s.text);
          break;
        }
        case "strong": {
          e += t.strong(this.parseInline(s.tokens, t));
          break;
        }
        case "em": {
          e += t.em(this.parseInline(s.tokens, t));
          break;
        }
        case "codespan": {
          e += t.codespan(s.text);
          break;
        }
        case "br": {
          e += t.br();
          break;
        }
        case "del": {
          e += t.del(this.parseInline(s.tokens, t));
          break;
        }
        case "text": {
          e += t.text(s.text);
          break;
        }
        default: {
          const h = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) {
            console.error(h);
            return;
          } else
            throw new Error(h);
        }
      }
    }
    return e;
  }
}
class O {
  constructor(n) {
    this.options = n || L;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
}
B(O, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess"
]));
function we(a, n, t) {
  return (e) => {
    if (e.message += `
Please report this to https://github.com/markedjs/marked.`, a) {
      const i = "<p>An error occurred:</p><pre>" + z(e.message + "", !0) + "</pre>";
      if (n)
        return Promise.resolve(i);
      if (t) {
        t(null, i);
        return;
      }
      return i;
    }
    if (n)
      return Promise.reject(e);
    if (t) {
      t(e);
      return;
    }
    throw e;
  };
}
function ee(a, n) {
  return (t, e, i) => {
    typeof e == "function" && (i = e, e = null);
    const s = { ...e };
    e = { ...f.defaults, ...s };
    const l = we(e.silent, e.async, i);
    if (typeof t > "u" || t === null)
      return l(new Error("marked(): input parameter is undefined or null"));
    if (typeof t != "string")
      return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
    if (me(e), e.hooks && (e.hooks.options = e), i) {
      const o = e.highlight;
      let h;
      try {
        e.hooks && (t = e.hooks.preprocess(t)), h = a(t, e);
      } catch (b) {
        return l(b);
      }
      const w = function(b) {
        let c;
        if (!b)
          try {
            e.walkTokens && f.walkTokens(h, e.walkTokens), c = n(h, e), e.hooks && (c = e.hooks.postprocess(c));
          } catch (r) {
            b = r;
          }
        return e.highlight = o, b ? l(b) : i(null, c);
      };
      if (!o || o.length < 3 || (delete e.highlight, !h.length))
        return w();
      let x = 0;
      f.walkTokens(h, function(b) {
        b.type === "code" && (x++, setTimeout(() => {
          o(b.text, b.lang, function(c, r) {
            if (c)
              return w(c);
            r != null && r !== b.text && (b.text = r, b.escaped = !0), x--, x === 0 && w();
          });
        }, 0));
      }), x === 0 && w();
      return;
    }
    if (e.async)
      return Promise.resolve(e.hooks ? e.hooks.preprocess(t) : t).then((o) => a(o, e)).then((o) => e.walkTokens ? Promise.all(f.walkTokens(o, e.walkTokens)).then(() => o) : o).then((o) => n(o, e)).then((o) => e.hooks ? e.hooks.postprocess(o) : o).catch(l);
    try {
      e.hooks && (t = e.hooks.preprocess(t));
      const o = a(t, e);
      e.walkTokens && f.walkTokens(o, e.walkTokens);
      let h = n(o, e);
      return e.hooks && (h = e.hooks.postprocess(h)), h;
    } catch (o) {
      return l(o);
    }
  };
}
function f(a, n, t) {
  return ee(E.lex, I.parse)(a, n, t);
}
f.options = f.setOptions = function(a) {
  return f.defaults = { ...f.defaults, ...a }, se(f.defaults), f;
};
f.getDefaults = X;
f.defaults = L;
f.use = function(...a) {
  const n = f.defaults.extensions || { renderers: {}, childTokens: {} };
  a.forEach((t) => {
    const e = { ...t };
    if (e.async = f.defaults.async || e.async || !1, t.extensions && (t.extensions.forEach((i) => {
      if (!i.name)
        throw new Error("extension name required");
      if (i.renderer) {
        const s = n.renderers[i.name];
        s ? n.renderers[i.name] = function(...l) {
          let o = i.renderer.apply(this, l);
          return o === !1 && (o = s.apply(this, l)), o;
        } : n.renderers[i.name] = i.renderer;
      }
      if (i.tokenizer) {
        if (!i.level || i.level !== "block" && i.level !== "inline")
          throw new Error("extension level must be 'block' or 'inline'");
        n[i.level] ? n[i.level].unshift(i.tokenizer) : n[i.level] = [i.tokenizer], i.start && (i.level === "block" ? n.startBlock ? n.startBlock.push(i.start) : n.startBlock = [i.start] : i.level === "inline" && (n.startInline ? n.startInline.push(i.start) : n.startInline = [i.start]));
      }
      i.childTokens && (n.childTokens[i.name] = i.childTokens);
    }), e.extensions = n), t.renderer) {
      const i = f.defaults.renderer || new q();
      for (const s in t.renderer) {
        const l = i[s];
        i[s] = (...o) => {
          let h = t.renderer[s].apply(i, o);
          return h === !1 && (h = l.apply(i, o)), h;
        };
      }
      e.renderer = i;
    }
    if (t.tokenizer) {
      const i = f.defaults.tokenizer || new N();
      for (const s in t.tokenizer) {
        const l = i[s];
        i[s] = (...o) => {
          let h = t.tokenizer[s].apply(i, o);
          return h === !1 && (h = l.apply(i, o)), h;
        };
      }
      e.tokenizer = i;
    }
    if (t.hooks) {
      const i = f.defaults.hooks || new O();
      for (const s in t.hooks) {
        const l = i[s];
        O.passThroughHooks.has(s) ? i[s] = (o) => {
          if (f.defaults.async)
            return Promise.resolve(t.hooks[s].call(i, o)).then((w) => l.call(i, w));
          const h = t.hooks[s].call(i, o);
          return l.call(i, h);
        } : i[s] = (...o) => {
          let h = t.hooks[s].apply(i, o);
          return h === !1 && (h = l.apply(i, o)), h;
        };
      }
      e.hooks = i;
    }
    if (t.walkTokens) {
      const i = f.defaults.walkTokens;
      e.walkTokens = function(s) {
        let l = [];
        return l.push(t.walkTokens.call(this, s)), i && (l = l.concat(i.call(this, s))), l;
      };
    }
    f.setOptions(e);
  });
};
f.walkTokens = function(a, n) {
  let t = [];
  for (const e of a)
    switch (t = t.concat(n.call(f, e)), e.type) {
      case "table": {
        for (const i of e.header)
          t = t.concat(f.walkTokens(i.tokens, n));
        for (const i of e.rows)
          for (const s of i)
            t = t.concat(f.walkTokens(s.tokens, n));
        break;
      }
      case "list": {
        t = t.concat(f.walkTokens(e.items, n));
        break;
      }
      default:
        f.defaults.extensions && f.defaults.extensions.childTokens && f.defaults.extensions.childTokens[e.type] ? f.defaults.extensions.childTokens[e.type].forEach(function(i) {
          t = t.concat(f.walkTokens(e[i], n));
        }) : e.tokens && (t = t.concat(f.walkTokens(e.tokens, n)));
    }
  return t;
};
f.parseInline = ee(E.lexInline, I.parseInline);
f.Parser = I;
f.parser = I.parse;
f.Renderer = q;
f.TextRenderer = K;
f.Lexer = E;
f.lexer = E.lex;
f.Tokenizer = N;
f.Slugger = Y;
f.Hooks = O;
f.parse = f;
f.options;
f.setOptions;
f.use;
f.walkTokens;
f.parseInline;
I.parse;
E.lex;
/*!
 * The reveal.js markdown plugin. Handles parsing of
 * markdown inside of presentations as well as loading
 * of external markdown documents.
 */
const _e = `\r?
---\r?
`, ye = null, $e = "^s*notes?:", Se = "\\.element\\s*?(.+?)$", Te = "\\.slide:\\s*?(\\S.+?)$", V = "__SCRIPT_END__", M = /\[\s*((\d*):)?\s*([\s\d,|-]*)\]/, Re = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ae = () => {
  let a;
  function n(c) {
    let m = (c.querySelector("[data-template]") || c.querySelector("script") || c).textContent;
    m = m.replace(new RegExp(V, "g"), "<\/script>");
    const g = m.match(/^\n?(\s*)/)[1].length, y = m.match(/^\n?(\t*)/)[1].length;
    return y > 0 ? m = m.replace(new RegExp("\\n?\\t{" + y + "}(.*)", "g"), function(p, k) {
      return `
` + k;
    }) : g > 1 && (m = m.replace(new RegExp("\\n? {" + g + "}(.*)", "g"), function(p, k) {
      return `
` + k;
    })), m;
  }
  function t(c) {
    const r = c.attributes, m = [];
    for (let g = 0, y = r.length; g < y; g++) {
      const p = r[g].name, k = r[g].value;
      /data\-(markdown|separator|vertical|notes)/gi.test(p) || (k ? m.push(p + '="' + k + '"') : m.push(p));
    }
    return m.join(" ");
  }
  function e(c) {
    var m;
    const r = (m = a == null ? void 0 : a.getConfig) == null ? void 0 : m.call(a).markdown;
    return c = c || {}, c.separator = c.separator || (r == null ? void 0 : r.separator) || _e, c.verticalSeparator = c.verticalSeparator || (r == null ? void 0 : r.verticalSeparator) || ye, c.notesSeparator = c.notesSeparator || (r == null ? void 0 : r.notesSeparator) || $e, c.attributes = c.attributes || "", c;
  }
  function i(c, r) {
    r = e(r);
    const m = c.split(new RegExp(r.notesSeparator, "mgi"));
    return m.length === 2 && (c = m[0] + '<aside class="notes">' + f(m[1].trim()) + "</aside>"), c = c.replace(/<\/script>/g, V), '<script type="text/template">' + c + "<\/script>";
  }
  function s(c, r) {
    r = e(r);
    const m = new RegExp(r.separator + (r.verticalSeparator ? "|" + r.verticalSeparator : ""), "mg"), g = new RegExp(r.separator);
    let y, p = 0, k, _ = !0, T, $ = [];
    for (; y = m.exec(c); )
      k = g.test(y[0]), !k && _ && $.push([]), T = c.substring(p, y.index), k && _ ? $.push(T) : $[$.length - 1].push(T), p = m.lastIndex, _ = k;
    (_ ? $ : $[$.length - 1]).push(c.substring(p));
    let R = "";
    for (let A = 0, v = $.length; A < v; A++)
      $[A] instanceof Array ? (R += "<section " + r.attributes + ">", $[A].forEach(function(te) {
        R += "<section data-markdown>" + i(te, r) + "</section>";
      }), R += "</section>") : R += "<section " + r.attributes + " data-markdown>" + i($[A], r) + "</section>";
    return R;
  }
  function l(c) {
    return new Promise(function(r) {
      const m = [];
      [].slice.call(c.querySelectorAll("section[data-markdown]:not([data-markdown-parsed])")).forEach(function(g, y) {
        g.getAttribute("data-markdown").length ? m.push(o(g).then(
          // Finished loading external file
          function(p, k) {
            g.outerHTML = s(p.responseText, {
              separator: g.getAttribute("data-separator"),
              verticalSeparator: g.getAttribute("data-separator-vertical"),
              notesSeparator: g.getAttribute("data-separator-notes"),
              attributes: t(g)
            });
          },
          // Failed to load markdown
          function(p, k) {
            g.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + k + " failed with HTTP status " + p.status + ".Check your browser's JavaScript console for more details.<p>Remember that you need to serve the presentation HTML from a HTTP server.</p></section>";
          }
        )) : g.outerHTML = s(n(g), {
          separator: g.getAttribute("data-separator"),
          verticalSeparator: g.getAttribute("data-separator-vertical"),
          notesSeparator: g.getAttribute("data-separator-notes"),
          attributes: t(g)
        });
      }), Promise.all(m).then(r);
    });
  }
  function o(c) {
    return new Promise(function(r, m) {
      const g = new XMLHttpRequest(), y = c.getAttribute("data-markdown"), p = c.getAttribute("data-charset");
      p !== null && p !== "" && g.overrideMimeType("text/html; charset=" + p), g.onreadystatechange = (function(k, _) {
        _.readyState === 4 && (_.status >= 200 && _.status < 300 || _.status === 0 ? r(_, y) : m(_, y));
      }).bind(this, c, g), g.open("GET", y, !0);
      try {
        g.send();
      } catch (k) {
        console.warn("Failed to get the Markdown file " + y + ". Make sure that the presentation and the file are served by a HTTP server and the file can be found there. " + k), r(g, y);
      }
    });
  }
  function h(c, r, m) {
    const g = new RegExp(m, "mg"), y = new RegExp('([^"= ]+?)="([^"]+?)"|(data-[^"= ]+?)(?=[" ])', "mg");
    let p = c.nodeValue, k, _;
    if (k = g.exec(p)) {
      const T = k[1];
      for (p = p.substring(0, k.index) + p.substring(g.lastIndex), c.nodeValue = p; _ = y.exec(T); )
        _[2] ? r.setAttribute(_[1], _[2]) : r.setAttribute(_[3], "");
      return !0;
    }
    return !1;
  }
  function w(c, r, m, g, y) {
    if (r !== null && r.childNodes !== void 0 && r.childNodes.length > 0) {
      let p = r;
      for (let k = 0; k < r.childNodes.length; k++) {
        const _ = r.childNodes[k];
        if (k > 0) {
          let $ = k - 1;
          for (; $ >= 0; ) {
            const R = r.childNodes[$];
            if (typeof R.setAttribute == "function" && R.tagName !== "BR") {
              p = R;
              break;
            }
            $ = $ - 1;
          }
        }
        let T = c;
        _.nodeName === "section" && (T = _, p = _), (typeof _.setAttribute == "function" || _.nodeType === Node.COMMENT_NODE) && w(T, _, p, g, y);
      }
    }
    r.nodeType === Node.COMMENT_NODE && h(r, m, g) === !1 && h(r, c, y);
  }
  function x() {
    const c = a.getRevealElement().querySelectorAll("[data-markdown]:not([data-markdown-parsed])");
    return [].slice.call(c).forEach(function(r) {
      r.setAttribute("data-markdown-parsed", !0);
      const m = r.querySelector("aside.notes"), g = n(r);
      r.innerHTML = f(g), w(
        r,
        r,
        null,
        r.getAttribute("data-element-attributes") || r.parentNode.getAttribute("data-element-attributes") || Se,
        r.getAttribute("data-attributes") || r.parentNode.getAttribute("data-attributes") || Te
      ), m && r.appendChild(m);
    }), Promise.resolve();
  }
  function b(c) {
    return c.replace(/([&<>'"])/g, (r) => Re[r]);
  }
  return {
    id: "markdown",
    /**
     * Starts processing and converting Markdown within the
     * current reveal.js deck.
     */
    init: function(c) {
      a = c;
      let { renderer: r, animateLists: m, ...g } = a.getConfig().markdown || {};
      return r || (r = new f.Renderer(), r.code = (y, p) => {
        let k = "", _ = "";
        if (M.test(p)) {
          let T = p.match(M)[2];
          T && (k = `data-ln-start-from="${T.trim()}"`), _ = p.match(M)[3].trim(), _ = `data-line-numbers="${_}"`, p = p.replace(M, "").trim();
        }
        return y = b(y), `<pre><code ${_} ${k} class="${p}">${y}</code></pre>`;
      }), m === !0 && (r.listitem = (y) => `<li class="fragment">${y}</li>`), f.setOptions({
        renderer: r,
        ...g
      }), l(a.getRevealElement()).then(x);
    },
    // TODO: Do these belong in the API?
    processSlides: l,
    convertSlides: x,
    slidify: s,
    marked: f
  };
};
export {
  Ae as default
};
