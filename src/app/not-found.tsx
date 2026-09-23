import Link from "next/link";
import { Home, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found | E-Print Vendo Printing",
  description: "The page you're looking for doesn't exist or may have moved.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-ink py-24 text-white sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,78,216,0.4),transparent_55%)]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center lg:px-8">
            <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide text-brand-gold uppercase">
              404
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              We couldn&apos;t find that page.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved. Let&apos;s get you back on track.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-ink shadow-lg shadow-black/20 transition-colors hover:bg-brand-gold-dark hover:text-white"
              >
                <Home size={16} />
                Back to homepage
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Mail size={16} />
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
