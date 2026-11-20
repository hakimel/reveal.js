//#region plugin/zoom/plugin.js
var e = {
	id: "zoom",
	init: function(e) {
		e.getRevealElement().addEventListener("mousedown", function(t) {
			var r = /Linux/.test(window.navigator.platform) ? "ctrl" : "alt", i = (e.getConfig().zoomKey ? e.getConfig().zoomKey : r) + "Key", a = e.getConfig().zoomLevel ? e.getConfig().zoomLevel : 2;
			t[i] && !e.isOverview() && (t.preventDefault(), n.to({
				x: t.clientX,
				y: t.clientY,
				scale: a,
				pan: !1
			}));
		});
	},
	destroy: () => {
		n.reset();
	}
}, t = () => e, n = (function() {
	var e = 1, t = 0, r = 0, i = -1, a = -1, o = "transform" in document.body.style;
	o && (document.body.style.transition = "transform 0.8s ease"), document.addEventListener("keyup", function(t) {
		e !== 1 && t.keyCode === 27 && n.out();
	}), document.addEventListener("mousemove", function(n) {
		e !== 1 && (t = n.clientX, r = n.clientY);
	});
	function s(t, n) {
		var r = l();
		if (t.width = t.width || 1, t.height = t.height || 1, t.x -= (window.innerWidth - t.width * n) / 2, t.y -= (window.innerHeight - t.height * n) / 2, o) if (n === 1) document.body.style.transform = "";
		else {
			var i = r.x + "px " + r.y + "px", a = "translate(" + -t.x + "px," + -t.y + "px) scale(" + n + ")";
			document.body.style.transformOrigin = i, document.body.style.transform = a;
		}
		else n === 1 ? (document.body.style.position = "", document.body.style.left = "", document.body.style.top = "", document.body.style.width = "", document.body.style.height = "", document.body.style.zoom = "") : (document.body.style.position = "relative", document.body.style.left = -(r.x + t.x) / n + "px", document.body.style.top = -(r.y + t.y) / n + "px", document.body.style.width = n * 100 + "%", document.body.style.height = n * 100 + "%", document.body.style.zoom = n);
		e = n, document.documentElement.classList && (e === 1 ? document.documentElement.classList.remove("zoomed") : document.documentElement.classList.add("zoomed"));
	}
	function c() {
		var n = .12, i = window.innerWidth * n, a = window.innerHeight * n, o = l();
		r < a ? window.scroll(o.x, o.y - (1 - r / a) * (14 / e)) : r > window.innerHeight - a && window.scroll(o.x, o.y + (1 - (window.innerHeight - r) / a) * (14 / e)), t < i ? window.scroll(o.x - (1 - t / i) * (14 / e), o.y) : t > window.innerWidth - i && window.scroll(o.x + (1 - (window.innerWidth - t) / i) * (14 / e), o.y);
	}
	function l() {
		return {
			x: window.scrollX === void 0 ? window.pageXOffset : window.scrollX,
			y: window.scrollY === void 0 ? window.pageYOffset : window.scrollY
		};
	}
	return {
		to: function(t) {
			if (e !== 1) n.out();
			else {
				if (t.x = t.x || 0, t.y = t.y || 0, t.element) {
					var r = 20, o = t.element.getBoundingClientRect();
					t.x = o.left - r, t.y = o.top - r, t.width = o.width + r * 2, t.height = o.height + r * 2;
				}
				t.width !== void 0 && t.height !== void 0 && (t.scale = Math.max(Math.min(window.innerWidth / t.width, window.innerHeight / t.height), 1)), t.scale > 1 && (t.x *= t.scale, t.y *= t.scale, s(t, t.scale), t.pan !== !1 && (i = setTimeout(function() {
					a = setInterval(c, 1e3 / 60);
				}, 800)));
			}
		},
		out: function() {
			clearTimeout(i), clearInterval(a), s({
				x: 0,
				y: 0
			}, 1), e = 1;
		},
		magnify: function(e) {
			this.to(e);
		},
		reset: function() {
			this.out();
		},
		zoomLevel: function() {
			return e;
		}
	};
})(), r = t;
//#endregion
export { r as default };
