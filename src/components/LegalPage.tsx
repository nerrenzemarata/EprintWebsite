import PageHeader from "./PageHeader";

export type LegalSection = { title: string; body: string[] };

export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={`Last updated ${updated}`} />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="text-base leading-relaxed text-brand-slate">{intro}</p>
          <div className="mt-10 flex flex-col gap-10">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="font-display text-xl font-bold text-brand-ink">
                  {i + 1}. {section.title}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-brand-slate">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
