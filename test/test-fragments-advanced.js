Reveal.initialize({ fragments: true }).then(() => {
    QUnit.module('Fragments Advanced');

    QUnit.test('Fragment styles are preserved', function(assert) {
        Reveal.slide(0, 0, -1);
        const fragments = document.querySelectorAll('.fragment');

        assert.ok(fragments[0].classList.contains('fade-in'), 'fade-in class preserved');
        assert.ok(fragments[1].classList.contains('fade-out'), 'fade-out class preserved');
        assert.ok(fragments[2].classList.contains('grow'), 'grow class preserved');
    });

    QUnit.test('Fragment sorting by index', function(assert) {
        Reveal.slide(1, 0, -1);
        const slide = Reveal.getCurrentSlide();
        const fragments = Array.from(slide.querySelectorAll('.fragment'));

        assert.strictEqual(fragments[0].getAttribute('data-fragment-index'), '1');
        assert.strictEqual(fragments[1].getAttribute('data-fragment-index'), '0');
        assert.strictEqual(fragments[2].getAttribute('data-fragment-index'), '0');
    });

    QUnit.test('Multiple fragments with same index show together', function(assert) {
        Reveal.slide(1, 0, -1);
        Reveal.next(); // Show index 0
        Reveal.next(); // Show index 1

        const slide = Reveal.getCurrentSlide();
        const visibleFragments = slide.querySelectorAll('.fragment.visible');
        assert.strictEqual(visibleFragments.length, 3, 'all three fragments visible');
    });

    QUnit.test('Disabled fragments are skipped', function(assert) {
        Reveal.slide(2, 0, -1);
        Reveal.next();

        const slide = Reveal.getCurrentSlide();
        const disabledFragment = slide.querySelector('.fragment.disabled');
        const normalFragment = slide.querySelector('.fragment:not(.disabled)');

        assert.notOk(disabledFragment.classList.contains('visible'), 'disabled fragment not shown');
        assert.ok(normalFragment.classList.contains('visible'), 'normal fragment shown');
    });

    QUnit.test('Fragment events fire correctly', function(assert) {
        const done = assert.async(2);
        let shownCount = 0;
        let hiddenCount = 0;

        Reveal.on('fragmentshown', () => {
            shownCount++;
            if (shownCount === 1) done();
        });

        Reveal.on('fragmenthidden', () => {
            hiddenCount++;
            if (hiddenCount === 1) done();
        });

        Reveal.slide(0, 0, -1);
        Reveal.next(); // Show fragment
        Reveal.prev(); // Hide fragment

        assert.strictEqual(shownCount, 1, 'fragmentshown fired once');
        assert.strictEqual(hiddenCount, 1, 'fragmenthidden fired once');
    });

    QUnit.test('Fragment visibility on slide change', function(assert) {
        Reveal.slide(0, 0, 2); // Show all fragments
        const slide = Reveal.getCurrentSlide();
        assert.strictEqual(slide.querySelectorAll('.fragment.visible').length, 3, 'all fragments visible');

        Reveal.slide(1, 0); // Navigate away
        Reveal.slide(0, 0); // Come back
        assert.strictEqual(slide.querySelectorAll('.fragment.visible').length, 3, 'fragments remain visible');
    });

    QUnit.test('Fragments disabled globally', function(assert) {
        Reveal.configure({ fragments: false });
        Reveal.slide(0, 0);

        const fragments = document.querySelectorAll('.fragment');
        fragments.forEach(f => {
            assert.ok(f.classList.contains('visible'), 'all fragments visible when disabled');
        });

        Reveal.configure({ fragments: true });
    });

    QUnit.test('Fragment sync method', function(assert) {
        Reveal.slide(0, 0);
        const slide = Reveal.getCurrentSlide();

        const newFragment = document.createElement('p');
        newFragment.className = 'fragment';
        newFragment.textContent = 'Dynamic fragment';
        slide.appendChild(newFragment);

        Reveal.sync();

        assert.ok(newFragment.hasAttribute('data-fragment-index'), 'new fragment has index after sync');
    });

    QUnit.test('availableRoutes with fragments', function(assert) {
        Reveal.slide(0, 0, -1);
        let routes = Reveal.availableRoutes({ includeFragments: true });
        assert.ok(routes.right, 'can go right when fragments available');

        Reveal.slide(0, 0, 2); // Last fragment
        routes = Reveal.availableRoutes({ includeFragments: true });
        assert.ok(routes.right, 'can still go right after last fragment');
    });
});
