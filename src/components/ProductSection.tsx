"use client";

import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";

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
    ? "border-y border-gold-300/35 bg-gradient-to-b from-gold-50/70 via-warm-bg to-warm-bg py-8 sm:py-14"
    : isSky
      ? "border-y border-brand-300/30 bg-gradient-to-b from-brand-50/60 via-warm-bg to-warm-bg py-8 sm:py-14"
      : "border-y border-brand-200/35 bg-gradient-to-b from-brand-50/50 via-warm-bg to-warm-bg py-8 sm:py-14";

  const skeletonClass = isGold ? "bg-gold-100" : "bg-brand-100";

  return (
    <section id={id} className={sectionClass}>
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <SectionHeader
          eyebrow={emoji}
          title={title}
          subtitle={subtitle}
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`aspect-[3/4] animate-pulse rounded-xl sm:aspect-auto sm:h-96 sm:rounded-3xl ${skeletonClass}`}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center font-semibold text-stone-400">لا توجد أصناف حالياً</p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-6">
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
