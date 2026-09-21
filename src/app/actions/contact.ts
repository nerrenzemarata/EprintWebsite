"use server";

import { contactSchema } from "@/lib/domain";
import { fail, invalid, type FormState } from "@/lib/form-state";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  // Hidden "website" field: people never see it, bots fill it. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true, message: "Thanks! We'll get back to you soon." };
  }

  if (!supabaseConfigured) {
    return fail("The contact form isn't available yet. Please email us directly.", formData);
  }

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid(parsed.error, formData);

  const supabase = await createClient();
  // No .select(): visitors are allowed to add a message but not to read any.
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) {
    console.error("[contact] insert failed:", error.code, error.message);
    return fail("We couldn't send your message. Please try again.", formData);
  }

  return { ok: true, message: "Thanks! We'll get back to you soon." };
}
