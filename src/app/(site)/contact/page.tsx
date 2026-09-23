import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact | E-Print Vendo Printing",
  description:
    "Get in touch with the E-Print team about pricing, deployment, or partnerships.",
  path: "/contact",
});

const EMAIL = "nerrenzemarata@gmail.com";

const info = [
  {
    icon: Mail,
    title: "Email",
    body: (
      <a href={`mailto:${EMAIL}`} className="break-all text-brand-blue hover:underline">
        {EMAIL}
      </a>
    ),
  },
  { icon: MapPin, title: "Location", body: "Cagayan de Oro City, Philippines" },
  { icon: Clock, title: "Kiosk availability", body: "E-Print machines run 24/7. We reply to messages by email." },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about E-Print."
        description="Reach out for pricing, deployment, or partnership inquiries."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
          <div className="flex flex-col gap-5">
            {info.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-black/5 p-5 shadow-sm shadow-black/[0.03]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <Icon size={22} />
                </span>
                <div>
                  <h2 className="font-display text-base font-semibold text-brand-ink">{title}</h2>
                  <div className="mt-1 text-sm text-brand-slate">{body}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-brand-blue/10 ring-1 ring-black/5 sm:p-8">
            <h2 className="font-display text-xl font-bold text-brand-ink">Send us a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
