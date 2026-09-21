import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ArrowRight } from "lucide-react";

const footerLinks = [
  { href: "/about", label: "About E-Print" },
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/request-deployment", label: "Request Deployment" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-ink py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Image
              src="/images/logo-transparent.png"
              alt="E-Print Vendo Printing"
              width={160}
              height={96}
              className="h-14 w-auto object-contain"
            />
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              &ldquo;E-Print — every dream needs a first page.&rdquo; A
              self-service printing and photocopying kiosk built to keep
              printing accessible, 24/7.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h3 className="font-display text-lg font-semibold">Explore</h3>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 lg:items-end">
            <h3 className="font-display text-lg font-semibold">
              Interested in E-Print?
            </h3>
            <p className="max-w-sm text-sm text-white/60 lg:text-right">
              Reach out for pricing, deployment, or partnership inquiries.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/70 lg:items-end">
              <a
                href="mailto:nerrenzemarata@gmail.com"
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail size={16} />
                nerrenzemarata@gmail.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Cagayan de Oro City, Philippines
              </span>
            </div>
            <a
              href="mailto:nerrenzemarata@gmail.com?subject=E-Print%20Inquiry"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-gold-dark hover:text-white"
            >
              Send an Inquiry
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} E-Print Vendo Printing. All rights reserved.</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
