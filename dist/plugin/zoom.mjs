/*!
 * reveal.js Zoom plugin
 */
const c = {
  id: "zoom",
  init: function(n) {
    n.getRevealElement().addEventListener("mousedown", function(o) {
      var l = /Linux/.test(window.navigator.platform) ? "ctrl" : "alt", f = (n.getConfig().zoomKey ? n.getConfig().zoomKey : l) + "Key", m = n.getConfig().zoomLevel ? n.getConfig().zoomLevel : 2;
      o[f] && !n.isOverview() && (o.preventDefault(), r.to({
        x: o.clientX,
        y: o.clientY,
        scale: m,
        pan: !1
      }));
    });
  },
  destroy: () => {
    r.reset();
  }
}, h = () => c;
/*!
 * zoom.js 0.3 (modified for use with reveal.js)
 * http://lab.hakim.se/zoom-js
 * MIT licensed
 *
 * Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
 */
var r = function() {
  var n = 1, o = 0, l = 0, f = -1, m = -1, u = "transform" in document.body.style;
  u && (document.body.style.transition = "transform 0.8s ease"), document.addEventListener("keyup", function(e) {
    n !== 1 && e.keyCode === 27 && r.out();
  }), document.addEventListener("mousemove", function(e) {
    n !== 1 && (o = e.clientX, l = e.clientY);
  });
  function y(e, t) {
    var i = s();
    if (e.width = e.width || 1, e.height = e.height || 1, e.x -= (window.innerWidth - e.width * t) / 2, e.y -= (window.innerHeight - e.height * t) / 2, u)
      if (t === 1)
        document.body.style.transform = "";
      else {
        var d = i.x + "px " + i.y + "px", w = "translate(" + -e.x + "px," + -e.y + "px) scale(" + t + ")";
        document.body.style.transformOrigin = d, document.body.style.transform = w;
      }
    else
      t === 1 ? (document.body.style.position = "", document.body.style.left = "", document.body.style.top = "", document.body.style.width = "", document.body.style.height = "", document.body.style.zoom = "") : (document.body.style.position = "relative", document.body.style.left = -(i.x + e.x) / t + "px", document.body.style.top = -(i.y + e.y) / t + "px", document.body.style.width = t * 100 + "%", document.body.style.height = t * 100 + "%", document.body.style.zoom = t);
    n = t, document.documentElement.classList && (n !== 1 ? document.documentElement.classList.add("zoomed") : document.documentElement.classList.remove("zoomed"));
  }
  function a() {
    var e = 0.12, t = window.innerWidth * e, i = window.innerHeight * e, d = s();
    l < i ? window.scroll(d.x, d.y - (1 - l / i) * (14 / n)) : l > window.innerHeight - i && window.scroll(d.x, d.y + (1 - (window.innerHeight - l) / i) * (14 / n)), o < t ? window.scroll(d.x - (1 - o / t) * (14 / n), d.y) : o > window.innerWidth - t && window.scroll(d.x + (1 - (window.innerWidth - o) / t) * (14 / n), d.y);
  }
  function s() {
    return {
      x: window.scrollX !== void 0 ? window.scrollX : window.pageXOffset,
      y: window.scrollY !== void 0 ? window.scrollY : window.pageYOffset
    };
  }
  return {
    /**
     * Zooms in on either a rectangle or HTML element.
     *
     * @param {Object} options
     *   - element: HTML element to zoom in on
     *   OR
     *   - x/y: coordinates in non-transformed space to zoom in on
     *   - width/height: the portion of the screen to zoom in on
     *   - scale: can be used instead of width/height to explicitly set scale
     */
    to: function(e) {
      if (n !== 1)
        r.out();
      else {
        if (e.x = e.x || 0, e.y = e.y || 0, e.element) {
          var t = 20, i = e.element.getBoundingClientRect();
          e.x = i.left - t, e.y = i.top - t, e.width = i.width + t * 2, e.height = i.height + t * 2;
        }
        e.width !== void 0 && e.height !== void 0 && (e.scale = Math.max(Math.min(window.innerWidth / e.width, window.innerHeight / e.height), 1)), e.scale > 1 && (e.x *= e.scale, e.y *= e.scale, y(e, e.scale), e.pan !== !1 && (f = setTimeout(function() {
          m = setInterval(a, 1e3 / 60);
        }, 800)));
      }
    },
    /**
     * Resets the document zoom state to its default.
     */
    out: function() {
      clearTimeout(f), clearInterval(m), y({ x: 0, y: 0 }, 1), n = 1;
    },
    // Alias
    magnify: function(e) {
      this.to(e);
    },
    reset: function() {
      this.out();
    },
    zoomLevel: function() {
      return n;
    }
  };
}();
export {
  h as default
};
