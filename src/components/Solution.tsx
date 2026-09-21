import SectionHeading from "./SectionHeading";
import CommercialVideo from "./CommercialVideo";
import HexBackground from "./HexBackground";

export default function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden py-20 sm:py-28">
      <HexBackground />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Solution"
          title="A closer look at the E-Print platform"
          description="From file upload to finished printout, the entire transaction happens on one guided touchscreen — no staff required. Watch the kiosk in action below."
        />

        <div className="mt-14">
          <CommercialVideo />
        </div>
      </div>
    </section>
  );
}
