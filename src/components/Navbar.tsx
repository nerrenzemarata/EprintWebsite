"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About E-Print" },
  { href: "/product", label: "Product" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/request-deployment", label: "Request Deployment" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-transparent.png"
            alt="E-Print Vendo Printing"
            width={160}
            height={96}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                isActive(link.href) ? "text-brand-blue" : "text-brand-slate"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-brand-slate transition-colors hover:text-brand-blue"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-blue/20 transition-colors hover:bg-brand-blue-dark"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-ink xl:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white px-6 pb-6 pt-2 xl:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-brand-blue-light hover:text-brand-blue ${
                  isActive(link.href)
                    ? "bg-brand-blue-light text-brand-blue"
                    : "text-brand-slate"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-slate hover:bg-brand-blue-light hover:text-brand-blue"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-blue px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
