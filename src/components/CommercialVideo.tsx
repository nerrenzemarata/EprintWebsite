"use client";

import { useEffect, useRef } from "react";

// Loads nothing until the section scrolls into view, then plays muted. Pauses again
// when scrolled away, so the large video isn't downloaded or decoded needlessly.
export default function CommercialVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-[2rem] bg-linear-to-b from-[#1f2937] to-[#0f172a] p-3 shadow-2xl shadow-black/30 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold tracking-wide text-white/50 uppercase">
            Commercial
          </span>
          <span className="text-[10px] font-semibold text-white/50">
            E-Print Vendo Printing
          </span>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-[1.1rem] bg-black">
          <video
            ref={ref}
            className="h-full w-full object-cover"
            src="/videos/commercial.mp4"
            poster="/images/machine-overview.png"
            muted
            loop
            playsInline
            controls
            preload="none"
            aria-label="E-Print commercial: how the self-service printing kiosk works"
          />
        </div>
      </div>
    </div>
  );
}
