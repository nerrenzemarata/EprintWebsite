import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyEprint from "@/components/WhyEprint";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import Partner from "@/components/Partner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <WhyEprint />
        <Solution />
        <Features />
        <Impact />
        <Partner />
      </main>
      <Footer />
    </>
  );
}
