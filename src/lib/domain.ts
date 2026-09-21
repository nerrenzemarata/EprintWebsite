import * as z from "zod";

// --- Roles ---------------------------------------------------------------------

export type Role = "customer" | "investor" | "admin";

export function homeFor(role: Role | null | undefined) {
  if (role === "admin") return "/admin";
  if (role === "investor") return "/investor";
  return "/account";
}

// --- Deployment requests ----------------------------------------------------------

export const DEPLOYMENT_TYPES = [
  "school",
  "office",
  "business",
  "organization",
  "commercial",
  "sari_sari_store",
  "other",
] as const;
export type DeploymentType = (typeof DEPLOYMENT_TYPES)[number];

export const DEPLOYMENT_LABELS: Record<DeploymentType, string> = {
  school: "School",
  office: "Office",
  business: "Business",
  organization: "Organization",
  commercial: "Commercial establishment",
  sari_sari_store: "Sari-sari store",
  other: "Other",
};

export const DEPLOYMENT_STATUSES = [
  "pending",
  "under_review",
  "site_assessment",
  "approved",
  "scheduled",
  "deployed",
  "rejected",
] as const;
export type DeploymentStatus = (typeof DEPLOYMENT_STATUSES)[number];

// The happy path shown as a progress tracker ("rejected" is shown separately).
export const DEPLOYMENT_FLOW = DEPLOYMENT_STATUSES.filter(
  (s) => s !== "rejected",
);

// --- Investor applications ---------------------------------------------------------

export const INVESTOR_STATUSES = [
  "pending",
  "under_review",
  "verification",
  "for_discussion",
  "approved",
  "not_approved",
] as const;
export type InvestorStatus = (typeof INVESTOR_STATUSES)[number];

export const INVESTOR_FLOW = INVESTOR_STATUSES.filter(
  (s) => s !== "not_approved",
);

// Applicants can edit their details until a decision is made (mirrors the RLS policy).
export const INVESTOR_EDITABLE: readonly InvestorStatus[] = [
  "pending",
  "under_review",
  "verification",
];

export const PARTNERSHIP_TYPES = [
  "investor",
  "business_partner",
  "deployment_partner",
  "strategic_partner",
  "other",
] as const;
export const PARTNERSHIP_LABELS: Record<(typeof PARTNERSHIP_TYPES)[number], string> = {
  investor: "Investor",
  business_partner: "Business partner",
  deployment_partner: "Deployment partner",
  strategic_partner: "Strategic partner",
  other: "Other",
};

export const ID_TYPES = [
  "passport",
  "drivers_license",
  "umid",
  "philsys",
  "sss",
  "prc",
  "postal",
  "voters",
  "other",
] as const;
export const ID_TYPE_LABELS: Record<(typeof ID_TYPES)[number], string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  umid: "UMID",
  philsys: "PhilSys National ID",
  sss: "SSS ID",
  prc: "PRC ID",
  postal: "Postal ID",
  voters: "Voter's ID",
  other: "Other government-issued ID",
};

// --- Status display (shared by both kinds) ----------------------------------------------

export type StatusKind = "deployment" | "investor";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  site_assessment: "Site Assessment",
  approved: "Approved",
  scheduled: "Scheduled for Deployment",
  deployed: "Deployed",
  rejected: "Rejected",
  verification: "Verification",
  for_discussion: "For Discussion",
  not_approved: "Not Approved",
};

export function statusLabel(status: string, kind: StatusKind) {
  if (kind === "investor" && status === "approved") {
    return "Approved / Partnership Discussion";
  }
  return STATUS_LABELS[status] ?? status;
}

export const STATUS_TONE: Record<string, "amber" | "blue" | "green" | "red"> = {
  pending: "amber",
  under_review: "blue",
  site_assessment: "blue",
  verification: "blue",
  for_discussion: "blue",
  approved: "green",
  scheduled: "green",
  deployed: "green",
  rejected: "red",
  not_approved: "red",
};

// --- Row types ----------------------------------------------------------------------------

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
};

export type DeploymentRequest = {
  id: string;
  user_id: string;
  deployment_type: DeploymentType;
  site_name: string;
  site_location: string;
  description: string;
  reason: string;
  status: DeploymentStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type InvestorApplication = {
  id: string;
  user_id: string;
  business_name: string;
  business_background: string;
  investment_interest: string;
  partnership_type: (typeof PARTNERSHIP_TYPES)[number];
  location: string;
  id_type: (typeof ID_TYPES)[number];
  id_number_enc: string;
  id_number_last4: string;
  id_file_path: string;
  status: InvestorStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type DocumentRow = {
  id: string;
  user_id: string;
  deployment_request_id: string | null;
  investor_application_id: string | null;
  kind: "location_photo" | "supporting";
  path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  sender: "user" | "admin" | "system";
  body: string;
  related_kind: StatusKind | null;
  related_id: string | null;
  read_at: string | null;
  created_at: string;
};

// --- Validation ---------------------------------------------------------------------------------

const text = (label: string, max: number, min = 1) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, {
      error: min > 1 ? `${label} must be at least ${min} characters.` : `${label} is required.`,
    })
    .max(max, { error: `${label} is too long.` });

const email = z
  .string({ error: "Email is required." })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Please enter a valid email." }));

const phone = z
  .string({ error: "Contact number is required." })
  .trim()
  .regex(/^[+()\d][\d\s()+-]{6,19}$/, {
    error: "Enter a valid contact number, e.g. 0917 123 4567.",
  });

const consent = z.literal("on", {
  error: "Please agree to the Privacy Policy and Terms to continue.",
});

export const ACCOUNT_TYPES = ["customer", "investor"] as const;

export const registerSchema = z.object({
  firstName: text("First name", 50),
  lastName: text("Last name", 50),
  email,
  phone,
  address: text("Address", 300),
  accountType: z.enum(ACCOUNT_TYPES, { error: "Choose an account type." }),
  password: z
    .string({ error: "Password is required." })
    .min(8, { error: "Password must be at least 8 characters." })
    .max(72, { error: "Password is too long." }),
  consent,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ error: "Password is required." })
      .min(8, { error: "Password must be at least 8 characters." })
      .max(72, { error: "Password is too long." }),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    error: "The two passwords don't match.",
    path: ["confirm"],
  });

export const deploymentRequestSchema = z.object({
  deploymentType: z.enum(DEPLOYMENT_TYPES, { error: "Choose a type of location." }),
  siteName: text("Proposed deployment location", 150),
  siteLocation: text("Complete location / address", 300),
  description: text("Description of the location", 1000, 10),
  reason: text("Reason for requesting deployment", 1000, 10),
  consent,
});

export const investorSchema = z.object({
  businessName: text("Business / company name", 150),
  businessBackground: text("Business background", 2000, 20),
  investmentInterest: text("Investment interest", 1000, 10),
  partnershipType: z.enum(PARTNERSHIP_TYPES, { error: "Choose a partnership type." }),
  location: text("Location", 200),
  idType: z.enum(ID_TYPES, { error: "Choose the type of ID." }),
  // Optional here so an applicant editing their application can leave it unchanged.
  idNumber: z
    .string()
    .trim()
    .max(30, { error: "ID number is too long." })
    .regex(/^([A-Za-z0-9][A-Za-z0-9 -]{3,29})?$/, {
      error: "Enter the ID number using letters, numbers, spaces or dashes.",
    })
    .optional(),
  consent,
});

export const messageSchema = z.object({
  body: text("Message", 2000),
});

export const contactSchema = z.object({
  name: text("Name", 100),
  email,
  subject: text("Subject", 150),
  message: text("Message", 3000, 10),
});

const uuid = z.uuid();
const adminNote = z.string().trim().max(500).optional();

export const deploymentReviewSchema = z.object({
  id: uuid,
  status: z.enum(DEPLOYMENT_STATUSES),
  adminNote,
});

export const investorReviewSchema = z.object({
  id: uuid,
  status: z.enum(INVESTOR_STATUSES),
  adminNote,
});

export const adminMessageSchema = z.object({
  userId: uuid,
  body: text("Message", 2000),
});

export const roleSchema = z.object({
  userId: uuid,
  role: z.enum(["customer", "investor", "admin"]),
});

export const isUuid = (value: string) => uuid.safeParse(value).success;
