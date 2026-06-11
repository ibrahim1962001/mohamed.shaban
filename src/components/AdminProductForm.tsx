"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product, ProductInput } from "@/lib/types";
import { siteConfig } from "@/lib/config";
import { prepStatusOptions } from "@/lib/prep-status";
import ImageUploader from "@/components/ImageUploader";

interface AdminProductFormProps {
  editing: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  unit: "قطعة",
  category: "لحوم",
  image: "",
  prepStatus: "on_order",
  available: true,
  featured: false,
};

export default function AdminProductForm({
  editing,
  onSaved,
  onCancel,
}: AdminProductFormProps) {
  const [form, setForm] = useState<ProductInput>(
    editing
      ? {
          name: editing.name,
          description: editing.description,
          price: editing.price,
          unit: editing.unit,
          category: editing.category,
          image: editing.image,
          prepStatus: editing.prepStatus || "on_order",
          available: editing.available,
          featured: editing.featured,
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        price: editing.price,
        unit: editing.unit,
        category: editing.category,
        image: editing.image,
        prepStatus: editing.prepStatus || "on_order",
        available: editing.available,
        featured: editing.featured,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editing ? `/api/products/${editing.id}` : "/api/products";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(emptyForm);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card p-5 md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-brand-950">
            {editing ? "✏️ تعديل منتج" : "➕ إضافة منتج جديد"}
          </h2>
          <p className="mt-1 text-sm text-stone-500">ارفع الصورة وعدّل البيانات بسهولة</p>
        </div>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-xl border-2 border-stone-200 px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-50"
          >
            إلغاء
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          />

          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">اسم المنتج *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              placeholder="مثال: كفتة أرز"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-stone-700">السعر (جنيه) *</label>
              <input
                required
                type="number"
                inputMode="numeric"
                min={1}
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-stone-700">الوحدة</label>
              <input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="admin-input"
                placeholder="كيلو / نص كيلو"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-stone-700">التصنيف</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="admin-input"
            >
              {siteConfig.productCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border-2 border-brand-100 bg-brand-50/50 p-4">
            <label className="mb-1 block text-sm font-bold text-brand-900">وصف الصنف *</label>
            <p className="mb-2 text-xs text-stone-500">الوصف اللي هيظهر للعملاء في المنيو</p>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input"
              placeholder="وصف تفصيلي للصنف..."
            />
            <p className="mt-1 text-left text-xs text-stone-400">{form.description.length} حرف</p>
          </div>

          <div className="rounded-xl border-2 border-gold-100 bg-gold-50/40 p-4">
            <label className="mb-1 block text-sm font-bold text-brand-900">حالة التجهيز *</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {prepStatusOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
                    form.prepStatus === option.id
                      ? "border-brand-400 bg-white text-brand-700"
                      : "border-stone-200 bg-white text-stone-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="prepStatus"
                    value={option.id}
                    checked={form.prepStatus === option.id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prepStatus: e.target.value }))
                    }
                    className="accent-brand-600"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-xl border border-stone-200 bg-stone-50/50 p-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
              متاح للطلب
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
              منتج مميز ⭐
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row">
        <button type="submit" disabled={saving} className="admin-btn-primary flex-1 py-3.5 text-base">
          {saving ? "جاري الحفظ..." : editing ? "💾 حفظ التعديلات" : "✅ إضافة المنتج"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-stone-200 px-6 py-3.5 font-bold text-stone-600 hover:bg-stone-50"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}

export function AdminProductList({
  products,
  onEdit,
  onDelete,
  onAddNew,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");

  const categories = ["الكل", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.includes(search.trim()) ||
      p.description.includes(search.trim()) ||
      p.category.includes(search.trim());
    const matchCat = categoryFilter === "الكل" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-card overflow-hidden">
      <div className="border-b border-stone-100 bg-gradient-to-l from-brand-50 to-gold-50/50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-950">
              📦 المنتجات ({filtered.length})
            </h2>
            <p className="text-xs text-stone-500">ابحث أو فلتر بالتصنيف</p>
          </div>
          <button type="button" onClick={onAddNew} className="admin-btn-primary sm:hidden">
            ➕ منتج جديد
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث بالاسم أو التصنيف..."
            className="admin-input flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-input sm:w-48"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-stone-400">لا توجد منتجات مطابقة</p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-4 transition hover:bg-brand-50/30 sm:gap-4 sm:px-5"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-50 ring-2 ring-brand-100">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-extrabold text-brand-950">{p.name}</p>
                  {p.featured && (
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-700">
                      ⭐ مميز
                    </span>
                  )}
                  {!p.available && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                      غير متاح
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-brand-600">{p.unit}</p>
                <p className="mt-1 line-clamp-1 text-xs text-stone-500">
                  {p.description || "—"}
                </p>
                <p className="mt-1 text-xs font-semibold text-gold-600">{p.category}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="min-h-[40px] rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-100"
                >
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`حذف "${p.name}"؟`)) onDelete(p.id);
                  }}
                  className="min-h-[40px] rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
