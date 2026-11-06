# Lourence Jude Dayonot — Electrical Engineer Portfolio

A single-page portfolio site for a training-backed Solar Electrical Engineer, styled as a blueprint / takeoff-sheet: navy background, gold accent, mono data type.

## How to view it

Just open `index.html` in a browser — no build step, no server required. Everything is plain HTML/CSS/JS.

> Tip: some browsers restrict local `file://` access for things like `fetch`. This site doesn't use `fetch`, so double-clicking `index.html` works fine. If you ever add something that does need a server, run `python3 -m http.server` inside this folder and open `http://localhost:8000`.

## Folder structure

```
Portfolio/
├── index.html                 Main page — all sections live here
├── README.md                  This file
├── favicon.ico                Browser tab icon (generated — swap for your own if you like)
├── LICENSE
│
└── assets/
    ├── css/
    │   ├── variables.css      Colors, fonts, layout tokens — start here to re-theme
    │   ├── style.css          Base styles + every component
    │   ├── responsive.css     Breakpoints (tablet, mobile)
    │   └── animations.css     Scroll-reveal + transition rules
    │
    ├── js/
    │   ├── script.js          Main entry point (footer year, lightbox)
    │   ├── navbar.js          Mobile menu open/close
    │   ├── hero-glow.js       Cursor-follow light in the hero section
    │   ├── project-gallery.js Multi-photo galleries per project card
    │   └── animations.js      Reveal-on-scroll (IntersectionObserver)
    │
    ├── images/
    │   ├── profile/           Your headshot
    │   ├── hero/               Optional background photo for the hero section
    │   ├── projects/           Project photos (5 slots)
    │   ├── process/            Optional icons for the 4 process steps
    │   ├── tools/               Software logos
    │   ├── suppliers/           Supplier logos
    │   ├── icons/                Contact/social icons (already included, ready to use)
    │   └── ui/                    Decorative textures (already included)
    │
    ├── documents/               Optional downloadable files (not linked from the site by default)
    └── fonts/                    Empty — the site currently loads fonts from Google Fonts
```

## Adding your own content — exact filenames to use

The page already points at these paths. Drop a file in with the **exact name below** and it appears automatically — no code changes needed. If a file is missing, the site quietly falls back to a matching on-brand placeholder, so nothing looks broken in the meantime.

| Slot | Expected file | Notes |
|---|---|---|
| Your photo | `assets/images/profile/lourence-dayonot.jpg` | Falls back to `profile-placeholder.png` (included), then to a drawn icon. |
| Hero background | `assets/images/hero/blueprint-bg.jpg` | Optional. Sits behind the grid pattern at low opacity. |
| Project photos | `assets/images/projects/project1-1.jpg`, `project1-2.jpg`, … | Each project can hold **multiple photos** — see "Multiple photos per project" below. |
| Process icons | `assets/images/process/quantity-takeoff.png`, `market-price.png`, `verification.png`, `final-review.png` | Optional — shown inside the numbered circles. |
| Tool logos | `assets/images/tools/<name>.png` (or `.svg`, `.jpg`, `.jpeg`, `.webp`) | Names (lowercase): `microsoft365`, `asana`, `monday`, `autodesk`, `matlab`, `buildxact`, `hubspot`, `googleworkspace`, `buildertrend`, `jobtread`, `autocad`, `bluebeam`, `planswift`. |
| Supplier logos | `assets/images/suppliers/*.png` | Not used on this site. |

If you ever want a downloadable file (résumé, certifications, etc.), drop it in `assets/documents/` and add a link to it from the Contact section, e.g. `<a href="assets/documents/yourfile.pdf" download>Download</a>`.

## Multiple photos per project

Each of the 3 project cards can hold several photos, not just one. Photos stay hidden until you hover a project card with the mouse (on a phone/tablet, tap the card; with a keyboard, Tab onto it). They then pop up automatically and, if there are 2+, cycle on their own while you hover — the cycling pauses while the pointer is on the photo. **Click (or tap) a photo to open it full screen**, with zoom in / zoom out, 1:1 reset, drag-to-pan, previous/next arrows, and Esc to close.

**Naming pattern:** `assets/images/projects/project{N}-{photo number}.jpg`, where `N` is the card number (1–3).

For example, to give project 3 four photos:

```
assets/images/projects/project3-1.jpg
assets/images/projects/project3-2.jpg
assets/images/projects/project3-3.jpg
assets/images/projects/project3-4.jpg
```

Notes:
- Up to **6 photos per project** are supported out of the box. To allow more, open `index.html`, find the project's `<div class="proj-photo" ...>` and raise the `data-max-photos="6"` number.
- You don't need all 6 slots filled — the site checks which numbered files actually exist and only uses those. A project with just `project3-1.jpg` shows that single photo on hover; add `project3-2.jpg` and the photos start cycling automatically on hover, with a small "1 / 2" counter.
- No HTML or JS edits needed to add/remove/reorder photos — just add or delete the numbered files.
- This is handled by `assets/js/project-gallery.js`.




## Background picture

The page background is the isometric city / solar-field line drawing in `assets/images/bg/`
(`city-bg.webp`, with `city-bg.jpg` as a fallback for very old browsers). It is a fixed layer behind the
whole page. Because the picture is portrait and the page is landscape, it pans slowly as you scroll —
skyline and solar fields behind the hero, the glowing city behind the middle sections, the dark base
behind the footer. (With "reduce motion" turned on, it stays still.)

- **Swap the picture:** replace both files in `assets/images/bg/` (keep the names). If the new picture has
  a different shape, update `0.6709` (width ÷ height) in the `.site-bg img` rule in `assets/css/style.css`
  and the `width`/`height` on the `<img>` in `index.html`. A tall/portrait picture works best.
- **Make it brighter or dimmer:** change `--bg-dim-top` / `--bg-dim-bottom` at the top of the `.site-bg`
  rule in `assets/css/style.css` (0 = picture at full strength, 1 = fully dark). The current values were
  chosen by measuring text contrast over the picture; if you make it much brighter, check that the small
  text is still easy to read.
- **Remove it:** delete the `<div class="site-bg">` block near the top of `<body>` in `index.html`.

## Placeholder content to replace before publishing

- **Project photos** — the three project cards are written from your resume; add photos to `assets/images/projects/` (see above).
- **Contact details** — phone/WhatsApp, email and LinkedIn are set in the Contact section of `index.html` (the footer LinkedIn icon uses the same profile link). Update them there if they ever change.

## Notes on logos

Tool logos aren't included as files — those are other companies' trademarks, so use the official logo files supplied to you (usually available on each company's press/brand page) and drop them into `assets/images/tools/`, named after the tool (e.g. `autocad.png`, `asana.svg`). PNG, SVG, JPG, JPEG and WEBP all work, and no code changes are needed. Until a logo is added, the tool shows a clean letter badge (e.g. "ACAD"). The Tools strip shows logos only: there's no scrollbar — hover the left or right edge and it scrolls by itself (faster nearer the edge; on phones just swipe), and hovering a logo makes it grow and reveals that tool's name. To rename a tool or change its order, edit the `<div class="tool">` entries in the Tools section of `index.html`.

Logos sit on a light tile so any brand colours stay readable. If your logos are white/light-coloured, change `--logo-tile` in `assets/css/variables.css` to a dark colour (e.g. `#070a0e`).
