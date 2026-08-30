import { GraduationCap, HandCoins, Sparkles, Clock } from "lucide-react";
import SectionHeading from "./SectionHeading";

const benefits = [
  {
    icon: GraduationCap,
    title: "Never Miss a Deadline",
    description: "Students can print requirements at any hour, no more scrambling before class.",
  },
  {
    icon: HandCoins,
    title: "Revenue Share for Host Sites",
    description: "Schools and businesses that host a unit earn a share of revenue, with zero staffing required.",
  },
  {
    icon: Sparkles,
    title: "Innovation for Underserved Areas",
    description: "Brings modern, self-service printing to communities that lack reliable print shops.",
  },
  {
    icon: Clock,
    title: "Accessible 24/7, Anywhere",
    description: "No opening hours, no closed signs — printing whenever it's needed.",
  },
];

const stats = [
  { value: "21.4M+", label: "Households in the Philippines without personal printer ownership" },
  { value: "850K+", label: "Households across Northern Mindanao" },
  { value: "107K+", label: "Households in Cagayan de Oro City" },
];

export default function Impact() {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.35),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Impact"
          title="Built for students, shop owners, and underserved communities"
          description="Every dream needs a first page — E-Print exists to make sure printing is never the reason someone falls short."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-base font-semibold text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/10 pt-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl font-extrabold text-brand-gold">
                {stat.value}
              </div>
              <p className="mx-auto mt-2 max-w-[220px] text-sm leading-relaxed text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-white/40">
          Households without personal printer ownership, as of 2025.
        </p>
      </div>
    </section>
  );
}
