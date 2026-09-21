"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deploymentRequestSchema, isUuid } from "@/lib/domain";
import { fail, invalid, type FormState } from "@/lib/form-state";
import { getActor } from "@/lib/session";
import { pickFiles, removeFiles, uploadFiles, validateFiles } from "@/lib/uploads";

const BUCKET = "documents";
const MAX_REQUESTS_PER_USER = 10;
const MAX_DOCS_PER_REQUEST = 10;

export async function submitDeploymentRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await getActor("customer");
  if (!actor) return fail("Please log in with a customer account to submit a request.");
  const { supabase, user } = actor;

  const parsed = deploymentRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const photos = await validateFiles(pickFiles(formData, "locationPhotos"), {
    min: 1, max: 3, imagesOnly: true, label: "Location pictures",
  });
  if (!photos.ok) return fail(photos.message, formData);

  const extras = await validateFiles(pickFiles(formData, "supportingFiles"), {
    max: 2, label: "Supporting files",
  });
  if (!extras.ok) return fail(extras.message, formData);

  const { count } = await supabase
    .from("deployment_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if ((count ?? 0) >= MAX_REQUESTS_PER_USER) {
    return fail("You've reached the limit of deployment requests. Please contact us to add more.", formData);
  }

  const input = parsed.data;
  const requestId = crypto.randomUUID();
  const prefix = `${user.id}/${requestId}`;

  const uploadedPhotos = await uploadFiles(supabase, BUCKET, prefix, photos.files);
  if (!uploadedPhotos.ok) return fail("We couldn't upload your pictures. Please try again.", formData);
  const uploadedExtras = await uploadFiles(supabase, BUCKET, prefix, extras.files);
  if (!uploadedExtras.ok) {
    await removeFiles(supabase, BUCKET, uploadedPhotos.uploaded.map((f) => f.path));
    return fail("We couldn't upload your files. Please try again.", formData);
  }

  const allPaths = [...uploadedPhotos.uploaded, ...uploadedExtras.uploaded].map((f) => f.path);

  const { error } = await supabase.from("deployment_requests").insert({
    id: requestId,
    user_id: user.id,
    deployment_type: input.deploymentType,
    site_name: input.siteName,
    site_location: input.siteLocation,
    description: input.description,
    reason: input.reason,
  });
  if (error) {
    console.error("[deployment] insert failed:", error.code, error.message);
    await removeFiles(supabase, BUCKET, allPaths);
    return fail("We couldn't submit your request. Please try again.", formData);
  }

  const rows = [
    ...uploadedPhotos.uploaded.map((f) => ({ ...f, kind: "location_photo" })),
    ...uploadedExtras.uploaded.map((f) => ({ ...f, kind: "supporting" })),
  ].map((f) => ({
    user_id: user.id,
    deployment_request_id: requestId,
    kind: f.kind,
    path: f.path,
    filename: f.filename,
    mime_type: f.mime,
    size_bytes: f.size,
  }));

  const { error: docError } = await supabase.from("documents").insert(rows);
  if (docError) {
    console.error("[deployment] documents insert failed:", docError.code, docError.message);
    await removeFiles(supabase, BUCKET, allPaths);
    // The request itself is saved; the user can attach the files from its page.
    revalidatePath("/account");
    redirect(`/account/requests/${requestId}?submitted=1&files=failed`);
  }

  revalidatePath("/account");
  redirect(`/account/requests/${requestId}?submitted=1`);
}

export async function addRequestDocuments(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await getActor("customer");
  if (!actor) return fail("Please log in with a customer account.");
  const { supabase, user } = actor;

  const requestId = String(formData.get("requestId") ?? "");
  if (!isUuid(requestId)) return fail("That request wasn't found.");

  // Row-level security limits this to the caller's own requests.
  const { data: request } = await supabase
    .from("deployment_requests")
    .select("id")
    .eq("id", requestId)
    .maybeSingle();
  if (!request) return fail("That request wasn't found.");

  const files = await validateFiles(pickFiles(formData, "files"), {
    min: 1, max: 3, label: "Files",
  });
  if (!files.ok) return fail(files.message);

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("deployment_request_id", requestId);
  if ((count ?? 0) + files.files.length > MAX_DOCS_PER_REQUEST) {
    return fail(`A request can have up to ${MAX_DOCS_PER_REQUEST} files.`);
  }

  const uploaded = await uploadFiles(supabase, BUCKET, `${user.id}/${requestId}`, files.files);
  if (!uploaded.ok) return fail("We couldn't upload your files. Please try again.");

  const { error } = await supabase.from("documents").insert(
    uploaded.uploaded.map((f) => ({
      user_id: user.id,
      deployment_request_id: requestId,
      kind: "supporting",
      path: f.path,
      filename: f.filename,
      mime_type: f.mime,
      size_bytes: f.size,
    })),
  );
  if (error) {
    console.error("[deployment] add documents failed:", error.code, error.message);
    await removeFiles(supabase, BUCKET, uploaded.uploaded.map((f) => f.path));
    return fail("We couldn't save your files. Please try again.");
  }

  revalidatePath(`/account/requests/${requestId}`);
  return { ok: true, message: "Files uploaded." };
}
