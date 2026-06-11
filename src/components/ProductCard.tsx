"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
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
      <div className="relative aspect-square overflow-hidden bg-brand-50 sm:aspect-[4/3]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 via-gold-50 to-brand-100">
            <span className="text-3xl sm:text-6xl">🍽️</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-gold-400 px-1.5 py-0.5 text-[9px] font-extrabold text-brand-950 shadow sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
            <span className="sm:hidden">⭐</span>
            <span className="hidden sm:inline">⭐ مميز</span>
          </span>
        )}
        <div className="absolute left-1.5 top-1.5 z-10 sm:left-3 sm:top-3">
          <PrepStatusBadge
            prepStatus={product.prepStatus}
            className="max-w-[5.5rem] truncate px-1.5 py-0.5 text-[9px] leading-tight sm:max-w-none sm:px-2.5 sm:py-1 sm:text-xs"
          />
        </div>
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm">
            <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold text-white sm:px-5 sm:py-2 sm:text-sm">
              غير متاح
            </span>
          </div>
        )}
      </div>

      <div className="card-body p-2.5 sm:p-5">
        <h3 className="mb-1 line-clamp-2 text-xs font-extrabold leading-snug text-stone-800 sm:mb-2 sm:text-lg">
          {product.name}
        </h3>
        <p className="mb-2 hidden line-clamp-2 text-xs leading-relaxed text-stone-600 sm:mb-4 sm:block sm:line-clamp-3 sm:text-sm">
          {product.description || "—"}
        </p>
        <p className="mb-2 text-[10px] font-semibold text-brand-600 sm:mb-4 sm:text-xs">
          للاستفسار عن السعر — تواصل على واتساب
        </p>

        {product.available && (
          quantity > 0 ? (
            <div className="flex items-center justify-between rounded-lg border-2 border-brand-200 bg-brand-50 px-1 py-1 sm:rounded-2xl sm:px-3 sm:py-2">
              <button
                onClick={onRemove}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-base font-bold text-brand-700 shadow-sm active:scale-95 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xl"
                aria-label="تقليل"
              >
                −
              </button>
              <span className="text-sm font-black text-brand-700 sm:text-lg">{quantity}</span>
              <button
                onClick={onAdd}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-base font-bold text-white shadow-sm active:scale-95 sm:h-11 sm:w-11 sm:rounded-xl sm:text-xl"
                aria-label="زيادة"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="btn-primary w-full py-2 text-[11px] sm:py-3 sm:text-sm"
            >
              <span className="sm:hidden">🛒 أضف</span>
              <span className="hidden sm:inline">🛒 أضف للسلة</span>
            </button>
          )
        )}
      </div>
    </article>
  );
}
