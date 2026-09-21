"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/contact";
import { Field, FormAlert, SubmitButton, inputClass } from "./form";

export default function ContactForm() {
  const [state, action] = useActionState(submitContact, undefined);
  const v = state?.ok ? {} : (state?.values ?? {});
  const e = state?.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={e.name}>
          <input id="name" name="name" required maxLength={100} autoComplete="name" defaultValue={v.name} className={inputClass} />
        </Field>
        <Field label="Email" name="email" error={e.email}>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email} className={inputClass} />
        </Field>
      </div>
      <Field label="Subject" name="subject" error={e.subject}>
        <input id="subject" name="subject" required maxLength={150} defaultValue={v.subject} className={inputClass} />
      </Field>
      <Field label="Message" name="message" error={e.message}>
        <textarea id="message" name="message" required rows={6} minLength={10} maxLength={3000} defaultValue={v.message} className={inputClass} />
      </Field>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <FormAlert message={state?.message} ok={state?.ok} />
      <SubmitButton pendingText="Sending…" variant="gold" className="self-start">
        Send message
      </SubmitButton>
    </form>
  );
}
