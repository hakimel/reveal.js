var di = Object.defineProperty;
var ci = (c, e, i) => e in c ? di(c, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : c[e] = i;
var Rt = (c, e, i) => ci(c, typeof e != "symbol" ? e + "" : e, i);
const ue = (c, e) => {
  for (let i in e)
    c[i] = e[i];
  return c;
}, E = (c, e) => Array.from(c.querySelectorAll(e)), Oe = (c, e, i) => {
  i ? c.classList.add(e) : c.classList.remove(e);
}, he = (c) => {
  if (typeof c == "string") {
    if (c === "null") return null;
    if (c === "true") return !0;
    if (c === "false") return !1;
    if (c.match(/^-?[\d\.]+$/)) return parseFloat(c);
  }
  return c;
}, se = (c, e) => {
  c.style.transform = e;
}, Pe = (c, e) => {
  let i = c.matches || c.matchesSelector || c.msMatchesSelector;
  return !!(i && i.call(c, e));
}, V = (c, e) => {
  if (typeof c.closest == "function")
    return c.closest(e);
  for (; c; ) {
    if (Pe(c, e))
      return c;
    c = c.parentNode;
  }
  return null;
}, xt = (c) => {
  c = c || document.documentElement;
  let e = c.requestFullscreen || c.webkitRequestFullscreen || c.webkitRequestFullScreen || c.mozRequestFullScreen || c.msRequestFullscreen;
  e && e.apply(c);
}, hi = (c, e, i, t = "") => {
  let s = c.querySelectorAll("." + i);
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.parentNode === c)
      return o;
  }
  let n = document.createElement(e);
  return n.className = i, n.innerHTML = t, c.appendChild(n), n;
}, Ue = (c) => {
  let e = document.createElement("style");
  return e.type = "text/css", c && c.length > 0 && (e.styleSheet ? e.styleSheet.cssText = c : e.appendChild(document.createTextNode(c))), document.head.appendChild(e), e;
}, At = () => {
  let c = {};
  location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (e) => {
    c[e.split("=").shift()] = e.split("=").pop();
  });
  for (let e in c) {
    let i = c[e];
    c[e] = he(unescape(i));
  }
  return typeof c.dependencies < "u" && delete c.dependencies, c;
}, ui = (c, e = 0) => {
  if (c) {
    let i, t = c.style.height;
    return c.style.height = "0px", c.parentNode.style.height = "auto", i = e - c.parentNode.offsetHeight, c.style.height = t + "px", c.parentNode.style.removeProperty("height"), i;
  }
  return e;
}, fi = {
  mp4: "video/mp4",
  m4a: "video/mp4",
  ogv: "video/ogg",
  mpeg: "video/mpeg",
  webm: "video/webm"
}, gi = (c = "") => fi[c.split(".").pop()], pi = (c = "") => encodeURI(c).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(
  /[!'()*]/g,
  (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
), Tt = navigator.userAgent, fe = /(iphone|ipod|ipad|android)/gi.test(Tt) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, It = /android/gi.test(Tt);
var vi = function(c) {
  if (c) {
    var e = function(f) {
      return [].slice.call(f);
    }, i = 0, t = 1, s = 2, n = 3, r = [], o = null, h = "requestAnimationFrame" in c ? function() {
      var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { sync: !1 };
      c.cancelAnimationFrame(o);
      var S = function() {
        return g(r.filter(function(x) {
          return x.dirty && x.active;
        }));
      };
      if (f.sync) return S();
      o = c.requestAnimationFrame(S);
    } : function() {
    }, u = function(f) {
      return function(S) {
        r.forEach(function(x) {
          return x.dirty = f;
        }), h(S);
      };
    }, g = function(f) {
      f.filter(function(x) {
        return !x.styleComputed;
      }).forEach(function(x) {
        x.styleComputed = l(x);
      }), f.filter(R).forEach(M);
      var S = f.filter(b);
      S.forEach(m), S.forEach(function(x) {
        M(x), p(x);
      }), S.forEach(O);
    }, p = function(f) {
      return f.dirty = i;
    }, m = function(f) {
      f.availableWidth = f.element.parentNode.clientWidth, f.currentWidth = f.element.scrollWidth, f.previousFontSize = f.currentFontSize, f.currentFontSize = Math.min(Math.max(f.minSize, f.availableWidth / f.currentWidth * f.previousFontSize), f.maxSize), f.whiteSpace = f.multiLine && f.currentFontSize === f.minSize ? "normal" : "nowrap";
    }, b = function(f) {
      return f.dirty !== s || f.dirty === s && f.element.parentNode.clientWidth !== f.availableWidth;
    }, l = function(f) {
      var S = c.getComputedStyle(f.element, null);
      return f.currentFontSize = parseFloat(S.getPropertyValue("font-size")), f.display = S.getPropertyValue("display"), f.whiteSpace = S.getPropertyValue("white-space"), !0;
    }, R = function(f) {
      var S = !1;
      return !f.preStyleTestCompleted && (/inline-/.test(f.display) || (S = !0, f.display = "inline-block"), f.whiteSpace !== "nowrap" && (S = !0, f.whiteSpace = "nowrap"), f.preStyleTestCompleted = !0, S);
    }, M = function(f) {
      f.element.style.whiteSpace = f.whiteSpace, f.element.style.display = f.display, f.element.style.fontSize = f.currentFontSize + "px";
    }, O = function(f) {
      f.element.dispatchEvent(new CustomEvent("fit", { detail: { oldValue: f.previousFontSize, newValue: f.currentFontSize, scaleFactor: f.currentFontSize / f.previousFontSize } }));
    }, q = function(f, S) {
      return function(x) {
        f.dirty = S, f.active && h(x);
      };
    }, ae = function(f) {
      return function() {
        r = r.filter(function(S) {
          return S.element !== f.element;
        }), f.observeMutations && f.observer.disconnect(), f.element.style.whiteSpace = f.originalStyle.whiteSpace, f.element.style.display = f.originalStyle.display, f.element.style.fontSize = f.originalStyle.fontSize;
      };
    }, z = function(f) {
      return function() {
        f.active || (f.active = !0, h());
      };
    }, k = function(f) {
      return function() {
        return f.active = !1;
      };
    }, B = function(f) {
      f.observeMutations && (f.observer = new MutationObserver(q(f, t)), f.observer.observe(f.element, f.observeMutations));
    }, U = { minSize: 16, maxSize: 512, multiLine: !0, observeMutations: "MutationObserver" in c && { subtree: !0, childList: !0, characterData: !0 } }, W = null, L = function() {
      c.clearTimeout(W), W = c.setTimeout(u(s), C.observeWindowDelay);
    }, A = ["resize", "orientationchange"];
    return Object.defineProperty(C, "observeWindow", { set: function(f) {
      var S = "".concat(f ? "add" : "remove", "EventListener");
      A.forEach(function(x) {
        c[S](x, L);
      });
    } }), C.observeWindow = !0, C.observeWindowDelay = 100, C.fitAll = u(n), C;
  }
  function F(f, S) {
    var x = Object.assign({}, U, S), X = f.map(function(j) {
      var ee = Object.assign({}, x, { element: j, active: !0 });
      return function(D) {
        D.originalStyle = { whiteSpace: D.element.style.whiteSpace, display: D.element.style.display, fontSize: D.element.style.fontSize }, B(D), D.newbie = !0, D.dirty = !0, r.push(D);
      }(ee), { element: j, fit: q(ee, n), unfreeze: z(ee), freeze: k(ee), unsubscribe: ae(ee) };
    });
    return h(), X;
  }
  function C(f) {
    var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return typeof f == "string" ? F(e(document.querySelectorAll(f)), S) : F([f], S)[0];
  }
}(typeof window > "u" ? null : window);
class mi {
  constructor(e) {
    this.Reveal = e, this.startEmbeddedIframe = this.startEmbeddedIframe.bind(this);
  }
  /**
   * Should the given element be preloaded?
   * Decides based on local element attributes and global config.
   *
   * @param {HTMLElement} element
   */
  shouldPreload(e) {
    if (this.Reveal.isScrollView())
      return !0;
    let i = this.Reveal.getConfig().preloadIframes;
    return typeof i != "boolean" && (i = e.hasAttribute("data-preload")), i;
  }
  /**
   * Called when the given slide is within the configured view
   * distance. Shows the slide element and loads any content
   * that is set to load lazily (data-src).
   *
   * @param {HTMLElement} slide Slide to show
   */
  load(e, i = {}) {
    e.style.display = this.Reveal.getConfig().display, E(e, "img[data-src], video[data-src], audio[data-src], iframe[data-src]").forEach((s) => {
      (s.tagName !== "IFRAME" || this.shouldPreload(s)) && (s.setAttribute("src", s.getAttribute("data-src")), s.setAttribute("data-lazy-loaded", ""), s.removeAttribute("data-src"));
    }), E(e, "video, audio").forEach((s) => {
      let n = 0;
      E(s, "source[data-src]").forEach((r) => {
        r.setAttribute("src", r.getAttribute("data-src")), r.removeAttribute("data-src"), r.setAttribute("data-lazy-loaded", ""), n += 1;
      }), fe && s.tagName === "VIDEO" && s.setAttribute("playsinline", ""), n > 0 && s.load();
    });
    let t = e.slideBackgroundElement;
    if (t) {
      t.style.display = "block";
      let s = e.slideBackgroundContentElement, n = e.getAttribute("data-background-iframe");
      if (t.hasAttribute("data-loaded") === !1) {
        t.setAttribute("data-loaded", "true");
        let o = e.getAttribute("data-background-image"), h = e.getAttribute("data-background-video"), u = e.hasAttribute("data-background-video-loop"), g = e.hasAttribute("data-background-video-muted");
        if (o)
          /^data:/.test(o.trim()) ? s.style.backgroundImage = `url(${o.trim()})` : s.style.backgroundImage = o.split(",").map((p) => {
            let m = decodeURI(p.trim());
            return `url(${pi(m)})`;
          }).join(",");
        else if (h) {
          let p = document.createElement("video");
          u && p.setAttribute("loop", ""), (g || this.Reveal.isSpeakerNotes()) && (p.muted = !0), fe && (p.muted = !0, p.setAttribute("playsinline", "")), h.split(",").forEach((m) => {
            const b = document.createElement("source");
            b.setAttribute("src", m);
            let l = gi(m);
            l && b.setAttribute("type", l), p.appendChild(b);
          }), s.appendChild(p);
        } else if (n && i.excludeIframes !== !0) {
          let p = document.createElement("iframe");
          p.setAttribute("allowfullscreen", ""), p.setAttribute("mozallowfullscreen", ""), p.setAttribute("webkitallowfullscreen", ""), p.setAttribute("allow", "autoplay"), p.setAttribute("data-src", n), p.style.width = "100%", p.style.height = "100%", p.style.maxHeight = "100%", p.style.maxWidth = "100%", s.appendChild(p);
        }
      }
      let r = s.querySelector("iframe[data-src]");
      r && this.shouldPreload(t) && !/autoplay=(1|true|yes)/gi.test(n) && r.getAttribute("src") !== n && r.setAttribute("src", n);
    }
    this.layout(e);
  }
  /**
   * Applies JS-dependent layout helpers for the scope.
   */
  layout(e) {
    Array.from(e.querySelectorAll(".r-fit-text")).forEach((i) => {
      vi(i, {
        minSize: 24,
        maxSize: this.Reveal.getConfig().height * 0.8,
        observeMutations: !1,
        observeWindow: !1
      });
    });
  }
  /**
   * Unloads and hides the given slide. This is called when the
   * slide is moved outside of the configured view distance.
   *
   * @param {HTMLElement} slide
   */
  unload(e) {
    e.style.display = "none";
    let i = this.Reveal.getSlideBackground(e);
    i && (i.style.display = "none", E(i, "iframe[src]").forEach((t) => {
      t.removeAttribute("src");
    })), E(e, "video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]").forEach((t) => {
      t.setAttribute("data-src", t.getAttribute("src")), t.removeAttribute("src");
    }), E(e, "video[data-lazy-loaded] source[src], audio source[src]").forEach((t) => {
      t.setAttribute("data-src", t.getAttribute("src")), t.removeAttribute("src");
    });
  }
  /**
   * Enforces origin-specific format rules for embedded media.
   */
  formatEmbeddedContent() {
    let e = (i, t, s) => {
      E(this.Reveal.getSlidesElement(), "iframe[" + i + '*="' + t + '"]').forEach((n) => {
        let r = n.getAttribute(i);
        r && r.indexOf(s) === -1 && n.setAttribute(i, r + (/\?/.test(r) ? "&" : "?") + s);
      });
    };
    e("src", "youtube.com/embed/", "enablejsapi=1"), e("data-src", "youtube.com/embed/", "enablejsapi=1"), e("src", "player.vimeo.com/", "api=1"), e("data-src", "player.vimeo.com/", "api=1");
  }
  /**
   * Start playback of any embedded content inside of
   * the given element.
   *
   * @param {HTMLElement} element
   */
  startEmbeddedContent(e) {
    if (e) {
      const i = this.Reveal.isSpeakerNotes();
      E(e, 'img[src$=".gif"]').forEach((t) => {
        t.setAttribute("src", t.getAttribute("src"));
      }), E(e, "video, audio").forEach((t) => {
        if (V(t, ".fragment") && !V(t, ".fragment.visible"))
          return;
        let s = this.Reveal.getConfig().autoPlayMedia;
        if (typeof s != "boolean" && (s = t.hasAttribute("data-autoplay") || !!V(t, ".slide-background")), s && typeof t.play == "function") {
          if (i && !t.muted) return;
          if (t.readyState > 1)
            this.startEmbeddedMedia({ target: t });
          else if (fe) {
            let n = t.play();
            n && typeof n.catch == "function" && t.controls === !1 && n.catch(() => {
              t.controls = !0, t.addEventListener("play", () => {
                t.controls = !1;
              });
            });
          } else
            t.removeEventListener("loadeddata", this.startEmbeddedMedia), t.addEventListener("loadeddata", this.startEmbeddedMedia);
        }
      }), i || (E(e, "iframe[src]").forEach((t) => {
        V(t, ".fragment") && !V(t, ".fragment.visible") || this.startEmbeddedIframe({ target: t });
      }), E(e, "iframe[data-src]").forEach((t) => {
        V(t, ".fragment") && !V(t, ".fragment.visible") || t.getAttribute("src") !== t.getAttribute("data-src") && (t.removeEventListener("load", this.startEmbeddedIframe), t.addEventListener("load", this.startEmbeddedIframe), t.setAttribute("src", t.getAttribute("data-src")));
      }));
    }
  }
  /**
   * Starts playing an embedded video/audio element after
   * it has finished loading.
   *
   * @param {object} event
   */
  startEmbeddedMedia(e) {
    let i = !!V(e.target, "html"), t = !!V(e.target, ".present");
    i && t && (e.target.paused || e.target.ended) && (e.target.currentTime = 0, e.target.play()), e.target.removeEventListener("loadeddata", this.startEmbeddedMedia);
  }
  /**
   * "Starts" the content of an embedded iframe using the
   * postMessage API.
   *
   * @param {object} event
   */
  startEmbeddedIframe(e) {
    let i = e.target;
    if (i && i.contentWindow) {
      let t = !!V(e.target, "html"), s = !!V(e.target, ".present");
      if (t && s) {
        let n = this.Reveal.getConfig().autoPlayMedia;
        typeof n != "boolean" && (n = i.hasAttribute("data-autoplay") || !!V(i, ".slide-background")), /youtube\.com\/embed\//.test(i.getAttribute("src")) && n ? i.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*") : /player\.vimeo\.com\//.test(i.getAttribute("src")) && n ? i.contentWindow.postMessage('{"method":"play"}', "*") : i.contentWindow.postMessage("slide:start", "*");
      }
    }
  }
  /**
   * Stop playback of any embedded content inside of
   * the targeted slide.
   *
   * @param {HTMLElement} element
   */
  stopEmbeddedContent(e, i = {}) {
    i = ue({
      // Defaults
      unloadIframes: !0
    }, i), e && e.parentNode && (E(e, "video, audio").forEach((t) => {
      !t.hasAttribute("data-ignore") && typeof t.pause == "function" && (t.setAttribute("data-paused-by-reveal", ""), t.pause());
    }), E(e, "iframe").forEach((t) => {
      t.contentWindow && t.contentWindow.postMessage("slide:stop", "*"), t.removeEventListener("load", this.startEmbeddedIframe);
    }), E(e, 'iframe[src*="youtube.com/embed/"]').forEach((t) => {
      !t.hasAttribute("data-ignore") && t.contentWindow && typeof t.contentWindow.postMessage == "function" && t.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
    }), E(e, 'iframe[src*="player.vimeo.com/"]').forEach((t) => {
      !t.hasAttribute("data-ignore") && t.contentWindow && typeof t.contentWindow.postMessage == "function" && t.contentWindow.postMessage('{"method":"pause"}', "*");
    }), i.unloadIframes === !0 && E(e, "iframe[data-src]").forEach((t) => {
      t.setAttribute("src", "about:blank"), t.removeAttribute("src");
    }));
  }
}
const oe = ".slides section", ie = ".slides>section", kt = ".slides>section.present>section", yi = ".backgrounds>.slide-background", bi = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/, wi = "h.v", Ei = "h/v", We = "c", Mt = "c/t";
class Si {
  constructor(e) {
    this.Reveal = e;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "slide-number", this.Reveal.getRevealElement().appendChild(this.element);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    let t = "none";
    e.slideNumber && !this.Reveal.isPrintView() && (e.showSlideNumber === "all" || e.showSlideNumber === "speaker" && this.Reveal.isSpeakerNotes()) && (t = "block"), this.element.style.display = t;
  }
  /**
   * Updates the slide number to match the current slide.
   */
  update() {
    this.Reveal.getConfig().slideNumber && this.element && (this.element.innerHTML = this.getSlideNumber());
  }
  /**
   * Returns the HTML string corresponding to the current slide
   * number, including formatting.
   */
  getSlideNumber(e = this.Reveal.getCurrentSlide()) {
    let i = this.Reveal.getConfig(), t, s = wi;
    if (typeof i.slideNumber == "function")
      t = i.slideNumber(e);
    else {
      typeof i.slideNumber == "string" && (s = i.slideNumber), !/c/.test(s) && this.Reveal.getHorizontalSlides().length === 1 && (s = We);
      let r = e && e.dataset.visibility === "uncounted" ? 0 : 1;
      switch (t = [], s) {
        case We:
          t.push(this.Reveal.getSlidePastCount(e) + r);
          break;
        case Mt:
          t.push(this.Reveal.getSlidePastCount(e) + r, "/", this.Reveal.getTotalSlides());
          break;
        default:
          let o = this.Reveal.getIndices(e);
          t.push(o.h + r);
          let h = s === Ei ? "/" : ".";
          this.Reveal.isVerticalSlide(e) && t.push(h, o.v + 1);
      }
    }
    let n = "#" + this.Reveal.location.getHash(e);
    return this.formatNumber(t[0], t[1], t[2], n);
  }
  /**
   * Applies HTML formatting to a slide number before it's
   * written to the DOM.
   *
   * @param {number} a Current slide
   * @param {string} delimiter Character to separate slide numbers
   * @param {(number|*)} b Total slides
   * @param {HTMLElement} [url='#'+locationHash()] The url to link to
   * @return {string} HTML string fragment
   */
  formatNumber(e, i, t, s = "#" + this.Reveal.location.getHash()) {
    return typeof t == "number" && !isNaN(t) ? `<a href="${s}">
					<span class="slide-number-a">${e}</span>
					<span class="slide-number-delimiter">${i}</span>
					<span class="slide-number-b">${t}</span>
					</a>` : `<a href="${s}">
					<span class="slide-number-a">${e}</span>
					</a>`;
  }
  destroy() {
    this.element.remove();
  }
}
class Ri {
  constructor(e) {
    this.Reveal = e, this.onInput = this.onInput.bind(this), this.onBlur = this.onBlur.bind(this), this.onKeyDown = this.onKeyDown.bind(this);
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "jump-to-slide", this.jumpInput = document.createElement("input"), this.jumpInput.type = "text", this.jumpInput.className = "jump-to-slide-input", this.jumpInput.placeholder = "Jump to slide", this.jumpInput.addEventListener("input", this.onInput), this.jumpInput.addEventListener("keydown", this.onKeyDown), this.jumpInput.addEventListener("blur", this.onBlur), this.element.appendChild(this.jumpInput);
  }
  show() {
    this.indicesOnShow = this.Reveal.getIndices(), this.Reveal.getRevealElement().appendChild(this.element), this.jumpInput.focus();
  }
  hide() {
    this.isVisible() && (this.element.remove(), this.jumpInput.value = "", clearTimeout(this.jumpTimeout), delete this.jumpTimeout);
  }
  isVisible() {
    return !!this.element.parentNode;
  }
  /**
   * Parses the current input and jumps to the given slide.
   */
  jump() {
    clearTimeout(this.jumpTimeout), delete this.jumpTimeout;
    let e = this.jumpInput.value.trim(""), i;
    if (/^\d+$/.test(e)) {
      const t = this.Reveal.getConfig().slideNumber;
      if (t === We || t === Mt) {
        const s = this.Reveal.getSlides()[parseInt(e, 10) - 1];
        s && (i = this.Reveal.getIndices(s));
      }
    }
    return i || (/^\d+\.\d+$/.test(e) && (e = e.replace(".", "/")), i = this.Reveal.location.getIndicesFromHash(e, { oneBasedIndex: !0 })), !i && /\S+/i.test(e) && e.length > 1 && (i = this.search(e)), i && e !== "" ? (this.Reveal.slide(i.h, i.v, i.f), !0) : (this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), !1);
  }
  jumpAfter(e) {
    clearTimeout(this.jumpTimeout), this.jumpTimeout = setTimeout(() => this.jump(), e);
  }
  /**
   * A lofi search that looks for the given query in all
   * of our slides and returns the first match.
   */
  search(e) {
    const i = new RegExp("\\b" + e.trim() + "\\b", "i"), t = this.Reveal.getSlides().find((s) => i.test(s.innerText));
    return t ? this.Reveal.getIndices(t) : null;
  }
  /**
   * Reverts back to the slide we were on when jump to slide was
   * invoked.
   */
  cancel() {
    this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), this.hide();
  }
  confirm() {
    this.jump(), this.hide();
  }
  destroy() {
    this.jumpInput.removeEventListener("input", this.onInput), this.jumpInput.removeEventListener("keydown", this.onKeyDown), this.jumpInput.removeEventListener("blur", this.onBlur), this.element.remove();
  }
  onKeyDown(e) {
    e.keyCode === 13 ? this.confirm() : e.keyCode === 27 && (this.cancel(), e.stopImmediatePropagation());
  }
  onInput(e) {
    this.jumpAfter(200);
  }
  onBlur() {
    setTimeout(() => this.hide(), 1);
  }
}
const je = (c) => {
  let e = c.match(/^#([0-9a-f]{3})$/i);
  if (e && e[1])
    return e = e[1], {
      r: parseInt(e.charAt(0), 16) * 17,
      g: parseInt(e.charAt(1), 16) * 17,
      b: parseInt(e.charAt(2), 16) * 17
    };
  let i = c.match(/^#([0-9a-f]{6})$/i);
  if (i && i[1])
    return i = i[1], {
      r: parseInt(i.slice(0, 2), 16),
      g: parseInt(i.slice(2, 4), 16),
      b: parseInt(i.slice(4, 6), 16)
    };
  let t = c.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (t)
    return {
      r: parseInt(t[1], 10),
      g: parseInt(t[2], 10),
      b: parseInt(t[3], 10)
    };
  let s = c.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
  return s ? {
    r: parseInt(s[1], 10),
    g: parseInt(s[2], 10),
    b: parseInt(s[3], 10),
    a: parseFloat(s[4])
  } : null;
}, Ai = (c) => (typeof c == "string" && (c = je(c)), c ? (c.r * 299 + c.g * 587 + c.b * 114) / 1e3 : null);
class ki {
  constructor(e) {
    this.Reveal = e;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "backgrounds", this.Reveal.getRevealElement().appendChild(this.element);
  }
  /**
   * Creates the slide background elements and appends them
   * to the background container. One element is created per
   * slide no matter if the given slide has visible background.
   */
  create() {
    this.element.innerHTML = "", this.element.classList.add("no-transition"), this.Reveal.getHorizontalSlides().forEach((e) => {
      let i = this.createBackground(e, this.element);
      E(e, "section").forEach((t) => {
        this.createBackground(t, i), i.classList.add("stack");
      });
    }), this.Reveal.getConfig().parallaxBackgroundImage ? (this.element.style.backgroundImage = 'url("' + this.Reveal.getConfig().parallaxBackgroundImage + '")', this.element.style.backgroundSize = this.Reveal.getConfig().parallaxBackgroundSize, this.element.style.backgroundRepeat = this.Reveal.getConfig().parallaxBackgroundRepeat, this.element.style.backgroundPosition = this.Reveal.getConfig().parallaxBackgroundPosition, setTimeout(() => {
      this.Reveal.getRevealElement().classList.add("has-parallax-background");
    }, 1)) : (this.element.style.backgroundImage = "", this.Reveal.getRevealElement().classList.remove("has-parallax-background"));
  }
  /**
   * Creates a background for the given slide.
   *
   * @param {HTMLElement} slide
   * @param {HTMLElement} container The element that the background
   * should be appended to
   * @return {HTMLElement} New background div
   */
  createBackground(e, i) {
    let t = document.createElement("div");
    t.className = "slide-background " + e.className.replace(/present|past|future/, "");
    let s = document.createElement("div");
    return s.className = "slide-background-content", t.appendChild(s), i.appendChild(t), e.slideBackgroundElement = t, e.slideBackgroundContentElement = s, this.sync(e), t;
  }
  /**
   * Renders all of the visual properties of a slide background
   * based on the various background attributes.
   *
   * @param {HTMLElement} slide
   */
  sync(e) {
    const i = e.slideBackgroundElement, t = e.slideBackgroundContentElement, s = {
      background: e.getAttribute("data-background"),
      backgroundSize: e.getAttribute("data-background-size"),
      backgroundImage: e.getAttribute("data-background-image"),
      backgroundVideo: e.getAttribute("data-background-video"),
      backgroundIframe: e.getAttribute("data-background-iframe"),
      backgroundColor: e.getAttribute("data-background-color"),
      backgroundGradient: e.getAttribute("data-background-gradient"),
      backgroundRepeat: e.getAttribute("data-background-repeat"),
      backgroundPosition: e.getAttribute("data-background-position"),
      backgroundTransition: e.getAttribute("data-background-transition"),
      backgroundOpacity: e.getAttribute("data-background-opacity")
    }, n = e.hasAttribute("data-preload");
    e.classList.remove("has-dark-background"), e.classList.remove("has-light-background"), i.removeAttribute("data-loaded"), i.removeAttribute("data-background-hash"), i.removeAttribute("data-background-size"), i.removeAttribute("data-background-transition"), i.style.backgroundColor = "", t.style.backgroundSize = "", t.style.backgroundRepeat = "", t.style.backgroundPosition = "", t.style.backgroundImage = "", t.style.opacity = "", t.innerHTML = "", s.background && (/^(http|file|\/\/)/gi.test(s.background) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(s.background) ? e.setAttribute("data-background-image", s.background) : i.style.background = s.background), (s.background || s.backgroundColor || s.backgroundGradient || s.backgroundImage || s.backgroundVideo || s.backgroundIframe) && i.setAttribute("data-background-hash", s.background + s.backgroundSize + s.backgroundImage + s.backgroundVideo + s.backgroundIframe + s.backgroundColor + s.backgroundGradient + s.backgroundRepeat + s.backgroundPosition + s.backgroundTransition + s.backgroundOpacity), s.backgroundSize && i.setAttribute("data-background-size", s.backgroundSize), s.backgroundColor && (i.style.backgroundColor = s.backgroundColor), s.backgroundGradient && (i.style.backgroundImage = s.backgroundGradient), s.backgroundTransition && i.setAttribute("data-background-transition", s.backgroundTransition), n && i.setAttribute("data-preload", ""), s.backgroundSize && (t.style.backgroundSize = s.backgroundSize), s.backgroundRepeat && (t.style.backgroundRepeat = s.backgroundRepeat), s.backgroundPosition && (t.style.backgroundPosition = s.backgroundPosition), s.backgroundOpacity && (t.style.opacity = s.backgroundOpacity);
    const r = this.getContrastClass(e);
    typeof r == "string" && e.classList.add(r);
  }
  /**
   * Returns a class name that can be applied to a slide to indicate
   * if it has a light or dark background.
   *
   * @param {*} slide
   *
   * @returns {string|null}
   */
  getContrastClass(e) {
    const i = e.slideBackgroundElement;
    let t = e.getAttribute("data-background-color");
    if (!t || !je(t)) {
      let s = window.getComputedStyle(i);
      s && s.backgroundColor && (t = s.backgroundColor);
    }
    if (t) {
      const s = je(t);
      if (s && s.a !== 0)
        return Ai(t) < 128 ? "has-dark-background" : "has-light-background";
    }
    return null;
  }
  /**
   * Bubble the 'has-light-background'/'has-dark-background' classes.
   */
  bubbleSlideContrastClassToElement(e, i) {
    ["has-light-background", "has-dark-background"].forEach((t) => {
      e.classList.contains(t) ? i.classList.add(t) : i.classList.remove(t);
    }, this);
  }
  /**
   * Updates the background elements to reflect the current
   * slide.
   *
   * @param {boolean} includeAll If true, the backgrounds of
   * all vertical slides (not just the present) will be updated.
   */
  update(e = !1) {
    let i = this.Reveal.getConfig(), t = this.Reveal.getCurrentSlide(), s = this.Reveal.getIndices(), n = null, r = i.rtl ? "future" : "past", o = i.rtl ? "past" : "future";
    if (Array.from(this.element.childNodes).forEach((u, g) => {
      u.classList.remove("past", "present", "future"), g < s.h ? u.classList.add(r) : g > s.h ? u.classList.add(o) : (u.classList.add("present"), n = u), (e || g === s.h) && E(u, ".slide-background").forEach((p, m) => {
        p.classList.remove("past", "present", "future");
        const b = typeof s.v == "number" ? s.v : 0;
        m < b ? p.classList.add("past") : m > b ? p.classList.add("future") : (p.classList.add("present"), g === s.h && (n = p));
      });
    }), this.previousBackground && !this.previousBackground.closest("body") && (this.previousBackground = null), n && this.previousBackground) {
      let u = this.previousBackground.getAttribute("data-background-hash"), g = n.getAttribute("data-background-hash");
      if (g && g === u && n !== this.previousBackground) {
        this.element.classList.add("no-transition");
        const p = n.querySelector("video"), m = this.previousBackground.querySelector("video");
        if (p && m) {
          const b = p.parentNode;
          m.parentNode.appendChild(p), b.appendChild(m);
        }
      }
    }
    const h = n !== this.previousBackground;
    if (h && this.previousBackground && this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload(this.previousBackground) }), h && n) {
      this.Reveal.slideContent.startEmbeddedContent(n);
      let u = n.querySelector(".slide-background-content");
      if (u) {
        let g = u.style.backgroundImage || "";
        /\.gif/i.test(g) && (u.style.backgroundImage = "", window.getComputedStyle(u).opacity, u.style.backgroundImage = g);
      }
      this.previousBackground = n;
    }
    t && this.bubbleSlideContrastClassToElement(t, this.Reveal.getRevealElement()), setTimeout(() => {
      this.element.classList.remove("no-transition");
    }, 10);
  }
  /**
   * Updates the position of the parallax background based
   * on the current slide index.
   */
  updateParallax() {
    let e = this.Reveal.getIndices();
    if (this.Reveal.getConfig().parallaxBackgroundImage) {
      let i = this.Reveal.getHorizontalSlides(), t = this.Reveal.getVerticalSlides(), s = this.element.style.backgroundSize.split(" "), n, r;
      s.length === 1 ? n = r = parseInt(s[0], 10) : (n = parseInt(s[0], 10), r = parseInt(s[1], 10));
      let o = this.element.offsetWidth, h = i.length, u, g;
      typeof this.Reveal.getConfig().parallaxBackgroundHorizontal == "number" ? u = this.Reveal.getConfig().parallaxBackgroundHorizontal : u = h > 1 ? (n - o) / (h - 1) : 0, g = u * e.h * -1;
      let p = this.element.offsetHeight, m = t.length, b, l;
      typeof this.Reveal.getConfig().parallaxBackgroundVertical == "number" ? b = this.Reveal.getConfig().parallaxBackgroundVertical : b = (r - p) / (m - 1), l = m > 0 ? b * e.v : 0, this.element.style.backgroundPosition = g + "px " + -l + "px";
    }
  }
  destroy() {
    this.element.remove();
  }
}
let Ct = 0;
class Ci {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Runs an auto-animation between the given slides.
   *
   * @param  {HTMLElement} fromSlide
   * @param  {HTMLElement} toSlide
   */
  run(e, i) {
    this.reset();
    let t = this.Reveal.getSlides(), s = t.indexOf(i), n = t.indexOf(e);
    if (e && i && e.hasAttribute("data-auto-animate") && i.hasAttribute("data-auto-animate") && e.getAttribute("data-auto-animate-id") === i.getAttribute("data-auto-animate-id") && !(s > n ? i : e).hasAttribute("data-auto-animate-restart")) {
      this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || Ue();
      let r = this.getAutoAnimateOptions(i);
      e.dataset.autoAnimate = "pending", i.dataset.autoAnimate = "pending", r.slideDirection = s > n ? "forward" : "backward";
      let o = e.style.display === "none";
      o && (e.style.display = this.Reveal.getConfig().display);
      let h = this.getAutoAnimatableElements(e, i).map((u) => this.autoAnimateElements(u.from, u.to, u.options || {}, r, Ct++));
      if (o && (e.style.display = "none"), i.dataset.autoAnimateUnmatched !== "false" && this.Reveal.getConfig().autoAnimateUnmatched === !0) {
        let u = r.duration * 0.8, g = r.duration * 0.2;
        this.getUnmatchedAutoAnimateElements(i).forEach((p) => {
          let m = this.getAutoAnimateOptions(p, r), b = "unmatched";
          (m.duration !== r.duration || m.delay !== r.delay) && (b = "unmatched-" + Ct++, h.push(`[data-auto-animate="running"] [data-auto-animate-target="${b}"] { transition: opacity ${m.duration}s ease ${m.delay}s; }`)), p.dataset.autoAnimateTarget = b;
        }, this), h.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${u}s ease ${g}s; }`);
      }
      this.autoAnimateStyleSheet.innerHTML = h.join(""), requestAnimationFrame(() => {
        this.autoAnimateStyleSheet && (getComputedStyle(this.autoAnimateStyleSheet).fontWeight, i.dataset.autoAnimate = "running");
      }), this.Reveal.dispatchEvent({
        type: "autoanimate",
        data: {
          fromSlide: e,
          toSlide: i,
          sheet: this.autoAnimateStyleSheet
        }
      });
    }
  }
  /**
   * Rolls back all changes that we've made to the DOM so
   * that as part of animating.
   */
  reset() {
    E(this.Reveal.getRevealElement(), '[data-auto-animate]:not([data-auto-animate=""])').forEach((e) => {
      e.dataset.autoAnimate = "";
    }), E(this.Reveal.getRevealElement(), "[data-auto-animate-target]").forEach((e) => {
      delete e.dataset.autoAnimateTarget;
    }), this.autoAnimateStyleSheet && this.autoAnimateStyleSheet.parentNode && (this.autoAnimateStyleSheet.parentNode.removeChild(this.autoAnimateStyleSheet), this.autoAnimateStyleSheet = null);
  }
  /**
   * Creates a FLIP animation where the `to` element starts out
   * in the `from` element position and animates to its original
   * state.
   *
   * @param {HTMLElement} from
   * @param {HTMLElement} to
   * @param {Object} elementOptions Options for this element pair
   * @param {Object} animationOptions Options set at the slide level
   * @param {String} id Unique ID that we can use to identify this
   * auto-animate element in the DOM
   */
  autoAnimateElements(e, i, t, s, n) {
    e.dataset.autoAnimateTarget = "", i.dataset.autoAnimateTarget = n;
    let r = this.getAutoAnimateOptions(i, s);
    typeof t.delay < "u" && (r.delay = t.delay), typeof t.duration < "u" && (r.duration = t.duration), typeof t.easing < "u" && (r.easing = t.easing);
    let o = this.getAutoAnimatableProperties("from", e, t), h = this.getAutoAnimatableProperties("to", i, t);
    if (i.classList.contains("fragment") && delete h.styles.opacity, t.translate !== !1 || t.scale !== !1) {
      let p = this.Reveal.getScale(), m = {
        x: (o.x - h.x) / p,
        y: (o.y - h.y) / p,
        scaleX: o.width / h.width,
        scaleY: o.height / h.height
      };
      m.x = Math.round(m.x * 1e3) / 1e3, m.y = Math.round(m.y * 1e3) / 1e3, m.scaleX = Math.round(m.scaleX * 1e3) / 1e3, m.scaleX = Math.round(m.scaleX * 1e3) / 1e3;
      let b = t.translate !== !1 && (m.x !== 0 || m.y !== 0), l = t.scale !== !1 && (m.scaleX !== 0 || m.scaleY !== 0);
      if (b || l) {
        let R = [];
        b && R.push(`translate(${m.x}px, ${m.y}px)`), l && R.push(`scale(${m.scaleX}, ${m.scaleY})`), o.styles.transform = R.join(" "), o.styles["transform-origin"] = "top left", h.styles.transform = "none";
      }
    }
    for (let p in h.styles) {
      const m = h.styles[p], b = o.styles[p];
      m === b ? delete h.styles[p] : (m.explicitValue === !0 && (h.styles[p] = m.value), b.explicitValue === !0 && (o.styles[p] = b.value));
    }
    let u = "", g = Object.keys(h.styles);
    if (g.length > 0) {
      o.styles.transition = "none", h.styles.transition = `all ${r.duration}s ${r.easing} ${r.delay}s`, h.styles["transition-property"] = g.join(", "), h.styles["will-change"] = g.join(", ");
      let p = Object.keys(o.styles).map((b) => b + ": " + o.styles[b] + " !important;").join(""), m = Object.keys(h.styles).map((b) => b + ": " + h.styles[b] + " !important;").join("");
      u = '[data-auto-animate-target="' + n + '"] {' + p + '}[data-auto-animate="running"] [data-auto-animate-target="' + n + '"] {' + m + "}";
    }
    return u;
  }
  /**
   * Returns the auto-animate options for the given element.
   *
   * @param {HTMLElement} element Element to pick up options
   * from, either a slide or an animation target
   * @param {Object} [inheritedOptions] Optional set of existing
   * options
   */
  getAutoAnimateOptions(e, i) {
    let t = {
      easing: this.Reveal.getConfig().autoAnimateEasing,
      duration: this.Reveal.getConfig().autoAnimateDuration,
      delay: 0
    };
    if (t = ue(t, i), e.parentNode) {
      let s = V(e.parentNode, "[data-auto-animate-target]");
      s && (t = this.getAutoAnimateOptions(s, t));
    }
    return e.dataset.autoAnimateEasing && (t.easing = e.dataset.autoAnimateEasing), e.dataset.autoAnimateDuration && (t.duration = parseFloat(e.dataset.autoAnimateDuration)), e.dataset.autoAnimateDelay && (t.delay = parseFloat(e.dataset.autoAnimateDelay)), t;
  }
  /**
   * Returns an object containing all of the properties
   * that can be auto-animated for the given element and
   * their current computed values.
   *
   * @param {String} direction 'from' or 'to'
   */
  getAutoAnimatableProperties(e, i, t) {
    let s = this.Reveal.getConfig(), n = { styles: [] };
    if (t.translate !== !1 || t.scale !== !1) {
      let o;
      if (typeof t.measure == "function")
        o = t.measure(i);
      else if (s.center)
        o = i.getBoundingClientRect();
      else {
        let h = this.Reveal.getScale();
        o = {
          x: i.offsetLeft * h,
          y: i.offsetTop * h,
          width: i.offsetWidth * h,
          height: i.offsetHeight * h
        };
      }
      n.x = o.x, n.y = o.y, n.width = o.width, n.height = o.height;
    }
    const r = getComputedStyle(i);
    return (t.styles || s.autoAnimateStyles).forEach((o) => {
      let h;
      typeof o == "string" && (o = { property: o }), typeof o.from < "u" && e === "from" ? h = { value: o.from, explicitValue: !0 } : typeof o.to < "u" && e === "to" ? h = { value: o.to, explicitValue: !0 } : (o.property === "line-height" && (h = parseFloat(r["line-height"]) / parseFloat(r["font-size"])), isNaN(h) && (h = r[o.property])), h !== "" && (n.styles[o.property] = h);
    }), n;
  }
  /**
   * Get a list of all element pairs that we can animate
   * between the given slides.
   *
   * @param {HTMLElement} fromSlide
   * @param {HTMLElement} toSlide
   *
   * @return {Array} Each value is an array where [0] is
   * the element we're animating from and [1] is the
   * element we're animating to
   */
  getAutoAnimatableElements(e, i) {
    let s = (typeof this.Reveal.getConfig().autoAnimateMatcher == "function" ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs).call(this, e, i), n = [];
    return s.filter((r, o) => {
      if (n.indexOf(r.to) === -1)
        return n.push(r.to), !0;
    });
  }
  /**
   * Identifies matching elements between slides.
   *
   * You can specify a custom matcher function by using
   * the `autoAnimateMatcher` config option.
   */
  getAutoAnimatePairs(e, i) {
    let t = [];
    const s = "pre", n = "h1, h2, h3, h4, h5, h6, p, li", r = "img, video, iframe";
    return this.findAutoAnimateMatches(t, e, i, "[data-id]", (o) => o.nodeName + ":::" + o.getAttribute("data-id")), this.findAutoAnimateMatches(t, e, i, n, (o) => o.nodeName + ":::" + o.textContent.trim()), this.findAutoAnimateMatches(t, e, i, r, (o) => o.nodeName + ":::" + (o.getAttribute("src") || o.getAttribute("data-src"))), this.findAutoAnimateMatches(t, e, i, s, (o) => o.nodeName + ":::" + o.textContent.trim()), t.forEach((o) => {
      Pe(o.from, n) ? o.options = { scale: !1 } : Pe(o.from, s) && (o.options = { scale: !1, styles: ["width", "height"] }, this.findAutoAnimateMatches(t, o.from, o.to, ".hljs .hljs-ln-code", (h) => h.textContent, {
        scale: !1,
        styles: [],
        measure: this.getLocalBoundingBox.bind(this)
      }), this.findAutoAnimateMatches(t, o.from, o.to, ".hljs .hljs-ln-numbers[data-line-number]", (h) => h.getAttribute("data-line-number"), {
        scale: !1,
        styles: ["width"],
        measure: this.getLocalBoundingBox.bind(this)
      }));
    }, this), t;
  }
  /**
   * Helper method which returns a bounding box based on
   * the given elements offset coordinates.
   *
   * @param {HTMLElement} element
   * @return {Object} x, y, width, height
   */
  getLocalBoundingBox(e) {
    const i = this.Reveal.getScale();
    return {
      x: Math.round(e.offsetLeft * i * 100) / 100,
      y: Math.round(e.offsetTop * i * 100) / 100,
      width: Math.round(e.offsetWidth * i * 100) / 100,
      height: Math.round(e.offsetHeight * i * 100) / 100
    };
  }
  /**
   * Finds matching elements between two slides.
   *
   * @param {Array} pairs            	List of pairs to push matches to
   * @param {HTMLElement} fromScope   Scope within the from element exists
   * @param {HTMLElement} toScope     Scope within the to element exists
   * @param {String} selector         CSS selector of the element to match
   * @param {Function} serializer     A function that accepts an element and returns
   *                                  a stringified ID based on its contents
   * @param {Object} animationOptions Optional config options for this pair
   */
  findAutoAnimateMatches(e, i, t, s, n, r) {
    let o = {}, h = {};
    [].slice.call(i.querySelectorAll(s)).forEach((u, g) => {
      const p = n(u);
      typeof p == "string" && p.length && (o[p] = o[p] || [], o[p].push(u));
    }), [].slice.call(t.querySelectorAll(s)).forEach((u, g) => {
      const p = n(u);
      h[p] = h[p] || [], h[p].push(u);
      let m;
      if (o[p]) {
        const b = h[p].length - 1, l = o[p].length - 1;
        o[p][b] ? (m = o[p][b], o[p][b] = null) : o[p][l] && (m = o[p][l], o[p][l] = null);
      }
      m && e.push({
        from: m,
        to: u,
        options: r
      });
    });
  }
  /**
   * Returns a all elements within the given scope that should
   * be considered unmatched in an auto-animate transition. If
   * fading of unmatched elements is turned on, these elements
   * will fade when going between auto-animate slides.
   *
   * Note that parents of auto-animate targets are NOT considered
   * unmatched since fading them would break the auto-animation.
   *
   * @param {HTMLElement} rootElement
   * @return {Array}
   */
  getUnmatchedAutoAnimateElements(e) {
    return [].slice.call(e.children).reduce((i, t) => {
      const s = t.querySelector("[data-auto-animate-target]");
      return !t.hasAttribute("data-auto-animate-target") && !s && i.push(t), t.querySelector("[data-auto-animate-target]") && (i = i.concat(this.getUnmatchedAutoAnimateElements(t))), i;
    }, []);
  }
}
const Li = 500, Pi = 4, xi = 6, Ti = 8;
class Ii {
  constructor(e) {
    this.Reveal = e, this.active = !1, this.activatedCallbacks = [], this.onScroll = this.onScroll.bind(this);
  }
  /**
   * Activates the scroll view. This rearranges the presentation DOM
   * by—among other things—wrapping each slide in a page element.
   */
  activate() {
    if (this.active) return;
    const e = this.Reveal.getState();
    this.active = !0, this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;
    const i = E(this.Reveal.getRevealElement(), ie), t = E(this.Reveal.getRevealElement(), yi);
    this.viewportElement.classList.add("loading-scroll-mode", "reveal-scroll");
    let s;
    const n = window.getComputedStyle(this.viewportElement);
    n && n.background && (s = n.background);
    const r = [], o = i[0].parentNode;
    let h;
    const u = (g, p, m, b) => {
      let l;
      if (h && this.Reveal.shouldAutoAnimateBetween(h, g))
        l = document.createElement("div"), l.className = "scroll-page-content scroll-auto-animate-page", l.style.display = "none", h.closest(".scroll-page-content").parentNode.appendChild(l);
      else {
        const R = document.createElement("div");
        if (R.className = "scroll-page", r.push(R), b && t.length > p) {
          const O = t[p], q = window.getComputedStyle(O);
          q && q.background ? R.style.background = q.background : s && (R.style.background = s);
        } else s && (R.style.background = s);
        const M = document.createElement("div");
        M.className = "scroll-page-sticky", R.appendChild(M), l = document.createElement("div"), l.className = "scroll-page-content", M.appendChild(l);
      }
      l.appendChild(g), g.classList.remove("past", "future"), g.setAttribute("data-index-h", p), g.setAttribute("data-index-v", m), g.slideBackgroundElement && (g.slideBackgroundElement.remove("past", "future"), l.insertBefore(g.slideBackgroundElement, g)), h = g;
    };
    i.forEach((g, p) => {
      this.Reveal.isVerticalStack(g) ? g.querySelectorAll("section").forEach((m, b) => {
        u(m, p, b, !0);
      }) : u(g, p, 0);
    }, this), this.createProgressBar(), E(this.Reveal.getRevealElement(), ".stack").forEach((g) => g.remove()), r.forEach((g) => o.appendChild(g)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.layout(), this.Reveal.setState(e), this.activatedCallbacks.forEach((g) => g()), this.activatedCallbacks = [], this.restoreScrollPosition(), this.viewportElement.classList.remove("loading-scroll-mode"), this.viewportElement.addEventListener("scroll", this.onScroll, { passive: !0 });
  }
  /**
   * Deactivates the scroll view and restores the standard slide-based
   * presentation.
   */
  deactivate() {
    if (!this.active) return;
    const e = this.Reveal.getState();
    this.active = !1, this.viewportElement.removeEventListener("scroll", this.onScroll), this.viewportElement.classList.remove("reveal-scroll"), this.removeProgressBar(), this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation, this.Reveal.sync(), this.Reveal.setState(e), this.slideHTMLBeforeActivation = null;
  }
  toggle(e) {
    typeof e == "boolean" ? e ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
  }
  /**
   * Checks if the scroll view is currently active.
   */
  isActive() {
    return this.active;
  }
  /**
   * Renders the progress bar component.
   */
  createProgressBar() {
    this.progressBar = document.createElement("div"), this.progressBar.className = "scrollbar", this.progressBarInner = document.createElement("div"), this.progressBarInner.className = "scrollbar-inner", this.progressBar.appendChild(this.progressBarInner), this.progressBarPlayhead = document.createElement("div"), this.progressBarPlayhead.className = "scrollbar-playhead", this.progressBarInner.appendChild(this.progressBarPlayhead), this.viewportElement.insertBefore(this.progressBar, this.viewportElement.firstChild);
    const e = (s) => {
      let n = (s.clientY - this.progressBarInner.getBoundingClientRect().top) / this.progressBarHeight;
      n = Math.max(Math.min(n, 1), 0), this.viewportElement.scrollTop = n * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight);
    }, i = (s) => {
      this.draggingProgressBar = !1, this.showProgressBar(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", i);
    }, t = (s) => {
      s.preventDefault(), this.draggingProgressBar = !0, document.addEventListener("mousemove", e), document.addEventListener("mouseup", i), e(s);
    };
    this.progressBarInner.addEventListener("mousedown", t);
  }
  removeProgressBar() {
    this.progressBar && (this.progressBar.remove(), this.progressBar = null);
  }
  layout() {
    this.isActive() && (this.syncPages(), this.syncScrollPosition());
  }
  /**
   * Updates our pages to match the latest configuration and
   * presentation size.
   */
  syncPages() {
    const e = this.Reveal.getConfig(), i = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), t = this.Reveal.getScale(), s = e.scrollLayout === "compact", n = this.viewportElement.offsetHeight, r = i.height * t, o = s ? r : n;
    this.scrollTriggerHeight = s ? r : n, this.viewportElement.style.setProperty("--page-height", o + "px"), this.viewportElement.style.scrollSnapType = typeof e.scrollSnap == "string" ? `y ${e.scrollSnap}` : "", this.slideTriggers = [];
    const h = Array.from(this.Reveal.getRevealElement().querySelectorAll(".scroll-page"));
    this.pages = h.map((u) => {
      const g = this.createPage({
        pageElement: u,
        slideElement: u.querySelector("section"),
        stickyElement: u.querySelector(".scroll-page-sticky"),
        contentElement: u.querySelector(".scroll-page-content"),
        backgroundElement: u.querySelector(".slide-background"),
        autoAnimateElements: u.querySelectorAll(".scroll-auto-animate-page"),
        autoAnimatePages: []
      });
      g.pageElement.style.setProperty("--slide-height", e.center === !0 ? "auto" : i.height + "px"), this.slideTriggers.push({
        page: g,
        activate: () => this.activatePage(g),
        deactivate: () => this.deactivatePage(g)
      }), this.createFragmentTriggersForPage(g), g.autoAnimateElements.length > 0 && this.createAutoAnimateTriggersForPage(g);
      let p = Math.max(g.scrollTriggers.length - 1, 0);
      p += g.autoAnimatePages.reduce((m, b) => m + Math.max(b.scrollTriggers.length - 1, 0), g.autoAnimatePages.length), g.pageElement.querySelectorAll(".scroll-snap-point").forEach((m) => m.remove());
      for (let m = 0; m < p + 1; m++) {
        const b = document.createElement("div");
        b.className = "scroll-snap-point", b.style.height = this.scrollTriggerHeight + "px", b.style.scrollSnapAlign = s ? "center" : "start", g.pageElement.appendChild(b), m === 0 && (b.style.marginTop = -this.scrollTriggerHeight + "px");
      }
      return s && g.scrollTriggers.length > 0 ? (g.pageHeight = n, g.pageElement.style.setProperty("--page-height", n + "px")) : (g.pageHeight = o, g.pageElement.style.removeProperty("--page-height")), g.scrollPadding = this.scrollTriggerHeight * p, g.totalHeight = g.pageHeight + g.scrollPadding, g.pageElement.style.setProperty("--page-scroll-padding", g.scrollPadding + "px"), p > 0 ? (g.stickyElement.style.position = "sticky", g.stickyElement.style.top = Math.max((n - g.pageHeight) / 2, 0) + "px") : (g.stickyElement.style.position = "relative", g.pageElement.style.scrollSnapAlign = g.pageHeight < n ? "center" : "start"), g;
    }), this.setTriggerRanges(), this.viewportElement.setAttribute("data-scrollbar", e.scrollProgress), e.scrollProgress && this.totalScrollTriggerCount > 1 ? (this.progressBar || this.createProgressBar(), this.syncProgressBar()) : this.removeProgressBar();
  }
  /**
   * Calculates and sets the scroll range for all of our scroll
   * triggers.
   */
  setTriggerRanges() {
    this.totalScrollTriggerCount = this.slideTriggers.reduce((i, t) => i + Math.max(t.page.scrollTriggers.length, 1), 0);
    let e = 0;
    this.slideTriggers.forEach((i, t) => {
      i.range = [
        e,
        e + Math.max(i.page.scrollTriggers.length, 1) / this.totalScrollTriggerCount
      ];
      const s = (i.range[1] - i.range[0]) / i.page.scrollTriggers.length;
      i.page.scrollTriggers.forEach((n, r) => {
        n.range = [
          e + r * s,
          e + (r + 1) * s
        ];
      }), e = i.range[1];
    }), this.slideTriggers[this.slideTriggers.length - 1].range[1] = 1;
  }
  /**
   * Creates one scroll trigger for each fragments in the given page.
   *
   * @param {*} page
   */
  createFragmentTriggersForPage(e, i) {
    i = i || e.slideElement;
    const t = this.Reveal.fragments.sort(i.querySelectorAll(".fragment"), !0);
    return t.length && (e.fragments = this.Reveal.fragments.sort(i.querySelectorAll(".fragment:not(.disabled)")), e.scrollTriggers.push(
      // Trigger for the initial state with no fragments visible
      {
        activate: () => {
          this.Reveal.fragments.update(-1, e.fragments, i);
        }
      }
    ), t.forEach((s, n) => {
      e.scrollTriggers.push({
        activate: () => {
          this.Reveal.fragments.update(n, e.fragments, i);
        }
      });
    })), e.scrollTriggers.length;
  }
  /**
   * Creates scroll triggers for the auto-animate steps in the
   * given page.
   *
   * @param {*} page
   */
  createAutoAnimateTriggersForPage(e) {
    e.autoAnimateElements.length > 0 && this.slideTriggers.push(...Array.from(e.autoAnimateElements).map((i, t) => {
      let s = this.createPage({
        slideElement: i.querySelector("section"),
        contentElement: i,
        backgroundElement: i.querySelector(".slide-background")
      });
      return this.createFragmentTriggersForPage(s, s.slideElement), e.autoAnimatePages.push(s), {
        page: s,
        activate: () => this.activatePage(s),
        deactivate: () => this.deactivatePage(s)
      };
    }));
  }
  /**
   * Helper method for creating a page definition and adding
   * required fields. A "page" is a slide or auto-animate step.
   */
  createPage(e) {
    return e.scrollTriggers = [], e.indexh = parseInt(e.slideElement.getAttribute("data-index-h"), 10), e.indexv = parseInt(e.slideElement.getAttribute("data-index-v"), 10), e;
  }
  /**
   * Rerenders progress bar segments so that they match the current
   * reveal.js config and size.
   */
  syncProgressBar() {
    this.progressBarInner.querySelectorAll(".scrollbar-slide").forEach((r) => r.remove());
    const e = this.viewportElement.scrollHeight, i = this.viewportElement.offsetHeight, t = i / e;
    this.progressBarHeight = this.progressBarInner.offsetHeight, this.playheadHeight = Math.max(t * this.progressBarHeight, Ti), this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;
    const s = i / e * this.progressBarHeight, n = Math.min(s / 8, Pi);
    this.progressBarPlayhead.style.height = this.playheadHeight - n + "px", s > xi ? this.slideTriggers.forEach((r) => {
      const { page: o } = r;
      o.progressBarSlide = document.createElement("div"), o.progressBarSlide.className = "scrollbar-slide", o.progressBarSlide.style.top = r.range[0] * this.progressBarHeight + "px", o.progressBarSlide.style.height = (r.range[1] - r.range[0]) * this.progressBarHeight - n + "px", o.progressBarSlide.classList.toggle("has-triggers", o.scrollTriggers.length > 0), this.progressBarInner.appendChild(o.progressBarSlide), o.scrollTriggerElements = o.scrollTriggers.map((h, u) => {
        const g = document.createElement("div");
        return g.className = "scrollbar-trigger", g.style.top = (h.range[0] - r.range[0]) * this.progressBarHeight + "px", g.style.height = (h.range[1] - h.range[0]) * this.progressBarHeight - n + "px", o.progressBarSlide.appendChild(g), u === 0 && (g.style.display = "none"), g;
      });
    }) : this.pages.forEach((r) => r.progressBarSlide = null);
  }
  /**
   * Reads the current scroll position and updates our active
   * trigger states accordingly.
   */
  syncScrollPosition() {
    const e = this.viewportElement.offsetHeight, i = e / this.viewportElement.scrollHeight, t = this.viewportElement.scrollTop, s = this.viewportElement.scrollHeight - e, n = Math.max(Math.min(t / s, 1), 0), r = Math.max(Math.min((t + e / 2) / this.viewportElement.scrollHeight, 1), 0);
    let o;
    this.slideTriggers.forEach((h) => {
      const { page: u } = h;
      n >= h.range[0] - i * 2 && n <= h.range[1] + i * 2 && !u.loaded ? (u.loaded = !0, this.Reveal.slideContent.load(u.slideElement)) : u.loaded && (u.loaded = !1, this.Reveal.slideContent.unload(u.slideElement)), n >= h.range[0] && n <= h.range[1] ? (this.activateTrigger(h), o = h.page) : h.active && this.deactivateTrigger(h);
    }), o && o.scrollTriggers.forEach((h) => {
      r >= h.range[0] && r <= h.range[1] ? this.activateTrigger(h) : h.active && this.deactivateTrigger(h);
    }), this.setProgressBarValue(t / (this.viewportElement.scrollHeight - e));
  }
  /**
   * Moves the progress bar playhead to the specified position.
   *
   * @param {number} progress 0-1
   */
  setProgressBarValue(e) {
    this.progressBar && (this.progressBarPlayhead.style.transform = `translateY(${e * this.progressBarScrollableHeight}px)`, this.getAllPages().filter((i) => i.progressBarSlide).forEach((i) => {
      i.progressBarSlide.classList.toggle("active", i.active === !0), i.scrollTriggers.forEach((t, s) => {
        i.scrollTriggerElements[s].classList.toggle("active", i.active === !0 && t.active === !0);
      });
    }), this.showProgressBar());
  }
  /**
   * Show the progress bar and, if configured, automatically hide
   * it after a delay.
   */
  showProgressBar() {
    this.progressBar.classList.add("visible"), clearTimeout(this.hideProgressBarTimeout), this.Reveal.getConfig().scrollProgress === "auto" && !this.draggingProgressBar && (this.hideProgressBarTimeout = setTimeout(() => {
      this.progressBar && this.progressBar.classList.remove("visible");
    }, Li));
  }
  /**
   * Scroll to the previous page.
   */
  prev() {
    this.viewportElement.scrollTop -= this.scrollTriggerHeight;
  }
  /**
   * Scroll to the next page.
   */
  next() {
    this.viewportElement.scrollTop += this.scrollTriggerHeight;
  }
  /**
   * Scrolls the given slide element into view.
   *
   * @param {HTMLElement} slideElement
   */
  scrollToSlide(e) {
    if (!this.active)
      this.activatedCallbacks.push(() => this.scrollToSlide(e));
    else {
      const i = this.getScrollTriggerBySlide(e);
      i && (this.viewportElement.scrollTop = i.range[0] * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight));
    }
  }
  /**
   * Persists the current scroll position to session storage
   * so that it can be restored.
   */
  storeScrollPosition() {
    clearTimeout(this.storeScrollPositionTimeout), this.storeScrollPositionTimeout = setTimeout(() => {
      sessionStorage.setItem("reveal-scroll-top", this.viewportElement.scrollTop), sessionStorage.setItem("reveal-scroll-origin", location.origin + location.pathname), this.storeScrollPositionTimeout = null;
    }, 50);
  }
  /**
   * Restores the scroll position when a deck is reloader.
   */
  restoreScrollPosition() {
    const e = sessionStorage.getItem("reveal-scroll-top"), i = sessionStorage.getItem("reveal-scroll-origin");
    e && i === location.origin + location.pathname && (this.viewportElement.scrollTop = parseInt(e, 10));
  }
  /**
   * Activates the given page and starts its embedded content
   * if there is any.
   *
   * @param {object} page
   */
  activatePage(e) {
    if (!e.active) {
      e.active = !0;
      const { slideElement: i, backgroundElement: t, contentElement: s, indexh: n, indexv: r } = e;
      s.style.display = "block", i.classList.add("present"), t && t.classList.add("present"), this.Reveal.setCurrentScrollPage(i, n, r), this.Reveal.backgrounds.bubbleSlideContrastClassToElement(i, this.viewportElement), Array.from(s.parentNode.querySelectorAll(".scroll-page-content")).forEach((o) => {
        o !== s && (o.style.display = "none");
      });
    }
  }
  /**
   * Deactivates the page after it has been visible.
   *
   * @param {object} page
   */
  deactivatePage(e) {
    e.active && (e.active = !1, e.slideElement && e.slideElement.classList.remove("present"), e.backgroundElement && e.backgroundElement.classList.remove("present"));
  }
  activateTrigger(e) {
    e.active || (e.active = !0, e.activate());
  }
  deactivateTrigger(e) {
    e.active && (e.active = !1, e.deactivate && e.deactivate());
  }
  /**
   * Retrieve a slide by its original h/v index (i.e. the indices the
   * slide had before being linearized).
   *
   * @param {number} h
   * @param {number} v
   * @returns {HTMLElement}
   */
  getSlideByIndices(e, i) {
    const t = this.getAllPages().find((s) => s.indexh === e && s.indexv === i);
    return t ? t.slideElement : null;
  }
  /**
   * Retrieve a list of all scroll triggers for the given slide
   * DOM element.
   *
   * @param {HTMLElement} slide
   * @returns {Array}
   */
  getScrollTriggerBySlide(e) {
    return this.slideTriggers.find((i) => i.page.slideElement === e);
  }
  /**
   * Get a list of all pages in the scroll view. This includes
   * both top-level slides and auto-animate steps.
   *
   * @returns {Array}
   */
  getAllPages() {
    return this.pages.flatMap((e) => [e, ...e.autoAnimatePages || []]);
  }
  onScroll() {
    this.syncScrollPosition(), this.storeScrollPosition();
  }
  get viewportElement() {
    return this.Reveal.getViewportElement();
  }
}
class Mi {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Configures the presentation for printing to a static
   * PDF.
   */
  async activate() {
    const e = this.Reveal.getConfig(), i = E(this.Reveal.getRevealElement(), oe), t = e.slideNumber && /all|print/i.test(e.showSlideNumber), s = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), n = Math.floor(s.width * (1 + e.margin)), r = Math.floor(s.height * (1 + e.margin)), o = s.width, h = s.height;
    await new Promise(requestAnimationFrame), Ue("@page{size:" + n + "px " + r + "px; margin: 0px;}"), Ue(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + o + "px; max-height:" + h + "px}"), document.documentElement.classList.add("reveal-print", "print-pdf"), document.body.style.width = n + "px", document.body.style.height = r + "px";
    const u = this.Reveal.getViewportElement();
    let g;
    if (u) {
      const R = window.getComputedStyle(u);
      R && R.background && (g = R.background);
    }
    await new Promise(requestAnimationFrame), this.Reveal.layoutSlideContents(o, h), await new Promise(requestAnimationFrame);
    const p = i.map((R) => R.scrollHeight), m = [], b = i[0].parentNode;
    let l = 1;
    i.forEach(function(R, M) {
      if (R.classList.contains("stack") === !1) {
        let O = (n - o) / 2, q = (r - h) / 2;
        const ae = p[M];
        let z = Math.max(Math.ceil(ae / r), 1);
        z = Math.min(z, e.pdfMaxPagesPerSlide), (z === 1 && e.center || R.classList.contains("center")) && (q = Math.max((r - ae) / 2, 0));
        const k = document.createElement("div");
        if (m.push(k), k.className = "pdf-page", k.style.height = (r + e.pdfPageHeightOffset) * z + "px", g && (k.style.background = g), k.appendChild(R), R.style.left = O + "px", R.style.top = q + "px", R.style.width = o + "px", this.Reveal.slideContent.layout(R), R.slideBackgroundElement && k.insertBefore(R.slideBackgroundElement, R), e.showNotes) {
          const B = this.Reveal.getSlideNotes(R);
          if (B) {
            const W = typeof e.showNotes == "string" ? e.showNotes : "inline", L = document.createElement("div");
            L.classList.add("speaker-notes"), L.classList.add("speaker-notes-pdf"), L.setAttribute("data-layout", W), L.innerHTML = B, W === "separate-page" ? m.push(L) : (L.style.left = "8px", L.style.bottom = "8px", L.style.width = n - 8 * 2 + "px", k.appendChild(L));
          }
        }
        if (t) {
          const B = document.createElement("div");
          B.classList.add("slide-number"), B.classList.add("slide-number-pdf"), B.innerHTML = l++, k.appendChild(B);
        }
        if (e.pdfSeparateFragments) {
          const B = this.Reveal.fragments.sort(k.querySelectorAll(".fragment"), !0);
          let U;
          B.forEach(function(W, L) {
            U && U.forEach(function(F) {
              F.classList.remove("current-fragment");
            }), W.forEach(function(F) {
              F.classList.add("visible", "current-fragment");
            }, this);
            const A = k.cloneNode(!0);
            if (t) {
              const F = A.querySelector(".slide-number-pdf"), C = L + 1;
              F.innerHTML += "." + C;
            }
            m.push(A), U = W;
          }, this), B.forEach(function(W) {
            W.forEach(function(L) {
              L.classList.remove("visible", "current-fragment");
            });
          });
        } else
          E(k, ".fragment:not(.fade-out)").forEach(function(B) {
            B.classList.add("visible");
          });
      }
    }, this), await new Promise(requestAnimationFrame), m.forEach((R) => b.appendChild(R)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.dispatchEvent({ type: "pdf-ready" }), u.classList.remove("loading-scroll-mode");
  }
  /**
   * Checks if the print mode is/should be activated.
   */
  isActive() {
    return this.Reveal.getConfig().view === "print";
  }
}
class Ni {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    e.fragments === !1 ? this.disable() : i.fragments === !1 && this.enable();
  }
  /**
   * If fragments are disabled in the deck, they should all be
   * visible rather than stepped through.
   */
  disable() {
    E(this.Reveal.getSlidesElement(), ".fragment").forEach((e) => {
      e.classList.add("visible"), e.classList.remove("current-fragment");
    });
  }
  /**
   * Reverse of #disable(). Only called if fragments have
   * previously been disabled.
   */
  enable() {
    E(this.Reveal.getSlidesElement(), ".fragment").forEach((e) => {
      e.classList.remove("visible"), e.classList.remove("current-fragment");
    });
  }
  /**
   * Returns an object describing the available fragment
   * directions.
   *
   * @return {{prev: boolean, next: boolean}}
   */
  availableRoutes() {
    let e = this.Reveal.getCurrentSlide();
    if (e && this.Reveal.getConfig().fragments) {
      let i = e.querySelectorAll(".fragment:not(.disabled)"), t = e.querySelectorAll(".fragment:not(.disabled):not(.visible)");
      return {
        prev: i.length - t.length > 0,
        next: !!t.length
      };
    } else
      return { prev: !1, next: !1 };
  }
  /**
   * Return a sorted fragments list, ordered by an increasing
   * "data-fragment-index" attribute.
   *
   * Fragments will be revealed in the order that they are returned by
   * this function, so you can use the index attributes to control the
   * order of fragment appearance.
   *
   * To maintain a sensible default fragment order, fragments are presumed
   * to be passed in document order. This function adds a "fragment-index"
   * attribute to each node if such an attribute is not already present,
   * and sets that attribute to an integer value which is the position of
   * the fragment within the fragments list.
   *
   * @param {object[]|*} fragments
   * @param {boolean} grouped If true the returned array will contain
   * nested arrays for all fragments with the same index
   * @return {object[]} sorted Sorted array of fragments
   */
  sort(e, i = !1) {
    e = Array.from(e);
    let t = [], s = [], n = [];
    e.forEach((o) => {
      if (o.hasAttribute("data-fragment-index")) {
        let h = parseInt(o.getAttribute("data-fragment-index"), 10);
        t[h] || (t[h] = []), t[h].push(o);
      } else
        s.push([o]);
    }), t = t.concat(s);
    let r = 0;
    return t.forEach((o) => {
      o.forEach((h) => {
        n.push(h), h.setAttribute("data-fragment-index", r);
      }), r++;
    }), i === !0 ? t : n;
  }
  /**
   * Sorts and formats all of fragments in the
   * presentation.
   */
  sortAll() {
    this.Reveal.getHorizontalSlides().forEach((e) => {
      let i = E(e, "section");
      i.forEach((t, s) => {
        this.sort(t.querySelectorAll(".fragment"));
      }, this), i.length === 0 && this.sort(e.querySelectorAll(".fragment"));
    });
  }
  /**
   * Refreshes the fragments on the current slide so that they
   * have the appropriate classes (.visible + .current-fragment).
   *
   * @param {number} [index] The index of the current fragment
   * @param {array} [fragments] Array containing all fragments
   * in the current slide
   *
   * @return {{shown: array, hidden: array}}
   */
  update(e, i, t = this.Reveal.getCurrentSlide()) {
    let s = {
      shown: [],
      hidden: []
    };
    if (t && this.Reveal.getConfig().fragments && (i = i || this.sort(t.querySelectorAll(".fragment")), i.length)) {
      let n = 0;
      if (typeof e != "number") {
        let r = this.sort(t.querySelectorAll(".fragment.visible")).pop();
        r && (e = parseInt(r.getAttribute("data-fragment-index") || 0, 10));
      }
      Array.from(i).forEach((r, o) => {
        if (r.hasAttribute("data-fragment-index") && (o = parseInt(r.getAttribute("data-fragment-index"), 10)), n = Math.max(n, o), o <= e) {
          let h = r.classList.contains("visible");
          r.classList.add("visible"), r.classList.remove("current-fragment"), o === e && (this.Reveal.announceStatus(this.Reveal.getStatusText(r)), r.classList.add("current-fragment"), this.Reveal.slideContent.startEmbeddedContent(r)), h || (s.shown.push(r), this.Reveal.dispatchEvent({
            target: r,
            type: "visible",
            bubbles: !1
          }));
        } else {
          let h = r.classList.contains("visible");
          r.classList.remove("visible"), r.classList.remove("current-fragment"), h && (this.Reveal.slideContent.stopEmbeddedContent(r), s.hidden.push(r), this.Reveal.dispatchEvent({
            target: r,
            type: "hidden",
            bubbles: !1
          }));
        }
      }), e = typeof e == "number" ? e : -1, e = Math.max(Math.min(e, n), -1), t.setAttribute("data-fragment", e);
    }
    return s.hidden.length && this.Reveal.dispatchEvent({
      type: "fragmenthidden",
      data: {
        fragment: s.hidden[0],
        fragments: s.hidden
      }
    }), s.shown.length && this.Reveal.dispatchEvent({
      type: "fragmentshown",
      data: {
        fragment: s.shown[0],
        fragments: s.shown
      }
    }), s;
  }
  /**
   * Formats the fragments on the given slide so that they have
   * valid indices. Call this if fragments are changed in the DOM
   * after reveal.js has already initialized.
   *
   * @param {HTMLElement} slide
   * @return {Array} a list of the HTML fragments that were synced
   */
  sync(e = this.Reveal.getCurrentSlide()) {
    return this.sort(e.querySelectorAll(".fragment"));
  }
  /**
   * Navigate to the specified slide fragment.
   *
   * @param {?number} index The index of the fragment that
   * should be shown, -1 means all are invisible
   * @param {number} offset Integer offset to apply to the
   * fragment index
   *
   * @return {boolean} true if a change was made in any
   * fragments visibility as part of this call
   */
  goto(e, i = 0) {
    let t = this.Reveal.getCurrentSlide();
    if (t && this.Reveal.getConfig().fragments) {
      let s = this.sort(t.querySelectorAll(".fragment:not(.disabled)"));
      if (s.length) {
        if (typeof e != "number") {
          let r = this.sort(t.querySelectorAll(".fragment:not(.disabled).visible")).pop();
          r ? e = parseInt(r.getAttribute("data-fragment-index") || 0, 10) : e = -1;
        }
        e += i;
        let n = this.update(e, s);
        return this.Reveal.controls.update(), this.Reveal.progress.update(), this.Reveal.getConfig().fragmentInURL && this.Reveal.location.writeURL(), !!(n.shown.length || n.hidden.length);
      }
    }
    return !1;
  }
  /**
   * Navigate to the next slide fragment.
   *
   * @return {boolean} true if there was a next fragment,
   * false otherwise
   */
  next() {
    return this.goto(null, 1);
  }
  /**
   * Navigate to the previous slide fragment.
   *
   * @return {boolean} true if there was a previous fragment,
   * false otherwise
   */
  prev() {
    return this.goto(null, -1);
  }
}
class Bi {
  constructor(e) {
    this.Reveal = e, this.active = !1, this.onSlideClicked = this.onSlideClicked.bind(this);
  }
  /**
   * Displays the overview of slides (quick nav) by scaling
   * down and arranging all slide elements.
   */
  activate() {
    if (this.Reveal.getConfig().overview && !this.Reveal.isScrollView() && !this.isActive()) {
      this.active = !0, this.Reveal.getRevealElement().classList.add("overview"), this.Reveal.cancelAutoSlide(), this.Reveal.getSlidesElement().appendChild(this.Reveal.getBackgroundsElement()), E(this.Reveal.getRevealElement(), oe).forEach((s) => {
        s.classList.contains("stack") || s.addEventListener("click", this.onSlideClicked, !0);
      });
      const e = 70, i = this.Reveal.getComputedSlideSize();
      this.overviewSlideWidth = i.width + e, this.overviewSlideHeight = i.height + e, this.Reveal.getConfig().rtl && (this.overviewSlideWidth = -this.overviewSlideWidth), this.Reveal.updateSlidesVisibility(), this.layout(), this.update(), this.Reveal.layout();
      const t = this.Reveal.getIndices();
      this.Reveal.dispatchEvent({
        type: "overviewshown",
        data: {
          indexh: t.h,
          indexv: t.v,
          currentSlide: this.Reveal.getCurrentSlide()
        }
      });
    }
  }
  /**
   * Uses CSS transforms to position all slides in a grid for
   * display inside of the overview mode.
   */
  layout() {
    this.Reveal.getHorizontalSlides().forEach((e, i) => {
      e.setAttribute("data-index-h", i), se(e, "translate3d(" + i * this.overviewSlideWidth + "px, 0, 0)"), e.classList.contains("stack") && E(e, "section").forEach((t, s) => {
        t.setAttribute("data-index-h", i), t.setAttribute("data-index-v", s), se(t, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
      });
    }), Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach((e, i) => {
      se(e, "translate3d(" + i * this.overviewSlideWidth + "px, 0, 0)"), E(e, ".slide-background").forEach((t, s) => {
        se(t, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
      });
    });
  }
  /**
   * Moves the overview viewport to the current slides.
   * Called each time the current slide changes.
   */
  update() {
    const e = Math.min(window.innerWidth, window.innerHeight), i = Math.max(e / 5, 150) / e, t = this.Reveal.getIndices();
    this.Reveal.transformSlides({
      overview: [
        "scale(" + i + ")",
        "translateX(" + -t.h * this.overviewSlideWidth + "px)",
        "translateY(" + -t.v * this.overviewSlideHeight + "px)"
      ].join(" ")
    });
  }
  /**
   * Exits the slide overview and enters the currently
   * active slide.
   */
  deactivate() {
    if (this.Reveal.getConfig().overview) {
      this.active = !1, this.Reveal.getRevealElement().classList.remove("overview"), this.Reveal.getRevealElement().classList.add("overview-deactivating"), setTimeout(() => {
        this.Reveal.getRevealElement().classList.remove("overview-deactivating");
      }, 1), this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()), E(this.Reveal.getRevealElement(), oe).forEach((i) => {
        se(i, ""), i.removeEventListener("click", this.onSlideClicked, !0);
      }), E(this.Reveal.getBackgroundsElement(), ".slide-background").forEach((i) => {
        se(i, "");
      }), this.Reveal.transformSlides({ overview: "" });
      const e = this.Reveal.getIndices();
      this.Reveal.slide(e.h, e.v), this.Reveal.layout(), this.Reveal.cueAutoSlide(), this.Reveal.dispatchEvent({
        type: "overviewhidden",
        data: {
          indexh: e.h,
          indexv: e.v,
          currentSlide: this.Reveal.getCurrentSlide()
        }
      });
    }
  }
  /**
   * Toggles the slide overview mode on and off.
   *
   * @param {Boolean} [override] Flag which overrides the
   * toggle logic and forcibly sets the desired state. True means
   * overview is open, false means it's closed.
   */
  toggle(e) {
    typeof e == "boolean" ? e ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
  }
  /**
   * Checks if the overview is currently active.
   *
   * @return {Boolean} true if the overview is active,
   * false otherwise
   */
  isActive() {
    return this.active;
  }
  /**
   * Invoked when a slide is and we're in the overview.
   *
   * @param {object} event
   */
  onSlideClicked(e) {
    if (this.isActive()) {
      e.preventDefault();
      let i = e.target;
      for (; i && !i.nodeName.match(/section/gi); )
        i = i.parentNode;
      if (i && !i.classList.contains("disabled") && (this.deactivate(), i.nodeName.match(/section/gi))) {
        let t = parseInt(i.getAttribute("data-index-h"), 10), s = parseInt(i.getAttribute("data-index-v"), 10);
        this.Reveal.slide(t, s);
      }
    }
  }
}
class Hi {
  constructor(e) {
    this.Reveal = e, this.shortcuts = {}, this.bindings = {}, this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    e.navigationMode === "linear" ? (this.shortcuts["&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J"] = "Next slide", this.shortcuts["&#8592;  ,  &#8593;  ,  P  ,  H  ,  K"] = "Previous slide") : (this.shortcuts["N  ,  SPACE"] = "Next slide", this.shortcuts["P  ,  Shift SPACE"] = "Previous slide", this.shortcuts["&#8592;  ,  H"] = "Navigate left", this.shortcuts["&#8594;  ,  L"] = "Navigate right", this.shortcuts["&#8593;  ,  K"] = "Navigate up", this.shortcuts["&#8595;  ,  J"] = "Navigate down"), this.shortcuts["Alt + &#8592;/&#8593/&#8594;/&#8595;"] = "Navigate without fragments", this.shortcuts["Shift + &#8592;/&#8593/&#8594;/&#8595;"] = "Jump to first/last slide", this.shortcuts["B  ,  ."] = "Pause", this.shortcuts.F = "Fullscreen", this.shortcuts.G = "Jump to slide", this.shortcuts["ESC, O"] = "Slide overview";
  }
  /**
   * Starts listening for keyboard events.
   */
  bind() {
    document.addEventListener("keydown", this.onDocumentKeyDown, !1);
  }
  /**
   * Stops listening for keyboard events.
   */
  unbind() {
    document.removeEventListener("keydown", this.onDocumentKeyDown, !1);
  }
  /**
   * Add a custom key binding with optional description to
   * be added to the help screen.
   */
  addKeyBinding(e, i) {
    typeof e == "object" && e.keyCode ? this.bindings[e.keyCode] = {
      callback: i,
      key: e.key,
      description: e.description
    } : this.bindings[e] = {
      callback: i,
      key: null,
      description: null
    };
  }
  /**
   * Removes the specified custom key binding.
   */
  removeKeyBinding(e) {
    delete this.bindings[e];
  }
  /**
   * Programmatically triggers a keyboard event
   *
   * @param {int} keyCode
   */
  triggerKey(e) {
    this.onDocumentKeyDown({ keyCode: e });
  }
  /**
   * Registers a new shortcut to include in the help overlay
   *
   * @param {String} key
   * @param {String} value
   */
  registerKeyboardShortcut(e, i) {
    this.shortcuts[e] = i;
  }
  getShortcuts() {
    return this.shortcuts;
  }
  getBindings() {
    return this.bindings;
  }
  /**
   * Handler for the document level 'keydown' event.
   *
   * @param {object} event
   */
  onDocumentKeyDown(e) {
    let i = this.Reveal.getConfig();
    if (typeof i.keyboardCondition == "function" && i.keyboardCondition(e) === !1 || i.keyboardCondition === "focused" && !this.Reveal.isFocused())
      return !0;
    let t = e.keyCode, s = !this.Reveal.isAutoSliding();
    this.Reveal.onUserInput(e);
    let n = document.activeElement && document.activeElement.isContentEditable === !0, r = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), o = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className), u = !([32, 37, 38, 39, 40, 63, 78, 80, 191].indexOf(e.keyCode) !== -1 && e.shiftKey || e.altKey) && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    if (n || r || o || u) return;
    let g = [66, 86, 190, 191, 112], p;
    if (typeof i.keyboard == "object")
      for (p in i.keyboard)
        i.keyboard[p] === "togglePause" && g.push(parseInt(p, 10));
    if (this.Reveal.isOverlayOpen() && !["Escape", "f", "c", "b", "."].includes(e.key) || this.Reveal.isPaused() && g.indexOf(t) === -1)
      return !1;
    let m = i.navigationMode === "linear" || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides(), b = !1;
    if (typeof i.keyboard == "object") {
      for (p in i.keyboard)
        if (parseInt(p, 10) === t) {
          let l = i.keyboard[p];
          typeof l == "function" ? l.apply(null, [e]) : typeof l == "string" && typeof this.Reveal[l] == "function" && this.Reveal[l].call(), b = !0;
        }
    }
    if (b === !1) {
      for (p in this.bindings)
        if (parseInt(p, 10) === t) {
          let l = this.bindings[p].callback;
          typeof l == "function" ? l.apply(null, [e]) : typeof l == "string" && typeof this.Reveal[l] == "function" && this.Reveal[l].call(), b = !0;
        }
    }
    b === !1 && (b = !0, t === 80 || t === 33 ? this.Reveal.prev({ skipFragments: e.altKey }) : t === 78 || t === 34 ? this.Reveal.next({ skipFragments: e.altKey }) : t === 72 || t === 37 ? e.shiftKey ? this.Reveal.slide(0) : !this.Reveal.overview.isActive() && m ? i.rtl ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.left({ skipFragments: e.altKey }) : t === 76 || t === 39 ? e.shiftKey ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : !this.Reveal.overview.isActive() && m ? i.rtl ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.right({ skipFragments: e.altKey }) : t === 75 || t === 38 ? e.shiftKey ? this.Reveal.slide(void 0, 0) : !this.Reveal.overview.isActive() && m ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.up({ skipFragments: e.altKey }) : t === 74 || t === 40 ? e.shiftKey ? this.Reveal.slide(void 0, Number.MAX_VALUE) : !this.Reveal.overview.isActive() && m ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.down({ skipFragments: e.altKey }) : t === 36 ? this.Reveal.slide(0) : t === 35 ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : t === 32 ? (this.Reveal.overview.isActive() && this.Reveal.overview.deactivate(), e.shiftKey ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey })) : [58, 59, 66, 86, 190].includes(t) || t === 191 && !e.shiftKey ? this.Reveal.togglePause() : t === 70 ? xt(i.embedded ? this.Reveal.getViewportElement() : document.documentElement) : t === 65 ? i.autoSlideStoppable && this.Reveal.toggleAutoSlide(s) : t === 71 ? i.jumpToSlide && this.Reveal.toggleJumpToSlide() : t === 67 && this.Reveal.isOverlayOpen() ? this.Reveal.closeOverlay() : (t === 63 || t === 191) && e.shiftKey ? this.Reveal.toggleHelp() : t === 112 ? this.Reveal.toggleHelp() : b = !1), b ? e.preventDefault && e.preventDefault() : t === 27 || t === 79 ? (this.Reveal.closeOverlay() === !1 && this.Reveal.overview.toggle(), e.preventDefault && e.preventDefault()) : t === 13 && this.Reveal.overview.isActive() && (this.Reveal.overview.deactivate(), e.preventDefault && e.preventDefault()), this.Reveal.cueAutoSlide();
  }
}
class Di {
  constructor(e) {
    // The minimum number of milliseconds that must pass between
    // calls to history.replaceState
    Rt(this, "MAX_REPLACE_STATE_FREQUENCY", 1e3);
    this.Reveal = e, this.writeURLTimeout = 0, this.replaceStateTimestamp = 0, this.onWindowHashChange = this.onWindowHashChange.bind(this);
  }
  bind() {
    window.addEventListener("hashchange", this.onWindowHashChange, !1);
  }
  unbind() {
    window.removeEventListener("hashchange", this.onWindowHashChange, !1);
  }
  /**
   * Returns the slide indices for the given hash link.
   *
   * @param {string} [hash] the hash string that we want to
   * find the indices for
   *
   * @returns slide indices or null
   */
  getIndicesFromHash(e = window.location.hash, i = {}) {
    let t = e.replace(/^#\/?/, ""), s = t.split("/");
    if (!/^[0-9]*$/.test(s[0]) && t.length) {
      let n, r;
      /\/[-\d]+$/g.test(t) && (r = parseInt(t.split("/").pop(), 10), r = isNaN(r) ? void 0 : r, t = t.split("/").shift());
      try {
        n = document.getElementById(decodeURIComponent(t)).closest(".slides section");
      } catch {
      }
      if (n)
        return { ...this.Reveal.getIndices(n), f: r };
    } else {
      const n = this.Reveal.getConfig();
      let r = n.hashOneBasedIndex || i.oneBasedIndex ? 1 : 0, o = parseInt(s[0], 10) - r || 0, h = parseInt(s[1], 10) - r || 0, u;
      return n.fragmentInURL && (u = parseInt(s[2], 10), isNaN(u) && (u = void 0)), { h: o, v: h, f: u };
    }
    return null;
  }
  /**
   * Reads the current URL (hash) and navigates accordingly.
   */
  readURL() {
    const e = this.Reveal.getIndices(), i = this.getIndicesFromHash();
    i ? (i.h !== e.h || i.v !== e.v || i.f !== void 0) && this.Reveal.slide(i.h, i.v, i.f) : this.Reveal.slide(e.h || 0, e.v || 0);
  }
  /**
   * Updates the page URL (hash) to reflect the current
   * state.
   *
   * @param {number} delay The time in ms to wait before
   * writing the hash
   */
  writeURL(e) {
    let i = this.Reveal.getConfig(), t = this.Reveal.getCurrentSlide();
    if (clearTimeout(this.writeURLTimeout), typeof e == "number")
      this.writeURLTimeout = setTimeout(this.writeURL, e);
    else if (t) {
      let s = this.getHash();
      i.history ? window.location.hash = s : i.hash && (s === "/" ? this.debouncedReplaceState(window.location.pathname + window.location.search) : this.debouncedReplaceState("#" + s));
    }
  }
  replaceState(e) {
    window.history.replaceState(null, null, e), this.replaceStateTimestamp = Date.now();
  }
  debouncedReplaceState(e) {
    clearTimeout(this.replaceStateTimeout), Date.now() - this.replaceStateTimestamp > this.MAX_REPLACE_STATE_FREQUENCY ? this.replaceState(e) : this.replaceStateTimeout = setTimeout(() => this.replaceState(e), this.MAX_REPLACE_STATE_FREQUENCY);
  }
  /**
   * Return a hash URL that will resolve to the given slide location.
   *
   * @param {HTMLElement} [slide=currentSlide] The slide to link to
   */
  getHash(e) {
    let i = "/", t = e || this.Reveal.getCurrentSlide(), s = t ? t.getAttribute("id") : null;
    s && (s = encodeURIComponent(s));
    let n = this.Reveal.getIndices(e);
    if (this.Reveal.getConfig().fragmentInURL || (n.f = void 0), typeof s == "string" && s.length)
      i = "/" + s, n.f >= 0 && (i += "/" + n.f);
    else {
      let r = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
      (n.h > 0 || n.v > 0 || n.f >= 0) && (i += n.h + r), (n.v > 0 || n.f >= 0) && (i += "/" + (n.v + r)), n.f >= 0 && (i += "/" + n.f);
    }
    return i;
  }
  /**
   * Handler for the window level 'hashchange' event.
   *
   * @param {object} [event]
   */
  onWindowHashChange(e) {
    this.readURL();
  }
}
class Fi {
  constructor(e) {
    this.Reveal = e, this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this), this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this), this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this), this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this), this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this), this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this), this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
  }
  render() {
    const e = this.Reveal.getConfig().rtl, i = this.Reveal.getRevealElement();
    this.element = document.createElement("aside"), this.element.className = "controls", this.element.innerHTML = `<button class="navigate-left" aria-label="${e ? "next slide" : "previous slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${e ? "previous slide" : "next slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`, this.Reveal.getRevealElement().appendChild(this.element), this.controlsLeft = E(i, ".navigate-left"), this.controlsRight = E(i, ".navigate-right"), this.controlsUp = E(i, ".navigate-up"), this.controlsDown = E(i, ".navigate-down"), this.controlsPrev = E(i, ".navigate-prev"), this.controlsNext = E(i, ".navigate-next"), this.controlsFullscreen = E(i, ".enter-fullscreen"), this.controlsRightArrow = this.element.querySelector(".navigate-right"), this.controlsLeftArrow = this.element.querySelector(".navigate-left"), this.controlsDownArrow = this.element.querySelector(".navigate-down");
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    this.element.style.display = e.controls && (e.controls !== "speaker-only" || this.Reveal.isSpeakerNotes()) ? "block" : "none", this.element.setAttribute("data-controls-layout", e.controlsLayout), this.element.setAttribute("data-controls-back-arrows", e.controlsBackArrows);
  }
  bind() {
    let e = ["touchstart", "click"];
    It && (e = ["touchstart"]), e.forEach((i) => {
      this.controlsLeft.forEach((t) => t.addEventListener(i, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((t) => t.addEventListener(i, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((t) => t.addEventListener(i, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((t) => t.addEventListener(i, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((t) => t.addEventListener(i, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((t) => t.addEventListener(i, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((t) => t.addEventListener(i, this.onEnterFullscreen, !1));
    });
  }
  unbind() {
    ["touchstart", "click"].forEach((e) => {
      this.controlsLeft.forEach((i) => i.removeEventListener(e, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((i) => i.removeEventListener(e, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((i) => i.removeEventListener(e, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((i) => i.removeEventListener(e, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((i) => i.removeEventListener(e, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((i) => i.removeEventListener(e, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((i) => i.removeEventListener(e, this.onEnterFullscreen, !1));
    });
  }
  /**
   * Updates the state of all control/navigation arrows.
   */
  update() {
    let e = this.Reveal.availableRoutes();
    [...this.controlsLeft, ...this.controlsRight, ...this.controlsUp, ...this.controlsDown, ...this.controlsPrev, ...this.controlsNext].forEach((t) => {
      t.classList.remove("enabled", "fragmented"), t.setAttribute("disabled", "disabled");
    }), e.left && this.controlsLeft.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    }), e.right && this.controlsRight.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    }), e.up && this.controlsUp.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    }), e.down && this.controlsDown.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    }), (e.left || e.up) && this.controlsPrev.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    }), (e.right || e.down) && this.controlsNext.forEach((t) => {
      t.classList.add("enabled"), t.removeAttribute("disabled");
    });
    let i = this.Reveal.getCurrentSlide();
    if (i) {
      let t = this.Reveal.fragments.availableRoutes();
      t.prev && this.controlsPrev.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      }), t.next && this.controlsNext.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      });
      const s = this.Reveal.isVerticalSlide(i), n = s && i.parentElement && i.parentElement.querySelectorAll(":scope > section").length > 1;
      s && n ? (t.prev && this.controlsUp.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      }), t.next && this.controlsDown.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      })) : (t.prev && this.controlsLeft.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      }), t.next && this.controlsRight.forEach((r) => {
        r.classList.add("fragmented", "enabled"), r.removeAttribute("disabled");
      }));
    }
    if (this.Reveal.getConfig().controlsTutorial) {
      let t = this.Reveal.getIndices();
      !this.Reveal.hasNavigatedVertically() && e.down ? this.controlsDownArrow.classList.add("highlight") : (this.controlsDownArrow.classList.remove("highlight"), this.Reveal.getConfig().rtl ? !this.Reveal.hasNavigatedHorizontally() && e.left && t.v === 0 ? this.controlsLeftArrow.classList.add("highlight") : this.controlsLeftArrow.classList.remove("highlight") : !this.Reveal.hasNavigatedHorizontally() && e.right && t.v === 0 ? this.controlsRightArrow.classList.add("highlight") : this.controlsRightArrow.classList.remove("highlight"));
    }
  }
  destroy() {
    this.unbind(), this.element.remove();
  }
  /**
   * Event handlers for navigation control buttons.
   */
  onNavigateLeftClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.getConfig().navigationMode === "linear" ? this.Reveal.prev() : this.Reveal.left();
  }
  onNavigateRightClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.getConfig().navigationMode === "linear" ? this.Reveal.next() : this.Reveal.right();
  }
  onNavigateUpClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.up();
  }
  onNavigateDownClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.down();
  }
  onNavigatePrevClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.prev();
  }
  onNavigateNextClicked(e) {
    e.preventDefault(), this.Reveal.onUserInput(), this.Reveal.next();
  }
  onEnterFullscreen(e) {
    const i = this.Reveal.getConfig(), t = this.Reveal.getViewportElement();
    xt(i.embedded ? t : t.parentElement);
  }
}
class zi {
  constructor(e) {
    this.Reveal = e, this.onProgressClicked = this.onProgressClicked.bind(this);
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "progress", this.Reveal.getRevealElement().appendChild(this.element), this.bar = document.createElement("span"), this.element.appendChild(this.bar);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    this.element.style.display = e.progress ? "block" : "none";
  }
  bind() {
    this.Reveal.getConfig().progress && this.element && this.element.addEventListener("click", this.onProgressClicked, !1);
  }
  unbind() {
    this.Reveal.getConfig().progress && this.element && this.element.removeEventListener("click", this.onProgressClicked, !1);
  }
  /**
   * Updates the progress bar to reflect the current slide.
   */
  update() {
    if (this.Reveal.getConfig().progress && this.bar) {
      let e = this.Reveal.getProgress();
      this.Reveal.getTotalSlides() < 2 && (e = 0), this.bar.style.transform = "scaleX(" + e + ")";
    }
  }
  getMaxWidth() {
    return this.Reveal.getRevealElement().offsetWidth;
  }
  /**
   * Clicking on the progress bar results in a navigation to the
   * closest approximate horizontal slide using this equation:
   *
   * ( clickX / presentationWidth ) * numberOfSlides
   *
   * @param {object} event
   */
  onProgressClicked(e) {
    this.Reveal.onUserInput(e), e.preventDefault();
    let i = this.Reveal.getSlides(), t = i.length, s = Math.floor(e.clientX / this.getMaxWidth() * t);
    this.Reveal.getConfig().rtl && (s = t - s);
    let n = this.Reveal.getIndices(i[s]);
    this.Reveal.slide(n.h, n.v);
  }
  destroy() {
    this.element.remove();
  }
}
class Vi {
  constructor(e) {
    this.Reveal = e, this.lastMouseWheelStep = 0, this.cursorHidden = !1, this.cursorInactiveTimeout = 0, this.onDocumentCursorActive = this.onDocumentCursorActive.bind(this), this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    e.mouseWheel ? document.addEventListener("wheel", this.onDocumentMouseScroll, !1) : document.removeEventListener("wheel", this.onDocumentMouseScroll, !1), e.hideInactiveCursor ? (document.addEventListener("mousemove", this.onDocumentCursorActive, !1), document.addEventListener("mousedown", this.onDocumentCursorActive, !1)) : (this.showCursor(), document.removeEventListener("mousemove", this.onDocumentCursorActive, !1), document.removeEventListener("mousedown", this.onDocumentCursorActive, !1));
  }
  /**
   * Shows the mouse pointer after it has been hidden with
   * #hideCursor.
   */
  showCursor() {
    this.cursorHidden && (this.cursorHidden = !1, this.Reveal.getRevealElement().style.cursor = "");
  }
  /**
   * Hides the mouse pointer when it's on top of the .reveal
   * container.
   */
  hideCursor() {
    this.cursorHidden === !1 && (this.cursorHidden = !0, this.Reveal.getRevealElement().style.cursor = "none");
  }
  destroy() {
    this.showCursor(), document.removeEventListener("wheel", this.onDocumentMouseScroll, !1), document.removeEventListener("mousemove", this.onDocumentCursorActive, !1), document.removeEventListener("mousedown", this.onDocumentCursorActive, !1);
  }
  /**
   * Called whenever there is mouse input at the document level
   * to determine if the cursor is active or not.
   *
   * @param {object} event
   */
  onDocumentCursorActive(e) {
    this.showCursor(), clearTimeout(this.cursorInactiveTimeout), this.cursorInactiveTimeout = setTimeout(this.hideCursor.bind(this), this.Reveal.getConfig().hideCursorTime);
  }
  /**
   * Handles mouse wheel scrolling, throttled to avoid skipping
   * multiple slides.
   *
   * @param {object} event
   */
  onDocumentMouseScroll(e) {
    if (Date.now() - this.lastMouseWheelStep > 1e3) {
      this.lastMouseWheelStep = Date.now();
      let i = e.detail || -e.wheelDelta;
      i > 0 ? this.Reveal.next() : i < 0 && this.Reveal.prev();
    }
  }
}
const Lt = (c, e) => {
  const i = document.createElement("script");
  i.type = "text/javascript", i.async = !1, i.defer = !1, i.src = c, typeof e == "function" && (i.onload = i.onreadystatechange = (s) => {
    (s.type === "load" || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = i.onerror = null, e());
  }, i.onerror = (s) => {
    i.onload = i.onreadystatechange = i.onerror = null, e(new Error("Failed loading script: " + i.src + `
` + s));
  });
  const t = document.querySelector("head");
  t.insertBefore(i, t.lastChild);
};
class Oi {
  constructor(e) {
    this.Reveal = e, this.state = "idle", this.registeredPlugins = {}, this.asyncDependencies = [];
  }
  /**
   * Loads reveal.js dependencies, registers and
   * initializes plugins.
   *
   * Plugins are direct references to a reveal.js plugin
   * object that we register and initialize after any
   * synchronous dependencies have loaded.
   *
   * Dependencies are defined via the 'dependencies' config
   * option and will be loaded prior to starting reveal.js.
   * Some dependencies may have an 'async' flag, if so they
   * will load after reveal.js has been started up.
   */
  load(e, i) {
    return this.state = "loading", e.forEach(this.registerPlugin.bind(this)), new Promise((t) => {
      let s = [], n = 0;
      if (i.forEach((r) => {
        (!r.condition || r.condition()) && (r.async ? this.asyncDependencies.push(r) : s.push(r));
      }), s.length) {
        n = s.length;
        const r = (o) => {
          o && typeof o.callback == "function" && o.callback(), --n === 0 && this.initPlugins().then(t);
        };
        s.forEach((o) => {
          typeof o.id == "string" ? (this.registerPlugin(o), r(o)) : typeof o.src == "string" ? Lt(o.src, () => r(o)) : (console.warn("Unrecognized plugin format", o), r());
        });
      } else
        this.initPlugins().then(t);
    });
  }
  /**
   * Initializes our plugins and waits for them to be ready
   * before proceeding.
   */
  initPlugins() {
    return new Promise((e) => {
      let i = Object.values(this.registeredPlugins), t = i.length;
      if (t === 0)
        this.loadAsync().then(e);
      else {
        let s, n = () => {
          --t === 0 ? this.loadAsync().then(e) : s();
        }, r = 0;
        s = () => {
          let o = i[r++];
          if (typeof o.init == "function") {
            let h = o.init(this.Reveal);
            h && typeof h.then == "function" ? h.then(n) : n();
          } else
            n();
        }, s();
      }
    });
  }
  /**
   * Loads all async reveal.js dependencies.
   */
  loadAsync() {
    return this.state = "loaded", this.asyncDependencies.length && this.asyncDependencies.forEach((e) => {
      Lt(e.src, e.callback);
    }), Promise.resolve();
  }
  /**
   * Registers a new plugin with this reveal.js instance.
   *
   * reveal.js waits for all registered plugins to initialize
   * before considering itself ready, as long as the plugin
   * is registered before calling `Reveal.initialize()`.
   */
  registerPlugin(e) {
    arguments.length === 2 && typeof arguments[0] == "string" ? (e = arguments[1], e.id = arguments[0]) : typeof e == "function" && (e = e());
    let i = e.id;
    typeof i != "string" ? console.warn("Unrecognized plugin format; can't find plugin.id", e) : this.registeredPlugins[i] === void 0 ? (this.registeredPlugins[i] = e, this.state === "loaded" && typeof e.init == "function" && e.init(this.Reveal)) : console.warn('reveal.js: "' + i + '" plugin has already been registered');
  }
  /**
   * Checks if a specific plugin has been registered.
   *
   * @param {String} id Unique plugin identifier
   */
  hasPlugin(e) {
    return !!this.registeredPlugins[e];
  }
  /**
   * Returns the specific plugin instance, if a plugin
   * with the given ID has been registered.
   *
   * @param {String} id Unique plugin identifier
   */
  getPlugin(e) {
    return this.registeredPlugins[e];
  }
  getRegisteredPlugins() {
    return this.registeredPlugins;
  }
  destroy() {
    Object.values(this.registeredPlugins).forEach((e) => {
      typeof e.destroy == "function" && e.destroy();
    }), this.registeredPlugins = {}, this.asyncDependencies = [];
  }
}
class qi {
  constructor(e) {
    this.Reveal = e, this.onSlidesClicked = this.onSlidesClicked.bind(this), this.iframeTriggerSelector = null, this.mediaTriggerSelector = "[data-preview-image], [data-preview-video]", this.stateProps = ["previewIframe", "previewImage", "previewVideo", "previewFit"], this.state = {};
  }
  update() {
    this.Reveal.getConfig().previewLinks ? this.iframeTriggerSelector = "a[href]:not([data-preview-link=false]), [data-preview-link]:not(a):not([data-preview-link=false])" : this.iframeTriggerSelector = "[data-preview-link]:not([data-preview-link=false])";
    const e = this.Reveal.getSlidesElement().querySelectorAll(this.iframeTriggerSelector).length > 0, i = this.Reveal.getSlidesElement().querySelectorAll(this.mediaTriggerSelector).length > 0;
    e || i ? this.Reveal.getSlidesElement().addEventListener("click", this.onSlidesClicked, !1) : this.Reveal.getSlidesElement().removeEventListener("click", this.onSlidesClicked, !1);
  }
  createOverlay(e) {
    this.dom = document.createElement("div"), this.dom.classList.add("r-overlay"), this.dom.classList.add(e), this.viewport = document.createElement("div"), this.viewport.classList.add("r-overlay-viewport"), this.dom.appendChild(this.viewport), this.Reveal.getRevealElement().appendChild(this.dom);
  }
  /**
   * Opens a lightbox that previews the target URL.
   *
   * @param {string} url - url for lightbox iframe src
   */
  previewIframe(e) {
    this.close(), this.state = { previewIframe: e }, this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.viewport.innerHTML = `<header class="r-overlay-header">
				<a class="r-overlay-button r-overlay-external" href="${e}" target="_blank"><span class="icon"></span></a>
				<button class="r-overlay-button r-overlay-close"><span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content">
				<iframe src="${e}"></iframe>
				<small class="r-overlay-content-inner">
					<span class="r-overlay-error x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`, this.dom.querySelector("iframe").addEventListener("load", (i) => {
      this.dom.dataset.state = "loaded";
    }, !1), this.dom.querySelector(".r-overlay-close").addEventListener("click", (i) => {
      this.close(), i.preventDefault();
    }, !1), this.dom.querySelector(".r-overlay-external").addEventListener("click", (i) => {
      this.close();
    }, !1), this.Reveal.dispatchEvent({ type: "previewiframe", data: { url: e } });
  }
  /**
   * Opens a lightbox window that provides a larger view of the
   * given image/video.
   *
   * @param {string} url - url to the image/video to preview
   * @param {image|video} mediaType
   * @param {string} [fitMode] - the fit mode to use for the preview
   */
  previewMedia(e, i, t) {
    if (i !== "image" && i !== "video") {
      console.warn("Please specify a valid media type to preview (image|video)");
      return;
    }
    this.close(), t = t || "scale-down", this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.dom.dataset.previewFit = t, this.viewport.innerHTML = `<header class="r-overlay-header">
				<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content"></div>`;
    const s = this.dom.querySelector(".r-overlay-content");
    if (i === "image") {
      this.state = { previewImage: e, previewFit: t };
      const n = document.createElement("img", {});
      n.src = e, s.appendChild(n), n.addEventListener("load", () => {
        this.dom.dataset.state = "loaded";
      }, !1), n.addEventListener("error", () => {
        this.dom.dataset.state = "error", s.innerHTML = '<span class="r-overlay-error">Unable to load image.</span>';
      }, !1), this.dom.style.cursor = "zoom-out", this.dom.addEventListener("click", (r) => {
        this.close();
      }, !1), this.Reveal.dispatchEvent({ type: "previewimage", data: { url: e } });
    } else if (i === "video") {
      this.state = { previewVideo: e, previewFit: t };
      const n = document.createElement("video");
      n.autoplay = this.dom.dataset.previewAutoplay !== "false", n.controls = this.dom.dataset.previewControls !== "false", n.loop = this.dom.dataset.previewLoop === "true", n.muted = this.dom.dataset.previewMuted === "true", n.playsInline = !0, n.src = e, s.appendChild(n), n.addEventListener("loadeddata", () => {
        this.dom.dataset.state = "loaded";
      }, !1), n.addEventListener("error", () => {
        this.dom.dataset.state = "error", s.innerHTML = '<span class="r-overlay-error">Unable to load video.</span>';
      }, !1), this.Reveal.dispatchEvent({ type: "previewvideo", data: { url: e } });
    } else
      throw new Error("Please specify a valid media type to preview");
    this.dom.querySelector(".r-overlay-close").addEventListener("click", (n) => {
      this.close(), n.preventDefault();
    }, !1);
  }
  previewImage(e, i) {
    this.previewMedia(e, "image", i);
  }
  previewVideo(e, i) {
    this.previewMedia(e, "video", i);
  }
  /**
   * Open or close help overlay window.
   *
   * @param {Boolean} [override] Flag which overrides the
   * toggle logic and forcibly sets the desired state. True means
   * help is open, false means it's closed.
   */
  toggleHelp(e) {
    typeof e == "boolean" ? e ? this.showHelp() : this.close() : this.dom ? this.close() : this.showHelp();
  }
  /**
   * Opens an overlay window with help material.
   */
  showHelp() {
    if (this.Reveal.getConfig().help) {
      this.close(), this.createOverlay("r-overlay-help");
      let e = '<p class="title">Keyboard Shortcuts</p>', i = this.Reveal.keyboard.getShortcuts(), t = this.Reveal.keyboard.getBindings();
      e += "<table><th>KEY</th><th>ACTION</th>";
      for (let s in i)
        e += `<tr><td>${s}</td><td>${i[s]}</td></tr>`;
      for (let s in t)
        t[s].key && t[s].description && (e += `<tr><td>${t[s].key}</td><td>${t[s].description}</td></tr>`);
      e += "</table>", this.viewport.innerHTML = `
				<header class="r-overlay-header">
					<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
				</header>
				<div class="r-overlay-content">
					<div class="r-overlay-help-content">${e}</div>
				</div>
			`, this.dom.querySelector(".r-overlay-close").addEventListener("click", (s) => {
        this.close(), s.preventDefault();
      }, !1), this.Reveal.dispatchEvent({ type: "showhelp" });
    }
  }
  isOpen() {
    return !!this.dom;
  }
  /**
   * Closes any currently open overlay.
   */
  close() {
    return this.dom ? (this.dom.remove(), this.dom = null, this.state = {}, this.Reveal.dispatchEvent({ type: "closeoverlay" }), !0) : !1;
  }
  getState() {
    return this.state;
  }
  setState(e) {
    this.stateProps.every((i) => this.state[i] === e[i]) || (e.previewIframe ? this.previewIframe(e.previewIframe) : e.previewImage ? this.previewImage(e.previewImage, e.previewFit) : e.previewVideo ? this.previewVideo(e.previewVideo, e.previewFit) : this.close());
  }
  onSlidesClicked(e) {
    const i = e.target, t = i.closest(this.iframeTriggerSelector), s = i.closest(this.mediaTriggerSelector);
    if (t) {
      if (e.metaKey || e.shiftKey || e.altKey)
        return;
      let n = t.getAttribute("href") || t.getAttribute("data-preview-link");
      n && (this.previewIframe(n), e.preventDefault());
    } else if (s) {
      if (s.hasAttribute("data-preview-image")) {
        let n = s.dataset.previewImage || s.getAttribute("src");
        n && (this.previewImage(n, s.dataset.previewFit), e.preventDefault());
      } else if (s.hasAttribute("data-preview-video")) {
        let n = s.dataset.previewVideo || s.getAttribute("src");
        if (!n) {
          let r = s.querySelector("source");
          r && (n = r.getAttribute("src"));
        }
        n && (this.previewVideo(n, s.dataset.previewFit), e.preventDefault());
      }
    }
  }
  destroy() {
    this.close();
  }
}
const Le = 40;
class Ui {
  constructor(e) {
    this.Reveal = e, this.touchStartX = 0, this.touchStartY = 0, this.touchStartCount = 0, this.touchCaptured = !1, this.onPointerDown = this.onPointerDown.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), this.onTouchStart = this.onTouchStart.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this);
  }
  /**
   *
   */
  bind() {
    let e = this.Reveal.getRevealElement();
    "onpointerdown" in window ? (e.addEventListener("pointerdown", this.onPointerDown, !1), e.addEventListener("pointermove", this.onPointerMove, !1), e.addEventListener("pointerup", this.onPointerUp, !1)) : window.navigator.msPointerEnabled ? (e.addEventListener("MSPointerDown", this.onPointerDown, !1), e.addEventListener("MSPointerMove", this.onPointerMove, !1), e.addEventListener("MSPointerUp", this.onPointerUp, !1)) : (e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1));
  }
  /**
   *
   */
  unbind() {
    let e = this.Reveal.getRevealElement();
    e.removeEventListener("pointerdown", this.onPointerDown, !1), e.removeEventListener("pointermove", this.onPointerMove, !1), e.removeEventListener("pointerup", this.onPointerUp, !1), e.removeEventListener("MSPointerDown", this.onPointerDown, !1), e.removeEventListener("MSPointerMove", this.onPointerMove, !1), e.removeEventListener("MSPointerUp", this.onPointerUp, !1), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1);
  }
  /**
   * Checks if the target element prevents the triggering of
   * swipe navigation.
   */
  isSwipePrevented(e) {
    if (Pe(e, "video[controls], audio[controls]")) return !0;
    for (; e && typeof e.hasAttribute == "function"; ) {
      if (e.hasAttribute("data-prevent-swipe")) return !0;
      e = e.parentNode;
    }
    return !1;
  }
  /**
   * Handler for the 'touchstart' event, enables support for
   * swipe and pinch gestures.
   *
   * @param {object} event
   */
  onTouchStart(e) {
    if (this.touchCaptured = !1, this.isSwipePrevented(e.target)) return !0;
    this.touchStartX = e.touches[0].clientX, this.touchStartY = e.touches[0].clientY, this.touchStartCount = e.touches.length;
  }
  /**
   * Handler for the 'touchmove' event.
   *
   * @param {object} event
   */
  onTouchMove(e) {
    if (this.isSwipePrevented(e.target)) return !0;
    let i = this.Reveal.getConfig();
    if (this.touchCaptured)
      It && e.preventDefault();
    else {
      this.Reveal.onUserInput(e);
      let t = e.touches[0].clientX, s = e.touches[0].clientY;
      if (e.touches.length === 1 && this.touchStartCount !== 2) {
        let n = this.Reveal.availableRoutes({ includeFragments: !0 }), r = t - this.touchStartX, o = s - this.touchStartY;
        r > Le && Math.abs(r) > Math.abs(o) ? (this.touchCaptured = !0, i.navigationMode === "linear" ? i.rtl ? this.Reveal.next() : this.Reveal.prev() : this.Reveal.left()) : r < -Le && Math.abs(r) > Math.abs(o) ? (this.touchCaptured = !0, i.navigationMode === "linear" ? i.rtl ? this.Reveal.prev() : this.Reveal.next() : this.Reveal.right()) : o > Le && n.up ? (this.touchCaptured = !0, i.navigationMode === "linear" ? this.Reveal.prev() : this.Reveal.up()) : o < -Le && n.down && (this.touchCaptured = !0, i.navigationMode === "linear" ? this.Reveal.next() : this.Reveal.down()), i.embedded ? (this.touchCaptured || this.Reveal.isVerticalSlide()) && e.preventDefault() : e.preventDefault();
      }
    }
  }
  /**
   * Handler for the 'touchend' event.
   *
   * @param {object} event
   */
  onTouchEnd(e) {
    this.touchCaptured = !1;
  }
  /**
   * Convert pointer down to touch start.
   *
   * @param {object} event
   */
  onPointerDown(e) {
    (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch") && (e.touches = [{ clientX: e.clientX, clientY: e.clientY }], this.onTouchStart(e));
  }
  /**
   * Convert pointer move to touch move.
   *
   * @param {object} event
   */
  onPointerMove(e) {
    (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch") && (e.touches = [{ clientX: e.clientX, clientY: e.clientY }], this.onTouchMove(e));
  }
  /**
   * Convert pointer up to touch end.
   *
   * @param {object} event
   */
  onPointerUp(e) {
    (e.pointerType === e.MSPOINTER_TYPE_TOUCH || e.pointerType === "touch") && (e.touches = [{ clientX: e.clientX, clientY: e.clientY }], this.onTouchEnd(e));
  }
}
const qe = "focus", Pt = "blur";
class Wi {
  constructor(e) {
    this.Reveal = e, this.onRevealPointerDown = this.onRevealPointerDown.bind(this), this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    e.embedded ? this.blur() : (this.focus(), this.unbind());
  }
  bind() {
    this.Reveal.getConfig().embedded && this.Reveal.getRevealElement().addEventListener("pointerdown", this.onRevealPointerDown, !1);
  }
  unbind() {
    this.Reveal.getRevealElement().removeEventListener("pointerdown", this.onRevealPointerDown, !1), document.removeEventListener("pointerdown", this.onDocumentPointerDown, !1);
  }
  focus() {
    this.state !== qe && (this.Reveal.getRevealElement().classList.add("focused"), document.addEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = qe;
  }
  blur() {
    this.state !== Pt && (this.Reveal.getRevealElement().classList.remove("focused"), document.removeEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = Pt;
  }
  isFocused() {
    return this.state === qe;
  }
  destroy() {
    this.Reveal.getRevealElement().classList.remove("focused");
  }
  onRevealPointerDown(e) {
    this.focus();
  }
  onDocumentPointerDown(e) {
    let i = V(e.target, ".reveal");
    (!i || i !== this.Reveal.getRevealElement()) && this.blur();
  }
}
class ji {
  constructor(e) {
    this.Reveal = e;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "speaker-notes", this.element.setAttribute("data-prevent-swipe", ""), this.element.setAttribute("tabindex", "0"), this.Reveal.getRevealElement().appendChild(this.element);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, i) {
    e.showNotes && this.element.setAttribute("data-layout", typeof e.showNotes == "string" ? e.showNotes : "inline");
  }
  /**
   * Pick up notes from the current slide and display them
   * to the viewer.
   *
   * @see {@link config.showNotes}
   */
  update() {
    this.Reveal.getConfig().showNotes && this.element && this.Reveal.getCurrentSlide() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() && (this.element.innerHTML = this.getSlideNotes() || '<span class="notes-placeholder">No notes on this slide.</span>');
  }
  /**
   * Updates the visibility of the speaker notes sidebar that
   * is used to share annotated slides. The notes sidebar is
   * only visible if showNotes is true and there are notes on
   * one or more slides in the deck.
   */
  updateVisibility() {
    this.Reveal.getConfig().showNotes && this.hasNotes() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() ? this.Reveal.getRevealElement().classList.add("show-notes") : this.Reveal.getRevealElement().classList.remove("show-notes");
  }
  /**
   * Checks if there are speaker notes for ANY slide in the
   * presentation.
   */
  hasNotes() {
    return this.Reveal.getSlidesElement().querySelectorAll("[data-notes], aside.notes").length > 0;
  }
  /**
   * Checks if this presentation is running inside of the
   * speaker notes window.
   *
   * @return {boolean}
   */
  isSpeakerNotesWindow() {
    return !!window.location.search.match(/receiver/gi);
  }
  /**
   * Retrieves the speaker notes from a slide. Notes can be
   * defined in two ways:
   * 1. As a data-notes attribute on the slide <section>
   * 2. With <aside class="notes"> elements inside the slide
   *
   * @param {HTMLElement} [slide=currentSlide]
   * @return {(string|null)}
   */
  getSlideNotes(e = this.Reveal.getCurrentSlide()) {
    if (e.hasAttribute("data-notes"))
      return e.getAttribute("data-notes");
    let i = e.querySelectorAll("aside.notes");
    return i ? Array.from(i).map((t) => t.innerHTML).join(`
`) : null;
  }
  destroy() {
    this.element.remove();
  }
}
class Ki {
  /**
   * @param {HTMLElement} container The component will append
   * itself to this
   * @param {function} progressCheck A method which will be
   * called frequently to get the current playback progress on
   * a range of 0-1
   */
  constructor(e, i) {
    this.diameter = 100, this.diameter2 = this.diameter / 2, this.thickness = 6, this.playing = !1, this.progress = 0, this.progressOffset = 1, this.container = e, this.progressCheck = i, this.canvas = document.createElement("canvas"), this.canvas.className = "playback", this.canvas.width = this.diameter, this.canvas.height = this.diameter, this.canvas.style.width = this.diameter2 + "px", this.canvas.style.height = this.diameter2 + "px", this.context = this.canvas.getContext("2d"), this.container.appendChild(this.canvas), this.render();
  }
  setPlaying(e) {
    const i = this.playing;
    this.playing = e, !i && this.playing ? this.animate() : this.render();
  }
  animate() {
    const e = this.progress;
    this.progress = this.progressCheck(), e > 0.8 && this.progress < 0.2 && (this.progressOffset = this.progress), this.render(), this.playing && requestAnimationFrame(this.animate.bind(this));
  }
  /**
   * Renders the current progress and playback state.
   */
  render() {
    let e = this.playing ? this.progress : 0, i = this.diameter2 - this.thickness, t = this.diameter2, s = this.diameter2, n = 28;
    this.progressOffset += (1 - this.progressOffset) * 0.1;
    const r = -Math.PI / 2 + e * (Math.PI * 2), o = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);
    this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(t, s, i + 4, 0, Math.PI * 2, !1), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(t, s, i, 0, Math.PI * 2, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(t, s, i, o, r, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(t - n / 2, s - n / 2), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, n / 2 - 4, n), this.context.fillRect(n / 2 + 4, 0, n / 2 - 4, n)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(n - 4, n / 2), this.context.lineTo(0, n), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore();
  }
  on(e, i) {
    this.canvas.addEventListener(e, i, !1);
  }
  off(e, i) {
    this.canvas.removeEventListener(e, i, !1);
  }
  destroy() {
    this.playing = !1, this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
}
const _i = {
  width: 960,
  height: 700,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2,
  controls: !0,
  controlsTutorial: !0,
  controlsLayout: "bottom-right",
  controlsBackArrows: "faded",
  progress: !0,
  slideNumber: !1,
  showSlideNumber: "all",
  hashOneBasedIndex: !1,
  hash: !1,
  respondToHashChanges: !0,
  jumpToSlide: !0,
  history: !1,
  keyboard: !0,
  keyboardCondition: null,
  disableLayout: !1,
  overview: !0,
  center: !0,
  touch: !0,
  loop: !1,
  rtl: !1,
  navigationMode: "default",
  shuffle: !1,
  fragments: !0,
  fragmentInURL: !0,
  embedded: !1,
  help: !0,
  pause: !0,
  showNotes: !1,
  showHiddenSlides: !1,
  autoPlayMedia: null,
  preloadIframes: null,
  mouseWheel: !1,
  previewLinks: !1,
  viewDistance: 3,
  mobileViewDistance: 2,
  display: "block",
  hideInactiveCursor: !0,
  hideCursorTime: 5e3,
  sortFragmentsOnSync: !0,
  autoAnimate: !0,
  autoAnimateMatcher: null,
  autoAnimateEasing: "ease",
  autoAnimateDuration: 1,
  autoAnimateUnmatched: !0,
  autoAnimateStyles: [
    "opacity",
    "color",
    "background-color",
    "padding",
    "font-size",
    "line-height",
    "letter-spacing",
    "border-width",
    "border-color",
    "border-radius",
    "outline",
    "outline-offset"
  ],
  autoSlide: 0,
  autoSlideStoppable: !0,
  autoSlideMethod: null,
  defaultTiming: null,
  postMessage: !0,
  postMessageEvents: !1,
  focusBodyOnPageVisibilityChange: !0,
  transition: "slide",
  transitionSpeed: "default",
  backgroundTransition: "fade",
  parallaxBackgroundImage: "",
  parallaxBackgroundSize: "",
  parallaxBackgroundRepeat: "",
  parallaxBackgroundPosition: "",
  parallaxBackgroundHorizontal: null,
  parallaxBackgroundVertical: null,
  view: null,
  scrollLayout: "full",
  scrollSnap: "mandatory",
  scrollProgress: "auto",
  scrollActivationWidth: 435,
  pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,
  pdfSeparateFragments: !0,
  pdfPageHeightOffset: -1,
  dependencies: [],
  plugins: []
}, Nt = "6.0.0";
function Bt(c, e) {
  arguments.length < 2 && (e = arguments[0], c = document.querySelector(".reveal"));
  const i = {};
  let t = {}, s = !1, n = !1, r, o, h, u, g = {
    hasNavigatedHorizontally: !1,
    hasNavigatedVertically: !1
  }, p = [], m = 1, b = { layout: "", overview: "" }, l = {}, R = "idle", M = 0, O, q = 0, ae = -1, z = !1, k = new mi(i), B = new Si(i), U = new Ri(i), W = new Ci(i), L = new ki(i), A = new Ii(i), F = new Mi(i), C = new Ni(i), f = new Bi(i), S = new Hi(i), x = new Di(i), X = new Fi(i), j = new zi(i), ee = new Vi(i), D = new Oi(i), H = new qi(i), re = new Wi(i), xe = new Ui(i), _ = new ji(i);
  function Dt(a) {
    if (!c) throw 'Unable to find presentation root (<div class="reveal">).';
    if (s) throw "Reveal.js has already been initialized.";
    if (s = !0, l.wrapper = c, l.slides = c.querySelector(".slides"), !l.slides) throw 'Unable to find slides container (<div class="slides">).';
    return t = { ..._i, ...t, ...e, ...a, ...At() }, /print-pdf/gi.test(window.location.search) && (t.view = "print"), Ft(), window.addEventListener("load", de, !1), D.load(t.plugins, t.dependencies).then(zt), new Promise((d) => i.on("ready", d));
  }
  function Ft() {
    t.embedded === !0 ? l.viewport = V(c, ".reveal-viewport") || c : (l.viewport = document.body, document.documentElement.classList.add("reveal-full-page")), l.viewport.classList.add("reveal-viewport");
  }
  function zt() {
    s !== !1 && (n = !0, Ot(), qt(), Kt(), Wt(), jt(), ei(), Ke(), L.update(!0), Vt(), x.readURL(), setTimeout(() => {
      l.slides.classList.remove("no-transition"), l.wrapper.classList.add("ready"), K({
        type: "ready",
        data: {
          indexh: r,
          indexv: o,
          currentSlide: u
        }
      });
    }, 1));
  }
  function Vt() {
    const a = t.view === "print", d = t.view === "scroll" || t.view === "reader";
    (a || d) && (a ? ye() : xe.unbind(), l.viewport.classList.add("loading-scroll-mode"), a ? document.readyState === "complete" ? F.activate() : window.addEventListener("load", () => F.activate()) : A.activate());
  }
  function Ot() {
    t.showHiddenSlides || E(l.wrapper, 'section[data-visibility="hidden"]').forEach((a) => {
      const d = a.parentNode;
      d.childElementCount === 1 && /section/i.test(d.nodeName) ? d.remove() : a.remove();
    });
  }
  function qt() {
    l.slides.classList.add("no-transition"), fe ? l.wrapper.classList.add("no-hover") : l.wrapper.classList.remove("no-hover"), L.render(), B.render(), U.render(), X.render(), j.render(), _.render(), l.pauseOverlay = hi(l.wrapper, "div", "pause-overlay", t.controls ? '<button class="resume-button">Resume presentation</button>' : null), l.statusElement = Ut(), l.wrapper.setAttribute("role", "application");
  }
  function Ut() {
    let a = l.wrapper.querySelector(".aria-status");
    return a || (a = document.createElement("div"), a.style.position = "absolute", a.style.height = "1px", a.style.width = "1px", a.style.overflow = "hidden", a.style.clip = "rect( 1px, 1px, 1px, 1px )", a.classList.add("aria-status"), a.setAttribute("aria-live", "polite"), a.setAttribute("aria-atomic", "true"), l.wrapper.appendChild(a)), a;
  }
  function Te(a) {
    l.statusElement.textContent = a;
  }
  function me(a) {
    let d = "";
    if (a.nodeType === 3)
      d += a.textContent;
    else if (a.nodeType === 1) {
      let v = a.getAttribute("aria-hidden"), y = window.getComputedStyle(a).display === "none";
      v !== "true" && !y && Array.from(a.childNodes).forEach((w) => {
        d += me(w);
      });
    }
    return d = d.trim(), d === "" ? "" : d + " ";
  }
  function Wt() {
    setInterval(() => {
      (!A.isActive() && l.wrapper.scrollTop !== 0 || l.wrapper.scrollLeft !== 0) && (l.wrapper.scrollTop = 0, l.wrapper.scrollLeft = 0);
    }, 1e3);
  }
  function jt() {
    document.addEventListener("fullscreenchange", ke), document.addEventListener("webkitfullscreenchange", ke);
  }
  function Kt() {
    t.postMessage && window.addEventListener("message", mt, !1);
  }
  function Ke(a) {
    const d = { ...t };
    if (typeof a == "object" && ue(t, a), i.isReady() === !1) return;
    const v = l.wrapper.querySelectorAll(oe).length;
    l.wrapper.classList.remove(d.transition), l.wrapper.classList.add(t.transition), l.wrapper.setAttribute("data-transition-speed", t.transitionSpeed), l.wrapper.setAttribute("data-background-transition", t.backgroundTransition), l.viewport.style.setProperty("--slide-width", typeof t.width == "string" ? t.width : t.width + "px"), l.viewport.style.setProperty("--slide-height", typeof t.height == "string" ? t.height : t.height + "px"), t.shuffle && Be(), Oe(l.wrapper, "embedded", t.embedded), Oe(l.wrapper, "rtl", t.rtl), Oe(l.wrapper, "center", t.center), t.pause === !1 && pe(), W.reset(), O && (O.destroy(), O = null), v > 1 && t.autoSlide && t.autoSlideStoppable && (O = new Ki(l.wrapper, () => Math.min(Math.max((Date.now() - ae) / M, 0), 1)), O.on("click", oi), z = !1), t.navigationMode !== "default" ? l.wrapper.setAttribute("data-navigation-mode", t.navigationMode) : l.wrapper.removeAttribute("data-navigation-mode"), _.configure(t, d), re.configure(t, d), ee.configure(t, d), X.configure(t, d), j.configure(t, d), S.configure(t, d), C.configure(t, d), B.configure(t, d), at();
  }
  function _e() {
    window.addEventListener("resize", wt, !1), t.touch && xe.bind(), t.keyboard && S.bind(), t.progress && j.bind(), t.respondToHashChanges && x.bind(), X.bind(), re.bind(), l.slides.addEventListener("click", bt, !1), l.slides.addEventListener("transitionend", yt, !1), l.pauseOverlay.addEventListener("click", pe, !1), t.focusBodyOnPageVisibilityChange && document.addEventListener("visibilitychange", Et, !1);
  }
  function ye() {
    xe.unbind(), re.unbind(), S.unbind(), X.unbind(), j.unbind(), x.unbind(), window.removeEventListener("resize", wt, !1), l.slides.removeEventListener("click", bt, !1), l.slides.removeEventListener("transitionend", yt, !1), l.pauseOverlay.removeEventListener("click", pe, !1);
  }
  function _t() {
    s = !1, n !== !1 && (ye(), we(), _.destroy(), re.destroy(), H.destroy(), D.destroy(), ee.destroy(), X.destroy(), j.destroy(), L.destroy(), B.destroy(), U.destroy(), document.removeEventListener("fullscreenchange", ke), document.removeEventListener("webkitfullscreenchange", ke), document.removeEventListener("visibilitychange", Et, !1), window.removeEventListener("message", mt, !1), window.removeEventListener("load", de, !1), l.pauseOverlay && l.pauseOverlay.remove(), l.statusElement && l.statusElement.remove(), document.documentElement.classList.remove("reveal-full-page"), l.wrapper.classList.remove("ready", "center", "has-horizontal-slides", "has-vertical-slides"), l.wrapper.removeAttribute("data-transition-speed"), l.wrapper.removeAttribute("data-background-transition"), l.viewport.classList.remove("reveal-viewport"), l.viewport.style.removeProperty("--slide-width"), l.viewport.style.removeProperty("--slide-height"), l.slides.style.removeProperty("width"), l.slides.style.removeProperty("height"), l.slides.style.removeProperty("zoom"), l.slides.style.removeProperty("left"), l.slides.style.removeProperty("top"), l.slides.style.removeProperty("bottom"), l.slides.style.removeProperty("right"), l.slides.style.removeProperty("transform"), Array.from(l.wrapper.querySelectorAll(oe)).forEach((a) => {
      a.style.removeProperty("display"), a.style.removeProperty("top"), a.removeAttribute("hidden"), a.removeAttribute("aria-hidden");
    }));
  }
  function $e(a, d, v) {
    c.addEventListener(a, d, v);
  }
  function Xe(a, d, v) {
    c.removeEventListener(a, d, v);
  }
  function Ie(a) {
    typeof a.layout == "string" && (b.layout = a.layout), typeof a.overview == "string" && (b.overview = a.overview), b.layout ? se(l.slides, b.layout + " " + b.overview) : se(l.slides, b.overview);
  }
  function K({ target: a = l.wrapper, type: d, data: v, bubbles: y = !0 }) {
    let w = document.createEvent("HTMLEvents", 1, 2);
    return w.initEvent(d, y, !0), ue(w, v), a.dispatchEvent(w), a === l.wrapper && Ge(d), w;
  }
  function Ye(a) {
    K({
      type: "slidechanged",
      data: {
        indexh: r,
        indexv: o,
        previousSlide: h,
        currentSlide: u,
        origin: a
      }
    });
  }
  function Ge(a, d) {
    if (t.postMessageEvents && window.parent !== window.self) {
      let v = {
        namespace: "reveal",
        eventName: a,
        state: pt()
      };
      ue(v, d), window.parent.postMessage(JSON.stringify(v), "*");
    }
  }
  function de() {
    if (l.wrapper && !F.isActive()) {
      const a = l.viewport.offsetWidth, d = l.viewport.offsetHeight;
      if (!t.disableLayout) {
        fe && !t.embedded && document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
        const v = A.isActive() ? be(a, d) : be(), y = m;
        Je(t.width, t.height), l.slides.style.width = v.width + "px", l.slides.style.height = v.height + "px", m = Math.min(v.presentationWidth / v.width, v.presentationHeight / v.height), m = Math.max(m, t.minScale), m = Math.min(m, t.maxScale), m === 1 || A.isActive() ? (l.slides.style.zoom = "", l.slides.style.left = "", l.slides.style.top = "", l.slides.style.bottom = "", l.slides.style.right = "", Ie({ layout: "" })) : (l.slides.style.zoom = "", l.slides.style.left = "50%", l.slides.style.top = "50%", l.slides.style.bottom = "auto", l.slides.style.right = "auto", Ie({ layout: "translate(-50%, -50%) scale(" + m + ")" }));
        const w = Array.from(l.wrapper.querySelectorAll(oe));
        for (let P = 0, T = w.length; P < T; P++) {
          const N = w[P];
          N.style.display !== "none" && (t.center || N.classList.contains("center") ? N.classList.contains("stack") ? N.style.top = 0 : N.style.top = Math.max((v.height - N.scrollHeight) / 2, 0) + "px" : N.style.top = "");
        }
        y !== m && K({
          type: "resize",
          data: {
            oldScale: y,
            scale: m,
            size: v
          }
        });
      }
      $t(), l.viewport.style.setProperty("--slide-scale", m), l.viewport.style.setProperty("--viewport-width", a + "px"), l.viewport.style.setProperty("--viewport-height", d + "px"), A.layout(), j.update(), L.updateParallax(), f.isActive() && f.update();
    }
  }
  function Je(a, d) {
    E(l.slides, "section > .stretch, section > .r-stretch").forEach((v) => {
      let y = ui(v, d);
      if (/(img|video)/gi.test(v.nodeName)) {
        const w = v.naturalWidth || v.videoWidth, P = v.naturalHeight || v.videoHeight, T = Math.min(a / w, y / P);
        v.style.width = w * T + "px", v.style.height = P * T + "px";
      } else
        v.style.width = a + "px", v.style.height = y + "px";
    });
  }
  function $t() {
    if (l.wrapper && !t.disableLayout && !F.isActive() && typeof t.scrollActivationWidth == "number" && t.view !== "scroll") {
      const a = be();
      a.presentationWidth > 0 && a.presentationWidth <= t.scrollActivationWidth ? A.isActive() || (L.create(), A.activate()) : A.isActive() && A.deactivate();
    }
  }
  function be(a, d) {
    let v = t.width, y = t.height;
    t.disableLayout && (v = l.slides.offsetWidth, y = l.slides.offsetHeight);
    const w = {
      // Slide size
      width: v,
      height: y,
      // Presentation size
      presentationWidth: a || l.wrapper.offsetWidth,
      presentationHeight: d || l.wrapper.offsetHeight
    };
    return w.presentationWidth -= w.presentationWidth * t.margin, w.presentationHeight -= w.presentationHeight * t.margin, typeof w.width == "string" && /%$/.test(w.width) && (w.width = parseInt(w.width, 10) / 100 * w.presentationWidth), typeof w.height == "string" && /%$/.test(w.height) && (w.height = parseInt(w.height, 10) / 100 * w.presentationHeight), w;
  }
  function Qe(a, d) {
    typeof a == "object" && typeof a.setAttribute == "function" && a.setAttribute("data-previous-indexv", d || 0);
  }
  function Ze(a) {
    if (typeof a == "object" && typeof a.setAttribute == "function" && a.classList.contains("stack")) {
      const d = a.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
      return parseInt(a.getAttribute(d) || 0, 10);
    }
    return 0;
  }
  function ge(a = u) {
    return a && a.parentNode && !!a.parentNode.nodeName.match(/section/i);
  }
  function Xt(a = u) {
    return a.classList.contains(".stack") || a.querySelector("section") !== null;
  }
  function et() {
    return u && ge(u) ? !u.nextElementSibling : !1;
  }
  function tt() {
    return r === 0 && o === 0;
  }
  function Me() {
    return u ? !(u.nextElementSibling || ge(u) && u.parentNode.nextElementSibling) : !1;
  }
  function it() {
    if (t.pause) {
      const a = l.wrapper.classList.contains("paused");
      we(), l.wrapper.classList.add("paused"), a === !1 && K({ type: "paused" });
    }
  }
  function pe() {
    const a = l.wrapper.classList.contains("paused");
    l.wrapper.classList.remove("paused"), ce(), a && K({ type: "resumed" });
  }
  function st(a) {
    typeof a == "boolean" ? a ? it() : pe() : ve() ? pe() : it();
  }
  function ve() {
    return l.wrapper.classList.contains("paused");
  }
  function Yt(a) {
    typeof a == "boolean" ? a ? U.show() : U.hide() : U.isVisible() ? U.hide() : U.show();
  }
  function Gt(a) {
    typeof a == "boolean" ? a ? Se() : Ee() : z ? Se() : Ee();
  }
  function Jt() {
    return !!(M && !z);
  }
  function Y(a, d, v, y) {
    if (K({
      type: "beforeslidechange",
      data: {
        indexh: a === void 0 ? r : a,
        indexv: d === void 0 ? o : d,
        origin: y
      }
    }).defaultPrevented) return;
    h = u;
    const P = l.wrapper.querySelectorAll(ie);
    if (A.isActive()) {
      const J = A.getSlideByIndices(a, d);
      J && A.scrollToSlide(J);
      return;
    }
    if (P.length === 0) return;
    d === void 0 && !f.isActive() && (d = Ze(P[a])), h && h.parentNode && h.parentNode.classList.contains("stack") && Qe(h.parentNode, o);
    const T = p.concat();
    p.length = 0;
    let N = r || 0, ne = o || 0;
    r = rt(ie, a === void 0 ? r : a), o = rt(kt, d === void 0 ? o : d);
    let G = r !== N || o !== ne;
    G || (h = null);
    let $ = P[r], I = $.querySelectorAll("section");
    c.classList.toggle("is-vertical-slide", I.length > 1), u = I[o] || $;
    let Z = !1;
    G && h && u && !f.isActive() && (R = "running", Z = Ne(h, u, N, ne), Z && l.slides.classList.add("disable-slide-transitions")), He(), de(), f.isActive() && f.update(), typeof v < "u" && C.goto(v), h && h !== u && (h.classList.remove("present"), h.setAttribute("aria-hidden", "true"), tt() && setTimeout(() => {
      ii().forEach((J) => {
        Qe(J, 0);
      });
    }, 0));
    e: for (let J = 0, li = p.length; J < li; J++) {
      for (let Ce = 0; Ce < T.length; Ce++)
        if (T[Ce] === p[J]) {
          T.splice(Ce, 1);
          continue e;
        }
      l.viewport.classList.add(p[J]), K({ type: p[J] });
    }
    for (; T.length; )
      l.viewport.classList.remove(T.pop());
    G && Ye(y), (G || !h) && (k.stopEmbeddedContent(h), k.startEmbeddedContent(u)), requestAnimationFrame(() => {
      Te(me(u));
    }), j.update(), X.update(), _.update(), L.update(), L.updateParallax(), B.update(), C.update(), x.writeURL(), ce(), Z && (setTimeout(() => {
      l.slides.classList.remove("disable-slide-transitions");
    }, 0), t.autoAnimate && W.run(h, u));
  }
  function Ne(a, d, v, y) {
    return a.hasAttribute("data-auto-animate") && d.hasAttribute("data-auto-animate") && a.getAttribute("data-auto-animate-id") === d.getAttribute("data-auto-animate-id") && !(r > v || o > y ? d : a).hasAttribute("data-auto-animate-restart");
  }
  function Qt(a, d, v) {
    let y = r || 0;
    r = d, o = v;
    const w = u !== a;
    h = u, u = a, u && h && t.autoAnimate && Ne(h, u, y, o) && W.run(h, u), w && (h && (k.stopEmbeddedContent(h), k.stopEmbeddedContent(h.slideBackgroundElement)), k.startEmbeddedContent(u), k.startEmbeddedContent(u.slideBackgroundElement)), requestAnimationFrame(() => {
      Te(me(u));
    }), Ye();
  }
  function at() {
    ye(), _e(), de(), M = t.autoSlide, ce(), L.create(), x.writeURL(), t.sortFragmentsOnSync === !0 && C.sortAll(), X.update(), j.update(), He(), _.update(), _.updateVisibility(), H.update(), L.update(!0), B.update(), k.formatEmbeddedContent(), t.autoPlayMedia === !1 ? k.stopEmbeddedContent(u, { unloadIframes: !1 }) : k.startEmbeddedContent(u), f.isActive() && f.layout();
  }
  function Zt(a = u) {
    L.sync(a), C.sync(a), k.load(a), L.update(), _.update();
  }
  function ei() {
    te().forEach((a) => {
      E(a, "section").forEach((d, v) => {
        v > 0 && (d.classList.remove("present"), d.classList.remove("past"), d.classList.add("future"), d.setAttribute("aria-hidden", "true"));
      });
    });
  }
  function Be(a = te()) {
    a.forEach((d, v) => {
      let y = a[Math.floor(Math.random() * a.length)];
      y.parentNode === d.parentNode && d.parentNode.insertBefore(d, y);
      let w = d.querySelectorAll("section");
      w.length && Be(w);
    });
  }
  function rt(a, d) {
    let v = E(l.wrapper, a), y = v.length, w = A.isActive() || F.isActive(), P = !1, T = !1;
    if (y) {
      t.loop && (d >= y && (P = !0), d %= y, d < 0 && (d = y + d, T = !0)), d = Math.max(Math.min(d, y - 1), 0);
      for (let $ = 0; $ < y; $++) {
        let I = v[$], Z = t.rtl && !ge(I);
        if (I.classList.remove("past"), I.classList.remove("present"), I.classList.remove("future"), I.setAttribute("hidden", ""), I.setAttribute("aria-hidden", "true"), I.querySelector("section") && I.classList.add("stack"), w) {
          I.classList.add("present");
          continue;
        }
        $ < d ? (I.classList.add(Z ? "future" : "past"), t.fragments && nt(I)) : $ > d ? (I.classList.add(Z ? "past" : "future"), t.fragments && ot(I)) : $ === d && t.fragments && (P ? ot(I) : T && nt(I));
      }
      let N = v[d], ne = N.classList.contains("present");
      N.classList.add("present"), N.removeAttribute("hidden"), N.removeAttribute("aria-hidden"), ne || K({
        target: N,
        type: "visible",
        bubbles: !1
      });
      let G = N.getAttribute("data-state");
      G && (p = p.concat(G.split(" ")));
    } else
      d = 0;
    return d;
  }
  function nt(a) {
    E(a, ".fragment").forEach((d) => {
      d.classList.add("visible"), d.classList.remove("current-fragment");
    });
  }
  function ot(a) {
    E(a, ".fragment.visible").forEach((d) => {
      d.classList.remove("visible", "current-fragment");
    });
  }
  function He() {
    let a = te(), d = a.length, v, y;
    if (d && typeof r < "u") {
      const w = f.isActive();
      let P = w ? 10 : t.viewDistance;
      fe && (P = w ? 6 : t.mobileViewDistance), F.isActive() && (P = Number.MAX_VALUE);
      for (let T = 0; T < d; T++) {
        let N = a[T], ne = E(N, "section"), G = ne.length;
        if (v = Math.abs((r || 0) - T) || 0, t.loop && (v = Math.abs(((r || 0) - T) % (d - P)) || 0), v < P ? k.load(N) : k.unload(N), G) {
          let $ = w ? 0 : Ze(N);
          for (let I = 0; I < G; I++) {
            let Z = ne[I];
            y = Math.abs(T === (r || 0) ? (o || 0) - I : I - $), v + y < P ? k.load(Z) : k.unload(Z);
          }
        }
      }
      ut() ? l.wrapper.classList.add("has-vertical-slides") : l.wrapper.classList.remove("has-vertical-slides"), ht() ? l.wrapper.classList.add("has-horizontal-slides") : l.wrapper.classList.remove("has-horizontal-slides");
    }
  }
  function Q({ includeFragments: a = !1 } = {}) {
    let d = l.wrapper.querySelectorAll(ie), v = l.wrapper.querySelectorAll(kt), y = {
      left: r > 0,
      right: r < d.length - 1,
      up: o > 0,
      down: o < v.length - 1
    };
    if (t.loop && (d.length > 1 && (y.left = !0, y.right = !0), v.length > 1 && (y.up = !0, y.down = !0)), d.length > 1 && t.navigationMode === "linear" && (y.right = y.right || y.down, y.left = y.left || y.up), a === !0) {
      let w = C.availableRoutes();
      y.left = y.left || w.prev, y.up = y.up || w.prev, y.down = y.down || w.next, y.right = y.right || w.next;
    }
    if (t.rtl) {
      let w = y.left;
      y.left = y.right, y.right = w;
    }
    return y;
  }
  function lt(a = u) {
    let d = te(), v = 0;
    e: for (let y = 0; y < d.length; y++) {
      let w = d[y], P = w.querySelectorAll("section");
      for (let T = 0; T < P.length; T++) {
        if (P[T] === a)
          break e;
        P[T].dataset.visibility !== "uncounted" && v++;
      }
      if (w === a)
        break;
      w.classList.contains("stack") === !1 && w.dataset.visibility !== "uncounted" && v++;
    }
    return v;
  }
  function ti() {
    let a = ft(), d = lt();
    if (u) {
      let v = u.querySelectorAll(".fragment");
      if (v.length > 0) {
        let y = u.querySelectorAll(".fragment.visible");
        d += y.length / v.length * 0.9;
      }
    }
    return Math.min(d / (a - 1), 1);
  }
  function dt(a) {
    let d = r, v = o, y;
    if (a)
      if (A.isActive())
        d = parseInt(a.getAttribute("data-index-h"), 10), a.getAttribute("data-index-v") && (v = parseInt(a.getAttribute("data-index-v"), 10));
      else {
        let w = ge(a), P = w ? a.parentNode : a, T = te();
        d = Math.max(T.indexOf(P), 0), v = void 0, w && (v = Math.max(E(a.parentNode, "section").indexOf(a), 0));
      }
    if (!a && u && u.querySelectorAll(".fragment").length > 0) {
      let P = u.querySelector(".current-fragment");
      P && P.hasAttribute("data-fragment-index") ? y = parseInt(P.getAttribute("data-fragment-index"), 10) : y = u.querySelectorAll(".fragment.visible").length - 1;
    }
    return { h: d, v, f: y };
  }
  function De() {
    return E(l.wrapper, oe + ':not(.stack):not([data-visibility="uncounted"])');
  }
  function te() {
    return E(l.wrapper, ie);
  }
  function ct() {
    return E(l.wrapper, ".slides>section>section");
  }
  function ii() {
    return E(l.wrapper, ie + ".stack");
  }
  function ht() {
    return te().length > 1;
  }
  function ut() {
    return ct().length > 1;
  }
  function si() {
    return De().map((a) => {
      let d = {};
      for (let v = 0; v < a.attributes.length; v++) {
        let y = a.attributes[v];
        d[y.name] = y.value;
      }
      return d;
    });
  }
  function ft() {
    return De().length;
  }
  function gt(a, d) {
    let v = te()[a], y = v && v.querySelectorAll("section");
    return y && y.length && typeof d == "number" ? y ? y[d] : void 0 : v;
  }
  function ai(a, d) {
    let v = typeof a == "number" ? gt(a, d) : a;
    if (v)
      return v.slideBackgroundElement;
  }
  function pt() {
    let a = dt();
    return {
      indexh: a.h,
      indexv: a.v,
      indexf: a.f,
      paused: ve(),
      overview: f.isActive(),
      ...H.getState()
    };
  }
  function ri(a) {
    if (typeof a == "object") {
      Y(he(a.indexh), he(a.indexv), he(a.indexf));
      let d = he(a.paused), v = he(a.overview);
      typeof d == "boolean" && d !== ve() && st(d), typeof v == "boolean" && v !== f.isActive() && f.toggle(v), H.setState(a);
    }
  }
  function ce() {
    if (we(), u && t.autoSlide !== !1) {
      let a = u.querySelector(".current-fragment[data-autoslide]"), d = a ? a.getAttribute("data-autoslide") : null, v = u.parentNode ? u.parentNode.getAttribute("data-autoslide") : null, y = u.getAttribute("data-autoslide");
      d ? M = parseInt(d, 10) : y ? M = parseInt(y, 10) : v ? M = parseInt(v, 10) : (M = t.autoSlide, u.querySelectorAll(".fragment").length === 0 && E(u, "video, audio").forEach((w) => {
        w.hasAttribute("data-autoplay") && M && w.duration * 1e3 / w.playbackRate > M && (M = w.duration * 1e3 / w.playbackRate + 1e3);
      })), M && !z && !ve() && !f.isActive() && (!Me() || C.availableRoutes().next || t.loop === !0) && (q = setTimeout(() => {
        typeof t.autoSlideMethod == "function" ? t.autoSlideMethod() : Ve(), ce();
      }, M), ae = Date.now()), O && O.setPlaying(q !== -1);
    }
  }
  function we() {
    clearTimeout(q), q = -1;
  }
  function Ee() {
    M && !z && (z = !0, K({ type: "autoslidepaused" }), clearTimeout(q), O && O.setPlaying(!1));
  }
  function Se() {
    M && z && (z = !1, K({ type: "autoslideresumed" }), ce());
  }
  function Re({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, A.isActive()) return A.prev();
    t.rtl ? (f.isActive() || a || C.next() === !1) && Q().left && Y(r + 1, t.navigationMode === "grid" ? o : void 0) : (f.isActive() || a || C.prev() === !1) && Q().left && Y(r - 1, t.navigationMode === "grid" ? o : void 0);
  }
  function Ae({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, A.isActive()) return A.next();
    t.rtl ? (f.isActive() || a || C.prev() === !1) && Q().right && Y(r - 1, t.navigationMode === "grid" ? o : void 0) : (f.isActive() || a || C.next() === !1) && Q().right && Y(r + 1, t.navigationMode === "grid" ? o : void 0);
  }
  function Fe({ skipFragments: a = !1 } = {}) {
    if (A.isActive()) return A.prev();
    (f.isActive() || a || C.prev() === !1) && Q().up && Y(r, o - 1);
  }
  function ze({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedVertically = !0, A.isActive()) return A.next();
    (f.isActive() || a || C.next() === !1) && Q().down && Y(r, o + 1);
  }
  function vt({ skipFragments: a = !1 } = {}) {
    if (A.isActive()) return A.prev();
    if (a || C.prev() === !1)
      if (Q().up)
        Fe({ skipFragments: a });
      else {
        let d;
        if (t.rtl ? d = E(l.wrapper, ie + ".future").pop() : d = E(l.wrapper, ie + ".past").pop(), d && d.classList.contains("stack")) {
          let v = d.querySelectorAll("section").length - 1 || void 0, y = r - 1;
          Y(y, v);
        } else t.rtl ? Ae({ skipFragments: a }) : Re({ skipFragments: a });
      }
  }
  function Ve({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, g.hasNavigatedVertically = !0, A.isActive()) return A.next();
    if (a || C.next() === !1) {
      let d = Q();
      d.down && d.right && t.loop && et() && (d.down = !1), d.down ? ze({ skipFragments: a }) : t.rtl ? Re({ skipFragments: a }) : Ae({ skipFragments: a });
    }
  }
  function ni(a) {
    t.autoSlideStoppable && Ee();
  }
  function mt(a) {
    let d = a.data;
    if (typeof d == "string" && d.charAt(0) === "{" && d.charAt(d.length - 1) === "}" && (d = JSON.parse(d), d.method && typeof i[d.method] == "function"))
      if (bi.test(d.method) === !1) {
        const v = i[d.method].apply(i, d.args);
        Ge("callback", { method: d.method, result: v });
      } else
        console.warn('reveal.js: "' + d.method + '" is is blacklisted from the postMessage API');
  }
  function yt(a) {
    R === "running" && /section/gi.test(a.target.nodeName) && (R = "idle", K({
      type: "slidetransitionend",
      data: { indexh: r, indexv: o, previousSlide: h, currentSlide: u }
    }));
  }
  function bt(a) {
    const d = V(a.target, 'a[href^="#"]');
    if (d) {
      const v = d.getAttribute("href"), y = x.getIndicesFromHash(v);
      y && (i.slide(y.h, y.v, y.f), a.preventDefault());
    }
  }
  function wt(a) {
    de();
  }
  function Et(a) {
    document.hidden === !1 && document.activeElement !== document.body && (typeof document.activeElement.blur == "function" && document.activeElement.blur(), document.body.focus());
  }
  function ke(a) {
    (document.fullscreenElement || document.webkitFullscreenElement) === l.wrapper && (a.stopImmediatePropagation(), setTimeout(() => {
      i.layout(), i.focus.focus();
    }, 1));
  }
  function oi(a) {
    Me() && t.loop === !1 ? (Y(0, 0), Se()) : z ? Se() : Ee();
  }
  const St = {
    VERSION: Nt,
    initialize: Dt,
    configure: Ke,
    destroy: _t,
    sync: at,
    syncSlide: Zt,
    syncFragments: C.sync.bind(C),
    // Navigation methods
    slide: Y,
    left: Re,
    right: Ae,
    up: Fe,
    down: ze,
    prev: vt,
    next: Ve,
    // Navigation aliases
    navigateLeft: Re,
    navigateRight: Ae,
    navigateUp: Fe,
    navigateDown: ze,
    navigatePrev: vt,
    navigateNext: Ve,
    // Fragment methods
    navigateFragment: C.goto.bind(C),
    prevFragment: C.prev.bind(C),
    nextFragment: C.next.bind(C),
    // Event binding
    on: $e,
    off: Xe,
    // Legacy event binding methods left in for backwards compatibility
    addEventListener: $e,
    removeEventListener: Xe,
    // Forces an update in slide layout
    layout: de,
    // Randomizes the order of slides
    shuffle: Be,
    // Returns an object with the available routes as booleans (left/right/top/bottom)
    availableRoutes: Q,
    // Returns an object with the available fragments as booleans (prev/next)
    availableFragments: C.availableRoutes.bind(C),
    // Toggles a help overlay with keyboard shortcuts
    toggleHelp: H.toggleHelp.bind(H),
    // Toggles the overview mode on/off
    toggleOverview: f.toggle.bind(f),
    // Toggles the scroll view on/off
    toggleScrollView: A.toggle.bind(A),
    // Toggles the "black screen" mode on/off
    togglePause: st,
    // Toggles the auto slide mode on/off
    toggleAutoSlide: Gt,
    // Toggles visibility of the jump-to-slide UI
    toggleJumpToSlide: Yt,
    // Slide navigation checks
    isFirstSlide: tt,
    isLastSlide: Me,
    isLastVerticalSlide: et,
    isVerticalSlide: ge,
    isVerticalStack: Xt,
    // State checks
    isPaused: ve,
    isAutoSliding: Jt,
    isSpeakerNotes: _.isSpeakerNotesWindow.bind(_),
    isOverview: f.isActive.bind(f),
    isFocused: re.isFocused.bind(re),
    isOverlayOpen: H.isOpen.bind(H),
    isScrollView: A.isActive.bind(A),
    isPrintView: F.isActive.bind(F),
    // Checks if reveal.js has been loaded and is ready for use
    isReady: () => n,
    // Slide preloading
    loadSlide: k.load.bind(k),
    unloadSlide: k.unload.bind(k),
    // Start/stop all media inside of the current slide
    startEmbeddedContent: () => k.startEmbeddedContent(u),
    stopEmbeddedContent: () => k.stopEmbeddedContent(u, { unloadIframes: !1 }),
    // Lightbox previews
    previewIframe: H.previewIframe.bind(H),
    previewImage: H.previewImage.bind(H),
    previewVideo: H.previewVideo.bind(H),
    showPreview: H.previewIframe.bind(H),
    // deprecated in favor of showIframeLightbox
    hidePreview: H.close.bind(H),
    // Adds or removes all internal event listeners
    addEventListeners: _e,
    removeEventListeners: ye,
    dispatchEvent: K,
    // Facility for persisting and restoring the presentation state
    getState: pt,
    setState: ri,
    // Presentation progress on range of 0-1
    getProgress: ti,
    // Returns the indices of the current, or specified, slide
    getIndices: dt,
    // Returns an Array of key:value maps of the attributes of each
    // slide in the deck
    getSlidesAttributes: si,
    // Returns the number of slides that we have passed
    getSlidePastCount: lt,
    // Returns the total number of slides
    getTotalSlides: ft,
    // Returns the slide element at the specified index
    getSlide: gt,
    // Returns the previous slide element, may be null
    getPreviousSlide: () => h,
    // Returns the current slide element
    getCurrentSlide: () => u,
    // Returns the slide background element at the specified index
    getSlideBackground: ai,
    // Returns the speaker notes string for a slide, or null
    getSlideNotes: _.getSlideNotes.bind(_),
    // Returns an Array of all slides
    getSlides: De,
    // Returns an array with all horizontal/vertical slides in the deck
    getHorizontalSlides: te,
    getVerticalSlides: ct,
    // Checks if the presentation contains two or more horizontal
    // and vertical slides
    hasHorizontalSlides: ht,
    hasVerticalSlides: ut,
    // Checks if the deck has navigated on either axis at least once
    hasNavigatedHorizontally: () => g.hasNavigatedHorizontally,
    hasNavigatedVertically: () => g.hasNavigatedVertically,
    shouldAutoAnimateBetween: Ne,
    // Adds/removes a custom key binding
    addKeyBinding: S.addKeyBinding.bind(S),
    removeKeyBinding: S.removeKeyBinding.bind(S),
    // Programmatically triggers a keyboard event
    triggerKey: S.triggerKey.bind(S),
    // Registers a new shortcut to include in the help overlay
    registerKeyboardShortcut: S.registerKeyboardShortcut.bind(S),
    getComputedSlideSize: be,
    setCurrentScrollPage: Qt,
    // Returns the current scale of the presentation content
    getScale: () => m,
    // Returns the current configuration object
    getConfig: () => t,
    // Helper method, retrieves query string as a key:value map
    getQueryHash: At,
    // Returns the path to the current slide as represented in the URL
    getSlidePath: x.getHash.bind(x),
    // Returns reveal.js DOM elements
    getRevealElement: () => c,
    getSlidesElement: () => l.slides,
    getViewportElement: () => l.viewport,
    getBackgroundsElement: () => L.element,
    // API for registering and retrieving plugins
    registerPlugin: D.registerPlugin.bind(D),
    hasPlugin: D.hasPlugin.bind(D),
    getPlugin: D.getPlugin.bind(D),
    getPlugins: D.getRegisteredPlugins.bind(D)
  };
  return ue(i, {
    ...St,
    // Methods for announcing content to screen readers
    announceStatus: Te,
    getStatusText: me,
    // Controllers
    focus: re,
    scroll: A,
    progress: j,
    controls: X,
    location: x,
    overview: f,
    keyboard: S,
    fragments: C,
    backgrounds: L,
    slideContent: k,
    slideNumber: B,
    onUserInput: ni,
    closeOverlay: H.close.bind(H),
    updateSlidesVisibility: He,
    layoutSlideContents: Je,
    transformSlides: Ie,
    cueAutoSlide: ce,
    cancelAutoSlide: we
  }), St;
}
const le = Bt, Ht = [];
le.initialize = (c) => (Object.assign(le, new Bt(document.querySelector(".reveal"), c)), Ht.map((e) => e(le)), le.initialize());
["configure", "on", "off", "addEventListener", "removeEventListener", "registerPlugin"].forEach(
  (c) => {
    le[c] = (...e) => {
      Ht.push((i) => i[c].call(null, ...e));
    };
  }
);
le.isReady = () => !1;
le.VERSION = Nt;
export {
  le as default
};
