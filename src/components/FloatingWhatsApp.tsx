"use client";

import { getWhatsAppLink } from "@/lib/config";

interface FloatingWhatsAppProps {
  hidden?: boolean;
}

export default function FloatingWhatsApp({ hidden }: FloatingWhatsAppProps) {
  if (hidden) return null;

  return (
    <a
      href={getWhatsAppLink("مرحباً، عايز أطلب من Cheef Mohamed Shaban")}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="واتساب للطلب"
    >
      <span className="text-2xl">💬</span>
      <span className="hidden text-sm font-bold sm:inline">اطلب دلوقتي</span>
    </a>
  );
}
