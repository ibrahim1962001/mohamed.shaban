"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProductSection from "@/components/ProductSection";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
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

  const menuCategories = [...new Set(menuProducts.map((p) => p.category))];
  const categories = ["الكل", ...menuCategories, ...sectionCats];
  const filtered =
    filter === "الكل"
      ? menuProducts
      : sectionCats.includes(filter)
        ? products.filter((p) => p.category === filter)
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
      <section className="hero-shell relative overflow-hidden">
        <div className="pattern-dots absolute inset-0 opacity-40" />
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-14 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="animate-slide-up text-center md:text-right">
              <p className="mb-2 text-xs font-extrabold tracking-wide text-gold-300 sm:text-sm">
                Cheef Mohamed Shaban
              </p>
              <h1 className="mb-2 text-2xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
                {siteConfig.nameAr}
              </h1>
              <p className="mb-4 text-lg font-black text-gold-300 sm:text-2xl md:text-3xl">
                أكل منزلي فاخر
              </p>
              <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-brand-100 sm:text-base md:mx-0">
                {siteConfig.tagline}
              </p>

              <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
                {siteConfig.specialties.map((s) => (
                  <span key={s} className="hero-tag text-xs sm:text-sm">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <a href="#menu" className="btn-primary sm:min-w-[180px]">
                  🍽️ شوف المنيو
                </a>
                <a
                  href={getWhatsAppLink("مرحباً، عايز أطلب")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp sm:min-w-[180px]"
                >
                  واتساب للطلب
                </a>
              </div>
            </div>

            <div className="animate-slide-up">
              <div className="chef-frame">
                <div className="chef-frame-inner relative aspect-[4/5] w-full">
                  <Image
                    src={siteConfig.chefPhoto}
                    alt={siteConfig.nameAr}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 280px, 400px"
                    priority
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { href: "#menu", emoji: "🍽️", label: "المنيو" },
                  { href: "#weddings", emoji: "💒", label: "الأفراح" },
                  { href: "#grooms", emoji: "💍", label: "العرسان" },
                  { href: "#parties", emoji: "🎉", label: "عزومات" },
                  { href: "#trays", emoji: "🍱", label: "صواني" },
                  { href: "#drinks", emoji: "🥤", label: "مشروبات" },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="quick-link">
                    <span className="text-xl sm:text-2xl">{link.emoji}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="border-b border-brand-200/40 bg-warm-bg py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <SectionHeader
            eyebrow="🍽️ المنيو"
            title="اختار من أصنافنا"
            subtitle="أصناف جاهزة للتسوية والشوي — بالصور. للاستفسار عن السعر تواصل على واتساب."
          />
          <div className="filter-scroll -mx-3 mb-6 overflow-x-auto px-3 sm:mx-0 sm:mb-8 sm:overflow-visible sm:px-0">
            <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold transition sm:rounded-2xl sm:px-5 sm:text-sm ${
                    filter === cat
                      ? "bg-gradient-to-l from-brand-700 to-brand-500 text-white shadow-warm"
                      : "border-2 border-brand-200/60 bg-brand-50/80 text-brand-800 hover:border-brand-400 hover:bg-brand-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-brand-100 sm:aspect-auto sm:h-96 sm:rounded-3xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center font-semibold text-stone-400">لا توجد منتجات حالياً</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-6">
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

      {/* Why us */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <SectionHeader
            eyebrow="ليه تختارنا"
            title="شغل بيتي بمعايير احترافية"
            subtitle="تتبيلات ووجبات جاهزة للتسوية والشوي — شغل بيتي بجودة ثابتة."
            align="center"
          />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
            {siteConfig.whyUs.map((item) => (
              <div key={item.title} className="why-card">
                <p className="text-2xl sm:text-3xl">{item.icon}</p>
                <p className="mt-2 text-sm font-extrabold text-brand-900 sm:text-base">{item.title}</p>
                <p className="mt-1 hidden text-xs leading-relaxed text-stone-500 sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <SectionHeader
            eyebrow="🚚 التوصيل"
            title="بنوصل لحد بابك"
            align="center"
          />
          <div className="mx-auto grid max-w-md gap-3 sm:max-w-none sm:grid-cols-2 sm:gap-4">
            {siteConfig.deliveryAreas.map((a, i) => (
              <div
                key={a}
                className="section-panel p-4 text-center transition hover:shadow-warm sm:p-6"
              >
                <p className="text-3xl sm:text-4xl">{i === 0 ? "🏠" : "🏙️"}</p>
                <p className="mt-2 text-base font-extrabold text-brand-800 sm:mt-3 sm:text-lg">{a}</p>
              </div>
            ))}
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

      {/* Reviews */}
      {reviews.length > 0 && (
        <section id="reviews" className="border-t border-brand-200/40 bg-gradient-to-b from-brand-50/40 to-warm-bg py-8 sm:py-14">
          <div className="mx-auto max-w-6xl px-3 sm:px-4">
            <SectionHeader
              eyebrow="⭐ آراء العملاء"
              title="عملاؤنا بيقولوا إيه"
              subtitle="آراء حقيقية من عملاء Cheef Mohamed Shaban"
              align="center"
            />
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <div key={i} className="product-card overflow-hidden">
                  {review.image && (
                    <div className="relative h-64 w-full bg-stone-100 sm:h-72 lg:h-80">
                      <Image
                        src={review.image}
                        alt={`رأي عميل ${i + 1}`}
                        fill
                        className="object-contain object-center p-1"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  {review.text?.trim() && (
                    <div className="p-4 sm:p-5">
                      <p className="mb-2 text-sm leading-relaxed text-stone-700">{review.text}</p>
                      <p className="text-sm font-extrabold text-brand-600">— {review.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-3 pb-32 sm:px-4 sm:pb-36">
        <div className="cta-banner mx-auto max-w-6xl">
          <h2 className="text-xl font-black text-white sm:text-2xl">جاهز تطلب؟</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-brand-100 sm:text-base">
            اختار أصنافك، كمّل الطلب، وابعتله على واتساب — هنرد عليك فوراً.
          </p>
          <a
            href={getWhatsAppLink("مرحباً، عايز أطلب من Cheef Mohamed Shaban")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-5 inline-flex px-8 py-3 text-sm"
          >
            اطلب على واتساب
          </a>
        </div>
      </section>

      <Cart items={cartItems} area={area} onAreaChange={setArea} onClear={() => setCart({})} />
      <FloatingWhatsApp hidden={cartItems.length > 0} />
      <Footer />
    </div>
  );
}
