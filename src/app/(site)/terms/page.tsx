import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms & Conditions | E-Print Vendo Printing",
  description: "The terms for using the E-Print website, deployment requests, and partner applications.",
  path: "/terms",
});

const sections = [
  {
    title: "Using this website",
    body: [
      "By using this website or creating an account you agree to these terms and to our Privacy Policy. If you don't agree, please don't use the site.",
    ],
  },
  {
    title: "Your account",
    body: [
      "Give accurate information and keep your password secret. You are responsible for activity on your account. Tell us right away if you think someone else has accessed it.",
    ],
  },
  {
    title: "Deployment requests",
    body: [
      "Submitting a request does not guarantee that a kiosk will be deployed. E-Print reviews each location and may approve, decline, or ask for more information. Deployment, when approved, is arranged with you directly.",
    ],
  },
  {
    title: "Investor and partner applications",
    body: [
      "Applying does not create a partnership or any obligation on either side. E-Print does not guarantee profits, income, or investment returns, and all business involvement carries risk. Nothing on this website is an offer to sell securities or financial advice. Terms of any partnership are agreed separately and in writing.",
      "You confirm that the information and identification you provide are genuine and belong to you. Providing false information may lead to rejection of your application.",
    ],
  },
  {
    title: "Uploads and acceptable use",
    body: [
      "Only upload files you have the right to share, and only JPG, PNG, WEBP, or PDF files within the size limits shown. Don't upload harmful, unlawful, or misleading content, and don't try to disrupt or gain unauthorized access to the website or other people's information.",
      "We may remove content or suspend accounts that break these rules.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The E-Print name, logo, images, videos, and website content belong to E-Print or its licensors. Don't copy or reuse them without our permission.",
    ],
  },
  {
    title: "Disclaimer and liability",
    body: [
      "The website is provided “as is”. We work to keep it accurate and available but can't promise it will always be error-free or uninterrupted. To the extent the law allows, E-Print isn't liable for indirect or consequential losses arising from use of the website.",
    ],
  },
  {
    title: "Governing law",
    body: [
      "These terms are governed by the laws of the Republic of the Philippines.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about these terms? Email nerrenzemarata@gmail.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="September 2026"
      intro="These terms apply to your use of the E-Print website, including deployment requests and partner applications."
      sections={sections}
    />
  );
}
