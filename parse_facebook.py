import re
import json
import html
from pathlib import Path

OUT = Path(r"d:\mohamed.shaban\facebook_extract.txt")
p = Path(r"c:\Users\smart\Downloads\Facebook.html")
text = p.read_text(encoding="utf-8", errors="replace")

blocks = re.findall(
    r'<script type="application/json"[^>]*>(.*?)</script>', text, re.DOTALL
)

lines = []
lines.append(f"Source URL comment: saved from mohamed.shaban.129491")
lines.append(f"File size: {len(text)} chars")
lines.append(f"JSON blocks: {len(blocks)}")

# Find blocks related to the profile
profile_blocks = [b for b in blocks if "61559037112378" in b or "mohamed.shaban.129491" in b]
lines.append(f"Profile-related blocks: {len(profile_blocks)}")

for i, block in enumerate(profile_blocks):
    lines.append(f"\n{'='*60}\nPROFILE BLOCK {i+1}\n{'='*60}")
    try:
        data = json.loads(block)
        blob = json.dumps(data, ensure_ascii=False, indent=2)
    except json.JSONDecodeError:
        blob = block

    # Extract all string values > 5 chars with Arabic or food-related content
    strings = re.findall(r'"((?:\\.|[^"\\]){3,500})"', blob)
    seen = set()
    for s in strings:
        try:
            s = s.encode("utf-8").decode("unicode_escape")
        except Exception:
            pass
        s = html.unescape(s)
        if s in seen or s.startswith("http") or s.startswith("adp_"):
            continue
        seen.add(s)
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", s))
        food_kw = any(
            x in s.lower()
            for x in [
                "cheef", "shaban", "mohamed", "chef", "food", "cook", "kitchen",
                "delivery", "order", "phone", "cairo", "alex", "work", "bio",
                "about", "page", "restaurant", "verified", "follow", "intro",
                "category", "whatsapp", "menu", "price", "product", "shop",
                "اكل", "شيف", "توصيل", "طلب", "منزلي", "دجاج", "فراخ", "تتبيل",
                "محاشي", "كشري", "طبخ", "مطبخ", "وجبات", "منيو", "جنيه",
            ]
        )
        if has_arabic or food_kw or (s.startswith("Cheef") or s.startswith("Mohamed")):
            lines.append(f"  • {s}")

# Search entire file for Cheef Mohamed Shaban profile fields
patterns = [
    r'"name"\s*:\s*"([^"]*[Cc]heef[^"]*)"',
    r'"name"\s*:\s*"([^"]*[Ss]haban[^"]*)"',
    r'"profile_status"\s*:\s*"([^"]+)"',
    r'"bio"\s*:\s*"([^"]+)"',
    r'"intro_bio"\s*:\s*"([^"]+)"',
    r'"context_item_title"\s*:\s*"([^"]+)"',
    r'"context_item_subtitle"\s*:\s*"([^"]+)"',
    r'"message"\s*:\s*\{"text"\s*:\s*"([^"]{20,})"',
]

lines.append(f"\n{'='*60}\nPATTERN MATCHES ACROSS FULL FILE\n{'='*60}")
for pat in patterns:
    matches = re.findall(pat, text)
    if matches:
        lines.append(f"\nPattern: {pat}")
        for m in set(matches[:50]):
            try:
                m = m.encode("utf-8").decode("unicode_escape")
            except Exception:
                pass
            lines.append(f"  → {html.unescape(m)[:500]}")

# Extract visible HTML text around Cheef/Shaban
visible = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)
visible = re.sub(r"<[^>]+>", "\n", visible)
visible = re.sub(r"\n+", "\n", visible)

lines.append(f"\n{'='*60}\nVISIBLE TEXT LINES (filtered)\n{'='*60}")
for line in visible.split("\n"):
    line = line.strip()
    if not line or len(line) < 4:
        continue
    lower = line.lower()
    if any(
        x in lower or x in line
        for x in [
            "cheef", "shaban", "شعبان", "شيف", "mohamed shaban",
            "verified", "follow", "message", "intro", "about", "work",
            "phone", "website", "location", "cairo", "alex", "menu",
            "order", "delivery", "food", "cook", "kitchen", "product",
            "اكل", "منزلي", "توصيل", "طلب", "دجاج", "تتبيل", "وجبات",
            "جنيه", "واتس", "whatsapp",
        ]
    ):
        lines.append(line[:500])

# Feed posts - look for story messages in large feed block
feed_blocks = sorted(
    [b for b in blocks if '"message"' in b and len(b) > 50000],
    key=len,
    reverse=True,
)[:5]

lines.append(f"\n{'='*60}\nFEED POST MESSAGES (largest blocks)\n{'='*60}")
for bi, block in enumerate(feed_blocks):
    msgs = re.findall(r'"message"\s*:\s*\{"text"\s*:\s*"((?:\\.|[^"\\])*)"', block)
    if not msgs:
        msgs = re.findall(r'"text"\s*:\s*"((?:\\.|[^"\\]){30,})"', block)
    actor_names = re.findall(r'"name"\s*:\s*"(Cheef[^"]*|Mohamed[^"]*Shaban[^"]*)"', block)
    if actor_names:
        lines.append(f"\nBlock {bi+1} actors: {set(actor_names)}")
    for msg in msgs[:30]:
        try:
            msg = msg.encode("utf-8").decode("unicode_escape")
        except Exception:
            pass
        msg = html.unescape(msg)
        if re.search(r"[\u0600-\u06FF]", msg) or any(
            x in msg.lower() for x in ["cheef", "shaban", "food", "order", "price", "delivery"]
        ):
            lines.append(f"  POST: {msg[:600]}")

content = "\n".join(lines)
content = content.encode("utf-8", errors="replace").decode("utf-8")
OUT.write_text(content, encoding="utf-8")
print(f"Written to {OUT} ({len(lines)} lines)")
