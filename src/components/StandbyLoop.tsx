"use client";

import { useEffect, useRef, useState } from "react";
import { Usb, Bluetooth, QrCode, Printer, Check, Minus, Plus } from "lucide-react";

const NAVY = "#1a2a6c";
const GOLD = "#f0b429";
const BG = "#e8eaf0";
const MUTED = "#6b7a99";
const SUCCESS = "#22c55e";
const BORDER = "rgba(26,42,108,0.12)";

const STEP_MS = 5000;

function HomeSlide() {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-[1.6cqw] px-[6cqw] py-[3cqw]"
      style={{ background: BG }}
    >
      <div className="mb-[0.4cqw] flex flex-col items-center">
        <div className="text-[4.4cqw] leading-none font-black">
          <span style={{ color: "#4a5fa8" }}>E</span>
          <span style={{ color: GOLD }}>-PRINT</span>
        </div>
        <div
          className="text-[1cqw] font-bold tracking-[0.3cqw]"
          style={{ color: "#8a9bc8" }}
        >
          VENDO PRINTING
        </div>
      </div>

      <div
        className="flex w-full max-w-[70%] items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white px-[2cqw] py-[1.4cqw] shadow-sm"
        style={{ border: `2px solid ${GOLD}` }}
      >
        <div
          className="flex h-[3.6cqw] w-[3.6cqw] shrink-0 items-center justify-center rounded-[1cqw]"
          style={{ background: BG }}
        >
          <Printer size={16} color={NAVY} />
        </div>
        <div className="text-left">
          <div className="text-[1.8cqw] font-black" style={{ color: NAVY }}>
            START PRINT
          </div>
          <div className="text-[1cqw] font-semibold" style={{ color: MUTED }}>
            Browse files from your device
          </div>
        </div>
      </div>

      <div
        className="flex w-full max-w-[70%] items-center gap-[1.4cqw] rounded-[1.6cqw] bg-white px-[2cqw] py-[1.4cqw] shadow-sm"
        style={{ border: "2px solid transparent" }}
      >
        <div
          className="flex h-[3.6cqw] w-[3.6cqw] shrink-0 items-center justify-center rounded-[1cqw]"
          style={{ background: BG }}
        >
          <QrCode size={16} color={NAVY} />
        </div>
        <div className="text-left">
          <div className="text-[1.8cqw] font-black" style={{ color: NAVY }}>
            Photocopy
          </div>
          <div className="text-[1cqw] font-semibold" style={{ color: MUTED }}>
            Scan and print documents
          </div>
        </div>
      </div>

      <div className="mt-[0.6cqw] flex w-full max-w-[70%] gap-[1cqw]">
        {[
          ["Affordable", "₱4 / page"],
          ["Quick", "Minutes, not hours"],
          ["Secure", "Files auto-deleted"],
        ].map(([title, sub]) => (
          <div
            key={title}
            className="flex-1 rounded-[1.2cqw] bg-white px-[1.2cqw] py-[1cqw] text-left shadow-sm"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="text-[1.1cqw] font-extrabold" style={{ color: NAVY }}>
              {title}
            </div>
            <div className="text-[0.95cqw] font-semibold" style={{ color: MUTED }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChooseFileSlide() {
  const options = [
    { icon: Usb, label: "USB Drive", desc: "Insert your USB flash drive", active: false },
    { icon: Bluetooth, label: "Bluetooth", desc: "Send files from your phone", active: false },
    { icon: QrCode, label: "QR Code", desc: "Scan to upload files", active: true },
  ];
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-[2cqw] px-[6cqw]"
      style={{ background: BG }}
    >
      <div className="text-center">
        <div className="text-[2.6cqw] font-extrabold" style={{ color: NAVY }}>
          Choose How to Send Files
        </div>
        <div className="mt-[0.4cqw] text-[1.3cqw]" style={{ color: MUTED }}>
          Select your preferred method to transfer files for printing
        </div>
      </div>
      <div className="flex gap-[1.6cqw]">
        {options.map(({ icon: Icon, label, desc, active }) => (
          <div
            key={label}
            className="flex w-[13cqw] flex-col items-center gap-[1cqw] rounded-[2cqw] bg-white px-[1.4cqw] py-[2cqw] shadow-sm"
            style={{ border: `2px solid ${active ? GOLD : "transparent"}` }}
          >
            <div
              className="flex h-[7cqw] w-[7cqw] items-center justify-center rounded-[1.4cqw]"
              style={{ background: BG }}
            >
              <Icon size={22} color={NAVY} />
            </div>
            <div className="text-[1.5cqw] font-extrabold" style={{ color: NAVY }}>
              {label}
            </div>
            <div className="text-center text-[1cqw]" style={{ color: MUTED }}>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ options }: { options: { label: string; sub?: string; active?: boolean }[] }) {
  return (
    <div className="flex gap-[0.5cqw]">
      {options.map((o) => (
        <div
          key={o.label}
          className="flex flex-1 flex-col items-center gap-[0.1cqw] rounded-[0.7cqw] py-[0.6cqw]"
          style={{
            border: `1.5px solid ${o.active ? NAVY : BORDER}`,
            background: o.active ? NAVY : "transparent",
          }}
        >
          <span
            className="text-[1cqw] font-bold"
            style={{ color: o.active ? "#fff" : MUTED }}
          >
            {o.label}
          </span>
          {o.sub && (
            <span
              className="text-[0.8cqw] font-semibold"
              style={{ color: o.active ? "#fff" : MUTED }}
            >
              {o.sub}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function PrintOptionsSlide() {
  return (
    <div className="flex h-full flex-col gap-[1cqw] px-[3cqw] py-[2.2cqw]" style={{ background: BG }}>
      <div className="text-[2.2cqw] font-extrabold" style={{ color: NAVY }}>
        Print Options
      </div>
      <div className="flex flex-1 gap-[1.4cqw]">
        <div
          className="flex flex-1 flex-col items-center gap-[0.8cqw] rounded-[1.6cqw] bg-white p-[1.4cqw] shadow-sm"
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[0.95cqw] font-semibold" style={{ color: MUTED }}>
              sample-document.pdf
            </span>
            <span className="text-[1cqw] font-bold" style={{ color: NAVY }}>
              3 pages
            </span>
          </div>
          <div
            className="flex flex-1 w-full items-center justify-center rounded-[1cqw]"
            style={{ background: "#e8eaf6" }}
          >
            <span className="text-[3cqw]">📄</span>
          </div>
          <span className="text-[0.9cqw] font-bold" style={{ color: MUTED }}>
            Page 1 of 3
          </span>
        </div>

        <div className="flex flex-[1.2] flex-col gap-[0.7cqw] rounded-[1.6cqw] bg-white p-[1.2cqw] shadow-sm">
          {[
            { label: "PAPER SIZE", row: <ToggleRow options={[{ label: "A4", active: true }]} /> },
            {
              label: "COLOR MODE",
              row: (
                <ToggleRow
                  options={[
                    { label: "B & W", sub: "₱2/pg", active: true },
                    { label: "Color", sub: "₱8/pg" },
                  ]}
                />
              ),
            },
            {
              label: "ORIENTATION",
              row: <ToggleRow options={[{ label: "Portrait", active: true }, { label: "Landscape" }]} />,
            },
          ].map(({ label, row }) => (
            <div key={label} className="flex flex-col gap-[0.3cqw]">
              <span
                className="text-[0.75cqw] font-bold tracking-[0.1cqw]"
                style={{ color: MUTED }}
              >
                {label}
              </span>
              {row}
            </div>
          ))}

          <div className="flex flex-col gap-[0.3cqw]">
            <span className="text-[0.75cqw] font-bold tracking-[0.1cqw]" style={{ color: MUTED }}>
              COPIES
            </span>
            <div className="flex items-center gap-[0.8cqw]">
              <div
                className="flex h-[1.8cqw] w-[1.8cqw] items-center justify-center rounded-[0.5cqw]"
                style={{ border: `1.5px solid ${BORDER}` }}
              >
                <Minus size={10} color={NAVY} />
              </div>
              <span className="text-[1.4cqw] font-extrabold" style={{ color: NAVY }}>
                2
              </span>
              <div
                className="flex h-[1.8cqw] w-[1.8cqw] items-center justify-center rounded-[0.5cqw]"
                style={{ border: `1.5px solid ${BORDER}` }}
              >
                <Plus size={10} color={NAVY} />
              </div>
              <span className="text-[0.85cqw] font-semibold" style={{ color: MUTED }}>
                &times; 3 pg &times; ₱2
              </span>
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-[0.8cqw] px-[1.2cqw] py-[0.7cqw]"
            style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.25)" }}
          >
            <span className="text-[0.95cqw] font-semibold" style={{ color: MUTED }}>
              Total Amount
            </span>
            <span className="text-[1.5cqw] font-extrabold" style={{ color: GOLD }}>
              &#8369;12.00
            </span>
          </div>

          <div className="flex gap-[0.7cqw]">
            <div
              className="flex-1 rounded-[0.8cqw] py-[0.7cqw] text-center text-[1cqw] font-bold"
              style={{ border: `2px solid ${BORDER}`, color: MUTED }}
            >
              Cancel
            </div>
            <div
              className="flex-[2] rounded-[0.8cqw] py-[0.7cqw] text-center text-[1cqw] font-bold text-white"
              style={{ background: NAVY, border: `2px solid ${GOLD}` }}
            >
              Continue to Payment &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentSlide() {
  return (
    <div className="flex h-full flex-col gap-[1cqw] px-[3cqw] py-[2.2cqw]" style={{ background: BG }}>
      <div className="text-[2.2cqw] font-extrabold" style={{ color: NAVY }}>
        Payment
      </div>
      <div className="flex flex-1 gap-[1.4cqw]">
        <div className="flex flex-1 flex-col gap-[1.1cqw] rounded-[1.6cqw] bg-white p-[1.6cqw] shadow-sm">
          <span className="text-[1.3cqw] font-extrabold" style={{ color: NAVY }}>
            Payment Method
          </span>
          <div className="flex gap-[0.6cqw]">
            <div
              className="flex-1 rounded-[0.7cqw] py-[0.8cqw] text-center text-[1cqw] font-bold text-white"
              style={{ background: NAVY }}
            >
              Bills / Coins
            </div>
            <div
              className="flex-1 rounded-[0.7cqw] py-[0.8cqw] text-center text-[1cqw] font-bold"
              style={{ border: `1.5px solid ${BORDER}`, color: MUTED }}
            >
              GCash
            </div>
          </div>

          <div className="flex flex-col gap-[0.4cqw]">
            <span className="text-[0.75cqw] font-bold tracking-[0.1cqw]" style={{ color: MUTED }}>
              VOUCHER CODE
            </span>
            <div className="flex gap-[0.6cqw]">
              <div
                className="flex-1 rounded-[0.6cqw] px-[1cqw] py-[0.8cqw] text-[1cqw] font-semibold"
                style={{ background: BG, border: `1.5px solid ${BORDER}`, color: MUTED }}
              >
                PRINT-ABC123
              </div>
              <div
                className="rounded-[0.6cqw] px-[1.2cqw] py-[0.8cqw] text-[1cqw] font-bold text-white"
                style={{ background: NAVY }}
              >
                Apply
              </div>
            </div>
          </div>

          <div className="mt-[0.4cqw] flex flex-col gap-[0.5cqw]">
            <span className="text-[1.1cqw] font-semibold" style={{ color: MUTED }}>
              Still needed:{" "}
              <span className="font-extrabold" style={{ color: NAVY }}>
                &#8369;12.00
              </span>
            </span>
            <div className="h-[0.6cqw] w-full overflow-hidden rounded-full" style={{ background: "rgba(26,42,108,0.1)" }} />
            <span className="text-[0.9cqw]" style={{ color: MUTED }}>
              Insert bills or coins into the acceptor&hellip;
            </span>
          </div>
        </div>

        <div className="flex w-[16cqw] flex-col gap-[0.5cqw] rounded-[1.6cqw] bg-white p-[1.4cqw] shadow-sm">
          <span className="mb-[0.3cqw] text-[1.2cqw] font-extrabold" style={{ color: NAVY }}>
            Order Summary
          </span>
          {[
            ["Files", "1"],
            ["Color Mode", "B & W"],
            ["Copies", "2"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-[0.95cqw]">
              <span style={{ color: MUTED }}>{l}</span>
              <span className="font-bold" style={{ color: NAVY }}>
                {v}
              </span>
            </div>
          ))}
          <div className="my-[0.3cqw] h-px w-full" style={{ background: BORDER }} />
          <div className="flex items-center justify-between">
            <span className="text-[1.1cqw] font-extrabold" style={{ color: NAVY }}>
              Total
            </span>
            <span className="text-[1.6cqw] font-extrabold" style={{ color: GOLD }}>
              &#8369;12.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintingSlide() {
  return (
    <div className="flex h-full items-center justify-center px-[8cqw]" style={{ background: BG }}>
      <div
        className="flex w-full max-w-[60%] flex-col items-center gap-[1.2cqw] rounded-[1.8cqw] bg-white px-[4cqw] py-[3cqw] shadow-sm"
      >
        <div
          className="flex h-[5cqw] w-[5cqw] items-center justify-center rounded-full"
          style={{ background: "rgba(26,42,108,0.06)" }}
        >
          <Printer size={26} color={NAVY} />
        </div>
        <span className="text-[2cqw] font-extrabold" style={{ color: NAVY }}>
          Printing
        </span>
        <span className="text-[1.1cqw]" style={{ color: MUTED }}>
          Processing document&hellip;
        </span>
        <div className="h-[0.6cqw] w-full overflow-hidden rounded-full" style={{ background: "rgba(26,42,108,0.1)" }}>
          <div className="h-full rounded-full" style={{ width: "72%", background: NAVY }} />
        </div>
        <span className="text-[1cqw] font-bold" style={{ color: NAVY }}>
          72%
        </span>
        <div
          className="flex w-full items-center gap-[0.8cqw] rounded-[0.8cqw] px-[1.4cqw] py-[0.8cqw]"
          style={{ background: "rgba(26,42,108,0.05)" }}
        >
          <span className="text-[1.2cqw]">📄</span>
          <span className="flex-1 text-[1cqw] font-bold" style={{ color: NAVY }}>
            sample-document.pdf
          </span>
          <span className="text-[0.9cqw]" style={{ color: MUTED }}>
            2 Copies
          </span>
        </div>
      </div>
    </div>
  );
}

function CompletedSlide() {
  return (
    <div className="flex h-full flex-col gap-[1cqw] px-[3cqw] py-[2.2cqw]" style={{ background: BG }}>
      <div className="flex flex-1 gap-[1.4cqw]">
        <div className="flex flex-1 flex-col items-center gap-[0.8cqw] rounded-[1.6cqw] bg-white p-[1.8cqw] text-center shadow-sm">
          <div
            className="flex h-[4.2cqw] w-[4.2cqw] items-center justify-center rounded-full"
            style={{ background: "rgba(34,197,94,0.12)", border: `3px solid ${SUCCESS}` }}
          >
            <Check size={22} color={SUCCESS} strokeWidth={3} />
          </div>
          <span className="text-[1.7cqw] font-extrabold" style={{ color: NAVY }}>
            Print Job Complete!
          </span>
          <span className="text-[1cqw]" style={{ color: MUTED }}>
            Your documents have been printed successfully.
          </span>
          <div
            className="w-full rounded-[0.8cqw] px-[1.2cqw] py-[0.9cqw] text-[1cqw] font-bold"
            style={{ background: NAVY, color: "#fff" }}
          >
            Start New Print Job
          </div>
          <span className="text-[0.9cqw]" style={{ color: MUTED }}>
            Returning to home in 12 seconds&hellip;
          </span>
          <div className="mt-[0.4cqw] flex flex-col items-center gap-[0.1cqw]">
            <span className="text-[1.1cqw] font-extrabold" style={{ color: NAVY }}>
              Thank you for using E-Print!
            </span>
            <span className="text-[0.9cqw]" style={{ color: MUTED }}>
              Fast. Easy. Affordable.
            </span>
          </div>
        </div>

        <div className="flex w-[16cqw] flex-col gap-[0.5cqw] rounded-[1.6cqw] bg-white p-[1.4cqw] shadow-sm">
          <span className="mb-[0.3cqw] text-[1.1cqw] font-extrabold" style={{ color: NAVY }}>
            Transaction Summary
          </span>
          {[
            ["Transaction ID", "TX-1234567890"],
            ["Files Printed", "1"],
            ["Copies", "2"],
            ["Color Mode", "B & W"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between border-b py-[0.3cqw] text-[0.85cqw]" style={{ borderColor: BORDER }}>
              <span style={{ color: MUTED }}>{l}</span>
              <span className="font-bold" style={{ color: NAVY }}>
                {v}
              </span>
            </div>
          ))}
          <div className="mt-[0.3cqw] flex items-center justify-between">
            <span className="text-[1cqw] font-extrabold" style={{ color: NAVY }}>
              Amount Paid
            </span>
            <span className="text-[1.4cqw] font-extrabold" style={{ color: GOLD }}>
              &#8369;12.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { Comp: HomeSlide, label: "Home" },
  { Comp: ChooseFileSlide, label: "Send File" },
  { Comp: PrintOptionsSlide, label: "Print Options" },
  { Comp: PaymentSlide, label: "Payment" },
  { Comp: PrintingSlide, label: "Printing" },
  { Comp: CompletedSlide, label: "Done" },
];

export default function StandbyLoop() {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = (next: number) => {
    setStep(next);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStep((s) => (s + 1) % SLIDES.length);
    }, STEP_MS);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStep((s) => (s + 1) % SLIDES.length);
    }, STEP_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-[2rem] bg-gradient-to-b from-[#1f2937] to-[#0f172a] p-3 shadow-2xl shadow-black/30 sm:p-4">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-white/50 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live kiosk preview
          </span>
          <span className="text-[10px] font-semibold text-white/50">
            {SLIDES[step].label}
          </span>
        </div>
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] [container-type:inline-size]"
          style={{ background: BG }}
        >
          {SLIDES.map(({ Comp }, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{ opacity: i === step ? 1 : 0, pointerEvents: "none" }}
            >
              <Comp />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {SLIDES.map(({ label }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => restart(i)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              i === step
                ? "bg-brand-blue text-white"
                : "bg-brand-blue-light text-brand-slate hover:bg-brand-blue/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
