export const siteConfig = {
  name: "Cheef Mohamed Shaban",
  nameAr: "شيف محمد شعبان",
  tagline: "أكل منزلي فاخر — تتبيلات ووجبات جاهزة",
  facebookUrl: "https://www.facebook.com/mohamed.shaban.129491",
  chefPhoto: "/chef-photo.png",
  whatsappNumber: process.env.WHATSAPP_NUMBER || "201025849938",
  contactPhone: process.env.CONTACT_PHONE || "0133411350",
  deliveryAreas: ["بنها (كل المناطق)", "القاهرة"],
  specialties: ["تتبيلات الفراخ", "تجهيز الوجبات", "شغل فاخر يوم بيومه"],
  whyUs: [
    {
      icon: "👨‍🍳",
      title: "شغل بيتي أصلي",
      desc: "كل صنف بيتحضّر بإيد الشيف — مكونات طازة وتوابل خاصة.",
    },
    {
      icon: "🚚",
      title: "توصيل يومي",
      desc: "توصيل لبنها والقاهرة — نتفق على الموعد على واتساب.",
    },
    {
      icon: "💒",
      title: "أفراح وعزومات",
      desc: "بوفيهات كاملة وصواني جاهزة لأي مناسبة من 50 لـ 200 ضيف.",
    },
    {
      icon: "💳",
      title: "دفع مرن",
      desc: "كاش، انستاباي، فودافون كاش، أو محفظة إلكترونية.",
    },
  ],
  sectionCategories: {
    weddings: "أكل الأفراح",
    grooms: "أكل العرسان",
    parties: "عزومات",
    trays: "صواني",
    drinks: "مشروبات ساقعة",
  },
  weddingsIntro:
    "تجهيز وتقديم أكل الأفراح والمناسبات — بوفيهات كاملة، محطات مشاوي حية، صواني ومحاشي وحلويات. نخدم من 50 لـ 200 ضيف بشغل بيتي فاخر.",
  groomsIntro:
    "باكدجات مخصوصة للعرسان — عشاء رومانسي، فطار يوم الفرح، تجهيز مطبخ العروسة ووجبات شهر العسل. كل حاجة جاهزة لبداية حياتكم.",
  partiesIntro:
    "عزومات جاهزة بشغل بيتي فاخر — مشاوي، محاشي، أرز ومقبلات. اختار العزومة المناسبة لعدد ضيوفك واطلب بكل سهولة.",
  traysIntro:
    "صواني أكل منزلي فاخر — مثالية للعزومات، السفرات، والمناسبات. كل صينية جاهزة للتقديم.",
  drinksIntro:
    "مشروبات ساقعة طازة — عصائر طبيعية، ميلك شيك، كركديه بارد ومشروبات منعشة. مثالية مع أي طلب أكل.",
  productCategories: [
    "محاشي",
    "دواجن",
    "وجبات جاهزة",
    "مقبلات",
    "لحوم",
    "أسماك",
    "عزومات",
    "صواني",
    "مشروبات ساقعة",
    "أكل الأفراح",
    "أكل العرسان",
  ],
  paymentOptions: [
    { id: "cash", label: "كاش عند الاستلام" },
    { id: "instapay", label: "انستاباي" },
    { id: "vodafone", label: "فودافون كاش" },
    { id: "wallet", label: "محفظة إلكترونية" },
  ],
};

export function getWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getTelLink(phone = siteConfig.contactPhone): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("20") ? digits : `20${digits.replace(/^0/, "")}`;
  return `tel:+${normalized}`;
}

export function formatPhoneDisplay(phone = siteConfig.contactPhone): string {
  return phone;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-EG")} جنيه`;
}
