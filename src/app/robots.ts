import type { MetadataRoute } from "next";

// Keep dashboards and admin pages out of search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/investor", "/auth"] },
  };
}
