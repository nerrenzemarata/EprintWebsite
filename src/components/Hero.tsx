import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileStack } from "lucide-react";
import HeroVideo from "./HeroVideo";

// `videoSrc` plays the commercial behind the text. The machine photo is the
// fallback while the video loads, or if it can't play.
export default function Hero({ videoSrc }: { videoSrc?: string }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-brand-ink text-white"
    >
      {/* Media: full-width 16:9 above the text on phones, full-bleed behind it on desktop. */}
      <div className="relative aspect-video w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src="/images/machine-overview.png"
          alt="The E-Print vending kiosk with its touchscreen, coin and bill acceptors, and print tray"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        {videoSrc && <HeroVideo src={videoSrc} />}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-ink via-brand-ink/10 to-transparent lg:bg-linear-to-r lg:from-brand-ink/90 lg:via-brand-ink/60 lg:to-brand-ink/5" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pt-4 pb-14 lg:min-h-[calc(100svh-4.25rem)] lg:justify-center lg:px-8 lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-gold uppercase ring-1 ring-white/15 backdrop-blur-sm">
          Self-Service Printing Kiosk
        </span>

        <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          E-Print
          <span className="mt-1 block text-brand-gold">
            Self-service printing, right where you need it.
          </span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-white/80">
          Discover E-Print — a practical and innovative 24/7 printing and
          photocopying kiosk, designed to make printing easier, more
          accessible, and more efficient for schools, offices, and
          communities.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request-deployment"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-ink shadow-lg shadow-black/20 transition-colors hover:bg-brand-gold-dark hover:text-white"
          >
            Request Deployment
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/partner"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Partner With Us
          </Link>
        </div>

        <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
          <FileStack size={28} className="shrink-0 text-brand-gold" />
          <p className="text-sm leading-snug text-white/85">
            Loads up to{" "}
            <strong className="font-display text-lg font-bold text-white">
              3,000 sheets
            </strong>{" "}
            of bond paper
            <span className="block text-xs text-white/60">That&apos;s 6 reams in one load</span>
          </p>
        </div>
      </div>
    </section>
  );
}
