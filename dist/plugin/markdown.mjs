function X() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var I = X();
function pe(t) {
  I = t;
}
var P = { exec: () => null };
function m(t, e = "") {
  let n = typeof t == "string" ? t : t.source, s = { replace: (r, a) => {
    let l = typeof a == "string" ? a : a.source;
    return l = l.replace(T.caret, "$1"), n = n.replace(r, l), s;
  }, getRegex: () => new RegExp(n, e) };
  return s;
}
var Te = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), T = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, Ae = /^(?:[ \t]*(?:\n|$))+/, Ee = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, _e = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, M = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ze = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, W = / {0,3}(?:[*+-]|\d{1,9}[.)])/, he = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ue = m(he).replace(/bull/g, W).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), ve = m(he).replace(/bull/g, W).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), V = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Pe = /^[^\n]+/, J = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Le = m(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", J).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Ie = m(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, W).getRegex(), Q = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", K = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ce = m("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", K).replace("tag", Q).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ge = m(V).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex(), qe = m(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ge).getRegex(), Y = { blockquote: qe, code: Ee, def: Le, fences: _e, heading: ze, hr: M, html: Ce, lheading: ue, list: Ie, newline: Ae, paragraph: ge, table: P, text: Pe }, ne = m("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex(), Be = { ...Y, lheading: ve, table: ne, paragraph: m(V).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex() }, Me = { ...Y, html: m(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", K).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: P, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: m(V).replace("hr", M).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ue).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, De = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ne = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, de = /^( {2,}|\\)\n(?!\s*$)/, Oe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, F = /[\p{P}\p{S}]/u, ee = /[\s\p{P}\p{S}]/u, fe = /[^\s\p{P}\p{S}]/u, He = m(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, ee).getRegex(), ke = /(?!~)[\p{P}\p{S}]/u, Ze = /(?!~)[\s\p{P}\p{S}]/u, Qe = /(?:[^\s\p{P}\p{S}]|~)/u, xe = /(?![*_])[\p{P}\p{S}]/u, Fe = /(?![*_])[\s\p{P}\p{S}]/u, je = /(?:[^\s\p{P}\p{S}]|[*_])/u, Ue = m(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Te ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), be = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Ge = m(be, "u").replace(/punct/g, F).getRegex(), Xe = m(be, "u").replace(/punct/g, ke).getRegex(), me = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", We = m(me, "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, ee).replace(/punct/g, F).getRegex(), Ve = m(me, "gu").replace(/notPunctSpace/g, Qe).replace(/punctSpace/g, Ze).replace(/punct/g, ke).getRegex(), Je = m("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, ee).replace(/punct/g, F).getRegex(), Ke = m(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, xe).getRegex(), Ye = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", et = m(Ye, "gu").replace(/notPunctSpace/g, je).replace(/punctSpace/g, Fe).replace(/punct/g, xe).getRegex(), tt = m(/\\(punct)/, "gu").replace(/punct/g, F).getRegex(), rt = m(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), nt = m(K).replace("(?:-->|$)", "-->").getRegex(), st = m("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", nt).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), O = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, lt = m(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", O).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), we = m(/^!?\[(label)\]\[(ref)\]/).replace("label", O).replace("ref", J).getRegex(), Se = m(/^!?\[(ref)\](?:\[\])?/).replace("ref", J).getRegex(), at = m("reflink|nolink(?!\\()", "g").replace("reflink", we).replace("nolink", Se).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, te = { _backpedal: P, anyPunctuation: tt, autolink: rt, blockSkip: Ue, br: de, code: Ne, del: P, delLDelim: P, delRDelim: P, emStrongLDelim: Ge, emStrongRDelimAst: We, emStrongRDelimUnd: Je, escape: De, link: lt, nolink: Se, punctuation: He, reflink: we, reflinkSearch: at, tag: st, text: Oe, url: P }, it = { ...te, link: m(/^!?\[(label)\]\((.*?)\)/).replace("label", O).getRegex(), reflink: m(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", O).getRegex() }, j = { ...te, emStrongRDelimAst: Ve, emStrongLDelim: Xe, delLDelim: Ke, delRDelim: et, url: m(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: m(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() }, ot = { ...j, br: m(de).replace("{2,}", "*").getRegex(), text: m(j.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, D = { normal: Y, gfm: Be, pedantic: Me }, C = { normal: te, gfm: j, breaks: ot, pedantic: it }, ct = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, le = (t) => ct[t];
function z(t, e) {
  if (e) {
    if (T.escapeTest.test(t)) return t.replace(T.escapeReplace, le);
  } else if (T.escapeTestNoEncode.test(t)) return t.replace(T.escapeReplaceNoEncode, le);
  return t;
}
function ae(t) {
  try {
    t = encodeURI(t).replace(T.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function ie(t, e) {
  let n = t.replace(T.findPipe, (a, l, c) => {
    let i = !1, u = l;
    for (; --u >= 0 && c[u] === "\\"; ) i = !i;
    return i ? "|" : " |";
  }), s = n.split(T.splitPipe), r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s.at(-1)?.trim() && s.pop(), e) if (s.length > e) s.splice(e);
  else for (; s.length < e; ) s.push("");
  for (; r < s.length; r++) s[r] = s[r].trim().replace(T.slashPipe, "|");
  return s;
}
function q(t, e, n) {
  let s = t.length;
  if (s === 0) return "";
  let r = 0;
  for (; r < s && t.charAt(s - r - 1) === e; )
    r++;
  return t.slice(0, s - r);
}
function pt(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let s = 0; s < t.length; s++) if (t[s] === "\\") s++;
  else if (t[s] === e[0]) n++;
  else if (t[s] === e[1] && (n--, n < 0)) return s;
  return n > 0 ? -2 : -1;
}
function ht(t, e = 0) {
  let n = e, s = "";
  for (let r of t) if (r === "	") {
    let a = 4 - n % 4;
    s += " ".repeat(a), n += a;
  } else s += r, n++;
  return s;
}
function oe(t, e, n, s, r) {
  let a = e.href, l = e.title || null, c = t[1].replace(r.other.outputLinkReplace, "$1");
  s.state.inLink = !0;
  let i = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: l, text: c, tokens: s.inlineTokens(c) };
  return s.state.inLink = !1, i;
}
function ut(t, e, n) {
  let s = t.match(n.other.indentCodeCompensation);
  if (s === null) return e;
  let r = s[1];
  return e.split(`
`).map((a) => {
    let l = a.match(n.other.beginningSpace);
    if (l === null) return a;
    let [c] = l;
    return c.length >= r.length ? a.slice(r.length) : a;
  }).join(`
`);
}
var H = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || I;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : q(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], s = ut(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: s };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let s = q(n, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: q(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = q(e[0], `
`).split(`
`), s = "", r = "", a = [];
      for (; n.length > 0; ) {
        let l = !1, c = [], i;
        for (i = 0; i < n.length; i++) if (this.rules.other.blockquoteStart.test(n[i])) c.push(n[i]), l = !0;
        else if (!l) c.push(n[i]);
        else break;
        n = n.slice(i);
        let u = c.join(`
`), h = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${u}` : u, r = r ? `${r}
${h}` : h;
        let x = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, a, !0), this.lexer.state.top = x, n.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, o = p.raw + `
` + n.join(`
`), g = this.blockquote(o);
          a[a.length - 1] = g, s = s.substring(0, s.length - p.raw.length) + g.raw, r = r.substring(0, r.length - p.text.length) + g.text;
          break;
        } else if (f?.type === "list") {
          let p = f, o = p.raw + `
` + n.join(`
`), g = this.list(o);
          a[a.length - 1] = g, s = s.substring(0, s.length - f.raw.length) + g.raw, r = r.substring(0, r.length - p.raw.length) + g.raw, n = o.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: a, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), s = n.length > 1, r = { type: "list", raw: "", ordered: s, start: s ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
      let a = this.rules.other.listItemRegex(n), l = !1;
      for (; t; ) {
        let i = !1, u = "", h = "";
        if (!(e = a.exec(t)) || this.rules.block.hr.test(t)) break;
        u = e[0], t = t.substring(u.length);
        let x = ht(e[2].split(`
`, 1)[0], e[1].length), f = t.split(`
`, 1)[0], p = !x.trim(), o = 0;
        if (this.options.pedantic ? (o = 2, h = x.trimStart()) : p ? o = e[1].length + 1 : (o = x.search(this.rules.other.nonSpaceChar), o = o > 4 ? 1 : o, h = x.slice(o), o += e[1].length), p && this.rules.other.blankLine.test(f) && (u += f + `
`, t = t.substring(f.length + 1), i = !0), !i) {
          let g = this.rules.other.nextBulletRegex(o), d = this.rules.other.hrRegex(o), R = this.rules.other.fencesBeginRegex(o), k = this.rules.other.headingBeginRegex(o), b = this.rules.other.htmlBeginRegex(o), w = this.rules.other.blockquoteBeginRegex(o);
          for (; t; ) {
            let $ = t.split(`
`, 1)[0], y;
            if (f = $, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), y = f) : y = f.replace(this.rules.other.tabCharGlobal, "    "), R.test(f) || k.test(f) || b.test(f) || w.test(f) || g.test(f) || d.test(f)) break;
            if (y.search(this.rules.other.nonSpaceChar) >= o || !f.trim()) h += `
` + y.slice(o);
            else {
              if (p || x.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || R.test(x) || k.test(x) || d.test(x)) break;
              h += `
` + f;
            }
            p = !f.trim(), u += $ + `
`, t = t.substring($.length + 1), x = y.slice(o);
          }
        }
        r.loose || (l ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (l = !0)), r.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), r.raw += u;
      }
      let c = r.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let i of r.items) {
        if (this.lexer.state.top = !1, i.tokens = this.lexer.blockTokens(i.text, []), i.task) {
          if (i.text = i.text.replace(this.rules.other.listReplaceTask, ""), i.tokens[0]?.type === "text" || i.tokens[0]?.type === "paragraph") {
            i.tokens[0].raw = i.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), i.tokens[0].text = i.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let u = this.rules.other.listTaskCheckbox.exec(i.raw);
          if (u) {
            let h = { type: "checkbox", raw: u[0] + " ", checked: u[0] !== "[ ]" };
            i.checked = h.checked, r.loose ? i.tokens[0] && ["paragraph", "text"].includes(i.tokens[0].type) && "tokens" in i.tokens[0] && i.tokens[0].tokens ? (i.tokens[0].raw = h.raw + i.tokens[0].raw, i.tokens[0].text = h.raw + i.tokens[0].text, i.tokens[0].tokens.unshift(h)) : i.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : i.tokens.unshift(h);
          }
        }
        if (!r.loose) {
          let u = i.tokens.filter((x) => x.type === "space"), h = u.length > 0 && u.some((x) => this.rules.other.anyLine.test(x.raw));
          r.loose = h;
        }
      }
      if (r.loose) for (let i of r.items) {
        i.loose = !0;
        for (let u of i.tokens) u.type === "text" && (u.type = "paragraph");
      }
      return r;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: s, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = ie(e[1]), s = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === s.length) {
      for (let l of s) this.rules.other.tableAlignRight.test(l) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? a.align.push("left") : a.align.push(null);
      for (let l = 0; l < n.length; l++) a.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: a.align[l] });
      for (let l of r) a.rows.push(ie(l, a.header.length).map((c, i) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[i] })));
      return a;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let a = q(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = pt(e[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + a;
          e[2] = e[2].substring(0, a), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let s = e[2], r = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(s);
        a && (s = a[1], r = a[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), oe(e, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let s = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[s.toLowerCase()];
      if (!r) {
        let a = n[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return oe(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, a, l, c = r, i = 0, u = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = u.exec(e)) != null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue;
        if (l = [...a].length, s[3] || s[4]) {
          c += l;
          continue;
        } else if ((s[5] || s[6]) && r % 3 && !((r + l) % 3)) {
          i += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + i);
        let h = [...s[0]][0].length, x = t.slice(0, r + s.index + h + l);
        if (Math.min(r, l) % 2) {
          let p = x.slice(1, -1);
          return { type: "em", raw: x, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let f = x.slice(2, -2);
        return { type: "strong", raw: x, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return s && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, n = "") {
    let s = this.rules.inline.delLDelim.exec(t);
    if (s && (!s[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...s[0]].length - 1, a, l, c = r, i = this.rules.inline.delRDelim;
      for (i.lastIndex = 0, e = e.slice(-1 * t.length + r); (s = i.exec(e)) != null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a || (l = [...a].length, l !== r)) continue;
        if (s[3] || s[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let u = [...s[0]][0].length, h = t.slice(0, r + s.index + u + l), x = h.slice(r, -r);
        return { type: "del", raw: h, text: x, tokens: this.lexer.inlineTokens(x) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, s;
      return e[2] === "@" ? (n = e[1], s = "mailto:" + n) : (n = e[1], s = n), { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, s;
      if (e[2] === "@") n = e[0], s = "mailto:" + n;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        n = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: s, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, E = class U {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || I, this.options.tokenizer = this.options.tokenizer || new H(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: T, block: D.normal, inline: C.normal };
    this.options.pedantic ? (n.block = D.pedantic, n.inline = C.pedantic) : this.options.gfm && (n.block = D.gfm, this.options.breaks ? n.inline = C.breaks : n.inline = C.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: D, inline: C };
  }
  static lex(e, n) {
    return new U(n).lex(e);
  }
  static lexInline(e, n) {
    return new U(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(T.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], s = !1) {
    for (this.options.pedantic && (e = e.replace(T.tabCharGlobal, "    ").replace(T.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((l) => (r = l.call({ lexer: this }, e, n)) ? (e = e.substring(r.raw.length), n.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let l = n.at(-1);
        r.raw.length === 1 && l !== void 0 ? l.raw += `
` : n.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.at(-1).src = l.text) : n.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, n.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      let a = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), i;
        this.options.extensions.startBlock.forEach((u) => {
          i = u.call({ lexer: this }, c), typeof i == "number" && i >= 0 && (l = Math.min(l, i));
        }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(a))) {
        let l = n.at(-1);
        s && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(r), s = a.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let l = n.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + r.raw, l.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(r);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let s = e, r = null;
    if (this.tokens.links) {
      let i = Object.keys(this.tokens.links);
      if (i.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(s)) != null; ) i.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (s = s.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(s)) != null; ) s = s.slice(0, r.index) + "++" + s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let a;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(s)) != null; ) a = r[2] ? r[2].length : 0, s = s.slice(0, r.index + a) + "[" + "a".repeat(r[0].length - a - 2) + "]" + s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    s = this.options.hooks?.emStrongMask?.call({ lexer: this }, s) ?? s;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let i;
      if (this.options.extensions?.inline?.some((h) => (i = h.call({ lexer: this }, e, n)) ? (e = e.substring(i.raw.length), n.push(i), !0) : !1)) continue;
      if (i = this.tokenizer.escape(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.tag(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.link(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(i.raw.length);
        let h = n.at(-1);
        i.type === "text" && h?.type === "text" ? (h.raw += i.raw, h.text += i.text) : n.push(i);
        continue;
      }
      if (i = this.tokenizer.emStrong(e, s, c)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.codespan(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.br(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.del(e, s, c)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (i = this.tokenizer.autolink(e)) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      if (!this.state.inLink && (i = this.tokenizer.url(e))) {
        e = e.substring(i.raw.length), n.push(i);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, x = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, x), typeof f == "number" && f >= 0 && (h = Math.min(h, f));
        }), h < 1 / 0 && h >= 0 && (u = e.substring(0, h + 1));
      }
      if (i = this.tokenizer.inlineText(u)) {
        e = e.substring(i.raw.length), i.raw.slice(-1) !== "_" && (c = i.raw.slice(-1)), l = !0;
        let h = n.at(-1);
        h?.type === "text" ? (h.raw += i.raw, h.text += i.text) : n.push(i);
        continue;
      }
      if (e) {
        let h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return n;
  }
}, Z = class {
  options;
  parser;
  constructor(t) {
    this.options = t || I;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let s = (e || "").match(T.notSpaceStart)?.[0], r = t.replace(T.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + z(s) + '">' + (n ? r : z(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : z(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, n = t.start, s = "";
    for (let l = 0; l < t.items.length; l++) {
      let c = t.items[l];
      s += this.listitem(c);
    }
    let r = e ? "ol" : "ul", a = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + a + `>
` + s + "</" + r + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", n = "";
    for (let r = 0; r < t.header.length; r++) n += this.tablecell(t.header[r]);
    e += this.tablerow({ text: n });
    let s = "";
    for (let r = 0; r < t.rows.length; r++) {
      let a = t.rows[r];
      n = "";
      for (let l = 0; l < a.length; l++) n += this.tablecell(a[l]);
      s += this.tablerow({ text: n });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${z(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let s = this.parser.parseInline(n), r = ae(t);
    if (r === null) return s;
    t = r;
    let a = '<a href="' + t + '"';
    return e && (a += ' title="' + z(e) + '"'), a += ">" + s + "</a>", a;
  }
  image({ href: t, title: e, text: n, tokens: s }) {
    s && (n = this.parser.parseInline(s, this.parser.textRenderer));
    let r = ae(t);
    if (r === null) return z(n);
    t = r;
    let a = `<img src="${t}" alt="${z(n)}"`;
    return e && (a += ` title="${z(e)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : z(t.text);
  }
}, re = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, _ = class G {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || I, this.options.renderer = this.options.renderer || new Z(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new re();
  }
  static parse(e, n) {
    return new G(n).parse(e);
  }
  static parseInline(e, n) {
    return new G(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (this.options.extensions?.renderers?.[r.type]) {
        let l = r, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          n += c || "";
          continue;
        }
      }
      let a = r;
      switch (a.type) {
        case "space": {
          n += this.renderer.space(a);
          break;
        }
        case "hr": {
          n += this.renderer.hr(a);
          break;
        }
        case "heading": {
          n += this.renderer.heading(a);
          break;
        }
        case "code": {
          n += this.renderer.code(a);
          break;
        }
        case "table": {
          n += this.renderer.table(a);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(a);
          break;
        }
        case "list": {
          n += this.renderer.list(a);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(a);
          break;
        }
        case "html": {
          n += this.renderer.html(a);
          break;
        }
        case "def": {
          n += this.renderer.def(a);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(a);
          break;
        }
        case "text": {
          n += this.renderer.text(a);
          break;
        }
        default: {
          let l = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let s = "";
    for (let r = 0; r < e.length; r++) {
      let a = e[r];
      if (this.options.extensions?.renderers?.[a.type]) {
        let c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          s += c || "";
          continue;
        }
      }
      let l = a;
      switch (l.type) {
        case "escape": {
          s += n.text(l);
          break;
        }
        case "html": {
          s += n.html(l);
          break;
        }
        case "link": {
          s += n.link(l);
          break;
        }
        case "image": {
          s += n.image(l);
          break;
        }
        case "checkbox": {
          s += n.checkbox(l);
          break;
        }
        case "strong": {
          s += n.strong(l);
          break;
        }
        case "em": {
          s += n.em(l);
          break;
        }
        case "codespan": {
          s += n.codespan(l);
          break;
        }
        case "br": {
          s += n.br(l);
          break;
        }
        case "del": {
          s += n.del(l);
          break;
        }
        case "text": {
          s += n.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return s;
  }
}, B = class {
  options;
  block;
  constructor(t) {
    this.options = t || I;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? E.lex : E.lexInline;
  }
  provideParser() {
    return this.block ? _.parse : _.parseInline;
  }
}, Re = class {
  defaults = X();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = _;
  Renderer = Z;
  TextRenderer = re;
  Lexer = E;
  Tokenizer = H;
  Hooks = B;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let s of t) switch (n = n.concat(e.call(this, s)), s.type) {
      case "table": {
        let r = s;
        for (let a of r.header) n = n.concat(this.walkTokens(a.tokens, e));
        for (let a of r.rows) for (let l of a) n = n.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let r = s;
        n = n.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = s;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((a) => {
          let l = r[a].flat(1 / 0);
          n = n.concat(this.walkTokens(l, e));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let s = { ...n };
      if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let a = e.renderers[r.name];
          a ? e.renderers[r.name] = function(...l) {
            let c = r.renderer.apply(this, l);
            return c === !1 && (c = a.apply(this, l)), c;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[r.level];
          a ? a.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), s.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new Z(this.defaults);
        for (let a in n.renderer) {
          if (!(a in r)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let l = a, c = n.renderer[l], i = r[l];
          r[l] = (...u) => {
            let h = c.apply(r, u);
            return h === !1 && (h = i.apply(r, u)), h || "";
          };
        }
        s.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new H(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in r)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let l = a, c = n.tokenizer[l], i = r[l];
          r[l] = (...u) => {
            let h = c.apply(r, u);
            return h === !1 && (h = i.apply(r, u)), h;
          };
        }
        s.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new B();
        for (let a in n.hooks) {
          if (!(a in r)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let l = a, c = n.hooks[l], i = r[l];
          B.passThroughHooks.has(a) ? r[l] = (u) => {
            if (this.defaults.async && B.passThroughHooksRespectAsync.has(a)) return (async () => {
              let x = await c.call(r, u);
              return i.call(r, x);
            })();
            let h = c.call(r, u);
            return i.call(r, h);
          } : r[l] = (...u) => {
            if (this.defaults.async) return (async () => {
              let x = await c.apply(r, u);
              return x === !1 && (x = await i.apply(r, u)), x;
            })();
            let h = c.apply(r, u);
            return h === !1 && (h = i.apply(r, u)), h;
          };
        }
        s.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, a = n.walkTokens;
        s.walkTokens = function(l) {
          let c = [];
          return c.push(a.call(this, l)), r && (c = c.concat(r.call(this, l))), c;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return E.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return _.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let s = { ...n }, r = { ...this.defaults, ...s }, a = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let l = r.hooks ? await r.hooks.preprocess(e) : e, c = await (r.hooks ? await r.hooks.provideLexer() : t ? E.lex : E.lexInline)(l, r), i = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(i, r.walkTokens));
        let u = await (r.hooks ? await r.hooks.provideParser() : t ? _.parse : _.parseInline)(i, r);
        return r.hooks ? await r.hooks.postprocess(u) : u;
      })().catch(a);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let l = (r.hooks ? r.hooks.provideLexer() : t ? E.lex : E.lexInline)(e, r);
        r.hooks && (l = r.hooks.processAllTokens(l)), r.walkTokens && this.walkTokens(l, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : t ? _.parse : _.parseInline)(l, r);
        return r.hooks && (c = r.hooks.postprocess(c)), c;
      } catch (l) {
        return a(l);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + z(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(s) : s;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, L = new Re();
function S(t, e) {
  return L.parse(t, e);
}
S.options = S.setOptions = function(t) {
  return L.setOptions(t), S.defaults = L.defaults, pe(S.defaults), S;
};
S.getDefaults = X;
S.defaults = I;
S.use = function(...t) {
  return L.use(...t), S.defaults = L.defaults, pe(S.defaults), S;
};
S.walkTokens = function(t, e) {
  return L.walkTokens(t, e);
};
S.parseInline = L.parseInline;
S.Parser = _;
S.parser = _.parse;
S.Renderer = Z;
S.TextRenderer = re;
S.Lexer = E;
S.lexer = E.lex;
S.Tokenizer = H;
S.Hooks = B;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
_.parse;
E.lex;
const gt = /<(\/?)(?:pre|code|kbd|script|math)[^>]*>/i, dt = (t = "", e = "1") => {
  var n, s, r, a, l, c = 0;
  if (typeof e == "number" ? e = e.toString() : e = e.replace(/\s/g, ""), e === "0")
    return t;
  if (e === "1")
    n = 1, s = 1, r = 1, a = 1;
  else if (e === "2")
    n = 1, s = 1, r = 2, a = 1;
  else if (e === "3")
    n = 1, s = 1, r = 3, a = 1;
  else if (e === "-1")
    l = 1;
  else
    for (let f = 0; f < e.length; f++) {
      let p = e[f];
      p === "q" && (n = 1), p === "b" && (s = 1), p === "B" && (s = 2), p === "d" && (r = 1), p === "D" && (r = 2), p === "i" && (r = 3), p === "e" && (a = 1), p === "w" && (c = 1);
    }
  var i = $t(t), u = "", h = 0, x = "";
  for (let f = 0; f < i.length; f++) {
    let p = i[f];
    if (p[0] === "tag") {
      u = u + p[1];
      let o = gt.exec(p[1]);
      o && (o[1] === "/" ? h = 0 : h = 1);
    } else {
      let o = p[1], g = o.substring(o.length - 1, o.length);
      h || (o = yt(o), c && (o = o.replace(/$quot;/g, '"')), r && (r === 1 && (o = bt(o)), r === 2 && (o = mt(o)), r === 3 && (o = wt(o))), a && (o = St(o)), s && (o = kt(o), s === 2 && (o = xt(o))), n && (o === "'" ? /\S/.test(x) ? o = "&#8217;" : o = "&#8216;" : o === '"' ? /\S/.test(x) ? o = "&#8221;" : o = "&#8220;" : o = ft(o)), l && (o = Rt(o))), x = g, u = u + o;
    }
  }
  return u;
}, ft = (t) => {
  var e = "[!\"#$%'()*+,-./:;<=>?@[\\]^_`{|}~]";
  t = t.replace(new RegExp(`^'(?=${e}\\B)`), "&#8217;"), t = t.replace(new RegExp(`^"(?=${e}\\B)`), "&#8221;"), t = t.replace(/"'(?=\w)/, "&#8220;&#8216;"), t = t.replace(/'"(?=\w)/, "&#8216;&#8220;"), t = t.replace(/'(?=\d\d)/, "&#8217;");
  var n = "[^\\ \\t\\r\\n\\[\\{\\(\\-]", s = "[\\ \\t\\r\\n\\[\\{\\(\\-]", r = "&#8211;|&#8212;";
  return t = t.replace(new RegExp(`(\\s|&nbsp;|--|&[mn]dash;|${r}|&#x201[34])'(?=\\w)`, "g"), "$1&#8216;"), t = t.replace(new RegExp(`(${n})'`, "g"), "$1&#8217;"), t = t.replace(new RegExp(`(${s}?)'(?=\\s|s\\b)`, "g"), "$1&#8217;"), t = t.replace(/'/g, "&#8216;"), t = t.replace(new RegExp(`(\\s|&nbsp;|--|&[mn]dash;|${r}|&#x201[34])"(?=\\w)`, "g"), "$1&#8220;"), t = t.replace(new RegExp(`(${n})"`, "g"), "$1&#8221;"), t = t.replace(new RegExp(`(${s}?)"(?=\\s)`, "g"), "$1&#8221;"), t = t.replace(/"/g, "&#8220;"), t;
}, kt = (t) => (t = t.replace(/``/g, "&#8220;"), t = t.replace(/''/g, "&#8221;"), t), xt = (t) => (t = t.replace(/`/g, "&#8216;"), t = t.replace(/'/g, "&#8217;"), t), bt = (t) => (t = t.replace(/--/g, "&#8212;"), t), mt = (t) => (t = t.replace(/---/g, "&#8212;"), t = t.replace(/--/g, "&#8211;"), t), wt = (t) => (t = t.replace(/---/g, "&#8211;"), t = t.replace(/--/g, "&#8212;"), t), St = (t) => (t = t.replace(/\.\.\./g, "&#8230;"), t = t.replace(/\. \. \./g, "&#8230;"), t), Rt = (t) => (t = t.replace(/&#8211;/g, "-"), t = t.replace(/&#8212;/g, "--"), t = t.replace(/&#8216;/g, "'"), t = t.replace(/&#8217;/g, "'"), t = t.replace(/&#8220;/g, '"'), t = t.replace(/&#8221;/g, '"'), t = t.replace(/&#8230;/g, "..."), t), yt = (t) => (t = t.replace(/\\\\/g, "&#92;"), t = t.replace(/\\"/g, "&#34;"), t = t.replace(/\\'/g, "&#39;"), t = t.replace(/\\\./g, "&#46;"), t = t.replace(/\\-/g, "&#45;"), t = t.replace(/\\`/g, "&#96;"), t), $t = (t) => {
  for (var e = 0, n = t.length, s = [], r = /<!--[\s\S]*?-->|<\?.*?\?>|<[^>]*>/g, a = null; a = r.exec(t); ) {
    if (e < a.index) {
      let c = ["text", t.substring(e, a.index)];
      s.push(c);
    }
    let l = ["tag", a.toString()];
    s.push(l), e = r.lastIndex;
  }
  if (e < n) {
    let l = ["text", t.substring(e, n)];
    s.push(l);
  }
  return s;
};
function Tt({
  config: t = 2
} = {}) {
  return {
    tokenizer: {
      inlineText(e) {
        const n = this.rules.inline.text.exec(e);
        if (n)
          return {
            type: "text",
            raw: n[0],
            text: n[0],
            escaped: !0
          };
      }
    },
    hooks: {
      postprocess(e) {
        return dt(e, t);
      }
    }
  };
}
const At = `\r?
---\r?
`, Et = null, _t = "^s*notes?:", zt = "\\.element\\s*?(.+?)$", vt = "\\.slide:\\s*?(\\S.+?)$", ce = "__SCRIPT_END__", N = /\[\s*((\d*):)?\s*([\s\d,|-]*)\]/, Pt = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Lt = () => {
  let t, e = null;
  function n(p) {
    let g = (p.querySelector("[data-template]") || p.querySelector("script") || p).textContent;
    g = g.replace(new RegExp(ce, "g"), "<\/script>");
    const d = g.match(/^\n?(\s*)/)[1].length, R = g.match(/^\n?(\t*)/)[1].length;
    return R > 0 ? g = g.replace(new RegExp("\\n?\\t{" + R + "}(.*)", "g"), function(k, b) {
      return `
` + b;
    }) : d > 1 && (g = g.replace(new RegExp("\\n? {" + d + "}(.*)", "g"), function(k, b) {
      return `
` + b;
    })), g;
  }
  function s(p) {
    const o = p.attributes, g = [];
    for (let d = 0, R = o.length; d < R; d++) {
      const k = o[d].name, b = o[d].value;
      /data\-(markdown|separator|vertical|notes)/gi.test(k) || (b ? g.push(k + '="' + b + '"') : g.push(k));
    }
    return g.join(" ");
  }
  function r(p) {
    const o = t?.getConfig?.().markdown;
    return p = p || {}, p.separator = p.separator || o?.separator || At, p.verticalSeparator = p.verticalSeparator || o?.verticalSeparator || Et, p.notesSeparator = p.notesSeparator || o?.notesSeparator || _t, p.attributes = p.attributes || "", p;
  }
  function a(p, o) {
    o = r(o);
    const g = p.split(new RegExp(o.notesSeparator, "mgi"));
    return g.length === 2 && e && (p = g[0] + '<aside class="notes">' + e.parse(g[1].trim()) + "</aside>"), p = p.replace(/<\/script>/g, ce), '<script type="text/template">' + p + "<\/script>";
  }
  function l(p, o) {
    o = r(o);
    const g = new RegExp(o.separator + (o.verticalSeparator ? "|" + o.verticalSeparator : ""), "mg"), d = new RegExp(o.separator);
    let R, k = 0, b, w = !0, $, y = [];
    for (; R = g.exec(p); )
      b = d.test(R[0]), !b && w && y.push([]), $ = p.substring(k, R.index), b && w ? y.push($) : y[y.length - 1].push($), k = g.lastIndex, w = b;
    (w ? y : y[y.length - 1]).push(p.substring(k));
    let A = "";
    for (let v = 0, ye = y.length; v < ye; v++)
      y[v] instanceof Array ? (A += "<section " + o.attributes + ">", y[v].forEach(function($e) {
        A += "<section data-markdown>" + a($e, o) + "</section>";
      }), A += "</section>") : A += "<section " + o.attributes + " data-markdown>" + a(y[v], o) + "</section>";
    return A;
  }
  function c(p) {
    return new Promise(function(o) {
      const g = [];
      [].slice.call(p.querySelectorAll("section[data-markdown]:not([data-markdown-parsed])")).forEach(function(d, R) {
        d.getAttribute("data-markdown").length ? g.push(i(d).then(
          // Finished loading external file
          function(k, b) {
            d.outerHTML = l(k.responseText, {
              separator: d.getAttribute("data-separator"),
              verticalSeparator: d.getAttribute("data-separator-vertical"),
              notesSeparator: d.getAttribute("data-separator-notes"),
              attributes: s(d)
            });
          },
          // Failed to load markdown
          function(k, b) {
            d.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + b + " failed with HTTP status " + k.status + ".Check your browser's JavaScript console for more details.<p>Remember that you need to serve the presentation HTML from a HTTP server.</p></section>";
          }
        )) : d.outerHTML = l(n(d), {
          separator: d.getAttribute("data-separator"),
          verticalSeparator: d.getAttribute("data-separator-vertical"),
          notesSeparator: d.getAttribute("data-separator-notes"),
          attributes: s(d)
        });
      }), Promise.all(g).then(o);
    });
  }
  function i(p) {
    return new Promise(function(o, g) {
      const d = new XMLHttpRequest(), R = p.getAttribute("data-markdown"), k = p.getAttribute("data-charset");
      k !== null && k !== "" && d.overrideMimeType("text/html; charset=" + k), d.onreadystatechange = (function(b, w) {
        w.readyState === 4 && (w.status >= 200 && w.status < 300 || w.status === 0 ? o(w, R) : g(w, R));
      }).bind(this, p, d), d.open("GET", R, !0);
      try {
        d.send();
      } catch (b) {
        console.warn("Failed to get the Markdown file " + R + ". Make sure that the presentation and the file are served by a HTTP server and the file can be found there. " + b), o(d, R);
      }
    });
  }
  function u(p, o, g) {
    const d = new RegExp(g, "mg"), R = new RegExp('([^"= ]+?)="([^"]+?)"|(data-[^"= ]+?)(?=[" ])', "mg");
    let k = p.nodeValue, b, w;
    if (b = d.exec(k)) {
      const $ = b[1];
      for (k = k.substring(0, b.index) + k.substring(d.lastIndex), p.nodeValue = k; w = R.exec($); )
        w[2] ? o.setAttribute(w[1], w[2]) : o.setAttribute(w[3], "");
      return !0;
    }
    return !1;
  }
  function h(p, o, g, d, R) {
    if (o !== null && o.childNodes !== void 0 && o.childNodes.length > 0) {
      let k = o;
      for (let b = 0; b < o.childNodes.length; b++) {
        const w = o.childNodes[b];
        if (b > 0) {
          let y = b - 1;
          for (; y >= 0; ) {
            const A = o.childNodes[y];
            if (typeof A.setAttribute == "function" && A.tagName !== "BR") {
              k = A;
              break;
            }
            y = y - 1;
          }
        }
        let $ = p;
        w.nodeName === "section" && ($ = w, k = w), (typeof w.setAttribute == "function" || w.nodeType === Node.COMMENT_NODE) && h($, w, k, d, R);
      }
    }
    if (o.nodeType === Node.COMMENT_NODE) {
      let k = g;
      k && (k.tagName === "UL" || k.tagName === "OL") && (k = k.lastElementChild || k), u(o, k, d) === !1 && u(o, p, R);
    }
  }
  function x() {
    const p = t.getRevealElement().querySelectorAll("[data-markdown]:not([data-markdown-parsed])");
    return [].slice.call(p).forEach(function(o) {
      o.setAttribute("data-markdown-parsed", !0);
      const g = o.querySelector("aside.notes"), d = n(o);
      o.innerHTML = e ? e.parse(d) : d, h(
        o,
        o,
        null,
        o.getAttribute("data-element-attributes") || o.parentNode.getAttribute("data-element-attributes") || zt,
        o.getAttribute("data-attributes") || o.parentNode.getAttribute("data-attributes") || vt
      ), g && o.appendChild(g);
    }), Promise.resolve();
  }
  function f(p) {
    return p.replace(/([&<>'"])/g, (o) => Pt[o]);
  }
  return {
    id: "markdown",
    /**
     * Starts processing and converting Markdown within the
     * current reveal.js deck.
     */
    init: function(p) {
      t = p;
      let { renderer: o, animateLists: g, smartypants: d, ...R } = t.getConfig().markdown || {};
      const k = o || {
        code({ text: b, lang: w }) {
          let $ = w || "", y = "", A = "";
          if (N.test($)) {
            let v = $.match(N)[2];
            v && (y = `data-ln-start-from="${v.trim()}"`), A = $.match(N)[3].trim(), A = `data-line-numbers="${A}"`, $ = $.replace(N, "").trim();
          }
          return b = f(b), `<pre><code ${A} ${y} class="${$}">${b}</code></pre>`;
        }
      };
      return g === !0 && !o && (k.listitem = function(b) {
        return `<li class="fragment">${b.tokens ? this.parser.parseInline(b.tokens) : b.text || ""}</li>`;
      }), e = new Re(), e.use({ renderer: k, ...R }), d && e.use(Tt()), c(t.getRevealElement()).then(x);
    },
    // TODO: Do these belong in the API?
    processSlides: c,
    convertSlides: x,
    slidify: l,
    get marked() {
      return e;
    },
    get markdownOptions() {
      return t ? t.getConfig().markdown || {} : {};
    }
  };
};
export {
  Lt as default
};
