/* Local, decorative effects adapted from the user's promo reference. */
(() => {
  'use strict';
  const ambient = document.querySelector('.ambient');
  const content = document.querySelector('#pageContent');
  if (!ambient || !content) return;
  const mesh = document.createElement('div'); mesh.className = 'promo-mesh';
  const particles = document.createElement('div'); particles.className = 'promo-particles';
  ambient.append(mesh, particles);
  const narrow = matchMedia('(max-width:760px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  function populate() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < (narrow.matches ? 36 : 80); i++) {
      const dot = document.createElement('i');
      dot.className = 'promo-particle' + (i % 5 > 2 ? ' is-pink' : '');
      const size = 1 + (i * 7 % 4);
      dot.style.cssText = `left:${(i * 37.31) % 100}%;top:0;width:${size}px;height:${size}px;--duration:${5 + (i * 13 % 70) / 10}s;--delay:-${(i * 1.37) % 12}s;--drift:${i * 19 % 80 - 40}px`;
      fragment.append(dot);
    }
    particles.replaceChildren(fragment);
  }
  function entrances() {
    content.querySelectorAll('.home-hero>div,.lesson-heading,.learning-objective,.lesson-explanation,.rule-box,.demo-panel,.quiz-panel').forEach((el, i) => {
      el.classList.add('promo-enter');
      el.style.setProperty('--promo-delay', `${Math.min(i, 4) * 100}ms`);
    });
  }
  let hovered = null;
  function resetTilt() {
    if (!hovered) return;
    hovered.style.removeProperty('--tilt-x');
    hovered.style.removeProperty('--tilt-y');
    hovered = null;
  }
  content.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || document.body.classList.contains('motion-paused')) return;
    const card = event.target.closest('.home-lesson-card');
    if (!card) { resetTilt(); return; }
    if (hovered !== card) resetTilt();
    hovered = card;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / (rect.height / 2) * 8}deg`);
    card.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / (rect.width / 2) * 8}deg`);
  });
  content.addEventListener('pointerleave', resetTilt);
  new MutationObserver(entrances).observe(content, {childList:true});
  new MutationObserver(resetTilt).observe(document.body, {attributes:true,attributeFilter:['class']});
  narrow.addEventListener('change', populate);
  reduced.addEventListener('change', resetTilt);
  populate(); entrances();
})();
