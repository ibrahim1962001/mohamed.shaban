import re
import html
from pathlib import Path

p = Path(r"c:\Users\smart\Downloads\Facebook.html")
text = p.read_text(encoding="utf-8", errors="replace")

# Remove scripts/styles
visible = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)

# Decode HTML entities in attributes and text
def clean(s):
    s = html.unescape(s)
    s = re.sub(r"&nbsp;", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

# Extract all text nodes with some context
text_chunks = re.findall(r">([^<]{5,800})<", visible)
text_chunks = [clean(c) for c in text_chunks if clean(c)]

lines = []
lines.append("=== ALL ARABIC / FOOD / BUSINESS TEXT ===")
for c in text_chunks:
    if re.search(r"[\u0600-\u06FF]", c) or any(
        x in c.lower()
        for x in [
            "cheef", "shaban", "kofta", "kfta", "marinade", "meal prep",
            "poultry", "delivery", "order", "price", "egp", "جنيه", "كilo",
            "كيلو", "كفت", "تتبيل", "وجبات", "فراخ", "متاح", "خصم", "مندوب",
        ]
    ):
        if c not in lines:
            lines.append(c)

lines.append("\n=== PROFILE INTRO FIELDS ===")
for pat in [
    r"Poultry Marinades[^<]{0,100}",
    r"Meal Prep Specialist[^<]{0,100}",
    r"تتبيلات[^<]{0,100}",
    r"تجهيز الوجبات[^<]{0,100}",
    r"Verified[^<]{0,50}",
    r"موثق[^<]{0,50}",
    r"Followers[^<]{0,50}",
    r"متابع[^<]{0,50}",
    r"Following[^<]{0,50}",
    r"Works at[^<]{0,100}",
    r"يعمل[^<]{0,100}",
    r"Lives in[^<]{0,100}",
    r"يسكن[^<]{0,100}",
    r"From[^<]{0,100}",
    r"متاح فوري[^<]{0,200}",
    r"خصم[^<]{0,200}",
    r"كفت[^<]{0,200}",
    r"تتبيل[^<]{0,200}",
    r"فراخ[^<]{0,200}",
    r"وجب[^<]{0,200}",
    r"جنيه[^<]{0,200}",
]:
    for m in re.findall(pat, visible, re.I):
        lines.append(clean(m))

# Extract posts - look for patterns where Cheef name appears near Arabic text
lines.append("\n=== POSTS NEAR PROFILE CONTENT ===")
# Split by Cheef Mohamed Shaban occurrences
parts = re.split(r"(Cheef Mohamed Shaban)", visible, flags=re.I)
for i in range(1, len(parts), 2):
    chunk = parts[i + 1] if i + 1 < len(parts) else ""
    chunk = re.sub(r"<[^>]+>", " ", chunk)
    chunk = clean(chunk)[:1500]
    # get meaningful Arabic sentences
    sentences = re.findall(r"[\u0600-\u06FF][\u0600-\u06FF\s\d،,.:!؟\-]+", chunk)
    for s in sentences:
        s = s.strip()
        if len(s) > 15 and s not in lines:
            lines.append(s)

# Image alt texts
lines.append("\n=== IMAGE ALT / ARIA ===")
for m in re.findall(r'alt="([^"]{5,300})"', text):
    m = clean(m)
    if re.search(r"[\u0600-\u06FF]", m) or "cheef" in m.lower() or "shaban" in m.lower():
        lines.append(m)

# aria-label
for m in re.findall(r'aria-label="([^"]{5,300})"', text):
    m = clean(m)
    if re.search(r"[\u0600-\u06FF]", m) or "cheef" in m.lower() or "food" in m.lower():
        lines.append(m)

content = "\n".join(dict.fromkeys(lines))  # dedupe preserve order
content = content.encode("utf-8", errors="replace").decode("utf-8")
Path(r"d:\mohamed.shaban\facebook_extract2.txt").write_text(content, encoding="utf-8")
print(f"Done: {len(lines)} lines")
