"use server";

import { revalidatePath } from "next/cache";
import { messageSchema } from "@/lib/domain";
import { fail, invalid, type FormState } from "@/lib/form-state";
import { getSession } from "@/lib/session";

// Customers and investors write to the E-Print team here; admins reply from /admin.
export async function sendMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user || !profile || profile.role === "admin") {
    return fail("Please log in to send a message.");
  }

  const parsed = messageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const { error } = await supabase.from("messages").insert({
    user_id: user.id,
    sender: "user",
    body: parsed.data.body,
  });
  if (error) {
    console.error("[messages] insert failed:", error.code, error.message);
    return fail("We couldn't send your message. Please try again.", formData);
  }

  revalidatePath("/account");
  revalidatePath("/investor");
  return { ok: true, message: "Message sent. We'll reply here." };
}

export async function markMessagesRead() {
  const { supabase, user, profile } = await getSession();
  if (!supabase || !user || !profile || profile.role === "admin") return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .neq("sender", "user")
    .is("read_at", null);

  revalidatePath("/account");
  revalidatePath("/investor");
}
