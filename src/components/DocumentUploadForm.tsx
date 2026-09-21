"use client";

import { useActionState, useRef, useEffect } from "react";
import { Field, FormAlert, SubmitButton, fileClass } from "./form";
import type { FormState } from "@/lib/form-state";
import { FILE_HINT } from "@/lib/uploads";

// Shared "add more files" box. `action` is addRequestDocuments or addInvestorDocuments.
export default function DocumentUploadForm({
  action,
  hidden,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  hidden?: { name: string; value: string };
}) {
  const [state, formAction] = useActionState(action, undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok && inputRef.current) inputRef.current.value = "";
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {hidden && <input type="hidden" name={hidden.name} value={hidden.value} />}
      <Field label="Upload additional files" name="files" hint={`Up to 3 at a time. ${FILE_HINT}.`}>
        <input
          ref={inputRef}
          id="files"
          name="files"
          type="file"
          multiple
          required
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className={fileClass}
        />
      </Field>
      <FormAlert message={state?.message} ok={state?.ok} />
      <SubmitButton pendingText="Uploading…" className="self-start">
        Upload files
      </SubmitButton>
    </form>
  );
}
