"""
Build a single-page, shareable PDF of the invitation with every link clickable.

Embeds the high-res artwork (Artboard 11@3x version final final.png) as one tall
page and overlays the 25 hotspot links from index.html as PDF link annotations
(the 4 JS-wired URLs are read from script.js CONFIG). The % positions are the
same ones the website uses, so the links land on the printed labels.

Run from the project root:  python tools/make_pdf.py
Output: "Salma and Abdo Wedding Invitation.pdf"
"""
import re, html as htmllib
from pathlib import Path
from PIL import Image
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Artboard 11@3x version final final.png"
OUT = ROOT / "Salma and Abdo Wedding Invitation.pdf"
PAGE_W = 480.0                       # points; height follows the image aspect

# 1. artwork -> embedded JPEG (crisp, but compact enough for WhatsApp)
im = Image.open(SRC).convert("RGB")
IW, IH = im.size
tmp = ROOT / "_work"; tmp.mkdir(exist_ok=True)
jpg = tmp / "_invite_pdf.jpg"
im.save(jpg, "JPEG", quality=90, optimize=True, progressive=True)

# 2. resolve the 4 JS-wired URLs from script.js CONFIG
js = (ROOT / "script.js").read_text(encoding="utf-8")
cfg = lambda name: re.search(name + r'\s*:\s*"([^"]+)"', js).group(1)
WIRED = {
    'data-map="venue"':            cfg("VENUE_MAP_URL"),
    'data-special-rate="marriott"': cfg("MARRIOTT_SPECIAL_RATE_URL"),
    'data-special-rate="hyatt"':    cfg("HYATT_SPECIAL_RATE_URL"),
    'data-rsvp':                    cfg("RSVP_FORM_URL"),
}

# 3. parse the 25 hotspots (style % + href, or a data-* wired link)
page = (ROOT / "index.html").read_text(encoding="utf-8")
hotsec = re.search(r'<nav class="hotspots".*?</nav>', page, re.DOTALL).group(0)
links = []
for m in re.finditer(r'<a class="hotspot"(.*?)></a>', hotsec, re.DOTALL):
    a = m.group(1)
    st = re.search(r'top:([\d.]+)%;\s*left:([\d.]+)%;\s*width:([\d.]+)%;\s*height:([\d.]+)%', a)
    top, left, w, h = map(float, st.groups())
    hm = re.search(r'href="([^"]+)"', a)
    if hm:
        url = htmllib.unescape(hm.group(1))
    else:
        url = next((u for key, u in WIRED.items() if key in a), None)
    lab = re.search(r'aria-label="([^"]+)"', a)
    links.append((url, top, left, w, h, lab.group(1) if lab else ""))

assert len(links) == 25, f"expected 25 hotspots, found {len(links)}"

# 4. one tall page: draw the art, overlay invisible clickable link rects
PAGE_H = PAGE_W * IH / IW
c = canvas.Canvas(str(OUT), pagesize=(PAGE_W, PAGE_H))
c.setTitle("Salma & Abdo - 18 September 2026")
c.setAuthor("Salma & Abdo")
c.setSubject("Wedding invitation - Friday 18 September 2026, 9 Arena, Pyramids of Giza, Cairo")
c.drawImage(str(jpg), 0, 0, width=PAGE_W, height=PAGE_H)
n = 0
for url, top, left, w, h, lab in links:
    if not url:
        print("  ! no URL for:", lab); continue
    x0 = left / 100 * PAGE_W
    x1 = (left + w) / 100 * PAGE_W
    ytop = PAGE_H * (1 - top / 100)            # PDF origin is bottom-left -> flip Y
    ybot = PAGE_H * (1 - (top + h) / 100)
    c.linkURL(url, (x0, ybot, x1, ytop), relative=0, thickness=0)
    n += 1
c.showPage()
c.save()

print(f"wrote {OUT.name}")
print(f"  page {PAGE_W:.0f}x{PAGE_H:.0f} pt, image {IW}x{IH}, {OUT.stat().st_size/1024/1024:.2f} MB")
print(f"  {n}/25 links embedded")
