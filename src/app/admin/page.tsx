"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminProductForm, { AdminProductList } from "@/components/AdminProductForm";
import type { Product } from "@/lib/types";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const checkAuth = () => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => setAuthenticated(d.authenticated))
      .catch(() => setAuthenticated(false));
  };

  const loadProducts = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
    } else {
      const data = await res.json();
      setLoginError(data.error || "خطأ في تسجيل الدخول");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadProducts();
      if (editing?.id === id) setEditing(null);
    }
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-md">
              🔐
            </div>
            <h1 className="text-2xl font-black text-slate-800">لوحة التحكم</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">Cheef Mohamed Shaban</p>
            <p className="mt-3 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
              صفحة منفصلة — للإدارة فقط
            </p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {loginError}
            </div>
          )}

          <label className="mb-2 block text-sm font-bold text-slate-700">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-xl border-2 border-slate-200 px-4 py-4 text-lg focus:border-indigo-500 focus:outline-none"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-indigo-600 py-4 text-lg font-extrabold text-white shadow-md hover:bg-indigo-500"
          >
            دخول
          </button>
          <Link
            href="/"
            className="mt-5 block text-center text-sm font-semibold text-slate-400 hover:text-indigo-600"
          >
            ← العودة للموقع
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Admin Panel</p>
            <h1 className="text-lg font-black text-slate-800">إدارة المنيو</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="min-h-[44px] rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
            >
              الموقع
            </Link>
            <button
              onClick={handleLogout}
              className="min-h-[44px] rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <AdminProductForm
          editing={editing}
          onSaved={() => {
            setEditing(null);
            loadProducts();
          }}
          onCancel={() => setEditing(null)}
        />
        <AdminProductList
          products={products}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
