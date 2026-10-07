"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ModeSwitch } from "@/components/mode/mode-switch";

export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/#skills", label: t.nav.skills },
    { href: "/projects", label: t.nav.projects },
    { href: "/experience", label: t.nav.experience },
    { href: "/education", label: t.nav.education },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-[var(--foreground)]"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ModeSwitch />
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-[var(--border)] bg-[var(--background)] transition-[max-height] duration-300 ease-in-out lg:hidden ${
          open ? "max-h-[28rem]" : "max-h-0 border-t-0"
        }`}
      >
        <Container className="flex flex-col gap-4 py-5">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[15px] text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
            <ModeSwitch />
            <ThemeToggle />
          </div>
        </Container>
      </div>
    </header>
  );
}
