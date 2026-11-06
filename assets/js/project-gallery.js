/* ==========================================================================
   project-gallery.js
   Each project card can show more than one photo. For a card with
   data-project-id="3", drop files named:
     assets/images/projects/project3-1.jpg
     assets/images/projects/project3-2.jpg
     assets/images/projects/project3-3.jpg
     ... up to data-max-photos (default 6)
   Only the files that actually exist are used — no code changes needed
   to add, remove, or reorder photos, just add/remove numbered files.

   Behaviour:
   - Photos stay hidden until the project card is hovered (or keyboard-
     focused / tapped on touch screens), then they pop up automatically.
   - With 2+ photos they cycle on their own while hovering; the cycling
     pauses while the pointer is on the photo itself so it can be clicked.
   - Clicking a photo opens it full screen (zoom in/out, pan, previous/
     next) — that viewer lives in script.js and is triggered by the
     .js-zoomable class + data-gallery attributes set below.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.proj-photo[data-project-id]').forEach(setupProjectGallery);
});

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function setupProjectGallery(container) {
  const id = container.getAttribute('data-project-id');
  const name = container.getAttribute('data-project-name') || `Project ${id}`;
  const maxPhotos = parseInt(container.getAttribute('data-max-photos') || '6', 10);

  const candidates = [];
  for (let i = 1; i <= maxPhotos; i++) {
    candidates.push(`assets/images/projects/project${id}-${i}.jpg`);
  }

  Promise.all(candidates.map(preloadImage)).then((results) => {
    const photos = results.filter(Boolean);
    if (!photos.length) return; // no real photos yet — keep the drawn placeholder as-is
    renderGallery(container, photos, name);
  });
}

function renderGallery(container, photos, name) {
  const icon = container.querySelector('.ph-icon');
  const label = container.querySelector('.ph-label');
  if (icon) icon.style.display = 'none';
  if (label) label.style.display = 'none';

  const multi = photos.length > 1;
  let index = 0;

  const img = document.createElement('img');
  img.className = 'proj-photo-img js-zoomable';
  img.src = photos[0];
  img.alt = multi ? `${name} — photo 1 of ${photos.length}` : name;
  img.setAttribute('data-gallery', JSON.stringify(photos));
  img.setAttribute('data-gallery-name', name);
  img.setAttribute('data-index', '0');
  img.setAttribute('tabindex', '0');
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', `View ${name} photos full screen`);
  container.insertBefore(img, container.firstChild);

  // magnifier hint — styled/revealed on hover by existing CSS (.zoom-hint)
  const hint = document.createElement('span');
  hint.className = 'zoom-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>';
  container.append(hint);

  if (!multi) return; // single photo — nothing to cycle

  const counter = document.createElement('span');
  counter.className = 'photo-counter';
  counter.textContent = `1 / ${photos.length}`;
  container.append(counter);

  function show(i) {
    index = i;
    img.src = photos[index];
    img.alt = `${name} — photo ${index + 1} of ${photos.length}`;
    img.setAttribute('data-index', String(index)); // viewer opens on THIS photo
    counter.textContent = `${index + 1} / ${photos.length}`;
  }

  // Respect reduced-motion: no auto-cycling (viewer still has next/previous).
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const card = container.closest('.project-card') || container;
  const touchOnly = window.matchMedia('(hover: none)').matches;
  let timer = null;
  let paused = false;

  function start() {
    if (timer) return;
    timer = setInterval(() => { if (!paused) show((index + 1) % photos.length); }, 1800);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    paused = false;
    show(0);
  }

  card.addEventListener('mouseenter', start);
  card.addEventListener('mouseleave', stop);
  card.addEventListener('focusin', (e) => {
    if (touchOnly || e.target.matches(':focus-visible')) start();
  });
  card.addEventListener('focusout', (e) => {
    if (!card.contains(e.relatedTarget)) stop();
  });

  // hold still while the pointer / keyboard is on the photo, so it can be clicked
  container.addEventListener('mouseenter', () => { paused = true; });
  container.addEventListener('mouseleave', () => { paused = false; });
  img.addEventListener('focus', () => { paused = true; });
  img.addEventListener('blur', () => { paused = false; });
}
