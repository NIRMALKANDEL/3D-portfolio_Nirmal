"use client";

import { skillGroups } from "@/data/skills";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { SkillSphere } from "@/components/skills/skill-sphere";
import { SkillsTimeline } from "@/components/skills/skills-timeline";

const allSkills = skillGroups.flatMap((group) => group.items);

export function SkillsSection() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <SkillSphere skills={allSkills} />
            <p className="mt-2 text-center text-xs text-[var(--muted)]">
              Drag the globe to spin it.
            </p>
          </Reveal>

          <div className="order-1 flex flex-col gap-10 lg:order-2">
            <Reveal>
              <SectionHeading title={t.skills.title} subtitle={t.skills.subtitle} />
            </Reveal>
            <dl className="grid gap-8 sm:grid-cols-2">
              {skillGroups.map((group, index) => (
                <Reveal key={group.key} delay={index * 0.06}>
                  <dt className="border-t border-[var(--border)] pt-4 text-sm font-semibold text-[var(--foreground)]">
                    {t.skills[group.key]}
                  </dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
        <SkillsTimeline />
      </Container>
    </section>
  );
}
