"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function ContactCta() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] card-elevated px-6 py-16 sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_70%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex max-w-2xl flex-col gap-4">
                <h2 className="text-4xl font-semibold leading-[1.02] tracking-tighter text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                  Have a role or a project in mind?
                </h2>
                <p className="max-w-[48ch] text-[15px] leading-relaxed text-[var(--muted)] sm:text-base">
                  {t.contact.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <LinkButton href="/contact" arrow>
                  {t.contact.send}
                </LinkButton>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition-[border-color,color,transform] duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span aria-live="polite">{copied ? "Copied to clipboard" : site.email}</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
