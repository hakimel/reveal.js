Reveal.initialize({ controls: true }).then(() => {
    QUnit.module('Controls');

    QUnit.test('Controls are rendered', function(assert) {
        const controls = document.querySelector('.controls');
        assert.ok(controls, 'controls element exists');
        assert.ok(controls.querySelector('.navigate-left'), 'left button exists');
        assert.ok(controls.querySelector('.navigate-right'), 'right button exists');
        assert.ok(controls.querySelector('.navigate-up'), 'up button exists');
        assert.ok(controls.querySelector('.navigate-down'), 'down button exists');
    });

    QUnit.test('Controls visibility config', function(assert) {
        const controls = document.querySelector('.controls');
        
        Reveal.configure({ controls: true });
        assert.strictEqual(controls.style.display, 'block', 'visible when controls: true');
        
        Reveal.configure({ controls: false });
        assert.strictEqual(controls.style.display, 'none', 'hidden when controls: false');
        
        Reveal.configure({ controls: true });
    });

    QUnit.test('Controls update based on available routes', function(assert) {
        Reveal.slide(0, 0);
        const leftBtn = document.querySelector('.controls .navigate-left');
        const rightBtn = document.querySelector('.controls .navigate-right');
        
        assert.notOk(leftBtn.classList.contains('enabled'), 'left disabled on first slide');
        assert.ok(rightBtn.classList.contains('enabled'), 'right enabled on first slide');
        
        Reveal.slide(1, 0);
        assert.ok(leftBtn.classList.contains('enabled'), 'left enabled on middle slide');
        assert.ok(rightBtn.classList.contains('enabled'), 'right enabled on middle slide');
    });

    QUnit.test('Controls update for vertical slides', function(assert) {
        Reveal.slide(1, 0);
        const upBtn = document.querySelector('.controls .navigate-up');
        const downBtn = document.querySelector('.controls .navigate-down');
        
        assert.notOk(upBtn.classList.contains('enabled'), 'up disabled on first vertical');
        assert.ok(downBtn.classList.contains('enabled'), 'down enabled when vertical slides exist');
        
        Reveal.slide(1, 1);
        assert.ok(upBtn.classList.contains('enabled'), 'up enabled on second vertical');
    });

    QUnit.test('Controls layout attribute', function(assert) {
        const controls = document.querySelector('.controls');
        
        Reveal.configure({ controlsLayout: 'bottom-right' });
        assert.strictEqual(controls.getAttribute('data-controls-layout'), 'bottom-right');
        
        Reveal.configure({ controlsLayout: 'edges' });
        assert.strictEqual(controls.getAttribute('data-controls-layout'), 'edges');
    });

    QUnit.test('Controls back arrows attribute', function(assert) {
        const controls = document.querySelector('.controls');
        
        Reveal.configure({ controlsBackArrows: 'faded' });
        assert.strictEqual(controls.getAttribute('data-controls-back-arrows'), 'faded');
        
        Reveal.configure({ controlsBackArrows: 'hidden' });
        assert.strictEqual(controls.getAttribute('data-controls-back-arrows'), 'hidden');
    });
});
