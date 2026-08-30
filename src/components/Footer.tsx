import Image from "next/image";
import { Mail, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-ink py-16 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
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
          <span>Supports UN SDG 4 · 8 · 9</span>
        </div>
      </div>
    </footer>
  );
}
