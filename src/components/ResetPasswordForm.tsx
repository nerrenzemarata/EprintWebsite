"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { Field, FormAlert, SubmitButton, inputClass } from "./form";

export default function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, undefined);
  const e = state?.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="New password" name="password" error={e.password} hint="At least 8 characters.">
        <input id="password" name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={inputClass} />
      </Field>
      <Field label="Confirm new password" name="confirm" error={e.confirm}>
        <input id="confirm" name="confirm" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={inputClass} />
      </Field>
      <FormAlert message={state?.message} />
      <SubmitButton pendingText="Saving…" className="w-full">
        Save new password
      </SubmitButton>
    </form>
  );
}
