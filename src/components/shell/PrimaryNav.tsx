"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/", label: "Overview" },
  { href: "/architecture", label: "Architecture" },
  { href: "/emerging", label: "Emerging" },
];

export function PrimaryNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className="hidden md:flex items-center gap-1"
        aria-label="Primary"
      >
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2",
                active
                  ? "bg-ink-900 text-white"
                  : "text-ink-500 hover:text-ink-900 hover:bg-ink-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        className="md:hidden w-9 h-9 rounded-md grid place-items-center text-ink-700 hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-16 z-30 bg-white shadow-pop border-b border-ink-100"
          role="dialog"
          aria-label="Navigation menu"
        >
          <nav className="px-6 py-3 flex flex-col gap-1" aria-label="Primary mobile">
            {items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-ink-900 text-white"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
