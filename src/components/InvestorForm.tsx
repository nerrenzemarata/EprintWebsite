"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { saveInvestorApplication } from "@/app/actions/investor";
import {
  ID_TYPES,
  ID_TYPE_LABELS,
  PARTNERSHIP_LABELS,
  PARTNERSHIP_TYPES,
  type InvestorApplication,
} from "@/lib/domain";
import { FILE_HINT } from "@/lib/uploads";
import { ConsentCheckbox, Field, FormAlert, SubmitButton, fileClass, inputClass } from "./form";

const ACCEPT_ALL = "image/jpeg,image/png,image/webp,application/pdf";

// `existing` switches the form to "update my application" (ID number and image are
// then optional: leave them empty to keep what's on file).
export default function InvestorForm({ existing }: { existing?: InvestorApplication }) {
  const [state, action] = useActionState(saveInvestorApplication, undefined);
  const v = state?.values ?? {};
  const e = state?.errors ?? {};
  const val = (key: string, fallback?: string) => v[key] ?? fallback;

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Business / company name" name="businessName" error={e.businessName}>
          <input id="businessName" name="businessName" required maxLength={150}
            defaultValue={val("businessName", existing?.business_name)} className={inputClass} />
        </Field>
        <Field label="Location" name="location" error={e.location} hint="City / province where you're based.">
          <input id="location" name="location" required maxLength={200}
            defaultValue={val("location", existing?.location)} className={inputClass} />
        </Field>
      </div>

      <Field label="Business background" name="businessBackground" error={e.businessBackground}
        hint="Your experience, current business, and industry.">
        <textarea id="businessBackground" name="businessBackground" required rows={5} minLength={20} maxLength={2000}
          defaultValue={val("businessBackground", existing?.business_background)} className={inputClass} />
      </Field>

      <Field label="Investment interest" name="investmentInterest" error={e.investmentInterest}
        hint="What interests you about E-Print and how you'd like to be involved.">
        <textarea id="investmentInterest" name="investmentInterest" required rows={4} minLength={10} maxLength={1000}
          defaultValue={val("investmentInterest", existing?.investment_interest)} className={inputClass} />
      </Field>

      <Field label="Preferred investment / partnership type" name="partnershipType" error={e.partnershipType}>
        <select id="partnershipType" name="partnershipType" required
          defaultValue={val("partnershipType", existing?.partnership_type) ?? ""} className={inputClass}>
          <option value="" disabled>Choose a type</option>
          {PARTNERSHIP_TYPES.map((t) => (
            <option key={t} value={t}>{PARTNERSHIP_LABELS[t]}</option>
          ))}
        </select>
      </Field>

      <fieldset className="flex flex-col gap-4 rounded-2xl border border-brand-blue/15 bg-brand-blue-light/40 p-5">
        <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-brand-ink">
          <Lock size={14} className="text-brand-blue" /> Identity verification
        </legend>
        <p className="text-xs leading-relaxed text-brand-slate">
          Your ID number is encrypted and your ID image is stored privately. Only authorized E-Print
          administrators can view them, and only to verify your application.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Government-issued ID type" name="idType" error={e.idType}>
            <select id="idType" name="idType" required
              defaultValue={val("idType", existing?.id_type) ?? ""} className={inputClass}>
              <option value="" disabled>Choose an ID</option>
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>{ID_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
          <Field label="ID number" name="idNumber" error={e.idNumber}
            hint={existing ? `On file: ending in ${existing.id_number_last4}. Leave blank to keep it.` : undefined}>
            <input id="idNumber" name="idNumber" required={!existing} maxLength={30} autoComplete="off"
              defaultValue={val("idNumber")} className={inputClass} />
          </Field>
        </div>
        <Field label="ID image" name="idImage"
          hint={existing ? `An ID is on file. Choose a file only to replace it. ${FILE_HINT}.` : `A clear photo or scan of the front of your ID. ${FILE_HINT}.`}>
          <input id="idImage" name="idImage" type="file" required={!existing} accept={ACCEPT_ALL} className={fileClass} />
        </Field>
      </fieldset>

      <Field label="Supporting documents (optional)" name="supportingFiles"
        hint={`Business permits, profile, or anything that helps us know you. Up to 3. ${FILE_HINT}.`}>
        <input id="supportingFiles" name="supportingFiles" type="file" multiple accept={ACCEPT_ALL} className={fileClass} />
      </Field>

      <ConsentCheckbox error={e.consent} />
      <FormAlert message={state?.message} />
      {state?.message && !state.ok && (
        <p className="-mt-3 text-xs text-brand-slate">Please re-select your files before submitting again.</p>
      )}

      <SubmitButton pendingText="Saving…" variant="gold" className="self-start">
        {existing ? "Save changes" : "Submit application"}
      </SubmitButton>
    </form>
  );
}
