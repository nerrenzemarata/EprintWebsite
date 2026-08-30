import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "E-Print Vendo Printing | Self-Service Printing Kiosk",
  description:
    "E-Print is a 24/7 self-service printing and photocopying vendo kiosk for schools, offices, and communities. No attendant, no waiting, no missed deadlines.",
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
