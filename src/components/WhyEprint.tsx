import { Cpu, ScanLine, Gauge, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const points = [
  {
    icon: Cpu,
    title: "Real Hardware, Not a Mockup",
    description:
      "Each unit runs on integrated hardware for coin and bill acceptance, paired with a commercial-grade printer and photocopier engine — built to run unattended, continuously.",
  },
  {
    icon: ScanLine,
    title: "Automated Payment Reconciliation",
    description:
      "GCash payments are detected and confirmed automatically the moment they arrive — no manual checking, no missed transactions, no end-of-day guesswork.",
  },
  {
    icon: Gauge,
    title: "Enterprise-Grade Oversight",
    description:
      "A dedicated admin dashboard reports sales, machine health, ink, and paper levels in real time, reachable remotely from anywhere a unit is deployed.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by Design",
    description:
      "Uploaded files are deleted the instant a job finishes printing, with an automatic sweep for anything left behind — nothing lingers beyond the transaction.",
  },
];

export default function WhyEprint() {
  return (
    <section id="why" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why E-Print"
          title="Built on real engineering, not a proof of concept"
          description="E-Print is a fully operational system — from the hardware handling payments to the software reconciling them — designed to hold up under real, everyday use."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                <Icon size={24} strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg font-semibold text-brand-ink">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
