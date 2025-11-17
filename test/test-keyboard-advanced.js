function triggerKey(keyCode, options = {}) {
    document.dispatchEvent(new KeyboardEvent('keydown', { keyCode, ...options }));
}

Reveal.initialize({ keyboard: true }).then(() => {
    QUnit.module('Keyboard Advanced');

    QUnit.test('Home key navigation', function(assert) {
        Reveal.slide(2, 0);
        triggerKey(36); // HOME
        assert.deepEqual(Reveal.getIndices(), { h: 0, v: 0, f: undefined }, 'HOME goes to first slide');
    });

    QUnit.test('End key navigation', function(assert) {
        Reveal.slide(0, 0);
        triggerKey(35); // END
        assert.strictEqual(Reveal.getIndices().h, 2, 'END goes to last horizontal slide');
    });

    QUnit.test('Page Up/Down navigation', function(assert) {
        Reveal.slide(1, 0);

        triggerKey(33); // PAGE UP
        assert.strictEqual(Reveal.getIndices().h, 0, 'PAGE UP goes to previous slide');

        triggerKey(34); // PAGE DOWN
        assert.strictEqual(Reveal.getIndices().h, 1, 'PAGE DOWN goes to next slide');
    });

    QUnit.test('N/P navigation', function(assert) {
        Reveal.slide(1, 0);

        triggerKey(80); // P
        assert.strictEqual(Reveal.getIndices().h, 0, 'P goes to previous slide');

        triggerKey(78); // N
        assert.strictEqual(Reveal.getIndices().h, 1, 'N goes to next slide');
    });

    QUnit.test('Shift + arrow navigation', function(assert) {
        Reveal.slide(1, 1);

        triggerKey(38, { shiftKey: true }); // Shift + UP
        assert.strictEqual(Reveal.getIndices().v, 0, 'Shift+UP goes to first vertical');

        triggerKey(40, { shiftKey: true }); // Shift + DOWN
        assert.strictEqual(Reveal.getIndices().v, 2, 'Shift+DOWN goes to last vertical');

        Reveal.slide(1, 0);
        triggerKey(37, { shiftKey: true }); // Shift + LEFT
        assert.strictEqual(Reveal.getIndices().h, 0, 'Shift+LEFT goes to first horizontal');

        triggerKey(39, { shiftKey: true }); // Shift + RIGHT
        assert.strictEqual(Reveal.getIndices().h, 2, 'Shift+RIGHT goes to last horizontal');
    });

    QUnit.test('Space key navigation', function(assert) {
        Reveal.slide(0, 0);

        triggerKey(32); // SPACE
        assert.strictEqual(Reveal.getIndices().h, 1, 'SPACE goes to next slide');

        triggerKey(32, { shiftKey: true }); // Shift + SPACE
        assert.strictEqual(Reveal.getIndices().h, 0, 'Shift+SPACE goes to previous slide');
    });

    QUnit.test('Pause keys (B, V, .)', function(assert) {
        assert.notOk(Reveal.isPaused(), 'not paused initially');

        triggerKey(66); // B
        assert.ok(Reveal.isPaused(), 'B pauses presentation');

        triggerKey(66); // B again
        assert.notOk(Reveal.isPaused(), 'B resumes presentation');

        triggerKey(86); // V
        assert.ok(Reveal.isPaused(), 'V pauses presentation');
        triggerKey(86); // resume

        triggerKey(190); // .
        assert.ok(Reveal.isPaused(), '. pauses presentation');
        triggerKey(190); // resume
    });

    QUnit.test('ESC/O for overview', function(assert) {
        assert.notOk(Reveal.isOverview(), 'not in overview initially');

        triggerKey(27); // ESC
        assert.ok(Reveal.isOverview(), 'ESC toggles overview on');

        triggerKey(27);
        assert.notOk(Reveal.isOverview(), 'ESC toggles overview off');

        triggerKey(79); // O
        assert.ok(Reveal.isOverview(), 'O toggles overview on');
        triggerKey(79);
    });

    QUnit.test('Custom keyboard bindings', function(assert) {
        const done = assert.async();
        let called = false;

        Reveal.addKeyBinding({ keyCode: 84, key: 'T' }, () => {
            called = true;
        });

        triggerKey(84); // T
        assert.ok(called, 'custom key binding triggered');

        Reveal.removeKeyBinding(84);
        called = false;
        triggerKey(84);
        assert.notOk(called, 'removed key binding not triggered');

        done();
    });

    QUnit.test('Keyboard condition function', function(assert) {
        Reveal.configure({
            keyboardCondition: (event) => event.keyCode !== 39
        });

        Reveal.slide(0, 0);
        triggerKey(39); // RIGHT - should be blocked

        assert.strictEqual(Reveal.getIndices().h, 0, 'blocked key has no effect');

        Reveal.configure({ keyboardCondition: null });
    });

    QUnit.test('Linear navigation mode', function(assert) {
        Reveal.configure({ navigationMode: 'linear' });

        Reveal.slide(1, 0);

        triggerKey(39); // RIGHT
        assert.deepEqual(Reveal.getIndices(), { h: 1, v: 1, f: undefined }, 'RIGHT goes to next in linear mode');

        triggerKey(37); // LEFT
        assert.deepEqual(Reveal.getIndices(), { h: 1, v: 0, f: undefined }, 'LEFT goes to previous in linear mode');

        Reveal.configure({ navigationMode: 'default' });
    });

});
