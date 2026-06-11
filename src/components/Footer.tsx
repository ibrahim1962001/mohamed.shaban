import { siteConfig, getWhatsAppLink } from "@/lib/config";

const quickLinks = [
  { href: "#menu", label: "المنيو" },
  { href: "#delivery", label: "التوصيل" },
];

export default function Footer() {
  return (
    <footer className="footer-pro safe-bottom">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-black text-gold-300">{siteConfig.nameAr}</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-200/80">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-xs text-brand-300/60">
              بنها & القاهرة — توصيل يومي
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-extrabold text-gold-400">روابط سريعة</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-100/80 transition hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-extrabold text-gold-400">تواصل معانا</p>
            <div className="flex flex-col gap-2">
              <a
                href={getWhatsAppLink("مرحباً، عايز أطلب")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp justify-center py-3 text-sm"
              >
                واتساب للطلب
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white"
              >
                فيسبوك
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-700/80 pt-6 text-center">
          <p className="text-xs text-brand-200/80">
            © {new Date().getFullYear()} {siteConfig.nameAr} — كل الحقوق محفوظة
          </p>
          <div className="mt-4 rounded-xl border border-gold-500/30 bg-brand-900/60 px-4 py-3">
            <p className="text-sm font-semibold text-white">
              Website designed by{" "}
              <span className="font-extrabold text-gold-300">Ibrahim Sabry</span>
            </p>
            <a
              href="tel:+201098144372"
              dir="ltr"
              className="mt-1 inline-block text-base font-extrabold tracking-wide text-gold-400 transition hover:text-gold-200"
            >
              01098144372
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
