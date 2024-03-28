/*!
 * Handles finding a text string anywhere in the slides and showing the next occurrence to the user
 * by navigatating to that slide and highlighting it.
 *
 * @author Jon Snyder <snyder.jon@gmail.com>, February 2013
 */
const D = () => {
  let c, t, i, n, a, y, s;
  function g() {
    t = document.createElement("div"), t.classList.add("searchbox"), t.style.position = "absolute", t.style.top = "10px", t.style.right = "10px", t.style.zIndex = 10, t.innerHTML = `<input type="search" class="searchinput" placeholder="Search..." style="vertical-align: top;"/>
		</span>`, i = t.querySelector(".searchinput"), i.style.width = "240px", i.style.fontSize = "14px", i.style.padding = "4px 6px", i.style.color = "#000", i.style.background = "#fff", i.style.borderRadius = "2px", i.style.border = "0", i.style.outline = "0", i.style.boxShadow = "0 2px 18px rgba(0, 0, 0, 0.2)", i.style["-webkit-appearance"] = "none", c.getRevealElement().appendChild(t), i.addEventListener("keyup", function(r) {
      switch (r.keyCode) {
        case 13:
          r.preventDefault(), k(), y = !1;
          break;
        default:
          y = !0;
      }
    }, !1), w();
  }
  function b() {
    t || g(), t.style.display = "inline", i.focus(), i.select();
  }
  function w() {
    t || g(), t.style.display = "none", s && s.remove();
  }
  function R() {
    t || g(), t.style.display !== "inline" ? b() : w();
  }
  function k() {
    if (y) {
      var r = i.value;
      r === "" ? (s && s.remove(), n = null) : (s = new T("slidecontent"), n = s.apply(r), a = 0);
    }
    n && (n.length && n.length <= a && (a = 0), n.length > a && (c.slide(n[a].h, n[a].v), a++));
  }
  function T(r, f) {
    var L = document.getElementById(r) || document.body, v = f || "EM", I = new RegExp("^(?:" + v + "|SCRIPT|FORM)$"), C = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"], x = [], M = 0, p = "", d = [];
    this.setRegex = function(e) {
      e = e.trim(), p = new RegExp("(" + e + ")", "i");
    }, this.getRegex = function() {
      return p.toString().replace(/^\/\\b\(|\)\\b\/i$/g, "").replace(/\|/g, " ");
    }, this.hiliteWords = function(e) {
      if (!(e == null || !e) && p && !I.test(e.nodeName)) {
        if (e.hasChildNodes())
          for (var l = 0; l < e.childNodes.length; l++)
            this.hiliteWords(e.childNodes[l]);
        if (e.nodeType == 3) {
          var E, o;
          if ((E = e.nodeValue) && (o = p.exec(E))) {
            for (var h = e; h != null && h.nodeName != "SECTION"; )
              h = h.parentNode;
            for (var m = c.getIndices(h), B = d.length, N = !1, l = 0; l < B; l++)
              d[l].h === m.h && d[l].v === m.v && (N = !0);
            N || d.push(m), x[o[0].toLowerCase()] || (x[o[0].toLowerCase()] = C[M++ % C.length]);
            var u = document.createElement(v);
            u.appendChild(document.createTextNode(o[0])), u.style.backgroundColor = x[o[0].toLowerCase()], u.style.fontStyle = "inherit", u.style.color = "#000";
            var S = e.splitText(o.index);
            S.nodeValue = S.nodeValue.substring(o[0].length), e.parentNode.insertBefore(u, S);
          }
        }
      }
    }, this.remove = function() {
      for (var e = document.getElementsByTagName(v), l; e.length && (l = e[0]); )
        l.parentNode.replaceChild(l.firstChild, l);
    }, this.apply = function(e) {
      if (!(e == null || !e))
        return this.remove(), this.setRegex(e), this.hiliteWords(L), d;
    };
  }
  return {
    id: "search",
    init: (r) => {
      c = r, c.registerKeyboardShortcut("CTRL + Shift + F", "Search"), document.addEventListener("keydown", function(f) {
        f.key == "F" && (f.ctrlKey || f.metaKey) && (f.preventDefault(), R());
      }, !1);
    },
    open: b
  };
};
export {
  D as default
};
