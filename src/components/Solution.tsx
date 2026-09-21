import SectionHeading from "./SectionHeading";
import CommercialVideo from "./CommercialVideo";
import HexBackground from "./HexBackground";

export default function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden py-20 sm:py-28">
      <HexBackground />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="See It in Action"
          title="Watch the E-Print commercial"
          description="From sending your file to collecting your printout, everything happens on one guided touchscreen, with no staff required. Press play to watch with sound."
        />

        <div className="mt-14">
          <CommercialVideo />
        </div>
      </div>
    </section>
  );
}
