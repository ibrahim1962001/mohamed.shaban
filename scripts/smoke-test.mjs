/**
 * Smoke test for Cheef Mohamed Shaban site
 */
import fs from "fs";
import path from "path";

const BASE = process.env.SITE_URL || "http://localhost:3000";

// Load admin password from .env.local for auth test (local only)
function loadAdminPassword() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const raw = fs.readFileSync(envPath, "utf-8");
    const match = raw.match(/^ADMIN_PASSWORD=(.+)$/m);
    return match?.[1]?.trim() || null;
  } catch {
    return null;
  }
}

const requiredSections = [
  "weddings",
  "grooms",
  "parties",
  "trays",
  "drinks",
  "menu",
  "delivery",
];

const requiredCategories = [
  "أكل الأفراح",
  "أكل العرسان",
  "عزومات",
  "صواني",
  "مشروبات ساقعة",
  "لحوم",
];

let passed = 0;
let failed = 0;

function ok(name) {
  passed++;
  console.log(`✓ ${name}`);
}

function fail(name, detail) {
  failed++;
  console.error(`✗ ${name}: ${detail}`);
}

async function test(name, fn) {
  try {
    await fn();
  } catch (e) {
    fail(name, e.message);
  }
}

async function main() {
  console.log("=== Site Smoke Tests ===\n");

  await test("Homepage loads (200)", async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes("شيف محمد شعبان")) throw new Error("Missing site name");
    ok("Homepage loads (200)");
  });

  await test("Homepage has all sections", async () => {
    const html = await fetch(BASE).then((r) => r.text());
    for (const id of requiredSections) {
      if (!html.includes(`id="${id}"`)) throw new Error(`Missing section #${id}`);
    }
    ok("Homepage has all sections");
  });

  await test("Static assets (CSS) load", async () => {
    const html = await fetch(BASE).then((r) => r.text());
    const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+\.css)"/);
    if (!cssMatch) throw new Error("No CSS link in HTML");
    const cssRes = await fetch(BASE + cssMatch[1]);
    if (!cssRes.ok) throw new Error(`CSS HTTP ${cssRes.status}`);
    ok("Static assets (CSS) load");
  });

  await test("Static assets (JS) load", async () => {
    const html = await fetch(BASE).then((r) => r.text());
    const jsMatch = html.match(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/);
    if (!jsMatch) throw new Error("No JS chunk in HTML");
    const jsRes = await fetch(BASE + jsMatch[1]);
    if (!jsRes.ok) throw new Error(`JS HTTP ${jsRes.status}`);
    ok("Static assets (JS) load");
  });

  await test("API /api/products", async () => {
    const res = await fetch(BASE + "/api/products");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();
    if (!Array.isArray(products) || products.length !== 72)
      throw new Error(`Expected 72 products, got ${products?.length}`);
    const cats = new Set(products.map((p) => p.category));
    for (const c of requiredCategories) {
      if (!cats.has(c)) throw new Error(`Missing category: ${c}`);
    }
    const drinks = products.filter((p) => p.category === "مشروبات ساقعة");
    if (drinks.length !== 10) throw new Error(`Expected 10 drinks, got ${drinks.length}`);
    ok("API /api/products (72 items, all categories)");
  });

  await test("Product images serve", async () => {
    const products = await fetch(BASE + "/api/products").then((r) => r.json());
    const sample = ["1", "51", "61", "67", "72"];
    for (const id of sample) {
      const p = products.find((x) => x.id === id);
      if (!p?.image) throw new Error(`Product ${id} has no image path`);
      const imgRes = await fetch(BASE + p.image);
      if (!imgRes.ok) throw new Error(`Image ${p.image} HTTP ${imgRes.status}`);
    }
    ok("Product images serve (sample 5 ids)");
  });

  await test("API /api/reviews", async () => {
    const res = await fetch(BASE + "/api/reviews");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Not an array");
    ok("API /api/reviews");
  });

  await test("Admin page loads", async () => {
    const res = await fetch(BASE + "/admin");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes("admin") && !html.includes("Admin") && !html.includes("لوحة"))
      throw new Error("Admin page content unexpected");
    ok("Admin page loads");
  });

  await test("API auth check", async () => {
    const res = await fetch(BASE + "/api/auth/check");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.authenticated !== "boolean")
      throw new Error("Invalid auth check response");
    ok("API auth check");
  });

  await test("Chef photo loads", async () => {
    const res = await fetch(BASE + "/chef-photo.png");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    ok("Chef photo loads");
  });

  await test("Admin login rejects wrong password", async () => {
    const res = await fetch(BASE + "/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password-xyz" }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    ok("Admin login rejects wrong password");
  });

  await test("Admin login accepts correct password", async () => {
    const pwd = loadAdminPassword();
    if (!pwd) throw new Error("No ADMIN_PASSWORD in .env.local");
    const res = await fetch(BASE + "/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error("Login failed");
    ok("Admin login accepts correct password");
  });

  await test("Protected API blocks unauthenticated create", async () => {
    const res = await fetch(BASE + "/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test", price: 10 }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    ok("Protected API blocks unauthenticated create");
  });

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
