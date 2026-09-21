"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { inputClass, fileClass } from "./styles";

export { inputClass, fileClass };

export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-brand-ink">
        {label}
      </label>
      {children}
      {hint && !error?.[0] && <p className="text-xs text-brand-slate">{hint}</p>}
      {error?.[0] && <p className="text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

export function SubmitButton({
  children,
  pendingText = "Saving…",
  variant = "blue",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "blue" | "gold";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const color =
    variant === "gold"
      ? "bg-brand-gold text-brand-ink hover:bg-brand-gold-dark hover:text-white"
      : "bg-brand-blue text-white hover:bg-brand-blue-dark";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${color} ${className}`}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormAlert({ message, ok }: { message?: string; ok?: boolean }) {
  if (!message) return null;
  return ok ? (
    <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <CheckCircle2 size={16} /> {message}
    </p>
  ) : (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}

export function ConsentCheckbox({ error }: { error?: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-3 text-sm text-brand-slate">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-brand-blue"
        />
        <span>
          I agree to the{" "}
          <Link href="/privacy" target="_blank" className="font-semibold text-brand-blue hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-brand-blue hover:underline">
            Terms &amp; Conditions
          </Link>
          , and consent to E-Print collecting and processing the information I provide.
        </span>
      </label>
      {error?.[0] && <p className="text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}
