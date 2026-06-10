/**
 * Download a unique food photo per product and update products.json.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const PRODUCTS_FILE = path.join(ROOT, "data", "products.json");
const OUT_DIR = path.join(ROOT, "public", "products");

/** Flickr search tags per product (English for better photo matches) */
const TAG_MAP = {
  "1": "kofta,kebab,grill",
  "2": "rice,meat,dinner",
  "3": "stuffed,bread,meat",
  "4": "schnitzel,breaded,meat",
  "5": "liver,grill,meat",
  "6": "sausage,grill,meat",
  "7": "burger,beef,grill",
  "8": "minced,meat,cooking",
  "9": "chicken,marinated,raw",
  "10": "roasted,chicken,oven",
  "11": "chicken,skewers,grill",
  "12": "chicken,wings,grill",
  "13": "stuffed,chicken,rice",
  "14": "duck,roast,poultry",
  "15": "chicken,soup,broth",
  "16": "chicken,schnitzel,fried",
  "17": "sausage,rice,egyptian",
  "18": "stuffed,zucchini,vegetables",
  "19": "stuffed,eggplant,vegetables",
  "20": "stuffed,pepper,vegetables",
  "21": "grape,leaves,dolma",
  "22": "stuffed,vegetables,middleeastern",
  "23": "koshari,lentils,rice,egyptian",
  "24": "molokhia,green,soup",
  "25": "fatta,rice,meat,egyptian",
  "26": "rice,pudding,milk",
  "27": "pasta,baked,cheese",
  "28": "beef,stew,potato",
  "29": "fish,tilapia,raw",
  "30": "grilled,fish,seafood",
  "31": "shrimp,seafood,grill",
  "32": "chicken,marinade,spices",
  "33": "kofta,spices,minced",
  "34": "fish,marinade,herbs",
  "35": "chicken,skewers,marinade",
  "36": "samosa,fried,appetizer",
  "37": "falafel,chickpea,fried",
  "38": "flatbread,pastry,butter",
  "39": "tagine,stew,meat",
  "40": "family,dinner,feast",
  "41": "buffet,feast,party",
  "42": "banquet,food,spread",
  "43": "catering,food,table",
  "44": "bbq,grill,feast",
  "45": "kofta,platter,tray",
  "46": "chicken,platter,roast",
  "47": "stuffed,vegetables,platter",
  "48": "appetizer,platter,mezze",
  "49": "rice,vegetables,platter",
  "50": "pasta,platter,baked",
  "51": "mango,juice,smoothie",
  "52": "strawberry,juice,smoothie",
  "53": "banana,milk,smoothie",
  "54": "orange,juice,fresh",
  "55": "guava,juice,fresh",
  "56": "lemon,mint,drink",
  "57": "sugarcane,juice",
  "58": "hibiscus,tea,drink",
  "59": "sobia,milk,drink",
  "60": "fenugreek,drink,milk",
  "61": "carob,juice,drink",
  "62": "salep,milk,hot",
  "63": "tea,mint,egyptian",
  "64": "turkish,coffee,cup",
  "65": "instant,coffee,latte",
  "66": "chocolate,milkshake,icecream",
  "67": "vanilla,milkshake,icecream",
  "68": "soda,cola,can",
  "69": "water,bottle,mineral",
};

const CATEGORY_COLORS = {
  لحوم: ["#be123c", "#881337"],
  دواجن: ["#d97706", "#92400e"],
  محاشي: ["#059669", "#047857"],
  "وجبات جاهزة": ["#7c3aed", "#5b21b6"],
  أسماك: ["#0284c7", "#0369a1"],
  تتبيلات: ["#ca8a04", "#a16207"],
  مقبلات: ["#db2777", "#be185d"],
  طواجن: ["#c2410c", "#9a3412"],
  عزومات: ["#be123c", "#f59e0b"],
  صواني: ["#d97706", "#be123c"],
  مشروبات: ["#0ea5e9", "#0284c7"],
};

async function fetchFoodPhoto(id, tags) {
  const url = `https://loremflickr.com/800/600/${tags}?lock=${id}`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "CheefMohamedShaban/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function generateFallback(product) {
  const [c1, c2] = CATEGORY_COLORS[product.category] || ["#be123c", "#881337"];
  const name = escapeXml(product.name);
  const category = escapeXml(product.category);

  const svg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="40" y="40" width="720" height="520" rx="24" fill="rgba(255,255,255,0.12)"/>
  <text x="400" y="260" text-anchor="middle" font-size="72">🍽️</text>
  <text x="400" y="340" text-anchor="middle" font-size="36" fill="#ffffff" font-family="Arial,sans-serif" font-weight="bold">${name}</text>
  <text x="400" y="390" text-anchor="middle" font-size="22" fill="rgba(255,255,255,0.85)" font-family="Arial,sans-serif">${category}</text>
  <text x="400" y="520" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.7)" font-family="Arial,sans-serif">Cheef Mohamed Shaban</text>
</svg>`;

  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer();
}

async function saveProductImage(product) {
  const tags = TAG_MAP[product.id];
  if (!tags) throw new Error("No tags");

  let buffer;
  try {
    buffer = await fetchFoodPhoto(product.id, tags);
    buffer = await sharp(buffer)
      .resize(800, 600, { fit: "cover" })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    buffer = await generateFallback(product);
  }

  const filePath = path.join(OUT_DIR, `${product.id}.jpg`);
  fs.writeFileSync(filePath, buffer);
  return `/products/${product.id}.jpg`;
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  let ok = 0;

  for (const product of products) {
    try {
      product.image = await saveProductImage(product);
      product.updatedAt = new Date().toISOString();
      console.log(`✓ ${product.id} ${product.name} → ${product.image}`);
      ok++;
      await new Promise((r) => setTimeout(r, 350));
    } catch (err) {
      console.error(`✗ ${product.id} ${product.name}:`, err.message);
    }
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  console.log(`\nDone: ${ok}/${products.length} images`);
}

main();
