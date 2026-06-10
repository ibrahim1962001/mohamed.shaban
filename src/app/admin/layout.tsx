import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Cheef Mohamed Shaban",
  description: "إدارة المنتجات والأسعار",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-body min-h-screen">{children}</div>;
}
