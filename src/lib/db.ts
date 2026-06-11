import fs from "fs";
import path from "path";
import type { Product, ProductInput } from "./types";
import { productDescriptions } from "./product-descriptions";
import { defaultPrepStatusForCategory } from "./prep-status";
import { sectionProductsSeed } from "./sections-seed";

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
    image: `/products/${id}.png`,
    prepStatus: prepStatus ?? defaultPrepStatusForCategory(category),
    available: true,
    featured,
    createdAt: now,
    updatedAt: now,
  };
}

export const seedProducts: Product[] = [
  item("1", "محشي جاهز علي التسويه", "محاشي بلدي محشية وجاهزة للتسوية على البوتاجاز — باذنجان وكوسة.", 0, "صينية", "محاشي", true, "instant"),
  item("2", "فراخ متبله جاهزه علي الشوي", "فراخ بلدي متبلة بتوابل خاصة — جاهزة للشوي أو الفرن.", 0, "فرخة", "دواجن", true, "instant"),
  item("3", "شيش متبل جاهز علي الشوي", "شيش طاووق متبل بالطماطم والبصل — جاهز للشواية.", 0, "صينية", "دواجن", true, "instant"),
  item("4", "ممبار بلدي مسلوق جاهز علي التحمير", "ممبار بلدي مسلوق وجاهز للتحمير — شغل بيتي أصلي.", 0, "كيلو", "وجبات جاهزة", false, "instant"),
  item("5", "سمبوسه ميكس جبن", "سمبوسك جبن ميكس جاهز للقلي — مقرمش وطعم مميز.", 0, "صينية", "مقبلات", false, "instant"),
  item("6", "ارانب جاهزه علي السوا", "أرانب بلدي منظفة وجاهزة للسوا — طازة ونظيفة.", 0, "أرنب", "لحوم", false, "instant"),
  item("7", "سمك بلطي متبل جاهز", "بلطي متبل بالفلفل والتوابل — جاهز للقلي أو الشوي.", 0, "سمكة", "أسماك", true, "instant"),
  ...sectionProductsSeed,
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

/** Overwrite catalog with default items. */
export function resetToSeedProducts(): Product[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  writeProducts(seedProducts);
  return seedProducts;
}

/** Apply default descriptions to existing products (keeps images). */
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

/** Merge section products without removing existing catalog. */
export function mergeSectionProducts(): Product[] {
  return readProducts();
}
