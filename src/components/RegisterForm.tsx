"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Briefcase, MailCheck, Printer } from "lucide-react";
import { register } from "@/app/actions/auth";
import { ConsentCheckbox, Field, FormAlert, SubmitButton, inputClass } from "@/components/form";

const TYPES = [
  {
    value: "customer",
    icon: Printer,
    title: "Request a deployment",
    hint: "For schools, offices, stores, and other locations that want an E-Print kiosk.",
  },
  {
    value: "investor",
    icon: Briefcase,
    title: "Invest / partner",
    hint: "For entrepreneurs and business owners interested in expanding E-Print.",
  },
] as const;

export default function RegisterForm({ defaultType }: { defaultType: "customer" | "investor" }) {
  const [state, action] = useActionState(register, undefined);
  const v = state?.values ?? {};
  const e = state?.errors ?? {};

  if (state?.ok && state.message === "confirm") {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
          <MailCheck size={28} />
        </div>
        <h2 className="mt-5 font-display text-xl font-bold text-brand-ink">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-slate">
          We sent a confirmation link. Confirm your email, then log in to continue.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-brand-ink">I want to…</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TYPES.map(({ value, icon: Icon, title, hint }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col gap-1.5 rounded-2xl border-2 border-black/10 p-4 transition-colors hover:border-brand-blue/30 has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-blue/30"
            >
              <input
                type="radio"
                name="accountType"
                value={value}
                required
                defaultChecked={(v.accountType ?? defaultType) === value}
                className="sr-only"
              />
              <Icon size={22} className="text-brand-blue" />
              <span className="text-sm font-semibold text-brand-ink">{title}</span>
              <span className="text-xs leading-relaxed text-brand-slate">{hint}</span>
            </label>
          ))}
        </div>
        {e.accountType?.[0] && <p className="text-xs text-red-600">{e.accountType[0]}</p>}
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" error={e.firstName}>
          <input id="firstName" name="firstName" required maxLength={50} autoComplete="given-name" defaultValue={v.firstName} className={inputClass} />
        </Field>
        <Field label="Last name" name="lastName" error={e.lastName}>
          <input id="lastName" name="lastName" required maxLength={50} autoComplete="family-name" defaultValue={v.lastName} className={inputClass} />
        </Field>
      </div>
      <Field label="Email address" name="email" error={e.email}>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email} placeholder="you@example.com" className={inputClass} />
      </Field>
      <Field label="Contact number" name="phone" error={e.phone}>
        <input id="phone" name="phone" type="tel" required maxLength={20} autoComplete="tel" defaultValue={v.phone} placeholder="0917 123 4567" className={inputClass} />
      </Field>
      <Field label="Address" name="address" error={e.address}>
        <input id="address" name="address" required maxLength={300} autoComplete="street-address" defaultValue={v.address} placeholder="Street, Barangay, City" className={inputClass} />
      </Field>
      <Field label="Password" name="password" error={e.password} hint="At least 8 characters.">
        <input id="password" name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={inputClass} />
      </Field>

      <ConsentCheckbox error={e.consent} />
      <FormAlert message={state?.message} />

      <SubmitButton pendingText="Creating account…" variant="gold" className="w-full">
        Create account
      </SubmitButton>
      <p className="text-center text-sm text-brand-slate">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand-blue hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
