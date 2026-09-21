"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { Field, FormAlert, SubmitButton, inputClass } from "./form";

export default function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" name="email" error={state?.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state?.ok ? "" : state?.values?.email}
          className={inputClass}
        />
      </Field>
      <FormAlert message={state?.message} ok={state?.ok} />
      <SubmitButton pendingText="Sending…" className="w-full">
        Send reset link
      </SubmitButton>
    </form>
  );
}
