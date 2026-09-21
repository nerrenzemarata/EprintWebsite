import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HowItWorks from "@/components/HowItWorks";
import Solution from "@/components/Solution";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "How It Works | E-Print Vendo Printing",
  description:
    "From deployment request to site assessment, installation, and ongoing support — how E-Print gets to your location.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="From request to running kiosk."
        description="E-Print is deployed and operated directly by our team. Here's how a request becomes a working machine at your location."
      />
      <HowItWorks />
      <Solution />
      <CtaBand
        title="Ready to start?"
        description="Submit your location details and we'll begin the site assessment."
        label="Request Deployment"
        href="/request-deployment"
      />
    </>
  );
}
