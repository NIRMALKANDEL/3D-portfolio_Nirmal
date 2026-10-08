"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ModeSwitch } from "@/components/mode/mode-switch";
import { openCommandPalette } from "@/components/command/command-palette";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/#skills", label: t.nav.skills },
    { href: "/projects", label: t.nav.projects },
    { href: "/experience", label: t.nav.experience },
    { href: "/education", label: t.nav.education },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-5 pr-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--foreground)]"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] font-mono text-xs font-bold text-[var(--accent-foreground)]">
            NK
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors duration-300",
                  active
                    ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--foreground)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden h-9 items-center gap-2 rounded-full border border-[var(--border)] pl-3 pr-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:inline-flex"
            aria-label="Open command menu"
          >
            <Search size={14} />
            Search
            <kbd className="rounded-full bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] px-2 py-0.5 font-mono text-[10px]">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <ModeSwitch />
          </div>
          <ThemeToggle />

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "absolute h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                open ? "rotate-45" : "-translate-y-[3px]"
              )}
            />
            <span
              className={cn(
                "absolute h-px w-4 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                open ? "-rotate-45" : "translate-y-[3px]"
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto overscroll-contain bg-[var(--background)]/90 backdrop-blur-2xl transition-opacity duration-500 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="flex flex-col gap-1 px-6 pt-8" aria-label="Mobile">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={cn(
                "py-2 text-3xl font-semibold tracking-tight transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isActive(pathname, link.href) ? "text-[var(--accent-ink)]" : "text-[var(--foreground)]",
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            <ModeSwitch />
          </div>
        </nav>
      </div>
    </header>
  );
}
