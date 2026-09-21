"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import {
  adminMessageSchema,
  deploymentReviewSchema,
  investorReviewSchema,
  roleSchema,
} from "@/lib/domain";
import { getActor } from "@/lib/session";

// Every server action is a public endpoint, so re-check the admin role here.
// Row-level security in the database enforces the same rule as a second layer.
async function admin() {
  const actor = await getActor("admin");
  if (!actor) throw new Error("Not authorized.");
  return actor;
}

export async function reviewDeployment(formData: FormData) {
  const { supabase, user } = await admin();

  const parsed = deploymentReviewSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote") ?? undefined,
  });
  if (!parsed.success) throw new Error("Invalid review.");
  const { id, status, adminNote } = parsed.data;

  // The database adds a message to the applicant's thread when the status changes.
  const { data, error } = await supabase
    .from("deployment_requests")
    .update({
      status,
      admin_note: adminNote || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) throw new Error("Could not update the request.");

  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${id}`);
  revalidatePath("/account", "layout");
}

export async function reviewInvestor(formData: FormData) {
  const { supabase, user } = await admin();

  const parsed = investorReviewSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNote: formData.get("adminNote") ?? undefined,
  });
  if (!parsed.success) throw new Error("Invalid review.");
  const { id, status, adminNote } = parsed.data;

  const { data, error } = await supabase
    .from("investor_applications")
    .update({
      status,
      admin_note: adminNote || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) throw new Error("Could not update the application.");

  revalidatePath("/admin");
  revalidatePath(`/admin/investors/${id}`);
  revalidatePath("/investor");
}

export async function sendAdminMessage(formData: FormData) {
  const { supabase } = await admin();

  const parsed = adminMessageSchema.safeParse({
    userId: formData.get("userId"),
    body: formData.get("body"),
  });
  if (!parsed.success) throw new Error("Invalid message.");

  const { error } = await supabase.from("messages").insert({
    user_id: parsed.data.userId,
    sender: "admin",
    body: parsed.data.body,
  });
  if (error) throw new Error("Could not send the message.");

  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
  revalidatePath("/investor");
}

export async function setUserRole(formData: FormData) {
  const { supabase, user } = await admin();

  const parsed = roleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) throw new Error("Invalid role.");

  // Keeps at least one admin: nobody can remove their own admin access here.
  if (parsed.data.userId === user.id) throw new Error("You can't change your own role.");

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.userId)
    .select("id");
  if (error || !data?.length) throw new Error("Could not change the role.");

  revalidatePath("/admin/users");
}

export async function setContactHandled(formData: FormData) {
  const { supabase } = await admin();

  const parsed = z
    .object({ id: z.uuid(), handled: z.enum(["true", "false"]) })
    .safeParse({ id: formData.get("id"), handled: formData.get("handled") });
  if (!parsed.success) throw new Error("Invalid request.");

  const { error } = await supabase
    .from("contact_messages")
    .update({ handled: parsed.data.handled === "true" })
    .eq("id", parsed.data.id);
  if (error) throw new Error("Could not update the message.");

  revalidatePath("/admin/inbox");
}
