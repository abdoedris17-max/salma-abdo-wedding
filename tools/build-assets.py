"""
Build the web asset for the Salma & Abdo invitation.

The invitation is ONE tall illustration with all text and decoration baked in.
Source artwork (git-ignored): Website @ final eng, 6pm 0627.png  (1176 x 11506)

  base output : assets/invitation.webp   (primary)  +  assets/invitation.jpg  (fallback)

The source is downscaled to BASE_W (it renders in a <=480px column, so 960px stays
crisp at retina) — never upscaled. The clickable links are invisible <a> "hotspots"
in index.html, positioned as % of this image; if you re-export the artwork at a
different aspect ratio, re-check their alignment with ?debug=1.

Run from the project root:  python tools/build-assets.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Website @ final eng, 6pm 0627.png"
OUT = ROOT / "assets"

BASE_W = 960          # web width (2x a <=480 column); capped at the source width (no upscale)
WEBP_QUALITY = 88
JPEG_QUALITY = 86


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def build_base():
    img = Image.open(SRC)
    sw, sh = img.size
    w = min(BASE_W, sw)                       # never upscale
    h = round(sh * w / sw)
    base = img.convert("RGB").resize((w, h), Image.LANCZOS)
    webp = OUT / "invitation.webp"
    jpg = OUT / "invitation.jpg"
    base.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
    base.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"BASE source {sw}x{sh} -> web {w}x{h}")
    print(f"  invitation.webp (q{WEBP_QUALITY}) = {kb(webp):6.0f} KB")
    print(f"  invitation.jpg  (q{JPEG_QUALITY}) = {kb(jpg):6.0f} KB")
    print(f"\nUpdate the <img>/<source> in index.html to width={w} height={h} and bump ?v=.")
    return w, h


if __name__ == "__main__":
    build_base()
    print("\nDone -> assets/  (zoom the text to verify crispness; bump ?v= in index.html)")
