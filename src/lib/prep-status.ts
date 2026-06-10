export type PrepStatusId = "instant" | "on_order" | "next_day" | "preorder";

export interface PrepStatusOption {
  id: PrepStatusId;
  label: string;
  badgeClass: string;
}

export const prepStatusOptions: PrepStatusOption[] = [
  {
    id: "instant",
    label: "متاح فوري",
    badgeClass: "border-green-700 bg-green-600 text-white",
  },
  {
    id: "on_order",
    label: "يتحضر عند الطلب",
    badgeClass: "border-amber-600 bg-amber-500 text-white",
  },
  {
    id: "next_day",
    label: "متاح من اليوم التالي",
    badgeClass: "border-blue-700 bg-blue-600 text-white",
  },
  {
    id: "preorder",
    label: "طلب مسبق",
    badgeClass: "border-purple-700 bg-purple-600 text-white",
  },
];

export function getPrepStatus(id?: string): PrepStatusOption {
  return (
    prepStatusOptions.find((o) => o.id === id) ?? prepStatusOptions[1]
  );
}

export function defaultPrepStatusForCategory(category: string): PrepStatusId {
  if (
    category === "وجبات جاهزة" ||
    category === "مقبلات" ||
    category === "مشروبات ساقعة"
  )
    return "instant";
  if (
    category === "عزومات" ||
    category === "صواني" ||
    category === "أكل الأفراح" ||
    category === "أكل العرسان"
  )
    return "preorder";
  return "on_order";
}
