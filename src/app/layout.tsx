import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { pageMetadata } from "@/lib/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const defaultTitle = "E-Print Vendo Printing | Self-Service Printing Kiosk";
const defaultDescription =
  "E-Print is a 24/7 self-service printing and photocopying vendo kiosk for schools, offices, and communities. No attendant, no waiting, no missed deadlines.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eprintph.com"),
  ...pageMetadata({ title: defaultTitle, description: defaultDescription, path: "/" }),
  // A route segment further down that only sets `title: "X | ..."` replaces
  // this whole field, so the template below only ever applies to segments
  // that opt in with a bare title — harmless either way.
  title: { default: defaultTitle, template: "%s" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-brand-ink">
        {children}
      </body>
    </html>
  );
}
