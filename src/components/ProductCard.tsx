"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/config";
import PrepStatusBadge from "@/components/PrepStatusBadge";

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  return (
    <article className="product-card group animate-slide-up">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 via-gold-50 to-brand-100">
            <span className="animate-float text-6xl">🍽️</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gradient-to-l from-brand-600 to-brand-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
            ⭐ مميز
          </span>
        )}
        <div className="absolute left-3 top-3">
          <PrepStatusBadge prepStatus={product.prepStatus} />
        </div>
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm">
            <span className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white">
              غير متاح
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-extrabold text-stone-800">{product.name}</h3>
          <span className="shrink-0 rounded-lg bg-gold-100 px-2.5 py-1 text-xs font-bold text-brand-700">
            {product.category}
          </span>
        </div>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-stone-600">
          {product.description || "—"}
        </p>
        <div className="mb-4">
          <p className="text-2xl font-black text-brand-600">{formatPrice(product.price)}</p>
          <p className="text-xs font-semibold text-stone-400">/ {product.unit}</p>
        </div>

        {product.available && (
          quantity > 0 ? (
            <div className="flex items-center justify-between rounded-2xl border-2 border-brand-200 bg-brand-50 px-3 py-2">
              <button
                onClick={onRemove}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold text-brand-700 shadow-sm transition hover:bg-brand-100"
                aria-label="تقليل"
              >
                −
              </button>
              <span className="text-lg font-black text-brand-700">{quantity}</span>
              <button
                onClick={onAdd}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white shadow-sm transition hover:bg-brand-500"
                aria-label="زيادة"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="btn-primary w-full py-3 text-sm"
            >
              🛒 أضف للسلة
            </button>
          )
        )}
      </div>
    </article>
  );
}
