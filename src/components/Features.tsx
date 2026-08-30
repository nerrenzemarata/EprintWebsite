import {
  MonitorSmartphone,
  Coins,
  Cable,
  Banknote,
  Printer,
  Ticket,
  Activity,
  TrendingUp,
  Droplet,
  FileStack,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const features = [
  {
    icon: MonitorSmartphone,
    title: "Touch Screen Interface",
    description: "A simple, guided touch screen that takes anyone from file to printout in a few taps.",
  },
  {
    icon: Cable,
    title: "3-Mode File Transfer",
    description: "Send files via USB drive, Bluetooth, or QR code hotspot upload — whatever's easiest.",
  },
  {
    icon: Coins,
    title: "Coin Acceptor",
    description: "Built-in coin acceptor for fast, cashless-free micro-payments on the spot.",
  },
  {
    icon: Banknote,
    title: "Bill Acceptor",
    description: "Accepts cash bills alongside coins and GCash for total payment flexibility.",
  },
  {
    icon: Printer,
    title: "Photocopier & Printer",
    description: "A full printer and photocopier built into one compact, weatherproof unit.",
  },
  {
    icon: Ticket,
    title: "Voucher System",
    description: "Issue and redeem print vouchers — ideal for schools, offices, and promos.",
  },
  {
    icon: Activity,
    title: "Remote Monitoring",
    description: "Track machine health and performance from anywhere, in real time.",
  },
];

const monitoring = [
  {
    icon: TrendingUp,
    title: "Sales Monitoring",
    description: "Live revenue, transaction counts, and job history at a glance.",
  },
  {
    icon: Droplet,
    title: "Ink Level Monitoring",
    description: "Know exactly when a refill is needed before it runs out.",
  },
  {
    icon: FileStack,
    title: "Paper Stock Monitoring",
    description: "Track remaining paper sheets to avoid unexpected downtime.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything a full-service print shop has — without the shop"
          description="E-Print packs the essentials of a print shop into one always-on kiosk."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-md"
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

          <div className="flex flex-col justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-dark p-6 text-white shadow-lg shadow-brand-blue/25">
            <div className="font-display text-base font-semibold">
              Admin Dashboard
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Every metric below, viewable remotely from your phone or laptop —
              wherever your E-Print units are deployed.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {monitoring.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold-dark">
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
      </div>
    </section>
  );
}
