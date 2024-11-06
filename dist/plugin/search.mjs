/*!
 * Handles finding a text string anywhere in the slides and showing the next occurrence to the user
 * by navigatating to that slide and highlighting it.
 *
 * @author Jon Snyder <snyder.jon@gmail.com>, February 2013
 */
const D = () => {
  let c, t, l, n, a, y, s;
  function g() {
    t = document.createElement("div"), t.classList.add("searchbox"), t.style.position = "absolute", t.style.top = "10px", t.style.right = "10px", t.style.zIndex = 10, t.innerHTML = `<input type="search" class="searchinput" placeholder="Search..." style="vertical-align: top;"/>
		</span>`, l = t.querySelector(".searchinput"), l.style.width = "240px", l.style.fontSize = "14px", l.style.padding = "4px 6px", l.style.color = "#000", l.style.background = "#fff", l.style.borderRadius = "2px", l.style.border = "0", l.style.outline = "0", l.style.boxShadow = "0 2px 18px rgba(0, 0, 0, 0.2)", l.style["-webkit-appearance"] = "none", c.getRevealElement().appendChild(t), l.addEventListener("keyup", function(r) {
      switch (r.keyCode) {
        case 13:
          r.preventDefault(), k(), y = !1;
          break;
        default:
          y = !0;
      }
    }, !1), v();
  }
  function w() {
    t || g(), t.style.display = "inline", l.focus(), l.select();
  }
  function v() {
    t || g(), t.style.display = "none", s && s.remove();
  }
  function C() {
    t || g(), t.style.display !== "inline" ? w() : v();
  }
  function k() {
    if (y) {
      var r = l.value;
      r === "" ? (s && s.remove(), n = null) : (s = new T("slidecontent"), n = s.apply(r), a = 0);
    }
    n && (n.length && n.length <= a && (a = 0), n.length > a && (c.slide(n[a].h, n[a].v), a++));
  }
  function T(r, f) {
    var L = document.getElementById(r) || document.body, x = f || "EM", I = new RegExp("^(?:" + x + "|SCRIPT|FORM)$"), E = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"], m = [], M = 0, p = "", d = [];
    this.setRegex = function(e) {
      e = e.trim(), p = new RegExp("(" + e + ")", "i");
    }, this.getRegex = function() {
      return p.toString().replace(/^\/\\b\(|\)\\b\/i$/g, "").replace(/\|/g, " ");
    }, this.hiliteWords = function(e) {
      if (!(e == null || !e) && p && !I.test(e.nodeName)) {
        if (e.hasChildNodes())
          for (var i = 0; i < e.childNodes.length; i++)
            this.hiliteWords(e.childNodes[i]);
        if (e.nodeType == 3) {
          var N, o;
          if ((N = e.nodeValue) && (o = p.exec(N))) {
            for (var h = e; h != null && h.nodeName != "SECTION"; )
              h = h.parentNode;
            for (var S = c.getIndices(h), B = d.length, R = !1, i = 0; i < B; i++)
              d[i].h === S.h && d[i].v === S.v && (R = !0);
            R || d.push(S), m[o[0].toLowerCase()] || (m[o[0].toLowerCase()] = E[M++ % E.length]);
            var u = document.createElement(x);
            u.appendChild(document.createTextNode(o[0])), u.style.backgroundColor = m[o[0].toLowerCase()], u.style.fontStyle = "inherit", u.style.color = "#000";
            var b = e.splitText(o.index);
            b.nodeValue = b.nodeValue.substring(o[0].length), e.parentNode.insertBefore(u, b);
          }
        }
      }
    }, this.remove = function() {
      for (var e = document.getElementsByTagName(x), i; e.length && (i = e[0]); )
        i.parentNode.replaceChild(i.firstChild, i);
    }, this.apply = function(e) {
      if (!(e == null || !e))
        return this.remove(), this.setRegex(e), this.hiliteWords(L), d;
    };
  }
  return {
    id: "search",
    init: (r) => {
      c = r, c.registerKeyboardShortcut("CTRL + Shift + F", "Search"), document.addEventListener("keydown", function(f) {
        f.key == "F" && (f.ctrlKey || f.metaKey) && (f.preventDefault(), C());
      }, !1);
    },
    open: w,
    close: v,
    toggle: C
  };
};
export {
  D as default
};
