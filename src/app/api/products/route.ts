import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import type { ProductInput } from "@/lib/types";

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductInput;

    if (!body.name?.trim() || !body.price || body.price <= 0) {
      return NextResponse.json(
        { error: "الاسم والسعر مطلوبان" },
        { status: 400 }
      );
    }

    const product = createProduct({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      price: Number(body.price),
      unit: body.unit?.trim() || "قطعة",
      category: body.category?.trim() || "عام",
      image: body.image || "",
      prepStatus: body.prepStatus || "on_order",
      available: body.available ?? true,
      featured: body.featured ?? false,
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في الحفظ" }, { status: 500 });
  }
}
