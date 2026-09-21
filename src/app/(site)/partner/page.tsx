import type { Metadata } from "next";
import {
  TrendingUp,
  Truck,
  BarChart3,
  Handshake,
  Cpu,
  Check,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Partner With Us | E-Print Vendo Printing",
  description:
    "Explore partnership and investment opportunities to help expand E-Print to more locations.",
};

const reasons = [
  {
    icon: TrendingUp,
    title: "Business expansion",
    description: "Help E-Print reach new schools, stores, and communities.",
  },
  {
    icon: Truck,
    title: "Deployment opportunities",
    description: "Support putting more kiosks into operation at more sites.",
  },
  {
    icon: BarChart3,
    title: "Market growth",
    description:
      "Millions of Philippine households have no personal printer, and print shops are often closed or far away.",
  },
  {
    icon: Handshake,
    title: "Collaboration",
    description: "Work directly with the team building and running the product.",
  },
  {
    icon: Cpu,
    title: "Technology partnership",
    description:
      "Join a technology-based business with real hardware and software already in operation.",
  },
];

const funding = [
  "Business expansion",
  "Product development",
  "Equipment and materials",
  "Operational expenses",
  "Marketing",
  "Deployment costs",
  "Other legitimate business expenses",
];

const audience = [
  "Entrepreneurs",
  "Business-minded individuals",
  "Business owners",
  "Experienced business professionals",
  "Potential strategic partners",
  "People who want to support and expand technology-based businesses",
];

export default function PartnerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partner With Us"
        title="Help bring E-Print to more places."
        description="We're looking for investors and business partners who want to help expand E-Print. Every partnership is discussed individually."
      />

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why partner with E-Print?"
            title="An opportunity to grow with a working product"
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-6 shadow-sm shadow-black/[0.03]"
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
          </div>
        </div>
      </section>

      <section className="bg-brand-blue-light/40 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-ink sm:text-3xl">
              How funding may be used
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {funding.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-brand-slate">
                  <Check size={18} className="mt-1 shrink-0 text-brand-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-ink sm:text-3xl">
              Who we&apos;d like to hear from
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-brand-slate">
                  <Check size={18} className="mt-1 shrink-0 text-brand-blue" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl bg-white p-5 text-sm leading-relaxed text-brand-slate ring-1 ring-black/5">
              <strong className="text-brand-ink">Please note:</strong> E-Print
              does not guarantee profits or investment returns. Terms of any
              partnership are agreed individually, and all business
              involvement carries risk.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        tone="dark"
        title="Interested in partnering with us?"
        description="Create an investor account, submit your application with a government-issued ID, and follow its status from your dashboard."
        label="Start Your Application"
        href="/register?type=investor"
      />
    </>
  );
}
