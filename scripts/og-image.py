#!/usr/bin/env python3
"""Generate public/og-image.png (1200x630) for link previews.

Run manually after changing the name or role in content/profile.json:
    python3 scripts/og-image.py
Requires Pillow and the DejaVu fonts (standard on Ubuntu).
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent
profile = json.loads((root / "content/profile.json").read_text(encoding="utf-8"))
fonts = Path("/usr/share/fonts/truetype/dejavu")

W, H = 1200, 630
green, paper, lime, muted = "#173b32", "#fbfaf6", "#d9f18e", "#b7c8b9"
img = Image.new("RGB", (W, H), green)
d = ImageDraw.Draw(img)

bold = lambda s: ImageFont.truetype(str(fonts / "DejaVuSans-Bold.ttf"), s)
regular = lambda s: ImageFont.truetype(str(fonts / "DejaVuSans.ttf"), s)
serif = lambda s: ImageFont.truetype(str(fonts / "DejaVuSerif-Italic.ttf"), s)

x = 80
d.text((x, 70), "DN", font=bold(56), fill=paper)
d.text((x + d.textlength("DN", font=bold(56)), 70), ".", font=bold(56), fill=lime)
d.text((x, 205), profile["name"], font=bold(76), fill=paper)

# Role, wrapped to the available width.
words, lines, line = profile["role"].split(), [], ""
for w in words:
    trial = f"{line} {w}".strip()
    if d.textlength(trial, font=serif(44)) > W - 2 * x:
        lines.append(line)
        line = w
    else:
        line = trial
lines.append(line)
y = 315
for ln in lines:
    d.text((x, y), ln, font=serif(44), fill=lime)
    y += 58

tracks = "   ·   ".join(t["label"] for t in profile["tracks"])
d.text((x, H - 110), tracks, font=regular(28), fill=muted)
d.text((x, H - 66), profile["siteUrl"].replace("https://", ""), font=regular(24), fill=muted)

out = root / "public/og-image.png"
img.save(out, optimize=True)
print(f"Wrote {out.relative_to(root)}")
