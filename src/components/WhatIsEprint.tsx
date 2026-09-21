import Image from "next/image";
import { Cog, Users, Lightbulb, AlertTriangle } from "lucide-react";
import SectionHeading from "./SectionHeading";

const facts = [
  {
    icon: Cog,
    title: "What it does",
    description:
      "Prints and photocopies on demand from one guided touchscreen, accepting coins, bills, and online payment.",
  },
  {
    icon: Users,
    title: "Who it's for",
    description:
      "Students, teachers, office workers, and communities — hosted in schools, stores, and public spaces.",
  },
  {
    icon: Lightbulb,
    title: "Why it was created",
    description:
      "Every dream needs a first page. E-Print exists so printing is never the reason someone falls short.",
  },
  {
    icon: AlertTriangle,
    title: "The problem it solves",
    description:
      "Print shops close, queues form, and over 21 million Philippine households don't own a printer.",
  },
];

export default function WhatIsEprint() {
  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="What is E-Print?"
            title="A print shop that's always open"
            description="E-Print is a self-service printing and photocopying vendo kiosk. Walk up, send your file by USB, Bluetooth, or QR code, pay with coins, bills, or online payment, and collect your printout — no attendant and no queue."
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {facts.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-brand-ink">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-blue/15 ring-1 ring-black/5">
          <Image
            src="/images/machine-with-person.png"
            alt="A person using the E-Print kiosk, resting a hand on its scanner cover"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[60%_center]"
          />
        </div>
      </div>
    </section>
  );
}
