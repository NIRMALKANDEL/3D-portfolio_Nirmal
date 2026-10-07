"use client";

import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

export function EducationPreview() {
  const { t } = useLanguage();
  const primary = education.find((e) => e.level === "primary");
  if (!primary) return null;

  return (
    <section className="bg-[var(--surface)] py-16 sm:py-20">
      <Container>
        <SectionHeading eyebrow={t.education.eyebrow} title={t.education.title} subtitle={t.education.subtitle} />

        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]">
              <GraduationCap size={20} />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {primary.degree}
              </h3>
              <p className="text-sm text-[var(--muted)]">{primary.institution}</p>
              <p className="text-xs text-[var(--muted)]">
                {primary.university} &middot; {primary.duration}
              </p>
            </div>
          </div>
          <LinkButton href="/education" variant="secondary" size="sm" className="shrink-0">
            {t.education.viewAll}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
