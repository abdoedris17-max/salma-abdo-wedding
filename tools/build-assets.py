"""
Build web image assets from the source "Without Text" PNGs.

Quality is the priority (the artwork — especially the pyramid — must not soften):
  - <name>.png   : a verbatim copy of the original, full-resolution PNG (lossless)
  - <name>.webp  : high-quality WebP (q=92) for fast loading on modern browsers

The page uses <picture> with the WebP first and the PNG as a guaranteed-lossless
fallback. Because the art is displayed in a <= 480px column (downscaled ~2.4x from
the 1171px source), q92 WebP is visually identical to the PNG — verify by eye and,
if in any doubt, point the <img>/<source> at the PNG instead.

Run from the project root:  python tools/build-assets.py
"""

import shutil
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Without Text"
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)

# source filename  ->  clean URL-safe output stem
MAP = {
    "hero@3.5.png": "hero",
    "celebrations@3.5.png": "celebration",
    "cairo guide@3.5.png": "cairo-guide",
    "out and about@3.5.png": "out-and-about",
    "rsvp@3.5.png": "rsvp",
}

WEBP_QUALITY = 92  # high quality — visually lossless for this art at display size

# Some source exports have a stray bright edge row that shows as a hairline seam
# when stacked under the previous image. Trim those rows so the join is clean.
CROP_TOP = {"rsvp": 2}  # rsvp's row 0 is near-white; trim it


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


for src_name, stem in MAP.items():
    src = SRC / src_name
    img = Image.open(src).convert("RGB")

    top = CROP_TOP.get(stem, 0)
    if top:
        img = img.crop((0, top, img.width, img.height))

    png = OUT / f"{stem}.png"
    webp = OUT / f"{stem}.webp"
    if top:
        # cropped → re-encode (still lossless PNG)
        img.save(png, "PNG")
    else:
        # verbatim, lossless copy of the original
        shutil.copyfile(src, png)
    img.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)

    print(f"{stem:16} {img.width}x{img.height}   "
          f"png={kb(png):7.0f} KB   webp(q{WEBP_QUALITY})={kb(webp):6.0f} KB")

print("\nDone -> assets/")
