Reveal.initialize().then(() => {
    QUnit.module('Configuration');

    QUnit.test('Width and height config', function(assert) {
        Reveal.configure({ width: 1200, height: 800 });
        const config = Reveal.getConfig();
        assert.strictEqual(config.width, 1200, 'width updated');
        assert.strictEqual(config.height, 800, 'height updated');
    });

    QUnit.test('Margin config', function(assert) {
        Reveal.configure({ margin: 0.1 });
        assert.strictEqual(Reveal.getConfig().margin, 0.1, 'margin updated');
    });

    QUnit.test('Min/Max scale config', function(assert) {
        Reveal.configure({ minScale: 0.5, maxScale: 3.0 });
        const config = Reveal.getConfig();
        assert.strictEqual(config.minScale, 0.5, 'minScale updated');
        assert.strictEqual(config.maxScale, 3.0, 'maxScale updated');
    });

    QUnit.test('Loop config', function(assert) {
        Reveal.configure({ loop: true });
        assert.strictEqual(Reveal.getConfig().loop, true, 'loop enabled');

        Reveal.slide(2); // Last slide
        Reveal.next();
        assert.strictEqual(Reveal.getIndices().h, 0, 'loops to first slide');

        Reveal.configure({ loop: false });
    });

    QUnit.test('RTL config', function(assert) {
        Reveal.configure({ rtl: true });
        assert.strictEqual(Reveal.getConfig().rtl, true, 'RTL enabled');

        Reveal.configure({ rtl: false });
    });

    QUnit.test('Center config', function(assert) {
        Reveal.configure({ center: false });
        assert.strictEqual(Reveal.getConfig().center, false, 'center disabled');

        Reveal.configure({ center: true });
    });

    QUnit.test('Touch config', function(assert) {
        Reveal.configure({ touch: false });
        assert.strictEqual(Reveal.getConfig().touch, false, 'touch disabled');

        Reveal.configure({ touch: true });
    });

    QUnit.test('Shuffle config', function(assert) {
        Reveal.configure({ shuffle: true });
        assert.strictEqual(Reveal.getConfig().shuffle, true, 'shuffle enabled');

        Reveal.configure({ shuffle: false });
    });

    QUnit.test('Transition config', function(assert) {
        const transitions = ['none', 'fade', 'slide', 'convex', 'concave', 'zoom'];
        transitions.forEach(transition => {
            Reveal.configure({ transition });
            assert.strictEqual(Reveal.getConfig().transition, transition, `${transition} transition set`);
        });
    });

    QUnit.test('Transition speed config', function(assert) {
        const speeds = ['default', 'fast', 'slow'];
        speeds.forEach(speed => {
            Reveal.configure({ transitionSpeed: speed });
            assert.strictEqual(Reveal.getConfig().transitionSpeed, speed, `${speed} speed set`);
        });
    });

    QUnit.test('Background transition config', function(assert) {
        Reveal.configure({ backgroundTransition: 'zoom' });
        assert.strictEqual(Reveal.getConfig().backgroundTransition, 'zoom', 'background transition set');
    });

    QUnit.test('View distance config', function(assert) {
        Reveal.configure({ viewDistance: 5 });
        assert.strictEqual(Reveal.getConfig().viewDistance, 5, 'viewDistance updated');
    });

    QUnit.test('Mobile view distance config', function(assert) {
        Reveal.configure({ mobileViewDistance: 1 });
        assert.strictEqual(Reveal.getConfig().mobileViewDistance, 1, 'mobileViewDistance updated');
    });

    QUnit.test('Display config', function(assert) {
        Reveal.configure({ display: 'flex' });
        assert.strictEqual(Reveal.getConfig().display, 'flex', 'display mode updated');

        Reveal.configure({ display: 'block' });
    });

    QUnit.test('Hash config', function(assert) {
        Reveal.configure({ hash: true });
        assert.strictEqual(Reveal.getConfig().hash, true, 'hash enabled');

        Reveal.configure({ hash: false });
    });

    QUnit.test('History config', function(assert) {
        Reveal.configure({ history: true });
        assert.strictEqual(Reveal.getConfig().history, true, 'history enabled');

        Reveal.configure({ history: false });
    });

    QUnit.test('Slide number config', function(assert) {
        Reveal.configure({ slideNumber: 'c/t' });
        assert.strictEqual(Reveal.getConfig().slideNumber, 'c/t', 'slideNumber format set');

        Reveal.configure({ slideNumber: false });
    });

    QUnit.test('Show notes config', function(assert) {
        Reveal.configure({ showNotes: true });
        assert.strictEqual(Reveal.getConfig().showNotes, true, 'showNotes enabled');

        Reveal.configure({ showNotes: false });
    });

    QUnit.test('Auto-animate config', function(assert) {
        Reveal.configure({ autoAnimate: false });
        assert.strictEqual(Reveal.getConfig().autoAnimate, false, 'autoAnimate disabled');

        Reveal.configure({ autoAnimate: true });
    });

    QUnit.test('Help config', function(assert) {
        Reveal.configure({ help: false });
        assert.strictEqual(Reveal.getConfig().help, false, 'help disabled');

        Reveal.configure({ help: true });
    });

    QUnit.test('Pause config', function(assert) {
        Reveal.configure({ pause: false });
        assert.strictEqual(Reveal.getConfig().pause, false, 'pause disabled');

        Reveal.configure({ pause: true });
    });
});
