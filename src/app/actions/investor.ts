"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  INVESTOR_EDITABLE,
  investorSchema,
  type InvestorApplication,
} from "@/lib/domain";
import { encryptIdNumber, idEncryptionConfigured } from "@/lib/crypto";
import { fail, invalid, type FormState } from "@/lib/form-state";
import { getActor } from "@/lib/session";
import { pickFiles, removeFiles, uploadFiles, validateFiles } from "@/lib/uploads";

const DOCS = "documents";
const IDS = "investor-ids";
const MAX_DOCS = 10;

export async function saveInvestorApplication(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await getActor("investor");
  if (!actor) return fail("Please log in with an investor account.");
  const { supabase, user } = actor;

  if (!idEncryptionConfigured) {
    console.error("[investor] ID_ENCRYPTION_KEY is missing or invalid.");
    return fail("Applications are temporarily unavailable. Please contact us.");
  }

  const parsed = investorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);
  const input = parsed.data;

  const { data: existingRow } = await supabase
    .from("investor_applications")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const existing = existingRow as InvestorApplication | null;

  if (existing && !INVESTOR_EDITABLE.includes(existing.status)) {
    return fail("This application has already been decided and can no longer be edited.", formData);
  }

  if (!existing && !input.idNumber) {
    return fail("Please fix the highlighted field.", formData, {
      idNumber: ["ID number is required."],
    });
  }

  const idFiles = await validateFiles(pickFiles(formData, "idImage"), {
    min: existing ? 0 : 1, max: 1, label: "Government ID",
  });
  if (!idFiles.ok) return fail(idFiles.message, formData);

  const extras = await validateFiles(pickFiles(formData, "supportingFiles"), {
    max: 3, label: "Supporting documents",
  });
  if (!extras.ok) return fail(extras.message, formData);

  if (existing && extras.files.length > 0) {
    const { count } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("investor_application_id", existing.id);
    if ((count ?? 0) + extras.files.length > MAX_DOCS) {
      return fail(`You can have up to ${MAX_DOCS} supporting documents.`, formData);
    }
  }

  const applicationId = existing?.id ?? crypto.randomUUID();

  let newId: { path: string } | null = null;
  if (idFiles.files.length > 0) {
    const uploaded = await uploadFiles(supabase, IDS, user.id, idFiles.files);
    if (!uploaded.ok) return fail("We couldn't upload your ID. Please try again.", formData);
    newId = uploaded.uploaded[0];
  }

  const uploadedExtras = await uploadFiles(supabase, DOCS, `${user.id}/investor`, extras.files);
  if (!uploadedExtras.ok) {
    if (newId) await removeFiles(supabase, IDS, [newId.path]);
    return fail("We couldn't upload your documents. Please try again.", formData);
  }

  const details = {
    business_name: input.businessName,
    business_background: input.businessBackground,
    investment_interest: input.investmentInterest,
    partnership_type: input.partnershipType,
    location: input.location,
    id_type: input.idType,
  };
  const idNumber = input.idNumber
    ? { id_number_enc: encryptIdNumber(input.idNumber), id_number_last4: input.idNumber.replace(/[\s-]/g, "").slice(-4) }
    : {};

  const cleanup = async () => {
    if (newId) await removeFiles(supabase, IDS, [newId.path]);
    await removeFiles(supabase, DOCS, uploadedExtras.uploaded.map((f) => f.path));
  };

  if (existing) {
    const { error } = await supabase
      .from("investor_applications")
      .update({ ...details, ...idNumber, ...(newId ? { id_file_path: newId.path } : {}) })
      .eq("id", existing.id);
    if (error) {
      console.error("[investor] update failed:", error.code, error.message);
      await cleanup();
      return fail("We couldn't save your changes. Please try again.", formData);
    }
    // The replaced ID is no longer needed.
    if (newId) await removeFiles(supabase, IDS, [existing.id_file_path]);
  } else {
    const { error } = await supabase.from("investor_applications").insert({
      id: applicationId,
      user_id: user.id,
      ...details,
      ...idNumber,
      id_file_path: newId!.path,
    });
    if (error) {
      console.error("[investor] insert failed:", error.code, error.message);
      await cleanup();
      return fail("We couldn't submit your application. Please try again.", formData);
    }
  }

  if (uploadedExtras.uploaded.length > 0) {
    const { error } = await supabase.from("documents").insert(
      uploadedExtras.uploaded.map((f) => ({
        user_id: user.id,
        investor_application_id: applicationId,
        kind: "supporting",
        path: f.path,
        filename: f.filename,
        mime_type: f.mime,
        size_bytes: f.size,
      })),
    );
    if (error) {
      console.error("[investor] documents insert failed:", error.code, error.message);
      await removeFiles(supabase, DOCS, uploadedExtras.uploaded.map((f) => f.path));
    }
  }

  revalidatePath("/investor");
  redirect(existing ? "/investor?updated=1" : "/investor?submitted=1");
}

export async function addInvestorDocuments(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await getActor("investor");
  if (!actor) return fail("Please log in with an investor account.");
  const { supabase, user } = actor;

  const { data: application } = await supabase
    .from("investor_applications")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!application) return fail("Submit your application first.");

  const files = await validateFiles(pickFiles(formData, "files"), {
    min: 1, max: 3, label: "Files",
  });
  if (!files.ok) return fail(files.message);

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("investor_application_id", application.id);
  if ((count ?? 0) + files.files.length > MAX_DOCS) {
    return fail(`You can have up to ${MAX_DOCS} supporting documents.`);
  }

  const uploaded = await uploadFiles(supabase, DOCS, `${user.id}/investor`, files.files);
  if (!uploaded.ok) return fail("We couldn't upload your files. Please try again.");

  const { error } = await supabase.from("documents").insert(
    uploaded.uploaded.map((f) => ({
      user_id: user.id,
      investor_application_id: application.id,
      kind: "supporting",
      path: f.path,
      filename: f.filename,
      mime_type: f.mime,
      size_bytes: f.size,
    })),
  );
  if (error) {
    console.error("[investor] add documents failed:", error.code, error.message);
    await removeFiles(supabase, DOCS, uploaded.uploaded.map((f) => f.path));
    return fail("We couldn't save your files. Please try again.");
  }

  revalidatePath("/investor");
  return { ok: true, message: "Files uploaded." };
}
