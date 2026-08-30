import { UserX, Clock3, Hourglass } from "lucide-react";
import SectionHeading from "./SectionHeading";

const problems = [
  {
    icon: UserX,
    title: "No Supervision On-Site",
    description:
      "Small print shops depend on someone being there to run them. The moment that person steps out, the shop is closed — even if a customer needs a document in five minutes.",
  },
  {
    icon: Hourglass,
    title: "Long Customer Queues",
    description:
      "Peak hours mean long lines just to print or photocopy a single page, forcing customers to wait behind entire stacks of other people's documents.",
  },
  {
    icon: Clock3,
    title: "Limited Operating Hours",
    description:
      "Deadlines don't wait for business hours. Most shops close exactly when students and workers need them most — late at night or early in the morning.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Problem"
          title="Traditional print shops weren't built for how people work now"
          description="Staffed print shops carry a structural limitation: they can only serve customers when someone is physically there to run them. That constraint shows up the same way on campuses, in offices, and across communities everywhere."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-7 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
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
