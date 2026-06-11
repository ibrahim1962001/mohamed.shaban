"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, getWhatsAppLink } from "@/lib/config";

const navItems = [
  { href: "#menu", label: "المنيو", emoji: "🍽️" },
  { href: "#delivery", label: "التوصيل", emoji: "🚚" },
  { href: "#reviews", label: "آراء العملاء", emoji: "⭐" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brand-600/30 bg-gradient-to-l from-brand-950 via-brand-900 to-brand-950 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-gold-400/80 shadow-warm sm:h-12 sm:w-12 sm:rounded-2xl">
            <Image
              src={siteConfig.chefPhoto}
              alt={siteConfig.nameAr}
              fill
              className="object-cover object-top"
              sizes="48px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white sm:text-lg">{siteConfig.nameAr}</p>
            <p className="truncate text-[10px] font-semibold text-gold-300 sm:text-xs">أكل بيتي فاخر</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-2.5 py-2 text-xs font-bold text-brand-100/90 transition hover:bg-white/10 hover:text-gold-300 xl:px-3 xl:text-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={getWhatsAppLink("مرحباً، عايز أطلب من Cheef Mohamed Shaban")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex h-10 min-h-0 items-center justify-center px-3 py-2 text-xs sm:hidden"
            aria-label="واتساب"
          >
            واتساب
          </a>
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/40 bg-white/10 text-lg text-gold-200 lg:hidden"
            aria-label="القائمة"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-brand-600/30 bg-brand-950/98 px-4 py-4 lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-brand-600/30 bg-white/5 px-3 py-3 text-sm font-bold text-brand-100"
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
