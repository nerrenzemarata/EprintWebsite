"use client";

import { useActionState } from "react";
import { submitDeploymentRequest } from "@/app/actions/deployment";
import { DEPLOYMENT_LABELS, DEPLOYMENT_TYPES } from "@/lib/domain";
import { FILE_HINT } from "@/lib/uploads";
import { ConsentCheckbox, Field, FormAlert, SubmitButton, fileClass, inputClass } from "./form";

const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp";
const ACCEPT_ALL = `${ACCEPT_IMAGES},application/pdf`;

export default function DeploymentRequestForm() {
  const [state, action] = useActionState(submitDeploymentRequest, undefined);
  const v = state?.values ?? {};
  const e = state?.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Type of location" name="deploymentType" error={e.deploymentType}>
          <select
            id="deploymentType"
            name="deploymentType"
            required
            defaultValue={v.deploymentType ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {DEPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {DEPLOYMENT_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Proposed deployment location" name="siteName" error={e.siteName}>
          <input
            id="siteName"
            name="siteName"
            required
            maxLength={150}
            defaultValue={v.siteName}
            placeholder="e.g. Cagayan de Oro National High School"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Complete location / address" name="siteLocation" error={e.siteLocation}>
        <input
          id="siteLocation"
          name="siteLocation"
          required
          maxLength={300}
          defaultValue={v.siteLocation}
          placeholder="Building / floor, street, barangay, city"
          className={inputClass}
        />
      </Field>

      <Field
        label="Description of the location"
        name="description"
        error={e.description}
        hint="Foot traffic, who visits, and where the kiosk would sit."
      >
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          minLength={10}
          maxLength={1000}
          defaultValue={v.description}
          className={inputClass}
        />
      </Field>

      <Field label="Reason for requesting deployment" name="reason" error={e.reason}>
        <textarea
          id="reason"
          name="reason"
          required
          rows={4}
          minLength={10}
          maxLength={1000}
          defaultValue={v.reason}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Pictures of the proposed location"
          name="locationPhotos"
          hint="1 to 3 photos (JPG, PNG or WEBP, up to 5 MB each)."
        >
          <input
            id="locationPhotos"
            name="locationPhotos"
            type="file"
            multiple
            required
            accept={ACCEPT_IMAGES}
            className={fileClass}
          />
        </Field>
        <Field
          label="Supporting files (optional)"
          name="supportingFiles"
          hint={`Up to 2. ${FILE_HINT}.`}
        >
          <input
            id="supportingFiles"
            name="supportingFiles"
            type="file"
            multiple
            accept={ACCEPT_ALL}
            className={fileClass}
          />
        </Field>
      </div>

      <ConsentCheckbox error={e.consent} />
      <FormAlert message={state?.message} />
      {state?.message && !state.ok && (
        <p className="-mt-3 text-xs text-brand-slate">Please re-select your files before submitting again.</p>
      )}

      <SubmitButton pendingText="Submitting…" variant="gold" className="self-start">
        Submit request
      </SubmitButton>
    </form>
  );
}
