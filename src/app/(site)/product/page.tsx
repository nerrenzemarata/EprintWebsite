import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Product from "@/components/Product";
import Features from "@/components/Features";
import Solution from "@/components/Solution";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Product | E-Print Vendo Printing",
  description:
    "The E-Print kiosk: touchscreen, coin and bill acceptors, online payment, printer and photocopier in one unit.",
};

const gallery = [
  {
    src: "/images/machine-overview.png",
    alt: "The full E-Print kiosk with its touchscreen, coin and bill acceptors, and print tray",
    caption: "The E-Print kiosk",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/images/machine-closeup.png",
    alt: "A printout emerging from the E-Print kiosk's output tray",
    caption: "Printouts at the tray",
    className: "",
  },
  {
    src: "/images/machine-with-person.png",
    alt: "A person using the E-Print kiosk",
    caption: "Simple, guided use",
    className: "",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Product"
        title="Everything a print shop has, in one kiosk."
        description="Touchscreen, coin and bill acceptors, online payment, and a built-in printer and photocopier — running unattended and monitored remotely."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 sm:grid-cols-3 lg:px-8">
          {gallery.map(({ src, alt, caption, className }) => (
            <figure
              key={src}
              className={`relative aspect-[16/10] overflow-hidden rounded-3xl shadow-lg shadow-black/10 ring-1 ring-black/5 sm:aspect-auto sm:min-h-56 ${className}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 640px) 33vw, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-ink/80 to-transparent px-5 pt-10 pb-4 text-sm font-semibold text-white">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Product showMoreLink={false} />
      <Features />
      <Solution />
      <CtaBand
        title="Interested in having E-Print deployed at your location?"
        description="Tell us about your school, store, or office and our team will take it from there."
        label="Request Deployment"
        href="/request-deployment"
      />
    </>
  );
}
