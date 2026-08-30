import Image from "next/image";
import SectionHeading from "./SectionHeading";

const team = [
  {
    name: "Nerrenze Y. Marata",
    role: "Project Lead / IoT Hardware Developer",
    image: "/images/team-nerrenze.png",
  },
  {
    name: "Evegen P. Dela Cruz",
    role: "UI/UX Designer / Communications Lead",
    image: "/images/team-evegen.png",
  },
  {
    name: "Bryle Jan Nacalaban",
    role: "Database / IoT Systems Integrator",
    image: "/images/team-bryle.png",
  },
];

export default function Team() {
  return (
    <section id="team" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Team"
          title="Meet the team behind E-Print"
          description="The people designing, building, and deploying the E-Print kiosk."
        />

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-brand-blue-light">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-brand-ink">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-brand-slate">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
