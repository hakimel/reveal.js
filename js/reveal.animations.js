RevealModules = this.RevealModules || {};
RevealModules.Animations = {};

(function() {
	
	var DATA_ANIMATIONS = 'data-animations';
	var DATA_ANIMATION_INDEX = 'data-animation-index';
	var SYNTAX_REGEX = /^(\d+):(.*)$/;

	RevealModules.Animations.NodeAnimations = function(node) {
		
		var anim = node.getAttribute(DATA_ANIMATIONS);
		var step = anim.split(' ');
		var sequence = [];
		step.forEach(function(s) {
			var detail = SYNTAX_REGEX.exec(s);
			var index = parseInt(detail[1], 10) - 1;
			sequence[index] = detail[2].split(',');
		});
	
		return {
			sequence: sequence
		}
	
	};

	RevealModules.Animations.SlideAnimations = function(slide) {
	
		var sequence = [];
	
		var nodeList = slide.querySelectorAll('[' + DATA_ANIMATIONS + ']');
		for (var nodeIndex=0; nodeIndex<nodeList.length; ++nodeIndex) {
			var anim = RevealModules.Animations.NodeAnimations(nodeList.item(nodeIndex));
			for (var seqIndex=0; seqIndex<anim.sequence.length; ++seqIndex) {
				sequence[seqIndex] = sequence[seqIndex] || [];
				sequence[seqIndex].push({
					element: nodeList.item(nodeIndex),
					classes: anim.sequence[seqIndex] || []
				});
			}
		}
			
		return {
			sequence: sequence
		};

	};
	
	RevealModules.Animations.Player = function(slide) {

		var anim = RevealModules.Animations.SlideAnimations(slide);
		
		function addClasses(seq) { 
			seq.classes.forEach(function(c) {
				seq.element.classList.add(c);
			});
		}
		
		function removeClasses(seq) {
			seq.classes.forEach(function(c) {
				seq.element.classList.remove(c);
			});						
		}
		
		function clamp(index) {
			return (index < 0) ? 0 : (index > anim.sequence.length) ? anim.sequence.length : index;
		}

		function play() {
			if (anim.sequence.length === 0) {
				return false;
			} else {
				var index = parseInt(slide.getAttribute(DATA_ANIMATION_INDEX) || '0', 10);
				if (index < anim.sequence.length) {
					slide.setAttribute(DATA_ANIMATION_INDEX, ++index);
					anim.sequence[clamp(index) - 1].forEach(addClasses);
					return true;
				} else {
					return false;
				}
			}
		}
		
		function rewind() {
			if (anim.sequence.length === 0) {
				return false;
			} else {
				var index = parseInt(slide.getAttribute(DATA_ANIMATION_INDEX) || '0', 10);
				if (index > 0) {
					slide.setAttribute(DATA_ANIMATION_INDEX, --index);
					anim.sequence[clamp(index)].forEach(removeClasses);
					return true;					
				} else {
					return false;
				}
			}
		}
		
		function reset() {
			anim.sequence.forEach(function(seq) {
				seq.forEach(removeClasses);
			});
			slide.setAttribute(DATA_ANIMATION_INDEX, 0);
		}

		return {
			play: play,
			rewind: rewind,
			reset: reset
		};
		
	};

})();
