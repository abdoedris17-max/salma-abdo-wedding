"""
Build the web assets for the Salma & Abdo invitation.

The invitation is one tall artwork with all text baked in. The *new* base is the
"no assets" artboard 16 (decorative palms/discs/florals/birds removed so they can be
re-added as animated overlays):

  base source : Artboard No assets/Artboard 16@3.f no assets vf.png   (1177 x 12067, git-ignored)
  base output : assets/invitation.webp   (primary)  +  assets/invitation.jpg  (fallback)

  deco source : Artboard No assets/Assets to be animated/Asset NN@2x.png  (git-ignored cutouts)
  deco output : assets/deco/<slug>.webp  (one per entry in tools/deco_manifest.json)

The base is downscaled to BASE_W (renders in a <=480px column → stays crisp; zoom the
output text to 200-300% to check). Each cutout is cropped to its alpha content and
downscaled so its on-page size is ~2x its displayed width (retina) — never upscaled.

Run from the project root:  python tools/build-assets.py
"""

from pathlib import Path
import json
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Artboard No assets" / "Artboard 16@3.f no assets vf.png"
DECO_SRC_DIR = ROOT / "Artboard No assets" / "Assets to be animated"
OUT = ROOT / "assets"
DECO_OUT = OUT / "deco"
MANIFEST = ROOT / "tools" / "deco_manifest.json"

BASE_W = 960          # web width (2x a <=480 column)
WEBP_QUALITY = 88     # base; bump toward 95 if baked text softens
JPEG_QUALITY = 86
DECO_QUALITY = 84     # cutouts (alpha)
DECO_RETINA = 2.0     # export each cutout at ~2x its on-page width
BUDGET_KB = 1500      # warn if total deco transfer exceeds this


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def build_base():
    img = Image.open(SRC)
    sw, sh = img.size
    out_h = round(sh * BASE_W / sw)
    base = img.convert("RGB").resize((BASE_W, out_h), Image.LANCZOS)
    webp = OUT / "invitation.webp"
    jpg = OUT / "invitation.jpg"
    base.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
    base.save(jpg, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    print(f"BASE source {sw}x{sh} -> web {BASE_W}x{out_h}")
    print(f"  invitation.webp (q{WEBP_QUALITY}) = {kb(webp):6.0f} KB")
    print(f"  invitation.jpg  (q{JPEG_QUALITY}) = {kb(jpg):6.0f} KB")
    return BASE_W, out_h


DUR = {"palm": 8.5, "disc": 9.0, "star": 6.5, "floral": 8.0, "sparkle": 5.5}


def build_deco():
    if not MANIFEST.exists():
        print("\nno deco_manifest.json yet — skipping cutout export")
        return
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    items = data.get("deco", [])
    DECO_OUT.mkdir(parents=True, exist_ok=True)
    print(f"\nDECO ({len(items)} cutouts) -> assets/deco/")
    total = 0.0
    tags = []
    for i, it in enumerate(items):
        slug = it["slug"]
        src = DECO_SRC_DIR / it["src"]
        im = Image.open(src).convert("RGBA")
        bbox = im.getchannel("A").getbbox()     # crop padded canvas to content
        im = im.crop(bbox)
        cw, ch = im.size
        target_px = round(it["width"] / 100 * BASE_W * DECO_RETINA)
        target_px = min(target_px, cw)          # never upscale
        if target_px < cw:
            im = im.resize((target_px, round(ch * target_px / cw)), Image.LANCZOS)
        ew, eh = im.size
        p = DECO_OUT / f"{slug}.webp"
        im.save(p, "WEBP", quality=DECO_QUALITY, method=6)
        size = kb(p); total += size
        print(f"  {slug:<26} {ew:>4}x{eh:<4} = {size:6.1f} KB   (w {it['width']:.1f}%)")

        cls = it["class"]
        classes = f"deco {cls}"
        if it.get("flip"): classes += " flip"
        if it.get("parallax"): classes += " is-parallax"
        dur = DUR.get(cls, 8.0) + (i % 3) * 0.4          # per-element variance
        fdelay = round((i * 0.47) % 4, 2)                 # desync the float loop
        edelay = round((i % 6) * 0.12, 2)                 # stagger the entrance
        style = (f"--top:{it['top']}%;--left:{it['left']}%;--w:{it['width']}%;"
                 f"--dur:{dur:.1f}s;--fdelay:-{fdelay}s;--edelay:{edelay}s")
        tags.append(f'        <img class="{classes}" src="assets/deco/{slug}.webp?v=1" '
                    f'width="{ew}" height="{eh}" style="{style}" loading="lazy" decoding="async" alt="">')
    flag = "  <<< OVER BUDGET" if total > BUDGET_KB else ""
    print(f"  deco total = {total:6.0f} KB (budget {BUDGET_KB}){flag}")
    snippet = ROOT / "tools" / "deco_tags.html"
    snippet.write_text("\n".join(tags) + "\n", encoding="utf-8")
    print(f"  wrote {snippet.relative_to(ROOT)}  ({len(tags)} tags — paste into index.html)")


if __name__ == "__main__":
    build_base()
    build_deco()
    print("\nDone -> assets/  (zoom the text to verify crispness; bump ?v= in index.html)")
