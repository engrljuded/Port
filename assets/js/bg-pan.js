/* ==========================================================================
   bg-pan.js
   The page background (assets/images/bg/city-bg.*) is a tall portrait
   picture on a landscape page, so only part of it fits on screen at once.
   This slowly pans it as you scroll: top of the page shows the top of the
   picture, the bottom of the page shows the bottom — so the whole drawing
   is seen over the course of the page.

   Uses a transform (GPU-composited, no repaint). Without JavaScript the
   picture simply stays at its top position. With "reduce motion" turned on
   it stays still, parked on the glowing part of the city.
   ========================================================================== */

(() => {
  const bg = document.querySelector('.site-bg');
  const img = bg && bg.querySelector('img');
  if (!img) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let queued = false;

  function apply() {
    queued = false;
    const travel = Math.max(0, img.offsetHeight - bg.clientHeight);   // how far the picture can move
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (reduceMotion || scrollable <= 0)
      ? 0.4                                                           // parked on the glowing city
      : Math.min(1, Math.max(0, window.scrollY / scrollable));
    img.style.setProperty('--bg-shift', `${(-progress * travel).toFixed(1)}px`);
  }

  function queue() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(apply);
    }
  }

  if (!reduceMotion) window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  if (img.complete) apply(); else img.addEventListener('load', apply);
  apply();
})();
