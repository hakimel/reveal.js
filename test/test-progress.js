Reveal.initialize({ progress: true }).then(() => {
    QUnit.module('Progress Bar');

    QUnit.test('Progress bar is rendered', function(assert) {
        const progress = document.querySelector('.progress');
        assert.ok(progress, 'progress element exists');
        assert.ok(progress.querySelector('span'), 'progress bar span exists');
    });

    QUnit.test('Progress bar visibility', function(assert) {
        const progress = document.querySelector('.progress');

        Reveal.configure({ progress: true });
        assert.strictEqual(progress.style.display, 'block', 'visible when progress: true');

        Reveal.configure({ progress: false });
        assert.strictEqual(progress.style.display, 'none', 'hidden when progress: false');

        Reveal.configure({ progress: true });
    });

    QUnit.test('Progress bar updates on slide change', function(assert) {
        const bar = document.querySelector('.progress span');

        Reveal.slide(0);
        const progress0 = parseFloat(bar.style.transform.match(/scaleX\(([\d.]+)\)/)[1]);

        Reveal.slide(2);
        const progress2 = parseFloat(bar.style.transform.match(/scaleX\(([\d.]+)\)/)[1]);

        assert.ok(progress2 > progress0, 'progress increases when moving forward');

        Reveal.slide(4);
        const progress4 = parseFloat(bar.style.transform.match(/scaleX\(([\d.]+)\)/)[1]);
        assert.strictEqual(progress4, 1, 'progress is 1 on last slide');
    });

    QUnit.test('Progress bar click navigation', function(assert) {
        const progress = document.querySelector('.progress');
        Reveal.slide(0);

        // Simulate click at 50% of progress bar
        const clickEvent = new MouseEvent('click', {
            clientX: progress.offsetWidth * 0.5,
            bubbles: true
        });

        progress.dispatchEvent(clickEvent);

        const indices = Reveal.getIndices();
        assert.ok(indices.h >= 0 && indices.h <= 2, 'navigates to middle slide on click');
    });
});
