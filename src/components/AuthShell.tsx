import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

// Shared frame for /login, /register and the customer, investor and admin dashboards.
export default function AuthShell({
  children,
  signedIn = false,
  size = "sm",
  nav,
}: {
  children: React.ReactNode;
  signedIn?: boolean;
  size?: "sm" | "md" | "lg";
  nav?: { href: string; label: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-blue-light/40">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
          <Link href="/">
            <Image
              src="/images/logo-transparent.png"
              alt="E-Print Vendo Printing"
              width={160}
              height={96}
              className="h-11 w-auto object-contain"
            />
          </Link>
          {nav && (
            <nav className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap text-brand-slate transition-colors hover:bg-brand-blue-light hover:text-brand-blue"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          {signedIn ? (
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink/10 px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-blue-light"
              >
                <LogOut size={16} /> Log out
              </button>
            </form>
          ) : (
            <Link href="/" className="text-sm font-semibold text-brand-blue hover:underline">
              Back to website
            </Link>
          )}
        </div>
      </header>
      <main
        className={`mx-auto w-full flex-1 px-6 py-12 ${{ sm: "max-w-md", md: "max-w-2xl", lg: "max-w-6xl" }[size]}`}
      >
        {children}
      </main>
    </div>
  );
}
