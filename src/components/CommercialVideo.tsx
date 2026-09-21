"use client";

import { useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";

// The full commercial, with sound. Nothing is downloaded until someone presses play
// (preload="none"), and it never starts on its own. Once started, the browser's own
// controls give play/pause, volume, seeking and fullscreen.
export default function CommercialVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    const video = ref.current;
    if (!video) return;
    // A deliberate click, so the browser allows sound.
    video.muted = false;
    video.volume = 1;
    setStarted(true);
    void video.play().catch(() => setStarted(false));
  }

  function reset() {
    // Back to the cover image and play button once the commercial finishes.
    const video = ref.current;
    if (video) video.currentTime = 0;
    setStarted(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-[2rem] bg-linear-to-b from-[#1f2937] to-[#0f172a] p-3 shadow-2xl shadow-black/30 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold tracking-wide text-white/50 uppercase">
            Full commercial
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-white/50">
            <Volume2 size={11} /> Plays with sound
          </span>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-[1.1rem] bg-black">
          <video
            ref={ref}
            className="h-full w-full object-contain"
            src="/videos/full-commercial.mp4"
            poster="/images/commercial-poster.jpg"
            preload="none"
            playsInline
            controls={started}
            onEnded={reset}
            aria-label="E-Print commercial: how the self-service printing kiosk works"
          />

          {!started && (
            <button
              type="button"
              onClick={start}
              aria-label="Play the E-Print commercial with sound"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25 transition-colors hover:bg-black/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-gold"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold text-brand-ink shadow-xl shadow-black/30 transition-transform group-hover:scale-105">
                <Play size={34} className="ml-1" fill="currentColor" />
              </span>
              <span className="rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                Watch the commercial
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
