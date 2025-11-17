Reveal.initialize().then(() => {
    QUnit.module('Navigation');

    QUnit.test('left() navigation', function(assert) {
        Reveal.slide(2, 0);
        Reveal.left();
        assert.strictEqual(Reveal.getIndices().h, 1, 'moves left horizontally');
    });

    QUnit.test('right() navigation', function(assert) {
        Reveal.slide(1, 0);
        Reveal.right();
        assert.strictEqual(Reveal.getIndices().h, 2, 'moves right horizontally');
    });

    QUnit.test('up() navigation', function(assert) {
        Reveal.slide(1, 2);
        Reveal.up();
        assert.strictEqual(Reveal.getIndices().v, 1, 'moves up vertically');
    });

    QUnit.test('down() navigation', function(assert) {
        Reveal.slide(1, 0);
        Reveal.down();
        assert.strictEqual(Reveal.getIndices().v, 1, 'moves down vertically');
    });

    QUnit.test('prev() navigation', function(assert) {
        Reveal.slide(1, 1);

        Reveal.prev();
        assert.deepEqual(Reveal.getIndices(), { h: 1, v: 0, f: undefined }, 'moves to previous slide');

        Reveal.prev();
        assert.deepEqual(Reveal.getIndices(), { h: 0, v: 0, f: undefined }, 'moves to previous horizontal');
    });

    QUnit.test('next() navigation', function(assert) {
        Reveal.slide(0, 0);

        Reveal.next();
        assert.deepEqual(Reveal.getIndices(), { h: 1, v: 0, f: undefined }, 'moves to next slide');

        Reveal.next();
        assert.deepEqual(Reveal.getIndices(), { h: 1, v: 1, f: undefined }, 'moves to next vertical');
    });

    QUnit.test('navigateTo() method', function(assert) {
        Reveal.slide(0, 0);
        Reveal.slide(2, 1);

        assert.deepEqual(Reveal.getIndices(), { h: 2, v: 1, f: undefined }, 'navigates to specific slide');
    });

    QUnit.test('Navigation with grid mode', function(assert) {
        Reveal.configure({ navigationMode: 'grid' });
        Reveal.slide(1, 2);

        Reveal.right();
        assert.strictEqual(Reveal.getIndices().v, 1, 'maintains vertical index in grid mode');

        Reveal.configure({ navigationMode: 'default' });
    });

    QUnit.test('Navigation boundaries', function(assert) {
        Reveal.slide(0, 0);

        Reveal.left();
        assert.deepEqual(Reveal.getIndices(), { h: 0, v: 0, f: undefined }, 'cannot go left from first slide');

        Reveal.up();
        assert.deepEqual(Reveal.getIndices(), { h: 0, v: 0, f: undefined }, 'cannot go up from first slide');

        Reveal.slide(3, 0);
        Reveal.right();
        assert.deepEqual(Reveal.getIndices(), { h: 3, v: 0, f: undefined }, 'cannot go right from last slide');
    });

    QUnit.test('hasHorizontalSlides()', function(assert) {
        assert.ok(Reveal.hasHorizontalSlides(), 'has horizontal slides');
    });

    QUnit.test('hasVerticalSlides()', function(assert) {
        assert.ok(Reveal.hasVerticalSlides(), 'has vertical slides');
    });

    QUnit.test('getHorizontalSlides()', function(assert) {
        const slides = Reveal.getHorizontalSlides();
        assert.strictEqual(slides.length, 4, 'returns correct number of horizontal slides');
    });

    QUnit.test('getVerticalSlides()', function(assert) {
        Reveal.slide(1, 0);

        const slides = Reveal.getVerticalSlides();
        assert.strictEqual(slides.length, 5, 'returns correct number of vertical slides');
    });

    QUnit.test('getSlides()', function(assert) {
        const slides = Reveal.getSlides();
        assert.strictEqual(slides.length, 7, 'returns all slides');
    });

    QUnit.test('getTotalSlides()', function(assert) {
        assert.strictEqual(Reveal.getTotalSlides(), 7, 'returns correct total');
    });

    QUnit.test('isVerticalSlide()', function(assert) {
        Reveal.slide(0, 0);
        assert.notOk(Reveal.isVerticalSlide(), 'horizontal slide returns false');

        Reveal.slide(1, 1);
        assert.ok(Reveal.isVerticalSlide(), 'vertical slide returns true');
    });
});
