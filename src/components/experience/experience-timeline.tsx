"use client";

import { Briefcase } from "lucide-react";
import { experience } from "@/data/experience";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";

export function ExperienceTimeline() {
  const { t } = useLanguage();

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading eyebrow={t.experience.eyebrow} title={t.experience.title} subtitle={t.experience.subtitle} />

      <div className="mt-10 flex flex-col gap-6">
        {experience.map((item) => (
          <div
            key={`${item.company}-${item.role}`}
            className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6 sm:flex-row"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent-ink)]">
              <Briefcase size={18} />
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{item.role}</h3>
                <span className="text-xs text-[var(--muted)]">{item.duration}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--accent-ink)]">{item.company}</p>
                {!item.isEngineering && <Badge>{t.experience.nonEngineering}</Badge>}
              </div>
              <ul className="mt-1 flex flex-col gap-1.5 text-sm text-[var(--muted)]">
                {item.bulletList.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
