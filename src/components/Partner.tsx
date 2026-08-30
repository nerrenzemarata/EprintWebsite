import { ArrowRight, Wrench, ShieldCheck, LineChart, Headset } from "lucide-react";
import SectionHeading from "./SectionHeading";

const included = [
  {
    icon: Wrench,
    title: "Full Installation",
    description: "Site assessment, delivery, and setup handled end-to-end by our team.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description: "Cash, coin & GCash payment handling, with files auto-deleted after every job.",
  },
  {
    icon: LineChart,
    title: "Remote Oversight",
    description: "Sales, ink, and paper stock monitored continuously from our dashboard.",
  },
  {
    icon: Headset,
    title: "Ongoing Support",
    description: "Software updates and maintenance for the life of the deployment.",
  },
];

export default function Partner() {
  return (
    <section id="partner" className="bg-brand-blue-light/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Partner With Us"
          title="Bring E-Print to your campus, office, or community"
          description="E-Print is deployed and operated directly by our team — not sold as standalone hardware. We handle installation, monitoring, and support, so you get self-service printing without the operational overhead."
        />

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-brand-blue/10 ring-1 ring-black/5">
          <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 sm:p-10">
            {included.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-brand-ink">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-slate">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-black/5 bg-brand-blue-light/40 px-8 py-8 text-center sm:px-10">
            <p className="max-w-md text-sm leading-relaxed text-brand-slate">
              Interested in a deployment for your location? Tell us a bit about
              the site and we&apos;ll get back to you with next steps.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold-dark hover:text-white"
            >
              Request a Deployment
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
