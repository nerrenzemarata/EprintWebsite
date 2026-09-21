import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import WhatIsEprint from "@/components/WhatIsEprint";
import WhyEprint from "@/components/WhyEprint";
import Impact from "@/components/Impact";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About E-Print | E-Print Vendo Printing",
  description:
    "Learn what E-Print is, who it's for, and the printing gap it was built to close.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About E-Print"
        title="Every dream needs a first page."
        description="E-Print is a 24/7 self-service printing and photocopying kiosk built to keep printing accessible for students, offices, and communities."
      />
      <WhatIsEprint />
      <WhyEprint />
      <Impact />
      <CtaBand
        title="Interested in having E-Print deployed at your location?"
        description="Tell us about your school, store, or office and our team will take it from there."
        label="Request Deployment"
        href="/request-deployment"
      />
    </>
  );
}
