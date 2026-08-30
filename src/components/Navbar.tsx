"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#why", label: "Why E-Print" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "#partner", label: "Partner" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="#top" className="flex items-center gap-2">
          <Image
            src="/images/logo-transparent.png"
            alt="E-Print Vendo Printing"
            width={160}
            height={96}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-slate transition-colors hover:text-brand-blue"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-blue/20 transition-colors hover:bg-brand-blue-dark md:inline-block"
        >
          Get in Touch
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-ink md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white px-6 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-slate hover:bg-brand-blue-light hover:text-brand-blue"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-blue px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
