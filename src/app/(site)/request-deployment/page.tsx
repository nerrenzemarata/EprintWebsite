import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, ClipboardList, MapPin, UserRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "Request Deployment | E-Print Vendo Printing",
  description:
    "Ask for an E-Print kiosk at your school, store, or office and track your request online.",
};

const needs = [
  { icon: UserRound, title: "Your details", text: "Name, email, contact number, and address. You'll enter these when you create your account." },
  { icon: MapPin, title: "The location", text: "Where the kiosk would go, its full address, and what kind of place it is." },
  { icon: ClipboardList, title: "Why you want it", text: "A short description of the place and your reason for requesting E-Print." },
  { icon: Camera, title: "Pictures", text: "1 to 3 photos of the proposed spot, plus any supporting files (optional)." },
];

export default function RequestDeploymentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Request Deployment"
        title="Want E-Print at your location?"
        description="Create an account, tell us about the location, and upload a few photos. You can log in any time to follow your request and message our team."
      />

      <section id="apply" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-brand-ink sm:text-3xl">
            What you&apos;ll need
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {needs.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-3 rounded-2xl border border-black/5 p-6 shadow-sm shadow-black/[0.03]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-base font-semibold text-brand-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-brand-slate">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-linear-to-br from-brand-blue to-brand-blue-dark p-8 text-white shadow-xl shadow-brand-blue/25 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold">Ready to start?</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                New here? Create a free account first. Already registered? Log in and go straight to the request form.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold-dark hover:text-white"
              >
                Create an account <ArrowRight size={16} />
              </Link>
              <Link
                href="/account/requests/new"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                I have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
