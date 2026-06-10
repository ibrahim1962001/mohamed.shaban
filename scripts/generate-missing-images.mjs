/**
 * Generate branded placeholder images locally (no network) for products missing images.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const PRODUCTS_FILE = path.join(ROOT, "data", "products.json");
const OUT_DIR = path.join(ROOT, "public", "products");

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
  "مشروبات ساقعة": ["#0ea5e9", "#0284c7"],
  "أكل الأفراح": ["#881337", "#d97706"],
  "أكل العرسان": ["#be123c", "#fcd34d"],
};

const CATEGORY_EMOJI = {
  "مشروبات ساقعة": "🥤",
  "أكل الأفراح": "💒",
  "أكل العرسان": "💍",
  عزومات: "🎉",
  صواني: "🍱",
};

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function generateImage(product) {
  const [c1, c2] = CATEGORY_COLORS[product.category] || ["#be123c", "#881337"];
  const emoji = CATEGORY_EMOJI[product.category] || "🍽️";
  const name = escapeXml(product.name);
  const category = escapeXml(product.category);
  const price = escapeXml(`${product.price} جنيه`);

  const svg = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="32" y="32" width="736" height="536" rx="28" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
  <text x="400" y="220" text-anchor="middle" font-size="96">${emoji}</text>
  <text x="400" y="310" text-anchor="middle" font-size="34" fill="#ffffff" font-family="Arial,sans-serif" font-weight="bold">${name}</text>
  <text x="400" y="360" text-anchor="middle" font-size="22" fill="rgba(255,255,255,0.9)" font-family="Arial,sans-serif">${category}</text>
  <text x="400" y="410" text-anchor="middle" font-size="28" fill="#fde68a" font-family="Arial,sans-serif" font-weight="bold">${price}</text>
  <text x="400" y="520" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.75)" font-family="Arial,sans-serif">Cheef Mohamed Shaban</text>
</svg>`;

  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  let created = 0;

  for (const product of products) {
    const filePath = path.join(OUT_DIR, `${product.id}.jpg`);
    const needsImage =
      !product.image ||
      !fs.existsSync(path.join(ROOT, "public", product.image.replace(/^\//, "")));

    if (!needsImage && fs.existsSync(filePath)) continue;

    const buffer = await generateImage(product);
    fs.writeFileSync(filePath, buffer);
    product.image = `/products/${product.id}.jpg`;
    product.updatedAt = new Date().toISOString();
    console.log(`✓ ${product.id} ${product.name}`);
    created++;
  }

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  console.log(`\nDone: ${created} images generated/updated`);
}

main();
