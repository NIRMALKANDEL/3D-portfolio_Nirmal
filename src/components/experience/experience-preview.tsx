"use client";

import { experience } from "@/data/experience";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function ExperiencePreview() {
  const { t } = useLanguage();
  const items = experience.filter((e) => e.featuredOnHome);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading title={t.experience.title} subtitle={t.experience.subtitle} />
        </Reveal>

        <ol className="mt-12">
          {items.map((item, i) => (
            <li key={`${item.company}-${item.role}`} className="border-t border-[var(--border)]">
              <Reveal delay={i * 0.08} className="grid gap-4 py-8 md:grid-cols-[220px_1fr] md:gap-10">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] md:pt-1.5">
                  {item.duration}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
                    {item.role}
                    <span className="text-[var(--accent)]"> at {item.company}</span>
                  </h3>
                  <ul className="flex max-w-[65ch] flex-col gap-1.5 text-[15px] leading-relaxed text-[var(--muted)]">
                    {item.bulletList.slice(0, 2).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="border-t border-[var(--border)] pt-8">
          <LinkButton href="/experience" variant="secondary" size="sm" arrow>
            {t.experience.viewAll}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
