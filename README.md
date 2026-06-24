# Salma & Abdo — Wedding Invitation

A mobile‑first wedding invitation for **Salma & Abdo** — Friday 18th September 2026,
**9 Arena, Pyramids of Giza**, Cairo, Egypt. Plain **HTML + CSS + vanilla JS**, deployed
to GitHub Pages.

## How it works
The invitation is **one tall illustration** (`assets/invitation.webp`, with a `.jpg`
fallback) shown full‑width in a centered ~480px column. All the text is baked into the
artwork. Over it sit two layers, inside `.invitation`:

1. **`.deco-layer`** — the decorative cutouts (palms, gold discs, florals, stars) as
   `<img class="deco">`, gently **animated** (soft fade‑in on scroll, slow idle float,
   light desktop parallax). Always `pointer-events:none` so taps fall through.
2. **`.hotspots`** — an invisible layer of `<a>` links over each printed label/button,
   positioned in **%** of the image so they track it at any width.

Stacking contract (load‑bearing): **image (z1) < deco‑layer (z2) < hotspots (z3)**.
Animations are pure transform/opacity, pause off‑screen, and are **fully disabled under
`prefers-reduced-motion`** (the decorations then just show, static). With JS off, the
decorations also show static — progressive enhancement.

- Hotspot coordinates live inline in `index.html` (`top/left/width/height` as %).
- To re‑align a hotspot, append **`?debug=1`** to the URL to tint every hotspot red.

## Regenerating the images (`tools/build-assets.py`)
The web images are built from git‑ignored source art:
```
python tools/build-assets.py
```
- **Base:** `Artboard No assets/Artboard 16@3.f no assets vf.png` (1177×12067) →
  `assets/invitation.webp` + `.jpg`, downscaled to **960px** wide.
- **Cutouts:** `tools/deco_manifest.json` is the single source of truth — for each entry it
  crops `Artboard No assets/Assets to be animated/<src>` to its content, downscales, and
  writes `assets/deco/<slug>.webp`. It also writes `tools/deco_tags.html` (the `<img>` tags
  to paste into `index.html`) with correct dimensions + per‑element animation timing.
- To **move / add / remove** a decoration: edit `tools/deco_manifest.json` (positions are %
  of the base), re‑run the script, paste the regenerated tags into the `.deco-layer` of
  `index.html`, and bump `?v=`.

## ⭐ Things to fill in
| What | Where | State |
|---|---|---|
| **RSVP** form | `CONFIG.RSVP_FORM_URL` | set ✅ (Google Form) |
| **Marriott / Mena House** special rate | `CONFIG.MARRIOTT_SPECIAL_RATE_URL` | set ✅ |
| **Hyatt Regency** special rate | `CONFIG.HYATT_SPECIAL_RATE_URL` | set ✅ |
| Venue map | `CONFIG.VENUE_MAP_URL` | set ✅ (9 Arena, Pyramids of Giza) |
| **Giza Palace** hotel | `index.html` (its hotspot `href`) | Maps‑search fallback — replace with the real booking/website URL |
| Crowne Plaza Arkan | `index.html` (its hotspot `href`) | Maps‑search fallback — replace if you have a booking URL |

All external links open in a new tab (`target="_blank" rel="noopener"`).

## File structure
```
index.html        # base image + .deco-layer (16 cutouts) + .hotspots (25 links)
styles.css        # column + deco stacking/animation + ?debug tint
script.js         # CONFIG (swap-later URLs) + link wiring + animation engine
assets/
  invitation.webp # the illustration (primary)   invitation.jpg (fallback)
  deco/*.webp     # the animated decorative cutouts
  favicon.svg
tools/
  build-assets.py     # regenerates invitation.* + deco/*.webp from source art
  deco_manifest.json  # source of truth for cutout placement + animation
```
Heavy source art is **git‑ignored** (`Artboard No assets/`, the artboard PNGs) — only the
compressed `assets/invitation.*` + `assets/deco/*.webp` ship.

## Notes on the artwork (baked in — not editable in code)
The current illustration reads **9 Arena, Pyramids of Giza**, **6:00 PM**, **Black Tie**;
hotels are Marriott Mena House, Hyatt Regency West, Four Season Nile Plaza, Giza Palace,
Steigenberger Pyramids, Crowne Plaza Arkan; restaurants are Sachi Park St., Khufu's, Andrea
New Giza, Pier88, Carlos Zamalek, Mazeej Balad, Em Sherif, Kasr El Kababgy, Zooba. To change
any printed text, the designer updates the artboard and we re‑run `build-assets.py`.

## Deploy / updates
Auto‑deploys to GitHub Pages on push to `main`
(https://abdoedris17-max.github.io/salma-abdo-wedding/). When you ask to "push it",
changes are committed and pushed; the Action republishes in ~1 minute. Bump the `?v=`
query on `styles.css`/`script.js`/images when they change so phones pick up updates.
