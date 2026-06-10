"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, getWhatsAppLink } from "@/lib/config";

const navItems = [
  { href: "#weddings", label: "أكل الأفراح", emoji: "💒" },
  { href: "#grooms", label: "أكل العرسان", emoji: "💍" },
  { href: "#parties", label: "العزومات", emoji: "🎉" },
  { href: "#trays", label: "الصواني", emoji: "🍱" },
  { href: "#drinks", label: "مشروبات ساقعة", emoji: "🥤" },
  { href: "#menu", label: "المنيو", emoji: "🍽️" },
  { href: "#delivery", label: "التوصيل", emoji: "🚚" },
  { href: "#reviews", label: "آراء العملاء", emoji: "⭐" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-gold-400/40 bg-gradient-to-l from-brand-900 via-brand-800 to-brand-900 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-gold-400 shadow-warm">
            <Image
              src={siteConfig.chefPhoto}
              alt={siteConfig.nameAr}
              fill
              className="object-cover object-top"
              sizes="48px"
              priority
            />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white">{siteConfig.nameAr}</p>
            <p className="text-xs font-semibold text-gold-300">أكل بيتي فاخر</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.slice(0, 6).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-2.5 py-2 text-xs font-bold text-gold-100/90 transition hover:bg-white/10 hover:text-gold-300 xl:px-3 xl:text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white sm:inline-flex"
          >
            فيسبوك
          </a>
          <a
            href={getWhatsAppLink("مرحباً، عايز أطلب من Cheef Mohamed Shaban")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp hidden px-4 py-2.5 text-sm sm:inline-flex"
          >
            واتساب
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/40 bg-white/10 text-xl text-gold-200 lg:hidden"
            aria-label="القائمة"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold-400/30 bg-brand-950/95 px-4 py-4 lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-gold-400/25 bg-white/5 px-3 py-3 text-sm font-bold text-gold-100"
              >
                <span>{item.emoji}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={getWhatsAppLink("مرحباً، عايز أطلب من Cheef Mohamed Shaban")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-3 w-full py-3 text-sm"
          >
            واتساب للطلب
          </a>
        </div>
      )}
    </header>
  );
}
