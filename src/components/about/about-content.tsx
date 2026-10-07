"use client";

import { aboutContent } from "@/data/about";
import { education } from "@/data/education";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

export function AboutContent() {
  const { t } = useLanguage();
  const primary = education.find((e) => e.level === "primary");

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} />

      <div className="mt-8 flex max-w-2xl flex-col gap-5 text-[15px] leading-relaxed text-[var(--muted)]">
        <p>{aboutContent.intro}</p>
        <p>{aboutContent.focus}</p>
        <p>{aboutContent.path}</p>
        <p>{aboutContent.now}</p>
        <p>{aboutContent.interests}</p>
      </div>

      {primary && (
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {primary.degree}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {primary.institution} &middot; {primary.duration}
            </p>
          </div>
          <LinkButton href="/education" variant="secondary" size="sm">
            {t.about.viewEducation}
          </LinkButton>
        </div>
      )}
    </Container>
  );
}
