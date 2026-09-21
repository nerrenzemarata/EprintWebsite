export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-16 text-white sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.4),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-brand-gold uppercase">
          {eyebrow}
        </span>
        <h1 className="mt-5 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
