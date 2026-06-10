"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product, ProductInput } from "@/lib/types";
import { formatPrice } from "@/lib/config";
import { prepStatusOptions } from "@/lib/prep-status";
import PrepStatusBadge from "@/components/PrepStatusBadge";
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
  category: "عام",
  image: "",
  prepStatus: "on_order",
  available: true,
  featured: false,
};

const inputClass =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
    >
      <h2 className="mb-1 text-xl font-extrabold text-slate-800">
        {editing ? "✏️ تعديل منتج" : "➕ إضافة منتج جديد"}
      </h2>
      <p className="mb-6 text-sm text-slate-500">ارفع الصورة من الموبايل مباشرة</p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <ImageUploader
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
        />

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">اسم المنتج *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="مثال: كفتة أرز"
          />
        </div>

        <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50/50 p-4">
          <label className="mb-1 block text-sm font-bold text-slate-800">
            وصف الصنف *
          </label>
          <p className="mb-2 text-xs text-slate-500">
            الوصف اللي هيظهر للعملاء في المنيو — عدّله براحتك
          </p>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
            placeholder="مثال: كفتة لحم بلدي طازة متبلة بخلطة توابل سرية من الشيف، جاهزة للشوي..."
          />
          <p className="mt-1 text-left text-xs text-slate-400">
            {form.description.length} حرف
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">السعر (جنيه) *</label>
            <input
              required
              type="number"
              inputMode="numeric"
              min={1}
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">الوحدة</label>
            <input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className={inputClass}
              placeholder="كيلو / نص كيلو"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">التصنيف</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
            placeholder="لحوم / دواجن / تتبيلات"
          />
        </div>

        <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50/50 p-4">
          <label className="mb-1 block text-sm font-bold text-slate-800">
            حالة التجهيز *
          </label>
          <p className="mb-3 text-xs text-slate-500">
            التعريf اللي هيظهر للعميل على الصنf (متاح فوري، يتحضر عند الطلب...)
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {prepStatusOptions.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  form.prepStatus === option.id
                    ? "border-indigo-400 bg-white text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600"
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
                  className="accent-indigo-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="h-5 w-5 rounded accent-indigo-600"
            />
            متاح للطلب
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-5 w-5 rounded accent-indigo-600"
            />
            منتج مميز ⭐
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[52px] flex-1 rounded-2xl bg-indigo-600 py-3 text-base font-extrabold text-white shadow-md transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : editing ? "💾 حفظ التعديلات" : "✅ إضافة المنتج"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[52px] rounded-2xl border-2 border-slate-200 px-6 py-3 font-bold text-slate-600"
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
}: {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-extrabold text-slate-800">
          📦 المنتجات ({products.length})
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {products.length === 0 ? (
          <p className="px-5 py-10 text-center text-slate-400">لا توجد منتجات بعد</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-2 ring-slate-100">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold text-slate-800">{p.name}</p>
                <p className="text-sm font-bold text-indigo-600">
                  {formatPrice(p.price)} / {p.unit}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {p.description || "— لا يوجد وصف —"}
                </p>
                <div className="mt-2">
                  <PrepStatusBadge prepStatus={p.prepStatus} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{p.category}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => onEdit(p)}
                  className="min-h-[44px] rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700"
                >
                  تعديل
                </button>
                <button
                  onClick={() => {
                    if (confirm(`حذف "${p.name}"؟`)) onDelete(p.id);
                  }}
                  className="min-h-[44px] rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600"
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
