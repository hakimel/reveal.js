/*s
Original code from https://github.com/CreativeTechGuy/RevealJS
The class names have been altered to not create ambiguity with the main project here

add this line at the end of the body in the index.html file:
<script src="plugin/compare/Compare.js"></script>
*/

(function() {
	window.addEventListener("load", function() {
		var elems = document.getElementsByClassName("compare");
		for (var i = 0; i < elems.length; i++) {
			init(elems[i]);
		}
	});

	document.addEventListener("touchmove", drag, {
		passive: false
	});
	document.addEventListener("mousemove", drag);
	document.addEventListener("touchend", stop);
	document.addEventListener("mouseup", stop);

	function drag(evt) {
		if (!window.Reveal.currentDrag) {
			return;
		}
		evt.preventDefault();
		var x = evt.clientX;
		if (evt.touches && evt.touches.length > 0) {
			x = evt.touches[0].clientX;
		}
		window.Reveal.currentDrag.x = x;
		window.Reveal.currentDrag.divider = (Math.max(window.Reveal.currentDrag.rect.left, Math.min(window.Reveal.currentDrag.rect.right, x)) - window.Reveal.currentDrag.rect.left) / window.Reveal.currentDrag.rect.width;
		window.Reveal.currentDrag.update();
	}
	function stop() {
		if (window.Reveal.currentDrag) {
			window.Reveal.currentDrag.update(true);
			window.Reveal.currentDrag = null;
		}
	}

	function init(elem) {
		if (elem.className.indexOf("compare-loaded") !== -1) {
			return;
		}

		var state = {
			items: [elem.children[0], elem.children[1]],
			divider: 0.5,
			lastX: -1000,
			x: 0,
			rect: elem.getBoundingClientRect(),
			update: update
		};

		var supportsClipPath = true;
		window.requestAnimationFrame(function() {
			if (!state.items[1].style.clipPath) {
				supportsClipPath = false;
				update(true);
			}
		});

		state.items[0].className += " compare-img";
		state.items[1].className += " compare-img";

		elem.className += " compare-loaded";

		var revealBar = createRevealBar();
		update(true);
		revealBar.addEventListener("touchstart", start);
		revealBar.addEventListener("mousedown", start);
		elem.appendChild(revealBar);

		function start() {
			state.rect = elem.getBoundingClientRect();
			window.Reveal.currentDrag = state;
		}
		function update(force) {
			var percent = state.divider * 100;
			revealBar.style.left = percent + "%";
			if (Math.abs(state.x - state.lastX) < 5 && !force) {
				return;
			}
			if (window.Reveal.onupdate) {
				window.Reveal.onupdate({
					elem: elem,
					percent: percent
				});
			}
			state.lastX = state.x;
			if (!supportsClipPath) {
				state.items[1].style.clip = "rect(0 " + state.rect.width + "px " + state.rect.height + "px " + state.divider * state.rect.width + "px)";
			} else {
				state.items[1].style.clipPath = "inset(0 0 0 " + percent + "%)";
			}
		}
	}

	window.Reveal = {
		currentDrag: null,
		init: init,
		onupdate: null
	};

	function createRevealBar() {
		var revealBar = document.createElement("div");
		revealBar.className = "compare-bar";

		var revealGrabber = document.createElement("div");
		revealGrabber.className = "compare-grabber";

		var revealArrows = document.createElement("div");
		revealArrows.className = "compare-arrows";
		revealArrows.innerHTML = "◄ ►";
		revealGrabber.appendChild(revealArrows);

		revealBar.appendChild(revealGrabber);
		return revealBar;
	}
})();