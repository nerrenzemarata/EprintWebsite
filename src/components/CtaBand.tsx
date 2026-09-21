import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBand({
  title,
  description,
  label,
  href,
  tone = "blue",
}: {
  title: string;
  description: string;
  label: string;
  href: string;
  tone?: "blue" | "dark";
}) {
  const external = href.startsWith("mailto:");
  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-ink shadow-lg shadow-black/20 transition-colors hover:bg-brand-gold-dark hover:text-white";

  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-20 ${
        tone === "blue"
          ? "bg-linear-to-br from-brand-blue to-brand-blue-dark"
          : "bg-brand-ink"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/75">
            {description}
          </p>
        </div>
        {external ? (
          <a href={href} className={className}>
            {label}
            <ArrowRight size={16} />
          </a>
        ) : (
          <Link href={href} className={className}>
            {label}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}
