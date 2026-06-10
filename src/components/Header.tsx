"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig, getWhatsAppLink } from "@/lib/config";

export default function Header() {
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

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "#weddings", label: "أكل الأفراح" },
            { href: "#grooms", label: "أكل العرسان" },
            { href: "#parties", label: "العزومات" },
            { href: "#trays", label: "الصواني" },
            { href: "#drinks", label: "مشروبات ساقعة" },
            { href: "#menu", label: "المنيو" },
            { href: "#delivery", label: "التوصيل" },
            { href: "#reviews", label: "آراء العملاء" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-bold text-gold-100/90 transition hover:bg-white/10 hover:text-gold-300"
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
            className="btn-whatsapp px-4 py-2.5 text-sm"
          >
            واتساب
          </a>
        </div>
      </div>
    </header>
  );
}
