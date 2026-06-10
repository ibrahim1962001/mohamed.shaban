import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src/lib/db.ts");
let db = fs.readFileSync(dbPath, "utf8");

if (!db.includes("  ...drinksSeed,")) {
  const needle = '  item("50",';
  const pos = db.lastIndexOf(needle);
  if (pos === -1) {
    console.error("item 50 not found");
    process.exit(1);
  }
  const lineEnd = db.indexOf("\n", pos);
  const insertAt = lineEnd + 1;
  db = db.slice(0, insertAt) + "  ...drinksSeed,\n" + db.slice(insertAt);
  fs.writeFileSync(dbPath, db);
  console.log("Added ...drinksSeed to seedProducts");
} else {
  console.log("drinksSeed already in seedProducts");
}

// Fix typos in drinks-seed.ts
const drinksPath = path.join(process.cwd(), "src/lib/drinks-seed.ts");
let drinks = fs.readFileSync(drinksPath, "utf8");
if (drinks.includes("م ideal")) {
  drinks = drinks.replace(/م ideal/g, "مثالي");
  fs.writeFileSync(drinksPath, drinks);
  console.log("Fixed drinks-seed typos");
}
