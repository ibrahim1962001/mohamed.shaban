"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, getWhatsAppLink, siteConfig } from "@/lib/config";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  area: string;
  onAreaChange: (area: string) => void;
  onClear: () => void;
}

interface OrderForm {
  name: string;
  address: string;
  landmark: string;
  phone1: string;
  phone2: string;
  payment: string;
  eventDate: string;
  guestCount: string;
  notes: string;
}

const emptyForm: OrderForm = {
  name: "",
  address: "",
  landmark: "",
  phone1: "",
  phone2: "",
  payment: "cash",
  eventDate: "",
  guestCount: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border-2 border-gold-200 bg-white px-4 py-3 text-base text-stone-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function Cart({ items, area, onAreaChange, onClear }: CartProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<OrderForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasEventItems = items.some(
    (item) =>
      item.product.category === "أكل الأفراح" ||
      item.product.category === "أكل العرسان"
  );

  const paymentLabel =
    siteConfig.paymentOptions.find((p) => p.id === form.payment)?.label ??
    form.payment;

  const buildOrderMessage = (order: OrderForm): string => {
    const lines = [
      "🍽️ *طلب جديد من Cheef Mohamed Shaban*",
      "",
      "👤 *بيانات العميل:*",
      `• الاسم: ${order.name}`,
      `• العنوان: ${order.address}`,
      `• أقرب علامة: ${order.landmark}`,
      `• رقم 1: ${order.phone1}`,
      ...(order.phone2.trim()
        ? [`• رقم 2: ${order.phone2.trim()}`]
        : []),
      "",
      "📋 *الطلب:*",
      ...items.map(
        (item) =>
          `• ${item.product.name} (${item.product.unit}) × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
      ),
      "",
      `💰 *الإجمالي:* ${formatPrice(total)}`,
      `📍 *منطقة التوصيل:* ${area}`,
      `💳 *طريقة الدفع:* ${paymentLabel}`,
      ...(order.eventDate.trim()
        ? [`📅 *تاريخ المناسبة:* ${order.eventDate.trim()}`]
        : []),
      ...(order.guestCount.trim()
        ? [`👥 *عدد الضيوف:* ${order.guestCount.trim()}`]
        : []),
      ...(order.notes.trim()
        ? [`📝 *ملاحظات:* ${order.notes.trim()}`]
        : []),
    ];
    return lines.join("\n");
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof OrderForm, string>> = {};

    if (!form.name.trim()) next.name = "اكتب اسمك";
    if (!form.address.trim()) next.address = "اكتب العنوان بالتفصيل";
    if (!form.landmark.trim()) next.landmark = "اكتب أقرب علامة أو مكان";
    if (!form.phone1.trim()) next.phone1 = "رقم التواصل مطلوب";
    else if (!/^01[0-9]{9}$/.test(form.phone1.replace(/\s/g, "")))
      next.phone1 = "رقم موبايل مصري صحيح (11 رقم)";

    if (
      form.phone2.trim() &&
      !/^01[0-9]{9}$/.test(form.phone2.replace(/\s/g, ""))
    )
      next.phone2 = "رقم موبايل مصري صحيح (11 رقم)";

    if (!form.payment) next.payment = "اختار طريقة الدفع";

    if (hasEventItems) {
      if (!form.eventDate.trim()) next.eventDate = "حدد تاريخ المناسبة";
      if (!form.guestCount.trim()) next.guestCount = "اكتب عدد الضيوف المتوقع";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    window.open(getWhatsAppLink(buildOrderMessage(form)), "_blank", "noopener,noreferrer");
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setErrors({});
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setErrors({});
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Checkout modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-stone-900/50 p-0 sm:items-center sm:p-4"
          onClick={handleCloseForm}
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-800">إتمام الطلب</h2>
                <p className="text-sm text-stone-500">
                  {items.length} صنف — {formatPrice(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xl text-stone-600"
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="mb-5 rounded-2xl border-2 border-gold-100 bg-gold-50/50 p-4">
              <p className="mb-2 text-sm font-bold text-stone-700">ملخص الطلب</p>
              <ul className="space-y-1 text-sm text-stone-600">
                {items.map(({ product, quantity }) => (
                  <li key={product.id}>
                    {product.name} × {quantity} —{" "}
                    {formatPrice(product.price * quantity)}
                  </li>
                ))}
              </ul>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700">
                  الاسم *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="مثال: محمد أحمد"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700">
                  العنوان بالتفصيل *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="الشارع، رقم العمارة، الدور، الشقة..."
                />
                {errors.address && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700">
                  أقرب علامة أو مكان *
                </label>
                <input
                  required
                  value={form.landmark}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, landmark: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="مثال: بجوار مسجد النور، أمام صيدلية..."
                />
                {errors.landmark && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.landmark}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-stone-700">
                    رقم التواصل 1 *
                  </label>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    value={form.phone1}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone1: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="01xxxxxxxxx"
                  />
                  {errors.phone1 && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {errors.phone1}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-stone-700">
                    رقم التواصل 2
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone2}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone2: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="01xxxxxxxxx (اختياري)"
                  />
                  {errors.phone2 && (
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      {errors.phone2}
                    </p>
                  )}
                </div>
              </div>

              {hasEventItems && (
                <div className="rounded-2xl border-2 border-brand-200 bg-brand-50/60 p-4 space-y-4">
                  <p className="text-sm font-bold text-brand-800">
                    💒 بيانات الحجز (أفراح / عرسان)
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-bold text-stone-700">
                        تاريخ المناسبة *
                      </label>
                      <input
                        type="date"
                        value={form.eventDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, eventDate: e.target.value }))
                        }
                        className={inputClass}
                      />
                      {errors.eventDate && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.eventDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-stone-700">
                        عدد الضيوف *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.guestCount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, guestCount: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="مثال: 100"
                      />
                      {errors.guestCount && (
                        <p className="mt-1 text-xs font-semibold text-red-600">
                          {errors.guestCount}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-stone-700">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="مكان الفرح، وقت التسليم، طلبات خاصة..."
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-bold text-stone-700">
                  منطقة التوصيل
                </label>
                <select
                  value={area}
                  onChange={(e) => onAreaChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="بنها">📍 بنها (كل المناطق)</option>
                  <option value="القاهرة">📍 القاهرة</option>
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-stone-700">
                  طريقة الدفع *
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {siteConfig.paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        form.payment === option.id
                          ? "border-brand-400 bg-brand-50 text-brand-700"
                          : "border-gold-200 bg-white text-stone-600 hover:border-brand-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={form.payment === option.id}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, payment: e.target.value }))
                        }
                        className="accent-brand-600"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {errors.payment && (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.payment}
                  </p>
                )}
              </div>

              <button type="submit" className="btn-whatsapp w-full py-4 text-base">
                إرسال الطلب على واتساب
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-gold-400/50 bg-gradient-to-l from-brand-900 via-brand-800 to-brand-900 p-4 shadow-[0_-8px_30px_rgba(76,5,25,0.35)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-extrabold text-gold-100">
              🛒 {items.length} صنف — الإجمالي:{" "}
              <span className="text-gold-300">{formatPrice(total)}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-gold-200/70">
              📍 {area}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClear}
              className="rounded-2xl border-2 border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              مسح
            </button>
            <button
              onClick={handleOpenForm}
              className="btn-whatsapp flex-1 px-6 py-3 text-sm sm:flex-none"
            >
              إتمام الطلب
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
