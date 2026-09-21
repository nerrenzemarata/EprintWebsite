"use client";

import { useActionState } from "react";
import { sendMessage } from "@/app/actions/messages";
import { FormAlert, Field, SubmitButton, inputClass } from "./form";

export default function MessageForm() {
  const [state, action] = useActionState(sendMessage, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <Field label="Message the E-Print team" name="body" error={state?.errors?.body}>
        <textarea
          id="body"
          name="body"
          required
          rows={3}
          maxLength={2000}
          defaultValue={state?.ok ? "" : state?.values?.body}
          placeholder="Ask a question or share an update…"
          className={inputClass}
        />
      </Field>
      <FormAlert message={state?.message} ok={state?.ok} />
      <SubmitButton pendingText="Sending…" className="self-start">
        Send message
      </SubmitButton>
    </form>
  );
}
