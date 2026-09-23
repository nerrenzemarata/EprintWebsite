import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy | E-Print Vendo Printing",
  description: "How E-Print collects, uses, and protects your personal information.",
  path: "/privacy",
});

const sections = [
  {
    title: "Who we are",
    body: [
      "E-Print Vendo Printing (“E-Print”, “we”) operates the E-Print self-service printing kiosks and this website. We are based in Cagayan de Oro City, Philippines. For privacy questions or requests, email nerrenzemarata@gmail.com.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "Account information: your name, email address, contact number, address, and password. Your password is never stored in readable form.",
      "Deployment requests: the location details you provide, your description and reason, and the pictures or documents you upload.",
      "Investor and partner applications: your business or company name and background, investment interest, and, for identity verification, your government-issued ID type, ID number, and an image of your ID.",
      "Messages: what you send through the dashboard messaging or the contact form.",
      "Technical data: essential cookies that keep you signed in. We do not use advertising cookies.",
    ],
  },
  {
    title: "Why we collect it",
    body: [
      "To create and manage your account; to review and act on deployment requests; to verify and evaluate investor and partner applications; to send you status updates and reply to your messages; and to keep the website secure.",
      "We rely on your consent, given when you register or submit a form, in line with the Data Privacy Act of 2012 (Republic Act No. 10173). You can withdraw consent at any time (see “Your rights”).",
    ],
  },
  {
    title: "How we protect it",
    body: [
      "Uploaded files are stored in private storage that is not publicly accessible. Government ID images are stored separately and can only be opened by authorized E-Print administrators. ID numbers are encrypted before they are saved.",
      "Access is limited by role: you can see only your own information, and only authorized administrators can review applications. Uploaded files are checked for type and size before they are accepted.",
      "No system is perfectly secure, but we work to protect your information and will act promptly if we learn of a problem.",
    ],
  },
  {
    title: "Who can see your information",
    body: [
      "Authorized E-Print administrators, only as needed to do their work. We do not sell your personal information.",
      "We use service providers to host the website and store data (for example, our database and file storage provider). They process data only on our behalf. We may also disclose information when the law requires it.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your information only as long as needed for the purposes above or as required by law. Government ID images and numbers are kept only as long as needed to verify and evaluate your application.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You may ask to access, correct, or delete your personal information, object to or restrict how we use it, and withdraw your consent. Email us and we will respond as soon as we reasonably can. You also have the right to lodge a complaint with the National Privacy Commission.",
    ],
  },
  {
    title: "Children",
    body: [
      "The website is intended for adults and organizations. Please do not create an account if you are under 18.",
    ],
  },
  {
    title: "Changes",
    body: [
      "We may update this policy from time to time. The “last updated” date above shows the latest version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="September 2026"
      intro="This policy explains what personal information E-Print collects through this website, why, and how we protect it."
      sections={sections}
    />
  );
}
