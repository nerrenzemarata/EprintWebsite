import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, FileStack, Upload, Wallet, Printer } from "lucide-react";
import SectionHeading from "./SectionHeading";

const keyFeatures = [
  "Guided touchscreen interface",
  "USB, Bluetooth, and QR code file transfer",
  "Coin, bill, and online payments",
  "Printer and photocopier in one unit",
  "Voucher system for schools and promos",
  "Remote monitoring of sales, ink, and paper",
];

const steps = [
  { icon: Upload, label: "Send your file" },
  { icon: Wallet, label: "Pay" },
  { icon: Printer, label: "Collect your printout" },
];

const locations = [
  "Schools & campuses",
  "Sari-sari stores",
  "Offices",
  "Barangay halls",
  "Churches",
  "Other community spaces",
];

export default function Product({ showMoreLink = true }: { showMoreLink?: boolean }) {
  return (
    <section id="product" className="bg-brand-blue-light/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Product"
          title="One kiosk. Print, copy, and pay."
          description="A compact, unattended machine built for everyday use — everything a print shop offers, packed into a single unit."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-blue/15 ring-1 ring-black/5">
            <Image
              src="/images/machine-closeup.png"
              alt="A printout emerging from the E-Print kiosk's output tray"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-5 rounded-3xl bg-linear-to-br from-brand-blue to-brand-blue-dark p-6 text-white shadow-lg shadow-brand-blue/25">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-ink">
                <FileStack size={28} />
              </span>
              <div>
                <div className="font-display text-3xl font-extrabold tracking-tight">
                  3,000 sheets
                </div>
                <p className="mt-0.5 text-sm text-white/80">
                  Holds up to 6 reams of bond paper in a single load.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-brand-ink">
                Key features
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {keyFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-slate"
                  >
                    <Check size={18} className="mt-0.5 shrink-0 text-brand-blue" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-brand-ink">
                How it works for users
              </h3>
              <ol className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {steps.map(({ icon: Icon, label }, i) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-ink">
                      <Icon size={18} />
                    </span>
                    <span className="text-sm font-medium text-brand-ink">
                      {label}
                    </span>
                    {i < steps.length - 1 && (
                      <ArrowRight
                        size={16}
                        className="hidden text-brand-slate/40 sm:block"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-brand-ink">
                Where it can be deployed
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {locations.map((location) => (
                  <li
                    key={location}
                    className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-blue ring-1 ring-brand-blue/15"
                  >
                    {location}
                  </li>
                ))}
              </ul>
            </div>

            {showMoreLink && (
              <Link
                href="/product"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-blue hover:underline"
              >
                Explore the full product <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
