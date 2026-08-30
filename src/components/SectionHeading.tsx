export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } gap-4`}
    >
      <span
        className={`rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase ${
          light
            ? "bg-white/10 text-brand-gold"
            : "bg-brand-blue-light text-brand-blue"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-brand-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed ${
            light ? "text-white/75" : "text-brand-slate"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
