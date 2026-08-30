/**
 * Full-bleed hex-grid background matching the E-Print kiosk app's own
 * HexBackground.tsx. Renders as an absolutely-positioned layer — place it as
 * the first child inside a `relative` parent, with `pointer-events-none` so
 * it never intercepts clicks.
 */
export default function HexBackground({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hxPat" x="0" y="0" width="140" height="161.6" patternUnits="userSpaceOnUse">
          <polygon
            points="70,4 134,39.5 134,110.5 70,146 6,110.5 6,39.5"
            fill="none"
            stroke="#c5cde8"
            strokeWidth="1.5"
          />
          <polygon
            points="70,115 134,150.5 134,221.5 70,257 6,221.5 6,150.5"
            fill="none"
            stroke="#c5cde8"
            strokeWidth="1.5"
          />
          <polygon
            points="0,58 64,93.5 64,164.5 0,200 -64,164.5 -64,93.5"
            fill="none"
            stroke="#c5cde8"
            strokeWidth="1.5"
          />
          <polygon
            points="140,58 204,93.5 204,164.5 140,200 76,164.5 76,93.5"
            fill="none"
            stroke="#c5cde8"
            strokeWidth="1.5"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="#e8eaf0" />
      <rect width="100%" height="100%" fill="url(#hxPat)" />
      <ellipse cx="16%" cy="38%" rx="22%" ry="25%" fill="rgba(240,180,41,0.05)" />
      <ellipse cx="84%" cy="63%" rx="20%" ry="23%" fill="rgba(26,42,108,0.04)" />
    </svg>
  );
}
