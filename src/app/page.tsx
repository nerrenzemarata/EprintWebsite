import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import Partner from "@/components/Partner";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Impact />
        <Partner />
        <Team />
      </main>
      <Footer />
    </>
  );
}
