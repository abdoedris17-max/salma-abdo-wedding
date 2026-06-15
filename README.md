# Salma & Abdo — Wedding Invitation

A mobile‑first wedding invitation for **Salma & Abdo** — Friday 18th September 2026,
Cairo, Egypt.

Plain **HTML + CSS + vanilla JavaScript**. No framework, no build step. The whole
page is **one continuous, seamless vertical scroll**: five full‑bleed images stacked
edge‑to‑edge (no gaps, no snapping, no dividers), with the live text laid over each
image. Drop the folder on any static host (Netlify, Vercel, GitHub Pages).

---

## ⭐ Things to fill in before going live

All swap‑later values live in **one place**: the `CONFIG` object at the top of
[`script.js`](script.js). Edit the value, save, done.

| What | Constant in `script.js` | Current state |
|---|---|---|
| **RSVP Google Form link** | `RSVP_FORM_URL` | placeholder → button shows “RSVP link coming soon” until set |
| **Marriott Mena House special rate** | `MARRIOTT_SPECIAL_RATE_URL` | `"#"` → dimmed “coming soon” pill |
| **Hyatt Regency special rate** | `HYATT_SPECIAL_RATE_URL` | `"#"` → dimmed “coming soon” pill |
| **Transport wording** | `TRANSPORT_TEXT` | defaults to “You can use Uber, Careem, London Cab, or JTNY.” — **please confirm** |
| **Transport booking link (optional)** | `TRANSPORT_LINK_URL` / `TRANSPORT_LINK_LABEL` | empty → no button shown. Add a URL to show one. |
| Venue map (already confirmed) | `VENUE_MAP_URL` | 9 Pyramids Lounge, Giza ✅ |

> Any link left as `"#"`, empty, or the `«…»` token renders as a clearly‑marked,
> **non‑clickable** pill so the site never ships a dead link. Paste a real URL and it
> becomes a normal button. There is **no RSVP deadline** (by design).

### Still‑open items to confirm
1. **Transport** — confirm ride‑hailing wording, optionally add a booking link.
2. **Special rate** URLs/codes for Marriott Mena House and Hyatt Regency.
3. **RSVP** Google Form link.

---

## File structure

```
.
├── index.html          # The 5 stacked sections (image + text overlay each)
├── styles.css          # All styling — positions in %, font sizes in cqw
├── script.js           # CONFIG (swap-later values) + link wiring
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── hero.webp / .png            # WebP (q92) shown first; PNG = lossless fallback
│   ├── celebration.webp / .png
│   ├── cairo-guide.webp / .png
│   ├── out-and-about.webp / .png
│   └── rsvp.webp / .png
├── tools/build-assets.py           # Regenerates assets from the source PNGs
├── Without Text/       # Original source backgrounds (not shipped)
└── Sample With Text/   # Original mockups (placement reference only — not shipped)
```

**To deploy:** upload `index.html`, `styles.css`, `script.js`, and `assets/`. The
`Without Text/`, `Sample With Text/`, `tools/`, and `.claude/` folders are not needed
in production.

---

## How it works (so future edits are easy)

- **Seamless scroll:** each section is `position: relative; line-height: 0` with a
  full‑width `<img>` (`width:100%; height:auto; display:block`). The image’s natural
  aspect ratio sets the section height, and sections butt together with **zero gap**,
  so the five images read as one continuous artwork. No `scroll-snap`, no `100vh`.
- **Text locked to the art:** everything sits in a centred `max-width: 480px` column
  with `container-type: inline-size`. Each section has an `position:absolute; inset:0`
  overlay; text blocks are positioned with **percentages** and sized in **`cqw`**
  (1cqw = 1% of the column width). So the text scales in lockstep with the image and
  lands in the same spot at 360 / 390 / 480px. (Verified: no gaps, no overflow, text
  fits within every section at all three widths.)
- **Image quality:** full‑resolution source art. Modern browsers load a high‑quality
  WebP (quality 92 — visually identical to the original at display size); the PNG is a
  lossless fallback for older browsers. The hero loads eagerly; the rest are
  `loading="lazy"`. If you ever see softening, force the PNG by deleting the matching
  `<source>` line in `index.html`.
- **Type & colour:** Cormorant Garamond throughout; only deep navy `#1B2A4A` and cream
  `#F5F0E8`. Navy text on the light sections (Hero, Celebration, RSVP); cream on the
  dark‑artwork sections (Cairo Guide, Out & About). Legibility‑critical lines (parents’
  names, “Kiss your little ones…”) use weight 500 + a subtle text halo.

### Tweaking text position or size
Open [`styles.css`](styles.css). Each section has its own block (e.g. `#hero …`,
`#celebration …`). Change a `top: %` to move a block vertically, or a `…cqw` value to
resize text. Because both are relative to the column, the change holds at every width.

---

## Editing content

- **Text** (names, hotels, sights, restaurants): edit [`index.html`](index.html) — one
  clearly commented `<section>` per screen.
- **Per‑couple links:** edit `CONFIG` in [`script.js`](script.js) (table above). The
  sights/restaurants map links are plain `<a href>`s in `index.html`.
- **Colours / font:** the `:root` tokens at the top of [`styles.css`](styles.css).

---

## Regenerating the images

If you re‑export the art, drop the new PNGs into `Without Text/` (same names) and run:

```bash
python tools/build-assets.py     # needs Python + Pillow  (pip install Pillow)
```

It writes the full‑res PNG + q92 WebP for each background into `assets/`.

---

## Running locally / viewing on your phone

Any static server works:

```bash
python -m http.server 8000        # then open http://localhost:8000
```

To view on a phone on the **same Wi‑Fi/hotspot**, serve on all interfaces and browse to
your computer’s LAN IP:

```bash
python -m http.server 8000 --bind 0.0.0.0
# phone → http://<your-computer-LAN-IP>:8000
```

On Windows you may need to allow the port through the firewall (one‑time, in an
**Administrator** PowerShell):

```powershell
New-NetFirewallRule -DisplayName "Wedding Site (port 8000)" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8000 -Profile Any
```
