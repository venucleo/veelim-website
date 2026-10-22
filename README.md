# veelim-website
Static website for Veelim &amp; The Big Vibe (veelimandthebigvibe.de), migrated from WordPress.

Plain HTML, CSS and a little JavaScript, with no build step.

- `index.html`: one-page site (Band, Musik, Termine, Kontakt, Gallery)
- `impressum.html`: Impressum and Datenschutz
- `css/style.css`, `js/main.js`: styles, mobile menu, gallery lightbox, click-to-load Spotify player
- `assets/`: logo, band photos, gallery (`gallery/` full size, `gallery/thumbs/` previews), hero video, self-hosted Montserrat font

## Run locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Updating

- **Gig dates:** edit the `<ul class="dates">` list in `index.html`.
- **Gallery photos:** add a large WebP to `assets/img/gallery/` and a ~640px one to `assets/img/gallery/thumbs/`, then add an `<a>` line in the gallery block.

## Differences from the WordPress site

- The contact form is replaced by an e-mail button (static hosting has no server to send mail).
- The Spotify player only loads after a click, and the font is self-hosted, so no data goes to Spotify or Google without consent.
- Google Site Kit (analytics) and the site search were not carried over.
- Images were converted to WebP and resized (about 70 MB down to 10 MB).
