/* ==========================================================================
   tool-logos.js
   Drop a logo for a tool into  assets/images/tools/  using the tool's name
   (lowercase) and it appears automatically — PNG, SVG, JPG, JPEG or WEBP:

     microsoft365   asana          monday       autodesk   matlab
     buildxact      hubspot        googleworkspace
     buildertrend   jobtread       autocad      bluebeam   planswift

   e.g.  assets/images/tools/autocad.png   or   autocad.svg
   If no file exists for a tool, its letter badge (e.g. "ACAD") stays.
   On hover the logo tile grows (see .tool:hover .logo-box in style.css).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const EXTENSIONS = ['png', 'svg', 'jpg', 'jpeg', 'webp'];

  document.querySelectorAll('.logo-box[data-logo]').forEach((box) => {
    const name = box.getAttribute('data-logo');

    function tryExtension(i) {
      if (i >= EXTENSIONS.length) return; // no logo supplied — keep the letter badge
      const src = `assets/images/tools/${name}.${EXTENSIONS[i]}`;
      const probe = new Image();
      probe.onload = () => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = ''; // decorative — the tool's name is printed beside it
        img.decoding = 'async';
        box.insertBefore(img, box.firstChild);
        box.classList.add('has-logo');
      };
      probe.onerror = () => tryExtension(i + 1);
      probe.src = src;
    }

    tryExtension(0);
  });
});
