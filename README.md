# Reasons — for Mena

A new little reason, every single day — plus a shareable card you can save as
a picture. Part of the **Love for Mena** collection.

**Live:** https://menaammarpro.github.io/love-reasons/

## What it does

- Shows one reason per day (the same all day, then it rotates at midnight)
- "Tell me another" for a random one whenever you want
- Generates a 1080×1080 card (with today's reason) you can download as a PNG
- Lists every reason on the page
- Installable PWA with offline support

## Editing the reasons

Open `js/reasons-data.js` and edit the `window.MENA_REASONS` array — one
reason per line. Add, remove, or reword them freely.

## Files

- `index.html` — the page
- `css/theme.css` — shared love-theme (copied from `_love-theme/`)
- `css/app.css` — page-specific styles
- `js/theme-main.js`, `js/effects.js` — shared behaviour/effects
- `js/reasons-data.js` — the reasons
- `js/app.js` — daily pick, card drawing, download
- `manifest.webmanifest`, `sw.js` — PWA
- `assets/` — favicon and icons

## Run locally

```powershell
py -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Static site, deployed with GitHub Pages from `main`.

## License

Creative Commons BY-NC-ND 4.0 — see [`LICENSE`](LICENSE).
© 2026 Ammar (MenaAmmarPro). Made with care for Mena.
