import Link from "next/link";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Coins,
  Briefcase,
  MousePointerClick,
  Headset,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const benefits = [
  {
    icon: Clock,
    title: "Convenient",
    description: "Print or copy at any hour — no opening hours and no queue.",
  },
  {
    icon: MapPin,
    title: "Accessible",
    description:
      "Brings self-service printing to schools, stores, and communities without a reliable print shop.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable",
    description:
      "Holds up to 3,000 sheets (6 reams) of bond paper and runs unattended, monitored remotely.",
  },
  {
    icon: Coins,
    title: "Practical",
    description:
      "Coin, bill, and online payments, with USB, Bluetooth, and QR file transfer.",
  },
  {
    icon: Briefcase,
    title: "Business-ready",
    description:
      "Host sites can earn a revenue share, with zero staffing required.",
  },
  {
    icon: MousePointerClick,
    title: "Easy to use",
    description:
      "A guided touchscreen takes anyone from file to printout in a few taps.",
  },
  {
    icon: Headset,
    title: "Professional support",
    description:
      "Installation, updates, and maintenance handled by our team for the life of the deployment.",
  },
];

export default function WhyChoose() {
  return (
    <section id="why" className="bg-brand-blue-light/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose E-Print"
          title="Made to be simple for users and dependable for hosts"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm shadow-black/[0.03] ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-base font-semibold text-brand-ink">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate">
                {description}
              </p>
            </div>
          ))}

          <Link
            href="/request-deployment"
            className="group flex flex-col justify-center gap-3 rounded-2xl bg-linear-to-br from-brand-blue to-brand-blue-dark p-6 text-white shadow-lg shadow-brand-blue/25"
          >
            <span className="font-display text-base font-semibold">
              Want one at your location?
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
              Request Deployment
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
