import SectionHeading from "./SectionHeading";
import StandbyLoop from "./StandbyLoop";

export default function Solution() {
  return (
    <section id="solution" className="bg-brand-blue-light/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Solution"
          title="Meet E-Print — printing without the wait"
          description="A self-service kiosk that lets anyone print or photocopy documents in minutes, any time of day. Send a file, pay at the machine, and collect a printout — no staff required. Below is a live preview of the exact interface running on every E-Print unit."
        />

        <div className="mt-14">
          <StandbyLoop />
        </div>
      </div>
    </section>
  );
}
