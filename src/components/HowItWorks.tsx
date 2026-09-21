import {
  ClipboardList,
  MapPinned,
  SearchCheck,
  Truck,
  Headset,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    icon: ClipboardList,
    title: "Request Deployment",
    description: "Submit your information and location.",
  },
  {
    icon: MapPinned,
    title: "Site Assessment",
    description: "E-Print reviews the proposed deployment location.",
  },
  {
    icon: SearchCheck,
    title: "Evaluation",
    description: "The team evaluates the requirements and feasibility.",
  },
  {
    icon: Truck,
    title: "Deployment",
    description: "Once approved, E-Print is deployed at the location.",
  },
  {
    icon: Headset,
    title: "Operation & Support",
    description: "Ongoing operational support and assistance.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="How E-Print Works"
          title="From request to running kiosk in five steps"
          description="E-Print is deployed and operated directly by our team. Here's what to expect once you reach out."
        />

        <ol className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <li key={title} className="relative flex gap-4 lg:flex-col lg:gap-5">
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-14 left-7 h-[calc(100%-2rem)] w-px bg-brand-blue/15 lg:top-7 lg:left-16 lg:h-px lg:w-[calc(100%-3rem)]"
                />
              )}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg shadow-brand-blue/25">
                <Icon size={24} />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-ink">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-brand-ink">
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-slate">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
