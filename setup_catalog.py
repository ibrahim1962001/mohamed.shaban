import re, html, json, shutil
from pathlib import Path

HTML = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook.html")
FILES = Path(r"c:\Users\smart\Downloads\Cheef Mohamed Shaban _ Facebook_files")
OUT_DIR = Path(r"d:\mohamed.shaban\public\fb-images")
REVIEWS_DIR = Path(r"d:\mohamed.shaban\public\reviews")

text = HTML.read_text(encoding="utf-8", errors="replace")
visible = re.sub(r"<script[^>]*>.*?</script>", " ", text, flags=re.DOTALL)
visible = re.sub(r"<style[^>]*>.*?</style>", " ", visible, flags=re.DOTALL)

def clean(s):
    s = html.unescape(s)
    s = re.sub(r"&nbsp;", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

text_chunks = [clean(c) for c in re.findall(r">([^<]{5,800})<", visible) if clean(c)]

# alt texts
alt_map = {}
for m in re.finditer(r'alt="([^"]*)"', text):
    alt = clean(m.group(1))
    if alt and alt not in {"😆", "👍", "❤️"}:
        pass

for m in re.finditer(
    r'src="\./Cheef Mohamed Shaban _ Facebook_files/([^"]+)"[^>]*alt="([^"]*)"',
    text
):
    alt_map[m.group(1)] = clean(m.group(2))

for m in re.finditer(
    r'alt="([^"]*)"[^>]*src="\./Cheef Mohamed Shaban _ Facebook_files/([^"]+)"',
    text
):
    alt_map[m.group(2)] = clean(m.group(1))

# Product mapping based on alt text analysis + post content
FOOD_MAP = {
    "648490167_122200900220301237_3695574115238432582_n.jpg": ("كفتة سيخ", "لحوم"),
    "649660485_122200900262301237_5269628462307368263_n.jpg": ("كفتة أرز", "لحوم"),
    "648772800_122200900310301237_8864227864742157128_n.jpg": ("حواوشي", "لحوم"),
    "649933672_122200900598301237_4531485795703429297_n.jpg": ("بانيه متبل", "لحوم"),
    "649195043_122200900172301237_1201611600182056475_n.jpg": ("فراخ متبلين للشوي", "دواجن"),
    "648537013_122200731650301237_4090371588654392350_n.jpg": ("فراخ بلدي مشوية", "دواجن"),
    "655749339_122202227450301237_625708887897548136_n.jpg": ("محاشي", "وجبات"),
    "650754155_122201205080301237_1053162779256394330_n.jpg": ("شيش طاووق", "دواجن"),
    "648837130_122201058626301237_8912690447966080395_n.jpg": ("حواوشي", "لحوم"),
    "657160195_122202170312301237_3428103397900923726_n.jpg": ("كفتة أرز", "لحوم"),
    "655689624_122202227354301237_5982325620625843968_n.jpg": ("بانيه متبل", "لحوم"),
    "660109899_122202770072301237_6237696295277369738_n.jpg": ("فراخ متبلين للشوي", "دواجن"),
    "659117135_122202760592301237_7863199813863592468_n.jpg": ("كفتة سيخ", "لحوم"),
    "657560876_122202627956301237_5350960516743075275_n.jpg": ("حواوشي", "لحوم"),
    "651690122_122201423264301237_5066831313427233756_n.jpg": ("فراخ بلدي مشوية", "دواجن"),
    "650729424_122201220548301237_466051821606884677_n.jpg": ("كفتة أرز", "لحوم"),
    "657729828_122202227408301237_4094135879016614198_n.jpg": ("وجبات مشكلة", "وجبات"),
    "661236147_122202689780301237_2807794522499299550_n.jpg": ("تتبيلة فراخ", "تتبيلات"),
    "648636549_122200722014301237_504468992095742658_n.jpg": ("كفتة سيخ", "لحوم"),
    "647250023_122200718378301237_7734665142060305303_n.jpg": ("حواوشي", "لحوم"),
}

REVIEW_MAP = {
    "716170883_122209026056301237_205935749515886724_n.jpg": {
        "name": "عميل",
        "text": "تسلم إيدك الفراخ جميلة. لسة بقى هنجرب الكفتة لكن من شكلها واضح حلوة جداً. ربنا يحفظك يارب ويوفقك للخير.",
    },
    "651183167_122201245346301237_5398693065790777868_n.jpg": {
        "name": "عميل",
        "text": "حابب اشكرك جدا على أوردر اليوم. المحشي جميل والزبدة البلدي واضحة فيه والفراخ المشوية في الفرن جميلة جداً. تسلم ايدك يا حبيب قلبي.",
    },
    "650607166_122201189672301237_6526231678996025654_n.jpg": {
        "name": "عميل",
        "text": "بسم الله ماشاء الله نضافة مفيش بعدها. عملت كفتة الرز النهارده والله أطعم من اللي بعملها على إيدي عند الجزار. ربنا يبارك فيك ويحفظك.",
    },
    "657380248_122202390464301237_3408941207840230186_n.jpg": {
        "name": "عميل",
        "text": "بسم الله ماشاء الله الفرخة نضيفة جداً وحجمها رهيب ومليانة لحم وشوربتها صافية وحلوة أوي.",
    },
    "659808591_122202565076301237_6406665702371340189_n.jpg": {
        "name": "Rawan",
        "text": "اجمل طعم أكل بيتي أكلته من عند حضرتك. أنا بجهز فعلاً في المطبخ حالياً بأمر الله هيكون أكبر مطبخ في بنها.",
    },
    "657059838_122202170354301237_6455199891089441404_n.jpg": {
        "name": "عميل",
        "text": "شيف أكل بيتي — الطعم تحفة. بنها، القليوبية.",
    },
}

OUT_DIR.mkdir(parents=True, exist_ok=True)
REVIEWS_DIR.mkdir(parents=True, exist_ok=True)

products = []
reviews = []

prices = {
    "كفتة سيخ": (120, "نص كيلo"),
    "كفتة أرز": (180, "كيلo"),
    "حواوشي": (200, "كيلo"),
    "بانيه متبل": (150, "كيلo"),
    "فراخ متبلين للشوي": (250, "3 فراخ"),
    "فراخ بلدي مشوية": (280, "3 فراخ"),
    "محاشي": (220, "كيلo"),
    "شيش طاووق": (160, "كيلo"),
    "وجبات مشكلة": (350, "وجبة"),
    "تتبيلة فراخ": (80, "كيلo"),
}

seen_names = {}
for src_name, (name, category) in FOOD_MAP.items():
    src = FILES / src_name
    if not src.exists():
        continue
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", src_name)
    dest = OUT_DIR / safe
    shutil.copy2(src, dest)
    price, unit = prices.get(name, (150, "كيلo"))
    if name not in seen_names:
        seen_names[name] = True
        products.append({
            "id": str(len(products) + 1),
            "name": name,
            "description": f"{name} — شغل فاخر من Cheef Mohamed Shaban",
            "price": price,
            "unit": unit.replace("o", "و"),
            "category": category,
            "image": f"/fb-images/{safe}",
            "available": True,
            "featured": name in ["كفتة أرز", "حواوشي", "فراخ متبلين للشوي", "كفتة سيخ"],
            "createdAt": "2026-06-10T00:00:00.000Z",
            "updatedAt": "2026-06-10T00:00:00.000Z",
        })

for src_name, review in REVIEW_MAP.items():
    src = FILES / src_name
    if not src.exists():
        continue
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", src_name)
    dest = REVIEWS_DIR / safe
    shutil.copy2(src, dest)
    reviews.append({**review, "image": f"/reviews/{safe}"})

# Meal prep if not added
if not any(p["name"] == "وجبة Meal Prep أسبوعية" for p in products):
    products.append({
        "id": str(len(products) + 1),
        "name": "وجبة Meal Prep أسبوعية",
        "description": "تجهيز وجبات أسبوع كامل — حسب الطلب",
        "price": 450,
        "unit": "أسبوع",
        "category": "وجبات",
        "image": "",
        "available": True,
        "featured": False,
        "createdAt": "2026-06-10T00:00:00.000Z",
        "updatedAt": "2026-06-10T00:00:00.000Z",
    })

Path(r"d:\mohamed.shaban\data").mkdir(exist_ok=True)
Path(r"d:\mohamed.shaban\data\products.json").write_text(
    json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8"
)
Path(r"d:\mohamed.shaban\data\reviews.json").write_text(
    json.dumps(reviews, ensure_ascii=False, indent=2), encoding="utf-8"
)

print(f"Products: {len(products)}, Reviews: {len(reviews)}")
