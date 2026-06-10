import re
import html
import json
import shutil
from pathlib import Path

HTML = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook.html")
FILES = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook_files")
OUT = Path(r"d:\mohamed.shaban\extracted_fb.json")
PUBLIC = Path(r"d:\mohamed.shaban\public")

text = HTML.read_text(encoding="utf-8", errors="replace")

# Visible text extraction
visible = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)

def clean(s):
    s = html.unescape(s)
    s = re.sub(r"&nbsp;", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

text_chunks = [clean(c) for c in re.findall(r">([^<]{5,800})<", visible) if clean(c)]

# Posts near Cheef
posts = []
for chunk in text_chunks:
    if re.search(r"[\u0600-\u06FF]", chunk) and any(
        x in chunk.lower() or x in chunk
        for x in ["كفت", "حواو", "بانيه", "فراخ", "فوري", "متاح", "خصم", "عروض", "شوي", "تتبيل", "ارز", "أرز", "كيلو", "سيخ"]
    ):
        posts.append(chunk)

# Image references in HTML
local_images = []
for m in re.findall(r'\./Cheef Mohamed Shaban _ Facebook_files/([^"\']+\.(?:jpg|jpeg|png|webp|gif))', text, re.I):
    local_images.append(m)

for m in re.findall(r'Cheef Mohamed Shaban _ Facebook_files/([^"\']+\.(?:jpg|jpeg|png|webp|gif))', text, re.I):
    if m not in local_images:
        local_images.append(m)

# alt texts for food images
alt_texts = []
for m in re.findall(r'alt="([^"]{3,200})"', text):
    m = clean(m)
    if re.search(r"[\u0600-\u06FF]", m) or any(x in m.lower() for x in ["food", "طعام", "image", "photo", "may be"]):
        alt_texts.append(m)

# aria labels
aria = []
for m in re.findall(r'aria-label="([^"]{5,300})"', text):
    m = clean(m)
    if "صورة" in m or "طعام" in m or "تعليق" in m or "reaction" in m.lower():
        aria.append(m)

# List actual image files in folder
image_files = []
if FILES.exists():
    for p in FILES.iterdir():
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            image_files.append(p.name)

# JSON message texts from scripts
messages = set()
for block in re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', text, re.DOTALL):
    for m in re.findall(r'"message"\s*:\s*\{"text"\s*:\s*"((?:\\.|[^"\\])*)"', block):
        try:
            val = m.encode("utf-8").decode("unicode_escape")
        except Exception:
            val = m
        val = html.unescape(val)
        if re.search(r"[\u0600-\u06FF]", val) and len(val) > 10:
            messages.add(val)

result = {
    "posts": list(dict.fromkeys(posts))[:30],
    "local_images_in_html": local_images[:50],
    "alt_texts": list(dict.fromkeys(alt_texts))[:50],
    "aria": list(dict.fromkeys(aria))[:50],
    "image_files_in_folder": sorted(image_files),
    "messages": list(messages)[:30],
}

OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Image files: {len(image_files)}")
print(f"Local refs: {len(local_images)}")
print(f"Posts: {len(posts)}")
print(f"Messages: {len(messages)}")
for f in sorted(image_files)[:20]:
    print(" ", f)
