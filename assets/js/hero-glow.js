/* ==========================================================================
   hero-glow.js
   A soft light that follows the cursor across the hero section, purely
   a visual touch (see .hero-glow in style.css). Desktop pointer only —
   skipped on touch devices and for prefers-reduced-motion.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('heroSection');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (prefersReduced || isTouch) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
});
