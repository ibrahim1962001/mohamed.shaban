"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductSection from "@/components/ProductSection";
import Cart from "@/components/Cart";
import type { Product } from "@/lib/types";
import { siteConfig, getWhatsAppLink } from "@/lib/config";

interface Review {
  name: string;
  text: string;
  image?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [area, setArea] = useState("بنها");
  const [filter, setFilter] = useState("الكل");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()).catch(() => []),
    ])
      .then(([prods, revs]) => {
        setProducts(prods);
        setReviews(Array.isArray(revs) ? revs : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const {
    weddings: weddingsCategory,
    grooms: groomsCategory,
    parties: partiesCategory,
    trays: traysCategory,
    drinks: drinksCategory,
  } = siteConfig.sectionCategories;

  const sectionCats = [
    weddingsCategory,
    groomsCategory,
    partiesCategory,
    traysCategory,
    drinksCategory,
  ];

  const weddingProducts = products.filter((p) => p.category === weddingsCategory);
  const groomsProducts = products.filter((p) => p.category === groomsCategory);
  const partyProducts = products.filter((p) => p.category === partiesCategory);
  const trayProducts = products.filter((p) => p.category === traysCategory);
  const drinkProducts = products.filter((p) => p.category === drinksCategory);
  const menuProducts = products.filter((p) => !sectionCats.includes(p.category));

  const categories = ["الكل", ...new Set(menuProducts.map((p) => p.category))];
  const filtered =
    filter === "الكل"
      ? menuProducts
      : menuProducts.filter((p) => p.category === filter);

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] <= 1) delete next[id];
      else next[id]--;
      return next;
    });

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = products.find((p) => p.id === id);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean) as { product: Product; quantity: number }[];

  return (
    <div className="min-h-screen bg-warm-bg">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/80 via-warm-bg to-white" />
        <div className="pattern-dots absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-14 text-center md:py-20">
          <div className="animate-slide-up">
            <span className="hero-badge mb-6">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                ✓
              </span>
              حساب موثّق — ١٫٥ ألف متابع
            </span>

            <h1 className="mb-3 text-4xl font-black leading-tight text-stone-900 md:text-5xl">
              {siteConfig.nameAr}
            </h1>
            <p className="mb-4 text-3xl font-black text-brand-600 md:text-4xl">
              أكل منزلي فاخر
            </p>
            <p className="mx-auto mb-8 max-w-lg text-base font-medium text-stone-600 md:text-lg">
              {siteConfig.tagline}
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-2.5">
              {siteConfig.specialties.map((s) => (
                <span key={s} className="hero-tag">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
              <a href="#menu" className="btn-primary sm:min-w-[200px]">
                <span aria-hidden>🍽️</span>
                شوف المنيو
              </a>
              <a
                href={getWhatsAppLink("مرحباً، عايز أطلب")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp sm:min-w-[200px]"
              >
                واتساب للطلب
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="border-y border-gold-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title mb-8">🚚 التوصيل</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {siteConfig.deliveryAreas.map((a, i) => (
              <div
                key={a}
                className="rounded-3xl border-2 border-gold-100 bg-gradient-to-br from-gold-50 to-brand-50 p-6 text-center shadow-sm transition hover:shadow-warm"
              >
                <p className="text-4xl">{i === 0 ? "🏠" : "🏙️"}</p>
                <p className="mt-3 text-lg font-extrabold text-stone-800">{a}</p>
              </div>
            ))}
            <div className="rounded-3xl border-2 border-brand-300 bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-center text-white shadow-warm">
              <p className="text-4xl">⏰</p>
              <p className="mt-3 text-lg font-extrabold">{siteConfig.deliveryNote}</p>
            </div>
          </div>
        </div>
      </section>

      <ProductSection
        id="weddings"
        title="أكل الأفراح"
        subtitle={siteConfig.weddingsIntro}
        emoji="💒"
        products={weddingProducts}
        loading={loading}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        accent="brand"
      />

      <ProductSection
        id="grooms"
        title="أكل العرسان"
        subtitle={siteConfig.groomsIntro}
        emoji="💍"
        products={groomsProducts}
        loading={loading}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        accent="gold"
      />

      <ProductSection
        id="parties"
        title="العزومات"
        subtitle={siteConfig.partiesIntro}
        emoji="🎉"
        products={partyProducts}
        loading={loading}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        accent="brand"
      />

      <ProductSection
        id="trays"
        title="الصواني"
        subtitle={siteConfig.traysIntro}
        emoji="🍱"
        products={trayProducts}
        loading={loading}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        accent="gold"
      />

      <ProductSection
        id="drinks"
        title="مشروبات ساقعة"
        subtitle={siteConfig.drinksIntro}
        emoji="🥤"
        products={drinkProducts}
        loading={loading}
        cart={cart}
        onAdd={addToCart}
        onRemove={removeFromCart}
        accent="sky"
      />

      {/* Menu */}
      <section id="menu" className="py-14 pb-36">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="section-title">🍽️ المنيو</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-2xl px-5 py-2.5 text-sm font-extrabold transition ${
                    filter === cat
                      ? "bg-gradient-to-l from-brand-600 to-brand-500 text-white shadow-warm"
                      : "border-2 border-gold-200 bg-white text-stone-600 hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-3xl bg-brand-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center font-semibold text-stone-400">لا توجد منتجات حالياً</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onAdd={() => addToCart(product.id)}
                  onRemove={() => removeFromCart(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section id="reviews" className="border-t border-gold-100 bg-gradient-to-b from-gold-50 to-white py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="section-title mb-2">⭐ آراء العملاء</h2>
            <p className="mb-8 text-stone-500">آراء حقيقية من عملاء Cheef Mohamed Shaban</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-3xl border-2 border-gold-100 bg-white shadow-card transition hover:shadow-warm"
                >
                  {review.image && (
                    <div className="relative aspect-video w-full bg-brand-50">
                      <Image
                        src={review.image}
                        alt={`رأي ${review.name}`}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="mb-3 text-sm leading-relaxed text-stone-700">{review.text}</p>
                    <p className="text-sm font-extrabold text-brand-600">— {review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Cart items={cartItems} area={area} onAreaChange={setArea} onClear={() => setCart({})} />

      <footer className="border-t border-brand-900 bg-stone-900 py-10 text-center">
        <p className="font-bold text-gold-200">{siteConfig.nameAr}</p>
        <p className="mt-1 text-sm text-stone-400">أكل منزلي فاخر | بنها & القاهرة</p>
        <a
          href={siteConfig.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white"
        >
          تابعنا على فيسبوك
        </a>
      </footer>
    </div>
  );
}
