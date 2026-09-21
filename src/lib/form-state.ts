import * as z from "zod";

// What every form action returns to useActionState.
export type FormState =
  | {
      ok?: boolean;
      message?: string;
      errors?: Record<string, string[]>;
      // Text the user typed, so the form can be refilled after an error.
      values?: Record<string, string>;
    }
  | undefined;

// Never echoed back to the browser after an error: the user re-types these.
const SECRET_FIELDS = new Set(["password", "idNumber"]);

function textValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !SECRET_FIELDS.has(key) && !key.startsWith("$ACTION")) {
      values[key] = value;
    }
  }
  return values;
}

export function invalid(error: z.ZodError, formData: FormData): FormState {
  return {
    ok: false,
    errors: z.flattenError(error).fieldErrors as Record<string, string[]>,
    values: textValues(formData),
  };
}

export function fail(message: string, formData?: FormData, errors?: Record<string, string[]>): FormState {
  return {
    ok: false,
    message,
    errors,
    values: formData ? textValues(formData) : undefined,
  };
}
