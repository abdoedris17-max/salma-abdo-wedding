# Salma & Abdo — Wedding Invitation

A mobile‑first wedding invitation for **Salma & Abdo** — Friday 18th September 2026,
Cairo, Egypt. Plain **HTML + CSS + vanilla JS**, deployed to GitHub Pages.

## How it works
The invitation is **one tall illustration** (`assets/invitation.webp`, with a `.jpg`
fallback) shown full‑width in a centered ~480px column. All the text is baked into the
artwork. On top sits an **invisible layer of `<a>` "hotspots"** — one over each printed
link/button — positioned in **%** of the image so they track it at any screen width.

- The hotspot coordinates live inline in `index.html` (`top/left/width/height` as %).
- To re‑align a hotspot, append **`?debug=1`** to the URL (e.g.
  `…/index.html?debug=1`) to tint every hotspot red, nudge the inline %, repeat.

## ⭐ Things to fill in (one‑line swaps in `script.js` → `CONFIG`)
| What | Where | State |
|---|---|---|
| **RSVP** link | `CONFIG.RSVP_FORM_URL` | placeholder → RSVP hotspot is **inert** until set |
| **Marriott** special rate | `CONFIG.MARRIOTT_SPECIAL_RATE_URL` | `"#"` → inert until set |
| **Hyatt** special rate | `CONFIG.HYATT_SPECIAL_RATE_URL` | `"#"` → inert until set |
| Venue map | `CONFIG.VENUE_MAP_URL` | set ✅ (9 Pyramids Lounge, Giza) |
| Crowne Plaza Arkan | `index.html` (its hotspot `href`) | maps‑search fallback — replace with the real booking URL if you have it |

> Because the labels are baked into the image, an inert hotspot's printed button still
> shows but does nothing until you paste its URL. The other ~19 links work immediately.

## File structure
```
index.html        # the image + the invisible hotspot layer (24 links)
styles.css        # the column + transparent hotspot styling + ?debug tint
script.js         # CONFIG (swap-later URLs) + wires venue/special-rate/RSVP hotspots
assets/
  invitation.webp # the illustration (primary)
  invitation.jpg  # fallback
  favicon.svg
tools/build-assets.py   # regenerates invitation.webp/.jpg from the source PNG
```
The heavy source artboard (`assets/Artboard 11@2f2x.PNG`, ~7.7 MB) is **git‑ignored** —
it's never committed. Regenerate the web images with `python tools/build-assets.py`.

## Notes on the artwork text (baked in — not editable in code)
The current illustration reads **6PM**, **9 Arena**, lists **Four Season Nile Plaza
twice**, includes **Crowne Plaza Arkan**, spells the restaurant **"Majeez"** (its link
points to the correct *Mazeej Balad*), and the transport line shows **"Inny"**. To change
any printed text, the designer updates the artboard and we re‑run `build-assets.py`.

## Deploy / updates
Auto‑deploys to GitHub Pages on push to `main`
(https://abdoedris17-max.github.io/salma-abdo-wedding/). When you ask to "push it",
changes are committed and pushed; the Action republishes in ~1 minute. Bump the `?v=`
query on `styles.css`/`script.js`/images when they change so phones pick up updates.
