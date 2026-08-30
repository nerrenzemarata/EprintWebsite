import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light via-white to-white"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-blue uppercase shadow-sm ring-1 ring-brand-blue/10">
            Self-Service Printing Kiosk
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-brand-ink sm:text-5xl lg:text-[3.25rem]">
            Printing that{" "}
            <span className="text-brand-blue">never closes.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-brand-slate">
            E-Print is a 24/7 self-service printing and photocopying vendo
            machine — built for schools, offices, and communities. No
            attendant, no waiting in line, no missed deadlines.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#partner"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-colors hover:bg-brand-blue-dark"
            >
              Partner With Us
              <ArrowRight size={16} />
            </a>
            <a
              href="#solution"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-ink/10 bg-white px-7 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-blue-light"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-brand-slate">
            <ShieldCheck size={18} className="text-brand-blue" />
            Supports UN Sustainable Development Goals 4, 8 &amp; 9
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand-blue/15 via-brand-gold/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-brand-blue/10 ring-1 ring-black/5">
            <Image
              src="/images/kiosk-hero.png"
              alt="E-Print self-service printing kiosk installed in a school hallway"
              width={700}
              height={1350}
              className="h-[420px] w-full rounded-[1.5rem] object-cover sm:h-[500px] lg:h-[560px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
