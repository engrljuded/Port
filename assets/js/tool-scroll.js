/* ==========================================================================
   tool-scroll.js
   The "Tools I can use" strip has no scrollbar. Instead:
     - hover the RIGHT edge  -> it scrolls right automatically
     - hover the LEFT edge   -> it scrolls left automatically
   The closer the pointer is to the very edge, the faster it goes; it eases
   in and out, and stops the moment the pointer leaves the edge zone.
   Touch screens scroll by swiping as normal (this only reacts to a mouse/pen).
   Keyboard users can Tab through the tools — focusing one scrolls it into view.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const strip = document.getElementById('toolStrip');
  const scroller = document.getElementById('toolScroll');
  if (!strip || !scroller) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_SPEED = reduceMotion ? 360 : 720;    // px per second at the very edge
  const EASE = 9;                                // higher = snappier acceleration

  let target = 0;      // speed we are heading toward (px/s, signed)
  let velocity = 0;    // current speed (px/s, signed)
  let pos = scroller.scrollLeft;
  let last = 0;
  let raf = null;

  /* ---- edge-zone geometry ------------------------------------------------ */
  function zoneWidth(width) {
    return Math.min(260, Math.max(110, width * 0.22));
  }

  function setTargetFromPointer(clientX) {
    const rect = strip.getBoundingClientRect();
    const x = clientX - rect.left;
    const zone = zoneWidth(rect.width);
    let t = 0; // -1 (far left edge) … 0 (centre) … +1 (far right edge)
    if (x < zone) t = -(zone - x) / zone;
    else if (x > rect.width - zone) t = (x - (rect.width - zone)) / zone;
    t = Math.max(-1, Math.min(1, t));
    target = Math.sign(t) * Math.pow(Math.abs(t), 1.6) * MAX_SPEED;
    updateEdges();
  }

  function stopTarget() {
    target = 0;
    updateEdges();
    start(); // let it ease to a halt
  }

  /* ---- fade / arrow state ------------------------------------------------ */
  function updateEdges() {
    const max = scroller.scrollWidth - scroller.clientWidth;
    const canLeft = scroller.scrollLeft > 4;
    const canRight = scroller.scrollLeft < max - 4;
    strip.toggleAttribute('data-can-left', canLeft);
    strip.toggleAttribute('data-can-right', canRight);
    // light up an arrow only while the pointer is in its zone AND there is more that way
    strip.classList.toggle('is-active-left', target < 0 && canLeft);
    strip.classList.toggle('is-active-right', target > 0 && canRight);
  }

  /* ---- animation loop ---------------------------------------------------- */
  function start() {
    if (raf === null) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    velocity += (target - velocity) * Math.min(1, dt * EASE);
    if (target === 0 && Math.abs(velocity) < 8) velocity = 0;

    if (velocity !== 0) {
      // if the person scrolled some other way (swipe / trackpad), re-sync
      if (Math.abs(scroller.scrollLeft - pos) > 1.5) pos = scroller.scrollLeft;
      const max = scroller.scrollWidth - scroller.clientWidth;
      pos = Math.max(0, Math.min(max, pos + velocity * dt));
      scroller.scrollLeft = pos;
      if ((pos <= 0 && velocity < 0) || (pos >= max && velocity > 0)) velocity = 0; // hit an end
    }

    strip.classList.toggle('is-scrolling', Math.abs(velocity) > 40);
    updateEdges();

    const atRest = velocity === 0 && (target === 0 || isAtEnd(target));
    if (atRest) {
      raf = null;
      strip.classList.remove('is-scrolling');
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function isAtEnd(dir) {
    const max = scroller.scrollWidth - scroller.clientWidth;
    return (dir < 0 && scroller.scrollLeft <= 0) || (dir > 0 && scroller.scrollLeft >= max - 1);
  }

  /* ---- events ------------------------------------------------------------ */
  strip.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; // never on touch
    setTargetFromPointer(e.clientX);
    start();
  });
  strip.addEventListener('pointerleave', stopTarget);
  strip.addEventListener('pointercancel', stopTarget);
  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') stopTarget();
  });

  scroller.addEventListener('scroll', updateEdges, { passive: true });
  window.addEventListener('resize', updateEdges);
  updateEdges();
});
