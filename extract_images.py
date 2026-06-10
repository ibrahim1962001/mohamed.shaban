import re, html, json, shutil
from pathlib import Path

HTML = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook.html")
FILES = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook_files")
OUT_DIR = Path(r"d:\mohamed.shaban\public\fb-images")
REVIEWS_DIR = Path(r"d:\mohamed.shaban\public\reviews")

text = HTML.read_text(encoding="utf-8", errors="replace")

# All local image refs
refs = list(dict.fromkeys(re.findall(
    r'Cheef Mohamed Shaban _ Facebook_files/([^"\']+\.(?:jpg|jpeg|webp|png))',
    text, re.I
)))

# alt texts mapped near image src in HTML (rough extraction)
alt_map = {}
for m in re.finditer(
    r'alt="([^"]*)"[^>]*(?:src|href)="\./Cheef Mohamed Shaban _ Facebook_files/([^"]+)"',
    text
):
    alt_map[m.group(2)] = html.unescape(m.group(1))

for m in re.finditer(
    r'src="\./Cheef Mohamed Shaban _ Facebook_files/([^"]+)"[^>]*alt="([^"]*)"',
    text
):
    alt_map[m.group(1)] = html.unescape(m.group(2))

# visible post texts
visible = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)

def clean(s):
    s = html.unescape(s)
    s = re.sub(r"&nbsp;", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

posts = []
for line in visible.split("\n"):
    line = clean(re.sub(r"<[^>]+>", " ", line))
    if len(line) > 20 and re.search(r"[\u0600-\u06FF]", line):
        if any(x in line for x in ["كفت", "حواو", "بانيه", "فراخ", "فوري", "متاح", "خصم", "عروض", "شوي", "تتبيل", "ارز", "أرز", "كيلو", "سيخ", "شغل", "فريزر", "بلدي", "بريدنج"]):
            posts.append(line)

# Image file info
images = []
for ref in refs:
    src = FILES / ref
    if not src.exists():
        continue
    size = src.stat().st_size
    alt = alt_map.get(ref, "")
    images.append({"file": ref, "size": size, "alt": alt})

images.sort(key=lambda x: -x["size"])

# Copy large images (>6000 bytes) as potential food/review photos
OUT_DIR.mkdir(parents=True, exist_ok=True)
REVIEWS_DIR.mkdir(parents=True, exist_ok=True)

copied = []
for img in images:
    if img["size"] < 6000:
        continue
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", img["file"])[:80]
    dest = OUT_DIR / safe
    shutil.copy2(FILES / img["file"], dest)
    copied.append({**img, "dest": f"/fb-images/{safe}"})

report = {
    "posts": list(dict.fromkeys(posts))[:25],
    "alt_texts": {k: v for k, v in alt_map.items() if v},
    "top_images": images[:40],
    "copied_count": len(copied),
    "copied": copied[:40],
}

report_path = Path(r"d:\mohamed.shaban\fb_report.json")
content = json.dumps(report, ensure_ascii=False, indent=2)
content = content.encode("utf-8", errors="replace").decode("utf-8")
report_path.write_text(content, encoding="utf-8")

print(f"Refs: {len(refs)}, Images exist: {len(images)}, Copied: {len(copied)}")
print("\nAlt texts:")
for k, v in list(alt_map.items())[:15]:
    if v: print(f"  {v[:60]} -> {k[:40]}")
print("\nPosts:")
for p in list(dict.fromkeys(posts))[:10]:
    print(f"  {p[:120]}")
