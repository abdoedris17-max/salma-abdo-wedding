"""
Build the web image assets from the source illustration.

The whole invitation is now a single tall artwork with all text baked in:
  source : assets/Artboard 11@2f2x.PNG   (781 x 7427, ~7.7 MB — git-ignored, never committed)
  output : assets/invitation.webp  (primary, high quality)
           assets/invitation.jpg   (fallback for the rare non-WebP browser)

Width is left unchanged (781px). It renders in a <= 480px column, so it's
downscaled and stays crisp. The baked-in TEXT must stay sharp — after building,
zoom the output to 200-300% and check the lettering; if it softens, raise
WEBP_QUALITY toward 95 (PNG is a last resort because of its size).

Run from the project root:  python tools/build-assets.py
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "Artboard 11@2f2x.PNG"
OUT = ROOT / "assets"

WEBP_QUALITY = 92   # visually lossless for this art at display size
JPEG_QUALITY = 90   # progressive fallback, also well under the push-size danger zone


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


img = Image.open(SRC).convert("RGB")   # flatten any alpha onto opaque RGB

webp = OUT / "invitation.webp"
jpg = OUT / "invitation.jpg"
img.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
img.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

print(f"source {SRC.name}: {img.width}x{img.height}")
print(f"invitation.webp (q{WEBP_QUALITY}) = {kb(webp):6.0f} KB")
print(f"invitation.jpg  (q{JPEG_QUALITY}) = {kb(jpg):6.0f} KB")
print("Done -> assets/   (zoom the text to verify crispness)")
