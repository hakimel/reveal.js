describe('Animations', function() {
	
	var RMA = RevealModules.Animations;
	
	describe('Node level', function() {
		
		it('can read a single class', function() {
			var node = $('<p data-animations="1:visible">in sequence</p>').get(0);
			var anim = RMA.NodeAnimations(node);
			expect(anim.sequence.length).toEqual(1);
			expect(anim.sequence[0]).toEqual(['visible']);
		});
		
		it('can read single classes in sequence', function() {
			var node = $('<p data-animations="1:green 2:red">in sequence</p>').get(0);
			var anim = RMA.NodeAnimations(node);
			expect(anim.sequence.length).toEqual(2);
			expect(anim.sequence[0]).toEqual(['green']);
			expect(anim.sequence[1]).toEqual(['red']);
		});
		
		it('can read multiple classes', function() {
			var node = $('<p data-animations="1:green,red">in sequence</p>').get(0);
			var anim = RMA.NodeAnimations(node);
			expect(anim.sequence.length).toEqual(1);
			expect(anim.sequence[0]).toEqual(['green', 'red']);
		});

		it('can read multiple classes in sequence', function() {
			var node = $('<p data-animations="1:small,green 2:big,red">in sequence</p>').get(0);
			var anim = RMA.NodeAnimations(node);
			expect(anim.sequence.length).toEqual(2);
			expect(anim.sequence[0]).toEqual(['small','green']);
			expect(anim.sequence[1]).toEqual(['big','red']);
		});		
		
	});

	describe('Slide level', function() {
		
		it('can tell when there are no animations', function() {
			var slide = $(
				'<section>' +
				'	<p>One</p>' +
				'	<p>Two</p>' +
				'</section>'
			).get(0);
			var anim = RMA.SlideAnimations(slide);
			expect(anim.sequence.length).toBe(0);
		});

		it('can create a full sequence from a single node', function() {
			var slide = $(
				'<section>' +
				'	<p data-animations="1:green">One</p>' +
				'</section>'
			).get(0);
			var anim = RMA.SlideAnimations(slide);
			expect(anim.sequence.length).toBe(1);
		});

		it('can create a full sequence from several nodes in sequence', function() {
			var slide = $(
				'<section>' +
				'	<p data-animations="1:green">One</p>' +
				'	<p data-animations="2:red">One</p>' +
				'</section>'
			).get(0);
			var anim = RMA.SlideAnimations(slide);
			expect(anim.sequence.length).toBe(2);
			expect(anim.sequence[0][0].classes).toEqual(['green']);
			expect(anim.sequence[1][0].classes).toEqual(['red']);
		});
		
		it('can merge a full sequence with a mix of parallel and sequence animations', function() {
			var slide = $(
				'<section>' +
				'	<p id="a" data-animations="1:green 2:slide,red">One</p>' +
				'	<p id="b" data-animations="2:big">One</p>' +
				'</section>'
			).get(0);
			var anim = RMA.SlideAnimations(slide);
			expect(anim.sequence.length).toBe(2);
			expect(anim.sequence[0][0].classes).toEqual(['green']);
			expect(anim.sequence[1][0].element.id).toBe('a');
			expect(anim.sequence[1][0].classes).toEqual(['slide', 'red']);
			expect(anim.sequence[1][1].element.id).toBe('b');
			expect(anim.sequence[1][1].classes).toEqual(['big']);
		});
		
	});

	describe('Player', function() {

		it('returns false if the slide has no animations', function() {
			var slide = $(
				'<section>' +
				'	<p>One</p>' +
				'	<p>One</p>' +
				'</section>'
			).get(0);
			expect(RMA.Player(slide).play()).toBe(false);
			expect(slide.getAttribute('data-animation-index')).toBe(null);
			expect(RMA.Player(slide).rewind()).toBe(false);
			expect(slide.getAttribute('data-animation-index')).toBe(null);
		});
		
		// Add play through, and rewind through
		// And play back & forth within
		
		it('can play an animation', function() {
			var slide = $(
				'<section>' +
				'	<p data-animations="1:green">One</p>' +
				'	<p data-animations="2:red">One</p>' +
				'</section>'
			).get(0);
			expect(RMA.Player(slide).play()).toBe(true);
			expect(slide.getAttribute('data-animation-index')).toBe('1');
			expect(RMA.Player(slide).play()).toBe(true);
			expect(slide.getAttribute('data-animation-index')).toBe('2');
			expect(RMA.Player(slide).play()).toBe(false);
			expect(slide.getAttribute('data-animation-index')).toBe('1');
		});

		it('can rewind an animation', function() {
			var slide = $(
				'<section data-animation-index="1">' +
				'	<p data-animations="1:green">One</p>' +
				'	<p data-animations="2:red">One</p>' +
				'</section>'
			).get(0);
			expect(RMA.Player(slide).rewind()).toBe(true);
			expect(slide.getAttribute('data-animation-index')).toBe('0');
			expect(RMA.Player(slide).rewind()).toBe(true);
			expect(slide.getAttribute('data-animation-index')).toBe('-1');
			expect(RMA.Player(slide).rewind()).toBe(false);
			expect(slide.getAttribute('data-animation-index')).toBe('0');
		});
		
		it('can reset all animations when entering a slide, for non-linear jumps', function() {
			var slide = $(
				'<section>' +
				'	<p id="a" data-animations="1:green 2:red" class="original green red">One</p>' +
				'	<p id="b" data-animations="2:slide,big" class="original slide big">One</p>' +
				'</section>'
			).get(0);
			RMA.Player(slide).reset();
			expect(slide.getAttribute('data-animation-index')).toBe('0');
			expect($(slide).find('#a').attr('class')).toBe('original');
			expect($(slide).find('#b').attr('class')).toBe('original');
		});
				
	});

});
