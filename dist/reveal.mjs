var vi = Object.defineProperty;
var mi = (h, e, t) => e in h ? vi(h, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : h[e] = t;
var Pt = (h, e, t) => (mi(h, typeof e != "symbol" ? e + "" : e, t), t);
const ue = (h, e) => {
  for (let t in e)
    h[t] = e[t];
  return h;
}, E = (h, e) => Array.from(h.querySelectorAll(e)), qe = (h, e, t) => {
  t ? h.classList.add(e) : h.classList.remove(e);
}, he = (h) => {
  if (typeof h == "string") {
    if (h === "null")
      return null;
    if (h === "true")
      return !0;
    if (h === "false")
      return !1;
    if (h.match(/^-?[\d\.]+$/))
      return parseFloat(h);
  }
  return h;
}, ie = (h, e) => {
  h.style.transform = e;
}, Pe = (h, e) => {
  let t = h.matches || h.matchesSelector || h.msMatchesSelector;
  return !!(t && t.call(h, e));
}, F = (h, e) => {
  if (typeof h.closest == "function")
    return h.closest(e);
  for (; h; ) {
    if (Pe(h, e))
      return h;
    h = h.parentNode;
  }
  return null;
}, Ht = (h) => {
  h = h || document.documentElement;
  let e = h.requestFullscreen || h.webkitRequestFullscreen || h.webkitRequestFullScreen || h.mozRequestFullScreen || h.msRequestFullscreen;
  e && e.apply(h);
}, yi = (h, e, t, i = "") => {
  let s = h.querySelectorAll("." + t);
  for (let n = 0; n < s.length; n++) {
    let o = s[n];
    if (o.parentNode === h)
      return o;
  }
  let d = document.createElement(e);
  return d.className = t, d.innerHTML = i, h.appendChild(d), d;
}, We = (h) => {
  let e = document.createElement("style");
  return e.type = "text/css", h && h.length > 0 && (e.styleSheet ? e.styleSheet.cssText = h : e.appendChild(document.createTextNode(h))), document.head.appendChild(e), e;
}, xt = () => {
  let h = {};
  location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (e) => {
    h[e.split("=").shift()] = e.split("=").pop();
  });
  for (let e in h) {
    let t = h[e];
    h[e] = he(unescape(t));
  }
  return typeof h.dependencies < "u" && delete h.dependencies, h;
}, bi = (h, e = 0) => {
  if (h) {
    let t, i = h.style.height;
    return h.style.height = "0px", h.parentNode.style.height = "auto", t = e - h.parentNode.offsetHeight, h.style.height = i + "px", h.parentNode.style.removeProperty("height"), t;
  }
  return e;
}, wi = {
  mp4: "video/mp4",
  m4a: "video/mp4",
  ogv: "video/ogg",
  mpeg: "video/mpeg",
  webm: "video/webm"
}, Ei = (h = "") => wi[h.split(".").pop()], Si = (h = "") => encodeURI(h).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(
  /[!'()*]/g,
  (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
), Dt = navigator.userAgent, fe = /(iphone|ipod|ipad|android)/gi.test(Dt) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1, zt = /android/gi.test(Dt);
var Ai = function(h) {
  if (h) {
    var e = function(u) {
      return [].slice.call(u);
    }, t = 0, i = 1, s = 2, d = 3, n = [], o = null, c = "requestAnimationFrame" in h ? function() {
      h.cancelAnimationFrame(o), o = h.requestAnimationFrame(function() {
        return g(n.filter(function(u) {
          return u.dirty && u.active;
        }));
      });
    } : function() {
    }, f = function(u) {
      return function() {
        n.forEach(function(S) {
          return S.dirty = u;
        }), c();
      };
    }, g = function(u) {
      u.filter(function(N) {
        return !N.styleComputed;
      }).forEach(function(N) {
        N.styleComputed = r(N);
      }), u.filter(A).forEach(T);
      var S = u.filter(w);
      S.forEach(y), S.forEach(function(N) {
        T(N), v(N);
      }), S.forEach(V);
    }, v = function(u) {
      return u.dirty = t;
    }, y = function(u) {
      u.availableWidth = u.element.parentNode.clientWidth, u.currentWidth = u.element.scrollWidth, u.previousFontSize = u.currentFontSize, u.currentFontSize = Math.min(Math.max(u.minSize, u.availableWidth / u.currentWidth * u.previousFontSize), u.maxSize), u.whiteSpace = u.multiLine && u.currentFontSize === u.minSize ? "normal" : "nowrap";
    }, w = function(u) {
      return u.dirty !== s || u.dirty === s && u.element.parentNode.clientWidth !== u.availableWidth;
    }, r = function(u) {
      var S = h.getComputedStyle(u.element, null);
      return u.currentFontSize = parseFloat(S.getPropertyValue("font-size")), u.display = S.getPropertyValue("display"), u.whiteSpace = S.getPropertyValue("white-space"), !0;
    }, A = function(u) {
      var S = !1;
      return !u.preStyleTestCompleted && (/inline-/.test(u.display) || (S = !0, u.display = "inline-block"), u.whiteSpace !== "nowrap" && (S = !0, u.whiteSpace = "nowrap"), u.preStyleTestCompleted = !0, S);
    }, T = function(u) {
      u.element.style.whiteSpace = u.whiteSpace, u.element.style.display = u.display, u.element.style.fontSize = u.currentFontSize + "px";
    }, V = function(u) {
      u.element.dispatchEvent(new CustomEvent("fit", { detail: { oldValue: u.previousFontSize, newValue: u.currentFontSize, scaleFactor: u.currentFontSize / u.previousFontSize } }));
    }, O = function(u, S) {
      return function() {
        u.dirty = S, u.active && c();
      };
    }, se = function(u) {
      return function() {
        n = n.filter(function(S) {
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
    }, I = function(u) {
      u.observeMutations && (u.observer = new MutationObserver(O(u, i)), u.observer.observe(u.element, u.observeMutations));
    }, U = { minSize: 16, maxSize: 512, multiLine: !0, observeMutations: "MutationObserver" in h && { subtree: !0, childList: !0, characterData: !0 } }, W = null, P = function() {
      h.clearTimeout(W), W = h.setTimeout(f(s), L.observeWindowDelay);
    }, R = ["resize", "orientationchange"];
    return Object.defineProperty(L, "observeWindow", { set: function(u) {
      var S = "".concat(u ? "add" : "remove", "EventListener");
      R.forEach(function(N) {
        h[S](N, P);
      });
    } }), L.observeWindow = !0, L.observeWindowDelay = 100, L.fitAll = f(d), L;
  }
  function D(u, S) {
    var N = Object.assign({}, U, S), $ = u.map(function(j) {
      var Z = Object.assign({}, N, { element: j, active: !0 });
      return function(H) {
        H.originalStyle = { whiteSpace: H.element.style.whiteSpace, display: H.element.style.display, fontSize: H.element.style.fontSize }, I(H), H.newbie = !0, H.dirty = !0, n.push(H);
      }(Z), { element: j, fit: O(Z, d), unfreeze: z(Z), freeze: k(Z), unsubscribe: se(Z) };
    });
    return c(), $;
  }
  function L(u) {
    var S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return typeof u == "string" ? D(e(document.querySelectorAll(u)), S) : D([u], S)[0];
  }
}(typeof window > "u" ? null : window);
class Ri {
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
    let t = this.Reveal.getConfig().preloadIframes;
    return typeof t != "boolean" && (t = e.hasAttribute("data-preload")), t;
  }
  /**
   * Called when the given slide is within the configured view
   * distance. Shows the slide element and loads any content
   * that is set to load lazily (data-src).
   *
   * @param {HTMLElement} slide Slide to show
   */
  load(e, t = {}) {
    e.style.display = this.Reveal.getConfig().display, E(e, "img[data-src], video[data-src], audio[data-src], iframe[data-src]").forEach((s) => {
      (s.tagName !== "IFRAME" || this.shouldPreload(s)) && (s.setAttribute("src", s.getAttribute("data-src")), s.setAttribute("data-lazy-loaded", ""), s.removeAttribute("data-src"));
    }), E(e, "video, audio").forEach((s) => {
      let d = 0;
      E(s, "source[data-src]").forEach((n) => {
        n.setAttribute("src", n.getAttribute("data-src")), n.removeAttribute("data-src"), n.setAttribute("data-lazy-loaded", ""), d += 1;
      }), fe && s.tagName === "VIDEO" && s.setAttribute("playsinline", ""), d > 0 && s.load();
    });
    let i = e.slideBackgroundElement;
    if (i) {
      i.style.display = "block";
      let s = e.slideBackgroundContentElement, d = e.getAttribute("data-background-iframe");
      if (i.hasAttribute("data-loaded") === !1) {
        i.setAttribute("data-loaded", "true");
        let o = e.getAttribute("data-background-image"), c = e.getAttribute("data-background-video"), f = e.hasAttribute("data-background-video-loop"), g = e.hasAttribute("data-background-video-muted");
        if (o)
          /^data:/.test(o.trim()) ? s.style.backgroundImage = `url(${o.trim()})` : s.style.backgroundImage = o.split(",").map((v) => {
            let y = decodeURI(v.trim());
            return `url(${Si(y)})`;
          }).join(",");
        else if (c && !this.Reveal.isSpeakerNotes()) {
          let v = document.createElement("video");
          f && v.setAttribute("loop", ""), g && (v.muted = !0), fe && (v.muted = !0, v.setAttribute("playsinline", "")), c.split(",").forEach((y) => {
            const w = document.createElement("source");
            w.setAttribute("src", y);
            let r = Ei(y);
            r && w.setAttribute("type", r), v.appendChild(w);
          }), s.appendChild(v);
        } else if (d && t.excludeIframes !== !0) {
          let v = document.createElement("iframe");
          v.setAttribute("allowfullscreen", ""), v.setAttribute("mozallowfullscreen", ""), v.setAttribute("webkitallowfullscreen", ""), v.setAttribute("allow", "autoplay"), v.setAttribute("data-src", d), v.style.width = "100%", v.style.height = "100%", v.style.maxHeight = "100%", v.style.maxWidth = "100%", s.appendChild(v);
        }
      }
      let n = s.querySelector("iframe[data-src]");
      n && this.shouldPreload(i) && !/autoplay=(1|true|yes)/gi.test(d) && n.getAttribute("src") !== d && n.setAttribute("src", d);
    }
    this.layout(e);
  }
  /**
   * Applies JS-dependent layout helpers for the scope.
   */
  layout(e) {
    Array.from(e.querySelectorAll(".r-fit-text")).forEach((t) => {
      Ai(t, {
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
    let t = this.Reveal.getSlideBackground(e);
    t && (t.style.display = "none", E(t, "iframe[src]").forEach((i) => {
      i.removeAttribute("src");
    })), E(e, "video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]").forEach((i) => {
      i.setAttribute("data-src", i.getAttribute("src")), i.removeAttribute("src");
    }), E(e, "video[data-lazy-loaded] source[src], audio source[src]").forEach((i) => {
      i.setAttribute("data-src", i.getAttribute("src")), i.removeAttribute("src");
    });
  }
  /**
   * Enforces origin-specific format rules for embedded media.
   */
  formatEmbeddedContent() {
    let e = (t, i, s) => {
      E(this.Reveal.getSlidesElement(), "iframe[" + t + '*="' + i + '"]').forEach((d) => {
        let n = d.getAttribute(t);
        n && n.indexOf(s) === -1 && d.setAttribute(t, n + (/\?/.test(n) ? "&" : "?") + s);
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
    e && !this.Reveal.isSpeakerNotes() && (E(e, 'img[src$=".gif"]').forEach((t) => {
      t.setAttribute("src", t.getAttribute("src"));
    }), E(e, "video, audio").forEach((t) => {
      if (F(t, ".fragment") && !F(t, ".fragment.visible"))
        return;
      let i = this.Reveal.getConfig().autoPlayMedia;
      if (typeof i != "boolean" && (i = t.hasAttribute("data-autoplay") || !!F(t, ".slide-background")), i && typeof t.play == "function")
        if (t.readyState > 1)
          this.startEmbeddedMedia({ target: t });
        else if (fe) {
          let s = t.play();
          s && typeof s.catch == "function" && t.controls === !1 && s.catch(() => {
            t.controls = !0, t.addEventListener("play", () => {
              t.controls = !1;
            });
          });
        } else
          t.removeEventListener("loadeddata", this.startEmbeddedMedia), t.addEventListener("loadeddata", this.startEmbeddedMedia);
    }), E(e, "iframe[src]").forEach((t) => {
      F(t, ".fragment") && !F(t, ".fragment.visible") || this.startEmbeddedIframe({ target: t });
    }), E(e, "iframe[data-src]").forEach((t) => {
      F(t, ".fragment") && !F(t, ".fragment.visible") || t.getAttribute("src") !== t.getAttribute("data-src") && (t.removeEventListener("load", this.startEmbeddedIframe), t.addEventListener("load", this.startEmbeddedIframe), t.setAttribute("src", t.getAttribute("data-src")));
    }));
  }
  /**
   * Starts playing an embedded video/audio element after
   * it has finished loading.
   *
   * @param {object} event
   */
  startEmbeddedMedia(e) {
    let t = !!F(e.target, "html"), i = !!F(e.target, ".present");
    t && i && (e.target.paused || e.target.ended) && (e.target.currentTime = 0, e.target.play()), e.target.removeEventListener("loadeddata", this.startEmbeddedMedia);
  }
  /**
   * "Starts" the content of an embedded iframe using the
   * postMessage API.
   *
   * @param {object} event
   */
  startEmbeddedIframe(e) {
    let t = e.target;
    if (t && t.contentWindow) {
      let i = !!F(e.target, "html"), s = !!F(e.target, ".present");
      if (i && s) {
        let d = this.Reveal.getConfig().autoPlayMedia;
        typeof d != "boolean" && (d = t.hasAttribute("data-autoplay") || !!F(t, ".slide-background")), /youtube\.com\/embed\//.test(t.getAttribute("src")) && d ? t.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*") : /player\.vimeo\.com\//.test(t.getAttribute("src")) && d ? t.contentWindow.postMessage('{"method":"play"}', "*") : t.contentWindow.postMessage("slide:start", "*");
      }
    }
  }
  /**
   * Stop playback of any embedded content inside of
   * the targeted slide.
   *
   * @param {HTMLElement} element
   */
  stopEmbeddedContent(e, t = {}) {
    t = ue({
      // Defaults
      unloadIframes: !0
    }, t), e && e.parentNode && (E(e, "video, audio").forEach((i) => {
      !i.hasAttribute("data-ignore") && typeof i.pause == "function" && (i.setAttribute("data-paused-by-reveal", ""), i.pause());
    }), E(e, "iframe").forEach((i) => {
      i.contentWindow && i.contentWindow.postMessage("slide:stop", "*"), i.removeEventListener("load", this.startEmbeddedIframe);
    }), E(e, 'iframe[src*="youtube.com/embed/"]').forEach((i) => {
      !i.hasAttribute("data-ignore") && i.contentWindow && typeof i.contentWindow.postMessage == "function" && i.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
    }), E(e, 'iframe[src*="player.vimeo.com/"]').forEach((i) => {
      !i.hasAttribute("data-ignore") && i.contentWindow && typeof i.contentWindow.postMessage == "function" && i.contentWindow.postMessage('{"method":"pause"}', "*");
    }), t.unloadIframes === !0 && E(e, "iframe[data-src]").forEach((i) => {
      i.setAttribute("src", "about:blank"), i.removeAttribute("src");
    }));
  }
}
const re = ".slides section", te = ".slides>section", Tt = ".slides>section.present>section", ki = ".backgrounds>.slide-background", Li = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/, It = /fade-(down|up|right|left|out|in-then-out|in-then-semi-out)|semi-fade-out|current-visible|shrink|grow/, Ci = "h.v", Pi = "h/v", je = "c", Ft = "c/t";
class xi {
  constructor(e) {
    this.Reveal = e;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "slide-number", this.Reveal.getRevealElement().appendChild(this.element);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
    let i = "none";
    e.slideNumber && !this.Reveal.isPrintView() && (e.showSlideNumber === "all" || e.showSlideNumber === "speaker" && this.Reveal.isSpeakerNotes()) && (i = "block"), this.element.style.display = i;
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
    let t = this.Reveal.getConfig(), i, s = Ci;
    if (typeof t.slideNumber == "function")
      i = t.slideNumber(e);
    else {
      typeof t.slideNumber == "string" && (s = t.slideNumber), !/c/.test(s) && this.Reveal.getHorizontalSlides().length === 1 && (s = je);
      let n = e && e.dataset.visibility === "uncounted" ? 0 : 1;
      switch (i = [], s) {
        case je:
          i.push(this.Reveal.getSlidePastCount(e) + n);
          break;
        case Ft:
          i.push(this.Reveal.getSlidePastCount(e) + n, "/", this.Reveal.getTotalSlides());
          break;
        default:
          let o = this.Reveal.getIndices(e);
          i.push(o.h + n);
          let c = s === Pi ? "/" : ".";
          this.Reveal.isVerticalSlide(e) && i.push(c, o.v + 1);
      }
    }
    let d = "#" + this.Reveal.location.getHash(e);
    return this.formatNumber(i[0], i[1], i[2], d);
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
  formatNumber(e, t, i, s = "#" + this.Reveal.location.getHash()) {
    return typeof i == "number" && !isNaN(i) ? `<a href="${s}">
					<span class="slide-number-a">${e}</span>
					<span class="slide-number-delimiter">${t}</span>
					<span class="slide-number-b">${i}</span>
					</a>` : `<a href="${s}">
					<span class="slide-number-a">${e}</span>
					</a>`;
  }
  destroy() {
    this.element.remove();
  }
}
class Ti {
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
    let e = this.jumpInput.value.trim(""), t;
    if (/^\d+$/.test(e)) {
      const i = this.Reveal.getConfig().slideNumber;
      if (i === je || i === Ft) {
        const s = this.Reveal.getSlides()[parseInt(e, 10) - 1];
        s && (t = this.Reveal.getIndices(s));
      }
    }
    return t || (/^\d+\.\d+$/.test(e) && (e = e.replace(".", "/")), t = this.Reveal.location.getIndicesFromHash(e, { oneBasedIndex: !0 })), !t && /\S+/i.test(e) && e.length > 1 && (t = this.search(e)), t && e !== "" ? (this.Reveal.slide(t.h, t.v, t.f), !0) : (this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), !1);
  }
  jumpAfter(e) {
    clearTimeout(this.jumpTimeout), this.jumpTimeout = setTimeout(() => this.jump(), e);
  }
  /**
   * A lofi search that looks for the given query in all
   * of our slides and returns the first match.
   */
  search(e) {
    const t = new RegExp("\\b" + e.trim() + "\\b", "i"), i = this.Reveal.getSlides().find((s) => t.test(s.innerText));
    return i ? this.Reveal.getIndices(i) : null;
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
const _e = (h) => {
  let e = h.match(/^#([0-9a-f]{3})$/i);
  if (e && e[1])
    return e = e[1], {
      r: parseInt(e.charAt(0), 16) * 17,
      g: parseInt(e.charAt(1), 16) * 17,
      b: parseInt(e.charAt(2), 16) * 17
    };
  let t = h.match(/^#([0-9a-f]{6})$/i);
  if (t && t[1])
    return t = t[1], {
      r: parseInt(t.slice(0, 2), 16),
      g: parseInt(t.slice(2, 4), 16),
      b: parseInt(t.slice(4, 6), 16)
    };
  let i = h.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (i)
    return {
      r: parseInt(i[1], 10),
      g: parseInt(i[2], 10),
      b: parseInt(i[3], 10)
    };
  let s = h.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
  return s ? {
    r: parseInt(s[1], 10),
    g: parseInt(s[2], 10),
    b: parseInt(s[3], 10),
    a: parseFloat(s[4])
  } : null;
}, Ii = (h) => (typeof h == "string" && (h = _e(h)), h ? (h.r * 299 + h.g * 587 + h.b * 114) / 1e3 : null);
class Ni {
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
      let t = this.createBackground(e, this.element);
      E(e, "section").forEach((i) => {
        this.createBackground(i, t), t.classList.add("stack");
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
  createBackground(e, t) {
    let i = document.createElement("div");
    i.className = "slide-background " + e.className.replace(/present|past|future/, "");
    let s = document.createElement("div");
    return s.className = "slide-background-content", i.appendChild(s), t.appendChild(i), e.slideBackgroundElement = i, e.slideBackgroundContentElement = s, this.sync(e), i;
  }
  /**
   * Renders all of the visual properties of a slide background
   * based on the various background attributes.
   *
   * @param {HTMLElement} slide
   */
  sync(e) {
    const t = e.slideBackgroundElement, i = e.slideBackgroundContentElement, s = {
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
    }, d = e.hasAttribute("data-preload");
    e.classList.remove("has-dark-background"), e.classList.remove("has-light-background"), t.removeAttribute("data-loaded"), t.removeAttribute("data-background-hash"), t.removeAttribute("data-background-size"), t.removeAttribute("data-background-transition"), t.style.backgroundColor = "", i.style.backgroundSize = "", i.style.backgroundRepeat = "", i.style.backgroundPosition = "", i.style.backgroundImage = "", i.style.opacity = "", i.innerHTML = "", s.background && (/^(http|file|\/\/)/gi.test(s.background) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(s.background) ? e.setAttribute("data-background-image", s.background) : t.style.background = s.background), (s.background || s.backgroundColor || s.backgroundGradient || s.backgroundImage || s.backgroundVideo || s.backgroundIframe) && t.setAttribute("data-background-hash", s.background + s.backgroundSize + s.backgroundImage + s.backgroundVideo + s.backgroundIframe + s.backgroundColor + s.backgroundGradient + s.backgroundRepeat + s.backgroundPosition + s.backgroundTransition + s.backgroundOpacity), s.backgroundSize && t.setAttribute("data-background-size", s.backgroundSize), s.backgroundColor && (t.style.backgroundColor = s.backgroundColor), s.backgroundGradient && (t.style.backgroundImage = s.backgroundGradient), s.backgroundTransition && t.setAttribute("data-background-transition", s.backgroundTransition), d && t.setAttribute("data-preload", ""), s.backgroundSize && (i.style.backgroundSize = s.backgroundSize), s.backgroundRepeat && (i.style.backgroundRepeat = s.backgroundRepeat), s.backgroundPosition && (i.style.backgroundPosition = s.backgroundPosition), s.backgroundOpacity && (i.style.opacity = s.backgroundOpacity);
    const n = this.getContrastClass(e);
    typeof n == "string" && e.classList.add(n);
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
    const t = e.slideBackgroundElement;
    let i = e.getAttribute("data-background-color");
    if (!i || !_e(i)) {
      let s = window.getComputedStyle(t);
      s && s.backgroundColor && (i = s.backgroundColor);
    }
    if (i) {
      const s = _e(i);
      if (s && s.a !== 0)
        return Ii(i) < 128 ? "has-dark-background" : "has-light-background";
    }
    return null;
  }
  /**
   * Bubble the 'has-light-background'/'has-dark-background' classes.
   */
  bubbleSlideContrastClassToElement(e, t) {
    ["has-light-background", "has-dark-background"].forEach((i) => {
      e.classList.contains(i) ? t.classList.add(i) : t.classList.remove(i);
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
    let t = this.Reveal.getConfig(), i = this.Reveal.getCurrentSlide(), s = this.Reveal.getIndices(), d = null, n = t.rtl ? "future" : "past", o = t.rtl ? "past" : "future";
    if (Array.from(this.element.childNodes).forEach((c, f) => {
      c.classList.remove("past", "present", "future"), f < s.h ? c.classList.add(n) : f > s.h ? c.classList.add(o) : (c.classList.add("present"), d = c), (e || f === s.h) && E(c, ".slide-background").forEach((g, v) => {
        g.classList.remove("past", "present", "future");
        const y = typeof s.v == "number" ? s.v : 0;
        v < y ? g.classList.add("past") : v > y ? g.classList.add("future") : (g.classList.add("present"), f === s.h && (d = g));
      });
    }), this.previousBackground && !this.previousBackground.closest("body") && (this.previousBackground = null), d && this.previousBackground) {
      let c = this.previousBackground.getAttribute("data-background-hash"), f = d.getAttribute("data-background-hash");
      if (f && f === c && d !== this.previousBackground) {
        this.element.classList.add("no-transition");
        const g = d.querySelector("video"), v = this.previousBackground.querySelector("video");
        if (g && v) {
          const y = g.parentNode;
          v.parentNode.appendChild(g), y.appendChild(v);
        }
      }
    }
    if (this.previousBackground && this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload(this.previousBackground) }), d) {
      this.Reveal.slideContent.startEmbeddedContent(d);
      let c = d.querySelector(".slide-background-content");
      if (c) {
        let f = c.style.backgroundImage || "";
        /\.gif/i.test(f) && (c.style.backgroundImage = "", window.getComputedStyle(c).opacity, c.style.backgroundImage = f);
      }
      this.previousBackground = d;
    }
    i && this.bubbleSlideContrastClassToElement(i, this.Reveal.getRevealElement()), setTimeout(() => {
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
      let t = this.Reveal.getHorizontalSlides(), i = this.Reveal.getVerticalSlides(), s = this.element.style.backgroundSize.split(" "), d, n;
      s.length === 1 ? d = n = parseInt(s[0], 10) : (d = parseInt(s[0], 10), n = parseInt(s[1], 10));
      let o = this.element.offsetWidth, c = t.length, f, g;
      typeof this.Reveal.getConfig().parallaxBackgroundHorizontal == "number" ? f = this.Reveal.getConfig().parallaxBackgroundHorizontal : f = c > 1 ? (d - o) / (c - 1) : 0, g = f * e.h * -1;
      let v = this.element.offsetHeight, y = i.length, w, r;
      typeof this.Reveal.getConfig().parallaxBackgroundVertical == "number" ? w = this.Reveal.getConfig().parallaxBackgroundVertical : w = (n - v) / (y - 1), r = y > 0 ? w * e.v : 0, this.element.style.backgroundPosition = g + "px " + -r + "px";
    }
  }
  destroy() {
    this.element.remove();
  }
}
let Nt = 0;
class Mi {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Runs an auto-animation between the given slides.
   *
   * @param  {HTMLElement} fromSlide
   * @param  {HTMLElement} toSlide
   */
  run(e, t) {
    this.reset();
    let i = this.Reveal.getSlides(), s = i.indexOf(t), d = i.indexOf(e);
    if (e && t && e.hasAttribute("data-auto-animate") && t.hasAttribute("data-auto-animate") && e.getAttribute("data-auto-animate-id") === t.getAttribute("data-auto-animate-id") && !(s > d ? t : e).hasAttribute("data-auto-animate-restart")) {
      this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || We();
      let n = this.getAutoAnimateOptions(t);
      e.dataset.autoAnimate = "pending", t.dataset.autoAnimate = "pending", n.slideDirection = s > d ? "forward" : "backward";
      let o = e.style.display === "none";
      o && (e.style.display = this.Reveal.getConfig().display);
      let c = this.getAutoAnimatableElements(e, t).map((f) => this.autoAnimateElements(f.from, f.to, f.options || {}, n, Nt++));
      if (o && (e.style.display = "none"), t.dataset.autoAnimateUnmatched !== "false" && this.Reveal.getConfig().autoAnimateUnmatched === !0) {
        let f = n.duration * 0.8, g = n.duration * 0.2;
        this.getUnmatchedAutoAnimateElements(t).forEach((v) => {
          let y = this.getAutoAnimateOptions(v, n), w = "unmatched";
          (y.duration !== n.duration || y.delay !== n.delay) && (w = "unmatched-" + Nt++, c.push(`[data-auto-animate="running"] [data-auto-animate-target="${w}"] { transition: opacity ${y.duration}s ease ${y.delay}s; }`)), v.dataset.autoAnimateTarget = w;
        }, this), c.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${f}s ease ${g}s; }`);
      }
      this.autoAnimateStyleSheet.innerHTML = c.join(""), requestAnimationFrame(() => {
        this.autoAnimateStyleSheet && (getComputedStyle(this.autoAnimateStyleSheet).fontWeight, t.dataset.autoAnimate = "running");
      }), this.Reveal.dispatchEvent({
        type: "autoanimate",
        data: {
          fromSlide: e,
          toSlide: t,
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
  autoAnimateElements(e, t, i, s, d) {
    e.dataset.autoAnimateTarget = "", t.dataset.autoAnimateTarget = d;
    let n = this.getAutoAnimateOptions(t, s);
    typeof i.delay < "u" && (n.delay = i.delay), typeof i.duration < "u" && (n.duration = i.duration), typeof i.easing < "u" && (n.easing = i.easing);
    let o = this.getAutoAnimatableProperties("from", e, i), c = this.getAutoAnimatableProperties("to", t, i);
    if (t.classList.contains("fragment") && (delete c.styles.opacity, e.classList.contains("fragment"))) {
      let v = (e.className.match(It) || [""])[0], y = (t.className.match(It) || [""])[0];
      v === y && s.slideDirection === "forward" && t.classList.add("visible", "disabled");
    }
    if (i.translate !== !1 || i.scale !== !1) {
      let v = this.Reveal.getScale(), y = {
        x: (o.x - c.x) / v,
        y: (o.y - c.y) / v,
        scaleX: o.width / c.width,
        scaleY: o.height / c.height
      };
      y.x = Math.round(y.x * 1e3) / 1e3, y.y = Math.round(y.y * 1e3) / 1e3, y.scaleX = Math.round(y.scaleX * 1e3) / 1e3, y.scaleX = Math.round(y.scaleX * 1e3) / 1e3;
      let w = i.translate !== !1 && (y.x !== 0 || y.y !== 0), r = i.scale !== !1 && (y.scaleX !== 0 || y.scaleY !== 0);
      if (w || r) {
        let A = [];
        w && A.push(`translate(${y.x}px, ${y.y}px)`), r && A.push(`scale(${y.scaleX}, ${y.scaleY})`), o.styles.transform = A.join(" "), o.styles["transform-origin"] = "top left", c.styles.transform = "none";
      }
    }
    for (let v in c.styles) {
      const y = c.styles[v], w = o.styles[v];
      y === w ? delete c.styles[v] : (y.explicitValue === !0 && (c.styles[v] = y.value), w.explicitValue === !0 && (o.styles[v] = w.value));
    }
    let f = "", g = Object.keys(c.styles);
    if (g.length > 0) {
      o.styles.transition = "none", c.styles.transition = `all ${n.duration}s ${n.easing} ${n.delay}s`, c.styles["transition-property"] = g.join(", "), c.styles["will-change"] = g.join(", ");
      let v = Object.keys(o.styles).map((w) => w + ": " + o.styles[w] + " !important;").join(""), y = Object.keys(c.styles).map((w) => w + ": " + c.styles[w] + " !important;").join("");
      f = '[data-auto-animate-target="' + d + '"] {' + v + '}[data-auto-animate="running"] [data-auto-animate-target="' + d + '"] {' + y + "}";
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
  getAutoAnimateOptions(e, t) {
    let i = {
      easing: this.Reveal.getConfig().autoAnimateEasing,
      duration: this.Reveal.getConfig().autoAnimateDuration,
      delay: 0
    };
    if (i = ue(i, t), e.parentNode) {
      let s = F(e.parentNode, "[data-auto-animate-target]");
      s && (i = this.getAutoAnimateOptions(s, i));
    }
    return e.dataset.autoAnimateEasing && (i.easing = e.dataset.autoAnimateEasing), e.dataset.autoAnimateDuration && (i.duration = parseFloat(e.dataset.autoAnimateDuration)), e.dataset.autoAnimateDelay && (i.delay = parseFloat(e.dataset.autoAnimateDelay)), i;
  }
  /**
   * Returns an object containing all of the properties
   * that can be auto-animated for the given element and
   * their current computed values.
   *
   * @param {String} direction 'from' or 'to'
   */
  getAutoAnimatableProperties(e, t, i) {
    let s = this.Reveal.getConfig(), d = { styles: [] };
    if (i.translate !== !1 || i.scale !== !1) {
      let o;
      if (typeof i.measure == "function")
        o = i.measure(t);
      else if (s.center)
        o = t.getBoundingClientRect();
      else {
        let c = this.Reveal.getScale();
        o = {
          x: t.offsetLeft * c,
          y: t.offsetTop * c,
          width: t.offsetWidth * c,
          height: t.offsetHeight * c
        };
      }
      d.x = o.x, d.y = o.y, d.width = o.width, d.height = o.height;
    }
    const n = getComputedStyle(t);
    return (i.styles || s.autoAnimateStyles).forEach((o) => {
      let c;
      typeof o == "string" && (o = { property: o }), typeof o.from < "u" && e === "from" ? c = { value: o.from, explicitValue: !0 } : typeof o.to < "u" && e === "to" ? c = { value: o.to, explicitValue: !0 } : (o.property === "line-height" && (c = parseFloat(n["line-height"]) / parseFloat(n["font-size"])), isNaN(c) && (c = n[o.property])), c !== "" && (d.styles[o.property] = c);
    }), d;
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
  getAutoAnimatableElements(e, t) {
    let s = (typeof this.Reveal.getConfig().autoAnimateMatcher == "function" ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs).call(this, e, t), d = [];
    return s.filter((n, o) => {
      if (d.indexOf(n.to) === -1)
        return d.push(n.to), !0;
    });
  }
  /**
   * Identifies matching elements between slides.
   *
   * You can specify a custom matcher function by using
   * the `autoAnimateMatcher` config option.
   */
  getAutoAnimatePairs(e, t) {
    let i = [];
    const s = "pre", d = "h1, h2, h3, h4, h5, h6, p, li", n = "img, video, iframe";
    return this.findAutoAnimateMatches(i, e, t, "[data-id]", (o) => o.nodeName + ":::" + o.getAttribute("data-id")), this.findAutoAnimateMatches(i, e, t, d, (o) => o.nodeName + ":::" + o.innerText), this.findAutoAnimateMatches(i, e, t, n, (o) => o.nodeName + ":::" + (o.getAttribute("src") || o.getAttribute("data-src"))), this.findAutoAnimateMatches(i, e, t, s, (o) => o.nodeName + ":::" + o.innerText), i.forEach((o) => {
      Pe(o.from, d) ? o.options = { scale: !1 } : Pe(o.from, s) && (o.options = { scale: !1, styles: ["width", "height"] }, this.findAutoAnimateMatches(i, o.from, o.to, ".hljs .hljs-ln-code", (c) => c.textContent, {
        scale: !1,
        styles: [],
        measure: this.getLocalBoundingBox.bind(this)
      }), this.findAutoAnimateMatches(i, o.from, o.to, ".hljs .hljs-ln-numbers[data-line-number]", (c) => c.getAttribute("data-line-number"), {
        scale: !1,
        styles: ["width"],
        measure: this.getLocalBoundingBox.bind(this)
      }));
    }, this), i;
  }
  /**
   * Helper method which returns a bounding box based on
   * the given elements offset coordinates.
   *
   * @param {HTMLElement} element
   * @return {Object} x, y, width, height
   */
  getLocalBoundingBox(e) {
    const t = this.Reveal.getScale();
    return {
      x: Math.round(e.offsetLeft * t * 100) / 100,
      y: Math.round(e.offsetTop * t * 100) / 100,
      width: Math.round(e.offsetWidth * t * 100) / 100,
      height: Math.round(e.offsetHeight * t * 100) / 100
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
  findAutoAnimateMatches(e, t, i, s, d, n) {
    let o = {}, c = {};
    [].slice.call(t.querySelectorAll(s)).forEach((f, g) => {
      const v = d(f);
      typeof v == "string" && v.length && (o[v] = o[v] || [], o[v].push(f));
    }), [].slice.call(i.querySelectorAll(s)).forEach((f, g) => {
      const v = d(f);
      c[v] = c[v] || [], c[v].push(f);
      let y;
      if (o[v]) {
        const w = c[v].length - 1, r = o[v].length - 1;
        o[v][w] ? (y = o[v][w], o[v][w] = null) : o[v][r] && (y = o[v][r], o[v][r] = null);
      }
      y && e.push({
        from: y,
        to: f,
        options: n
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
    return [].slice.call(e.children).reduce((t, i) => {
      const s = i.querySelector("[data-auto-animate-target]");
      return !i.hasAttribute("data-auto-animate-target") && !s && t.push(i), i.querySelector("[data-auto-animate-target]") && (t = t.concat(this.getUnmatchedAutoAnimateElements(i))), t;
    }, []);
  }
}
const Bi = 500, Hi = 4, Di = 6, zi = 8;
class Fi {
  constructor(e) {
    this.Reveal = e, this.active = !1, this.activatedCallbacks = [], this.onScroll = this.onScroll.bind(this);
  }
  /**
   * Activates the scroll view. This rearranges the presentation DOM
   * by—among other things—wrapping each slide in a page element.
   */
  activate() {
    if (this.active)
      return;
    const e = this.Reveal.getState();
    this.active = !0, this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;
    const t = E(this.Reveal.getRevealElement(), te), i = E(this.Reveal.getRevealElement(), ki);
    this.viewportElement.classList.add("loading-scroll-mode", "reveal-scroll");
    let s;
    const d = window.getComputedStyle(this.viewportElement);
    d && d.background && (s = d.background);
    const n = [], o = t[0].parentNode;
    let c;
    const f = (g, v, y, w) => {
      let r;
      if (c && this.Reveal.shouldAutoAnimateBetween(c, g))
        r = document.createElement("div"), r.className = "scroll-page-content scroll-auto-animate-page", r.style.display = "none", c.closest(".scroll-page-content").parentNode.appendChild(r);
      else {
        const A = document.createElement("div");
        if (A.className = "scroll-page", n.push(A), w && i.length > v) {
          const V = i[v], O = window.getComputedStyle(V);
          O && O.background ? A.style.background = O.background : s && (A.style.background = s);
        } else
          s && (A.style.background = s);
        const T = document.createElement("div");
        T.className = "scroll-page-sticky", A.appendChild(T), r = document.createElement("div"), r.className = "scroll-page-content", T.appendChild(r);
      }
      r.appendChild(g), g.classList.remove("past", "future"), g.setAttribute("data-index-h", v), g.setAttribute("data-index-v", y), g.slideBackgroundElement && (g.slideBackgroundElement.remove("past", "future"), r.insertBefore(g.slideBackgroundElement, g)), c = g;
    };
    t.forEach((g, v) => {
      this.Reveal.isVerticalStack(g) ? g.querySelectorAll("section").forEach((y, w) => {
        f(y, v, w, !0);
      }) : f(g, v, 0);
    }, this), this.createProgressBar(), E(this.Reveal.getRevealElement(), ".stack").forEach((g) => g.remove()), n.forEach((g) => o.appendChild(g)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.layout(), this.Reveal.setState(e), this.activatedCallbacks.forEach((g) => g()), this.activatedCallbacks = [], this.restoreScrollPosition(), this.viewportElement.classList.remove("loading-scroll-mode"), this.viewportElement.addEventListener("scroll", this.onScroll, { passive: !0 });
  }
  /**
   * Deactivates the scroll view and restores the standard slide-based
   * presentation.
   */
  deactivate() {
    if (!this.active)
      return;
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
      let d = (s.clientY - this.progressBarInner.getBoundingClientRect().top) / this.progressBarHeight;
      d = Math.max(Math.min(d, 1), 0), this.viewportElement.scrollTop = d * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight);
    }, t = (s) => {
      this.draggingProgressBar = !1, this.showProgressBar(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", t);
    }, i = (s) => {
      s.preventDefault(), this.draggingProgressBar = !0, document.addEventListener("mousemove", e), document.addEventListener("mouseup", t), e(s);
    };
    this.progressBarInner.addEventListener("mousedown", i);
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
    const e = this.Reveal.getConfig(), t = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), i = this.Reveal.getScale(), s = e.scrollLayout === "compact", d = this.viewportElement.offsetHeight, n = t.height * i, o = s ? n : d;
    this.scrollTriggerHeight = s ? n : d, this.viewportElement.style.setProperty("--page-height", o + "px"), this.viewportElement.style.scrollSnapType = typeof e.scrollSnap == "string" ? `y ${e.scrollSnap}` : "", this.slideTriggers = [];
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
      g.pageElement.style.setProperty("--slide-height", e.center === !0 ? "auto" : t.height + "px"), this.slideTriggers.push({
        page: g,
        activate: () => this.activatePage(g),
        deactivate: () => this.deactivatePage(g)
      }), this.createFragmentTriggersForPage(g), g.autoAnimateElements.length > 0 && this.createAutoAnimateTriggersForPage(g);
      let v = Math.max(g.scrollTriggers.length - 1, 0);
      v += g.autoAnimatePages.reduce((y, w) => y + Math.max(w.scrollTriggers.length - 1, 0), g.autoAnimatePages.length), g.pageElement.querySelectorAll(".scroll-snap-point").forEach((y) => y.remove());
      for (let y = 0; y < v + 1; y++) {
        const w = document.createElement("div");
        w.className = "scroll-snap-point", w.style.height = this.scrollTriggerHeight + "px", w.style.scrollSnapAlign = s ? "center" : "start", g.pageElement.appendChild(w), y === 0 && (w.style.marginTop = -this.scrollTriggerHeight + "px");
      }
      return s && g.scrollTriggers.length > 0 ? (g.pageHeight = d, g.pageElement.style.setProperty("--page-height", d + "px")) : (g.pageHeight = o, g.pageElement.style.removeProperty("--page-height")), g.scrollPadding = this.scrollTriggerHeight * v, g.totalHeight = g.pageHeight + g.scrollPadding, g.pageElement.style.setProperty("--page-scroll-padding", g.scrollPadding + "px"), v > 0 ? (g.stickyElement.style.position = "sticky", g.stickyElement.style.top = Math.max((d - g.pageHeight) / 2, 0) + "px") : (g.stickyElement.style.position = "relative", g.pageElement.style.scrollSnapAlign = g.pageHeight < d ? "center" : "start"), g;
    }), this.setTriggerRanges(), this.viewportElement.setAttribute("data-scrollbar", e.scrollProgress), e.scrollProgress && this.totalScrollTriggerCount > 1 ? (this.progressBar || this.createProgressBar(), this.syncProgressBar()) : this.removeProgressBar();
  }
  /**
   * Calculates and sets the scroll range for all of our scroll
   * triggers.
   */
  setTriggerRanges() {
    this.totalScrollTriggerCount = this.slideTriggers.reduce((t, i) => t + Math.max(i.page.scrollTriggers.length, 1), 0);
    let e = 0;
    this.slideTriggers.forEach((t, i) => {
      t.range = [
        e,
        e + Math.max(t.page.scrollTriggers.length, 1) / this.totalScrollTriggerCount
      ];
      const s = (t.range[1] - t.range[0]) / t.page.scrollTriggers.length;
      t.page.scrollTriggers.forEach((d, n) => {
        d.range = [
          e + n * s,
          e + (n + 1) * s
        ];
      }), e = t.range[1];
    });
  }
  /**
   * Creates one scroll trigger for each fragments in the given page.
   *
   * @param {*} page
   */
  createFragmentTriggersForPage(e, t) {
    t = t || e.slideElement;
    const i = this.Reveal.fragments.sort(t.querySelectorAll(".fragment"), !0);
    return i.length && (e.fragments = this.Reveal.fragments.sort(t.querySelectorAll(".fragment:not(.disabled)")), e.scrollTriggers.push(
      // Trigger for the initial state with no fragments visible
      {
        activate: () => {
          this.Reveal.fragments.update(-1, e.fragments, t);
        }
      }
    ), i.forEach((s, d) => {
      e.scrollTriggers.push({
        activate: () => {
          this.Reveal.fragments.update(d, e.fragments, t);
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
    e.autoAnimateElements.length > 0 && this.slideTriggers.push(...Array.from(e.autoAnimateElements).map((t, i) => {
      let s = this.createPage({
        slideElement: t.querySelector("section"),
        contentElement: t,
        backgroundElement: t.querySelector(".slide-background")
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
    this.progressBarInner.querySelectorAll(".scrollbar-slide").forEach((n) => n.remove());
    const e = this.viewportElement.scrollHeight, t = this.viewportElement.offsetHeight, i = t / e;
    this.progressBarHeight = this.progressBarInner.offsetHeight, this.playheadHeight = Math.max(i * this.progressBarHeight, zi), this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;
    const s = t / e * this.progressBarHeight, d = Math.min(s / 8, Hi);
    this.progressBarPlayhead.style.height = this.playheadHeight - d + "px", s > Di ? this.slideTriggers.forEach((n) => {
      const { page: o } = n;
      o.progressBarSlide = document.createElement("div"), o.progressBarSlide.className = "scrollbar-slide", o.progressBarSlide.style.top = n.range[0] * this.progressBarHeight + "px", o.progressBarSlide.style.height = (n.range[1] - n.range[0]) * this.progressBarHeight - d + "px", o.progressBarSlide.classList.toggle("has-triggers", o.scrollTriggers.length > 0), this.progressBarInner.appendChild(o.progressBarSlide), o.scrollTriggerElements = o.scrollTriggers.map((c, f) => {
        const g = document.createElement("div");
        return g.className = "scrollbar-trigger", g.style.top = (c.range[0] - n.range[0]) * this.progressBarHeight + "px", g.style.height = (c.range[1] - c.range[0]) * this.progressBarHeight - d + "px", o.progressBarSlide.appendChild(g), f === 0 && (g.style.display = "none"), g;
      });
    }) : this.pages.forEach((n) => n.progressBarSlide = null);
  }
  /**
   * Reads the current scroll position and updates our active
   * trigger states accordingly.
   */
  syncScrollPosition() {
    const e = this.viewportElement.offsetHeight, t = e / this.viewportElement.scrollHeight, i = this.viewportElement.scrollTop, s = this.viewportElement.scrollHeight - e, d = Math.max(Math.min(i / s, 1), 0), n = Math.max(Math.min((i + e / 2) / this.viewportElement.scrollHeight, 1), 0);
    let o;
    this.slideTriggers.forEach((c) => {
      const { page: f } = c;
      d >= c.range[0] - t * 2 && d <= c.range[1] + t * 2 && !f.loaded ? (f.loaded = !0, this.Reveal.slideContent.load(f.slideElement)) : f.loaded && (f.loaded = !1, this.Reveal.slideContent.unload(f.slideElement)), d >= c.range[0] && d <= c.range[1] ? (this.activateTrigger(c), o = c.page) : c.active && this.deactivateTrigger(c);
    }), o && o.scrollTriggers.forEach((c) => {
      n >= c.range[0] && n <= c.range[1] ? this.activateTrigger(c) : c.active && this.deactivateTrigger(c);
    }), this.setProgressBarValue(i / (this.viewportElement.scrollHeight - e));
  }
  /**
   * Moves the progress bar playhead to the specified position.
   *
   * @param {number} progress 0-1
   */
  setProgressBarValue(e) {
    this.progressBar && (this.progressBarPlayhead.style.transform = `translateY(${e * this.progressBarScrollableHeight}px)`, this.getAllPages().filter((t) => t.progressBarSlide).forEach((t) => {
      t.progressBarSlide.classList.toggle("active", t.active === !0), t.scrollTriggers.forEach((i, s) => {
        t.scrollTriggerElements[s].classList.toggle("active", t.active === !0 && i.active === !0);
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
    }, Bi));
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
      const t = this.getScrollTriggerBySlide(e);
      t && (this.viewportElement.scrollTop = t.range[0] * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight));
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
    const e = sessionStorage.getItem("reveal-scroll-top"), t = sessionStorage.getItem("reveal-scroll-origin");
    e && t === location.origin + location.pathname && (this.viewportElement.scrollTop = parseInt(e, 10));
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
      const { slideElement: t, backgroundElement: i, contentElement: s, indexh: d, indexv: n } = e;
      s.style.display = "block", t.classList.add("present"), i && i.classList.add("present"), this.Reveal.setCurrentScrollPage(t, d, n), this.Reveal.backgrounds.bubbleSlideContrastClassToElement(t, this.viewportElement), Array.from(s.parentNode.querySelectorAll(".scroll-page-content")).forEach((o) => {
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
  getSlideByIndices(e, t) {
    const i = this.getAllPages().find((s) => s.indexh === e && s.indexv === t);
    return i ? i.slideElement : null;
  }
  /**
   * Retrieve a list of all scroll triggers for the given slide
   * DOM element.
   *
   * @param {HTMLElement} slide
   * @returns {Array}
   */
  getScrollTriggerBySlide(e) {
    return this.slideTriggers.find((t) => t.page.slideElement === e);
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
class Vi {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Configures the presentation for printing to a static
   * PDF.
   */
  async activate() {
    const e = this.Reveal.getConfig(), t = E(this.Reveal.getRevealElement(), re), i = e.slideNumber && /all|print/i.test(e.showSlideNumber), s = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), d = Math.floor(s.width * (1 + e.margin)), n = Math.floor(s.height * (1 + e.margin)), o = s.width, c = s.height;
    await new Promise(requestAnimationFrame), We("@page{size:" + d + "px " + n + "px; margin: 0px;}"), We(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + o + "px; max-height:" + c + "px}"), document.documentElement.classList.add("reveal-print", "print-pdf"), document.body.style.width = d + "px", document.body.style.height = n + "px";
    const f = this.Reveal.getViewportElement();
    let g;
    if (f) {
      const A = window.getComputedStyle(f);
      A && A.background && (g = A.background);
    }
    await new Promise(requestAnimationFrame), this.Reveal.layoutSlideContents(o, c), await new Promise(requestAnimationFrame);
    const v = t.map((A) => A.scrollHeight), y = [], w = t[0].parentNode;
    let r = 1;
    t.forEach(function(A, T) {
      if (A.classList.contains("stack") === !1) {
        let V = (d - o) / 2, O = (n - c) / 2;
        const se = v[T];
        let z = Math.max(Math.ceil(se / n), 1);
        z = Math.min(z, e.pdfMaxPagesPerSlide), (z === 1 && e.center || A.classList.contains("center")) && (O = Math.max((n - se) / 2, 0));
        const k = document.createElement("div");
        if (y.push(k), k.className = "pdf-page", k.style.height = (n + e.pdfPageHeightOffset) * z + "px", g && (k.style.background = g), k.appendChild(A), A.style.left = V + "px", A.style.top = O + "px", A.style.width = o + "px", this.Reveal.slideContent.layout(A), A.slideBackgroundElement && k.insertBefore(A.slideBackgroundElement, A), e.showNotes) {
          const I = this.Reveal.getSlideNotes(A);
          if (I) {
            const W = typeof e.showNotes == "string" ? e.showNotes : "inline", P = document.createElement("div");
            P.classList.add("speaker-notes"), P.classList.add("speaker-notes-pdf"), P.setAttribute("data-layout", W), P.innerHTML = I, W === "separate-page" ? y.push(P) : (P.style.left = "8px", P.style.bottom = "8px", P.style.width = d - 8 * 2 + "px", k.appendChild(P));
          }
        }
        if (i) {
          const I = document.createElement("div");
          I.classList.add("slide-number"), I.classList.add("slide-number-pdf"), I.innerHTML = r++, k.appendChild(I);
        }
        if (e.pdfSeparateFragments) {
          const I = this.Reveal.fragments.sort(k.querySelectorAll(".fragment"), !0);
          let U;
          I.forEach(function(W, P) {
            U && U.forEach(function(D) {
              D.classList.remove("current-fragment");
            }), W.forEach(function(D) {
              D.classList.add("visible", "current-fragment");
            }, this);
            const R = k.cloneNode(!0);
            if (i) {
              const D = R.querySelector(".slide-number-pdf"), L = P + 1;
              D.innerHTML += "." + L;
            }
            y.push(R), U = W;
          }, this), I.forEach(function(W) {
            W.forEach(function(P) {
              P.classList.remove("visible", "current-fragment");
            });
          });
        } else
          E(k, ".fragment:not(.fade-out)").forEach(function(I) {
            I.classList.add("visible");
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
class Oi {
  constructor(e) {
    this.Reveal = e;
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
    e.fragments === !1 ? this.disable() : t.fragments === !1 && this.enable();
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
      let t = e.querySelectorAll(".fragment:not(.disabled)"), i = e.querySelectorAll(".fragment:not(.disabled):not(.visible)");
      return {
        prev: t.length - i.length > 0,
        next: !!i.length
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
  sort(e, t = !1) {
    e = Array.from(e);
    let i = [], s = [], d = [];
    e.forEach((o) => {
      if (o.hasAttribute("data-fragment-index")) {
        let c = parseInt(o.getAttribute("data-fragment-index"), 10);
        i[c] || (i[c] = []), i[c].push(o);
      } else
        s.push([o]);
    }), i = i.concat(s);
    let n = 0;
    return i.forEach((o) => {
      o.forEach((c) => {
        d.push(c), c.setAttribute("data-fragment-index", n);
      }), n++;
    }), t === !0 ? i : d;
  }
  /**
   * Sorts and formats all of fragments in the
   * presentation.
   */
  sortAll() {
    this.Reveal.getHorizontalSlides().forEach((e) => {
      let t = E(e, "section");
      t.forEach((i, s) => {
        this.sort(i.querySelectorAll(".fragment"));
      }, this), t.length === 0 && this.sort(e.querySelectorAll(".fragment"));
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
  update(e, t, i = this.Reveal.getCurrentSlide()) {
    let s = {
      shown: [],
      hidden: []
    };
    if (i && this.Reveal.getConfig().fragments && (t = t || this.sort(i.querySelectorAll(".fragment")), t.length)) {
      let d = 0;
      if (typeof e != "number") {
        let n = this.sort(i.querySelectorAll(".fragment.visible")).pop();
        n && (e = parseInt(n.getAttribute("data-fragment-index") || 0, 10));
      }
      Array.from(t).forEach((n, o) => {
        if (n.hasAttribute("data-fragment-index") && (o = parseInt(n.getAttribute("data-fragment-index"), 10)), d = Math.max(d, o), o <= e) {
          let c = n.classList.contains("visible");
          n.classList.add("visible"), n.classList.remove("current-fragment"), o === e && (this.Reveal.announceStatus(this.Reveal.getStatusText(n)), n.classList.add("current-fragment"), this.Reveal.slideContent.startEmbeddedContent(n)), c || (s.shown.push(n), this.Reveal.dispatchEvent({
            target: n,
            type: "visible",
            bubbles: !1
          }));
        } else {
          let c = n.classList.contains("visible");
          n.classList.remove("visible"), n.classList.remove("current-fragment"), c && (this.Reveal.slideContent.stopEmbeddedContent(n), s.hidden.push(n), this.Reveal.dispatchEvent({
            target: n,
            type: "hidden",
            bubbles: !1
          }));
        }
      }), e = typeof e == "number" ? e : -1, e = Math.max(Math.min(e, d), -1), i.setAttribute("data-fragment", e);
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
  goto(e, t = 0) {
    let i = this.Reveal.getCurrentSlide();
    if (i && this.Reveal.getConfig().fragments) {
      let s = this.sort(i.querySelectorAll(".fragment:not(.disabled)"));
      if (s.length) {
        if (typeof e != "number") {
          let n = this.sort(i.querySelectorAll(".fragment:not(.disabled).visible")).pop();
          n ? e = parseInt(n.getAttribute("data-fragment-index") || 0, 10) : e = -1;
        }
        e += t;
        let d = this.update(e, s);
        return this.Reveal.controls.update(), this.Reveal.progress.update(), this.Reveal.getConfig().fragmentInURL && this.Reveal.location.writeURL(), !!(d.shown.length || d.hidden.length);
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
class qi {
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
      const e = 70, t = this.Reveal.getComputedSlideSize();
      this.overviewSlideWidth = t.width + e, this.overviewSlideHeight = t.height + e, this.Reveal.getConfig().rtl && (this.overviewSlideWidth = -this.overviewSlideWidth), this.Reveal.updateSlidesVisibility(), this.layout(), this.update(), this.Reveal.layout();
      const i = this.Reveal.getIndices();
      this.Reveal.dispatchEvent({
        type: "overviewshown",
        data: {
          indexh: i.h,
          indexv: i.v,
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
    this.Reveal.getHorizontalSlides().forEach((e, t) => {
      e.setAttribute("data-index-h", t), ie(e, "translate3d(" + t * this.overviewSlideWidth + "px, 0, 0)"), e.classList.contains("stack") && E(e, "section").forEach((i, s) => {
        i.setAttribute("data-index-h", t), i.setAttribute("data-index-v", s), ie(i, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
      });
    }), Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach((e, t) => {
      ie(e, "translate3d(" + t * this.overviewSlideWidth + "px, 0, 0)"), E(e, ".slide-background").forEach((i, s) => {
        ie(i, "translate3d(0, " + s * this.overviewSlideHeight + "px, 0)");
      });
    });
  }
  /**
   * Moves the overview viewport to the current slides.
   * Called each time the current slide changes.
   */
  update() {
    const e = Math.min(window.innerWidth, window.innerHeight), t = Math.max(e / 5, 150) / e, i = this.Reveal.getIndices();
    this.Reveal.transformSlides({
      overview: [
        "scale(" + t + ")",
        "translateX(" + -i.h * this.overviewSlideWidth + "px)",
        "translateY(" + -i.v * this.overviewSlideHeight + "px)"
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
      }, 1), this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()), E(this.Reveal.getRevealElement(), re).forEach((t) => {
        ie(t, ""), t.removeEventListener("click", this.onSlideClicked, !0);
      }), E(this.Reveal.getBackgroundsElement(), ".slide-background").forEach((t) => {
        ie(t, "");
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
      let t = e.target;
      for (; t && !t.nodeName.match(/section/gi); )
        t = t.parentNode;
      if (t && !t.classList.contains("disabled") && (this.deactivate(), t.nodeName.match(/section/gi))) {
        let i = parseInt(t.getAttribute("data-index-h"), 10), s = parseInt(t.getAttribute("data-index-v"), 10);
        this.Reveal.slide(i, s);
      }
    }
  }
}
class Ui {
  constructor(e) {
    this.Reveal = e, this.shortcuts = {}, this.bindings = {}, this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
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
  addKeyBinding(e, t) {
    typeof e == "object" && e.keyCode ? this.bindings[e.keyCode] = {
      callback: t,
      key: e.key,
      description: e.description
    } : this.bindings[e] = {
      callback: t,
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
  registerKeyboardShortcut(e, t) {
    this.shortcuts[e] = t;
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
    let t = this.Reveal.getConfig();
    if (typeof t.keyboardCondition == "function" && t.keyboardCondition(e) === !1 || t.keyboardCondition === "focused" && !this.Reveal.isFocused())
      return !0;
    let i = e.keyCode, s = !this.Reveal.isAutoSliding();
    this.Reveal.onUserInput(e);
    let d = document.activeElement && document.activeElement.isContentEditable === !0, n = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), o = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className), f = !([32, 37, 38, 39, 40, 78, 80, 191].indexOf(e.keyCode) !== -1 && e.shiftKey || e.altKey) && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    if (d || n || o || f)
      return;
    let g = [66, 86, 190, 191, 112], v;
    if (typeof t.keyboard == "object")
      for (v in t.keyboard)
        t.keyboard[v] === "togglePause" && g.push(parseInt(v, 10));
    if (this.Reveal.isPaused() && g.indexOf(i) === -1)
      return !1;
    let y = t.navigationMode === "linear" || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides(), w = !1;
    if (typeof t.keyboard == "object") {
      for (v in t.keyboard)
        if (parseInt(v, 10) === i) {
          let r = t.keyboard[v];
          typeof r == "function" ? r.apply(null, [e]) : typeof r == "string" && typeof this.Reveal[r] == "function" && this.Reveal[r].call(), w = !0;
        }
    }
    if (w === !1) {
      for (v in this.bindings)
        if (parseInt(v, 10) === i) {
          let r = this.bindings[v].callback;
          typeof r == "function" ? r.apply(null, [e]) : typeof r == "string" && typeof this.Reveal[r] == "function" && this.Reveal[r].call(), w = !0;
        }
    }
    w === !1 && (w = !0, i === 80 || i === 33 ? this.Reveal.prev({ skipFragments: e.altKey }) : i === 78 || i === 34 ? this.Reveal.next({ skipFragments: e.altKey }) : i === 72 || i === 37 ? e.shiftKey ? this.Reveal.slide(0) : !this.Reveal.overview.isActive() && y ? t.rtl ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.left({ skipFragments: e.altKey }) : i === 76 || i === 39 ? e.shiftKey ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : !this.Reveal.overview.isActive() && y ? t.rtl ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.right({ skipFragments: e.altKey }) : i === 75 || i === 38 ? e.shiftKey ? this.Reveal.slide(void 0, 0) : !this.Reveal.overview.isActive() && y ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.up({ skipFragments: e.altKey }) : i === 74 || i === 40 ? e.shiftKey ? this.Reveal.slide(void 0, Number.MAX_VALUE) : !this.Reveal.overview.isActive() && y ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.down({ skipFragments: e.altKey }) : i === 36 ? this.Reveal.slide(0) : i === 35 ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : i === 32 ? (this.Reveal.overview.isActive() && this.Reveal.overview.deactivate(), e.shiftKey ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey })) : [58, 59, 66, 86, 190].includes(i) || i === 191 && !e.shiftKey ? this.Reveal.togglePause() : i === 70 ? Ht(t.embedded ? this.Reveal.getViewportElement() : document.documentElement) : i === 65 ? t.autoSlideStoppable && this.Reveal.toggleAutoSlide(s) : i === 71 ? t.jumpToSlide && this.Reveal.toggleJumpToSlide() : i === 191 && e.shiftKey ? this.Reveal.toggleHelp() : i === 112 ? this.Reveal.toggleHelp() : w = !1), w ? e.preventDefault && e.preventDefault() : (i === 27 || i === 79) && (this.Reveal.closeOverlay() === !1 && this.Reveal.overview.toggle(), e.preventDefault && e.preventDefault()), this.Reveal.cueAutoSlide();
  }
}
class Wi {
  constructor(e) {
    // The minimum number of milliseconds that must pass between
    // calls to history.replaceState
    Pt(this, "MAX_REPLACE_STATE_FREQUENCY", 1e3);
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
  getIndicesFromHash(e = window.location.hash, t = {}) {
    let i = e.replace(/^#\/?/, ""), s = i.split("/");
    if (!/^[0-9]*$/.test(s[0]) && i.length) {
      let d, n;
      /\/[-\d]+$/g.test(i) && (n = parseInt(i.split("/").pop(), 10), n = isNaN(n) ? void 0 : n, i = i.split("/").shift());
      try {
        d = document.getElementById(decodeURIComponent(i)).closest(".slides section");
      } catch {
      }
      if (d)
        return { ...this.Reveal.getIndices(d), f: n };
    } else {
      const d = this.Reveal.getConfig();
      let n = d.hashOneBasedIndex || t.oneBasedIndex ? 1 : 0, o = parseInt(s[0], 10) - n || 0, c = parseInt(s[1], 10) - n || 0, f;
      return d.fragmentInURL && (f = parseInt(s[2], 10), isNaN(f) && (f = void 0)), { h: o, v: c, f };
    }
    return null;
  }
  /**
   * Reads the current URL (hash) and navigates accordingly.
   */
  readURL() {
    const e = this.Reveal.getIndices(), t = this.getIndicesFromHash();
    t ? (t.h !== e.h || t.v !== e.v || t.f !== void 0) && this.Reveal.slide(t.h, t.v, t.f) : this.Reveal.slide(e.h || 0, e.v || 0);
  }
  /**
   * Updates the page URL (hash) to reflect the current
   * state.
   *
   * @param {number} delay The time in ms to wait before
   * writing the hash
   */
  writeURL(e) {
    let t = this.Reveal.getConfig(), i = this.Reveal.getCurrentSlide();
    if (clearTimeout(this.writeURLTimeout), typeof e == "number")
      this.writeURLTimeout = setTimeout(this.writeURL, e);
    else if (i) {
      let s = this.getHash();
      t.history ? window.location.hash = s : t.hash && (s === "/" ? this.debouncedReplaceState(window.location.pathname + window.location.search) : this.debouncedReplaceState("#" + s));
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
    let t = "/", i = e || this.Reveal.getCurrentSlide(), s = i ? i.getAttribute("id") : null;
    s && (s = encodeURIComponent(s));
    let d = this.Reveal.getIndices(e);
    if (this.Reveal.getConfig().fragmentInURL || (d.f = void 0), typeof s == "string" && s.length)
      t = "/" + s, d.f >= 0 && (t += "/" + d.f);
    else {
      let n = this.Reveal.getConfig().hashOneBasedIndex ? 1 : 0;
      (d.h > 0 || d.v > 0 || d.f >= 0) && (t += d.h + n), (d.v > 0 || d.f >= 0) && (t += "/" + (d.v + n)), d.f >= 0 && (t += "/" + d.f);
    }
    return t;
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
class ji {
  constructor(e) {
    this.Reveal = e, this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this), this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this), this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this), this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this), this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this), this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this), this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
  }
  render() {
    const e = this.Reveal.getConfig().rtl, t = this.Reveal.getRevealElement();
    this.element = document.createElement("aside"), this.element.className = "controls", this.element.innerHTML = `<button class="navigate-left" aria-label="${e ? "next slide" : "previous slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${e ? "previous slide" : "next slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`, this.Reveal.getRevealElement().appendChild(this.element), this.controlsLeft = E(t, ".navigate-left"), this.controlsRight = E(t, ".navigate-right"), this.controlsUp = E(t, ".navigate-up"), this.controlsDown = E(t, ".navigate-down"), this.controlsPrev = E(t, ".navigate-prev"), this.controlsNext = E(t, ".navigate-next"), this.controlsFullscreen = E(t, ".enter-fullscreen"), this.controlsRightArrow = this.element.querySelector(".navigate-right"), this.controlsLeftArrow = this.element.querySelector(".navigate-left"), this.controlsDownArrow = this.element.querySelector(".navigate-down");
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
    this.element.style.display = e.controls ? "block" : "none", this.element.setAttribute("data-controls-layout", e.controlsLayout), this.element.setAttribute("data-controls-back-arrows", e.controlsBackArrows);
  }
  bind() {
    let e = ["touchstart", "click"];
    zt && (e = ["touchstart"]), e.forEach((t) => {
      this.controlsLeft.forEach((i) => i.addEventListener(t, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((i) => i.addEventListener(t, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((i) => i.addEventListener(t, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((i) => i.addEventListener(t, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((i) => i.addEventListener(t, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((i) => i.addEventListener(t, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((i) => i.addEventListener(t, this.onEnterFullscreen, !1));
    });
  }
  unbind() {
    ["touchstart", "click"].forEach((e) => {
      this.controlsLeft.forEach((t) => t.removeEventListener(e, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((t) => t.removeEventListener(e, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((t) => t.removeEventListener(e, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((t) => t.removeEventListener(e, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((t) => t.removeEventListener(e, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((t) => t.removeEventListener(e, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((t) => t.removeEventListener(e, this.onEnterFullscreen, !1));
    });
  }
  /**
   * Updates the state of all control/navigation arrows.
   */
  update() {
    let e = this.Reveal.availableRoutes();
    [...this.controlsLeft, ...this.controlsRight, ...this.controlsUp, ...this.controlsDown, ...this.controlsPrev, ...this.controlsNext].forEach((i) => {
      i.classList.remove("enabled", "fragmented"), i.setAttribute("disabled", "disabled");
    }), e.left && this.controlsLeft.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    }), e.right && this.controlsRight.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    }), e.up && this.controlsUp.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    }), e.down && this.controlsDown.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    }), (e.left || e.up) && this.controlsPrev.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    }), (e.right || e.down) && this.controlsNext.forEach((i) => {
      i.classList.add("enabled"), i.removeAttribute("disabled");
    });
    let t = this.Reveal.getCurrentSlide();
    if (t) {
      let i = this.Reveal.fragments.availableRoutes();
      i.prev && this.controlsPrev.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      }), i.next && this.controlsNext.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      }), this.Reveal.isVerticalSlide(t) ? (i.prev && this.controlsUp.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      }), i.next && this.controlsDown.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      })) : (i.prev && this.controlsLeft.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      }), i.next && this.controlsRight.forEach((s) => {
        s.classList.add("fragmented", "enabled"), s.removeAttribute("disabled");
      }));
    }
    if (this.Reveal.getConfig().controlsTutorial) {
      let i = this.Reveal.getIndices();
      !this.Reveal.hasNavigatedVertically() && e.down ? this.controlsDownArrow.classList.add("highlight") : (this.controlsDownArrow.classList.remove("highlight"), this.Reveal.getConfig().rtl ? !this.Reveal.hasNavigatedHorizontally() && e.left && i.v === 0 ? this.controlsLeftArrow.classList.add("highlight") : this.controlsLeftArrow.classList.remove("highlight") : !this.Reveal.hasNavigatedHorizontally() && e.right && i.v === 0 ? this.controlsRightArrow.classList.add("highlight") : this.controlsRightArrow.classList.remove("highlight"));
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
    const t = this.Reveal.getConfig(), i = this.Reveal.getViewportElement();
    Ht(t.embedded ? i : i.parentElement);
  }
}
class _i {
  constructor(e) {
    this.Reveal = e, this.onProgressClicked = this.onProgressClicked.bind(this);
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "progress", this.Reveal.getRevealElement().appendChild(this.element), this.bar = document.createElement("span"), this.element.appendChild(this.bar);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
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
    let t = this.Reveal.getSlides(), i = t.length, s = Math.floor(e.clientX / this.getMaxWidth() * i);
    this.Reveal.getConfig().rtl && (s = i - s);
    let d = this.Reveal.getIndices(t[s]);
    this.Reveal.slide(d.h, d.v);
  }
  destroy() {
    this.element.remove();
  }
}
class Ki {
  constructor(e) {
    this.Reveal = e, this.lastMouseWheelStep = 0, this.cursorHidden = !1, this.cursorInactiveTimeout = 0, this.onDocumentCursorActive = this.onDocumentCursorActive.bind(this), this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
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
      let t = e.detail || -e.wheelDelta;
      t > 0 ? this.Reveal.next() : t < 0 && this.Reveal.prev();
    }
  }
}
const Mt = (h, e) => {
  const t = document.createElement("script");
  t.type = "text/javascript", t.async = !1, t.defer = !1, t.src = h, typeof e == "function" && (t.onload = t.onreadystatechange = (s) => {
    (s.type === "load" || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = t.onerror = null, e());
  }, t.onerror = (s) => {
    t.onload = t.onreadystatechange = t.onerror = null, e(new Error("Failed loading script: " + t.src + `
` + s));
  });
  const i = document.querySelector("head");
  i.insertBefore(t, i.lastChild);
};
class $i {
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
  load(e, t) {
    return this.state = "loading", e.forEach(this.registerPlugin.bind(this)), new Promise((i) => {
      let s = [], d = 0;
      if (t.forEach((n) => {
        (!n.condition || n.condition()) && (n.async ? this.asyncDependencies.push(n) : s.push(n));
      }), s.length) {
        d = s.length;
        const n = (o) => {
          o && typeof o.callback == "function" && o.callback(), --d === 0 && this.initPlugins().then(i);
        };
        s.forEach((o) => {
          typeof o.id == "string" ? (this.registerPlugin(o), n(o)) : typeof o.src == "string" ? Mt(o.src, () => n(o)) : (console.warn("Unrecognized plugin format", o), n());
        });
      } else
        this.initPlugins().then(i);
    });
  }
  /**
   * Initializes our plugins and waits for them to be ready
   * before proceeding.
   */
  initPlugins() {
    return new Promise((e) => {
      let t = Object.values(this.registeredPlugins), i = t.length;
      if (i === 0)
        this.loadAsync().then(e);
      else {
        let s, d = () => {
          --i === 0 ? this.loadAsync().then(e) : s();
        }, n = 0;
        s = () => {
          let o = t[n++];
          if (typeof o.init == "function") {
            let c = o.init(this.Reveal);
            c && typeof c.then == "function" ? c.then(d) : d();
          } else
            d();
        }, s();
      }
    });
  }
  /**
   * Loads all async reveal.js dependencies.
   */
  loadAsync() {
    return this.state = "loaded", this.asyncDependencies.length && this.asyncDependencies.forEach((e) => {
      Mt(e.src, e.callback);
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
    let t = e.id;
    typeof t != "string" ? console.warn("Unrecognized plugin format; can't find plugin.id", e) : this.registeredPlugins[t] === void 0 ? (this.registeredPlugins[t] = e, this.state === "loaded" && typeof e.init == "function" && e.init(this.Reveal)) : console.warn('reveal.js: "' + t + '" plugin has already been registered');
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
const Ce = 40;
class Xi {
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
    if (Pe(e, "video[controls], audio[controls]"))
      return !0;
    for (; e && typeof e.hasAttribute == "function"; ) {
      if (e.hasAttribute("data-prevent-swipe"))
        return !0;
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
    if (this.touchCaptured = !1, this.isSwipePrevented(e.target))
      return !0;
    this.touchStartX = e.touches[0].clientX, this.touchStartY = e.touches[0].clientY, this.touchStartCount = e.touches.length;
  }
  /**
   * Handler for the 'touchmove' event.
   *
   * @param {object} event
   */
  onTouchMove(e) {
    if (this.isSwipePrevented(e.target))
      return !0;
    let t = this.Reveal.getConfig();
    if (this.touchCaptured)
      zt && e.preventDefault();
    else {
      this.Reveal.onUserInput(e);
      let i = e.touches[0].clientX, s = e.touches[0].clientY;
      if (e.touches.length === 1 && this.touchStartCount !== 2) {
        let d = this.Reveal.availableRoutes({ includeFragments: !0 }), n = i - this.touchStartX, o = s - this.touchStartY;
        n > Ce && Math.abs(n) > Math.abs(o) ? (this.touchCaptured = !0, t.navigationMode === "linear" ? t.rtl ? this.Reveal.next() : this.Reveal.prev() : this.Reveal.left()) : n < -Ce && Math.abs(n) > Math.abs(o) ? (this.touchCaptured = !0, t.navigationMode === "linear" ? t.rtl ? this.Reveal.prev() : this.Reveal.next() : this.Reveal.right()) : o > Ce && d.up ? (this.touchCaptured = !0, t.navigationMode === "linear" ? this.Reveal.prev() : this.Reveal.up()) : o < -Ce && d.down && (this.touchCaptured = !0, t.navigationMode === "linear" ? this.Reveal.next() : this.Reveal.down()), t.embedded ? (this.touchCaptured || this.Reveal.isVerticalSlide()) && e.preventDefault() : e.preventDefault();
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
const Ue = "focus", Bt = "blur";
class Yi {
  constructor(e) {
    this.Reveal = e, this.onRevealPointerDown = this.onRevealPointerDown.bind(this), this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
    e.embedded ? this.blur() : (this.focus(), this.unbind());
  }
  bind() {
    this.Reveal.getConfig().embedded && this.Reveal.getRevealElement().addEventListener("pointerdown", this.onRevealPointerDown, !1);
  }
  unbind() {
    this.Reveal.getRevealElement().removeEventListener("pointerdown", this.onRevealPointerDown, !1), document.removeEventListener("pointerdown", this.onDocumentPointerDown, !1);
  }
  focus() {
    this.state !== Ue && (this.Reveal.getRevealElement().classList.add("focused"), document.addEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = Ue;
  }
  blur() {
    this.state !== Bt && (this.Reveal.getRevealElement().classList.remove("focused"), document.removeEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = Bt;
  }
  isFocused() {
    return this.state === Ue;
  }
  destroy() {
    this.Reveal.getRevealElement().classList.remove("focused");
  }
  onRevealPointerDown(e) {
    this.focus();
  }
  onDocumentPointerDown(e) {
    let t = F(e.target, ".reveal");
    (!t || t !== this.Reveal.getRevealElement()) && this.blur();
  }
}
class Gi {
  constructor(e) {
    this.Reveal = e;
  }
  render() {
    this.element = document.createElement("div"), this.element.className = "speaker-notes", this.element.setAttribute("data-prevent-swipe", ""), this.element.setAttribute("tabindex", "0"), this.Reveal.getRevealElement().appendChild(this.element);
  }
  /**
   * Called when the reveal.js config is updated.
   */
  configure(e, t) {
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
    let t = e.querySelectorAll("aside.notes");
    return t ? Array.from(t).map((i) => i.innerHTML).join(`
`) : null;
  }
  destroy() {
    this.element.remove();
  }
}
class Ji {
  /**
   * @param {HTMLElement} container The component will append
   * itself to this
   * @param {function} progressCheck A method which will be
   * called frequently to get the current playback progress on
   * a range of 0-1
   */
  constructor(e, t) {
    this.diameter = 100, this.diameter2 = this.diameter / 2, this.thickness = 6, this.playing = !1, this.progress = 0, this.progressOffset = 1, this.container = e, this.progressCheck = t, this.canvas = document.createElement("canvas"), this.canvas.className = "playback", this.canvas.width = this.diameter, this.canvas.height = this.diameter, this.canvas.style.width = this.diameter2 + "px", this.canvas.style.height = this.diameter2 + "px", this.context = this.canvas.getContext("2d"), this.container.appendChild(this.canvas), this.render();
  }
  setPlaying(e) {
    const t = this.playing;
    this.playing = e, !t && this.playing ? this.animate() : this.render();
  }
  animate() {
    const e = this.progress;
    this.progress = this.progressCheck(), e > 0.8 && this.progress < 0.2 && (this.progressOffset = this.progress), this.render(), this.playing && requestAnimationFrame(this.animate.bind(this));
  }
  /**
   * Renders the current progress and playback state.
   */
  render() {
    let e = this.playing ? this.progress : 0, t = this.diameter2 - this.thickness, i = this.diameter2, s = this.diameter2, d = 28;
    this.progressOffset += (1 - this.progressOffset) * 0.1;
    const n = -Math.PI / 2 + e * (Math.PI * 2), o = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);
    this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(i, s, t + 4, 0, Math.PI * 2, !1), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(i, s, t, 0, Math.PI * 2, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(i, s, t, o, n, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(i - d / 2, s - d / 2), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, d / 2 - 4, d), this.context.fillRect(d / 2 + 4, 0, d / 2 - 4, d)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(d - 4, d / 2), this.context.lineTo(0, d), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore();
  }
  on(e, t) {
    this.canvas.addEventListener(e, t, !1);
  }
  off(e, t) {
    this.canvas.removeEventListener(e, t, !1);
  }
  destroy() {
    this.playing = !1, this.canvas.parentNode && this.container.removeChild(this.canvas);
  }
}
const Qi = {
  // The "normal" size of the presentation, aspect ratio will be preserved
  // when the presentation is scaled to fit different resolutions
  width: 960,
  height: 700,
  // Factor of the display size that should remain empty around the content
  margin: 0.04,
  // Bounds for smallest/largest possible scale to apply to content
  minScale: 0.2,
  maxScale: 2,
  // Display presentation control arrows
  controls: !0,
  // Help the user learn the controls by providing hints, for example by
  // bouncing the down arrow when they first encounter a vertical slide
  controlsTutorial: !0,
  // Determines where controls appear, "edges" or "bottom-right"
  controlsLayout: "bottom-right",
  // Visibility rule for backwards navigation arrows; "faded", "hidden"
  // or "visible"
  controlsBackArrows: "faded",
  // Display a presentation progress bar
  progress: !0,
  // Display the page number of the current slide
  // - true:    Show slide number
  // - false:   Hide slide number
  //
  // Can optionally be set as a string that specifies the number formatting:
  // - "h.v":	  Horizontal . vertical slide number (default)
  // - "h/v":	  Horizontal / vertical slide number
  // - "c":	  Flattened slide number
  // - "c/t":	  Flattened slide number / total slides
  //
  // Alternatively, you can provide a function that returns the slide
  // number for the current slide. The function should take in a slide
  // object and return an array with one string [slideNumber] or
  // three strings [n1,delimiter,n2]. See #formatSlideNumber().
  slideNumber: !1,
  // Can be used to limit the contexts in which the slide number appears
  // - "all":      Always show the slide number
  // - "print":    Only when printing to PDF
  // - "speaker":  Only in the speaker view
  showSlideNumber: "all",
  // Use 1 based indexing for # links to match slide number (default is zero
  // based)
  hashOneBasedIndex: !1,
  // Add the current slide number to the URL hash so that reloading the
  // page/copying the URL will return you to the same slide
  hash: !1,
  // Flags if we should monitor the hash and change slides accordingly
  respondToHashChanges: !0,
  // Enable support for jump-to-slide navigation shortcuts
  jumpToSlide: !0,
  // Push each slide change to the browser history.  Implies `hash: true`
  history: !1,
  // Enable keyboard shortcuts for navigation
  keyboard: !0,
  // Optional function that blocks keyboard events when retuning false
  //
  // If you set this to 'focused', we will only capture keyboard events
  // for embedded decks when they are in focus
  keyboardCondition: null,
  // Disables the default reveal.js slide layout (scaling and centering)
  // so that you can use custom CSS layout
  disableLayout: !1,
  // Enable the slide overview mode
  overview: !0,
  // Vertical centering of slides
  center: !0,
  // Enables touch navigation on devices with touch input
  touch: !0,
  // Loop the presentation
  loop: !1,
  // Change the presentation direction to be RTL
  rtl: !1,
  // Changes the behavior of our navigation directions.
  //
  // "default"
  // Left/right arrow keys step between horizontal slides, up/down
  // arrow keys step between vertical slides. Space key steps through
  // all slides (both horizontal and vertical).
  //
  // "linear"
  // Removes the up/down arrows. Left/right arrows step through all
  // slides (both horizontal and vertical).
  //
  // "grid"
  // When this is enabled, stepping left/right from a vertical stack
  // to an adjacent vertical stack will land you at the same vertical
  // index.
  //
  // Consider a deck with six slides ordered in two vertical stacks:
  // 1.1    2.1
  // 1.2    2.2
  // 1.3    2.3
  //
  // If you're on slide 1.3 and navigate right, you will normally move
  // from 1.3 -> 2.1. If "grid" is used, the same navigation takes you
  // from 1.3 -> 2.3.
  navigationMode: "default",
  // Randomizes the order of slides each time the presentation loads
  shuffle: !1,
  // Turns fragments on and off globally
  fragments: !0,
  // Flags whether to include the current fragment in the URL,
  // so that reloading brings you to the same fragment position
  fragmentInURL: !0,
  // Flags if the presentation is running in an embedded mode,
  // i.e. contained within a limited portion of the screen
  embedded: !1,
  // Flags if we should show a help overlay when the question-mark
  // key is pressed
  help: !0,
  // Flags if it should be possible to pause the presentation (blackout)
  pause: !0,
  // Flags if speaker notes should be visible to all viewers
  showNotes: !1,
  // Flags if slides with data-visibility="hidden" should be kep visible
  showHiddenSlides: !1,
  // Global override for autoplaying embedded media (video/audio/iframe)
  // - null:   Media will only autoplay if data-autoplay is present
  // - true:   All media will autoplay, regardless of individual setting
  // - false:  No media will autoplay, regardless of individual setting
  autoPlayMedia: null,
  // Global override for preloading lazy-loaded iframes
  // - null:   Iframes with data-src AND data-preload will be loaded when within
  //           the viewDistance, iframes with only data-src will be loaded when visible
  // - true:   All iframes with data-src will be loaded when within the viewDistance
  // - false:  All iframes with data-src will be loaded only when visible
  preloadIframes: null,
  // Can be used to globally disable auto-animation
  autoAnimate: !0,
  // Optionally provide a custom element matcher that will be
  // used to dictate which elements we can animate between.
  autoAnimateMatcher: null,
  // Default settings for our auto-animate transitions, can be
  // overridden per-slide or per-element via data arguments
  autoAnimateEasing: "ease",
  autoAnimateDuration: 1,
  autoAnimateUnmatched: !0,
  // CSS properties that can be auto-animated. Position & scale
  // is matched separately so there's no need to include styles
  // like top/right/bottom/left, width/height or margin.
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
  // Controls automatic progression to the next slide
  // - 0:      Auto-sliding only happens if the data-autoslide HTML attribute
  //           is present on the current slide or fragment
  // - 1+:     All slides will progress automatically at the given interval
  // - false:  No auto-sliding, even if data-autoslide is present
  autoSlide: 0,
  // Stop auto-sliding after user input
  autoSlideStoppable: !0,
  // Use this method for navigation when auto-sliding (defaults to navigateNext)
  autoSlideMethod: null,
  // Specify the average time in seconds that you think you will spend
  // presenting each slide. This is used to show a pacing timer in the
  // speaker view
  defaultTiming: null,
  // Enable slide navigation via mouse wheel
  mouseWheel: !1,
  // Opens links in an iframe preview overlay
  // Add `data-preview-link` and `data-preview-link="false"` to customise each link
  // individually
  previewLinks: !1,
  // Exposes the reveal.js API through window.postMessage
  postMessage: !0,
  // Dispatches all reveal.js events to the parent window through postMessage
  postMessageEvents: !1,
  // Focuses body when page changes visibility to ensure keyboard shortcuts work
  focusBodyOnPageVisibilityChange: !0,
  // Transition style
  transition: "slide",
  // none/fade/slide/convex/concave/zoom
  // Transition speed
  transitionSpeed: "default",
  // default/fast/slow
  // Transition style for full page slide backgrounds
  backgroundTransition: "fade",
  // none/fade/slide/convex/concave/zoom
  // Parallax background image
  parallaxBackgroundImage: "",
  // CSS syntax, e.g. "a.jpg"
  // Parallax background size
  parallaxBackgroundSize: "",
  // CSS syntax, e.g. "3000px 2000px"
  // Parallax background repeat
  parallaxBackgroundRepeat: "",
  // repeat/repeat-x/repeat-y/no-repeat/initial/inherit
  // Parallax background position
  parallaxBackgroundPosition: "",
  // CSS syntax, e.g. "top left"
  // Amount of pixels to move the parallax background per slide step
  parallaxBackgroundHorizontal: null,
  parallaxBackgroundVertical: null,
  // Can be used to initialize reveal.js in one of the following views:
  // - print:   Render the presentation so that it can be printed to PDF
  // - scroll:  Show the presentation as a tall scrollable page with scroll
  //            triggered animations
  view: null,
  // Adjusts the height of each slide in the scroll view.
  // - full:       Each slide is as tall as the viewport
  // - compact:    Slides are as small as possible, allowing multiple slides
  //               to be visible in parallel on tall devices
  scrollLayout: "full",
  // Control how scroll snapping works in the scroll view.
  // - false:   	No snapping, scrolling is continuous
  // - proximity:  Snap when close to a slide
  // - mandatory:  Always snap to the closest slide
  //
  // Only applies to presentations in scroll view.
  scrollSnap: "mandatory",
  // Enables and configure the scroll view progress bar.
  // - 'auto':    Show the scrollbar while scrolling, hide while idle
  // - true:      Always show the scrollbar
  // - false:     Never show the scrollbar
  scrollProgress: "auto",
  // Automatically activate the scroll view when we the viewport falls
  // below the given width.
  scrollActivationWidth: 435,
  // The maximum number of pages a single slide can expand onto when printing
  // to PDF, unlimited by default
  pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,
  // Prints each fragment on a separate slide
  pdfSeparateFragments: !0,
  // Offset used to reduce the height of content within exported PDF pages.
  // This exists to account for environment differences based on how you
  // print to PDF. CLI printing options, like phantomjs and wkpdf, can end
  // on precisely the total height of the document whereas in-browser
  // printing has to end one pixel before.
  pdfPageHeightOffset: -1,
  // Number of slides away from the current that are visible
  viewDistance: 3,
  // Number of slides away from the current that are visible on mobile
  // devices. It is advisable to set this to a lower number than
  // viewDistance in order to save resources.
  mobileViewDistance: 2,
  // The display mode that will be used to show slides
  display: "block",
  // Hide cursor if inactive
  hideInactiveCursor: !0,
  // Time before the cursor is hidden (in ms)
  hideCursorTime: 5e3,
  // Should we automatically sort and set indices for fragments
  // at each sync? (See Reveal.sync)
  sortFragmentsOnSync: !0,
  // Script dependencies to load
  dependencies: [],
  // Plugin objects to register and use for this presentation
  plugins: []
}, Vt = "5.0.5";
function Ot(h, e) {
  arguments.length < 2 && (e = arguments[0], h = document.querySelector(".reveal"));
  const t = {};
  let i = {}, s = !1, d = !1, n, o, c, f, g = {
    hasNavigatedHorizontally: !1,
    hasNavigatedVertically: !1
  }, v = [], y = 1, w = { layout: "", overview: "" }, r = {}, A = "idle", T = 0, V, O = 0, se = -1, z = !1, k = new Ri(t), I = new xi(t), U = new Ti(t), W = new Mi(t), P = new Ni(t), R = new Fi(t), D = new Vi(t), L = new Oi(t), u = new qi(t), S = new Ui(t), N = new Wi(t), $ = new ji(t), j = new _i(t), Z = new Ki(t), H = new $i(t), ae = new Yi(t), xe = new Xi(t), K = new Gi(t);
  function Ut(a) {
    if (!h)
      throw 'Unable to find presentation root (<div class="reveal">).';
    if (s = !0, r.wrapper = h, r.slides = h.querySelector(".slides"), !r.slides)
      throw 'Unable to find slides container (<div class="slides">).';
    return i = { ...Qi, ...i, ...e, ...a, ...xt() }, /print-pdf/gi.test(window.location.search) && (i.view = "print"), Wt(), window.addEventListener("load", le, !1), H.load(i.plugins, i.dependencies).then(jt), new Promise((l) => t.on("ready", l));
  }
  function Wt() {
    i.embedded === !0 ? r.viewport = F(h, ".reveal-viewport") || h : (r.viewport = document.body, document.documentElement.classList.add("reveal-full-page")), r.viewport.classList.add("reveal-viewport");
  }
  function jt() {
    d = !0, Kt(), $t(), Jt(), Yt(), Gt(), oi(), Ke(), P.update(!0), _t(), N.readURL(), setTimeout(() => {
      r.slides.classList.remove("no-transition"), r.wrapper.classList.add("ready"), _({
        type: "ready",
        data: {
          indexh: n,
          indexv: o,
          currentSlide: f
        }
      });
    }, 1);
  }
  function _t() {
    const a = i.view === "print", l = i.view === "scroll" || i.view === "reader";
    (a || l) && (a ? ye() : xe.unbind(), r.viewport.classList.add("loading-scroll-mode"), a ? document.readyState === "complete" ? D.activate() : window.addEventListener("load", () => D.activate()) : R.activate());
  }
  function Kt() {
    i.showHiddenSlides || E(r.wrapper, 'section[data-visibility="hidden"]').forEach((a) => {
      const l = a.parentNode;
      l.childElementCount === 1 && /section/i.test(l.nodeName) ? l.remove() : a.remove();
    });
  }
  function $t() {
    r.slides.classList.add("no-transition"), fe ? r.wrapper.classList.add("no-hover") : r.wrapper.classList.remove("no-hover"), P.render(), I.render(), U.render(), $.render(), j.render(), K.render(), r.pauseOverlay = yi(r.wrapper, "div", "pause-overlay", i.controls ? '<button class="resume-button">Resume presentation</button>' : null), r.statusElement = Xt(), r.wrapper.setAttribute("role", "application");
  }
  function Xt() {
    let a = r.wrapper.querySelector(".aria-status");
    return a || (a = document.createElement("div"), a.style.position = "absolute", a.style.height = "1px", a.style.width = "1px", a.style.overflow = "hidden", a.style.clip = "rect( 1px, 1px, 1px, 1px )", a.classList.add("aria-status"), a.setAttribute("aria-live", "polite"), a.setAttribute("aria-atomic", "true"), r.wrapper.appendChild(a)), a;
  }
  function Te(a) {
    r.statusElement.textContent = a;
  }
  function me(a) {
    let l = "";
    if (a.nodeType === 3)
      l += a.textContent;
    else if (a.nodeType === 1) {
      let p = a.getAttribute("aria-hidden"), m = window.getComputedStyle(a).display === "none";
      p !== "true" && !m && Array.from(a.childNodes).forEach((b) => {
        l += me(b);
      });
    }
    return l = l.trim(), l === "" ? "" : l + " ";
  }
  function Yt() {
    setInterval(() => {
      (!R.isActive() && r.wrapper.scrollTop !== 0 || r.wrapper.scrollLeft !== 0) && (r.wrapper.scrollTop = 0, r.wrapper.scrollLeft = 0);
    }, 1e3);
  }
  function Gt() {
    document.addEventListener("fullscreenchange", ke), document.addEventListener("webkitfullscreenchange", ke);
  }
  function Jt() {
    i.postMessage && window.addEventListener("message", Et, !1);
  }
  function Ke(a) {
    const l = { ...i };
    if (typeof a == "object" && ue(i, a), t.isReady() === !1)
      return;
    const p = r.wrapper.querySelectorAll(re).length;
    r.wrapper.classList.remove(l.transition), r.wrapper.classList.add(i.transition), r.wrapper.setAttribute("data-transition-speed", i.transitionSpeed), r.wrapper.setAttribute("data-background-transition", i.backgroundTransition), r.viewport.style.setProperty("--slide-width", typeof i.width == "string" ? i.width : i.width + "px"), r.viewport.style.setProperty("--slide-height", typeof i.height == "string" ? i.height : i.height + "px"), i.shuffle && He(), qe(r.wrapper, "embedded", i.embedded), qe(r.wrapper, "rtl", i.rtl), qe(r.wrapper, "center", i.center), i.pause === !1 && pe(), i.previewLinks ? (Qe(), Ne("[data-preview-link=false]")) : (Ne(), Qe("[data-preview-link]:not([data-preview-link=false])")), W.reset(), V && (V.destroy(), V = null), p > 1 && i.autoSlide && i.autoSlideStoppable && (V = new Ji(r.wrapper, () => Math.min(Math.max((Date.now() - se) / T, 0), 1)), V.on("click", gi), z = !1), i.navigationMode !== "default" ? r.wrapper.setAttribute("data-navigation-mode", i.navigationMode) : r.wrapper.removeAttribute("data-navigation-mode"), K.configure(i, l), ae.configure(i, l), Z.configure(i, l), $.configure(i, l), j.configure(i, l), S.configure(i, l), L.configure(i, l), I.configure(i, l), lt();
  }
  function $e() {
    window.addEventListener("resize", Rt, !1), i.touch && xe.bind(), i.keyboard && S.bind(), i.progress && j.bind(), i.respondToHashChanges && N.bind(), $.bind(), ae.bind(), r.slides.addEventListener("click", At, !1), r.slides.addEventListener("transitionend", St, !1), r.pauseOverlay.addEventListener("click", pe, !1), i.focusBodyOnPageVisibilityChange && document.addEventListener("visibilitychange", kt, !1);
  }
  function ye() {
    xe.unbind(), ae.unbind(), S.unbind(), $.unbind(), j.unbind(), N.unbind(), window.removeEventListener("resize", Rt, !1), r.slides.removeEventListener("click", At, !1), r.slides.removeEventListener("transitionend", St, !1), r.pauseOverlay.removeEventListener("click", pe, !1);
  }
  function Qt() {
    s !== !1 && (ye(), we(), Ne(), K.destroy(), ae.destroy(), H.destroy(), Z.destroy(), $.destroy(), j.destroy(), P.destroy(), I.destroy(), U.destroy(), document.removeEventListener("fullscreenchange", ke), document.removeEventListener("webkitfullscreenchange", ke), document.removeEventListener("visibilitychange", kt, !1), window.removeEventListener("message", Et, !1), window.removeEventListener("load", le, !1), r.pauseOverlay && r.pauseOverlay.remove(), r.statusElement && r.statusElement.remove(), document.documentElement.classList.remove("reveal-full-page"), r.wrapper.classList.remove("ready", "center", "has-horizontal-slides", "has-vertical-slides"), r.wrapper.removeAttribute("data-transition-speed"), r.wrapper.removeAttribute("data-background-transition"), r.viewport.classList.remove("reveal-viewport"), r.viewport.style.removeProperty("--slide-width"), r.viewport.style.removeProperty("--slide-height"), r.slides.style.removeProperty("width"), r.slides.style.removeProperty("height"), r.slides.style.removeProperty("zoom"), r.slides.style.removeProperty("left"), r.slides.style.removeProperty("top"), r.slides.style.removeProperty("bottom"), r.slides.style.removeProperty("right"), r.slides.style.removeProperty("transform"), Array.from(r.wrapper.querySelectorAll(re)).forEach((a) => {
      a.style.removeProperty("display"), a.style.removeProperty("top"), a.removeAttribute("hidden"), a.removeAttribute("aria-hidden");
    }));
  }
  function Xe(a, l, p) {
    h.addEventListener(a, l, p);
  }
  function Ye(a, l, p) {
    h.removeEventListener(a, l, p);
  }
  function Ie(a) {
    typeof a.layout == "string" && (w.layout = a.layout), typeof a.overview == "string" && (w.overview = a.overview), w.layout ? ie(r.slides, w.layout + " " + w.overview) : ie(r.slides, w.overview);
  }
  function _({ target: a = r.wrapper, type: l, data: p, bubbles: m = !0 }) {
    let b = document.createEvent("HTMLEvents", 1, 2);
    return b.initEvent(l, m, !0), ue(b, p), a.dispatchEvent(b), a === r.wrapper && Je(l), b;
  }
  function Ge(a) {
    _({
      type: "slidechanged",
      data: {
        indexh: n,
        indexv: o,
        previousSlide: c,
        currentSlide: f,
        origin: a
      }
    });
  }
  function Je(a, l) {
    if (i.postMessageEvents && window.parent !== window.self) {
      let p = {
        namespace: "reveal",
        eventName: a,
        state: bt()
      };
      ue(p, l), window.parent.postMessage(JSON.stringify(p), "*");
    }
  }
  function Qe(a = "a") {
    Array.from(r.wrapper.querySelectorAll(a)).forEach((l) => {
      /^(http|www)/gi.test(l.getAttribute("href")) && l.addEventListener("click", Lt, !1);
    });
  }
  function Ne(a = "a") {
    Array.from(r.wrapper.querySelectorAll(a)).forEach((l) => {
      /^(http|www)/gi.test(l.getAttribute("href")) && l.removeEventListener("click", Lt, !1);
    });
  }
  function Ze(a) {
    G(), r.overlay = document.createElement("div"), r.overlay.classList.add("overlay"), r.overlay.classList.add("overlay-preview"), r.wrapper.appendChild(r.overlay), r.overlay.innerHTML = `<header>
				<a class="close" href="#"><span class="icon"></span></a>
				<a class="external" href="${a}" target="_blank"><span class="icon"></span></a>
			</header>
			<div class="spinner"></div>
			<div class="viewport">
				<iframe src="${a}"></iframe>
				<small class="viewport-inner">
					<span class="x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`, r.overlay.querySelector("iframe").addEventListener("load", (l) => {
      r.overlay.classList.add("loaded");
    }, !1), r.overlay.querySelector(".close").addEventListener("click", (l) => {
      G(), l.preventDefault();
    }, !1), r.overlay.querySelector(".external").addEventListener("click", (l) => {
      G();
    }, !1);
  }
  function Zt(a) {
    typeof a == "boolean" ? a ? et() : G() : r.overlay ? G() : et();
  }
  function et() {
    if (i.help) {
      G(), r.overlay = document.createElement("div"), r.overlay.classList.add("overlay"), r.overlay.classList.add("overlay-help"), r.wrapper.appendChild(r.overlay);
      let a = '<p class="title">Keyboard Shortcuts</p><br/>', l = S.getShortcuts(), p = S.getBindings();
      a += "<table><th>KEY</th><th>ACTION</th>";
      for (let m in l)
        a += `<tr><td>${m}</td><td>${l[m]}</td></tr>`;
      for (let m in p)
        p[m].key && p[m].description && (a += `<tr><td>${p[m].key}</td><td>${p[m].description}</td></tr>`);
      a += "</table>", r.overlay.innerHTML = `
				<header>
					<a class="close" href="#"><span class="icon"></span></a>
				</header>
				<div class="viewport">
					<div class="viewport-inner">${a}</div>
				</div>
			`, r.overlay.querySelector(".close").addEventListener("click", (m) => {
        G(), m.preventDefault();
      }, !1);
    }
  }
  function G() {
    return r.overlay ? (r.overlay.parentNode.removeChild(r.overlay), r.overlay = null, !0) : !1;
  }
  function le() {
    if (r.wrapper && !D.isActive()) {
      const a = r.viewport.offsetWidth, l = r.viewport.offsetHeight;
      if (!i.disableLayout) {
        fe && !i.embedded && document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
        const p = R.isActive() ? be(a, l) : be(), m = y;
        tt(i.width, i.height), r.slides.style.width = p.width + "px", r.slides.style.height = p.height + "px", y = Math.min(p.presentationWidth / p.width, p.presentationHeight / p.height), y = Math.max(y, i.minScale), y = Math.min(y, i.maxScale), y === 1 || R.isActive() ? (r.slides.style.zoom = "", r.slides.style.left = "", r.slides.style.top = "", r.slides.style.bottom = "", r.slides.style.right = "", Ie({ layout: "" })) : (r.slides.style.zoom = "", r.slides.style.left = "50%", r.slides.style.top = "50%", r.slides.style.bottom = "auto", r.slides.style.right = "auto", Ie({ layout: "translate(-50%, -50%) scale(" + y + ")" }));
        const b = Array.from(r.wrapper.querySelectorAll(re));
        for (let C = 0, x = b.length; C < x; C++) {
          const B = b[C];
          B.style.display !== "none" && (i.center || B.classList.contains("center") ? B.classList.contains("stack") ? B.style.top = 0 : B.style.top = Math.max((p.height - B.scrollHeight) / 2, 0) + "px" : B.style.top = "");
        }
        m !== y && _({
          type: "resize",
          data: {
            oldScale: m,
            scale: y,
            size: p
          }
        });
      }
      ei(), r.viewport.style.setProperty("--slide-scale", y), r.viewport.style.setProperty("--viewport-width", a + "px"), r.viewport.style.setProperty("--viewport-height", l + "px"), R.layout(), j.update(), P.updateParallax(), u.isActive() && u.update();
    }
  }
  function tt(a, l) {
    E(r.slides, "section > .stretch, section > .r-stretch").forEach((p) => {
      let m = bi(p, l);
      if (/(img|video)/gi.test(p.nodeName)) {
        const b = p.naturalWidth || p.videoWidth, C = p.naturalHeight || p.videoHeight, x = Math.min(a / b, m / C);
        p.style.width = b * x + "px", p.style.height = C * x + "px";
      } else
        p.style.width = a + "px", p.style.height = m + "px";
    });
  }
  function ei() {
    if (r.wrapper && !i.disableLayout && !D.isActive() && typeof i.scrollActivationWidth == "number" && i.view !== "scroll") {
      const a = be();
      a.presentationWidth > 0 && a.presentationWidth <= i.scrollActivationWidth ? R.isActive() || (P.create(), R.activate()) : R.isActive() && R.deactivate();
    }
  }
  function be(a, l) {
    let p = i.width, m = i.height;
    i.disableLayout && (p = r.slides.offsetWidth, m = r.slides.offsetHeight);
    const b = {
      // Slide size
      width: p,
      height: m,
      // Presentation size
      presentationWidth: a || r.wrapper.offsetWidth,
      presentationHeight: l || r.wrapper.offsetHeight
    };
    return b.presentationWidth -= b.presentationWidth * i.margin, b.presentationHeight -= b.presentationHeight * i.margin, typeof b.width == "string" && /%$/.test(b.width) && (b.width = parseInt(b.width, 10) / 100 * b.presentationWidth), typeof b.height == "string" && /%$/.test(b.height) && (b.height = parseInt(b.height, 10) / 100 * b.presentationHeight), b;
  }
  function it(a, l) {
    typeof a == "object" && typeof a.setAttribute == "function" && a.setAttribute("data-previous-indexv", l || 0);
  }
  function st(a) {
    if (typeof a == "object" && typeof a.setAttribute == "function" && a.classList.contains("stack")) {
      const l = a.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
      return parseInt(a.getAttribute(l) || 0, 10);
    }
    return 0;
  }
  function ge(a = f) {
    return a && a.parentNode && !!a.parentNode.nodeName.match(/section/i);
  }
  function ti(a = f) {
    return a.classList.contains(".stack") || a.querySelector("section") !== null;
  }
  function at() {
    return f && ge(f) ? !f.nextElementSibling : !1;
  }
  function nt() {
    return n === 0 && o === 0;
  }
  function Me() {
    return f ? !(f.nextElementSibling || ge(f) && f.parentNode.nextElementSibling) : !1;
  }
  function rt() {
    if (i.pause) {
      const a = r.wrapper.classList.contains("paused");
      we(), r.wrapper.classList.add("paused"), a === !1 && _({ type: "paused" });
    }
  }
  function pe() {
    const a = r.wrapper.classList.contains("paused");
    r.wrapper.classList.remove("paused"), de(), a && _({ type: "resumed" });
  }
  function ot(a) {
    typeof a == "boolean" ? a ? rt() : pe() : ve() ? pe() : rt();
  }
  function ve() {
    return r.wrapper.classList.contains("paused");
  }
  function ii(a) {
    typeof a == "boolean" ? a ? U.show() : U.hide() : U.isVisible() ? U.hide() : U.show();
  }
  function si(a) {
    typeof a == "boolean" ? a ? Se() : Ee() : z ? Se() : Ee();
  }
  function ai() {
    return !!(T && !z);
  }
  function X(a, l, p, m) {
    if (_({
      type: "beforeslidechange",
      data: {
        indexh: a === void 0 ? n : a,
        indexv: l === void 0 ? o : l,
        origin: m
      }
    }).defaultPrevented)
      return;
    c = f;
    const C = r.wrapper.querySelectorAll(te);
    if (R.isActive()) {
      const Y = R.getSlideByIndices(a, l);
      Y && R.scrollToSlide(Y);
      return;
    }
    if (C.length === 0)
      return;
    l === void 0 && !u.isActive() && (l = st(C[a])), c && c.parentNode && c.parentNode.classList.contains("stack") && it(c.parentNode, o);
    const x = v.concat();
    v.length = 0;
    let B = n || 0, ne = o || 0;
    n = dt(te, a === void 0 ? n : a), o = dt(Tt, l === void 0 ? o : l);
    let Q = n !== B || o !== ne;
    Q || (c = null);
    let q = C[n], M = q.querySelectorAll("section");
    h.classList.toggle("is-vertical-slide", M.length > 1), f = M[o] || q;
    let ce = !1;
    Q && c && f && !u.isActive() && (A = "running", ce = Be(c, f, B, ne), ce && r.slides.classList.add("disable-slide-transitions")), De(), le(), u.isActive() && u.update(), typeof p < "u" && L.goto(p), c && c !== f && (c.classList.remove("present"), c.setAttribute("aria-hidden", "true"), nt() && setTimeout(() => {
      di().forEach((Y) => {
        it(Y, 0);
      });
    }, 0));
    e:
      for (let Y = 0, pi = v.length; Y < pi; Y++) {
        for (let Le = 0; Le < x.length; Le++)
          if (x[Le] === v[Y]) {
            x.splice(Le, 1);
            continue e;
          }
        r.viewport.classList.add(v[Y]), _({ type: v[Y] });
      }
    for (; x.length; )
      r.viewport.classList.remove(x.pop());
    Q && Ge(m), (Q || !c) && (k.stopEmbeddedContent(c), k.startEmbeddedContent(f)), requestAnimationFrame(() => {
      Te(me(f));
    }), j.update(), $.update(), K.update(), P.update(), P.updateParallax(), I.update(), L.update(), N.writeURL(), de(), ce && (setTimeout(() => {
      r.slides.classList.remove("disable-slide-transitions");
    }, 0), i.autoAnimate && W.run(c, f));
  }
  function Be(a, l, p, m) {
    return a.hasAttribute("data-auto-animate") && l.hasAttribute("data-auto-animate") && a.getAttribute("data-auto-animate-id") === l.getAttribute("data-auto-animate-id") && !(n > p || o > m ? l : a).hasAttribute("data-auto-animate-restart");
  }
  function ni(a, l, p) {
    let m = n || 0;
    n = l, o = p;
    const b = f !== a;
    c = f, f = a, f && c && i.autoAnimate && Be(c, f, m, o) && W.run(c, f), b && (c && (k.stopEmbeddedContent(c), k.stopEmbeddedContent(c.slideBackgroundElement)), k.startEmbeddedContent(f), k.startEmbeddedContent(f.slideBackgroundElement)), requestAnimationFrame(() => {
      Te(me(f));
    }), Ge();
  }
  function lt() {
    ye(), $e(), le(), T = i.autoSlide, de(), P.create(), N.writeURL(), i.sortFragmentsOnSync === !0 && L.sortAll(), $.update(), j.update(), De(), K.update(), K.updateVisibility(), P.update(!0), I.update(), k.formatEmbeddedContent(), i.autoPlayMedia === !1 ? k.stopEmbeddedContent(f, { unloadIframes: !1 }) : k.startEmbeddedContent(f), u.isActive() && u.layout();
  }
  function ri(a = f) {
    P.sync(a), L.sync(a), k.load(a), P.update(), K.update();
  }
  function oi() {
    ee().forEach((a) => {
      E(a, "section").forEach((l, p) => {
        p > 0 && (l.classList.remove("present"), l.classList.remove("past"), l.classList.add("future"), l.setAttribute("aria-hidden", "true"));
      });
    });
  }
  function He(a = ee()) {
    a.forEach((l, p) => {
      let m = a[Math.floor(Math.random() * a.length)];
      m.parentNode === l.parentNode && l.parentNode.insertBefore(l, m);
      let b = l.querySelectorAll("section");
      b.length && He(b);
    });
  }
  function dt(a, l) {
    let p = E(r.wrapper, a), m = p.length, b = R.isActive() || D.isActive(), C = !1, x = !1;
    if (m) {
      i.loop && (l >= m && (C = !0), l %= m, l < 0 && (l = m + l, x = !0)), l = Math.max(Math.min(l, m - 1), 0);
      for (let q = 0; q < m; q++) {
        let M = p[q], ce = i.rtl && !ge(M);
        if (M.classList.remove("past"), M.classList.remove("present"), M.classList.remove("future"), M.setAttribute("hidden", ""), M.setAttribute("aria-hidden", "true"), M.querySelector("section") && M.classList.add("stack"), b) {
          M.classList.add("present");
          continue;
        }
        q < l ? (M.classList.add(ce ? "future" : "past"), i.fragments && ct(M)) : q > l ? (M.classList.add(ce ? "past" : "future"), i.fragments && ht(M)) : q === l && i.fragments && (C ? ht(M) : x && ct(M));
      }
      let B = p[l], ne = B.classList.contains("present");
      B.classList.add("present"), B.removeAttribute("hidden"), B.removeAttribute("aria-hidden"), ne || _({
        target: B,
        type: "visible",
        bubbles: !1
      });
      let Q = B.getAttribute("data-state");
      Q && (v = v.concat(Q.split(" ")));
    } else
      l = 0;
    return l;
  }
  function ct(a) {
    E(a, ".fragment").forEach((l) => {
      l.classList.add("visible"), l.classList.remove("current-fragment");
    });
  }
  function ht(a) {
    E(a, ".fragment.visible").forEach((l) => {
      l.classList.remove("visible", "current-fragment");
    });
  }
  function De() {
    let a = ee(), l = a.length, p, m;
    if (l && typeof n < "u") {
      let b = u.isActive() ? 10 : i.viewDistance;
      fe && (b = u.isActive() ? 6 : i.mobileViewDistance), D.isActive() && (b = Number.MAX_VALUE);
      for (let C = 0; C < l; C++) {
        let x = a[C], B = E(x, "section"), ne = B.length;
        if (p = Math.abs((n || 0) - C) || 0, i.loop && (p = Math.abs(((n || 0) - C) % (l - b)) || 0), p < b ? k.load(x) : k.unload(x), ne) {
          let Q = st(x);
          for (let q = 0; q < ne; q++) {
            let M = B[q];
            m = Math.abs(C === (n || 0) ? (o || 0) - q : q - Q), p + m < b ? k.load(M) : k.unload(M);
          }
        }
      }
      vt() ? r.wrapper.classList.add("has-vertical-slides") : r.wrapper.classList.remove("has-vertical-slides"), pt() ? r.wrapper.classList.add("has-horizontal-slides") : r.wrapper.classList.remove("has-horizontal-slides");
    }
  }
  function J({ includeFragments: a = !1 } = {}) {
    let l = r.wrapper.querySelectorAll(te), p = r.wrapper.querySelectorAll(Tt), m = {
      left: n > 0,
      right: n < l.length - 1,
      up: o > 0,
      down: o < p.length - 1
    };
    if (i.loop && (l.length > 1 && (m.left = !0, m.right = !0), p.length > 1 && (m.up = !0, m.down = !0)), l.length > 1 && i.navigationMode === "linear" && (m.right = m.right || m.down, m.left = m.left || m.up), a === !0) {
      let b = L.availableRoutes();
      m.left = m.left || b.prev, m.up = m.up || b.prev, m.down = m.down || b.next, m.right = m.right || b.next;
    }
    if (i.rtl) {
      let b = m.left;
      m.left = m.right, m.right = b;
    }
    return m;
  }
  function ut(a = f) {
    let l = ee(), p = 0;
    e:
      for (let m = 0; m < l.length; m++) {
        let b = l[m], C = b.querySelectorAll("section");
        for (let x = 0; x < C.length; x++) {
          if (C[x] === a)
            break e;
          C[x].dataset.visibility !== "uncounted" && p++;
        }
        if (b === a)
          break;
        b.classList.contains("stack") === !1 && b.dataset.visibility !== "uncounted" && p++;
      }
    return p;
  }
  function li() {
    let a = mt(), l = ut();
    if (f) {
      let p = f.querySelectorAll(".fragment");
      if (p.length > 0) {
        let m = f.querySelectorAll(".fragment.visible");
        l += m.length / p.length * 0.9;
      }
    }
    return Math.min(l / (a - 1), 1);
  }
  function ft(a) {
    let l = n, p = o, m;
    if (a)
      if (R.isActive())
        l = parseInt(a.getAttribute("data-index-h"), 10), a.getAttribute("data-index-v") && (p = parseInt(a.getAttribute("data-index-v"), 10));
      else {
        let b = ge(a), C = b ? a.parentNode : a, x = ee();
        l = Math.max(x.indexOf(C), 0), p = void 0, b && (p = Math.max(E(a.parentNode, "section").indexOf(a), 0));
      }
    if (!a && f && f.querySelectorAll(".fragment").length > 0) {
      let C = f.querySelector(".current-fragment");
      C && C.hasAttribute("data-fragment-index") ? m = parseInt(C.getAttribute("data-fragment-index"), 10) : m = f.querySelectorAll(".fragment.visible").length - 1;
    }
    return { h: l, v: p, f: m };
  }
  function ze() {
    return E(r.wrapper, re + ':not(.stack):not([data-visibility="uncounted"])');
  }
  function ee() {
    return E(r.wrapper, te);
  }
  function gt() {
    return E(r.wrapper, ".slides>section>section");
  }
  function di() {
    return E(r.wrapper, te + ".stack");
  }
  function pt() {
    return ee().length > 1;
  }
  function vt() {
    return gt().length > 1;
  }
  function ci() {
    return ze().map((a) => {
      let l = {};
      for (let p = 0; p < a.attributes.length; p++) {
        let m = a.attributes[p];
        l[m.name] = m.value;
      }
      return l;
    });
  }
  function mt() {
    return ze().length;
  }
  function yt(a, l) {
    let p = ee()[a], m = p && p.querySelectorAll("section");
    return m && m.length && typeof l == "number" ? m ? m[l] : void 0 : p;
  }
  function hi(a, l) {
    let p = typeof a == "number" ? yt(a, l) : a;
    if (p)
      return p.slideBackgroundElement;
  }
  function bt() {
    let a = ft();
    return {
      indexh: a.h,
      indexv: a.v,
      indexf: a.f,
      paused: ve(),
      overview: u.isActive()
    };
  }
  function ui(a) {
    if (typeof a == "object") {
      X(he(a.indexh), he(a.indexv), he(a.indexf));
      let l = he(a.paused), p = he(a.overview);
      typeof l == "boolean" && l !== ve() && ot(l), typeof p == "boolean" && p !== u.isActive() && u.toggle(p);
    }
  }
  function de() {
    if (we(), f && i.autoSlide !== !1) {
      let a = f.querySelector(".current-fragment[data-autoslide]"), l = a ? a.getAttribute("data-autoslide") : null, p = f.parentNode ? f.parentNode.getAttribute("data-autoslide") : null, m = f.getAttribute("data-autoslide");
      l ? T = parseInt(l, 10) : m ? T = parseInt(m, 10) : p ? T = parseInt(p, 10) : (T = i.autoSlide, f.querySelectorAll(".fragment").length === 0 && E(f, "video, audio").forEach((b) => {
        b.hasAttribute("data-autoplay") && T && b.duration * 1e3 / b.playbackRate > T && (T = b.duration * 1e3 / b.playbackRate + 1e3);
      })), T && !z && !ve() && !u.isActive() && (!Me() || L.availableRoutes().next || i.loop === !0) && (O = setTimeout(() => {
        typeof i.autoSlideMethod == "function" ? i.autoSlideMethod() : Oe(), de();
      }, T), se = Date.now()), V && V.setPlaying(O !== -1);
    }
  }
  function we() {
    clearTimeout(O), O = -1;
  }
  function Ee() {
    T && !z && (z = !0, _({ type: "autoslidepaused" }), clearTimeout(O), V && V.setPlaying(!1));
  }
  function Se() {
    T && z && (z = !1, _({ type: "autoslideresumed" }), de());
  }
  function Ae({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, R.isActive())
      return R.prev();
    i.rtl ? (u.isActive() || a || L.next() === !1) && J().left && X(n + 1, i.navigationMode === "grid" ? o : void 0) : (u.isActive() || a || L.prev() === !1) && J().left && X(n - 1, i.navigationMode === "grid" ? o : void 0);
  }
  function Re({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, R.isActive())
      return R.next();
    i.rtl ? (u.isActive() || a || L.prev() === !1) && J().right && X(n - 1, i.navigationMode === "grid" ? o : void 0) : (u.isActive() || a || L.next() === !1) && J().right && X(n + 1, i.navigationMode === "grid" ? o : void 0);
  }
  function Fe({ skipFragments: a = !1 } = {}) {
    if (R.isActive())
      return R.prev();
    (u.isActive() || a || L.prev() === !1) && J().up && X(n, o - 1);
  }
  function Ve({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedVertically = !0, R.isActive())
      return R.next();
    (u.isActive() || a || L.next() === !1) && J().down && X(n, o + 1);
  }
  function wt({ skipFragments: a = !1 } = {}) {
    if (R.isActive())
      return R.prev();
    if (a || L.prev() === !1)
      if (J().up)
        Fe({ skipFragments: a });
      else {
        let l;
        if (i.rtl ? l = E(r.wrapper, te + ".future").pop() : l = E(r.wrapper, te + ".past").pop(), l && l.classList.contains("stack")) {
          let p = l.querySelectorAll("section").length - 1 || void 0, m = n - 1;
          X(m, p);
        } else
          i.rtl ? Re({ skipFragments: a }) : Ae({ skipFragments: a });
      }
  }
  function Oe({ skipFragments: a = !1 } = {}) {
    if (g.hasNavigatedHorizontally = !0, g.hasNavigatedVertically = !0, R.isActive())
      return R.next();
    if (a || L.next() === !1) {
      let l = J();
      l.down && l.right && i.loop && at() && (l.down = !1), l.down ? Ve({ skipFragments: a }) : i.rtl ? Ae({ skipFragments: a }) : Re({ skipFragments: a });
    }
  }
  function fi(a) {
    i.autoSlideStoppable && Ee();
  }
  function Et(a) {
    let l = a.data;
    if (typeof l == "string" && l.charAt(0) === "{" && l.charAt(l.length - 1) === "}" && (l = JSON.parse(l), l.method && typeof t[l.method] == "function"))
      if (Li.test(l.method) === !1) {
        const p = t[l.method].apply(t, l.args);
        Je("callback", { method: l.method, result: p });
      } else
        console.warn('reveal.js: "' + l.method + '" is is blacklisted from the postMessage API');
  }
  function St(a) {
    A === "running" && /section/gi.test(a.target.nodeName) && (A = "idle", _({
      type: "slidetransitionend",
      data: { indexh: n, indexv: o, previousSlide: c, currentSlide: f }
    }));
  }
  function At(a) {
    const l = F(a.target, 'a[href^="#"]');
    if (l) {
      const p = l.getAttribute("href"), m = N.getIndicesFromHash(p);
      m && (t.slide(m.h, m.v, m.f), a.preventDefault());
    }
  }
  function Rt(a) {
    le();
  }
  function kt(a) {
    document.hidden === !1 && document.activeElement !== document.body && (typeof document.activeElement.blur == "function" && document.activeElement.blur(), document.body.focus());
  }
  function ke(a) {
    (document.fullscreenElement || document.webkitFullscreenElement) === r.wrapper && (a.stopImmediatePropagation(), setTimeout(() => {
      t.layout(), t.focus.focus();
    }, 1));
  }
  function Lt(a) {
    if (a.currentTarget && a.currentTarget.hasAttribute("href")) {
      let l = a.currentTarget.getAttribute("href");
      l && (Ze(l), a.preventDefault());
    }
  }
  function gi(a) {
    Me() && i.loop === !1 ? (X(0, 0), Se()) : z ? Se() : Ee();
  }
  const Ct = {
    VERSION: Vt,
    initialize: Ut,
    configure: Ke,
    destroy: Qt,
    sync: lt,
    syncSlide: ri,
    syncFragments: L.sync.bind(L),
    // Navigation methods
    slide: X,
    left: Ae,
    right: Re,
    up: Fe,
    down: Ve,
    prev: wt,
    next: Oe,
    // Navigation aliases
    navigateLeft: Ae,
    navigateRight: Re,
    navigateUp: Fe,
    navigateDown: Ve,
    navigatePrev: wt,
    navigateNext: Oe,
    // Fragment methods
    navigateFragment: L.goto.bind(L),
    prevFragment: L.prev.bind(L),
    nextFragment: L.next.bind(L),
    // Event binding
    on: Xe,
    off: Ye,
    // Legacy event binding methods left in for backwards compatibility
    addEventListener: Xe,
    removeEventListener: Ye,
    // Forces an update in slide layout
    layout: le,
    // Randomizes the order of slides
    shuffle: He,
    // Returns an object with the available routes as booleans (left/right/top/bottom)
    availableRoutes: J,
    // Returns an object with the available fragments as booleans (prev/next)
    availableFragments: L.availableRoutes.bind(L),
    // Toggles a help overlay with keyboard shortcuts
    toggleHelp: Zt,
    // Toggles the overview mode on/off
    toggleOverview: u.toggle.bind(u),
    // Toggles the scroll view on/off
    toggleScrollView: R.toggle.bind(R),
    // Toggles the "black screen" mode on/off
    togglePause: ot,
    // Toggles the auto slide mode on/off
    toggleAutoSlide: si,
    // Toggles visibility of the jump-to-slide UI
    toggleJumpToSlide: ii,
    // Slide navigation checks
    isFirstSlide: nt,
    isLastSlide: Me,
    isLastVerticalSlide: at,
    isVerticalSlide: ge,
    isVerticalStack: ti,
    // State checks
    isPaused: ve,
    isAutoSliding: ai,
    isSpeakerNotes: K.isSpeakerNotesWindow.bind(K),
    isOverview: u.isActive.bind(u),
    isFocused: ae.isFocused.bind(ae),
    isScrollView: R.isActive.bind(R),
    isPrintView: D.isActive.bind(D),
    // Checks if reveal.js has been loaded and is ready for use
    isReady: () => d,
    // Slide preloading
    loadSlide: k.load.bind(k),
    unloadSlide: k.unload.bind(k),
    // Start/stop all media inside of the current slide
    startEmbeddedContent: () => k.startEmbeddedContent(f),
    stopEmbeddedContent: () => k.stopEmbeddedContent(f, { unloadIframes: !1 }),
    // Preview management
    showPreview: Ze,
    hidePreview: G,
    // Adds or removes all internal event listeners
    addEventListeners: $e,
    removeEventListeners: ye,
    dispatchEvent: _,
    // Facility for persisting and restoring the presentation state
    getState: bt,
    setState: ui,
    // Presentation progress on range of 0-1
    getProgress: li,
    // Returns the indices of the current, or specified, slide
    getIndices: ft,
    // Returns an Array of key:value maps of the attributes of each
    // slide in the deck
    getSlidesAttributes: ci,
    // Returns the number of slides that we have passed
    getSlidePastCount: ut,
    // Returns the total number of slides
    getTotalSlides: mt,
    // Returns the slide element at the specified index
    getSlide: yt,
    // Returns the previous slide element, may be null
    getPreviousSlide: () => c,
    // Returns the current slide element
    getCurrentSlide: () => f,
    // Returns the slide background element at the specified index
    getSlideBackground: hi,
    // Returns the speaker notes string for a slide, or null
    getSlideNotes: K.getSlideNotes.bind(K),
    // Returns an Array of all slides
    getSlides: ze,
    // Returns an array with all horizontal/vertical slides in the deck
    getHorizontalSlides: ee,
    getVerticalSlides: gt,
    // Checks if the presentation contains two or more horizontal
    // and vertical slides
    hasHorizontalSlides: pt,
    hasVerticalSlides: vt,
    // Checks if the deck has navigated on either axis at least once
    hasNavigatedHorizontally: () => g.hasNavigatedHorizontally,
    hasNavigatedVertically: () => g.hasNavigatedVertically,
    shouldAutoAnimateBetween: Be,
    // Adds/removes a custom key binding
    addKeyBinding: S.addKeyBinding.bind(S),
    removeKeyBinding: S.removeKeyBinding.bind(S),
    // Programmatically triggers a keyboard event
    triggerKey: S.triggerKey.bind(S),
    // Registers a new shortcut to include in the help overlay
    registerKeyboardShortcut: S.registerKeyboardShortcut.bind(S),
    getComputedSlideSize: be,
    setCurrentScrollPage: ni,
    // Returns the current scale of the presentation content
    getScale: () => y,
    // Returns the current configuration object
    getConfig: () => i,
    // Helper method, retrieves query string as a key:value map
    getQueryHash: xt,
    // Returns the path to the current slide as represented in the URL
    getSlidePath: N.getHash.bind(N),
    // Returns reveal.js DOM elements
    getRevealElement: () => h,
    getSlidesElement: () => r.slides,
    getViewportElement: () => r.viewport,
    getBackgroundsElement: () => P.element,
    // API for registering and retrieving plugins
    registerPlugin: H.registerPlugin.bind(H),
    hasPlugin: H.hasPlugin.bind(H),
    getPlugin: H.getPlugin.bind(H),
    getPlugins: H.getRegisteredPlugins.bind(H)
  };
  return ue(t, {
    ...Ct,
    // Methods for announcing content to screen readers
    announceStatus: Te,
    getStatusText: me,
    // Controllers
    focus: ae,
    scroll: R,
    progress: j,
    controls: $,
    location: N,
    overview: u,
    fragments: L,
    backgrounds: P,
    slideContent: k,
    slideNumber: I,
    onUserInput: fi,
    closeOverlay: G,
    updateSlidesVisibility: De,
    layoutSlideContents: tt,
    transformSlides: Ie,
    cueAutoSlide: de,
    cancelAutoSlide: we
  }), Ct;
}
let oe = Ot, qt = [];
oe.initialize = (h) => (Object.assign(oe, new Ot(document.querySelector(".reveal"), h)), qt.map((e) => e(oe)), oe.initialize());
["configure", "on", "off", "addEventListener", "removeEventListener", "registerPlugin"].forEach((h) => {
  oe[h] = (...e) => {
    qt.push((t) => t[h].call(null, ...e));
  };
});
oe.isReady = () => !1;
oe.VERSION = Vt;
export {
  oe as default
};
