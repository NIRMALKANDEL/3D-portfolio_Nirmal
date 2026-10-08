"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/brand-icons";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/projects", label: t.nav.projects },
    { href: "/experience", label: t.nav.experience },
    { href: "/education", label: t.nav.education },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="text-base font-semibold text-[var(--foreground)]">{site.name}</span>
          <p className="text-sm text-[var(--muted)]">{t.footer.tagline}</p>
          <div className="mt-2 flex items-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <LinkedinIcon size={16} />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Send email"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <Mail size={16} />
            </a>
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
            >
              <WhatsappIcon size={16} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {t.footer.quickLinks}
          </span>
          <nav className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {t.footer.getInTouch}
          </span>
          <a href={`mailto:${site.email}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            {site.email}
          </a>
          <a href={site.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            WhatsApp: +91 {site.whatsapp}
          </a>
          <span className="text-sm text-[var(--muted)]">{site.location}</span>
        </div>
      </Container>

      <div className="border-t border-[var(--border)] py-5">
        <Container>
          <p className="text-center text-xs text-[var(--muted)] sm:text-left">
            © {year} {site.name}. {t.footer.rights}
          </p>
        </Container>
      </div>
    </footer>
  );
}
