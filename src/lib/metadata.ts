import type { Metadata } from "next";

// Shared Open Graph / Twitter defaults so every public page can carry a
// correct social-share preview (image, site name, locale) while still
// customizing its own title and description. Next.js merges the `metadata`
// export from each route segment *shallowly*, so a page that sets its own
// `openGraph` object would otherwise lose the parent layout's image and
// siteName — see the "Overwriting fields" note in the Next.js metadata docs.
const siteName = "E-Print Vendo Printing";
const defaultOgImage = "/images/machine-overview.png";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/about", used for the canonical URL. */
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_PH",
      siteName,
      title,
      description,
      url: path,
      images: [{ url: defaultOgImage, width: 1920, height: 1080, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}
