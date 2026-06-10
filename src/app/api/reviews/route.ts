import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

export async function GET() {
  try {
    if (!fs.existsSync(REVIEWS_FILE)) {
      return NextResponse.json([]);
    }
    const data = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
