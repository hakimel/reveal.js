//#region js/utils/util.ts
var e = (e, t) => {
	for (let n in t) e[n] = t[n];
	return e;
}, t = (e, t) => Array.from(e.querySelectorAll(t)), n = (e, t, n) => {
	n ? e.classList.add(t) : e.classList.remove(t);
}, r = (e) => {
	if (typeof e == "string") {
		if (e === "null") return null;
		if (e === "true") return !0;
		if (e === "false") return !1;
		if (e.match(/^-?[\d\.]+$/)) return parseFloat(e);
	}
	return e;
}, i = (e, t) => {
	e.style.transform = t;
}, a = (e, t) => {
	let n = e.matches || e.matchesSelector || e.msMatchesSelector;
	return !!(n && n.call(e, t));
}, o = (e, t) => {
	if (e && typeof e.closest == "function") return e.closest(t);
	for (; e;) {
		if (a(e, t)) return e;
		e = e.parentElement;
	}
	return null;
}, s = (e) => {
	e = e || document.documentElement;
	let t = e.requestFullscreen || e.webkitRequestFullscreen || e.webkitRequestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen;
	t && t.apply(e);
}, c = (e, t, n, r = "") => {
	let i = e.querySelectorAll("." + n);
	for (let t = 0; t < i.length; t++) {
		let n = i[t];
		if (n.parentNode === e) return n;
	}
	let a = document.createElement(t);
	return a.className = n, a.innerHTML = r, e.appendChild(a), a;
}, l = (e) => {
	let t = document.createElement("style");
	return e && e.length > 0 && t.appendChild(document.createTextNode(e)), document.head.appendChild(t), t;
}, u = () => {
	let e = {};
	location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi, (t) => {
		let n = t.split("=").shift(), r = t.split("=").pop();
		return n && r !== void 0 && (e[n] = r), t;
	});
	for (let t in e) {
		let n = e[t];
		e[t] = r(unescape(n));
	}
	return e.dependencies !== void 0 && delete e.dependencies, e;
}, d = (e, t = 0) => {
	if (e) {
		var n;
		let r, i = e.style.height;
		return e.style.height = "0px", e.parentElement && (e.parentElement.style.height = "auto"), r = t - (((n = e.parentElement) == null ? void 0 : n.offsetHeight) || 0), e.style.height = i + "px", e.parentElement && e.parentElement.style.removeProperty("height"), r;
	}
	return t;
}, f = {
	mp4: "video/mp4",
	m4a: "video/mp4",
	ogv: "video/ogg",
	mpeg: "video/mpeg",
	webm: "video/webm"
}, p = (e = "") => {
	let t = e.split(".").pop();
	return t ? f[t] : void 0;
}, m = (e = "") => encodeURI(e).replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[!'()*]/g, (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`), h = navigator.userAgent, g = /(iphone|ipod|ipad|android)/gi.test(h) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
/chrome/i.test(h) && /edge/i.test(h);
var _ = /android/gi.test(h), v = function(e) {
	if (e) {
		var t = function(e) {
			return [].slice.call(e);
		}, n = 0, r = 1, i = 2, a = 3, o = [], s = null, c = "requestAnimationFrame" in e ? function() {
			var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { sync: !1 };
			e.cancelAnimationFrame(s);
			var n = function() {
				return u(o.filter((function(e) {
					return e.dirty && e.active;
				})));
			};
			if (t.sync) return n();
			s = e.requestAnimationFrame(n);
		} : function() {}, l = function(e) {
			return function(t) {
				o.forEach((function(t) {
					return t.dirty = e;
				})), c(t);
			};
		}, u = function(e) {
			e.filter((function(e) {
				return !e.styleComputed;
			})).forEach((function(e) {
				e.styleComputed = m(e);
			})), e.filter(h).forEach(g);
			var t = e.filter(p);
			t.forEach(f), t.forEach((function(e) {
				g(e), d(e);
			})), t.forEach(_);
		}, d = function(e) {
			return e.dirty = n;
		}, f = function(e) {
			e.availableWidth = e.element.parentNode.clientWidth, e.currentWidth = e.element.scrollWidth, e.previousFontSize = e.currentFontSize, e.currentFontSize = Math.min(Math.max(e.minSize, e.availableWidth / e.currentWidth * e.previousFontSize), e.maxSize), e.whiteSpace = e.multiLine && e.currentFontSize === e.minSize ? "normal" : "nowrap";
		}, p = function(e) {
			return e.dirty !== i || e.dirty === i && e.element.parentNode.clientWidth !== e.availableWidth;
		}, m = function(t) {
			var n = e.getComputedStyle(t.element, null);
			return t.currentFontSize = parseFloat(n.getPropertyValue("font-size")), t.display = n.getPropertyValue("display"), t.whiteSpace = n.getPropertyValue("white-space"), !0;
		}, h = function(e) {
			var t = !1;
			return !e.preStyleTestCompleted && (/inline-/.test(e.display) || (t = !0, e.display = "inline-block"), e.whiteSpace !== "nowrap" && (t = !0, e.whiteSpace = "nowrap"), e.preStyleTestCompleted = !0, t);
		}, g = function(e) {
			e.element.style.whiteSpace = e.whiteSpace, e.element.style.display = e.display, e.element.style.fontSize = e.currentFontSize + "px";
		}, _ = function(e) {
			e.element.dispatchEvent(new CustomEvent("fit", { detail: {
				oldValue: e.previousFontSize,
				newValue: e.currentFontSize,
				scaleFactor: e.currentFontSize / e.previousFontSize
			} }));
		}, v = function(e, t) {
			return function(n) {
				e.dirty = t, e.active && c(n);
			};
		}, y = function(e) {
			return function() {
				o = o.filter((function(t) {
					return t.element !== e.element;
				})), e.observeMutations && e.observer.disconnect(), e.element.style.whiteSpace = e.originalStyle.whiteSpace, e.element.style.display = e.originalStyle.display, e.element.style.fontSize = e.originalStyle.fontSize;
			};
		}, b = function(e) {
			return function() {
				e.active || (e.active = !0, c());
			};
		}, x = function(e) {
			return function() {
				return e.active = !1;
			};
		}, S = function(e) {
			e.observeMutations && (e.observer = new MutationObserver(v(e, r)), e.observer.observe(e.element, e.observeMutations));
		}, ee = {
			minSize: 16,
			maxSize: 512,
			multiLine: !0,
			observeMutations: "MutationObserver" in e && {
				subtree: !0,
				childList: !0,
				characterData: !0
			}
		}, C = null, w = function() {
			e.clearTimeout(C), C = e.setTimeout(l(i), E.observeWindowDelay);
		}, te = ["resize", "orientationchange"];
		return Object.defineProperty(E, "observeWindow", { set: function(t) {
			var n = `${t ? "add" : "remove"}EventListener`;
			te.forEach((function(t) {
				e[n](t, w);
			}));
		} }), E.observeWindow = !0, E.observeWindowDelay = 100, E.fitAll = l(a), E;
	}
	function T(e, t) {
		var n = Object.assign({}, ee, t), r = e.map((function(e) {
			var t = Object.assign({}, n, {
				element: e,
				active: !0
			});
			return function(e) {
				e.originalStyle = {
					whiteSpace: e.element.style.whiteSpace,
					display: e.element.style.display,
					fontSize: e.element.style.fontSize
				}, S(e), e.newbie = !0, e.dirty = !0, o.push(e);
			}(t), {
				element: e,
				fit: v(t, a),
				unfreeze: b(t),
				freeze: x(t),
				unsubscribe: y(t)
			};
		}));
		return c(), r;
	}
	function E(e) {
		var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		return typeof e == "string" ? T(t(document.querySelectorAll(e)), n) : T([e], n)[0];
	}
}(typeof window > "u" ? null : window);
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/typeof.js
function y(e) {
	"@babel/helpers - typeof";
	return y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, y(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/toPrimitive.js
function b(e, t) {
	if (y(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (y(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/toPropertyKey.js
function x(e) {
	var t = b(e, "string");
	return y(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/defineProperty.js
function S(e, t, n) {
	return (t = x(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region js/controllers/slidecontent.js
var ee = class {
	constructor(e) {
		S(this, "allowedToPlayAudio", null), this.Reveal = e, this.startEmbeddedMedia = this.startEmbeddedMedia.bind(this), this.startEmbeddedIframe = this.startEmbeddedIframe.bind(this), this.preventIframeAutoFocus = this.preventIframeAutoFocus.bind(this), this.ensureMobileMediaPlaying = this.ensureMobileMediaPlaying.bind(this), this.failedAudioPlaybackTargets = /* @__PURE__ */ new Set(), this.failedVideoPlaybackTargets = /* @__PURE__ */ new Set(), this.failedMutedVideoPlaybackTargets = /* @__PURE__ */ new Set(), this.renderMediaPlayButton();
	}
	renderMediaPlayButton() {
		this.mediaPlayButton = document.createElement("button"), this.mediaPlayButton.className = "r-overlay-button r-media-play-button", this.mediaPlayButton.addEventListener("click", () => {
			this.resetTemporarilyMutedMedia(), new Set([
				...this.failedAudioPlaybackTargets,
				...this.failedVideoPlaybackTargets,
				...this.failedMutedVideoPlaybackTargets
			]).forEach((e) => {
				this.startEmbeddedMedia({ target: e });
			}), this.clearMediaPlaybackErrors();
		});
	}
	shouldPreload(e) {
		if (this.Reveal.isScrollView()) return !0;
		let t = this.Reveal.getConfig().preloadIframes;
		return typeof t != "boolean" && (t = e.hasAttribute("data-preload")), t;
	}
	load(e, n = {}) {
		let r = this.Reveal.getConfig().display;
		if (r.includes("!important")) {
			let t = r.replace(/\s*!important\s*$/, "").trim();
			e.style.setProperty("display", t, "important");
		} else e.style.display = r;
		t(e, "img[data-src], video[data-src], audio[data-src], iframe[data-src]").forEach((e) => {
			let t = e.tagName === "IFRAME";
			(!t || this.shouldPreload(e)) && (e.setAttribute("src", e.getAttribute("data-src")), e.setAttribute("data-lazy-loaded", ""), e.removeAttribute("data-src"), t && e.addEventListener("load", this.preventIframeAutoFocus));
		}), t(e, "video, audio").forEach((e) => {
			let n = 0;
			t(e, "source[data-src]").forEach((e) => {
				e.setAttribute("src", e.getAttribute("data-src")), e.removeAttribute("data-src"), e.setAttribute("data-lazy-loaded", ""), n += 1;
			}), g && e.tagName === "VIDEO" && e.setAttribute("playsinline", ""), n > 0 && e.load();
		});
		let i = e.slideBackgroundElement;
		if (i) {
			i.style.display = "block";
			let t = e.slideBackgroundContentElement, r = e.getAttribute("data-background-iframe");
			if (i.hasAttribute("data-loaded") === !1) {
				i.setAttribute("data-loaded", "true");
				let a = e.getAttribute("data-background-image"), o = e.getAttribute("data-background-video"), s = e.hasAttribute("data-background-video-loop"), c = e.hasAttribute("data-background-video-muted");
				if (a) /^data:/.test(a.trim()) ? t.style.backgroundImage = `url(${a.trim()})` : t.style.backgroundImage = a.split(",").map((e) => `url(${m(decodeURI(e.trim()))})`).join(",");
				else if (o) {
					let e = document.createElement("video");
					s && e.setAttribute("loop", ""), (c || this.Reveal.isSpeakerNotes()) && (e.muted = !0), g && e.setAttribute("playsinline", ""), o.split(",").forEach((t) => {
						let n = document.createElement("source");
						n.setAttribute("src", t);
						let r = p(t);
						r && n.setAttribute("type", r), e.appendChild(n);
					}), t.appendChild(e);
				} else if (r && n.excludeIframes !== !0) {
					let e = document.createElement("iframe");
					e.setAttribute("allowfullscreen", ""), e.setAttribute("mozallowfullscreen", ""), e.setAttribute("webkitallowfullscreen", ""), e.setAttribute("allow", "autoplay"), e.setAttribute("data-src", r), e.style.width = "100%", e.style.height = "100%", e.style.maxHeight = "100%", e.style.maxWidth = "100%", t.appendChild(e);
				}
			}
			let a = t.querySelector("iframe[data-src]");
			a && this.shouldPreload(i) && !/autoplay=(1|true|yes)/gi.test(r) && a.getAttribute("src") !== r && a.setAttribute("src", r);
		}
		this.layout(e);
	}
	layout(e) {
		Array.from(e.querySelectorAll(".r-fit-text")).forEach((e) => {
			v(e, {
				minSize: 24,
				maxSize: this.Reveal.getConfig().height * .8,
				observeMutations: !1,
				observeWindow: !1
			});
		});
	}
	unload(e) {
		e.style.display = "none";
		let n = this.Reveal.getSlideBackground(e);
		n && (n.style.display = "none", t(n, "iframe[src]").forEach((e) => {
			e.removeAttribute("src");
		})), t(e, "video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]").forEach((e) => {
			e.setAttribute("data-src", e.getAttribute("src")), e.removeAttribute("src");
		}), t(e, "video[data-lazy-loaded] source[src], audio source[src]").forEach((e) => {
			e.setAttribute("data-src", e.getAttribute("src")), e.removeAttribute("src");
		});
	}
	formatEmbeddedContent() {
		let e = (e, n, r) => {
			t(this.Reveal.getSlidesElement(), "iframe[" + e + "*=\"" + n + "\"]").forEach((t) => {
				let n = t.getAttribute(e);
				n && n.indexOf(r) === -1 && t.setAttribute(e, n + (/\?/.test(n) ? "&" : "?") + r);
			});
		};
		e("src", "youtube.com/embed/", "enablejsapi=1"), e("data-src", "youtube.com/embed/", "enablejsapi=1"), e("src", "player.vimeo.com/", "api=1"), e("data-src", "player.vimeo.com/", "api=1");
	}
	startEmbeddedContent(e) {
		if (e) {
			let n = this.Reveal.isSpeakerNotes();
			t(e, "img[src$=\".gif\"]").forEach((e) => {
				e.setAttribute("src", e.getAttribute("src"));
			}), t(e, "video, audio").forEach((e) => {
				if (o(e, ".fragment") && !o(e, ".fragment.visible")) return;
				let t = this.Reveal.getConfig().autoPlayMedia;
				if (typeof t != "boolean" && (t = e.hasAttribute("data-autoplay") || !!o(e, ".slide-background")), t && typeof e.play == "function") {
					if (n && !e.muted) return;
					e.readyState > 1 ? this.startEmbeddedMedia({ target: e }) : g ? (e.addEventListener("canplay", this.ensureMobileMediaPlaying), this.playMediaElement(e)) : (e.removeEventListener("loadeddata", this.startEmbeddedMedia), e.addEventListener("loadeddata", this.startEmbeddedMedia));
				}
			}), n || (t(e, "iframe[src]").forEach((e) => {
				o(e, ".fragment") && !o(e, ".fragment.visible") || this.startEmbeddedIframe({ target: e });
			}), t(e, "iframe[data-src]").forEach((e) => {
				o(e, ".fragment") && !o(e, ".fragment.visible") || e.getAttribute("src") !== e.getAttribute("data-src") && (e.removeEventListener("load", this.startEmbeddedIframe), e.addEventListener("load", this.startEmbeddedIframe), e.setAttribute("src", e.getAttribute("data-src")));
			}));
		}
	}
	ensureMobileMediaPlaying(e) {
		let t = e.target;
		typeof t.getVideoPlaybackQuality == "function" && setTimeout(() => {
			let e = t.paused === !1, n = t.getVideoPlaybackQuality().totalVideoFrames;
			e && n === 0 && (t.load(), t.play());
		}, 1e3);
	}
	startEmbeddedMedia(e) {
		let t = !!o(e.target, "html"), n = !!o(e.target, ".present");
		t && n && (e.target.paused || e.target.ended) && (e.target.currentTime = 0, this.playMediaElement(e.target)), e.target.removeEventListener("loadeddata", this.startEmbeddedMedia);
	}
	playMediaElement(e) {
		let t = e.play();
		t && typeof t.catch == "function" && t.then(() => {
			e.muted || (this.allowedToPlayAudio = !0);
		}).catch((t) => {
			if (t.name === "NotAllowedError") if (this.allowedToPlayAudio = !1, e.tagName === "VIDEO") {
				this.onVideoPlaybackNotAllowed(e);
				let t = !!o(e, "html"), n = !!o(e, ".present"), r = e.muted;
				t && n && !r && (e.setAttribute("data-muted-by-reveal", "true"), e.muted = !0, e.play().catch(() => {
					this.onMutedVideoPlaybackNotAllowed(e);
				}));
			} else e.tagName === "AUDIO" && this.onAudioPlaybackNotAllowed(e);
		});
	}
	startEmbeddedIframe(e) {
		let t = e.target;
		if (this.preventIframeAutoFocus(e), t && t.contentWindow) {
			let n = !!o(e.target, "html"), r = !!o(e.target, ".present");
			if (n && r) {
				let e = this.Reveal.getConfig().autoPlayMedia;
				typeof e != "boolean" && (e = t.hasAttribute("data-autoplay") || !!o(t, ".slide-background")), /youtube\.com\/embed\//.test(t.getAttribute("src")) && e ? t.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"playVideo\",\"args\":\"\"}", "*") : /player\.vimeo\.com\//.test(t.getAttribute("src")) && e ? t.contentWindow.postMessage("{\"method\":\"play\"}", "*") : t.contentWindow.postMessage("slide:start", "*");
			}
		}
	}
	stopEmbeddedContent(n, r = {}) {
		r = e({ unloadIframes: !0 }, r), n && n.parentNode && (t(n, "video, audio").forEach((e) => {
			!e.hasAttribute("data-ignore") && typeof e.pause == "function" && (e.setAttribute("data-paused-by-reveal", ""), e.pause(), g && e.removeEventListener("canplay", this.ensureMobileMediaPlaying));
		}), t(n, "iframe").forEach((e) => {
			e.contentWindow && e.contentWindow.postMessage("slide:stop", "*"), e.removeEventListener("load", this.preventIframeAutoFocus), e.removeEventListener("load", this.startEmbeddedIframe);
		}), t(n, "iframe[src*=\"youtube.com/embed/\"]").forEach((e) => {
			!e.hasAttribute("data-ignore") && e.contentWindow && typeof e.contentWindow.postMessage == "function" && e.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", "*");
		}), t(n, "iframe[src*=\"player.vimeo.com/\"]").forEach((e) => {
			!e.hasAttribute("data-ignore") && e.contentWindow && typeof e.contentWindow.postMessage == "function" && e.contentWindow.postMessage("{\"method\":\"pause\"}", "*");
		}), r.unloadIframes === !0 && t(n, "iframe[data-src]").forEach((e) => {
			e.setAttribute("src", "about:blank"), e.removeAttribute("src");
		}));
	}
	isAllowedToPlayAudio() {
		return this.allowedToPlayAudio;
	}
	showPlayOrUnmuteButton() {
		let e = this.failedAudioPlaybackTargets.size, t = this.failedVideoPlaybackTargets.size, n = this.failedMutedVideoPlaybackTargets.size, r = "Play media";
		n > 0 ? r = "Play video" : t > 0 ? r = "Unmute video" : e > 0 && (r = "Play audio"), this.mediaPlayButton.textContent = r, this.Reveal.getRevealElement().appendChild(this.mediaPlayButton);
	}
	onAudioPlaybackNotAllowed(e) {
		this.failedAudioPlaybackTargets.add(e), this.showPlayOrUnmuteButton(e);
	}
	onVideoPlaybackNotAllowed(e) {
		this.failedVideoPlaybackTargets.add(e), this.showPlayOrUnmuteButton();
	}
	onMutedVideoPlaybackNotAllowed(e) {
		this.failedMutedVideoPlaybackTargets.add(e), this.showPlayOrUnmuteButton();
	}
	resetTemporarilyMutedMedia() {
		new Set([
			...this.failedAudioPlaybackTargets,
			...this.failedVideoPlaybackTargets,
			...this.failedMutedVideoPlaybackTargets
		]).forEach((e) => {
			e.hasAttribute("data-muted-by-reveal") && (e.muted = !1, e.removeAttribute("data-muted-by-reveal"));
		});
	}
	clearMediaPlaybackErrors() {
		this.resetTemporarilyMutedMedia(), this.failedAudioPlaybackTargets.clear(), this.failedVideoPlaybackTargets.clear(), this.failedMutedVideoPlaybackTargets.clear(), this.mediaPlayButton && this.mediaPlayButton.parentNode && this.mediaPlayButton.remove();
	}
	preventIframeAutoFocus(e) {
		let t = e.target;
		if (t && this.Reveal.getConfig().preventIframeAutoFocus) {
			let e = 0, n = () => {
				document.activeElement === t ? document.activeElement.blur() : e < 1e3 && (e += 100, setTimeout(n, 100));
			};
			setTimeout(n, 100);
		}
	}
	afterSlideChanged() {
		this.clearMediaPlaybackErrors();
	}
}, C = ".slides section", w = ".slides>section", te = ".slides>section.present>section", T = ".backgrounds>.slide-background", E = /registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview|previewIframe/, ne = class {
	constructor(e) {
		this.Reveal = e;
	}
	render() {
		this.element = document.createElement("div"), this.element.className = "slide-number", this.Reveal.getRevealElement().appendChild(this.element);
	}
	configure(e, t) {
		let n = "none";
		e.slideNumber && !this.Reveal.isPrintView() && (e.showSlideNumber === "all" || e.showSlideNumber === "speaker" && this.Reveal.isSpeakerNotes()) && (n = "block"), this.element.style.display = n;
	}
	update() {
		this.Reveal.getConfig().slideNumber && this.element && (this.element.innerHTML = this.getSlideNumber());
	}
	getSlideNumber(e = this.Reveal.getCurrentSlide()) {
		let t = this.Reveal.getConfig(), n, r = "h.v";
		if (typeof t.slideNumber == "function") n = t.slideNumber(e);
		else {
			typeof t.slideNumber == "string" && (r = t.slideNumber), !/c/.test(r) && this.Reveal.getHorizontalSlides().length === 1 && (r = "c");
			let i = e && e.dataset.visibility === "uncounted" ? 0 : 1;
			switch (n = [], r) {
				case "c":
					n.push(this.Reveal.getSlidePastCount(e) + i);
					break;
				case "c/t":
					n.push(this.Reveal.getSlidePastCount(e) + i, "/", this.Reveal.getTotalSlides());
					break;
				default:
					let t = this.Reveal.getIndices(e);
					n.push(t.h + i);
					let a = r === "h/v" ? "/" : ".";
					this.Reveal.isVerticalSlide(e) && n.push(a, t.v + 1);
			}
		}
		let i = "#" + this.Reveal.location.getHash(e);
		return this.formatNumber(n[0], n[1], n[2], i);
	}
	formatNumber(e, t, n, r = "#" + this.Reveal.location.getHash()) {
		return typeof n == "number" && !isNaN(n) ? `<a href="${r}">
					<span class="slide-number-a">${e}</span>
					<span class="slide-number-delimiter">${t}</span>
					<span class="slide-number-b">${n}</span>
					</a>` : `<a href="${r}">
					<span class="slide-number-a">${e}</span>
					</a>`;
	}
	destroy() {
		this.element.remove();
	}
}, re = class {
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
	jump() {
		clearTimeout(this.jumpTimeout), delete this.jumpTimeout;
		let e = this.jumpInput.value.trim(""), t;
		if (/^\d+$/.test(e)) {
			let n = this.Reveal.getConfig().slideNumber;
			if (n === "c" || n === "c/t") {
				let n = this.Reveal.getSlides()[parseInt(e, 10) - 1];
				n && (t = this.Reveal.getIndices(n));
			}
		}
		return t || (/^\d+\.\d+$/.test(e) && (e = e.replace(".", "/")), t = this.Reveal.location.getIndicesFromHash(e, { oneBasedIndex: !0 })), !t && /\S+/i.test(e) && e.length > 1 && (t = this.search(e)), t && e !== "" ? (this.Reveal.slide(t.h, t.v, t.f), !0) : (this.Reveal.slide(this.indicesOnShow.h, this.indicesOnShow.v, this.indicesOnShow.f), !1);
	}
	jumpAfter(e) {
		clearTimeout(this.jumpTimeout), this.jumpTimeout = setTimeout(() => this.jump(), e);
	}
	search(e) {
		let t = RegExp("\\b" + e.trim() + "\\b", "i"), n = this.Reveal.getSlides().find((e) => t.test(e.innerText));
		return n ? this.Reveal.getIndices(n) : null;
	}
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
}, D = (e) => {
	let t = e.match(/^#([0-9a-f]{3})$/i);
	if (t && t[1]) {
		let e = t[1];
		return {
			r: parseInt(e.charAt(0), 16) * 17,
			g: parseInt(e.charAt(1), 16) * 17,
			b: parseInt(e.charAt(2), 16) * 17
		};
	}
	let n = e.match(/^#([0-9a-f]{6})$/i);
	if (n && n[1]) {
		let e = n[1];
		return {
			r: parseInt(e.slice(0, 2), 16),
			g: parseInt(e.slice(2, 4), 16),
			b: parseInt(e.slice(4, 6), 16)
		};
	}
	let r = e.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
	if (r) return {
		r: parseInt(r[1], 10),
		g: parseInt(r[2], 10),
		b: parseInt(r[3], 10)
	};
	let i = e.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);
	return i ? {
		r: parseInt(i[1], 10),
		g: parseInt(i[2], 10),
		b: parseInt(i[3], 10),
		a: parseFloat(i[4])
	} : null;
}, ie = (e) => (typeof e == "string" && (e = D(e)), e ? (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 : null), ae = class {
	constructor(e) {
		this.Reveal = e;
	}
	render() {
		this.element = document.createElement("div"), this.element.className = "backgrounds", this.Reveal.getRevealElement().appendChild(this.element);
	}
	create() {
		this.element.innerHTML = "", this.element.classList.add("no-transition"), this.Reveal.getHorizontalSlides().forEach((e) => {
			let n = this.createBackground(e, this.element);
			t(e, "section").forEach((e) => {
				this.createBackground(e, n), n.classList.add("stack");
			});
		}), this.Reveal.getConfig().parallaxBackgroundImage ? (this.element.style.backgroundImage = "url(\"" + this.Reveal.getConfig().parallaxBackgroundImage + "\")", this.element.style.backgroundSize = this.Reveal.getConfig().parallaxBackgroundSize, this.element.style.backgroundRepeat = this.Reveal.getConfig().parallaxBackgroundRepeat, this.element.style.backgroundPosition = this.Reveal.getConfig().parallaxBackgroundPosition, setTimeout(() => {
			this.Reveal.getRevealElement().classList.add("has-parallax-background");
		}, 1)) : (this.element.style.backgroundImage = "", this.Reveal.getRevealElement().classList.remove("has-parallax-background"));
	}
	createBackground(e, t) {
		let n = document.createElement("div");
		n.className = "slide-background " + e.className.replace(/present|past|future/, "");
		let r = document.createElement("div");
		return r.className = "slide-background-content", n.appendChild(r), t.appendChild(n), e.slideBackgroundElement = n, e.slideBackgroundContentElement = r, this.sync(e), n;
	}
	sync(e) {
		let t = e.slideBackgroundElement, n = e.slideBackgroundContentElement, r = {
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
		}, i = e.hasAttribute("data-preload");
		e.classList.remove("has-dark-background"), e.classList.remove("has-light-background"), t.removeAttribute("data-loaded"), t.removeAttribute("data-background-hash"), t.removeAttribute("data-background-size"), t.removeAttribute("data-background-transition"), t.style.backgroundColor = "", n.style.backgroundSize = "", n.style.backgroundRepeat = "", n.style.backgroundPosition = "", n.style.backgroundImage = "", n.style.opacity = "", n.innerHTML = "", r.background && (/^(http|file|\/\/)/gi.test(r.background) || /\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(r.background) ? e.setAttribute("data-background-image", r.background) : t.style.background = r.background), (r.background || r.backgroundColor || r.backgroundGradient || r.backgroundImage || r.backgroundVideo || r.backgroundIframe) && t.setAttribute("data-background-hash", r.background + r.backgroundSize + r.backgroundImage + r.backgroundVideo + r.backgroundIframe + r.backgroundColor + r.backgroundGradient + r.backgroundRepeat + r.backgroundPosition + r.backgroundTransition + r.backgroundOpacity), r.backgroundSize && t.setAttribute("data-background-size", r.backgroundSize), r.backgroundColor && (t.style.backgroundColor = r.backgroundColor), r.backgroundGradient && (t.style.backgroundImage = r.backgroundGradient), r.backgroundTransition && t.setAttribute("data-background-transition", r.backgroundTransition), i && t.setAttribute("data-preload", ""), r.backgroundSize && (n.style.backgroundSize = r.backgroundSize), r.backgroundRepeat && (n.style.backgroundRepeat = r.backgroundRepeat), r.backgroundPosition && (n.style.backgroundPosition = r.backgroundPosition), r.backgroundOpacity && (n.style.opacity = r.backgroundOpacity);
		let a = this.getContrastClass(e);
		typeof a == "string" && e.classList.add(a);
	}
	getContrastClass(e) {
		let t = e.slideBackgroundElement, n = e.getAttribute("data-background-color");
		if (!n || !D(n)) {
			let e = window.getComputedStyle(t);
			e && e.backgroundColor && (n = e.backgroundColor);
		}
		if (n) {
			let e = D(n);
			if (e && e.a !== 0) return ie(n) < 128 ? "has-dark-background" : "has-light-background";
		}
		return null;
	}
	bubbleSlideContrastClassToElement(e, t) {
		["has-light-background", "has-dark-background"].forEach((n) => {
			e.classList.contains(n) ? t.classList.add(n) : t.classList.remove(n);
		}, this);
	}
	update(e = !1) {
		let n = this.Reveal.getConfig(), r = this.Reveal.getCurrentSlide(), i = this.Reveal.getIndices(), a = null, o = n.rtl ? "future" : "past", s = n.rtl ? "past" : "future";
		if (Array.from(this.element.childNodes).forEach((n, r) => {
			n.classList.remove("past", "present", "future"), r < i.h ? n.classList.add(o) : r > i.h ? n.classList.add(s) : (n.classList.add("present"), a = n), (e || r === i.h) && t(n, ".slide-background").forEach((e, t) => {
				e.classList.remove("past", "present", "future");
				let n = typeof i.v == "number" ? i.v : 0;
				t < n ? e.classList.add("past") : t > n ? e.classList.add("future") : (e.classList.add("present"), r === i.h && (a = e));
			});
		}), this.previousBackground && !this.previousBackground.closest("body") && (this.previousBackground = null), a && this.previousBackground) {
			let e = this.previousBackground.getAttribute("data-background-hash"), t = a.getAttribute("data-background-hash");
			if (t && t === e && a !== this.previousBackground) {
				this.element.classList.add("no-transition");
				let e = a.querySelector("video"), t = this.previousBackground.querySelector("video");
				if (e && t) {
					let n = e.parentNode;
					t.parentNode.appendChild(e), n.appendChild(t);
				}
			}
		}
		let c = a !== this.previousBackground;
		if (c && this.previousBackground && this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground, { unloadIframes: !this.Reveal.slideContent.shouldPreload(this.previousBackground) }), c && a) {
			this.Reveal.slideContent.startEmbeddedContent(a);
			let e = a.querySelector(".slide-background-content");
			if (e) {
				let t = e.style.backgroundImage || "";
				/\.gif/i.test(t) && (e.style.backgroundImage = "", window.getComputedStyle(e).opacity, e.style.backgroundImage = t);
			}
			this.previousBackground = a;
		}
		r && this.bubbleSlideContrastClassToElement(r, this.Reveal.getRevealElement()), setTimeout(() => {
			this.element.classList.remove("no-transition");
		}, 10);
	}
	updateParallax() {
		let e = this.Reveal.getIndices();
		if (this.Reveal.getConfig().parallaxBackgroundImage) {
			let t = this.Reveal.getHorizontalSlides(), n = this.Reveal.getVerticalSlides(), r = this.element.style.backgroundSize.split(" "), i, a;
			r.length === 1 ? i = a = parseInt(r[0], 10) : (i = parseInt(r[0], 10), a = parseInt(r[1], 10));
			let o = this.element.offsetWidth, s = t.length, c, l;
			c = typeof this.Reveal.getConfig().parallaxBackgroundHorizontal == "number" ? this.Reveal.getConfig().parallaxBackgroundHorizontal : s > 1 ? (i - o) / (s - 1) : 0, l = c * e.h * -1;
			let u = this.element.offsetHeight, d = n.length, f, p;
			f = typeof this.Reveal.getConfig().parallaxBackgroundVertical == "number" ? this.Reveal.getConfig().parallaxBackgroundVertical : (a - u) / (d - 1), p = d > 0 ? f * e.v : 0, this.element.style.backgroundPosition = l + "px " + -p + "px";
		}
	}
	destroy() {
		this.element.remove();
	}
}, O = 0, oe = class {
	constructor(e) {
		this.Reveal = e;
	}
	run(e, t) {
		this.reset();
		let n = this.Reveal.getSlides(), r = n.indexOf(t), i = n.indexOf(e);
		if (e && t && e.hasAttribute("data-auto-animate") && t.hasAttribute("data-auto-animate") && e.getAttribute("data-auto-animate-id") === t.getAttribute("data-auto-animate-id") && !(r > i ? t : e).hasAttribute("data-auto-animate-restart")) {
			this.autoAnimateStyleSheet = this.autoAnimateStyleSheet || l();
			let n = this.getAutoAnimateOptions(t);
			e.dataset.autoAnimate = "pending", t.dataset.autoAnimate = "pending", n.slideDirection = r > i ? "forward" : "backward";
			let a = e.style.display === "none";
			a && (e.style.display = this.Reveal.getConfig().display);
			let o = this.getAutoAnimatableElements(e, t).map((e) => this.autoAnimateElements(e.from, e.to, e.options || {}, n, O++));
			if (a && (e.style.display = "none"), t.dataset.autoAnimateUnmatched !== "false" && this.Reveal.getConfig().autoAnimateUnmatched === !0) {
				let e = n.duration * .8, r = n.duration * .2;
				this.getUnmatchedAutoAnimateElements(t).forEach((e) => {
					let t = this.getAutoAnimateOptions(e, n), r = "unmatched";
					(t.duration !== n.duration || t.delay !== n.delay) && (r = "unmatched-" + O++, o.push(`[data-auto-animate="running"] [data-auto-animate-target="${r}"] { transition: opacity ${t.duration}s ease ${t.delay}s; }`)), e.dataset.autoAnimateTarget = r;
				}, this), o.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${e}s ease ${r}s; }`);
			}
			this.autoAnimateStyleSheet.innerHTML = o.join(""), requestAnimationFrame(() => {
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
	reset() {
		t(this.Reveal.getRevealElement(), "[data-auto-animate]:not([data-auto-animate=\"\"])").forEach((e) => {
			e.dataset.autoAnimate = "";
		}), t(this.Reveal.getRevealElement(), "[data-auto-animate-target]").forEach((e) => {
			delete e.dataset.autoAnimateTarget;
		}), this.autoAnimateStyleSheet && this.autoAnimateStyleSheet.parentNode && (this.autoAnimateStyleSheet.parentNode.removeChild(this.autoAnimateStyleSheet), this.autoAnimateStyleSheet = null);
	}
	autoAnimateElements(e, t, n, r, i) {
		e.dataset.autoAnimateTarget = "", t.dataset.autoAnimateTarget = i;
		let a = this.getAutoAnimateOptions(t, r);
		n.delay !== void 0 && (a.delay = n.delay), n.duration !== void 0 && (a.duration = n.duration), n.easing !== void 0 && (a.easing = n.easing);
		let o = this.getAutoAnimatableProperties("from", e, n), s = this.getAutoAnimatableProperties("to", t, n);
		if (t.classList.contains("fragment") && delete s.styles.opacity, n.translate !== !1 || n.scale !== !1) {
			let e = this.Reveal.getScale(), t = {
				x: (o.x - s.x) / e,
				y: (o.y - s.y) / e,
				scaleX: o.width / s.width,
				scaleY: o.height / s.height
			};
			t.x = Math.round(t.x * 1e3) / 1e3, t.y = Math.round(t.y * 1e3) / 1e3, t.scaleX = Math.round(t.scaleX * 1e3) / 1e3, t.scaleX = Math.round(t.scaleX * 1e3) / 1e3;
			let r = n.translate !== !1 && (t.x !== 0 || t.y !== 0), i = n.scale !== !1 && (t.scaleX !== 0 || t.scaleY !== 0);
			if (r || i) {
				let e = [];
				r && e.push(`translate(${t.x}px, ${t.y}px)`), i && e.push(`scale(${t.scaleX}, ${t.scaleY})`), o.styles.transform = e.join(" "), o.styles["transform-origin"] = "top left", s.styles.transform = "none";
			}
		}
		for (let e in s.styles) {
			let t = s.styles[e], n = o.styles[e];
			t === n ? delete s.styles[e] : (t.explicitValue === !0 && (s.styles[e] = t.value), n.explicitValue === !0 && (o.styles[e] = n.value));
		}
		let c = "", l = Object.keys(s.styles);
		if (l.length > 0) {
			o.styles.transition = "none", s.styles.transition = `all ${a.duration}s ${a.easing} ${a.delay}s`, s.styles["transition-property"] = l.join(", "), s.styles["will-change"] = l.join(", ");
			let e = Object.keys(o.styles).map((e) => e + ": " + o.styles[e] + " !important;").join(""), t = Object.keys(s.styles).map((e) => e + ": " + s.styles[e] + " !important;").join("");
			c = "[data-auto-animate-target=\"" + i + "\"] {" + e + "}[data-auto-animate=\"running\"] [data-auto-animate-target=\"" + i + "\"] {" + t + "}";
		}
		return c;
	}
	getAutoAnimateOptions(t, n) {
		let r = {
			easing: this.Reveal.getConfig().autoAnimateEasing,
			duration: this.Reveal.getConfig().autoAnimateDuration,
			delay: 0
		};
		if (r = e(r, n), t.parentNode) {
			let e = o(t.parentNode, "[data-auto-animate-target]");
			e && (r = this.getAutoAnimateOptions(e, r));
		}
		return t.dataset.autoAnimateEasing && (r.easing = t.dataset.autoAnimateEasing), t.dataset.autoAnimateDuration && (r.duration = parseFloat(t.dataset.autoAnimateDuration)), t.dataset.autoAnimateDelay && (r.delay = parseFloat(t.dataset.autoAnimateDelay)), r;
	}
	getAutoAnimatableProperties(e, t, n) {
		let r = this.Reveal.getConfig(), i = { styles: [] };
		if (n.translate !== !1 || n.scale !== !1) {
			let e;
			if (typeof n.measure == "function") e = n.measure(t);
			else if (r.center) e = t.getBoundingClientRect();
			else {
				let n = this.Reveal.getScale();
				e = {
					x: t.offsetLeft * n,
					y: t.offsetTop * n,
					width: t.offsetWidth * n,
					height: t.offsetHeight * n
				};
			}
			i.x = e.x, i.y = e.y, i.width = e.width, i.height = e.height;
		}
		let a = getComputedStyle(t);
		return (n.styles || r.autoAnimateStyles).forEach((t) => {
			let n;
			typeof t == "string" && (t = { property: t }), t.from !== void 0 && e === "from" ? n = {
				value: t.from,
				explicitValue: !0
			} : t.to !== void 0 && e === "to" ? n = {
				value: t.to,
				explicitValue: !0
			} : (t.property === "line-height" && (n = parseFloat(a["line-height"]) / parseFloat(a["font-size"])), isNaN(n) && (n = a[t.property])), n !== "" && (i.styles[t.property] = n);
		}), i;
	}
	getAutoAnimatableElements(e, t) {
		let n = (typeof this.Reveal.getConfig().autoAnimateMatcher == "function" ? this.Reveal.getConfig().autoAnimateMatcher : this.getAutoAnimatePairs).call(this, e, t), r = [];
		return n.filter((e, t) => {
			if (r.indexOf(e.to) === -1) return r.push(e.to), !0;
		});
	}
	getAutoAnimatePairs(e, t) {
		let n = [], r = "h1, h2, h3, h4, h5, h6, p, li";
		return this.findAutoAnimateMatches(n, e, t, "[data-id]", (e) => e.nodeName + ":::" + e.getAttribute("data-id")), this.findAutoAnimateMatches(n, e, t, r, (e) => e.nodeName + ":::" + e.textContent.trim()), this.findAutoAnimateMatches(n, e, t, "img, video, iframe", (e) => e.nodeName + ":::" + (e.getAttribute("src") || e.getAttribute("data-src"))), this.findAutoAnimateMatches(n, e, t, "pre", (e) => e.nodeName + ":::" + e.textContent.trim()), n.forEach((e) => {
			a(e.from, r) ? e.options = { scale: !1 } : a(e.from, "pre") && (e.options = {
				scale: !1,
				styles: ["width", "height"]
			}, this.findAutoAnimateMatches(n, e.from, e.to, ".hljs .hljs-ln-code", (e) => e.textContent, {
				scale: !1,
				styles: [],
				measure: this.getLocalBoundingBox.bind(this)
			}), this.findAutoAnimateMatches(n, e.from, e.to, ".hljs .hljs-ln-numbers[data-line-number]", (e) => e.getAttribute("data-line-number"), {
				scale: !1,
				styles: ["width"],
				measure: this.getLocalBoundingBox.bind(this)
			}));
		}, this), n;
	}
	getLocalBoundingBox(e) {
		let t = this.Reveal.getScale();
		return {
			x: Math.round(e.offsetLeft * t * 100) / 100,
			y: Math.round(e.offsetTop * t * 100) / 100,
			width: Math.round(e.offsetWidth * t * 100) / 100,
			height: Math.round(e.offsetHeight * t * 100) / 100
		};
	}
	findAutoAnimateMatches(e, t, n, r, i, a) {
		let o = {}, s = {};
		[].slice.call(t.querySelectorAll(r)).forEach((e, t) => {
			let n = i(e);
			typeof n == "string" && n.length && (o[n] = o[n] || [], o[n].push(e));
		}), [].slice.call(n.querySelectorAll(r)).forEach((t, n) => {
			let r = i(t);
			s[r] = s[r] || [], s[r].push(t);
			let c;
			if (o[r]) {
				let e = s[r].length - 1, t = o[r].length - 1;
				o[r][e] ? (c = o[r][e], o[r][e] = null) : o[r][t] && (c = o[r][t], o[r][t] = null);
			}
			c && e.push({
				from: c,
				to: t,
				options: a
			});
		});
	}
	getUnmatchedAutoAnimateElements(e) {
		return [].slice.call(e.children).reduce((e, t) => {
			let n = t.querySelector("[data-auto-animate-target]");
			return !t.hasAttribute("data-auto-animate-target") && !n && e.push(t), t.querySelector("[data-auto-animate-target]") && (e = e.concat(this.getUnmatchedAutoAnimateElements(t))), e;
		}, []);
	}
}, k = 500, se = 4, ce = 6, A = 8, le = class {
	constructor(e) {
		this.Reveal = e, this.active = !1, this.activeProgressBarPage = null, this.activeProgressBarTrigger = null, this.activatedCallbacks = [], this.onScroll = this.onScroll.bind(this);
	}
	activate() {
		if (this.active) return;
		let e = this.Reveal.getState();
		this.active = !0, this.slideHTMLBeforeActivation = this.Reveal.getSlidesElement().innerHTML;
		let n = t(this.Reveal.getRevealElement(), w), r = t(this.Reveal.getRevealElement(), T);
		this.viewportElement.classList.add("loading-scroll-mode", "reveal-scroll");
		let i, a = window.getComputedStyle(this.viewportElement);
		a && a.background && (i = a.background);
		let o = [], s = n[0].parentNode, c, l = (e, t, n, a) => {
			let s;
			if (c && this.Reveal.shouldAutoAnimateBetween(c, e)) s = document.createElement("div"), s.className = "scroll-page-content scroll-auto-animate-page", s.style.display = "none", c.closest(".scroll-page-content").parentNode.appendChild(s);
			else {
				let e = document.createElement("div");
				if (e.className = "scroll-page", o.push(e), a && r.length > t) {
					let n = r[t], a = window.getComputedStyle(n);
					a && a.background ? e.style.background = a.background : i && (e.style.background = i);
				} else i && (e.style.background = i);
				let n = document.createElement("div");
				n.className = "scroll-page-sticky", e.appendChild(n), s = document.createElement("div"), s.className = "scroll-page-content", n.appendChild(s);
			}
			s.appendChild(e), e.classList.remove("past", "future"), e.removeAttribute("inert"), e.setAttribute("data-index-h", t), e.setAttribute("data-index-v", n), e.slideBackgroundElement && (e.slideBackgroundElement.remove("past", "future"), s.insertBefore(e.slideBackgroundElement, e)), c = e;
		};
		n.forEach((e, t) => {
			this.Reveal.isVerticalStack(e) ? e.querySelectorAll("section").forEach((e, n) => {
				l(e, t, n, !0);
			}) : l(e, t, 0);
		}, this), this.createProgressBar(), t(this.Reveal.getRevealElement(), ".stack").forEach((e) => e.remove()), o.forEach((e) => s.appendChild(e)), this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()), this.Reveal.layout(), this.Reveal.setState(e), this.activatedCallbacks.forEach((e) => e()), this.activatedCallbacks = [], this.restoreScrollPosition(), this.viewportElement.classList.remove("loading-scroll-mode"), this.viewportElement.addEventListener("scroll", this.onScroll, { passive: !0 });
	}
	deactivate() {
		if (!this.active) return;
		let e = this.Reveal.getState();
		this.active = !1, this.viewportElement.removeEventListener("scroll", this.onScroll), this.viewportElement.classList.remove("reveal-scroll"), this.pendingScrollRaf && (cancelAnimationFrame(this.pendingScrollRaf), this.pendingScrollRaf = 0), this.removeProgressBar(), this.Reveal.getSlidesElement().innerHTML = this.slideHTMLBeforeActivation, this.Reveal.sync(), this.Reveal.setState(e), this.slideHTMLBeforeActivation = null;
	}
	toggle(e) {
		typeof e == "boolean" ? e ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
	}
	isActive() {
		return this.active;
	}
	createProgressBar() {
		this.progressBar = document.createElement("div"), this.progressBar.className = "scrollbar", this.progressBarInner = document.createElement("div"), this.progressBarInner.className = "scrollbar-inner", this.progressBar.appendChild(this.progressBarInner), this.progressBarPlayhead = document.createElement("div"), this.progressBarPlayhead.className = "scrollbar-playhead", this.progressBarInner.appendChild(this.progressBarPlayhead), this.viewportElement.insertBefore(this.progressBar, this.viewportElement.firstChild);
		let e = (e) => {
			let t = (e.clientY - this.progressBarInner.getBoundingClientRect().top) / this.progressBarHeight;
			t = Math.max(Math.min(t, 1), 0), this.viewportElement.scrollTop = t * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight);
		}, t = (n) => {
			this.draggingProgressBar = !1, this.showProgressBar(), document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", t);
		};
		this.progressBarInner.addEventListener("mousedown", (n) => {
			n.preventDefault(), this.draggingProgressBar = !0, document.addEventListener("mousemove", e), document.addEventListener("mouseup", t), e(n);
		});
	}
	removeProgressBar() {
		this.progressBar && (this.progressBar.remove(), this.progressBar = null), this.activeProgressBarPage = null, this.activeProgressBarTrigger = null;
	}
	layout() {
		this.isActive() && (this.syncPages(), this.syncScrollPosition());
	}
	syncPages() {
		let e = this.Reveal.getConfig(), t = this.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), n = this.Reveal.getScale(), r = e.scrollLayout === "compact", i = this.viewportElement.offsetHeight, a = t.height * n, o = r ? a : i;
		this.scrollTriggerHeight = r ? a : i, this.viewportElement.style.setProperty("--page-height", o + "px"), this.viewportElement.style.scrollSnapType = typeof e.scrollSnap == "string" ? `y ${e.scrollSnap}` : "", this.slideTriggers = [], this.pages = Array.from(this.Reveal.getRevealElement().querySelectorAll(".scroll-page")).map((n) => {
			let a = this.createPage({
				pageElement: n,
				slideElement: n.querySelector("section"),
				stickyElement: n.querySelector(".scroll-page-sticky"),
				contentElement: n.querySelector(".scroll-page-content"),
				backgroundElement: n.querySelector(".slide-background"),
				autoAnimateElements: n.querySelectorAll(".scroll-auto-animate-page"),
				autoAnimatePages: []
			});
			a.pageElement.style.setProperty("--slide-height", e.center === !0 ? "auto" : t.height + "px"), this.slideTriggers.push({
				page: a,
				activate: () => this.activatePage(a),
				deactivate: () => this.deactivatePage(a)
			}), this.createFragmentTriggersForPage(a), a.autoAnimateElements.length > 0 && this.createAutoAnimateTriggersForPage(a);
			let s = Math.max(a.scrollTriggers.length - 1, 0);
			s += a.autoAnimatePages.reduce((e, t) => e + Math.max(t.scrollTriggers.length - 1, 0), a.autoAnimatePages.length), a.pageElement.querySelectorAll(".scroll-snap-point").forEach((e) => e.remove());
			for (let e = 0; e < s + 1; e++) {
				let t = document.createElement("div");
				t.className = "scroll-snap-point", t.style.height = this.scrollTriggerHeight + "px", t.style.scrollSnapAlign = r ? "center" : "start", a.pageElement.appendChild(t), e === 0 && (t.style.marginTop = -this.scrollTriggerHeight + "px");
			}
			return r && a.scrollTriggers.length > 0 ? (a.pageHeight = i, a.pageElement.style.setProperty("--page-height", i + "px")) : (a.pageHeight = o, a.pageElement.style.removeProperty("--page-height")), a.scrollPadding = this.scrollTriggerHeight * s, a.totalHeight = a.pageHeight + a.scrollPadding, a.pageElement.style.setProperty("--page-scroll-padding", a.scrollPadding + "px"), s > 0 ? (a.stickyElement.style.position = "sticky", a.stickyElement.style.top = Math.max((i - a.pageHeight) / 2, 0) + "px") : (a.stickyElement.style.position = "relative", a.pageElement.style.scrollSnapAlign = a.pageHeight < i ? "center" : "start"), a;
		}), this.setTriggerRanges(), this.viewportElement.setAttribute("data-scrollbar", e.scrollProgress), e.scrollProgress && this.totalScrollTriggerCount > 1 ? (this.progressBar || this.createProgressBar(), this.syncProgressBar()) : this.removeProgressBar();
	}
	setTriggerRanges() {
		this.totalScrollTriggerCount = this.slideTriggers.reduce((e, t) => e + Math.max(t.page.scrollTriggers.length, 1), 0);
		let e = 0;
		this.slideTriggers.forEach((t, n) => {
			t.range = [e, e + Math.max(t.page.scrollTriggers.length, 1) / this.totalScrollTriggerCount];
			let r = (t.range[1] - t.range[0]) / t.page.scrollTriggers.length;
			t.page.scrollTriggers.forEach((t, n) => {
				t.range = [e + n * r, e + (n + 1) * r];
			}), e = t.range[1];
		}), this.slideTriggers[this.slideTriggers.length - 1].range[1] = 1;
	}
	createFragmentTriggersForPage(e, t) {
		t = t || e.slideElement;
		let n = this.Reveal.fragments.sort(t.querySelectorAll(".fragment"), !0);
		return n.length && (e.fragments = this.Reveal.fragments.sort(t.querySelectorAll(".fragment:not(.disabled)")), e.scrollTriggers.push({ activate: () => {
			this.Reveal.fragments.update(-1, e.fragments, t);
		} }), n.forEach((n, r) => {
			e.scrollTriggers.push({ activate: () => {
				this.Reveal.fragments.update(r, e.fragments, t);
			} });
		})), e.scrollTriggers.length;
	}
	createAutoAnimateTriggersForPage(e) {
		e.autoAnimateElements.length > 0 && this.slideTriggers.push(...Array.from(e.autoAnimateElements).map((t, n) => {
			let r = this.createPage({
				slideElement: t.querySelector("section"),
				contentElement: t,
				backgroundElement: t.querySelector(".slide-background")
			});
			return this.createFragmentTriggersForPage(r, r.slideElement), e.autoAnimatePages.push(r), {
				page: r,
				activate: () => this.activatePage(r),
				deactivate: () => this.deactivatePage(r)
			};
		}));
	}
	createPage(e) {
		return e.scrollTriggers = [], e.indexh = parseInt(e.slideElement.getAttribute("data-index-h"), 10), e.indexv = parseInt(e.slideElement.getAttribute("data-index-v"), 10), e;
	}
	syncProgressBar() {
		this.progressBarInner.querySelectorAll(".scrollbar-slide").forEach((e) => e.remove()), this.activeProgressBarPage = null, this.activeProgressBarTrigger = null, this.getAllPages().forEach((e) => {
			e.progressBarSlide = null, e.scrollTriggers.forEach((e) => e.progressBarElement = null);
		});
		let e = this.viewportElement.scrollHeight, t = this.viewportElement.offsetHeight, n = t / e;
		this.progressBarHeight = this.progressBarInner.offsetHeight, this.playheadHeight = Math.max(n * this.progressBarHeight, A), this.progressBarScrollableHeight = this.progressBarHeight - this.playheadHeight;
		let r = t / e * this.progressBarHeight, i = Math.min(r / 8, se);
		this.progressBarPlayhead.style.height = this.playheadHeight - i + "px", r > ce && this.slideTriggers.forEach((e) => {
			let { page: t } = e;
			t.progressBarSlide = document.createElement("div"), t.progressBarSlide.className = "scrollbar-slide", t.progressBarSlide.style.top = e.range[0] * this.progressBarHeight + "px", t.progressBarSlide.style.height = (e.range[1] - e.range[0]) * this.progressBarHeight - i + "px", t.progressBarSlide.classList.toggle("has-triggers", t.scrollTriggers.length > 0), this.progressBarInner.appendChild(t.progressBarSlide), t.scrollTriggers.forEach((n, r) => {
				let a = document.createElement("div");
				a.className = "scrollbar-trigger", a.style.top = (n.range[0] - e.range[0]) * this.progressBarHeight + "px", a.style.height = (n.range[1] - n.range[0]) * this.progressBarHeight - i + "px", t.progressBarSlide.appendChild(a), r === 0 && (a.style.display = "none"), n.progressBarElement = a;
			});
		});
	}
	syncScrollPosition() {
		let e = this.viewportElement.offsetHeight, t = e / this.viewportElement.scrollHeight, n = this.viewportElement.scrollTop, r = this.viewportElement.scrollHeight - e, i = Math.max(Math.min(n / r, 1), 0), a = Math.max(Math.min((n + e / 2) / this.viewportElement.scrollHeight, 1), 0), o, s = null;
		this.slideTriggers.forEach((e) => {
			let { page: n } = e, r = i >= e.range[0] - t * 2 && i <= e.range[1] + t * 2;
			r && !n.loaded ? (n.loaded = !0, this.Reveal.slideContent.load(n.slideElement)) : !r && n.loaded && (n.loaded = !1, this.Reveal.slideContent.unload(n.slideElement)), i >= e.range[0] && i <= e.range[1] ? (this.activateTrigger(e), o = e.page) : e.active && this.deactivateTrigger(e);
		}), o && o.scrollTriggers.forEach((e) => {
			a >= e.range[0] && a <= e.range[1] ? (this.activateTrigger(e), s = e) : e.active && this.deactivateTrigger(e);
		}), this.setProgressBarValue(n / (this.viewportElement.scrollHeight - e), o, s);
	}
	setProgressBarValue(e, t = null, n = null) {
		if (this.progressBar) {
			if (this.progressBarPlayhead.style.transform = `translateY(${e * this.progressBarScrollableHeight}px)`, this.activeProgressBarPage !== t) {
				var r, i;
				(r = this.activeProgressBarPage) == null || (r = r.progressBarSlide) == null || r.classList.remove("active"), t == null || (i = t.progressBarSlide) == null || i.classList.add("active"), this.activeProgressBarPage = t;
			}
			if (this.activeProgressBarTrigger !== n) {
				var a, o;
				(a = this.activeProgressBarTrigger) == null || (a = a.progressBarElement) == null || a.classList.remove("active"), n == null || (o = n.progressBarElement) == null || o.classList.add("active"), this.activeProgressBarTrigger = n;
			}
			this.showProgressBar();
		}
	}
	showProgressBar() {
		this.progressBar.classList.add("visible"), clearTimeout(this.hideProgressBarTimeout), this.Reveal.getConfig().scrollProgress === "auto" && !this.draggingProgressBar && (this.hideProgressBarTimeout = setTimeout(() => {
			this.progressBar && this.progressBar.classList.remove("visible");
		}, k));
	}
	prev() {
		this.viewportElement.scrollTop -= this.scrollTriggerHeight;
	}
	next() {
		this.viewportElement.scrollTop += this.scrollTriggerHeight;
	}
	scrollToSlide(e) {
		if (!this.active) this.activatedCallbacks.push(() => this.scrollToSlide(e));
		else {
			let t = this.getScrollTriggerBySlide(e);
			t && (this.viewportElement.scrollTop = t.range[0] * (this.viewportElement.scrollHeight - this.viewportElement.offsetHeight));
		}
	}
	storeScrollPosition() {
		clearTimeout(this.storeScrollPositionTimeout), this.storeScrollPositionTimeout = setTimeout(() => {
			sessionStorage.setItem("reveal-scroll-top", this.viewportElement.scrollTop), sessionStorage.setItem("reveal-scroll-origin", location.origin + location.pathname), this.storeScrollPositionTimeout = null;
		}, 50);
	}
	restoreScrollPosition() {
		let e = sessionStorage.getItem("reveal-scroll-top"), t = sessionStorage.getItem("reveal-scroll-origin");
		e && t === location.origin + location.pathname && (this.viewportElement.scrollTop = parseInt(e, 10));
	}
	activatePage(e) {
		if (!e.active) {
			e.active = !0;
			let { slideElement: t, backgroundElement: n, contentElement: r, indexh: i, indexv: a } = e;
			r.style.display = "block", t.classList.add("present"), n && n.classList.add("present"), this.Reveal.setCurrentScrollPage(t, i, a), this.Reveal.backgrounds.bubbleSlideContrastClassToElement(t, this.viewportElement), Array.from(r.parentNode.querySelectorAll(".scroll-page-content")).forEach((e) => {
				e !== r && (e.style.display = "none");
			});
		}
	}
	deactivatePage(e) {
		e.active && (e.active = !1, e.slideElement && e.slideElement.classList.remove("present"), e.backgroundElement && e.backgroundElement.classList.remove("present"));
	}
	activateTrigger(e) {
		e.active || (e.active = !0, e.activate());
	}
	deactivateTrigger(e) {
		e.active && (e.active = !1, e.deactivate && e.deactivate());
	}
	getSlideByIndices(e, t) {
		let n = this.getAllPages().find((n) => n.indexh === e && n.indexv === t);
		return n ? n.slideElement : null;
	}
	getScrollTriggerBySlide(e) {
		return this.slideTriggers.find((t) => t.page.slideElement === e);
	}
	getAllPages() {
		return this.pages.flatMap((e) => [e, ...e.autoAnimatePages || []]);
	}
	onScroll() {
		this.pendingScrollRaf || (this.pendingScrollRaf = requestAnimationFrame(() => {
			this.pendingScrollRaf = 0, this.syncScrollPosition(), this.storeScrollPosition();
		}));
	}
	get viewportElement() {
		return this.Reveal.getViewportElement();
	}
};
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/asyncToGenerator.js
function j(e, t, n, r, i, a, o) {
	try {
		var s = e[a](o), c = s.value;
	} catch (e) {
		n(e);
		return;
	}
	s.done ? t(c) : Promise.resolve(c).then(r, i);
}
function M(e) {
	return function() {
		var t = this, n = arguments;
		return new Promise(function(r, i) {
			var a = e.apply(t, n);
			function o(e) {
				j(a, r, i, o, s, "next", e);
			}
			function s(e) {
				j(a, r, i, o, s, "throw", e);
			}
			o(void 0);
		});
	};
}
//#endregion
//#region js/controllers/printview.js
var ue = class {
	constructor(e) {
		this.Reveal = e;
	}
	activate() {
		var e = this;
		return M(function* () {
			let n = e.Reveal.getConfig(), r = t(e.Reveal.getRevealElement(), C), i = n.slideNumber && /all|print/i.test(n.showSlideNumber), a = e.Reveal.getComputedSlideSize(window.innerWidth, window.innerHeight), o = Math.floor(a.width * (1 + n.margin)), s = Math.floor(a.height * (1 + n.margin)), c = a.width, u = a.height;
			yield new Promise(requestAnimationFrame), l("@page{size:" + o + "px " + s + "px; margin: 0px;}"), l(".reveal section>img, .reveal section>video, .reveal section>iframe{max-width: " + c + "px; max-height:" + u + "px}"), document.documentElement.classList.add("reveal-print", "print-pdf"), document.body.style.width = o + "px", document.body.style.height = s + "px";
			let d = e.Reveal.getViewportElement(), f;
			if (d) {
				let e = window.getComputedStyle(d);
				e && e.background && (f = e.background);
			}
			yield new Promise(requestAnimationFrame), e.Reveal.layoutSlideContents(c, u), yield new Promise(requestAnimationFrame);
			let p = r.map((e) => e.scrollHeight), m = [], h = r[0].parentNode, g = 1;
			r.forEach(function(e, r) {
				if (e.classList.contains("stack") === !1) {
					let a = (o - c) / 2, l = (s - u) / 2, d = p[r], h = Math.max(Math.ceil(d / s), 1);
					h = Math.min(h, n.pdfMaxPagesPerSlide), (h === 1 && n.center || e.classList.contains("center")) && (l = Math.max((s - d) / 2, 0));
					let _ = document.createElement("div");
					if (m.push(_), _.className = "pdf-page", _.style.height = (s + n.pdfPageHeightOffset) * h + "px", f && (_.style.background = f), _.appendChild(e), e.style.left = a + "px", e.style.top = l + "px", e.style.width = c + "px", this.Reveal.slideContent.layout(e), e.slideBackgroundElement && _.insertBefore(e.slideBackgroundElement, e), n.showNotes) {
						let t = this.Reveal.getSlideNotes(e);
						if (t) {
							let e = typeof n.showNotes == "string" ? n.showNotes : "inline", r = document.createElement("div");
							r.classList.add("speaker-notes"), r.classList.add("speaker-notes-pdf"), r.setAttribute("data-layout", e), r.innerHTML = t, e === "separate-page" ? m.push(r) : (r.style.left = "8px", r.style.bottom = "8px", r.style.width = o - 16 + "px", _.appendChild(r));
						}
					}
					if (i) {
						let e = document.createElement("div");
						e.classList.add("slide-number"), e.classList.add("slide-number-pdf"), e.innerHTML = g++, _.appendChild(e);
					}
					if (n.pdfSeparateFragments) {
						let e = this.Reveal.fragments.sort(_.querySelectorAll(".fragment"), !0), t;
						e.forEach(function(e, n) {
							t && t.forEach(function(e) {
								e.classList.remove("current-fragment");
							}), e.forEach(function(e) {
								e.classList.add("visible", "current-fragment");
							}, this);
							let r = _.cloneNode(!0);
							if (i) {
								let e = r.querySelector(".slide-number-pdf"), t = n + 1;
								e.innerHTML += "." + t;
							}
							m.push(r), t = e;
						}, this), e.forEach(function(e) {
							e.forEach(function(e) {
								e.classList.remove("visible", "current-fragment");
							});
						});
					} else t(_, ".fragment:not(.fade-out)").forEach(function(e) {
						e.classList.add("visible");
					});
				}
			}, e), yield new Promise(requestAnimationFrame), m.forEach((e) => h.appendChild(e)), e.Reveal.slideContent.layout(e.Reveal.getSlidesElement()), e.Reveal.dispatchEvent({ type: "pdf-ready" }), d.classList.remove("loading-scroll-mode");
		})();
	}
	isActive() {
		return this.Reveal.getConfig().view === "print";
	}
}, de = class {
	constructor(e) {
		this.Reveal = e;
	}
	configure(e, t) {
		e.fragments === !1 ? this.disable() : t.fragments === !1 && this.enable();
	}
	disable() {
		t(this.Reveal.getSlidesElement(), ".fragment").forEach((e) => {
			e.classList.add("visible"), e.classList.remove("current-fragment");
		});
	}
	enable() {
		t(this.Reveal.getSlidesElement(), ".fragment").forEach((e) => {
			e.classList.remove("visible"), e.classList.remove("current-fragment");
		});
	}
	availableRoutes() {
		let e = this.Reveal.getCurrentSlide();
		if (e && this.Reveal.getConfig().fragments) {
			let t = e.querySelectorAll(".fragment:not(.disabled)"), n = e.querySelectorAll(".fragment:not(.disabled):not(.visible)");
			return {
				prev: t.length - n.length > 0,
				next: !!n.length
			};
		} else return {
			prev: !1,
			next: !1
		};
	}
	sort(e, t = !1) {
		e = Array.from(e);
		let n = [], r = [], i = [];
		e.forEach((e) => {
			if (e.hasAttribute("data-fragment-index")) {
				let t = parseInt(e.getAttribute("data-fragment-index"), 10);
				n[t] || (n[t] = []), n[t].push(e);
			} else r.push([e]);
		}), n = n.concat(r);
		let a = 0;
		return n.forEach((e) => {
			e.forEach((e) => {
				i.push(e), e.setAttribute("data-fragment-index", a);
			}), a++;
		}), t === !0 ? n : i;
	}
	sortAll() {
		this.Reveal.getHorizontalSlides().forEach((e) => {
			let n = t(e, "section");
			n.forEach((e, t) => {
				this.sort(e.querySelectorAll(".fragment"));
			}, this), n.length === 0 && this.sort(e.querySelectorAll(".fragment"));
		});
	}
	update(e, t, n = this.Reveal.getCurrentSlide()) {
		let r = {
			shown: [],
			hidden: []
		};
		if (n && this.Reveal.getConfig().fragments && (t = t || this.sort(n.querySelectorAll(".fragment")), t.length)) {
			let i = 0;
			if (typeof e != "number") {
				let t = this.sort(n.querySelectorAll(".fragment.visible")).pop();
				t && (e = parseInt(t.getAttribute("data-fragment-index") || 0, 10));
			}
			Array.from(t).forEach((t, n) => {
				if (t.hasAttribute("data-fragment-index") && (n = parseInt(t.getAttribute("data-fragment-index"), 10)), i = Math.max(i, n), n <= e) {
					let i = t.classList.contains("visible");
					t.classList.add("visible"), t.classList.remove("current-fragment"), n === e && (this.Reveal.announceStatus(this.Reveal.getStatusText(t)), t.classList.add("current-fragment"), this.Reveal.slideContent.startEmbeddedContent(t)), i || (r.shown.push(t), this.Reveal.dispatchEvent({
						target: t,
						type: "visible",
						bubbles: !1
					}));
				} else {
					let e = t.classList.contains("visible");
					t.classList.remove("visible"), t.classList.remove("current-fragment"), e && (this.Reveal.slideContent.stopEmbeddedContent(t), r.hidden.push(t), this.Reveal.dispatchEvent({
						target: t,
						type: "hidden",
						bubbles: !1
					}));
				}
			}), e = typeof e == "number" ? e : -1, e = Math.max(Math.min(e, i), -1), n.setAttribute("data-fragment", e);
		}
		return r.hidden.length && this.Reveal.dispatchEvent({
			type: "fragmenthidden",
			data: {
				fragment: r.hidden[0],
				fragments: r.hidden
			}
		}), r.shown.length && this.Reveal.dispatchEvent({
			type: "fragmentshown",
			data: {
				fragment: r.shown[0],
				fragments: r.shown
			}
		}), r;
	}
	sync(e = this.Reveal.getCurrentSlide()) {
		return this.sort(e.querySelectorAll(".fragment"));
	}
	goto(e, t = 0) {
		let n = this.Reveal.getCurrentSlide();
		if (n && this.Reveal.getConfig().fragments) {
			let r = this.sort(n.querySelectorAll(".fragment:not(.disabled)"));
			if (r.length) {
				if (typeof e != "number") {
					let t = this.sort(n.querySelectorAll(".fragment:not(.disabled).visible")).pop();
					e = t ? parseInt(t.getAttribute("data-fragment-index") || 0, 10) : -1;
				}
				e += t;
				let i = this.update(e, r);
				return this.Reveal.controls.update(), this.Reveal.progress.update(), this.Reveal.getConfig().fragmentInURL && this.Reveal.location.writeURL(), !!(i.shown.length || i.hidden.length);
			}
		}
		return !1;
	}
	next() {
		return this.goto(null, 1);
	}
	prev() {
		return this.goto(null, -1);
	}
}, fe = class {
	constructor(e) {
		this.Reveal = e, this.active = !1, this.onSlideClicked = this.onSlideClicked.bind(this);
	}
	activate() {
		if (this.Reveal.getConfig().overview && !this.Reveal.isScrollView() && !this.isActive()) {
			this.active = !0, this.Reveal.getRevealElement().classList.add("overview"), this.Reveal.cancelAutoSlide(), this.Reveal.getSlidesElement().appendChild(this.Reveal.getBackgroundsElement()), t(this.Reveal.getRevealElement(), C).forEach((e) => {
				e.classList.contains("stack") || e.addEventListener("click", this.onSlideClicked, !0);
			});
			let e = this.Reveal.getComputedSlideSize();
			this.overviewSlideWidth = e.width + 70, this.overviewSlideHeight = e.height + 70, this.Reveal.getConfig().rtl && (this.overviewSlideWidth = -this.overviewSlideWidth), this.Reveal.updateSlidesVisibility(), this.layout(), this.update(), this.Reveal.layout();
			let n = this.Reveal.getIndices();
			this.Reveal.dispatchEvent({
				type: "overviewshown",
				data: {
					indexh: n.h,
					indexv: n.v,
					currentSlide: this.Reveal.getCurrentSlide()
				}
			});
		}
	}
	layout() {
		this.Reveal.getHorizontalSlides().forEach((e, n) => {
			e.setAttribute("data-index-h", n), i(e, "translate3d(" + n * this.overviewSlideWidth + "px, 0, 0)"), e.classList.contains("stack") && t(e, "section").forEach((e, t) => {
				e.setAttribute("data-index-h", n), e.setAttribute("data-index-v", t), i(e, "translate3d(0, " + t * this.overviewSlideHeight + "px, 0)");
			});
		}), Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach((e, n) => {
			i(e, "translate3d(" + n * this.overviewSlideWidth + "px, 0, 0)"), t(e, ".slide-background").forEach((e, t) => {
				i(e, "translate3d(0, " + t * this.overviewSlideHeight + "px, 0)");
			});
		});
	}
	update() {
		let e = Math.min(window.innerWidth, window.innerHeight), t = Math.max(e / 5, 150) / e, n = this.Reveal.getIndices();
		this.Reveal.transformSlides({ overview: [
			"scale(" + t + ")",
			"translateX(" + -n.h * this.overviewSlideWidth + "px)",
			"translateY(" + -n.v * this.overviewSlideHeight + "px)"
		].join(" ") });
	}
	deactivate() {
		if (this.Reveal.getConfig().overview) {
			this.active = !1, this.Reveal.getRevealElement().classList.remove("overview"), this.Reveal.getRevealElement().classList.add("overview-deactivating"), setTimeout(() => {
				this.Reveal.getRevealElement().classList.remove("overview-deactivating");
			}, 1), this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()), t(this.Reveal.getRevealElement(), C).forEach((e) => {
				i(e, ""), e.removeEventListener("click", this.onSlideClicked, !0);
			}), t(this.Reveal.getBackgroundsElement(), ".slide-background").forEach((e) => {
				i(e, "");
			}), this.Reveal.transformSlides({ overview: "" });
			let e = this.Reveal.getIndices();
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
	toggle(e) {
		typeof e == "boolean" ? e ? this.activate() : this.deactivate() : this.isActive() ? this.deactivate() : this.activate();
	}
	isActive() {
		return this.active;
	}
	onSlideClicked(e) {
		if (this.isActive()) {
			e.preventDefault();
			let t = e.target;
			for (; t && !t.nodeName.match(/section/gi);) t = t.parentNode;
			if (t && !t.classList.contains("disabled") && (this.deactivate(), t.nodeName.match(/section/gi))) {
				let e = parseInt(t.getAttribute("data-index-h"), 10), n = parseInt(t.getAttribute("data-index-v"), 10);
				this.Reveal.slide(e, n);
			}
		}
	}
}, pe = class {
	constructor(e) {
		this.Reveal = e, this.shortcuts = {}, this.bindings = {}, this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
	}
	configure(e, t) {
		e.navigationMode === "linear" ? (this.shortcuts["&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J"] = "Next slide", this.shortcuts["&#8592;  ,  &#8593;  ,  P  ,  H  ,  K"] = "Previous slide") : (this.shortcuts["N  ,  SPACE"] = "Next slide", this.shortcuts["P  ,  Shift SPACE"] = "Previous slide", this.shortcuts["&#8592;  ,  H"] = "Navigate left", this.shortcuts["&#8594;  ,  L"] = "Navigate right", this.shortcuts["&#8593;  ,  K"] = "Navigate up", this.shortcuts["&#8595;  ,  J"] = "Navigate down"), this.shortcuts["Alt + &#8592;/&#8593/&#8594;/&#8595;"] = "Navigate without fragments", this.shortcuts["Shift + &#8592;/&#8593/&#8594;/&#8595;"] = "Jump to first/last slide", this.shortcuts["B  ,  ."] = "Pause", this.shortcuts.F = "Fullscreen", this.shortcuts.G = "Jump to slide", this.shortcuts["ESC, O"] = "Slide overview";
	}
	bind() {
		document.addEventListener("keydown", this.onDocumentKeyDown, !1);
	}
	unbind() {
		document.removeEventListener("keydown", this.onDocumentKeyDown, !1);
	}
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
	removeKeyBinding(e) {
		delete this.bindings[e];
	}
	triggerKey(e) {
		this.onDocumentKeyDown({ keyCode: e });
	}
	registerKeyboardShortcut(e, t) {
		this.shortcuts[e] = t;
	}
	getShortcuts() {
		return this.shortcuts;
	}
	getBindings() {
		return this.bindings;
	}
	onDocumentKeyDown(e) {
		let t = this.Reveal.getConfig();
		if (typeof t.keyboardCondition == "function" && t.keyboardCondition(e) === !1 || t.keyboardCondition === "focused" && !this.Reveal.isFocused()) return !0;
		let n = e.keyCode, r = !this.Reveal.isAutoSliding();
		this.Reveal.onUserInput(e);
		let i = document.activeElement && document.activeElement.isContentEditable === !0, a = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName), o = document.activeElement && document.activeElement.className && /speaker-notes/i.test(document.activeElement.className), c = !([
			32,
			37,
			38,
			39,
			40,
			63,
			78,
			80,
			191
		].indexOf(e.keyCode) !== -1 && e.shiftKey || e.altKey) && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
		if (i || a || o || c) return;
		let l = [
			66,
			86,
			190,
			191,
			112
		], u;
		if (typeof t.keyboard == "object") for (u in t.keyboard) t.keyboard[u] === "togglePause" && l.push(parseInt(u, 10));
		if (this.Reveal.isOverlayOpen() && ![
			"Escape",
			"f",
			"c",
			"b",
			"."
		].includes(e.key) || this.Reveal.isPaused() && l.indexOf(n) === -1) return !1;
		let d = t.navigationMode === "linear" || !this.Reveal.hasHorizontalSlides() || !this.Reveal.hasVerticalSlides(), f = !1;
		if (typeof t.keyboard == "object") {
			for (u in t.keyboard) if (parseInt(u, 10) === n) {
				let n = t.keyboard[u];
				typeof n == "function" ? n.apply(null, [e]) : typeof n == "string" && typeof this.Reveal[n] == "function" && this.Reveal[n].call(), f = !0;
			}
		}
		if (f === !1) {
			for (u in this.bindings) if (parseInt(u, 10) === n) {
				let t = this.bindings[u].callback;
				typeof t == "function" ? t.apply(null, [e]) : typeof t == "string" && typeof this.Reveal[t] == "function" && this.Reveal[t].call(), f = !0;
			}
		}
		f === !1 && (f = !0, n === 80 || n === 33 ? this.Reveal.prev({ skipFragments: e.altKey }) : n === 78 || n === 34 ? this.Reveal.next({ skipFragments: e.altKey }) : n === 72 || n === 37 ? e.shiftKey ? this.Reveal.slide(0) : !this.Reveal.overview.isActive() && d ? t.rtl ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.left({ skipFragments: e.altKey }) : n === 76 || n === 39 ? e.shiftKey ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : !this.Reveal.overview.isActive() && d ? t.rtl ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.right({ skipFragments: e.altKey }) : n === 75 || n === 38 ? e.shiftKey ? this.Reveal.slide(void 0, 0) : !this.Reveal.overview.isActive() && d ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.up({ skipFragments: e.altKey }) : n === 74 || n === 40 ? e.shiftKey ? this.Reveal.slide(void 0, Number.MAX_VALUE) : !this.Reveal.overview.isActive() && d ? this.Reveal.next({ skipFragments: e.altKey }) : this.Reveal.down({ skipFragments: e.altKey }) : n === 36 ? this.Reveal.slide(0) : n === 35 ? this.Reveal.slide(this.Reveal.getHorizontalSlides().length - 1) : n === 32 ? (this.Reveal.overview.isActive() && this.Reveal.overview.deactivate(), e.shiftKey ? this.Reveal.prev({ skipFragments: e.altKey }) : this.Reveal.next({ skipFragments: e.altKey })) : [
			58,
			59,
			66,
			86,
			190
		].includes(n) || n === 191 && !e.shiftKey ? this.Reveal.togglePause() : n === 70 ? s(t.embedded ? this.Reveal.getViewportElement() : document.documentElement) : n === 65 ? t.autoSlideStoppable && this.Reveal.toggleAutoSlide(r) : n === 71 ? t.jumpToSlide && this.Reveal.toggleJumpToSlide() : n === 67 && this.Reveal.isOverlayOpen() ? this.Reveal.closeOverlay() : (n === 63 || n === 191) && e.shiftKey || n === 112 ? this.Reveal.toggleHelp() : f = !1), f ? e.preventDefault && e.preventDefault() : n === 27 || n === 79 ? (this.Reveal.closeOverlay() === !1 && this.Reveal.overview.toggle(), e.preventDefault && e.preventDefault()) : n === 13 && this.Reveal.overview.isActive() && (this.Reveal.overview.deactivate(), e.preventDefault && e.preventDefault()), this.Reveal.cueAutoSlide();
	}
};
//#endregion
//#region \0@oxc-project+runtime@0.124.0/helpers/objectSpread2.js
function N(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function P(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? N(Object(n), !0).forEach(function(t) {
			S(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : N(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
//#endregion
//#region js/controllers/location.js
var me = class {
	constructor(e) {
		S(this, "MAX_REPLACE_STATE_FREQUENCY", 1e3), this.Reveal = e, this.writeURLTimeout = 0, this.replaceStateTimestamp = 0, this.onWindowHashChange = this.onWindowHashChange.bind(this);
	}
	bind() {
		window.addEventListener("hashchange", this.onWindowHashChange, !1);
	}
	unbind() {
		window.removeEventListener("hashchange", this.onWindowHashChange, !1);
	}
	getIndicesFromHash(e = window.location.hash, t = {}) {
		let n = e.replace(/^#\/?/, ""), r = n.split("/");
		if (!/^[0-9]*$/.test(r[0]) && n.length) {
			let e, t;
			/\/[-\d]+$/g.test(n) && (t = parseInt(n.split("/").pop(), 10), t = isNaN(t) ? void 0 : t, n = n.split("/").shift());
			try {
				let t = decodeURIComponent(n);
				e = (document.getElementById(t) || document.querySelector(`[data-id="${t}"]`)).closest(".slides section");
			} catch (e) {}
			if (e) return P(P({}, this.Reveal.getIndices(e)), {}, { f: t });
		} else {
			let e = this.Reveal.getConfig(), n = e.hashOneBasedIndex || t.oneBasedIndex ? 1 : 0, i = parseInt(r[0], 10) - n || 0, a = parseInt(r[1], 10) - n || 0, o;
			return e.fragmentInURL && (o = parseInt(r[2], 10), isNaN(o) && (o = void 0)), {
				h: i,
				v: a,
				f: o
			};
		}
		return null;
	}
	readURL() {
		let e = this.Reveal.getIndices(), t = this.getIndicesFromHash();
		t ? (t.h !== e.h || t.v !== e.v || t.f !== void 0) && this.Reveal.slide(t.h, t.v, t.f) : this.Reveal.slide(e.h || 0, e.v || 0);
	}
	writeURL(e) {
		let t = this.Reveal.getConfig(), n = this.Reveal.getCurrentSlide();
		if (clearTimeout(this.writeURLTimeout), typeof e == "number") this.writeURLTimeout = setTimeout(this.writeURL, e);
		else if (n) {
			let e = this.getHash();
			t.history ? window.location.hash = e : t.hash && (e === "/" ? this.debouncedReplaceState(window.location.pathname + window.location.search) : this.debouncedReplaceState("#" + e));
		}
	}
	replaceState(e) {
		window.history.replaceState(null, null, e), this.replaceStateTimestamp = Date.now();
	}
	debouncedReplaceState(e) {
		clearTimeout(this.replaceStateTimeout), Date.now() - this.replaceStateTimestamp > this.MAX_REPLACE_STATE_FREQUENCY ? this.replaceState(e) : this.replaceStateTimeout = setTimeout(() => this.replaceState(e), this.MAX_REPLACE_STATE_FREQUENCY);
	}
	getHash(e) {
		let t = "/", n = e || this.Reveal.getCurrentSlide(), r = n ? n.getAttribute("id") : null;
		r && (r = encodeURIComponent(r));
		let i = this.Reveal.getIndices(e);
		if (this.Reveal.getConfig().fragmentInURL || (i.f = void 0), typeof r == "string" && r.length) t = "/" + r, i.f >= 0 && (t += "/" + i.f);
		else {
			let e = +!!this.Reveal.getConfig().hashOneBasedIndex;
			(i.h > 0 || i.v > 0 || i.f >= 0) && (t += i.h + e), (i.v > 0 || i.f >= 0) && (t += "/" + (i.v + e)), i.f >= 0 && (t += "/" + i.f);
		}
		return t;
	}
	onWindowHashChange(e) {
		this.readURL();
	}
}, he = class {
	constructor(e) {
		this.Reveal = e, this.onNavigateLeftClicked = this.onNavigateLeftClicked.bind(this), this.onNavigateRightClicked = this.onNavigateRightClicked.bind(this), this.onNavigateUpClicked = this.onNavigateUpClicked.bind(this), this.onNavigateDownClicked = this.onNavigateDownClicked.bind(this), this.onNavigatePrevClicked = this.onNavigatePrevClicked.bind(this), this.onNavigateNextClicked = this.onNavigateNextClicked.bind(this), this.onEnterFullscreen = this.onEnterFullscreen.bind(this);
	}
	render() {
		let e = this.Reveal.getConfig().rtl, n = this.Reveal.getRevealElement();
		this.element = document.createElement("aside"), this.element.className = "controls", this.element.innerHTML = `<button class="navigate-left" aria-label="${e ? "next slide" : "previous slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-right" aria-label="${e ? "previous slide" : "next slide"}"><div class="controls-arrow"></div></button>
			<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>
			<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`, this.Reveal.getRevealElement().appendChild(this.element), this.controlsLeft = t(n, ".navigate-left"), this.controlsRight = t(n, ".navigate-right"), this.controlsUp = t(n, ".navigate-up"), this.controlsDown = t(n, ".navigate-down"), this.controlsPrev = t(n, ".navigate-prev"), this.controlsNext = t(n, ".navigate-next"), this.controlsFullscreen = t(n, ".enter-fullscreen"), this.controlsRightArrow = this.element.querySelector(".navigate-right"), this.controlsLeftArrow = this.element.querySelector(".navigate-left"), this.controlsDownArrow = this.element.querySelector(".navigate-down");
	}
	configure(e, t) {
		let n = e.controls === "speaker" || e.controls === "speaker-only";
		this.element.style.display = e.controls && (!n || this.Reveal.isSpeakerNotes()) ? "block" : "none", this.element.setAttribute("data-controls-layout", e.controlsLayout), this.element.setAttribute("data-controls-back-arrows", e.controlsBackArrows);
	}
	bind() {
		let e = ["touchstart", "click"];
		_ && (e = ["touchend"]), e.forEach((e) => {
			this.controlsLeft.forEach((t) => t.addEventListener(e, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((t) => t.addEventListener(e, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((t) => t.addEventListener(e, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((t) => t.addEventListener(e, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((t) => t.addEventListener(e, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((t) => t.addEventListener(e, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((t) => t.addEventListener(e, this.onEnterFullscreen, !1));
		});
	}
	unbind() {
		[
			"touchstart",
			"touchend",
			"click"
		].forEach((e) => {
			this.controlsLeft.forEach((t) => t.removeEventListener(e, this.onNavigateLeftClicked, !1)), this.controlsRight.forEach((t) => t.removeEventListener(e, this.onNavigateRightClicked, !1)), this.controlsUp.forEach((t) => t.removeEventListener(e, this.onNavigateUpClicked, !1)), this.controlsDown.forEach((t) => t.removeEventListener(e, this.onNavigateDownClicked, !1)), this.controlsPrev.forEach((t) => t.removeEventListener(e, this.onNavigatePrevClicked, !1)), this.controlsNext.forEach((t) => t.removeEventListener(e, this.onNavigateNextClicked, !1)), this.controlsFullscreen.forEach((t) => t.removeEventListener(e, this.onEnterFullscreen, !1));
		});
	}
	update() {
		let e = this.Reveal.availableRoutes();
		[
			...this.controlsLeft,
			...this.controlsRight,
			...this.controlsUp,
			...this.controlsDown,
			...this.controlsPrev,
			...this.controlsNext
		].forEach((e) => {
			e.classList.remove("enabled", "fragmented"), e.setAttribute("disabled", "disabled");
		}), e.left && this.controlsLeft.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		}), e.right && this.controlsRight.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		}), e.up && this.controlsUp.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		}), e.down && this.controlsDown.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		}), (e.left || e.up) && this.controlsPrev.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		}), (e.right || e.down) && this.controlsNext.forEach((e) => {
			e.classList.add("enabled"), e.removeAttribute("disabled");
		});
		let t = this.Reveal.getCurrentSlide();
		if (t) {
			let e = this.Reveal.fragments.availableRoutes();
			e.prev && this.controlsPrev.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
			}), e.next && this.controlsNext.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
			});
			let n = this.Reveal.isVerticalSlide(t), r = n && t.parentElement && t.parentElement.querySelectorAll(":scope > section").length > 1;
			n && r ? (e.prev && this.controlsUp.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
			}), e.next && this.controlsDown.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
			})) : (e.prev && this.controlsLeft.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
			}), e.next && this.controlsRight.forEach((e) => {
				e.classList.add("fragmented", "enabled"), e.removeAttribute("disabled");
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
		let t = this.Reveal.getConfig(), n = this.Reveal.getViewportElement();
		s(t.embedded ? n : n.parentElement);
	}
}, ge = class {
	constructor(e) {
		this.Reveal = e, this.onProgressClicked = this.onProgressClicked.bind(this);
	}
	render() {
		this.element = document.createElement("div"), this.element.className = "progress", this.Reveal.getRevealElement().appendChild(this.element), this.bar = document.createElement("span"), this.element.appendChild(this.bar);
	}
	configure(e, t) {
		this.element.style.display = e.progress ? "block" : "none";
	}
	bind() {
		this.Reveal.getConfig().progress && this.element && this.element.addEventListener("click", this.onProgressClicked, !1);
	}
	unbind() {
		this.Reveal.getConfig().progress && this.element && this.element.removeEventListener("click", this.onProgressClicked, !1);
	}
	update() {
		if (this.Reveal.getConfig().progress && this.bar) {
			let e = this.Reveal.getProgress();
			this.Reveal.getTotalSlides() < 2 && (e = 0), this.bar.style.transform = "scaleX(" + e + ")";
		}
	}
	getMaxWidth() {
		return this.Reveal.getRevealElement().offsetWidth;
	}
	onProgressClicked(e) {
		this.Reveal.onUserInput(e), e.preventDefault();
		let t = this.Reveal.getSlides(), n = t.length, r = Math.floor(e.clientX / this.getMaxWidth() * n);
		this.Reveal.getConfig().rtl && (r = n - r);
		let i = this.Reveal.getIndices(t[r]);
		this.Reveal.slide(i.h, i.v);
	}
	destroy() {
		this.element.remove();
	}
}, _e = class {
	constructor(e) {
		this.Reveal = e, this.lastMouseWheelStep = 0, this.cursorHidden = !1, this.cursorInactiveTimeout = 0, this.onDocumentCursorActive = this.onDocumentCursorActive.bind(this), this.onDocumentMouseScroll = this.onDocumentMouseScroll.bind(this);
	}
	configure(e, t) {
		e.mouseWheel ? document.addEventListener("wheel", this.onDocumentMouseScroll, !1) : document.removeEventListener("wheel", this.onDocumentMouseScroll, !1), e.hideInactiveCursor ? (document.addEventListener("mousemove", this.onDocumentCursorActive, !1), document.addEventListener("mousedown", this.onDocumentCursorActive, !1)) : (this.showCursor(), document.removeEventListener("mousemove", this.onDocumentCursorActive, !1), document.removeEventListener("mousedown", this.onDocumentCursorActive, !1));
	}
	showCursor() {
		this.cursorHidden && (this.cursorHidden = !1, this.Reveal.getRevealElement().style.cursor = "");
	}
	hideCursor() {
		this.cursorHidden === !1 && (this.cursorHidden = !0, this.Reveal.getRevealElement().style.cursor = "none");
	}
	destroy() {
		this.showCursor(), document.removeEventListener("wheel", this.onDocumentMouseScroll, !1), document.removeEventListener("mousemove", this.onDocumentCursorActive, !1), document.removeEventListener("mousedown", this.onDocumentCursorActive, !1);
	}
	onDocumentCursorActive(e) {
		this.showCursor(), clearTimeout(this.cursorInactiveTimeout), this.cursorInactiveTimeout = setTimeout(this.hideCursor.bind(this), this.Reveal.getConfig().hideCursorTime);
	}
	onDocumentMouseScroll(e) {
		if (Date.now() - this.lastMouseWheelStep > 1e3) {
			this.lastMouseWheelStep = Date.now();
			let t = e.detail || -e.wheelDelta;
			t > 0 ? this.Reveal.next() : t < 0 && this.Reveal.prev();
		}
	}
}, ve = (e, t) => {
	let n = document.createElement("script");
	n.type = "text/javascript", n.async = !1, n.defer = !1, n.src = e, typeof t == "function" && (n.onload = (e) => {
		e.type === "load" && (n.onload = n.onerror = null, t());
	}, n.onerror = (e) => {
		n.onload = n.onerror = null, t(/* @__PURE__ */ Error("Failed loading script: " + n.src + "\n" + e));
	});
	let r = document.querySelector("head");
	r && r.insertBefore(n, r.lastChild);
}, ye = class {
	constructor(e) {
		this.Reveal = e, this.state = "idle", this.registeredPlugins = {}, this.asyncDependencies = [];
	}
	load(e, t) {
		return this.state = "loading", e.forEach(this.registerPlugin.bind(this)), new Promise((e) => {
			let n = [], r = 0;
			if (t.forEach((e) => {
				(!e.condition || e.condition()) && (e.async ? this.asyncDependencies.push(e) : n.push(e));
			}), n.length) {
				r = n.length;
				let t = (t) => {
					t && typeof t.callback == "function" && t.callback(), --r === 0 && this.initPlugins().then(e);
				};
				n.forEach((e) => {
					typeof e.id == "string" ? (this.registerPlugin(e), t(e)) : typeof e.src == "string" ? ve(e.src, () => t(e)) : (console.warn("Unrecognized plugin format", e), t());
				});
			} else this.initPlugins().then(e);
		});
	}
	initPlugins() {
		return new Promise((e) => {
			let t = Object.values(this.registeredPlugins), n = t.length;
			if (n === 0) this.loadAsync().then(e);
			else {
				let r, i = () => {
					--n === 0 ? this.loadAsync().then(e) : r();
				}, a = 0;
				r = () => {
					let e = t[a++];
					if (typeof e.init == "function") {
						let t = e.init(this.Reveal);
						t && typeof t.then == "function" ? t.then(i) : i();
					} else i();
				}, r();
			}
		});
	}
	loadAsync() {
		return this.state = "loaded", this.asyncDependencies.length && this.asyncDependencies.forEach((e) => {
			ve(e.src, e.callback);
		}), Promise.resolve();
	}
	registerPlugin(e) {
		arguments.length === 2 && typeof arguments[0] == "string" ? (e = arguments[1], e.id = arguments[0]) : typeof e == "function" && (e = e());
		let t = e.id;
		typeof t == "string" ? this.registeredPlugins[t] === void 0 ? (this.registeredPlugins[t] = e, this.state === "loaded" && typeof e.init == "function" && e.init(this.Reveal)) : console.warn("reveal.js: \"" + t + "\" plugin has already been registered") : console.warn("Unrecognized plugin format; can't find plugin.id", e);
	}
	hasPlugin(e) {
		return !!this.registeredPlugins[e];
	}
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
}, be = class {
	constructor(e) {
		this.Reveal = e, this.onSlidesClicked = this.onSlidesClicked.bind(this), this.iframeTriggerSelector = null, this.mediaTriggerSelector = "[data-preview-image], [data-preview-video]", this.stateProps = [
			"previewIframe",
			"previewImage",
			"previewVideo",
			"previewFit"
		], this.state = {};
	}
	update() {
		this.Reveal.getConfig().previewLinks ? this.iframeTriggerSelector = "a[href]:not([data-preview-link=false]), [data-preview-link]:not(a):not([data-preview-link=false])" : this.iframeTriggerSelector = "[data-preview-link]:not([data-preview-link=false])";
		let e = this.Reveal.getSlidesElement().querySelectorAll(this.iframeTriggerSelector).length > 0, t = this.Reveal.getSlidesElement().querySelectorAll(this.mediaTriggerSelector).length > 0;
		e || t ? this.Reveal.getSlidesElement().addEventListener("click", this.onSlidesClicked, !1) : this.Reveal.getSlidesElement().removeEventListener("click", this.onSlidesClicked, !1);
	}
	createOverlay(e) {
		this.dom = document.createElement("div"), this.dom.classList.add("r-overlay"), this.dom.classList.add(e), this.viewport = document.createElement("div"), this.viewport.classList.add("r-overlay-viewport"), this.dom.appendChild(this.viewport), this.Reveal.getRevealElement().appendChild(this.dom);
	}
	previewIframe(e) {
		this.close(), this.state = { previewIframe: e }, this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.viewport.innerHTML = `<header class="r-overlay-header">
				<a class="r-overlay-header-button r-overlay-external" href="${e}" target="_blank"><span class="icon"></span></a>
				<button class="r-overlay-header-button r-overlay-close"><span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content">
				<iframe src="${e}"></iframe>
				<small class="r-overlay-content-inner">
					<span class="r-overlay-error x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>
				</small>
			</div>`, this.dom.querySelector("iframe").addEventListener("load", (e) => {
			this.dom.dataset.state = "loaded";
		}, !1), this.dom.querySelector(".r-overlay-close").addEventListener("click", (e) => {
			this.close(), e.preventDefault();
		}, !1), this.dom.querySelector(".r-overlay-external").addEventListener("click", (e) => {
			this.close();
		}, !1), this.Reveal.dispatchEvent({
			type: "previewiframe",
			data: { url: e }
		});
	}
	previewMedia(e, t, n) {
		if (t !== "image" && t !== "video") {
			console.warn("Please specify a valid media type to preview (image|video)");
			return;
		}
		this.close(), n = n || "scale-down", this.createOverlay("r-overlay-preview"), this.dom.dataset.state = "loading", this.dom.dataset.previewFit = n, this.viewport.innerHTML = "<header class=\"r-overlay-header\">\n				<button class=\"r-overlay-header-button r-overlay-close\">Esc <span class=\"icon\"></span></button>\n			</header>\n			<div class=\"r-overlay-spinner\"></div>\n			<div class=\"r-overlay-content\"></div>";
		let r = this.dom.querySelector(".r-overlay-content");
		if (t === "image") {
			this.state = {
				previewImage: e,
				previewFit: n
			};
			let t = document.createElement("img", {});
			t.src = e, r.appendChild(t), t.addEventListener("load", () => {
				this.dom.dataset.state = "loaded";
			}, !1), t.addEventListener("error", () => {
				this.dom.dataset.state = "error", r.innerHTML = "<span class=\"r-overlay-error\">Unable to load image.</span>";
			}, !1), this.dom.style.cursor = "zoom-out", this.dom.addEventListener("click", (e) => {
				this.close();
			}, !1), this.Reveal.dispatchEvent({
				type: "previewimage",
				data: { url: e }
			});
		} else if (t === "video") {
			this.state = {
				previewVideo: e,
				previewFit: n
			};
			let t = document.createElement("video");
			t.autoplay = this.dom.dataset.previewAutoplay !== "false", t.controls = this.dom.dataset.previewControls !== "false", t.loop = this.dom.dataset.previewLoop === "true", t.muted = this.dom.dataset.previewMuted === "true", t.playsInline = !0, t.src = e, r.appendChild(t), t.addEventListener("loadeddata", () => {
				this.dom.dataset.state = "loaded";
			}, !1), t.addEventListener("error", () => {
				this.dom.dataset.state = "error", r.innerHTML = "<span class=\"r-overlay-error\">Unable to load video.</span>";
			}, !1), this.Reveal.dispatchEvent({
				type: "previewvideo",
				data: { url: e }
			});
		} else throw Error("Please specify a valid media type to preview");
		this.dom.querySelector(".r-overlay-close").addEventListener("click", (e) => {
			this.close(), e.preventDefault();
		}, !1);
	}
	previewImage(e, t) {
		this.previewMedia(e, "image", t);
	}
	previewVideo(e, t) {
		this.previewMedia(e, "video", t);
	}
	toggleHelp(e) {
		typeof e == "boolean" ? e ? this.showHelp() : this.close() : this.dom ? this.close() : this.showHelp();
	}
	showHelp() {
		if (this.Reveal.getConfig().help) {
			this.close(), this.createOverlay("r-overlay-help");
			let e = "<p class=\"title\">Keyboard Shortcuts</p>", t = this.Reveal.keyboard.getShortcuts(), n = this.Reveal.keyboard.getBindings();
			e += "<table><th>KEY</th><th>ACTION</th>";
			for (let n in t) e += `<tr><td>${n}</td><td>${t[n]}</td></tr>`;
			for (let t in n) n[t].key && n[t].description && (e += `<tr><td>${n[t].key}</td><td>${n[t].description}</td></tr>`);
			e += "</table>", this.viewport.innerHTML = `
				<header class="r-overlay-header">
					<button class="r-overlay-header-button r-overlay-close">Esc <span class="icon"></span></button>
				</header>
				<div class="r-overlay-content">
					<div class="r-overlay-help-content">${e}</div>
				</div>
			`, this.dom.querySelector(".r-overlay-close").addEventListener("click", (e) => {
				this.close(), e.preventDefault();
			}, !1), this.Reveal.dispatchEvent({ type: "showhelp" });
		}
	}
	isOpen() {
		return !!this.dom;
	}
	close() {
		return this.dom ? (this.dom.remove(), this.dom = null, this.state = {}, this.Reveal.dispatchEvent({ type: "closeoverlay" }), !0) : !1;
	}
	getState() {
		return this.state;
	}
	setState(e) {
		this.stateProps.every((t) => this.state[t] === e[t]) || (e.previewIframe ? this.previewIframe(e.previewIframe) : e.previewImage ? this.previewImage(e.previewImage, e.previewFit) : e.previewVideo ? this.previewVideo(e.previewVideo, e.previewFit) : this.close());
	}
	onSlidesClicked(e) {
		let t = e.target, n = t.closest(this.iframeTriggerSelector), r = t.closest(this.mediaTriggerSelector);
		if (n) {
			if (e.metaKey || e.shiftKey || e.altKey) return;
			let t = n.getAttribute("data-preview-link"), r = typeof t == "string" && t.startsWith("http") ? t : n.getAttribute("href");
			r && (this.previewIframe(r), e.preventDefault());
		} else if (r) {
			if (r.hasAttribute("data-preview-image")) {
				let t = r.dataset.previewImage || r.getAttribute("src");
				t && (this.previewImage(t, r.dataset.previewFit), e.preventDefault());
			} else if (r.hasAttribute("data-preview-video")) {
				let t = r.dataset.previewVideo || r.getAttribute("src");
				if (!t) {
					let e = r.querySelector("source");
					e && (t = e.getAttribute("src"));
				}
				t && (this.previewVideo(t, r.dataset.previewFit), e.preventDefault());
			}
		}
	}
	destroy() {
		this.close();
	}
}, F = 40, I = 1.03, xe = class {
	constructor(e) {
		this.Reveal = e, this.touchStartX = 0, this.touchStartY = 0, this.touchStartCount = 0, this.touchCaptured = !1, this.activePointers = /* @__PURE__ */ new Map(), this.onPointerDown = this.onPointerDown.bind(this), this.onPointerMove = this.onPointerMove.bind(this), this.onPointerUp = this.onPointerUp.bind(this), this.onPointerCancel = this.onPointerCancel.bind(this), this.onTouchStart = this.onTouchStart.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this);
	}
	bind() {
		let e = this.Reveal.getRevealElement();
		"onpointerdown" in window ? (e.addEventListener("pointerdown", this.onPointerDown, !1), e.addEventListener("pointermove", this.onPointerMove, !1), e.addEventListener("pointerup", this.onPointerUp, !1), e.addEventListener("pointercancel", this.onPointerCancel, !1)) : (e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1));
	}
	unbind() {
		let e = this.Reveal.getRevealElement();
		e.removeEventListener("pointerdown", this.onPointerDown, !1), e.removeEventListener("pointermove", this.onPointerMove, !1), e.removeEventListener("pointerup", this.onPointerUp, !1), e.removeEventListener("pointercancel", this.onPointerCancel, !1), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1);
	}
	isSwipePrevented(e) {
		if (a(e, "video[controls], audio[controls]")) return !0;
		for (; e && typeof e.hasAttribute == "function";) {
			if (e.hasAttribute("data-prevent-swipe")) return !0;
			e = e.parentNode;
		}
		return !1;
	}
	isViewportZoomed() {
		if (!window.visualViewport || typeof window.visualViewport.scale != "number") return !1;
		let e = window.visualViewport.scale;
		return this.visualViewportBaseScale === void 0 ? this.visualViewportBaseScale = e : this.visualViewportBaseScale = Math.min(this.visualViewportBaseScale, e), e / this.visualViewportBaseScale > I;
	}
	onTouchStart(e) {
		if (this.touchCaptured = !1, this.isSwipePrevented(e.target)) return !0;
		this.touchStartX = e.touches[0].clientX, this.touchStartY = e.touches[0].clientY, this.touchStartCount = e.touches.length;
	}
	onTouchMove(e) {
		if (this.isSwipePrevented(e.target)) return !0;
		let t = this.Reveal.getConfig();
		if (this.touchCaptured) _ && e.preventDefault();
		else {
			this.Reveal.onUserInput(e);
			let n = e.touches[0].clientX, r = e.touches[0].clientY;
			if (e.touches.length === 1 && this.touchStartCount !== 2) {
				let i = this.Reveal.availableRoutes({ includeFragments: !0 }), a = n - this.touchStartX, o = r - this.touchStartY;
				a > F && Math.abs(a) > Math.abs(o) ? (this.touchCaptured = !0, t.navigationMode === "linear" ? t.rtl ? this.Reveal.next() : this.Reveal.prev() : this.Reveal.left()) : a < -F && Math.abs(a) > Math.abs(o) ? (this.touchCaptured = !0, t.navigationMode === "linear" ? t.rtl ? this.Reveal.prev() : this.Reveal.next() : this.Reveal.right()) : o > F && i.up ? (this.touchCaptured = !0, t.navigationMode === "linear" ? this.Reveal.prev() : this.Reveal.up()) : o < -F && i.down && (this.touchCaptured = !0, t.navigationMode === "linear" ? this.Reveal.next() : this.Reveal.down()), t.embedded ? (this.touchCaptured || this.Reveal.isVerticalSlide()) && e.preventDefault() : e.preventDefault();
			}
		}
	}
	onTouchEnd(e) {
		this.touchCaptured && !this.Reveal.slideContent.isAllowedToPlayAudio() && this.Reveal.startEmbeddedContent(this.Reveal.getCurrentSlide()), this.touchCaptured = !1;
	}
	getActiveTouches() {
		return Array.from(this.activePointers.values(), (e) => ({
			clientX: e.clientX,
			clientY: e.clientY
		}));
	}
	onPointerDown(e) {
		e.pointerType === "touch" && (this.activePointers.set(e.pointerId, e), e.touches = this.getActiveTouches(), this.onTouchStart(e));
	}
	onPointerMove(e) {
		e.pointerType === "touch" && (this.activePointers.set(e.pointerId, e), e.touches = this.getActiveTouches(), this.onTouchMove(e));
	}
	onPointerUp(e) {
		e.pointerType === "touch" && (this.activePointers.delete(e.pointerId), e.touches = this.getActiveTouches(), this.onTouchEnd(e));
	}
	onPointerCancel(e) {
		e.pointerType === "touch" && (this.activePointers.delete(e.pointerId), e.touches = this.getActiveTouches(), this.onTouchEnd(e));
	}
}, L = "focus", R = "blur", Se = class {
	constructor(e) {
		this.Reveal = e, this.onRevealPointerDown = this.onRevealPointerDown.bind(this), this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
	}
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
		this.state !== L && (this.Reveal.getRevealElement().classList.add("focused"), document.addEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = L;
	}
	blur() {
		this.state !== R && (this.Reveal.getRevealElement().classList.remove("focused"), document.removeEventListener("pointerdown", this.onDocumentPointerDown, !1)), this.state = R;
	}
	isFocused() {
		return this.state === L;
	}
	destroy() {
		this.Reveal.getRevealElement().classList.remove("focused");
	}
	onRevealPointerDown(e) {
		this.focus();
	}
	onDocumentPointerDown(e) {
		let t = o(e.target, ".reveal");
		(!t || t !== this.Reveal.getRevealElement()) && this.blur();
	}
}, Ce = class {
	constructor(e) {
		this.Reveal = e;
	}
	render() {
		this.element = document.createElement("div"), this.element.className = "speaker-notes", this.element.setAttribute("data-prevent-swipe", ""), this.element.setAttribute("tabindex", "0"), this.Reveal.getRevealElement().appendChild(this.element);
	}
	configure(e, t) {
		e.showNotes && this.element.setAttribute("data-layout", typeof e.showNotes == "string" ? e.showNotes : "inline");
	}
	update() {
		this.Reveal.getConfig().showNotes && this.element && this.Reveal.getCurrentSlide() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() && (this.element.innerHTML = this.getSlideNotes() || "<span class=\"notes-placeholder\">No notes on this slide.</span>");
	}
	updateVisibility() {
		this.Reveal.getConfig().showNotes && this.hasNotes() && !this.Reveal.isScrollView() && !this.Reveal.isPrintView() ? this.Reveal.getRevealElement().classList.add("show-notes") : this.Reveal.getRevealElement().classList.remove("show-notes");
	}
	hasNotes() {
		return this.Reveal.getSlidesElement().querySelectorAll("[data-notes], aside.notes").length > 0;
	}
	isSpeakerNotesWindow() {
		return !!window.location.search.match(/receiver/gi);
	}
	getSlideNotes(e = this.Reveal.getCurrentSlide()) {
		if (e.hasAttribute("data-notes")) return e.getAttribute("data-notes");
		let t = e.querySelectorAll("aside.notes");
		return t ? Array.from(t).map((e) => e.innerHTML).join("\n") : null;
	}
	destroy() {
		this.element.remove();
	}
}, we = class {
	constructor(e, t) {
		this.diameter = 100, this.diameter2 = this.diameter / 2, this.thickness = 6, this.playing = !1, this.progress = 0, this.progressOffset = 1, this.container = e, this.progressCheck = t, this.canvas = document.createElement("canvas"), this.canvas.className = "playback", this.canvas.width = this.diameter, this.canvas.height = this.diameter, this.canvas.style.width = this.diameter2 + "px", this.canvas.style.height = this.diameter2 + "px", this.context = this.canvas.getContext("2d"), this.container.appendChild(this.canvas), this.render();
	}
	setPlaying(e) {
		let t = this.playing;
		this.playing = e, !t && this.playing ? this.animate() : this.render();
	}
	animate() {
		let e = this.progress;
		this.progress = this.progressCheck(), e > .8 && this.progress < .2 && (this.progressOffset = this.progress), this.render(), this.playing && requestAnimationFrame(this.animate.bind(this));
	}
	render() {
		let e = this.playing ? this.progress : 0, t = this.diameter2 - this.thickness, n = this.diameter2, r = this.diameter2;
		this.progressOffset += (1 - this.progressOffset) * .1;
		let i = -Math.PI / 2 + Math.PI * 2 * e, a = -Math.PI / 2 + this.progressOffset * (Math.PI * 2);
		this.context.save(), this.context.clearRect(0, 0, this.diameter, this.diameter), this.context.beginPath(), this.context.arc(n, r, t + 4, 0, Math.PI * 2, !1), this.context.fillStyle = "rgba( 0, 0, 0, 0.4 )", this.context.fill(), this.context.beginPath(), this.context.arc(n, r, t, 0, Math.PI * 2, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "rgba( 255, 255, 255, 0.2 )", this.context.stroke(), this.playing && (this.context.beginPath(), this.context.arc(n, r, t, a, i, !1), this.context.lineWidth = this.thickness, this.context.strokeStyle = "#fff", this.context.stroke()), this.context.translate(n - 28 / 2, r - 28 / 2), this.playing ? (this.context.fillStyle = "#fff", this.context.fillRect(0, 0, 28 / 2 - 4, 28), this.context.fillRect(18, 0, 28 / 2 - 4, 28)) : (this.context.beginPath(), this.context.translate(4, 0), this.context.moveTo(0, 0), this.context.lineTo(24, 28 / 2), this.context.lineTo(0, 28), this.context.fillStyle = "#fff", this.context.fill()), this.context.restore();
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
}, Te = {
	width: 960,
	height: 700,
	margin: .04,
	minScale: .2,
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
	pdfMaxPagesPerSlide: Infinity,
	pdfSeparateFragments: !0,
	pdfPageHeightOffset: -1,
	dependencies: [],
	plugins: []
}, Ee = "6.0.1";
//#endregion
//#region js/reveal.js
function z(a, s) {
	arguments.length < 2 && (s = arguments[0], a = document.querySelector(".reveal"));
	let l = {}, f = {}, p = !1, m = !1, h, _, v, y, b = {
		hasNavigatedHorizontally: !1,
		hasNavigatedVertically: !1
	}, x = [], S = 1, T = {
		layout: "",
		overview: ""
	}, D = {}, ie = "idle", O = 0, k, se = 0, ce = -1, A = !1, j = new ee(l), M = new ne(l), N = new re(l), ve = new oe(l), F = new ae(l), I = new le(l), L = new ue(l), R = new de(l), z = new fe(l), B = new pe(l), V = new me(l), H = new he(l), U = new ge(l), De = new _e(l), W = new ye(l), G = new be(l), K = new Se(l), Oe = new xe(l), q = new Ce(l);
	function ke(e) {
		if (!a) throw "Unable to find presentation root (<div class=\"reveal\">).";
		if (p) throw "Reveal.js has already been initialized.";
		if (p = !0, D.wrapper = a, D.slides = a.querySelector(".slides"), !D.slides) throw "Unable to find slides container (<div class=\"slides\">).";
		return f = P(P(P(P(P({}, Te), f), s), e), u()), /print-pdf/gi.test(window.location.search) && (f.view = "print"), Ae(), window.addEventListener("load", Y, !1), W.load(f.plugins, f.dependencies).then(je), new Promise((e) => l.on("ready", e));
	}
	function Ae() {
		f.embedded === !0 ? D.viewport = o(a, ".reveal-viewport") || a : (D.viewport = document.body, document.documentElement.classList.add("reveal-full-page")), D.viewport.classList.add("reveal-viewport");
	}
	function je() {
		p !== !1 && (m = !0, Ne(), Pe(), Ve(), ze(), Be(), vt(), He(), F.update(!0), Me(), V.readURL(), setTimeout(() => {
			D.slides.classList.remove("no-transition"), D.wrapper.classList.add("ready"), J({
				type: "ready",
				data: {
					indexh: h,
					indexv: _,
					currentSlide: y
				}
			});
		}, 1));
	}
	function Me() {
		let e = f.view === "print", t = f.view === "scroll" || f.view === "reader";
		(e || t) && (e ? We() : Oe.unbind(), D.viewport.classList.add("loading-scroll-mode"), e ? document.readyState === "complete" ? L.activate() : window.addEventListener("load", () => L.activate()) : I.activate());
	}
	function Ne() {
		f.showHiddenSlides || t(D.wrapper, "section[data-visibility=\"hidden\"]").forEach((e) => {
			let t = e.parentNode;
			t.childElementCount === 1 && /section/i.test(t.nodeName) ? t.remove() : e.remove();
		});
	}
	function Pe() {
		D.slides.classList.add("no-transition"), g ? D.wrapper.classList.add("no-hover") : D.wrapper.classList.remove("no-hover"), F.render(), M.render(), N.render(), H.render(), U.render(), q.render(), D.pauseOverlay = c(D.wrapper, "div", "pause-overlay", f.controls ? "<button class=\"resume-button\">Resume presentation</button>" : null), D.statusElement = Fe(), D.wrapper.setAttribute("role", "application");
	}
	function Fe() {
		let e = D.wrapper.querySelector(".aria-status");
		return e || (e = document.createElement("div"), e.style.position = "absolute", e.style.height = "1px", e.style.width = "1px", e.style.overflow = "hidden", e.style.clip = "rect( 1px, 1px, 1px, 1px )", e.classList.add("aria-status"), e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), D.wrapper.appendChild(e)), e;
	}
	function Ie(e) {
		D.statusElement.textContent = e;
	}
	function Le(e) {
		let t = "";
		if (e.nodeType === 3) t += e.textContent.trim();
		else if (e.nodeType === 1) {
			let n = e.getAttribute("aria-hidden"), r = window.getComputedStyle(e).display === "none";
			if (n !== "true" && !r) {
				if (e.tagName === "IMG" || e.tagName === "VIDEO") {
					let n = e.getAttribute("alt");
					n && (t += Re(n));
				}
				Array.from(e.childNodes).forEach((e) => {
					t += Le(e);
				}), [
					"P",
					"DIV",
					"UL",
					"OL",
					"LI",
					"H1",
					"H2",
					"H3",
					"H4",
					"H5",
					"H6",
					"BLOCKQUOTE"
				].includes(e.tagName) && t.trim() !== "" && (t = Re(t));
			}
		}
		return t = t.trim(), t === "" ? "" : t + " ";
	}
	function Re(e) {
		let t = e.trim();
		return t === "" ? e : /[.!?]$/.test(t) ? t : t + ".";
	}
	function ze() {
		setInterval(() => {
			(!I.isActive() && D.wrapper.scrollTop !== 0 || D.wrapper.scrollLeft !== 0) && (D.wrapper.scrollTop = 0, D.wrapper.scrollLeft = 0);
		}, 1e3);
	}
	function Be() {
		document.addEventListener("fullscreenchange", $t), document.addEventListener("webkitfullscreenchange", $t);
	}
	function Ve() {
		f.postMessage && window.addEventListener("message", Jt, !1);
	}
	function He(t) {
		let r = P({}, f);
		if (typeof t == "object" && e(f, t), l.isReady() === !1) return;
		let i = D.wrapper.querySelectorAll(C).length;
		D.wrapper.classList.remove(r.transition), D.wrapper.classList.add(f.transition), D.wrapper.setAttribute("data-transition-speed", f.transitionSpeed), D.wrapper.setAttribute("data-background-transition", f.backgroundTransition), D.viewport.style.setProperty("--slide-width", typeof f.width == "string" ? f.width : f.width + "px"), D.viewport.style.setProperty("--slide-height", typeof f.height == "string" ? f.height : f.height + "px"), f.shuffle && yt(), n(D.wrapper, "embedded", f.embedded), n(D.wrapper, "rtl", f.rtl), n(D.wrapper, "center", f.center), f.pause === !1 && ct(), ve.reset(), k && (k.destroy(), k = null), i > 1 && f.autoSlide && f.autoSlideStoppable && (k = new we(D.wrapper, () => Math.min(Math.max((Date.now() - ce) / O, 0), 1)), k.on("click", en), A = !1), f.navigationMode === "default" ? D.wrapper.removeAttribute("data-navigation-mode") : D.wrapper.setAttribute("data-navigation-mode", f.navigationMode), q.configure(f, r), K.configure(f, r), De.configure(f, r), H.configure(f, r), U.configure(f, r), B.configure(f, r), R.configure(f, r), M.configure(f, r), gt();
	}
	function Ue() {
		window.addEventListener("resize", Zt, !1), f.touch && Oe.bind(), f.keyboard && B.bind(), f.progress && U.bind(), f.respondToHashChanges && V.bind(), H.bind(), K.bind(), D.slides.addEventListener("click", Xt, !1), D.slides.addEventListener("transitionend", Yt, !1), D.pauseOverlay.addEventListener("click", ct, !1), f.focusBodyOnPageVisibilityChange && document.addEventListener("visibilitychange", Qt, !1);
	}
	function We() {
		Oe.unbind(), K.unbind(), B.unbind(), H.unbind(), U.unbind(), V.unbind(), window.removeEventListener("resize", Zt, !1), D.slides.removeEventListener("click", Xt, !1), D.slides.removeEventListener("transitionend", Yt, !1), D.pauseOverlay.removeEventListener("click", ct, !1);
	}
	function Ge() {
		p = !1, m !== !1 && (We(), Rt(), q.destroy(), K.destroy(), G.destroy(), W.destroy(), De.destroy(), H.destroy(), U.destroy(), F.destroy(), M.destroy(), N.destroy(), document.removeEventListener("fullscreenchange", $t), document.removeEventListener("webkitfullscreenchange", $t), document.removeEventListener("visibilitychange", Qt, !1), window.removeEventListener("message", Jt, !1), window.removeEventListener("load", Y, !1), D.pauseOverlay && D.pauseOverlay.remove(), D.statusElement && D.statusElement.remove(), document.documentElement.classList.remove("reveal-full-page"), D.wrapper.classList.remove("ready", "center", "has-horizontal-slides", "has-vertical-slides"), D.wrapper.removeAttribute("data-transition-speed"), D.wrapper.removeAttribute("data-background-transition"), D.viewport.classList.remove("reveal-viewport"), D.viewport.style.removeProperty("--slide-width"), D.viewport.style.removeProperty("--slide-height"), D.slides.style.removeProperty("width"), D.slides.style.removeProperty("height"), D.slides.style.removeProperty("zoom"), D.slides.style.removeProperty("left"), D.slides.style.removeProperty("top"), D.slides.style.removeProperty("bottom"), D.slides.style.removeProperty("right"), D.slides.style.removeProperty("transform"), Array.from(D.wrapper.querySelectorAll(C)).forEach((e) => {
			e.style.removeProperty("display"), e.style.removeProperty("top"), e.removeAttribute("hidden"), e.removeAttribute("aria-hidden"), e.removeAttribute("inert");
		}));
	}
	function Ke(e, t, n) {
		a.addEventListener(e, t, n);
	}
	function qe(e, t, n) {
		a.removeEventListener(e, t, n);
	}
	function Je(e) {
		typeof e.layout == "string" && (T.layout = e.layout), typeof e.overview == "string" && (T.overview = e.overview), T.layout ? i(D.slides, T.layout + " " + T.overview) : i(D.slides, T.overview);
	}
	function J({ target: t = D.wrapper, type: n, data: r, bubbles: i = !0 }) {
		let a = document.createEvent("HTMLEvents", 1, 2);
		return a.initEvent(n, i, !0), e(a, r), t.dispatchEvent(a), t === D.wrapper && Xe(n), a;
	}
	function Ye(e) {
		J({
			type: "slidechanged",
			data: {
				indexh: h,
				indexv: _,
				previousSlide: v,
				currentSlide: y,
				origin: e
			}
		});
	}
	function Xe(t, n) {
		if (f.postMessageEvents && window.parent !== window.self) {
			let r = {
				namespace: "reveal",
				eventName: t,
				state: It()
			};
			e(r, n), window.parent.postMessage(JSON.stringify(r), "*");
		}
	}
	function Y() {
		if (D.wrapper && !L.isActive()) {
			let e = D.viewport.offsetWidth, t = D.viewport.offsetHeight;
			if (!f.disableLayout) {
				g && !f.embedded && document.documentElement.style.setProperty("--vh", window.innerHeight * .01 + "px");
				let n = I.isActive() ? $e(e, t) : $e(), r = S;
				Ze(f.width, f.height), D.slides.style.width = n.width + "px", D.slides.style.height = n.height + "px", S = Math.min(n.presentationWidth / n.width, n.presentationHeight / n.height), S = Math.max(S, f.minScale), S = Math.min(S, f.maxScale), S = Math.round(S * 100) / 100, S === 1 || I.isActive() ? (D.slides.style.zoom = "", D.slides.style.left = "", D.slides.style.top = "", D.slides.style.bottom = "", D.slides.style.right = "", Je({ layout: "" })) : (D.slides.style.zoom = "", D.slides.style.left = "50%", D.slides.style.top = "50%", D.slides.style.bottom = "auto", D.slides.style.right = "auto", Je({ layout: "translate(-50%, -50%) scale(" + S + ")" }));
				let i = Array.from(D.wrapper.querySelectorAll(C)).filter((e) => e.style.display !== "none"), a = Array(i.length);
				for (let e = 0, t = i.length; e < t; e++) {
					let t = i[e];
					f.center || t.classList.contains("center") ? t.classList.contains("stack") ? a[e] = 0 : a[e] = Math.max((n.height - t.scrollHeight) / 2, 0) + "px" : a[e] = "";
				}
				for (let e = 0, t = i.length; e < t; e++) i[e].style.top = a[e];
				r !== S && J({
					type: "resize",
					data: {
						oldScale: r,
						scale: S,
						size: n
					}
				});
			}
			Qe(), D.viewport.style.setProperty("--slide-scale", S), D.viewport.style.setProperty("--viewport-width", e + "px"), D.viewport.style.setProperty("--viewport-height", t + "px"), I.layout(), U.update(), F.updateParallax(), z.isActive() && z.update();
		}
	}
	function Ze(e, n) {
		t(D.slides, "section > .stretch, section > .r-stretch").forEach((t) => {
			let r = d(t, n);
			if (/(img|video)/gi.test(t.nodeName)) {
				let n = t.naturalWidth || t.videoWidth, i = t.naturalHeight || t.videoHeight, a = Math.min(e / n, r / i);
				t.style.width = n * a + "px", t.style.height = i * a + "px";
			} else t.style.width = e + "px", t.style.height = r + "px";
		});
	}
	function Qe() {
		if (D.wrapper && !f.disableLayout && !L.isActive() && typeof f.scrollActivationWidth == "number" && f.view !== "scroll") {
			let e = $e();
			e.presentationWidth > 0 && e.presentationWidth <= f.scrollActivationWidth ? I.isActive() || (F.create(), I.activate()) : I.isActive() && I.deactivate();
		}
	}
	function $e(e, t) {
		let n = f.width, r = f.height;
		f.disableLayout && (n = D.slides.offsetWidth, r = D.slides.offsetHeight);
		let i = {
			width: n,
			height: r,
			presentationWidth: e || D.wrapper.offsetWidth,
			presentationHeight: t || D.wrapper.offsetHeight
		};
		return i.presentationWidth -= i.presentationWidth * f.margin, i.presentationHeight -= i.presentationHeight * f.margin, typeof i.width == "string" && /%$/.test(i.width) && (i.width = parseInt(i.width, 10) / 100 * i.presentationWidth), typeof i.height == "string" && /%$/.test(i.height) && (i.height = parseInt(i.height, 10) / 100 * i.presentationHeight), i;
	}
	function et(e, t) {
		typeof e == "object" && typeof e.setAttribute == "function" && e.setAttribute("data-previous-indexv", t || 0);
	}
	function tt(e) {
		if (typeof e == "object" && typeof e.setAttribute == "function" && e.classList.contains("stack")) {
			let t = e.hasAttribute("data-start-indexv") ? "data-start-indexv" : "data-previous-indexv";
			return parseInt(e.getAttribute(t) || 0, 10);
		}
		return 0;
	}
	function nt(e = y) {
		return e && e.parentNode && !!e.parentNode.nodeName.match(/section/i);
	}
	function rt(e = y) {
		return e.classList.contains(".stack") || e.querySelector("section") !== null;
	}
	function it() {
		return y && nt(y) ? !y.nextElementSibling : !1;
	}
	function at() {
		return h === 0 && _ === 0;
	}
	function ot() {
		return y ? !(y.nextElementSibling || nt(y) && y.parentNode.nextElementSibling) : !1;
	}
	function st() {
		if (f.pause) {
			let e = D.wrapper.classList.contains("paused");
			Rt(), D.wrapper.classList.add("paused"), e === !1 && J({ type: "paused" });
		}
	}
	function ct() {
		let e = D.wrapper.classList.contains("paused");
		D.wrapper.classList.remove("paused"), $(), e && J({ type: "resumed" });
	}
	function lt(e) {
		typeof e == "boolean" ? e ? st() : ct() : ut() ? ct() : st();
	}
	function ut() {
		return D.wrapper.classList.contains("paused");
	}
	function dt(e) {
		typeof e == "boolean" ? e ? N.show() : N.hide() : N.isVisible() ? N.hide() : N.show();
	}
	function ft(e) {
		typeof e == "boolean" ? e ? Bt() : zt() : A ? Bt() : zt();
	}
	function pt() {
		return !!(O && !A);
	}
	function X(e, t, n, r) {
		if (J({
			type: "beforeslidechange",
			data: {
				indexh: e === void 0 ? h : e,
				indexv: t === void 0 ? _ : t,
				origin: r
			}
		}).defaultPrevented) return;
		v = y;
		let i = D.wrapper.querySelectorAll(w);
		if (I.isActive()) {
			let n = I.getSlideByIndices(e, t);
			n && I.scrollToSlide(n);
			return;
		}
		if (i.length === 0) return;
		t === void 0 && !z.isActive() && (t = tt(i[e])), v && v.parentNode && v.parentNode.classList.contains("stack") && et(v.parentNode, _);
		let o = x.concat();
		x.length = 0;
		let s = h || 0, c = _ || 0;
		h = bt(w, e === void 0 ? h : e), _ = bt(te, t === void 0 ? _ : t);
		let l = h !== s || _ !== c;
		l || (v = null);
		let u = i[h], d = u.querySelectorAll("section");
		a.classList.toggle("is-vertical-slide", d.length > 1), y = d[_] || u;
		let p = !1;
		l && v && y && !z.isActive() && (ie = "running", p = mt(v, y, s, c), p && D.slides.classList.add("disable-slide-transitions")), Ct(), Y(), z.isActive() && z.update(), n !== void 0 && R.goto(n), v && v !== y && (v.classList.remove("present"), v.setAttribute("aria-hidden", "true"), at() && setTimeout(() => {
			kt().forEach((e) => {
				et(e, 0);
			});
		}, 0));
		stateLoop: for (let e = 0, t = x.length; e < t; e++) {
			for (let t = 0; t < o.length; t++) if (o[t] === x[e]) {
				o.splice(t, 1);
				continue stateLoop;
			}
			D.viewport.classList.add(x[e]), J({ type: x[e] });
		}
		for (; o.length;) D.viewport.classList.remove(o.pop());
		l && (j.afterSlideChanged(), Ye(r)), (l || !v) && (j.stopEmbeddedContent(v), j.startEmbeddedContent(y)), requestAnimationFrame(() => {
			Ie(Le(y));
		}), U.update(), H.update(), q.update(), F.update(), F.updateParallax(), M.update(), R.update(), V.writeURL(), $(), p && (setTimeout(() => {
			D.slides.classList.remove("disable-slide-transitions");
		}, 0), f.autoAnimate && ve.run(v, y));
	}
	function mt(e, t, n, r) {
		return e.hasAttribute("data-auto-animate") && t.hasAttribute("data-auto-animate") && e.getAttribute("data-auto-animate-id") === t.getAttribute("data-auto-animate-id") && !(h > n || _ > r ? t : e).hasAttribute("data-auto-animate-restart");
	}
	function ht(e, t, n) {
		let r = h || 0;
		h = t, _ = n;
		let i = y !== e;
		v = y, y = e, y && v && f.autoAnimate && mt(v, y, r, _) && ve.run(v, y), i && (j.afterSlideChanged(), v && (j.stopEmbeddedContent(v), j.stopEmbeddedContent(v.slideBackgroundElement)), j.startEmbeddedContent(y), j.startEmbeddedContent(y.slideBackgroundElement)), requestAnimationFrame(() => {
			Ie(Le(y));
		}), Ye();
	}
	function gt() {
		We(), Ue(), Y(), O = f.autoSlide, $(), F.create(), V.writeURL(), f.sortFragmentsOnSync === !0 && R.sortAll(), h !== void 0 && (h = bt(w, h), _ = bt(te, _)), H.update(), U.update(), Ct(), q.update(), q.updateVisibility(), G.update(), F.update(!0), M.update(), j.formatEmbeddedContent(), f.autoPlayMedia === !1 ? j.stopEmbeddedContent(y, { unloadIframes: !1 }) : j.startEmbeddedContent(y), z.isActive() && z.layout(), J({ type: "sync" });
	}
	function _t(e = y) {
		F.sync(e), R.sync(e), j.load(e), F.update(), q.update(), J({
			type: "slidesync",
			data: { slide: e }
		});
	}
	function vt() {
		Q().forEach((e) => {
			t(e, "section").forEach((e, t) => {
				t > 0 && (e.classList.remove("present"), e.classList.remove("past"), e.classList.add("future"), e.setAttribute("aria-hidden", "true"));
			});
		});
	}
	function yt(e = Q()) {
		e.forEach((t, n) => {
			let r = e[Math.floor(Math.random() * e.length)];
			r.parentNode === t.parentNode && t.parentNode.insertBefore(t, r);
			let i = t.querySelectorAll("section");
			i.length && yt(i);
		});
	}
	function bt(e, n) {
		let r = t(D.wrapper, e), i = r.length, a = I.isActive() || L.isActive(), o = !1, s = !1;
		if (i) {
			f.loop && (n >= i && (o = !0), n %= i, n < 0 && (n = i + n, s = !0)), n = Math.max(Math.min(n, i - 1), 0);
			for (let e = 0; e < i; e++) {
				let t = r[e], i = f.rtl && !nt(t);
				if (t.classList.remove("past"), t.classList.remove("present"), t.classList.remove("future"), t.setAttribute("hidden", ""), t.setAttribute("aria-hidden", "true"), t.querySelector("section") && t.classList.add("stack"), a) {
					t.classList.add("present");
					continue;
				}
				e < n ? (t.classList.add(i ? "future" : "past"), f.fragments && xt(t)) : e > n ? (t.classList.add(i ? "past" : "future"), f.fragments && St(t)) : e === n && f.fragments && (o ? St(t) : s && xt(t));
			}
			let e = r[n], t = e.classList.contains("present");
			e.classList.add("present"), e.removeAttribute("hidden"), e.removeAttribute("aria-hidden"), t || J({
				target: e,
				type: "visible",
				bubbles: !1
			});
			let c = e.getAttribute("data-state");
			c && (x = x.concat(c.split(" ")));
		} else n = 0;
		return n;
	}
	function xt(e) {
		t(e, ".fragment").forEach((e) => {
			e.classList.add("visible"), e.classList.remove("current-fragment");
		});
	}
	function St(e) {
		t(e, ".fragment.visible").forEach((e) => {
			e.classList.remove("visible", "current-fragment");
		});
	}
	function Ct() {
		let e = Q(), n = e.length, r, i;
		if (n && h !== void 0) {
			let a = z.isActive(), o = a ? 10 : f.viewDistance;
			g && (o = a ? 6 : f.mobileViewDistance), L.isActive() && (o = Number.MAX_VALUE);
			for (let s = 0; s < n; s++) {
				let c = e[s], l = t(c, "section"), u = l.length;
				if (r = Math.abs((h || 0) - s) || 0, f.loop && (r = Math.abs(((h || 0) - s) % (n - o)) || 0), r < o ? j.load(c) : j.unload(c), u) {
					let e = a ? 0 : tt(c);
					for (let t = 0; t < u; t++) {
						let n = l[t];
						i = Math.abs(s === (h || 0) ? (_ || 0) - t : t - e), r + i < o ? j.load(n) : j.unload(n);
					}
				}
			}
			jt() ? D.wrapper.classList.add("has-vertical-slides") : D.wrapper.classList.remove("has-vertical-slides"), At() ? D.wrapper.classList.add("has-horizontal-slides") : D.wrapper.classList.remove("has-horizontal-slides");
		}
		let a = z.isActive() || I.isActive() || L.isActive();
		t(D.wrapper, C).forEach((e) => {
			e.toggleAttribute("inert", !a && e !== y && !e.contains(y));
		});
	}
	function Z({ includeFragments: e = !1 } = {}) {
		let t = D.wrapper.querySelectorAll(w), n = D.wrapper.querySelectorAll(te), r = {
			left: h > 0,
			right: h < t.length - 1,
			up: _ > 0,
			down: _ < n.length - 1
		};
		if (f.loop && (t.length > 1 && (r.left = !0, r.right = !0), n.length > 1 && (r.up = !0, r.down = !0)), t.length > 1 && f.navigationMode === "linear" && (r.right = r.right || r.down, r.left = r.left || r.up), e === !0) {
			let e = R.availableRoutes();
			r.left = r.left || e.prev, r.up = r.up || e.prev, r.down = r.down || e.next, r.right = r.right || e.next;
		}
		if (f.rtl) {
			let e = r.left;
			r.left = r.right, r.right = e;
		}
		return r;
	}
	function wt(e = y) {
		let t = Q(), n = 0;
		mainLoop: for (let r = 0; r < t.length; r++) {
			let i = t[r], a = i.querySelectorAll("section");
			for (let t = 0; t < a.length; t++) {
				if (a[t] === e) break mainLoop;
				a[t].dataset.visibility !== "uncounted" && n++;
			}
			if (i === e) break;
			i.classList.contains("stack") === !1 && i.dataset.visibility !== "uncounted" && n++;
		}
		return n;
	}
	function Tt() {
		let e = Nt(), t = wt();
		if (y) {
			let e = y.querySelectorAll(".fragment");
			if (e.length > 0) {
				let n = y.querySelectorAll(".fragment.visible");
				t += n.length / e.length * .9;
			}
		}
		return Math.min(t / (e - 1), 1);
	}
	function Et(e) {
		let n = h, r = _, i;
		if (e) if (I.isActive()) n = parseInt(e.getAttribute("data-index-h"), 10), e.getAttribute("data-index-v") && (r = parseInt(e.getAttribute("data-index-v"), 10));
		else {
			let i = nt(e), a = i ? e.parentNode : e, o = Q();
			n = Math.max(o.indexOf(a), 0), r = void 0, i && (r = Math.max(t(e.parentNode, "section").indexOf(e), 0));
		}
		if (!e && y && y.querySelectorAll(".fragment").length > 0) {
			let e = y.querySelector(".current-fragment");
			i = e && e.hasAttribute("data-fragment-index") ? parseInt(e.getAttribute("data-fragment-index"), 10) : y.querySelectorAll(".fragment.visible").length - 1;
		}
		return {
			h: n,
			v: r,
			f: i
		};
	}
	function Dt() {
		return t(D.wrapper, C + ":not(.stack):not([data-visibility=\"uncounted\"])");
	}
	function Q() {
		return t(D.wrapper, w);
	}
	function Ot() {
		return t(D.wrapper, ".slides>section>section");
	}
	function kt() {
		return t(D.wrapper, w + ".stack");
	}
	function At() {
		return Q().length > 1;
	}
	function jt() {
		return Ot().length > 1;
	}
	function Mt() {
		return Dt().map((e) => {
			let t = {};
			for (let n = 0; n < e.attributes.length; n++) {
				let r = e.attributes[n];
				t[r.name] = r.value;
			}
			return t;
		});
	}
	function Nt() {
		return Dt().length;
	}
	function Pt(e, t) {
		let n = Q()[e], r = n && n.querySelectorAll("section");
		return r && r.length && typeof t == "number" ? r ? r[t] : void 0 : n;
	}
	function Ft(e, t) {
		let n = typeof e == "number" ? Pt(e, t) : e;
		if (n) return n.slideBackgroundElement;
	}
	function It() {
		let e = Et();
		return P({
			indexh: e.h,
			indexv: e.v,
			indexf: e.f,
			paused: ut(),
			overview: z.isActive()
		}, G.getState());
	}
	function Lt(e) {
		if (typeof e == "object") {
			X(r(e.indexh), r(e.indexv), r(e.indexf));
			let t = r(e.paused), n = r(e.overview);
			typeof t == "boolean" && t !== ut() && lt(t), typeof n == "boolean" && n !== z.isActive() && z.toggle(n), G.setState(e);
		}
	}
	function $() {
		if (Rt(), y && f.autoSlide !== !1) {
			let e = y.querySelector(".current-fragment[data-autoslide]"), n = e ? e.getAttribute("data-autoslide") : null, r = y.parentNode ? y.parentNode.getAttribute("data-autoslide") : null, i = y.getAttribute("data-autoslide");
			n ? O = parseInt(n, 10) : i ? O = parseInt(i, 10) : r ? O = parseInt(r, 10) : (O = f.autoSlide, y.querySelectorAll(".fragment").length === 0 && t(y, "video, audio").forEach((e) => {
				e.hasAttribute("data-autoplay") && O && e.duration * 1e3 / e.playbackRate > O && (O = e.duration * 1e3 / e.playbackRate + 1e3);
			})), O && !A && !ut() && !z.isActive() && (!ot() || R.availableRoutes().next || f.loop === !0) && (se = setTimeout(() => {
				typeof f.autoSlideMethod == "function" ? f.autoSlideMethod() : Kt(), $();
			}, O), ce = Date.now()), k && k.setPlaying(se !== -1);
		}
	}
	function Rt() {
		clearTimeout(se), se = -1;
	}
	function zt() {
		O && !A && (A = !0, J({ type: "autoslidepaused" }), clearTimeout(se), k && k.setPlaying(!1));
	}
	function Bt() {
		O && A && (A = !1, J({ type: "autoslideresumed" }), $());
	}
	function Vt({ skipFragments: e = !1 } = {}) {
		if (b.hasNavigatedHorizontally = !0, I.isActive()) return I.prev();
		f.rtl ? (z.isActive() || e || R.next() === !1) && Z().left && X(h + 1, f.navigationMode === "grid" ? _ : void 0) : (z.isActive() || e || R.prev() === !1) && Z().left && X(h - 1, f.navigationMode === "grid" ? _ : void 0);
	}
	function Ht({ skipFragments: e = !1 } = {}) {
		if (b.hasNavigatedHorizontally = !0, I.isActive()) return I.next();
		f.rtl ? (z.isActive() || e || R.prev() === !1) && Z().right && X(h - 1, f.navigationMode === "grid" ? _ : void 0) : (z.isActive() || e || R.next() === !1) && Z().right && X(h + 1, f.navigationMode === "grid" ? _ : void 0);
	}
	function Ut({ skipFragments: e = !1 } = {}) {
		if (I.isActive()) return I.prev();
		(z.isActive() || e || R.prev() === !1) && Z().up && X(h, _ - 1);
	}
	function Wt({ skipFragments: e = !1 } = {}) {
		if (b.hasNavigatedVertically = !0, I.isActive()) return I.next();
		(z.isActive() || e || R.next() === !1) && Z().down && X(h, _ + 1);
	}
	function Gt({ skipFragments: e = !1 } = {}) {
		if (I.isActive()) return I.prev();
		if (e || R.prev() === !1) if (Z().up) Ut({ skipFragments: e });
		else {
			let n;
			if (n = f.rtl ? t(D.wrapper, w + ".future").pop() : t(D.wrapper, w + ".past").pop(), n && n.classList.contains("stack")) {
				let e = n.querySelectorAll("section").length - 1 || void 0;
				X(h - 1, e);
			} else f.rtl ? Ht({ skipFragments: e }) : Vt({ skipFragments: e });
		}
	}
	function Kt({ skipFragments: e = !1 } = {}) {
		if (b.hasNavigatedHorizontally = !0, b.hasNavigatedVertically = !0, I.isActive()) return I.next();
		if (e || R.next() === !1) {
			let t = Z();
			t.down && t.right && f.loop && it() && (t.down = !1), t.down ? Wt({ skipFragments: e }) : f.rtl ? Vt({ skipFragments: e }) : Ht({ skipFragments: e });
		}
	}
	function qt(e) {
		f.autoSlideStoppable && zt();
	}
	function Jt(e) {
		let t = e.data;
		if (typeof t == "string" && t.charAt(0) === "{" && t.charAt(t.length - 1) === "}" && (t = JSON.parse(t), t.method && typeof l[t.method] == "function")) if (E.test(t.method) === !1) {
			let e = l[t.method].apply(l, t.args);
			Xe("callback", {
				method: t.method,
				result: e
			});
		} else console.warn("reveal.js: \"" + t.method + "\" is is blacklisted from the postMessage API");
	}
	function Yt(e) {
		ie === "running" && /section/gi.test(e.target.nodeName) && (ie = "idle", J({
			type: "slidetransitionend",
			data: {
				indexh: h,
				indexv: _,
				previousSlide: v,
				currentSlide: y
			}
		}));
	}
	function Xt(e) {
		let t = o(e.target, "a[href^=\"#\"]");
		if (t) {
			let n = t.getAttribute("href"), r = V.getIndicesFromHash(n);
			r && (l.slide(r.h, r.v, r.f), e.preventDefault());
		}
	}
	function Zt(e) {
		Y();
	}
	function Qt(e) {
		document.hidden === !1 && document.activeElement !== document.body && (typeof document.activeElement.blur == "function" && document.activeElement.blur(), document.body.focus());
	}
	function $t(e) {
		(document.fullscreenElement || document.webkitFullscreenElement) === D.wrapper && (e.stopImmediatePropagation(), setTimeout(() => {
			l.layout(), l.focus.focus();
		}, 1));
	}
	function en(e) {
		ot() && f.loop === !1 ? (X(0, 0), Bt()) : A ? Bt() : zt();
	}
	let tn = {
		VERSION: Ee,
		initialize: ke,
		configure: He,
		destroy: Ge,
		sync: gt,
		syncSlide: _t,
		syncFragments: R.sync.bind(R),
		slide: X,
		left: Vt,
		right: Ht,
		up: Ut,
		down: Wt,
		prev: Gt,
		next: Kt,
		navigateLeft: Vt,
		navigateRight: Ht,
		navigateUp: Ut,
		navigateDown: Wt,
		navigatePrev: Gt,
		navigateNext: Kt,
		navigateFragment: R.goto.bind(R),
		prevFragment: R.prev.bind(R),
		nextFragment: R.next.bind(R),
		on: Ke,
		off: qe,
		addEventListener: Ke,
		removeEventListener: qe,
		layout: Y,
		shuffle: yt,
		availableRoutes: Z,
		availableFragments: R.availableRoutes.bind(R),
		toggleHelp: G.toggleHelp.bind(G),
		toggleOverview: z.toggle.bind(z),
		toggleScrollView: I.toggle.bind(I),
		togglePause: lt,
		toggleAutoSlide: ft,
		toggleJumpToSlide: dt,
		isFirstSlide: at,
		isLastSlide: ot,
		isLastVerticalSlide: it,
		isVerticalSlide: nt,
		isVerticalStack: rt,
		isPaused: ut,
		isAutoSliding: pt,
		isSpeakerNotes: q.isSpeakerNotesWindow.bind(q),
		isOverview: z.isActive.bind(z),
		isFocused: K.isFocused.bind(K),
		isOverlayOpen: G.isOpen.bind(G),
		isScrollView: I.isActive.bind(I),
		isPrintView: L.isActive.bind(L),
		isReady: () => m,
		loadSlide: j.load.bind(j),
		unloadSlide: j.unload.bind(j),
		startEmbeddedContent: () => j.startEmbeddedContent(y),
		stopEmbeddedContent: () => j.stopEmbeddedContent(y, { unloadIframes: !1 }),
		previewIframe: G.previewIframe.bind(G),
		previewImage: G.previewImage.bind(G),
		previewVideo: G.previewVideo.bind(G),
		showPreview: G.previewIframe.bind(G),
		hidePreview: G.close.bind(G),
		addEventListeners: Ue,
		removeEventListeners: We,
		dispatchEvent: J,
		getState: It,
		setState: Lt,
		getProgress: Tt,
		getIndices: Et,
		getSlidesAttributes: Mt,
		getSlidePastCount: wt,
		getTotalSlides: Nt,
		getSlide: Pt,
		getPreviousSlide: () => v,
		getCurrentSlide: () => y,
		getSlideBackground: Ft,
		getSlideNotes: q.getSlideNotes.bind(q),
		getSlides: Dt,
		getHorizontalSlides: Q,
		getVerticalSlides: Ot,
		hasHorizontalSlides: At,
		hasVerticalSlides: jt,
		hasNavigatedHorizontally: () => b.hasNavigatedHorizontally,
		hasNavigatedVertically: () => b.hasNavigatedVertically,
		shouldAutoAnimateBetween: mt,
		addKeyBinding: B.addKeyBinding.bind(B),
		removeKeyBinding: B.removeKeyBinding.bind(B),
		triggerKey: B.triggerKey.bind(B),
		registerKeyboardShortcut: B.registerKeyboardShortcut.bind(B),
		getComputedSlideSize: $e,
		setCurrentScrollPage: ht,
		removeHiddenSlides: Ne,
		getScale: () => S,
		getConfig: () => f,
		getQueryHash: u,
		getSlidePath: V.getHash.bind(V),
		getRevealElement: () => a,
		getSlidesElement: () => D.slides,
		getViewportElement: () => D.viewport,
		getBackgroundsElement: () => F.element,
		registerPlugin: W.registerPlugin.bind(W),
		hasPlugin: W.hasPlugin.bind(W),
		getPlugin: W.getPlugin.bind(W),
		getPlugins: W.getRegisteredPlugins.bind(W)
	};
	return e(l, P(P({}, tn), {}, {
		announceStatus: Ie,
		getStatusText: Le,
		focus: K,
		scroll: I,
		progress: U,
		controls: H,
		location: V,
		overview: z,
		keyboard: B,
		fragments: R,
		backgrounds: F,
		slideContent: j,
		slideNumber: M,
		onUserInput: qt,
		closeOverlay: G.close.bind(G),
		updateSlidesVisibility: Ct,
		layoutSlideContents: Ze,
		transformSlides: Je,
		cueAutoSlide: $,
		cancelAutoSlide: Rt
	})), tn;
}
//#endregion
//#region js/index.ts
var B = z, V = [];
B.initialize = (e) => {
	let t = document.querySelector(".reveal");
	if (!(t instanceof HTMLElement)) throw Error("Unable to find presentation root (<div class=\"reveal\">).");
	return Object.assign(B, new z(t, e)), V.map((e) => e(B)), B.initialize();
}, [
	"configure",
	"on",
	"off",
	"addEventListener",
	"removeEventListener",
	"registerPlugin"
].forEach((e) => {
	B[e] = (...t) => {
		V.push((n) => n[e].call(null, ...t));
	};
}), B.isReady = () => !1, B.VERSION = Ee;
//#endregion
export { B as default };
