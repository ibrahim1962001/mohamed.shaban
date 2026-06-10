import re, html, json, shutil
from pathlib import Path

HTML = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook.html")
visible = re.sub(r"<script[^>]*>.*?</script>", " ", HTML.read_text(encoding="utf-8", errors="replace"), flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)

def clean(s):
    s = html.unescape(s)
    s = re.sub(r"&nbsp;", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

for line in visible.split("\n"):
    line = clean(re.sub(r"<[^>]+>", " ", line))
    if len(line) > 15 and re.search(r"[\u0600-\u06FF]", line):
        if any(x in line for x in ["كفت", "حواو", "بانيه", "فراخ", "فوري", "متاح", "مثبت", "باقي"]):
            print(line[:200])
