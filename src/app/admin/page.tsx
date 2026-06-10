"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminProductForm, { AdminProductList } from "@/components/AdminProductForm";
import { siteConfig } from "@/lib/config";
import type { Product } from "@/lib/types";

type AdminTab = "products" | "add";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [tab, setTab] = useState<AdminTab>("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    document.body.classList.add("admin-body");
    return () => document.body.classList.remove("admin-body");
  }, []);

  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated]);

  const stats = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    return {
      total: products.length,
      categories: categories.size,
      featured: products.filter((p) => p.featured).length,
      available: products.filter((p) => p.available).length,
    };
  }, [products]);

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
    setTab("products");
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadProducts();
      if (editing?.id === id) setEditing(null);
    }
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setTab("add");
    setSidebarOpen(false);
  };

  const handleAddNew = () => {
    setEditing(null);
    setTab("add");
    setSidebarOpen(false);
  };

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-4 py-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-brand-600/30 bg-white p-8 shadow-admin"
        >
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl ring-4 ring-gold-400/50 shadow-warm">
              <Image
                src={siteConfig.chefPhoto}
                alt={siteConfig.nameAr}
                fill
                className="object-cover object-top"
              />
            </div>
            <h1 className="text-2xl font-black text-brand-950">لوحة التحكم</h1>
            <p className="mt-1 text-sm font-semibold text-stone-500">{siteConfig.nameAr}</p>
            <p className="mt-3 rounded-xl bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
              إدارة المنيو والمنتجات
            </p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {loginError}
            </div>
          )}

          <label className="mb-2 block text-sm font-bold text-stone-700">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input mb-6 text-lg"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <button type="submit" className="admin-btn-primary w-full py-4 text-lg">
            دخول
          </button>
          <Link
            href="/"
            className="mt-5 block text-center text-sm font-semibold text-stone-400 hover:text-brand-600"
          >
            ← العودة للموقع
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-admin-bg">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-admin-sidebar shadow-2xl transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-brand-700/50 p-5">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-xl ring-2 ring-gold-400/60">
              <Image src={siteConfig.chefPhoto} alt="" fill className="object-cover object-top" />
            </div>
            <div>
              <p className="text-sm font-black text-white">{siteConfig.nameAr}</p>
              <p className="text-xs text-brand-300">لوحة الإدارة</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <button
            type="button"
            onClick={() => { setTab("products"); setSidebarOpen(false); }}
            className={`admin-nav-item w-full ${tab === "products" ? "active" : ""}`}
          >
            <span>📦</span> كل المنتجات
          </button>
          <button
            type="button"
            onClick={handleAddNew}
            className={`admin-nav-item w-full ${tab === "add" ? "active" : ""}`}
          >
            <span>➕</span> {editing ? "تعديل منتج" : "إضافة منتج"}
          </button>
          <Link
            href="/"
            target="_blank"
            className="admin-nav-item mt-4"
          >
            <span>🌐</span> عرض الموقع
          </Link>
        </nav>

        <div className="border-t border-brand-700/50 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/25"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-brand-200/40 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-lg lg:hidden"
              >
                ☰
              </button>
              <div>
                <h1 className="text-lg font-black text-brand-950">
                  {tab === "add" ? (editing ? "تعديل منتج" : "إضافة منتج جديد") : "إدارة المنيو"}
                </h1>
                <p className="text-xs font-semibold text-stone-500">
                  {stats.total} منتج · {stats.categories} تصنيف
                </p>
              </div>
            </div>
            <button type="button" onClick={handleAddNew} className="admin-btn-primary hidden sm:inline-flex">
              ➕ منتج جديد
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "إجمالي المنتجات", value: stats.total, emoji: "📦", color: "from-brand-600 to-brand-500" },
              { label: "التصنيفات", value: stats.categories, emoji: "🏷️", color: "from-gold-500 to-gold-400" },
              { label: "منتجات مميزة", value: stats.featured, emoji: "⭐", color: "from-amber-500 to-amber-400" },
              { label: "متاح للطلب", value: stats.available, emoji: "✅", color: "from-fresh-600 to-fresh-500" },
            ].map((s) => (
              <div key={s.label} className="admin-card overflow-hidden">
                <div className={`bg-gradient-to-l ${s.color} px-4 py-2`}>
                  <span className="text-lg">{s.emoji}</span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-2xl font-black text-brand-950">{s.value}</p>
                  <p className="text-xs font-semibold text-stone-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {tab === "add" ? (
            <AdminProductForm
              editing={editing}
              onSaved={() => {
                setEditing(null);
                setTab("products");
                loadProducts();
              }}
              onCancel={() => {
                setEditing(null);
                setTab("products");
              }}
            />
          ) : (
            <AdminProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          )}
        </main>
      </div>
    </div>
  );
}
