import fs from "fs";
import path from "path";
import type { Product, ProductInput } from "./types";
import { productDescriptions } from "./product-descriptions";
import { defaultPrepStatusForCategory } from "./prep-status";
import { drinksSeed } from "./drinks-seed";
import { weddingsSeed } from "./weddings-seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(process.cwd(), "data", "products.json");

const now = "2026-06-10T00:00:00.000Z";

function item(
  id: string,
  name: string,
  description: string,
  price: number,
  unit: string,
  category: string,
  featured = false,
  prepStatus?: string
): Product {
  return {
    id,
    name,
    description,
    price,
    unit,
    category,
    image: `/products/${id}.jpg`,
    prepStatus: prepStatus ?? defaultPrepStatusForCategory(category),
    available: true,
    featured,
    createdAt: now,
    updatedAt: now,
  };
}

export const seedProducts: Product[] = [
  item("1", "كفتة سيخ", "كفتة سيخ طازة متبلة بتوابل خاصة — جاهزة للشوي", 120, "نص كيلو", "لحوم", true),
  item("2", "كفتة أرز", "كفتة مع أرز وخضار — شغل بيتي فاخر", 180, "كيلو", "لحوم", true),
  item("3", "حواوشي", "حواوشي بلدي محشي باللحم المتبل", 200, "كيلو", "لحوم", true),
  item("4", "بانيه متبل", "بانيه ببريدنج عالي — جاهز للقلي", 150, "كيلو", "لحوم"),
  item("5", "كبدة مشوية", "كبدة بلدي متبلة — نص كيلو", 90, "نص كيلو", "لحوم"),
  item("6", "سجق بلدي", "سجق منزلي طازة — كيلو", 110, "كيلو", "لحوم"),
  item("7", "برجر بيتي", "4 قطع برجر لحم طازة متبل", 140, "4 قطع", "لحوم"),
  item("8", "لحم مفروم للمحشي", "لحم مفروم متبل جاهز للحشي", 160, "كيلو", "لحوم"),
  item("9", "فراخ متبلين للشوي", "3 فراخ بلدي متبلين جاهزين على الشوي", 250, "3 فراخ", "دواجن", true),
  item("10", "فراخ مشوية بالفرن", "فراخ بلدي مشوية بالفرن — 3 فراخ", 280, "3 فراخ", "دواجن"),
  item("11", "شيش طاووق", "دجاج متبل بالبهارات — كيلو", 160, "كيلو", "دواجن"),
  item("12", "أجنحة دجاج متبلة", "أجنحة متبلة جاهزة للشوي", 120, "كيلو", "دواجن"),
  item("13", "فراخ محشية", "فراخ محشية أرز وتوابل — قطعة", 220, "قطعة", "دواجن"),
  item("14", "بط متبل", "بطة بلدي متبلة جاهزة للشوي", 350, "1 بطة", "دواجن"),
  item("15", "كراكيب دجاج", "كراكيب دجاج نظيفة — كيلو", 85, "كيلو", "دواجن"),
  item("16", "دجاج بانيه", "شرائح دجاج بانيه متبلة — كيلو", 140, "كيلو", "دواجن"),
  item("17", "ممبار", "ممبار بلدي محشي أرز وتوابل", 180, "كيلو", "محاشي"),
  item("18", "محاشي كوسة", "كوسة محشية أرز ولحم — كيلو", 220, "كيلو", "محاشي", true),
  item("19", "محاشي باذنجان", "باذنجان محشي أرز ولحم — كيلو", 220, "كيلو", "محاشي"),
  item("20", "محاشي فلفل", "فلفل محشي أرز ولحم — كيلو", 200, "كيلو", "محاشي"),
  item("21", "ورق عنب", "ورق عنب محشي — كيلو", 190, "كيلو", "محاشي"),
  item("22", "محاشي مشكل", "تشكيلة محاشي (كوسة، باذنجان، فلفل)", 210, "كيلو", "محاشي"),
  item("23", "كشري", "كشري مصري أصلي — طبق كامل", 45, "طبق", "وجبات جاهزة", true),
  item("24", "ملوخية بالفراخ", "ملوخية خضراء بالفراخ — طبق", 95, "طبق", "وجبات جاهزة"),
  item("25", "فتة باللحم", "فتة باللحم والأرز والتوم — طبق", 110, "طبق", "وجبات جاهزة"),
  item("26", "رز معمر", "رز معمر باللبن — كيلو", 80, "كيلو", "وجبات جاهزة"),
  item("27", "مكرونة بالبشامل", "مكرونة بالبشامل واللحم — طبق كبير", 120, "طبق", "وجبات جاهزة"),
  item("28", "لحم بالبطاطس", "لحم بالبطاطس في الصلصة — طبق", 130, "طبق", "وجبات جاهزة"),
  item("29", "سمك بلطي متبل", "بلطي متبل بخلطة الشيف — كيلو", 140, "كيلو", "أسماك"),
  item("30", "سمك بلطي مشوي", "بلطي مشوي بالخلطة — كيلو", 160, "كيلو", "أسماك"),
  item("31", "جمبري متبل", "جمبري متبل جاهز للشوي — كيلو", 280, "كيلو", "أسماك"),
  item("32", "تتبيلة فراخ مشوية", "تتبيلة سرية للفراخ — كيلو", 80, "كيلو", "تتبيلات"),
  item("33", "تتبيلة كفتة", "تتبيلة كفتة جاهزة — كيلو", 70, "كيلو", "تتبيلات"),
  item("34", "تتبيلة سمك", "تتبيلة سمك بالأعشاب — كيلو", 75, "كيلو", "تتبيلات"),
  item("35", "تتبيلة شيش طاووق", "تتبيلة شيش طاووق — كيلو", 85, "كيلو", "تتبيلات"),
  item("36", "سمبوسك", "12 قطعة سمبوسك جاهزة للقلي", 60, "12 قطعة", "مقبلات"),
  item("37", "عجينة طعمية", "عجينة طعمية جاهزة للقلي — كيلو", 55, "كيلو", "مقبلات"),
  item("38", "فتير مشلتت", "4 قطع فتير مشلتت بالسمن", 70, "4 قطع", "مقبلات"),
  item("39", "طاجن لحم", "طاجن لحم بالبطاطس — طاجن وسط", 180, "طاجن", "طواجن"),
  item("40", "وجبة عائلة مشكلة", "تشكيلة أكل بيتي (مشاوي، محاشي، أرز، مقبلات) تكفي 4-6 أشخاص. مثالية للجمعة والعزومات الصغيرة.", 650, "4-6 أشخاص", "عزومات", true),
  item("41", "عزومة 10 أشخاص", "عزومة كاملة: مشاوي مشكل، محاشي، أرز، مقبلات وسلطة — تكفي 10 أشخاص. شغل بيتي فاخر بتوابل الشيف.", 1200, "10 أشخاص", "عزومات", true),
  item("42", "عزومة 15 شخص", "عزومة متوسطة: مشاوي، فراخ، محاشي، أرز أبيض، مقبلات وخضار. تكفي 15 شخص — جاهزة للتقديم.", 1750, "15 شخص", "عزومات"),
  item("43", "عزومة 20 شخص", "عزومة كبيرة للمناسبات: grill mix، محاشي مشكل، أرز، مقبلات، سلطة وفتة. تكفي 20 شخص.", 2300, "20 شخص", "عزومات"),
  item("44", "عزومة grill فاخرة", "عزومة VIP: كفتة، كبده، فراخ مشوية، شيش، محاشي، أرز، مقبلات وسلطات — تكفي 25-30 شخص.", 3000, "25-30 شخص", "عزومات", true),
  item("45", "صينية كفتة وكبده", "صينية كبيرة كفتة سيخ وكبده مشوية متبلة. مثالية للعزومات والسفرات — تكفي 6-8 أشخاص.", 350, "صينية كبيرة", "صواني"),
  item("46", "صينية فراخ مشوية", "صينية فراخ بلدي مشوية بالخلطة مع أرز أو خضار. تكفي 6-8 أشخاص — طراوة ونكهة مميزة.", 420, "صينية كبيرة", "صواني", true),
  item("47", "صينية محاشي مشكل", "صينية محاشي (كوسة، باذنجان، فلفل) مطبوخة على النار. تكفي 8-10 أشخاص.", 480, "صينية كبيرة", "صواني"),
  item("48", "صينية مقبلات مشكلة", "صينية مقبلات: سمبوسك، طعmية، سلطة، متبل وفتير. مثالية كمقبلات للعزومة.", 280, "صينية وسط", "صواني"),
  item("49", "صينية أرز وخضار", "صينية أرز أبيض ساطع مع خضار مسلوق ومرق. تكفي 8-10 أشخاص — تكمّل أي عزومة.", 220, "صينية كبيرة", "صواني"),
  item("50", "صينية مكرونة بالبشامل", "صينية مكرونة بالبشامل واللحم المفروم — صوص كريمي ولذيذ. تكفي 6-8 أشخاص.", 340, "صينية كبيرة", "صواني"),
  ...drinksSeed,
  ...weddingsSeed,
];

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf-8");
  }
}

function readProducts(): Product[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Product[];
}

function writeProducts(products: Product[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export function getAllProducts(): Product[] {
  return readProducts().sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );
}

export function getProductById(id: string): Product | undefined {
  return readProducts().find((p) => p.id === id);
}

export function createProduct(input: ProductInput): Product {
  const products = readProducts();
  const ts = new Date().toISOString();
  const product: Product = {
    id: Date.now().toString(),
    ...input,
    prepStatus: input.prepStatus || defaultPrepStatusForCategory(input.category),
    createdAt: ts,
    updatedAt: ts,
  };
  products.push(product);
  writeProducts(products);
  return product;
}

export function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Product | null {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  writeProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProducts(filtered);
  return true;
}

/** Overwrite catalog with default 40 items (no images). */
export function resetToSeedProducts(): Product[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  writeProducts(seedProducts);
  return seedProducts;
}

/** Apply default descriptions to existing products (keeps images/prices). */
export function syncProductDescriptions(): Product[] {
  const products = readProducts();
  const ts = new Date().toISOString();
  const updated = products.map((p) => ({
    ...p,
    description: productDescriptions[p.id] ?? p.description,
    updatedAt: ts,
  }));
  writeProducts(updated);
  return updated;
}

/** Ensure every product has a prep status label. */
export function syncPrepStatuses(): Product[] {
  const products = readProducts();
  const ts = new Date().toISOString();
  const updated = products.map((p) => ({
    ...p,
    prepStatus: p.prepStatus || defaultPrepStatusForCategory(p.category),
    updatedAt: ts,
  }));
  writeProducts(updated);
  return updated;
}

/** Add/update عzومات & صوانi products without removing existing catalog. */
export function mergeSectionProducts(): Product[] {
  const products = readProducts();
  const byId = new Map(products.map((p) => [p.id, p]));
  const sectionIds = new Set(
    seedProducts
      .filter(
        (p) =>
          p.category === "عزومات" ||
          p.category === "صواني" ||
          p.category === "مشروبات ساقعة" ||
          p.category === "أكل الأفراح" ||
          p.category === "أكل العرسان"
      )
      .map((p) => p.id)
  );

  for (const seed of seedProducts) {
    if (!sectionIds.has(seed.id)) continue;
    const existing = byId.get(seed.id);
    if (existing) {
      byId.set(seed.id, {
        ...existing,
        name: seed.name,
        description: productDescriptions[seed.id] ?? seed.description,
        price: seed.price,
        unit: seed.unit,
        category: seed.category,
        prepStatus: seed.prepStatus,
        featured: seed.featured,
        updatedAt: new Date().toISOString(),
      });
    } else {
      byId.set(seed.id, seed);
    }
  }

  const merged = Array.from(byId.values()).sort(
    (a, b) => Number(a.id) - Number(b.id)
  );
  writeProducts(merged);
  return merged;
}
