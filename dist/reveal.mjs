var di = Object.defineProperty;
var ci = (h, e, i) => e in h ? di(h, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : h[e] = i;
var At = (h, e, i) => ci(h, typeof e != "symbol" ? e + "" : e, i);
const ue = (h, e) => {
  for (let i in e)
    h[i] = e[i];
  return h;
}, E = (h, e) => Array.from(h.querySelectorAll(e)), Ve = (h, e, i) => {
  i ? h.classList.add(e) : h.classList.remove(e);
}, he = (h) => {
  if (typeof h == "string") {
    if (h === "null") return null;
    if (h === "true") return !0;
    if (h === "false") return !1;
    if (h.match(/^-?[\d\.]+$/)) return parseFloat(h);
  }
  return h;
}, ie = (h, e) => {
  h.style.transform = e;
}, Pe = (h, e) => {
  let i = h.matches || h.matchesSelector || h.msMatchesSelector;
  return !!(i && i.call(h, e));
}, O = (h, e) => {
  if (typeof h.closest == "function")
    return h.closest(e);
  for (; h; ) {
    if (Pe(h, e))
      return h;
    h = h.parentNode;
  }
  return null;
}, xt = (h) => {
  h = h || document.documentElement;
  let e = h.requestFullscreen || h.webkitRequestFullscreen || h.webkitRequestFullScreen || h.mozRequestFullScreen || h.msRequestFullscreen;
  e && e.apply(h);
}, hi = (h, e, i, t = "") => {
  let s = h.querySelectorAll("." + i);
  for (let a = 0; a < s.length; a++) {
    let o = s[a];
    if (o.parentNode === h)
      return o;
  }
  let r = document.createElement(e);
  return r.className = i, r.innerHTML = t, h.appendChild(r), r;
}, Ue = (h) => {
  let e = document.createElement("style");
  return e.type = "text/css", h && h.length > 0 && (e.styleSheet ? e.styleSheet.cssText = h : e.appendChild(document.createTextNode(h))), document.head.appendChild(e), e;
}, Rt = () => {
  let h = {};
  location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (e) => {
    h[e.split("=").shift()] = e.split("=").pop();
  });
  for (let e in h) {
    let i = h[e];
    h[e] = he(unescape(i));
  }
  return typeof h.dependencies < "u" && delete h.dependencies, h;
}, ui = (h, e = 0) => {
  if (h) {
    let i, t = h.style.height;
    return h.style.height = "0px", h.parentNode.style.height = "auto", i = e - h.parentNode.offsetHeight, h.style.height = t + "px", h.parentNode.style.removeProperty("height"), i;
  }
  return e;
}, fi = {
  mp4: "video/mp4",
  m4a: "video/mp4",
  ogv: "video/ogg",
  mpeg: "video/mpeg",
  webm: "video/webm"
}, gi = (h = "") => fi[h.split(".").pop()], pi = (h = "") => encodeURI(h).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(
  /[!'()*]/g,
  (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
), Tt = navigator.userAgent, fe = /(iphone|ipod|ipad|android)/gi.test(Tt) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, It = /android/gi.test(Tt);
var vi = function(h) {
  if (h) {
    var e = function(u) {
      return [].slice.call(u);
    }, i = 0, t = 1, s = 2, r = 3, a = [], o = null, c = "requestAnimationFrame" in h ? function() {
      var u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { sync: !1 };
      h.cancelAnimationFrame(o);
      var S = function() {
        return g(a.filter(function(x) {
          return x.dirty && x.active;
        }));
      };
      if (u.sync) return S();
      o = h.requestAnimationFrame(S);
    } : function() {
    }, f = function(u) {
      return function(S) {
        a.forEach(function(x) {
          return x.dirty = u;
        }), c(S);
      };
    }, g = function(u) {
      u.filter(function(x) {
        return !x.styleComputed;
      }).forEach(function(x) {
        x.styleComputed = l(x);
      }), u.filter(A).forEach(I);
      var S = u.filter(w);
      S.forEach(y), S.forEach(function(x) {
        I(x), p(x);
      }), S.forEach(V);
    }, p = function(u) {
      return u.dirty = i;
    }, y = function(u) {
      u.availableWidth = u.element.parentNode.clientWidth, u.currentWidth = u.element.scrollWidth, u.previousFontSize = u.currentFontSize, u.currentFontSize = Math.min(Math.max(u.minSize, u.availableWidth / u.currentWidth * u.previousFontSize), u.maxSize), u.whiteSpace = u.multiLine && u.currentFontSize === u.minSize ? "normal" : "nowrap";
    }, w = function(u) {
      return u.dirty !== s || u.dirty === s && u.element.parentNode.clientWidth !== u.availableWidth;
    }, l = function(u) {
      var S = h.getComputedStyle(u.element, null);
      return u.currentFontSize = parseFloat(S.getPropertyValue("font-size")), u.display = S.getPropertyValue("display"), u.whiteSpace = S.getPropertyValue("white-space"), !0;
    }, A = function(u) {
      var S = !1;
      return !u.preStyleTestCompleted && (/inline-/.test(u.display) || (S = !0, u.display = "inline-block"), u.whiteSpace !== "nowrap" && (S = !0, u.whiteSpace = "nowrap"), u.preStyleTestCompleted = !0, S);
    }, I = function(u) {
      u.element.style.whiteSpace = u.whiteSpace, u.element.style.display = u.display, u.element.style.fontSize = u.currentFontSize + "px";
    }, V = function(u) {
      u.element.dispatchEvent(new CustomEvent("fit", { detail: { oldValue: u.previousFontSize, newValue: u.currentFontSize, scaleFactor: u.currentFontSize / u.previousFontSize } }));
    }, q = function(u, S) {
      return function(x) {
        u.dirty = S, u.active && c(x);
      };
    }, se = function(u) {
      return function() {
        a = a.filter(function(S) {
          return S.element !== u.element;
        }), u.observeMutations && u.observer.disconnect(), u.element.style.whiteSpace = u.originalStyle.whiteSpace, u.element.style.display = u.originalStyle.display, u.element.style.fontSize = u.originalStyle.fontSize;
      };
    }, z = function(u) {
      return function() {
        u.active || (u.active = !0, c());
      };
    }, k = function(u) {
      return function() {
        return u.active = !1;
      };
    }, M = function(u) {
      u.observeMutations && (u.observer = new MutationObserver(q(u, t)), u.observer.observe(u.element, u.observeMutations));
    }, W = { minSize: 16, maxSize: 512, multiLine: !0, observeMutations: "MutationObserver" in h && { subtree: !0, childList: !0, characterData: !0 } }, j = null, P = function() {
      h.clearTimeout(j), j = h.setTimeout(f(s), C.observeWindowDelay);
    }, R = ["resize", "orientationchange"];
    return Object.defineProperty(C, "observeWindow", { set: function(u) {
      var S = "".concat(u ? "add" : "remove", "EventListener");
      R.forEach(function(x) {
        h[S](x, P);
      });
    } }), C.observeWindow = !0, C.observeWindowDelay = 100, C.fitAll = f(r), C;
  }
  function D(u, S) {
    var x = Object.assign({}, W, S), X = u.map(function(K) {
      var Z = Object.assign({}, x, { element: K, active: !0 });
      return function(H) {
        H.originalStyle = { whiteSpace: H.element.style.whiteSpace, display: H.element.style.display, fontSize: H.element.style.fontSize }, M(H), H.newbie = !0, H.dirty = !0, a.push(H);
      }(Z), { element: K, fit: q(Z, r), unfreeze: z(Z), freeze: k(Z), unsubscribe: se(Z) };
    });
    return c(), X;
  }
  function C(u) {
    var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return typeof u == "string" ? D(e(document.querySelectorAll(u)), S) : D([u], S)[0];
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
      let r = 0;
      E(s, "source[data-src]").forEach((a) => {
        a.setAttribute("src", a.getAttribute("data-src")), a.removeAttribute("data-src"), a.setAttribute("data-lazy-loaded", ""), r += 1;
      }), fe && s.tagName === "VIDEO" && s.setAttribute("playsinline", ""), r > 0 && s.load();
    });
    let t = e.slideBackgroundElement;
    if (t) {
      t.style.display = "block";
      let s = e.slideBackgroundContentElement, r = e.getAttribute("data-background-iframe");
      if (t.hasAttribute("data-loaded") === !1) {
        t.setAttribute("data-loaded", "true");
        let o = e.getAttribute("data-background-image"), c = e.getAttribute("data-background-video"), f = e.hasAttribute("data-background-video-loop"), g = e.hasAttribute("data-background-video-muted");
        if (o)
          /^data:/.test(o.trim()) ? s.style.backgroundImage = `url(${o.trim()})` : s.style.backgroundImage = o.split(",").map((p) => {
            let y = decodeURI(p.trim());
            return `url(${pi(y)})`;
          }).join(",");
        else if (c) {
          let p = document.createElement("video");
          f && p.setAttribute("loop", ""), (g || this.Reveal.isSpeakerNotes()) && (p.muted = !0), fe && (p.muted = !0, p.setAttribute("playsinline", "")), c.split(",").forEach((y) => {
            const w = document.createElement("source");
            w.setAttribute("src", y);
            let l = gi(y);
            l && w.setAttribute("type", l), p.appendChild(w);
          }), s.appendChild(p);
        } else if (r && i.excludeIframes !== !0) {
          let p = document.createElement("iframe");
          p.setAttribute("allowfullscreen", ""), p.setAttribute("mozallowfullscreen", ""), p.setAttribute("webkitallowfullscreen", ""), p.setAttribute("allow", "autoplay"), p.setAttribute("data-src", r), p.style.width = "100%", p.style.height = "100%", p.style.maxHeight = "100%", p.style.maxWidth = "100%", s.appendChild(p);
        }
      }
      let a = s.querySelector("iframe[data-src]");
      a && this.shouldPreload(t) && !/autoplay=(1|true|yes)/gi.test(r) && a.getAttribute("src") !== r && a.setAttribute("src", r);
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
      E(this.Reveal.getSlidesElement(), "iframe[" + i + '*="' + t + '"]').forEach((r) => {
        let a = r.getAttribute(i);
        a && a.indexOf(s) === -1 && r.setAttribute(i, a + (/\?/.test(a) ? "&" : "?") + s);
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
        if (O(t, ".fragment") && !O(t, ".fragment.visible"))
          return;
        let s = this.Reveal.getConfig().autoPlayMedia;
        if (typeof s != "boolean" && (s = t.hasAttribute("data-autoplay") || !!O(t, ".slide-background")), s && typeof t.play == "function") {
          if (i && !t.muted) return;
          if (t.readyState > 1)
            this.startEmbeddedMedia({ target: t });
          else if (fe) {
            let r = t.play();
            r && typeof r.catch == "function" && t.controls === !1 && r.catch(() => {
              t.controls = !0, t.addEventListener("play", () => {
                t.controls = !1;
              });
            });
          } else
            t.removeEventListener("loadeddata", this.startEmbeddedMedia), t.addEventListener("loadeddata", this.startEmbeddedMedia);
        }
      }), i || (E(e, "iframe[src]").forEach((t) => {
        O(t, ".fragment") && !O(t, ".fragment.visible") || this.startEmbeddedIframe({ target: t });
      }), E(e, "iframe[data-src]").forEach((t) => {
        O(t, ".fragment") && !O(t, ".fragment.visible") || t.getAttribute("src") !== t.getAttribute("data-src") && (t.removeEventListener("load", this.startEmbeddedIframe), t.addEventListener("load", this.startEmbeddedIframe), t.setAttribute("src", t.getAttribute("data-src")));
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
    let i = !!O(e.target, "html"), t = !!O(e.target, ".present");
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
      let t = !!O(e.target, "html"), s = !!O(e.target, ".present");
      if (t && s) {
        let r = this.Reveal.getConfig().autoPlayMedia;
        typeof r != "boolean" && (r = i.hasAttribute("data-autoplay") || !!O(i, ".slide-background")), /youtube\.com\/embed\//.test(i.getAttribute("src")) && r ? i.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*") : /player\.vimeo\.com\//.test(i.getAttribute("src")) && r ? i.contentWindow.postMessage('{"method":"play"}', "*") : i.contentWindow.postMessage("slide:start", "*");
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
const re = ".slides section", te = ".slides>section", kt = ".slides>section.present>section", yi = ".backgrounds>.slide-background", bi = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/, wi = "h.v", Ei = "h/v", We = "c", Mt = "c/t";
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
      let a = e && e.dataset.visibility === "uncounted" ? 0 : 1;
      switch (t = [], s) {
        case We:
          t.push(this.Reveal.getSlidePastCount(e) + a);
          break;
        case Mt:
          t.push(this.Reveal.getSlidePastCount(e) + a, "/", this.Reveal.getTotalSlides());
          break;
        default:
          let o = this.Reveal.getIndices(e);
          t.push(o.h + a);
          let c = s === Ei ? "/" : ".";
          this.Reveal.isVerticalSlide(e) && t.push(c, o.v + 1);
      }
    }
    let r = "#" + this.Reveal.location.getHash(e);
    return this.formatNumber(t[0], t[1], t[2], r);
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
class Ai {
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
const je = (h) => {
  let e = h.match(/^#([0-9a-f]{3})$/i);
  if (e && e[1])
    return e = e[1], {
      r: parseInt(e.charAt(0), 16) * 17,
      g: parseInt(e.charAt(1), 16) * 17,
      b: parseInt(e.charAt(2), 16) * 17
    };
  let i = h.match(/^#([0-9a-f]{6})$/i);
  if (i && i[1])
    return i = i[1], {
      r: parseInt(i.slice(0, 2), 16),
      g: parseInt(i.slice(2, 4), 16),
      b: parseInt(i.slice(4, 6), 16)
    };
  let t = h.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (t)
    return {
      r: parseInt(t[1], 10),
      g: parseInt(t[2], 10),
      b: parseInt(t[3], 10)
    };
  let s = h.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
  return s ? {
    r: parseInt(s[1], 10),
    g: parseInt(s[2], 10),
    b: parseInt(s[3], 10),
    a: parseFloat(s[4])
  } : null;
}, Ri = (h) => (typeof h == "string" && (h = je(h)), h ? (h.r * 299 + h.g * 587 + h.b * 114) / 1e3 : null);
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
    }, r = e.hasAttribute("data-preload");
    e.classList.remove("has-dark-background"), e.classList.remove("has-light-background"), i.removeAttribute("data-loaded"), i.removeAttribute("data-background-hash"), i.removeAttribute("data-background-size"), i.removeAttribute("data-background-transition"), i.style.backgroundColor = "", t.style.backgroundSize = "", t.style.backgroundRepeat = "", t.style.backgroundPosition = "", t.style.backgroundImage = "", t.style.opacity = "", t.innerHTML = "", s.background && (/^(http|file|\/\/)/gi.test(s.background) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(s.background) ? e.setAttribute("data-background-image", s.background) : i.style.background = s.background), (s.background || s.backgroundColor || s.backgroundGradient || s.backgroundImage || s.backgroundVideo || s.backgroundIframe) && i.setAttribute("data-background-hash", s.background + s.backgroundSize + s.backgroundImage + s.backgroundVideo + s.backgroundIframe + s.backgroundColor + s.backgroundGradient + s.backgroundRepeat + s.backgroundPosition + s.backgroundTransition + s.backgroundOpacity), s.backgroundSize && i.setAttribute("data-background-size", s.backgroundSize), s.backgroundColor && (i.style.backgroundColor = s.backgroundColor), s.backgroundGradient && (i.style.backgroundImage = s.backgroundGradient), s.backgroundTransition && i.setAttribute("data-background-transition", s.backgroundTransition), r && i.setAttribute("data-preload", ""), s.backgroundSize && (t.style.backgroundSize = s.backgroundSize), s.backgroundRepeat && (t.style.backgroundRepeat = s.backgroundRepeat), s.backgroundPosition && (t.style.backgroundPosition = s.backgroundPosition), s.backgroundOpacity && (t.style.opacity = s.backgroundOpacity);
    const a = this.getContrastClass(e);
    typeof a == "string" && e.classList.add(a);
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
        return Ri(t) < 128 ? "has-dark-background" : "has-light-background";
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
    let i = this.Reveal.getConfig(), t = this.Reveal.getCurrentSlide(), s = this.Reveal.getIndices(), r = null, a = i.rtl ? "future" : "past", o = i.rtl ? "past" : "future";
    if (Array.from(this.element.childNodes).forEach((c, f) => {
      c.classList.remove("past", "present", "future"), f < s.h ? c.classList.add(a) : f > s.h ? c.classList.add(o) : (c.classList.add("present"), r = c), (e || f === s.h) && E(c, ".slide-background").forEach((g, p) => {
        g.classList.remove("past", "present", "future");
        const y = typeof s.v == "number" ? s.v : 0;
        p < y ? g.classList.add("past") : p > y ? g.classList.add("future") : (g.classList.add("present"), f === s.h && (r = g));
      });
    }), this.previousBackground && !this.previousBackground.closest("body") && (this.previousBackground = null), r && this.previousBackground) {
      let c = this.previousBackground.getAttribute("data-background-hash"), f = r.getAttribute("data-background-hash");
      if (f && f === c && r !== this.previousBackground) {
        this.element.classList.add("no-transition");
        const g = r.querySelector("video"), p = this.previousBackground.querySelector("video");
        if (g && p) {
          const y = g.parentNode;
          p.parentNode.appendChild(g), y.appendChild(p);
        }
      }
    }
    if (this.previousBackground && this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload(this.previousBackground) }), r) {
      this.Reveal.slideContent.startEmbeddedContent(r);
      let c = r.querySelector(".slide-background-content");
      if (c) {
        let f = c.style.backgroundImage || "";
        /\.gif/i.test(f) && (c.style.backgroundImage = "", window.getComputedStyle(c).opacity, c.style.backgroundImage = f);
      }
      this.previousBackground = r;
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
      let i = this.Reveal.getHorizontalSlides(), t = this.Reveal.getVerticalSlides(), s = this.element.style.backgroundSize.split(" "), r, a;
      s.length === 1 ? r = a = parseInt(s[0], 10) : (r = parseInt(s[0], 10), a = parseInt(s[1], 10));
      let o = this.element.offsetWidth, c = i.length, f, g;
      typeof this.Reveal.getConfig().parallaxBackgroundHorizontal == "number" ? f = this.Reveal.getConfig().parallaxBackgroundHorizontal : f = c > 1 ? (r - o) / (c - 1) : 0, g = f * e.h * -1;
      let p = this.element.offsetHeight, y = t.length, w, l;
      typeof this.Reveal.getConfig().parallaxBackgroundVertical == "number" ? w = this.Reveal.getConfig().parallaxBackgroundVertical : w = (a - p) / (y - 1), l = y > 0 ? w * e.v : 0, this.element.style.backgroundPosition = g + "px " + -l + "px";
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
    let t = this.Reveal.getSlides(), s = t.indexOf(i), r = t.indexOf(e);
    if (e && i && e.hasAttribute("data-auto-animate") && i.hasAttribute("data-auto-animate") && e.getAttribute("data-auto-animate-id") === i.getAttribute("data-auto-animate-id") && !(s > r ? i : e).hasAttribute("data-auto-animate-restart")) {
      this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || Ue();
      let a = this.getAutoAnimateOptions(i);
      e.dataset.autoAnimate = "pending", i.dataset.autoAnimate = "pending", a.slideDirection = s > r ? "forward" : "backward";
      let o = e.style.display === "none";
      o && (e.style.display = this.Reveal.getConfig().display);
      let c = this.getAutoAnimatableElements(e, i).map((f) => this.autoAnimateElements(f.from, f.to, f.options || {}, a, Ct++));
      if (o && (e.style.display = "none"), i.dataset.autoAnimateUnmatched !== "false" && this.Reveal.getConfig().autoAnimateUnmatched === !0) {
        let f = a.duration * 0.8, g = a.duration * 0.2;
        this.getUnmatchedAutoAnimateElements(i).forEach((p) => {
          let y = this.getAutoAnimateOptions(p, a), w = "unmatched";
          (y.duration !== a.duration || y.delay !== a.delay) && (w = "unmatched-" + Ct++, c.push(`[data-auto-animate="running"] [data-auto-animate-target="${w}"] { transition: opacity ${y.duration}s ease ${y.delay}s; }`)), p.dataset.autoAnimateTarget = w;
        }, this), c.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${f}s ease ${g}s; }`);
      }
      this.autoAnimateStyleSheet.innerHTML = c.join(""), requestAnimationFrame(() => {
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
  autoAnimateElements(e, i, t, s, r) {
    e.dataset.autoAnimateTarget = "", i.dataset.autoAnimateTarget = r;
    let a = this.getAutoAnimateOptions(i, s);
    typeof t.delay < "u" && (a.delay = t.delay), typeof t.duration < "u" && (a.duration = t.duration), typeof t.easing < "u" && (a.easing = t.easing);
    let o = this.getAutoAnimatableProperties("from", e, t), c = this.getAutoAnimatableProperties("to", i, t);
    if (i.classList.contains("fragment") && delete c.styles.opacity, t.translate !== !1 || t.scale !== !1) {
      let p = this.Reveal.getScale(), y = {
        x: (o.x - c.x) / p,
        y: (o.y - c.y) / p,
        scaleX: o.width / c.width,
        scaleY: o.height / c.height
      };
      y.x = Math.round(y.x * 1e3) / 1e3, y.y = Math.round(y.y * 1e3) / 1e3, y.scaleX = Math.round(y.scaleX * 1e3) / 1e3, y.scaleX = Math.round(y.scaleX * 1e3) / 1e3;
      let w = t.translate !== !1 && (y.x !== 0 || y.y !== 0), l = t.scale !== !1 && (y.scaleX !== 0 || y.scaleY !== 0);
      if (w || l) {
        let A = [];
        w && A.push(`translate(${y.x}px, ${y.y}px)`), l && A.push(`scale(${y.scaleX}, ${y.scaleY})`), o.styles.transform = A.join(" "), o.styles["transform-origin"] = "top left", c.styles.transform = "none";
      }
    }
    for (let p in c.styles) {
      const y = c.styles[p], w = o.styles[p];
      y === w ? delete c.styles[p] : (y.explicitValue === !0 && (c.styles[p] = y.value), w.explicitValue === !0 && (o.styles[p] = w.value));
    }
    let f = "", g = Object.keys(c.styles);
    if (g.length > 0) {
      o.styles.transition = "none", c.styles.transition = `all ${a.duration}s ${a.easing} ${a.delay}s`, c.styles["transition-property"] = g.join(", "), c.styles["will-change"] = g.join(", ");
      let p = Object.keys(o.styles).map((w) => w + ": " + o.styles[w] + " !important;").join(""), y = Object.keys(c.styles).map((w) => w + ": " + c.styles[w] + " !important;").join("");
      f = '[data-auto-animate-target="' + r + '"] {' + p + '}[data-auto-animate="running"] [data-auto-animate-target="' + r + '"] {' + y + "}";
    }
    return f;
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
      let s = O(e.parentNode, "[data-auto-animate-target]");
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
    let s = this.Reveal.getConfig(), r = { styles: [] };
    if (t.translate !== !1 || t.scale !== !1) {
      let o;
      if (typeof t.measure == "function")
        o = t.measure(i);
      else if (s.center)
        o = i.getBoundingClientRect();
      else {
        let c = this.Reveal.getScale();
        o = {
          x: i.offsetLeft * c,
          y: i.offsetTop * c,
          width: i.offsetWidth * c,
          height: i.offsetHeight * c
        };
      }
      r.x = o.x, r.y = o.y, r.width = o.width, r.height = o.height;
    }
    const a = getComputedStyle(i);
    return (t.styles || s.autoAnimateStyles).forEach((o) => {
      let c;
      typeof o == "string" && (o = { property: o }), typeof o.from < "u" && e === "from" ? c = { value: o.from, explicitValue: !0 } : typeof o.to < "u" && e === "to" ? c = { value: o.to, explicitValue: !0 } : (o.property === "line-height" && (c = parseFloat(a["line-height"]) / parseFloat(a["font-size"])), isNaN(c) && (c = a[o.property])), c !== "" && (r.styles[o.property] = c);
    }), r;
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
    let s = (typeof this.Reveal.getConfig().autoAnimateMatcher == "function" ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs).call(this, e, i), r = [];
    return s.filter((a, o) => {
      if (r.indexOf(a.to) === -1)
        return r.push(a.to), !0;
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
    const s = "pre", r = "h1, h2, h3, h4, h5, h6, p, li", a = "img, video, iframe";
    return this.findAutoAnimateMatches(t, e, i, "[data-id]", (o) => o.nodeName + ":::" + o.getAttribute("data-id")), this.findAutoAnimateMatches(t, e, i, r, (o) => o.nodeName + ":::" + o.textContent.trim()), this.findAutoAnimateMatches(t, e, i, a, (o) => o.nodeName + ":::" + (o.getAttribute("src") || o.getAttribute("data-src"))), this.findAutoAnimateMatches(t, e, i, s, (o) => o.nodeName + ":::" + o.textContent.trim()), t.forEach((o) => {
      Pe(o.from, r) ? o.options = { scale: !1 } : Pe(o.from, s) && (o.options = { scale: !1, styles: ["width", "height"] }, this.findAutoAnimateMatches(t, o.from, o.to, ".hljs .hljs-ln-code", (c) => c.textContent, {
        scale: !1,
        styles: [],
        measure: this.getLocalBoundingBox.bind(this)
      }), this.findAutoAnimateMatches(t, o.from, o.to, ".hljs .hljs-ln-numbers[data-line-number]", (c) => c.getAttribute("data-line-number"), {
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
  findAutoAnimateMatches(e, i, t, s, r, a) {
    let o = {}, c = {};
    [].slice.call(i.querySelectorAll(s)).forEach((f, g) => {
      const p = r(f);
      typeof p == "string" && p.length && (o[p] = o[p] || [], o[p].push(f));
    }), [].slice.call(t.querySelectorAll(s)).forEach((f, g) => {
      const p = r(f);
      c[p] = c[p] || [], c[p].push(f);
      let y;
      if (o[p]) {
        const w = c[p].length - 1, l = o[p].length - 1;
        o[p][w] ? (y = o[p][w], o[p][w] = null) : o[p][l] && (y = o[p][l], o[p][l] = null);
      }
      y && e.push({
        from: y,
        to: f,
        options: a
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
    const i = E(this.Reveal.getRevealElement(), te), t = E(this.Reveal.getRevealElement(), yi);
    this.viewportElement.classList.add("loading-scroll-mode", "reveal-scroll");
    let s;
    const r = window.getComputedStyle(this.viewportElement);
    r && r.background && (s = r.background);
    const a = [], o = i[0].parentNode;
    let c;
    const f = (g, p, y, w) => {
      let l;
      if (c && this.Reveal.shouldAutoAnimateBetween(c, g))
        l = document.createElement("div"), l.className = "scroll-page-content scroll-auto-animate-page", l.style.display = "none", c.closest(".scroll-page-content").parentNode.appendChild(l);
      else {
        const A = document.createElement("div");
        if (A.className = "scroll-page", a.push(A), w && t.length > p) {
          const V = t[p], q = window.getComputedStyle(V);
          q && q.background ? A.style.background = q.background : s && (A.style.background = s);
        } else s && (A.style.background = s);
        const I = document.createElement("div");
        I.className = "scroll-page-sticky", A.appendChild(I), l = document.createElement("div"), l.className = "scroll-page-content", I.appendChild(l);
      }
      l.appendChild(g), g.classList.remove("past", "future"), g.setAttribute("data-index-h", p), g.setAttribute("data-index-v", y), g.slideBackgroundElement && (g.slideBackgroundElement.remove("past", "future"), l.insertBefore(g.slideBackgroundElement, g)), c = g;
    };
    i.forEach((g, p) => {
      this.Reveal.isVerticalStack(g) ? g.querySelectorAll("section").forEach((y, w) => {
        f(y, p, w, !0);
      }) : f(g, p, 0);
    }, this), this.createProgressBar(), E(this.Reveal.getRevealElement(), ".stack").forEach((g) => g.remove()), a.forEach((g) => o.appendChild(g)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.layout(), this.Reveal.setState(e), this.activatedCallbacks.forEach((g) => g()), this.activatedCallbacks = [], this.restoreScrollPosition(), this.viewportElement.classList.remove("loading-scroll-mode"), this.viewportElement.addEventListener("scroll", this.onScroll, { passive: !0 });
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
      let r = (s.clientY - this.progressBarInner.getBoundingClientRect().top) / this.progressBarHeight;
      r = Math.max(Math.min(r, 1), 0), this.viewportElement.scrollTop = r * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight);
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
    const e = this.Reveal.getConfig(), i = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), t = this.Reveal.getScale(), s = e.scrollLayout === "compact", r = this.viewportElement.offsetHeight, a = i.height * t, o = s ? a : r;
    this.scrollTriggerHeight = s ? a : r, this.viewportElement.style.setProperty("--page-height", o + "px"), this.viewportElement.style.scrollSnapType = typeof e.scrollSnap == "string" ? `y ${e.scrollSnap}` : "", this.slideTriggers = [];
    const c = Array.from(this.Reveal.getRevealElement().querySelectorAll(".scroll-page"));
    this.pages = c.map((f) => {
      const g = this.createPage({
        pageElement: f,
        slideElement: f.querySelector("section"),
        stickyElement: f.querySelector(".scroll-page-sticky"),
        contentElement: f.querySelector(".scroll-page-content"),
        backgroundElement: f.querySelector(".slide-background"),
        autoAnimateElements: f.querySelectorAll(".scroll-auto-animate-page"),
        autoAnimatePages: []
      });
      g.pageElement.style.setProperty("--slide-height", e.center === !0 ? "auto" : i.height + "px"), this.slideTriggers.push({
        page: g,
        activate: () => this.activatePage(g),
        deactivate: () => this.deactivatePage(g)
      }), this.createFragmentTriggersForPage(g), g.autoAnimateElements.length > 0 && this.createAutoAnimateTriggersForPage(g);
      let p = Math.max(g.scrollTriggers.length - 1, 0);
      p += g.autoAnimatePages.reduce((y, w) => y + Math.max(w.scrollTriggers.length - 1, 0), g.autoAnimatePages.length), g.pageElement.querySelectorAll(".scroll-snap-point").forEach((y) => y.remove());
      for (let y = 0; y < p + 1; y++) {
        const w = document.createElement("div");
        w.className = "scroll-snap-point", w.style.height = this.scrollTriggerHeight + "px", w.style.scrollSnapAlign = s ? "center" : "start", g.pageElement.appendChild(w), y === 0 && (w.style.marginTop = -this.scrollTriggerHeight + "px");
      }
      return s && g.scrollTriggers.length > 0 ? (g.pageHeight = r, g.pageElement.style.setProperty("--page-height", r + "px")) : (g.pageHeight = o, g.pageElement.style.removeProperty("--page-height")), g.scrollPadding = this.scrollTriggerHeight * p, g.totalHeight = g.pageHeight + g.scrollPadding, g.pageElement.style.setProperty("--page-scroll-padding", g.scrollPadding + "px"), p > 0 ? (g.stickyElement.style.position = "sticky", g.stickyElement.style.top = Math.max((r - g.pageHeight) / 2, 0) + "px") : (g.stickyElement.style.position = "relative", g.pageElement.style.scrollSnapAlign = g.pageHeight < r ? "center" : "start"), g;
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
      i.page.scrollTriggers.forEach((r, a) => {
        r.range = [
          e + a * s,
          e + (a + 1) * s
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
    ), t.forEach((s, r) => {
      e.scrollTriggers.push({
        activate: () => {
          this.Reveal.fragments.update(r, e.fragments, i);
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
    this.progressBarInner.querySelectorAll(".scrollbar-slide").forEach((a) => a.remove());
    const e = this.viewportElement.scrollHeight, i = this.viewportElement.offsetHeight, t = i / e;
    this.progressBarHeight = this.progressBarInner.offsetHeight, this.playheadHeight = Math.max(t * this.progressBarHeight, Ti), this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;
    const s = i / e * this.progressBarHeight, r = Math.min(s / 8, Pi);
    this.progressBarPlayhead.style.height = this.playheadHeight - r + "px", s > xi ? this.slideTriggers.forEach((a) => {
      const { page: o } = a;
      o.progressBarSlide = document.createElement("div"), o.progressBarSlide.className = "scrollbar-slide", o.progressBarSlide.style.top = a.range[0] * this.progressBarHeight + "px", o.progressBarSlide.style.height = (a.range[1] - a.range[0]) * this.progressBarHeight - r + "px", o.progressBarSlide.classList.toggle("has-triggers", o.scrollTriggers.length > 0), this.progressBarInner.appendChild(o.progressBarSlide), o.scrollTriggerElements = o.scrollTriggers.map((c, f) => {
        const g = document.createElement("div");
        return g.className = "scrollbar-trigger", g.style.top = (c.range[0] - a.range[0]) * this.progressBarHeight + "px", g.style.height = (c.range[1] - c.range[0]) * this.progressBarHeight - r + "px", o.progressBarSlide.appendChild(g), f === 0 && (g.style.display = "none"), g;
      });
    }) : this.pages.forEach((a) => a.progressBarSlide = null);
  }
  /**
   * Reads the current scroll position and updates our active
   * trigger states accordingly.
   */
  syncScrollPosition() {
    const e = this.viewportElement.offsetHeight, i = e / this.viewportElement.scrollHeight, t = this.viewportElement.scrollTop, s = this.viewportElement.scrollHeight - e, r = Math.max(Math.min(t / s, 1), 0), a = Math.max(Math.min((t + e / 2) / this.viewportElement.scrollHeight, 1), 0);
    let o;
    this.slideTriggers.forEach((c) => {
      const { page: f } = c;
      r >= c.range[0] - i * 2 && r <= c.range[1] + i * 2 && !f.loaded ? (f.loaded = !0, this.Reveal.slideContent.load(f.slideElement)) : f.loaded && (f.loaded = !1, this.Reveal.slideContent.unload(f.slideElement)), r >= c.range[0] && r <= c.range[1] ? (this.activateTrigger(c), o = c.page) : c.active && this.deactivateTrigger(c);
    }), o && o.scrollTriggers.forEach((c) => {
      a >= c.range[0] && a <= c.range[1] ? this.activateTrigger(c) : c.active && this.deactivateTrigger(c);
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
      const { slideElement: i, backgroundElement: t, contentElement: s, indexh: r, indexv: a } = e;
      s.style.display = "block", i.classList.add("present"), t && t.classList.add("present"), this.Reveal.setCurrentScrollPage(i, r, a), this.Reveal.backgrounds.bubbleSlideContrastClassToElement(i, this.viewportElement), Array.from(s.parentNode.querySelectorAll(".scroll-page-content")).forEach((o) => {
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
    const e = this.Reveal.getConfig(), i = E(this.Reveal.getRevealElement(), re), t = e.slideNumber && /all|print/i.test(e.showSlideNumber), s = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), r = Math.floor(s.width * (1 + e.margin)), a = Math.floor(s.height * (1 + e.margin)), o = s.width, c = s.height;
    await new Promise(requestAnimationFrame), Ue("@page{size:" + r + "px " + a + "px; margin: 0px;}"), Ue(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + o + "px; max-height:" + c + "px}"), document.documentElement.classList.add("reveal-print", "print-pdf"), document.body.style.width = r + "px", document.body.style.height = a + "px";
    const f = this.Reveal.getViewportElement();
    let g;
    if (f) {
      const A = window.getComputedStyle(f);
      A && A.background && (g = A.background);
    }
    await new Promise(requestAnimationFrame), this.Reveal.layoutSlideContents(o, c), await new Promise(requestAnimationFrame);
    const p = i.map((A) => A.scrollHeight), y = [], w = i[0].parentNode;
    let l = 1;
    i.forEach(function(A, I) {
      if (A.classList.contains("stack") === !1) {
        let V = (r - o) / 2, q = (a - c) / 2;
        const se = p[I];
        let z = Math.max(Math.ceil(se / a), 1);
        z = Math.min(z, e.pdfMaxPagesPerSlide), (z === 1 && e.center || A.classList.contains("center")) && (q = Math.max((a - se) / 2, 0));
        const k = document.createElement("div");
        if (y.push(k), k.className = "pdf-page", k.style.height = (a + e.pdfPageHeightOffset) * z + "px", g && (k.style.background = g), k.appendChild(A), A.style.left = V + "px", A.style.top = q + "px", A.style.width = o + "px", this.Reveal.slideContent.layout(A), A.slideBackgroundElement && k.insertBefore(A.slideBackgroundElement, A), e.showNotes) {
          const M = this.Reveal.getSlideNotes(A);
          if (M) {
            const j = typeof e.showNotes == "string" ? e.showNotes : "inline", P = document.createElement("div");
            P.classList.add("speaker-notes"), P.classList.add("speaker-notes-pdf"), P.setAttribute("data-layout", j), P.innerHTML = M, j === "separate-page" ? y.push(P) : (P.style.left = "8px", P.style.bottom = "8px", P.style.width = r - 8 * 2 + "px", k.appendChild(P));
          }
        }
        if (t) {
          const M = document.createElement("div");
          M.classList.add("slide-number"), M.classList.add("slide-number-pdf"), M.innerHTML = l++, k.appendChild(M);
        }
        if (e.pdfSeparateFragments) {
          const M = this.Reveal.fragments.sort(k.querySelectorAll(".fragment"), !0);
          let W;
          M.forEach(function(j, P) {
            W && W.forEach(function(D) {
              D.classList.remove("current-fragment");
            }), j.forEach(function(D) {
              D.classList.add("visible", "current-fragment");
            }, this);
            const R = k.cloneNode(!0);
            if (t) {
              const D = R.querySelector(".slide-number-pdf"), C = P + 1;
              D.innerHTML += "." + C;
            }
            y.push(R), W = j;
          }, this), M.forEach(function(j) {
            j.forEach(function(P) {
              P.classList.remove("visible", "current-fragment");
            });
          });
        } else
          E(k, ".fragment:not(.fade-out)").forEach(function(M) {
            M.classList.add("visible");
          });
      }
    }, this), await new Promise(requestAnimationFrame), y.forEach((A) => w.appendChild(A)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.dispatchEvent({ type: "pdf-ready" }), f.classList.remove("loading-scroll-mode");
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
    let t = [], s = [], r = [];
    e.forEach((o) => {
      if (o.hasAttribute("data-fragment-index")) {
        let c = parseInt(o.getAttribute("data-fragment-index"), 10);
        t[c] || (t[c] = []), t[c].push(o);
      } else
        s.push([o]);
    }), t = t.concat(s);
    let a = 0;
    return t.forEach((o) => {
      o.forEach((c) => {
        r.push(c), c.setAttribute("data-fragment-index", a);
      }), a++;
    }), i === !0 ? t : r;
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
      let r = 0;
      if (typeof e != "number") {
        let a = this.sort(t.querySelectorAll(".fragment.visible")).pop();
        a && (e = parseInt(a.getAttribute("data-fragment-index") || 0, 10));
      }
      Array.from(i).forEach((a, o) => {
        if (a.hasAttribute("data-fragment-index") && (o = parseInt(a.getAttribute("data-fragment-index"), 10)), r = Math.max(r, o), o <= e) {
          let c = a.classList.contains("visible");
          a.classList.add("visible"), a.classList.remove("current-fragment"), o === e && (this.Reveal.announceStatus(this.Reveal.getStatusText(a)), a.classList.add("current-fragment"), this.Reveal.slideContent.startEmbeddedContent(a)), c || (s.shown.push(a), this.Reveal.dispatchEvent({
            target: a,
            type: "visible",
            bubbles: !1
          }));
        } else {
          let c = a.classList.contains("visible");
          a.classList.remove("visible"), a.classList.remove("current-fragment"), c && (this.Reveal.slideContent.stopEmbeddedContent(a), s.hidden.push(a), this.Reveal.dispatchEvent({
            target: a,
            type: "hidden",
            bubbles: !1
          }));
        }
      }), e = typeof e == "number" ? e : -1, e = Math.max(Math.min(e, r), -1), t.setAttribute("data-fragment", e);
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
          let a = this.sort(t.querySelectorAll(".fragment:not(.disabled).visible")).pop();
          a ? e = parseInt(a.getAttribute("data-fragment-index") || 0, 10) : e = -1;
        }
        e += i;
        let r = this.update(e, s);
        return this.Reveal.controls.update(), this.Reveal.progress.update(), this.Reveal.getConfig().fragmentInURL && this.Reveal.location.writeURL(), !!(r.shown.length || r.hidden.length);
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
      this.active = !0, this.Reveal.getRevealElement().classList.add("overview"), this.Reveal.cancelAutoSlide(), this.Reveal.getSlidesElement().appendChild(this.Reveal.getBackgroundsElement()), E(this.Reveal.getRevealElement(), re).forEach((s) => {
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
      e.setAttribute("data-index-h", i), ie(e, "translate3d(" + i * this.overviewSlideWidth + "px, 0, 0)"), e.classList.contains("stack") && E(e, "section").forEach((t, s) => {
        t.setAttribute("data-index-h", i), t.setAttribute("data-index-v", s), ie(t, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
      });
    }), Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach((e, i) => {
      ie(e, "translate3d(" + i * this.overviewSlideWidth + "px, 0, 0)"), E(e, ".slide-background").forEach((t, s) => {
        ie(t, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
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
      }, 1), this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()), E(this.Reveal.getRevealElement(), re).forEach((i) => {
        ie(i, ""), i.removeEventListener("click", this.onSlideClicked, !0);
      }), E(this.Reveal.getBackgroundsElement(), ".slide-background").forEach((i) => {
        ie(i, "");
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
    let r = document.activeElement && document.activeElement.isContentEditable === !0, a = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), o = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className), f = !([32, 37, 38, 39, 40, 63, 78, 80, 191].indexOf(e.keyCode) !== -1 && e.shiftKey || e.altKey) && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    if (r || a || o || f) return;
    let g = [66, 86, 190, 191, 112], p;
    if (typeof i.keyboard == "object")
      for (p in i.keyboard)
        i.keyboard[p] === "togglePause" && g.push(parseInt(p, 10));
    if (this.Reveal.isPaused() && g.indexOf(t) === -1)
      return !1;
    let y = i.navigationMode === "linear" || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides(), w = !1;
    if (typeof i.keyboard == "object") {
      for (p in i.keyboard)
        if (parseInt(p, 10) === t) {
          let l = i.keyboard[p];
          typeof l == "function" ? l.apply(null, [e]) : typeof l == "string" && typeof this.Reveal[l] == "function" && this.Reveal[l].call(), w = !0;
        }
    }
    if (w === !1) {
      for (p in this.bindings)
        if (parseInt(p, 10) === t) {
          let l = this.bindings[p].callback;
          typeof l == "function" ? l.apply(null, [e]) : typeof l == "string" && typeof this.Reveal[l] == "function" && this.Reveal[l].call(), w = !0;
        }
    }
    w === !1 && (w = !0, t === 80 || t === 33 ? this.Reveal.prev({ skipFragments: e.altKey }) : t === 78 || t === 34 ? this.Reveal.next({ skipFragments: e.altKey }) : t === 72 || t === 37 ? e.shiftKey ? this.Reveal.slide(0) : !this.Reveal.overview.isActive() && y ? i.rtl ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.left({ skipFragments: e.altKey }) : t === 76 || t === 39 ? e.shiftKey ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : !this.Reveal.overview.isActive() && y ? i.rtl ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.right({ skipFragments: e.altKey }) : t === 75 || t === 38 ? e.shiftKey ? this.Reveal.slide(void 0, 0) : !this.Reveal.overview.isActive() && y ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.up({ skipFragments: e.altKey }) : t === 74 || t === 40 ? e.shiftKey ? this.Reveal.slide(void 0, Number.MAX_VALUE) : !this.Reveal.overview.isActive() && y ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.down({ skipFragments: e.altKey }) : t === 36 ? this.Reveal.slide(0) : t === 35 ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : t === 32 ? (this.Reveal.overview.isActive() && this.Reveal.overview.deactivate(), e.shiftKey ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey })) : [58, 59, 66, 86, 190].includes(t) || t === 191 && !e.shiftKey ? this.Reveal.togglePause() : t === 70 ? xt(i.embedded ? this.Reveal.getViewportElement() : document.documentElement) : t === 65 ? i.autoSlideStoppable && this.Reveal.toggleAutoSlide(s) : t === 71 ? i.jumpToSlide && this.Reveal.toggleJumpToSlide() : (t === 63 || t === 191) && e.shiftKey ? this.Reveal.toggleHelp() : t === 112 ? this.Reveal.toggleHelp() : w = !1), w ? e.preventDefault && e.preventDefault() : (t === 27 || t === 79) && (this.Reveal.closeOverlay() === !1 && this.Reveal.overview.toggle(), e.preventDefault && e.preventDefault()), this.Reveal.cueAutoSlide();
  }
}
class Di {
  constructor(e) {
    // The minimum number of milliseconds that must pass between
    // calls to history.replaceState
    At(this, "MAX_REPLACE_STATE_FREQUENCY", 1e3);
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
      let r, a;
      /\/[-\d]+$/g.test(t) && (a = parseInt(t.split("/").pop(), 10), a = isNaN(a) ? void 0 : a, t = t.split("/").shift());
      try {
        r = document.getElementById(decodeURIComponent(t)).closest(".slides section");
      } catch {
      }
      if (r)
        return { ...this.Reveal.getIndices(r), f: a };
    } else {
      const r = this.Reveal.getConfig();
      let a = r.hashOneBasedIndex || i.oneBasedIndex ? 1 : 0, o = parseInt(s[0], 10) - a || 0, c = parseInt(s[1], 10) - a || 0, f;
      return r.fragmentInURL && (f = parseInt(s[2], 10), isNaN(f) && (f = void 0)), { h: o, v: c, f };
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
    let r = this.Reveal.getIndices(e);
    if (this.Reveal.getConfig().fragmentInURL || (r.f = void 0), typeof s == "string" && s.length)
      i = "/" + s, r.f >= 0 && (i += "/" + r.f);
    else {
      let a = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
      (r.h > 0 || r.v > 0 || r.f >= 0) && (i += r.h + a), (r.v > 0 || r.f >= 0) && (i += "/" + (r.v + a)), r.f >= 0 && (i += "/" + r.f);
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
class zi {
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
      t.prev && this.controlsPrev.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
      }), t.next && this.controlsNext.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
      });
      const s = this.Reveal.isVerticalSlide(i), r = s && i.parentElement && i.parentElement.querySelectorAll(":scope > section").length > 1;
      s && r ? (t.prev && this.controlsUp.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
      }), t.next && this.controlsDown.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
      })) : (t.prev && this.controlsLeft.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
      }), t.next && this.controlsRight.forEach((a) => {
        a.classList.add("fragmented", "enabled"), a.removeAttribute("disabled");
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
class Fi {
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
    let r = this.Reveal.getIndices(i[s]);
    this.Reveal.slide(r.h, r.v);
  }
  destroy() {
    this.element.remove();
  }
}
class Oi {
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
const Lt = (h, e) => {
  const i = document.createElement("script");
  i.type = "text/javascript", i.async = !1, i.defer = !1, i.src = h, typeof e == "function" && (i.onload = i.onreadystatechange = (s) => {
    (s.type === "load" || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = i.onerror = null, e());
  }, i.onerror = (s) => {
    i.onload = i.onreadystatechange = i.onerror = null, e(new Error("Failed loading script: " + i.src + `
` + s));
  });
  const t = document.querySelector("head");
  t.insertBefore(i, t.lastChild);
};
class Vi {
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
      let s = [], r = 0;
      if (i.forEach((a) => {
        (!a.condition || a.condition()) && (a.async ? this.asyncDependencies.push(a) : s.push(a));
      }), s.length) {
        r = s.length;
        const a = (o) => {
          o && typeof o.callback == "function" && o.callback(), --r === 0 && this.initPlugins().then(t);
        };
        s.forEach((o) => {
          typeof o.id == "string" ? (this.registerPlugin(o), a(o)) : typeof o.src == "string" ? Lt(o.src, () => a(o)) : (console.warn("Unrecognized plugin format", o), a());
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
        let s, r = () => {
          --t === 0 ? this.loadAsync().then(e) : s();
        }, a = 0;
        s = () => {
          let o = i[a++];
          if (typeof o.init == "function") {
            let c = o.init(this.Reveal);
            c && typeof c.then == "function" ? c.then(r) : r();
          } else
            r();
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
    this.Reveal = e, this.onSlidesClicked = this.onSlidesClicked.bind(this), this.linkPreviewSelector = null, this.mediaPreviewSelector = "[data-preview-image], [data-preview-video]";
  }
  update() {
    this.Reveal.getConfig().previewLinks ? this.linkPreviewSelector = "a[href]:not([data-preview-link=false])" : this.linkPreviewSelector = "[data-preview-link]:not([data-preview-link=false])", this.hasLinkPreviews = this.Reveal.getSlidesElement().querySelectorAll(this.linkPreviewSelector).length > 0, this.hasMediaPreviews = this.Reveal.getSlidesElement().querySelectorAll(this.mediaPreviewSelector).length > 0, this.hasLinkPreviews || this.hasMediaPreviews ? this.Reveal.getSlidesElement().addEventListener("click", this.onSlidesClicked, !1) : this.Reveal.getSlidesElement().removeEventListener("click", this.onSlidesClicked, !1);
  }
  createOverlay(e) {
    this.dom = document.createElement("div"), this.dom.classList.add("r-overlay"), this.dom.classList.add(e), this.viewport = document.createElement("div"), this.viewport.classList.add("r-overlay-viewport"), this.dom.appendChild(this.viewport), this.Reveal.getViewportElement().appendChild(this.dom);
  }
  /**
   * Opens a preview window for the target URL.
   *
   * @param {string} url - url for preview iframe src
   */
  showIframePreview(e) {
    this.close(), this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.viewport.innerHTML = `<header class="r-overlay-header">
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
    }, !1);
  }
  /**
   * Opens a preview window that provides a larger view of the
   * given image/video.
   *
   * @param {string} url - url to the image/video to preview
   * @param {image|video} mediaType
   * @param {HTMLElement} [trigger] - the element that triggered
   * the preview
   */
  showMediaPreview(e, i, t) {
    if (i !== "image" && i !== "video") {
      console.warn("Please specify a valid media type to preview (image|video)");
      return;
    }
    this.close(), this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.dom.dataset.previewFit = t && t.dataset.previewFit || "scale-down", this.viewport.innerHTML = `<header class="r-overlay-header">
				<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content"></div>`;
    const s = this.dom.querySelector(".r-overlay-content");
    if (i === "image") {
      const r = document.createElement("img", {});
      r.src = e, s.appendChild(r), r.addEventListener("load", () => {
        this.dom.dataset.state = "loaded";
      }, !1), r.addEventListener("error", () => {
        this.dom.dataset.state = "error", s.innerHTML = '<span class="r-overlay-error">Unable to load image.</span>';
      }, !1), this.dom.style.cursor = "zoom-out", this.dom.addEventListener("click", (a) => {
        this.close();
      }, !1);
    } else if (i === "video") {
      const r = document.createElement("video");
      r.autoplay = this.dom.dataset.previewAutoplay !== "false", r.controls = this.dom.dataset.previewControls !== "false", r.loop = this.dom.dataset.previewLoop === "true", r.muted = this.dom.dataset.previewMuted === "true", r.playsInline = !0, r.src = e, s.appendChild(r), r.addEventListener("loadeddata", () => {
        this.dom.dataset.state = "loaded";
      }, !1), r.addEventListener("error", () => {
        this.dom.dataset.state = "error", s.innerHTML = '<span class="r-overlay-error">Unable to load video.</span>';
      }, !1);
    } else
      throw new Error("Please specify a valid media type to preview");
    this.dom.querySelector(".r-overlay-close").addEventListener("click", (r) => {
      this.close(), r.preventDefault();
    }, !1);
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
      }, !1);
    }
  }
  isOpen() {
    return !!this.dom;
  }
  /**
   * Closes any currently open overlay.
   */
  close() {
    return this.dom ? (this.dom.remove(), this.dom = null, !0) : !1;
  }
  onSlidesClicked(e) {
    const i = e.target, t = i.closest(this.linkPreviewSelector), s = i.closest(this.mediaPreviewSelector);
    if (t) {
      let r = t.getAttribute("href");
      r && (this.showIframePreview(r), e.preventDefault());
    } else if (s) {
      if (s.hasAttribute("data-preview-image")) {
        let r = s.dataset.previewImage || s.getAttribute("src");
        r && (this.showMediaPreview(r, "image", s), e.preventDefault());
      } else if (s.hasAttribute("data-preview-video")) {
        let r = s.dataset.previewVideo || s.getAttribute("src");
        if (!r) {
          let a = s.querySelector("source");
          a && (r = a.getAttribute("src"));
        }
        r && (this.showMediaPreview(r, "video", s), e.preventDefault());
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
        let r = this.Reveal.availableRoutes({ includeFragments: !0 }), a = t - this.touchStartX, o = s - this.touchStartY;
        a > Le && Math.abs(a) > Math.abs(o) ? (this.touchCaptured = !0, i.navigationMode === "linear" ? i.rtl ? this.Reveal.next() : this.Reveal.prev() : this.Reveal.left()) : a < -Le && Math.abs(a) > Math.abs(o) ? (this.touchCaptured = !0, i.navigationMode === "linear" ? i.rtl ? this.Reveal.prev() : this.Reveal.next() : this.Reveal.right()) : o > Le && r.up ? (this.touchCaptured = !0, i.navigationMode === "linear" ? this.Reveal.prev() : this.Reveal.up()) : o < -Le && r.down && (this.touchCaptured = !0, i.navigationMode === "linear" ? this.Reveal.next() : this.Reveal.down()), i.embedded ? (this.touchCaptured || this.Reveal.isVerticalSlide()) && e.preventDefault() : e.preventDefault();
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
    let i = O(e.target, ".reveal");
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
    let e = this.playing ? this.progress : 0, i = this.diameter2 - this.thickness, t = this.diameter2, s = this.diameter2, r = 28;
    this.progressOffset += (1 - this.progressOffset) * 0.1;
    const a = -Math.PI / 2 + e * (Math.PI * 2), o = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);
    this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(t, s, i + 4, 0, Math.PI * 2, !1), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(t, s, i, 0, Math.PI * 2, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(t, s, i, o, a, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(t - r / 2, s - r / 2), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, r / 2 - 4, r), this.context.fillRect(r / 2 + 4, 0, r / 2 - 4, r)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(r - 4, r / 2), this.context.lineTo(0, r), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore();
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
function Bt(h, e) {
  arguments.length < 2 && (e = arguments[0], h = document.querySelector(".reveal"));
  const i = {};
  let t = {}, s = !1, r = !1, a, o, c, f, g = {
    hasNavigatedHorizontally: !1,
    hasNavigatedVertically: !1
  }, p = [], y = 1, w = { layout: "", overview: "" }, l = {}, A = "idle", I = 0, V, q = 0, se = -1, z = !1, k = new mi(i), M = new Si(i), W = new Ai(i), j = new Ci(i), P = new ki(i), R = new Ii(i), D = new Mi(i), C = new Ni(i), u = new Bi(i), S = new Hi(i), x = new Di(i), X = new zi(i), K = new Fi(i), Z = new Oi(i), H = new Vi(i), F = new qi(i), ae = new Wi(i), xe = new Ui(i), $ = new ji(i);
  function Dt(n) {
    if (!h) throw 'Unable to find presentation root (<div class="reveal">).';
    if (s) throw "Reveal.js has already been initialized.";
    if (s = !0, l.wrapper = h, l.slides = h.querySelector(".slides"), !l.slides) throw 'Unable to find slides container (<div class="slides">).';
    return t = { ..._i, ...t, ...e, ...n, ...Rt() }, /print-pdf/gi.test(window.location.search) && (t.view = "print"), zt(), window.addEventListener("load", le, !1), H.load(t.plugins, t.dependencies).then(Ft), new Promise((d) => i.on("ready", d));
  }
  function zt() {
    t.embedded === !0 ? l.viewport = O(h, ".reveal-viewport") || h : (l.viewport = document.body, document.documentElement.classList.add("reveal-full-page")), l.viewport.classList.add("reveal-viewport");
  }
  function Ft() {
    s !== !1 && (r = !0, Vt(), qt(), Kt(), Wt(), jt(), ei(), Ke(), P.update(!0), Ot(), x.readURL(), setTimeout(() => {
      l.slides.classList.remove("no-transition"), l.wrapper.classList.add("ready"), _({
        type: "ready",
        data: {
          indexh: a,
          indexv: o,
          currentSlide: f
        }
      });
    }, 1));
  }
  function Ot() {
    const n = t.view === "print", d = t.view === "scroll" || t.view === "reader";
    (n || d) && (n ? ye() : xe.unbind(), l.viewport.classList.add("loading-scroll-mode"), n ? document.readyState === "complete" ? D.activate() : window.addEventListener("load", () => D.activate()) : R.activate());
  }
  function Vt() {
    t.showHiddenSlides || E(l.wrapper, 'section[data-visibility="hidden"]').forEach((n) => {
      const d = n.parentNode;
      d.childElementCount === 1 && /section/i.test(d.nodeName) ? d.remove() : n.remove();
    });
  }
  function qt() {
    l.slides.classList.add("no-transition"), fe ? l.wrapper.classList.add("no-hover") : l.wrapper.classList.remove("no-hover"), P.render(), M.render(), W.render(), X.render(), K.render(), $.render(), l.pauseOverlay = hi(l.wrapper, "div", "pause-overlay", t.controls ? '<button class="resume-button">Resume presentation</button>' : null), l.statusElement = Ut(), l.wrapper.setAttribute("role", "application");
  }
  function Ut() {
    let n = l.wrapper.querySelector(".aria-status");
    return n || (n = document.createElement("div"), n.style.position = "absolute", n.style.height = "1px", n.style.width = "1px", n.style.overflow = "hidden", n.style.clip = "rect( 1px, 1px, 1px, 1px )", n.classList.add("aria-status"), n.setAttribute("aria-live", "polite"), n.setAttribute("aria-atomic", "true"), l.wrapper.appendChild(n)), n;
  }
  function Te(n) {
    l.statusElement.textContent = n;
  }
  function me(n) {
    let d = "";
    if (n.nodeType === 3)
      d += n.textContent;
    else if (n.nodeType === 1) {
      let v = n.getAttribute("aria-hidden"), m = window.getComputedStyle(n).display === "none";
      v !== "true" && !m && Array.from(n.childNodes).forEach((b) => {
        d += me(b);
      });
    }
    return d = d.trim(), d === "" ? "" : d + " ";
  }
  function Wt() {
    setInterval(() => {
      (!R.isActive() && l.wrapper.scrollTop !== 0 || l.wrapper.scrollLeft !== 0) && (l.wrapper.scrollTop = 0, l.wrapper.scrollLeft = 0);
    }, 1e3);
  }
  function jt() {
    document.addEventListener("fullscreenchange", ke), document.addEventListener("webkitfullscreenchange", ke);
  }
  function Kt() {
    t.postMessage && window.addEventListener("message", mt, !1);
  }
  function Ke(n) {
    const d = { ...t };
    if (typeof n == "object" && ue(t, n), i.isReady() === !1) return;
    const v = l.wrapper.querySelectorAll(re).length;
    l.wrapper.classList.remove(d.transition), l.wrapper.classList.add(t.transition), l.wrapper.setAttribute("data-transition-speed", t.transitionSpeed), l.wrapper.setAttribute("data-background-transition", t.backgroundTransition), l.viewport.style.setProperty("--slide-width", typeof t.width == "string" ? t.width : t.width + "px"), l.viewport.style.setProperty("--slide-height", typeof t.height == "string" ? t.height : t.height + "px"), t.shuffle && Be(), Ve(l.wrapper, "embedded", t.embedded), Ve(l.wrapper, "rtl", t.rtl), Ve(l.wrapper, "center", t.center), t.pause === !1 && pe(), j.reset(), V && (V.destroy(), V = null), v > 1 && t.autoSlide && t.autoSlideStoppable && (V = new Ki(l.wrapper, () => Math.min(Math.max((Date.now() - se) / I, 0), 1)), V.on("click", oi), z = !1), t.navigationMode !== "default" ? l.wrapper.setAttribute("data-navigation-mode", t.navigationMode) : l.wrapper.removeAttribute("data-navigation-mode"), $.configure(t, d), ae.configure(t, d), Z.configure(t, d), X.configure(t, d), K.configure(t, d), S.configure(t, d), C.configure(t, d), M.configure(t, d), at();
  }
  function _e() {
    window.addEventListener("resize", wt, !1), t.touch && xe.bind(), t.keyboard && S.bind(), t.progress && K.bind(), t.respondToHashChanges && x.bind(), X.bind(), ae.bind(), l.slides.addEventListener("click", bt, !1), l.slides.addEventListener("transitionend", yt, !1), l.pauseOverlay.addEventListener("click", pe, !1), t.focusBodyOnPageVisibilityChange && document.addEventListener("visibilitychange", Et, !1);
  }
  function ye() {
    xe.unbind(), ae.unbind(), S.unbind(), X.unbind(), K.unbind(), x.unbind(), window.removeEventListener("resize", wt, !1), l.slides.removeEventListener("click", bt, !1), l.slides.removeEventListener("transitionend", yt, !1), l.pauseOverlay.removeEventListener("click", pe, !1);
  }
  function _t() {
    s = !1, r !== !1 && (ye(), we(), $.destroy(), ae.destroy(), F.destroy(), H.destroy(), Z.destroy(), X.destroy(), K.destroy(), P.destroy(), M.destroy(), W.destroy(), document.removeEventListener("fullscreenchange", ke), document.removeEventListener("webkitfullscreenchange", ke), document.removeEventListener("visibilitychange", Et, !1), window.removeEventListener("message", mt, !1), window.removeEventListener("load", le, !1), l.pauseOverlay && l.pauseOverlay.remove(), l.statusElement && l.statusElement.remove(), document.documentElement.classList.remove("reveal-full-page"), l.wrapper.classList.remove("ready", "center", "has-horizontal-slides", "has-vertical-slides"), l.wrapper.removeAttribute("data-transition-speed"), l.wrapper.removeAttribute("data-background-transition"), l.viewport.classList.remove("reveal-viewport"), l.viewport.style.removeProperty("--slide-width"), l.viewport.style.removeProperty("--slide-height"), l.slides.style.removeProperty("width"), l.slides.style.removeProperty("height"), l.slides.style.removeProperty("zoom"), l.slides.style.removeProperty("left"), l.slides.style.removeProperty("top"), l.slides.style.removeProperty("bottom"), l.slides.style.removeProperty("right"), l.slides.style.removeProperty("transform"), Array.from(l.wrapper.querySelectorAll(re)).forEach((n) => {
      n.style.removeProperty("display"), n.style.removeProperty("top"), n.removeAttribute("hidden"), n.removeAttribute("aria-hidden");
    }));
  }
  function $e(n, d, v) {
    h.addEventListener(n, d, v);
  }
  function Xe(n, d, v) {
    h.removeEventListener(n, d, v);
  }
  function Ie(n) {
    typeof n.layout == "string" && (w.layout = n.layout), typeof n.overview == "string" && (w.overview = n.overview), w.layout ? ie(l.slides, w.layout + " " + w.overview) : ie(l.slides, w.overview);
  }
  function _({ target: n = l.wrapper, type: d, data: v, bubbles: m = !0 }) {
    let b = document.createEvent("HTMLEvents", 1, 2);
    return b.initEvent(d, m, !0), ue(b, v), n.dispatchEvent(b), n === l.wrapper && Ge(d), b;
  }
  function Ye(n) {
    _({
      type: "slidechanged",
      data: {
        indexh: a,
        indexv: o,
        previousSlide: c,
        currentSlide: f,
        origin: n
      }
    });
  }
  function Ge(n, d) {
    if (t.postMessageEvents && window.parent !== window.self) {
      let v = {
        namespace: "reveal",
        eventName: n,
        state: pt()
      };
      ue(v, d), window.parent.postMessage(JSON.stringify(v), "*");
    }
  }
  function le() {
    if (l.wrapper && !D.isActive()) {
      const n = l.viewport.offsetWidth, d = l.viewport.offsetHeight;
      if (!t.disableLayout) {
        fe && !t.embedded && document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
        const v = R.isActive() ? be(n, d) : be(), m = y;
        Je(t.width, t.height), l.slides.style.width = v.width + "px", l.slides.style.height = v.height + "px", y = Math.min(v.presentationWidth / v.width, v.presentationHeight / v.height), y = Math.max(y, t.minScale), y = Math.min(y, t.maxScale), y === 1 || R.isActive() ? (l.slides.style.zoom = "", l.slides.style.left = "", l.slides.style.top = "", l.slides.style.bottom = "", l.slides.style.right = "", Ie({ layout: "" })) : (l.slides.style.zoom = "", l.slides.style.left = "50%", l.slides.style.top = "50%", l.slides.style.bottom = "auto", l.slides.style.right = "auto", Ie({ layout: "translate(-50%, -50%) scale(" + y + ")" }));
        const b = Array.from(l.wrapper.querySelectorAll(re));
        for (let L = 0, T = b.length; L < T; L++) {
          const B = b[L];
          B.style.display !== "none" && (t.center || B.classList.contains("center") ? B.classList.contains("stack") ? B.style.top = 0 : B.style.top = Math.max((v.height - B.scrollHeight) / 2, 0) + "px" : B.style.top = "");
        }
        m !== y && _({
          type: "resize",
          data: {
            oldScale: m,
            scale: y,
            size: v
          }
        });
      }
      $t(), l.viewport.style.setProperty("--slide-scale", y), l.viewport.style.setProperty("--viewport-width", n + "px"), l.viewport.style.setProperty("--viewport-height", d + "px"), R.layout(), K.update(), P.updateParallax(), u.isActive() && u.update();
    }
  }
  function Je(n, d) {
    E(l.slides, "section > .stretch, section > .r-stretch").forEach((v) => {
      let m = ui(v, d);
      if (/(img|video)/gi.test(v.nodeName)) {
        const b = v.naturalWidth || v.videoWidth, L = v.naturalHeight || v.videoHeight, T = Math.min(n / b, m / L);
        v.style.width = b * T + "px", v.style.height = L * T + "px";
      } else
        v.style.width = n + "px", v.style.height = m + "px";
    });
  }
  function $t() {
    if (l.wrapper && !t.disableLayout && !D.isActive() && typeof t.scrollActivationWidth == "number" && t.view !== "scroll") {
      const n = be();
      n.presentationWidth > 0 && n.presentationWidth <= t.scrollActivationWidth ? R.isActive() || (P.create(), R.activate()) : R.isActive() && R.deactivate();
    }
  }
  function be(n, d) {
    let v = t.width, m = t.height;
    t.disableLayout && (v = l.slides.offsetWidth, m = l.slides.offsetHeight);
    const b = {
      // Slide size
      width: v,
      height: m,
      // Presentation size
      presentationWidth: n || l.wrapper.offsetWidth,
      presentationHeight: d || l.wrapper.offsetHeight
    };
    return b.presentationWidth -= b.presentationWidth * t.margin, b.presentationHeight -= b.presentationHeight * t.margin, typeof b.width == "string" && /%$/.test(b.width) && (b.width = parseInt(b.width, 10) / 100 * b.presentationWidth), typeof b.height == "string" && /%$/.test(b.height) && (b.height = parseInt(b.height, 10) / 100 * b.presentationHeight), b;
  }
  function Qe(n, d) {
    typeof n == "object" && typeof n.setAttribute == "function" && n.setAttribute("data-previous-indexv", d || 0);
  }
  function Ze(n) {
    if (typeof n == "object" && typeof n.setAttribute == "function" && n.classList.contains("stack")) {
      const d = n.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
      return parseInt(n.getAttribute(d) || 0, 10);
    }
    return 0;
  }
  function ge(n = f) {
    return n && n.parentNode && !!n.parentNode.nodeName.match(/section/i);
  }
  function Xt(n = f) {
    return n.classList.contains(".stack") || n.querySelector("section") !== null;
  }
  function et() {
    return f && ge(f) ? !f.nextElementSibling : !1;
  }
  function tt() {
    return a === 0 && o === 0;
  }
  function Me() {
    return f ? !(f.nextElementSibling || ge(f) && f.parentNode.nextElementSibling) : !1;
  }
  function it() {
    if (t.pause) {
      const n = l.wrapper.classList.contains("paused");
      we(), l.wrapper.classList.add("paused"), n === !1 && _({ type: "paused" });
    }
  }
  function pe() {
    const n = l.wrapper.classList.contains("paused");
    l.wrapper.classList.remove("paused"), de(), n && _({ type: "resumed" });
  }
  function st(n) {
    typeof n == "boolean" ? n ? it() : pe() : ve() ? pe() : it();
  }
  function ve() {
    return l.wrapper.classList.contains("paused");
  }
  function Yt(n) {
    typeof n == "boolean" ? n ? W.show() : W.hide() : W.isVisible() ? W.hide() : W.show();
  }
  function Gt(n) {
    typeof n == "boolean" ? n ? Se() : Ee() : z ? Se() : Ee();
  }
  function Jt() {
    return !!(I && !z);
  }
  function Y(n, d, v, m) {
    if (_({
      type: "beforeslidechange",
      data: {
        indexh: n === void 0 ? a : n,
        indexv: d === void 0 ? o : d,
        origin: m
      }
    }).defaultPrevented) return;
    c = f;
    const L = l.wrapper.querySelectorAll(te);
    if (R.isActive()) {
      const G = R.getSlideByIndices(n, d);
      G && R.scrollToSlide(G);
      return;
    }
    if (L.length === 0) return;
    d === void 0 && !u.isActive() && (d = Ze(L[n])), c && c.parentNode && c.parentNode.classList.contains("stack") && Qe(c.parentNode, o);
    const T = p.concat();
    p.length = 0;
    let B = a || 0, ne = o || 0;
    a = nt(te, n === void 0 ? a : n), o = nt(kt, d === void 0 ? o : d);
    let Q = a !== B || o !== ne;
    Q || (c = null);
    let U = L[a], N = U.querySelectorAll("section");
    h.classList.toggle("is-vertical-slide", N.length > 1), f = N[o] || U;
    let ce = !1;
    Q && c && f && !u.isActive() && (A = "running", ce = Ne(c, f, B, ne), ce && l.slides.classList.add("disable-slide-transitions")), He(), le(), u.isActive() && u.update(), typeof v < "u" && C.goto(v), c && c !== f && (c.classList.remove("present"), c.setAttribute("aria-hidden", "true"), tt() && setTimeout(() => {
      ii().forEach((G) => {
        Qe(G, 0);
      });
    }, 0));
    e: for (let G = 0, li = p.length; G < li; G++) {
      for (let Ce = 0; Ce < T.length; Ce++)
        if (T[Ce] === p[G]) {
          T.splice(Ce, 1);
          continue e;
        }
      l.viewport.classList.add(p[G]), _({ type: p[G] });
    }
    for (; T.length; )
      l.viewport.classList.remove(T.pop());
    Q && Ye(m), (Q || !c) && (k.stopEmbeddedContent(c), k.startEmbeddedContent(f)), requestAnimationFrame(() => {
      Te(me(f));
    }), K.update(), X.update(), $.update(), P.update(), P.updateParallax(), M.update(), C.update(), x.writeURL(), de(), ce && (setTimeout(() => {
      l.slides.classList.remove("disable-slide-transitions");
    }, 0), t.autoAnimate && j.run(c, f));
  }
  function Ne(n, d, v, m) {
    return n.hasAttribute("data-auto-animate") && d.hasAttribute("data-auto-animate") && n.getAttribute("data-auto-animate-id") === d.getAttribute("data-auto-animate-id") && !(a > v || o > m ? d : n).hasAttribute("data-auto-animate-restart");
  }
  function Qt(n, d, v) {
    let m = a || 0;
    a = d, o = v;
    const b = f !== n;
    c = f, f = n, f && c && t.autoAnimate && Ne(c, f, m, o) && j.run(c, f), b && (c && (k.stopEmbeddedContent(c), k.stopEmbeddedContent(c.slideBackgroundElement)), k.startEmbeddedContent(f), k.startEmbeddedContent(f.slideBackgroundElement)), requestAnimationFrame(() => {
      Te(me(f));
    }), Ye();
  }
  function at() {
    ye(), _e(), le(), I = t.autoSlide, de(), P.create(), x.writeURL(), t.sortFragmentsOnSync === !0 && C.sortAll(), X.update(), K.update(), He(), $.update(), $.updateVisibility(), F.update(), P.update(!0), M.update(), k.formatEmbeddedContent(), t.autoPlayMedia === !1 ? k.stopEmbeddedContent(f, { unloadIframes: !1 }) : k.startEmbeddedContent(f), u.isActive() && u.layout();
  }
  function Zt(n = f) {
    P.sync(n), C.sync(n), k.load(n), P.update(), $.update();
  }
  function ei() {
    ee().forEach((n) => {
      E(n, "section").forEach((d, v) => {
        v > 0 && (d.classList.remove("present"), d.classList.remove("past"), d.classList.add("future"), d.setAttribute("aria-hidden", "true"));
      });
    });
  }
  function Be(n = ee()) {
    n.forEach((d, v) => {
      let m = n[Math.floor(Math.random() * n.length)];
      m.parentNode === d.parentNode && d.parentNode.insertBefore(d, m);
      let b = d.querySelectorAll("section");
      b.length && Be(b);
    });
  }
  function nt(n, d) {
    let v = E(l.wrapper, n), m = v.length, b = R.isActive() || D.isActive(), L = !1, T = !1;
    if (m) {
      t.loop && (d >= m && (L = !0), d %= m, d < 0 && (d = m + d, T = !0)), d = Math.max(Math.min(d, m - 1), 0);
      for (let U = 0; U < m; U++) {
        let N = v[U], ce = t.rtl && !ge(N);
        if (N.classList.remove("past"), N.classList.remove("present"), N.classList.remove("future"), N.setAttribute("hidden", ""), N.setAttribute("aria-hidden", "true"), N.querySelector("section") && N.classList.add("stack"), b) {
          N.classList.add("present");
          continue;
        }
        U < d ? (N.classList.add(ce ? "future" : "past"), t.fragments && rt(N)) : U > d ? (N.classList.add(ce ? "past" : "future"), t.fragments && ot(N)) : U === d && t.fragments && (L ? ot(N) : T && rt(N));
      }
      let B = v[d], ne = B.classList.contains("present");
      B.classList.add("present"), B.removeAttribute("hidden"), B.removeAttribute("aria-hidden"), ne || _({
        target: B,
        type: "visible",
        bubbles: !1
      });
      let Q = B.getAttribute("data-state");
      Q && (p = p.concat(Q.split(" ")));
    } else
      d = 0;
    return d;
  }
  function rt(n) {
    E(n, ".fragment").forEach((d) => {
      d.classList.add("visible"), d.classList.remove("current-fragment");
    });
  }
  function ot(n) {
    E(n, ".fragment.visible").forEach((d) => {
      d.classList.remove("visible", "current-fragment");
    });
  }
  function He() {
    let n = ee(), d = n.length, v, m;
    if (d && typeof a < "u") {
      let b = u.isActive() ? 10 : t.viewDistance;
      fe && (b = u.isActive() ? 6 : t.mobileViewDistance), D.isActive() && (b = Number.MAX_VALUE);
      for (let L = 0; L < d; L++) {
        let T = n[L], B = E(T, "section"), ne = B.length;
        if (v = Math.abs((a || 0) - L) || 0, t.loop && (v = Math.abs(((a || 0) - L) % (d - b)) || 0), v < b ? k.load(T) : k.unload(T), ne) {
          let Q = Ze(T);
          for (let U = 0; U < ne; U++) {
            let N = B[U];
            m = Math.abs(L === (a || 0) ? (o || 0) - U : U - Q), v + m < b ? k.load(N) : k.unload(N);
          }
        }
      }
      ut() ? l.wrapper.classList.add("has-vertical-slides") : l.wrapper.classList.remove("has-vertical-slides"), ht() ? l.wrapper.classList.add("has-horizontal-slides") : l.wrapper.classList.remove("has-horizontal-slides");
    }
  }
  function J({ includeFragments: n = !1 } = {}) {
    let d = l.wrapper.querySelectorAll(te), v = l.wrapper.querySelectorAll(kt), m = {
      left: a > 0,
      right: a < d.length - 1,
      up: o > 0,
      down: o < v.length - 1
    };
    if (t.loop && (d.length > 1 && (m.left = !0, m.right = !0), v.length > 1 && (m.up = !0, m.down = !0)), d.length > 1 && t.navigationMode === "linear" && (m.right = m.right || m.down, m.left = m.left || m.up), n === !0) {
      let b = C.availableRoutes();
      m.left = m.left || b.prev, m.up = m.up || b.prev, m.down = m.down || b.next, m.right = m.right || b.next;
    }
    if (t.rtl) {
      let b = m.left;
      m.left = m.right, m.right = b;
    }
    return m;
  }
  function lt(n = f) {
    let d = ee(), v = 0;
    e: for (let m = 0; m < d.length; m++) {
      let b = d[m], L = b.querySelectorAll("section");
      for (let T = 0; T < L.length; T++) {
        if (L[T] === n)
          break e;
        L[T].dataset.visibility !== "uncounted" && v++;
      }
      if (b === n)
        break;
      b.classList.contains("stack") === !1 && b.dataset.visibility !== "uncounted" && v++;
    }
    return v;
  }
  function ti() {
    let n = ft(), d = lt();
    if (f) {
      let v = f.querySelectorAll(".fragment");
      if (v.length > 0) {
        let m = f.querySelectorAll(".fragment.visible");
        d += m.length / v.length * 0.9;
      }
    }
    return Math.min(d / (n - 1), 1);
  }
  function dt(n) {
    let d = a, v = o, m;
    if (n)
      if (R.isActive())
        d = parseInt(n.getAttribute("data-index-h"), 10), n.getAttribute("data-index-v") && (v = parseInt(n.getAttribute("data-index-v"), 10));
      else {
        let b = ge(n), L = b ? n.parentNode : n, T = ee();
        d = Math.max(T.indexOf(L), 0), v = void 0, b && (v = Math.max(E(n.parentNode, "section").indexOf(n), 0));
      }
    if (!n && f && f.querySelectorAll(".fragment").length > 0) {
      let L = f.querySelector(".current-fragment");
      L && L.hasAttribute("data-fragment-index") ? m = parseInt(L.getAttribute("data-fragment-index"), 10) : m = f.querySelectorAll(".fragment.visible").length - 1;
    }
    return { h: d, v, f: m };
  }
  function De() {
    return E(l.wrapper, re + ':not(.stack):not([data-visibility="uncounted"])');
  }
  function ee() {
    return E(l.wrapper, te);
  }
  function ct() {
    return E(l.wrapper, ".slides>section>section");
  }
  function ii() {
    return E(l.wrapper, te + ".stack");
  }
  function ht() {
    return ee().length > 1;
  }
  function ut() {
    return ct().length > 1;
  }
  function si() {
    return De().map((n) => {
      let d = {};
      for (let v = 0; v < n.attributes.length; v++) {
        let m = n.attributes[v];
        d[m.name] = m.value;
      }
      return d;
    });
  }
  function ft() {
    return De().length;
  }
  function gt(n, d) {
    let v = ee()[n], m = v && v.querySelectorAll("section");
    return m && m.length && typeof d == "number" ? m ? m[d] : void 0 : v;
  }
  function ai(n, d) {
    let v = typeof n == "number" ? gt(n, d) : n;
    if (v)
      return v.slideBackgroundElement;
  }
  function pt() {
    let n = dt();
    return {
      indexh: n.h,
      indexv: n.v,
      indexf: n.f,
      paused: ve(),
      overview: u.isActive()
    };
  }
  function ni(n) {
    if (typeof n == "object") {
      Y(he(n.indexh), he(n.indexv), he(n.indexf));
      let d = he(n.paused), v = he(n.overview);
      typeof d == "boolean" && d !== ve() && st(d), typeof v == "boolean" && v !== u.isActive() && u.toggle(v);
    }
  }
  function de() {
    if (we(), f && t.autoSlide !== !1) {
      let n = f.querySelector(".current-fragment[data-autoslide]"), d = n ? n.getAttribute("data-autoslide") : null, v = f.parentNode ? f.parentNode.getAttribute("data-autoslide") : null, m = f.getAttribute("data-autoslide");
      d ? I = parseInt(d, 10) : m ? I = parseInt(m, 10) : v ? I = parseInt(v, 10) : (I = t.autoSlide, f.querySelectorAll(".fragment").length === 0 && E(f, "video, audio").forEach((b) => {
        b.hasAttribute("data-autoplay") && I && b.duration * 1e3 / b.playbackRate > I && (I = b.duration * 1e3 / b.playbackRate + 1e3);
      })), I && !z && !ve() && !u.isActive() && (!Me() || C.availableRoutes().next || t.loop === !0) && (q = setTimeout(() => {
        typeof t.autoSlideMethod == "function" ? t.autoSlideMethod() : Oe(), de();
      }, I), se = Date.now()), V && V.setPlaying(q !== -1);
    }
  }
  function we() {
    clearTimeout(q), q = -1;
  }
  function Ee() {
    I && !z && (z = !0, _({ type: "autoslidepaused" }), clearTimeout(q), V && V.setPlaying(!1));
  }
  function Se() {
    I && z && (z = !1, _({ type: "autoslideresumed" }), de());
  }
  function Ae({ skipFragments: n = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, R.isActive()) return R.prev();
    t.rtl ? (u.isActive() || n || C.next() === !1) && J().left && Y(a + 1, t.navigationMode === "grid" ? o : void 0) : (u.isActive() || n || C.prev() === !1) && J().left && Y(a - 1, t.navigationMode === "grid" ? o : void 0);
  }
  function Re({ skipFragments: n = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, R.isActive()) return R.next();
    t.rtl ? (u.isActive() || n || C.prev() === !1) && J().right && Y(a - 1, t.navigationMode === "grid" ? o : void 0) : (u.isActive() || n || C.next() === !1) && J().right && Y(a + 1, t.navigationMode === "grid" ? o : void 0);
  }
  function ze({ skipFragments: n = !1 } = {}) {
    if (R.isActive()) return R.prev();
    (u.isActive() || n || C.prev() === !1) && J().up && Y(a, o - 1);
  }
  function Fe({ skipFragments: n = !1 } = {}) {
    if (g.hasNavigatedVertically = !0, R.isActive()) return R.next();
    (u.isActive() || n || C.next() === !1) && J().down && Y(a, o + 1);
  }
  function vt({ skipFragments: n = !1 } = {}) {
    if (R.isActive()) return R.prev();
    if (n || C.prev() === !1)
      if (J().up)
        ze({ skipFragments: n });
      else {
        let d;
        if (t.rtl ? d = E(l.wrapper, te + ".future").pop() : d = E(l.wrapper, te + ".past").pop(), d && d.classList.contains("stack")) {
          let v = d.querySelectorAll("section").length - 1 || void 0, m = a - 1;
          Y(m, v);
        } else t.rtl ? Re({ skipFragments: n }) : Ae({ skipFragments: n });
      }
  }
  function Oe({ skipFragments: n = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, g.hasNavigatedVertically = !0, R.isActive()) return R.next();
    if (n || C.next() === !1) {
      let d = J();
      d.down && d.right && t.loop && et() && (d.down = !1), d.down ? Fe({ skipFragments: n }) : t.rtl ? Ae({ skipFragments: n }) : Re({ skipFragments: n });
    }
  }
  function ri(n) {
    t.autoSlideStoppable && Ee();
  }
  function mt(n) {
    let d = n.data;
    if (typeof d == "string" && d.charAt(0) === "{" && d.charAt(d.length - 1) === "}" && (d = JSON.parse(d), d.method && typeof i[d.method] == "function"))
      if (bi.test(d.method) === !1) {
        const v = i[d.method].apply(i, d.args);
        Ge("callback", { method: d.method, result: v });
      } else
        console.warn('reveal.js: "' + d.method + '" is is blacklisted from the postMessage API');
  }
  function yt(n) {
    A === "running" && /section/gi.test(n.target.nodeName) && (A = "idle", _({
      type: "slidetransitionend",
      data: { indexh: a, indexv: o, previousSlide: c, currentSlide: f }
    }));
  }
  function bt(n) {
    const d = O(n.target, 'a[href^="#"]');
    if (d) {
      const v = d.getAttribute("href"), m = x.getIndicesFromHash(v);
      m && (i.slide(m.h, m.v, m.f), n.preventDefault());
    }
  }
  function wt(n) {
    le();
  }
  function Et(n) {
    document.hidden === !1 && document.activeElement !== document.body && (typeof document.activeElement.blur == "function" && document.activeElement.blur(), document.body.focus());
  }
  function ke(n) {
    (document.fullscreenElement || document.webkitFullscreenElement) === l.wrapper && (n.stopImmediatePropagation(), setTimeout(() => {
      i.layout(), i.focus.focus();
    }, 1));
  }
  function oi(n) {
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
    left: Ae,
    right: Re,
    up: ze,
    down: Fe,
    prev: vt,
    next: Oe,
    // Navigation aliases
    navigateLeft: Ae,
    navigateRight: Re,
    navigateUp: ze,
    navigateDown: Fe,
    navigatePrev: vt,
    navigateNext: Oe,
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
    layout: le,
    // Randomizes the order of slides
    shuffle: Be,
    // Returns an object with the available routes as booleans (left/right/top/bottom)
    availableRoutes: J,
    // Returns an object with the available fragments as booleans (prev/next)
    availableFragments: C.availableRoutes.bind(C),
    // Toggles a help overlay with keyboard shortcuts
    toggleHelp: F.toggleHelp.bind(F),
    // Toggles the overview mode on/off
    toggleOverview: u.toggle.bind(u),
    // Toggles the scroll view on/off
    toggleScrollView: R.toggle.bind(R),
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
    isSpeakerNotes: $.isSpeakerNotesWindow.bind($),
    isOverview: u.isActive.bind(u),
    isFocused: ae.isFocused.bind(ae),
    isOverlayOpen: F.isOpen.bind(F),
    isScrollView: R.isActive.bind(R),
    isPrintView: D.isActive.bind(D),
    // Checks if reveal.js has been loaded and is ready for use
    isReady: () => r,
    // Slide preloading
    loadSlide: k.load.bind(k),
    unloadSlide: k.unload.bind(k),
    // Start/stop all media inside of the current slide
    startEmbeddedContent: () => k.startEmbeddedContent(f),
    stopEmbeddedContent: () => k.stopEmbeddedContent(f, { unloadIframes: !1 }),
    // Preview management
    showIframePreview: F.showIframePreview.bind(F),
    showMediaPreview: F.showMediaPreview.bind(F),
    showPreview: F.showIframePreview.bind(F),
    // deprecated in favor of showIframePreview
    hidePreview: F.close.bind(F),
    // Adds or removes all internal event listeners
    addEventListeners: _e,
    removeEventListeners: ye,
    dispatchEvent: _,
    // Facility for persisting and restoring the presentation state
    getState: pt,
    setState: ni,
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
    getPreviousSlide: () => c,
    // Returns the current slide element
    getCurrentSlide: () => f,
    // Returns the slide background element at the specified index
    getSlideBackground: ai,
    // Returns the speaker notes string for a slide, or null
    getSlideNotes: $.getSlideNotes.bind($),
    // Returns an Array of all slides
    getSlides: De,
    // Returns an array with all horizontal/vertical slides in the deck
    getHorizontalSlides: ee,
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
    getScale: () => y,
    // Returns the current configuration object
    getConfig: () => t,
    // Helper method, retrieves query string as a key:value map
    getQueryHash: Rt,
    // Returns the path to the current slide as represented in the URL
    getSlidePath: x.getHash.bind(x),
    // Returns reveal.js DOM elements
    getRevealElement: () => h,
    getSlidesElement: () => l.slides,
    getViewportElement: () => l.viewport,
    getBackgroundsElement: () => P.element,
    // API for registering and retrieving plugins
    registerPlugin: H.registerPlugin.bind(H),
    hasPlugin: H.hasPlugin.bind(H),
    getPlugin: H.getPlugin.bind(H),
    getPlugins: H.getRegisteredPlugins.bind(H)
  };
  return ue(i, {
    ...St,
    // Methods for announcing content to screen readers
    announceStatus: Te,
    getStatusText: me,
    // Controllers
    focus: ae,
    scroll: R,
    progress: K,
    controls: X,
    location: x,
    overview: u,
    keyboard: S,
    fragments: C,
    backgrounds: P,
    slideContent: k,
    slideNumber: M,
    onUserInput: ri,
    closeOverlay: F.close.bind(F),
    updateSlidesVisibility: He,
    layoutSlideContents: Je,
    transformSlides: Ie,
    cueAutoSlide: de,
    cancelAutoSlide: we
  }), St;
}
let oe = Bt, Ht = [];
oe.initialize = (h) => (Object.assign(oe, new Bt(document.querySelector(".reveal"), h)), Ht.map((e) => e(oe)), oe.initialize());
["configure", "on", "off", "addEventListener", "removeEventListener", "registerPlugin"].forEach(
  (h) => {
    oe[h] = (...e) => {
      Ht.push((i) => i[h].call(null, ...e));
    };
  }
);
oe.isReady = () => !1;
oe.VERSION = Nt;
export {
  oe as default
};
