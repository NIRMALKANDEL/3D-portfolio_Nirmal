"use client";

import { experience } from "@/data/experience";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { EducationPreview } from "@/components/education/education-preview";
import { BeyondCodeTeaser } from "@/components/beyond-code/beyond-code-teaser";

/** Experience on the left; education and life outside code as tiles on the right. */
export function ExperiencePreview() {
  const { t } = useLanguage();
  const items = experience.filter((e) => e.featuredOnHome);

  return (
    <section id="experience" className="flex min-h-[100dvh] items-center py-24">
      <Container className="max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <SectionHeading title={t.experience.title} subtitle={t.experience.subtitle} />
            </Reveal>
            <ol className="mt-10">
              {items.map((item, i) => (
                <li key={`${item.company}-${item.role}`} className="border-t border-[var(--border)]">
                  <Reveal delay={i * 0.08} className="grid gap-3 py-7 md:grid-cols-[170px_1fr] md:gap-8">
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--muted)] md:pt-1.5">
                      {item.duration}
                    </span>
                    <div className="flex flex-col gap-2.5">
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">
                        {item.role}
                        <span className="text-[var(--accent)]"> at {item.company}</span>
                      </h3>
                      <ul className="flex max-w-[60ch] flex-col gap-1 text-[15px] leading-relaxed text-[var(--muted)]">
                        {item.bulletList.slice(0, 2).map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="border-t border-[var(--border)] pt-7">
              <LinkButton href="/experience" variant="secondary" size="sm" arrow>
                {t.experience.viewAll}
              </LinkButton>
            </div>
          </div>

          <div className="grid gap-5">
            <Reveal className="h-full">
              <EducationPreview />
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <BeyondCodeTeaser />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
