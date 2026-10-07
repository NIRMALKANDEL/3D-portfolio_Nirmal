"use client";

import { experience } from "@/data/experience";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

export function ExperiencePreview() {
  const { t } = useLanguage();
  const items = experience.filter((e) => e.featuredOnHome);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t.experience.eyebrow} title={t.experience.title} subtitle={t.experience.subtitle} />
          <LinkButton href="/experience" variant="secondary" size="sm" className="shrink-0">
            {t.experience.viewAll}
          </LinkButton>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={`${item.company}-${item.role}`}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{item.role}</h3>
                <span className="text-xs text-[var(--muted)]">{item.duration}</span>
              </div>
              <p className="text-sm font-medium text-[var(--accent)]">{item.company}</p>
              <ul className="flex flex-col gap-1.5 text-sm text-[var(--muted)]">
                {item.bulletList.slice(0, 2).map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
