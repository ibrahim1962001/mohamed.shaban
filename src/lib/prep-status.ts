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
    badgeClass: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "on_order",
    label: "يتحضر عند الطلب",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: "next_day",
    label: "متاح من اليوم التالي",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "preorder",
    label: "طلب مسبق",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
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
