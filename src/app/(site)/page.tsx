import Hero from "@/components/Hero";
import WhatIsEprint from "@/components/WhatIsEprint";
import Product from "@/components/Product";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import CtaBand from "@/components/CtaBand";

export default function Home() {
  return (
    <>
      <Hero videoSrc="/videos/commercial.mp4" />
      <WhatIsEprint />
      <Product />
      <HowItWorks />
      <WhyChoose />
      <CtaBand
        title="Interested in having E-Print deployed at your location?"
        description="Tell us about your school, store, or office and our team will assess the site and guide you through deployment."
        label="Request Deployment"
        href="/request-deployment"
      />
      <CtaBand
        tone="dark"
        title="Help us expand E-Print and bring it to more locations."
        description="We're open to conversations with entrepreneurs, business owners, and strategic partners who want to help grow the network."
        label="Partner With Us"
        href="/partner"
      />
    </>
  );
}
