import { NextResponse } from "next/server";
import { verifyPassword, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(sessionCookieOptions);
    return response;
  } catch {
    return NextResponse.json({ error: "خطأ في تسجيل الدخول" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(sessionCookieOptions.name);
  return response;
}
