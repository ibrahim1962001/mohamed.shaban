"use client";

import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  products: Product[];
  loading: boolean;
  cart: Record<string, number>;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  accent?: "brand" | "gold" | "sky";
}

export default function ProductSection({
  id,
  title,
  subtitle,
  emoji,
  products,
  loading,
  cart,
  onAdd,
  onRemove,
  accent = "brand",
}: ProductSectionProps) {
  const isGold = accent === "gold";
  const isSky = accent === "sky";

  const sectionClass = isGold
    ? "border-y border-gold-300/35 bg-gradient-to-b from-gold-50/70 via-warm-bg to-warm-bg py-14"
    : isSky
      ? "border-y border-brand-300/30 bg-gradient-to-b from-brand-50/60 via-warm-bg to-warm-bg py-14"
      : "border-y border-brand-200/35 bg-gradient-to-b from-brand-50/50 via-warm-bg to-warm-bg py-14";

  const badgeClass = isGold
    ? "bg-gold-100 text-gold-700 border border-gold-200"
    : isSky
      ? "bg-brand-100 text-brand-700 border border-brand-200"
      : "bg-brand-100 text-brand-800 border border-brand-200";

  const skeletonClass = isGold ? "bg-gold-100" : "bg-brand-100";

  return (
    <section id={id} className={sectionClass}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center md:text-right">
          <span
            className={`mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${badgeClass}`}
          >
            {emoji} {title}
          </span>
          <h2 className="section-title mb-2">{title}</h2>
          <p className="mx-auto max-w-2xl text-stone-600 md:mx-0">{subtitle}</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-96 animate-pulse rounded-3xl ${skeletonClass}`}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center font-semibold text-stone-400">لا توجد أصناف حالياً</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={cart[product.id] || 0}
                onAdd={() => onAdd(product.id)}
                onRemove={() => onRemove(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
