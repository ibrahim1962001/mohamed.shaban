interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "right";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "right",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "md:text-right";

  return (
    <div className={`mb-6 sm:mb-8 ${alignClass}`}>
      {eyebrow && (
        <p className="section-eyebrow mb-2">{eyebrow}</p>
      )}
      <h2 className="section-title-pro">{title}</h2>
      <div className={`section-line ${align === "center" ? "mx-auto" : "md:mr-0"}`} />
      {subtitle && (
        <p className={`section-subtitle mt-3 max-w-2xl ${align === "center" ? "mx-auto" : "md:ml-0"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
