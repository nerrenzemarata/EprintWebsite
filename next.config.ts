import type { NextConfig } from "next";

const securityHeaders = [
  // Only takes effect over HTTPS (ignored on http://localhost).
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Up to 5 files of 5 MB each per submission (the code enforces the real
    // per-file limits), plus a little room for multipart overhead.
    serverActions: { bodySizeLimit: "26mb" },
  },
  async headers() {
    // Media files keep the same name when replaced, so cache for a day rather than forever.
    const mediaCache = [
      { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/videos/:path*", headers: mediaCache },
      { source: "/images/:path*", headers: mediaCache },
    ];
  },
};

export default nextConfig;
