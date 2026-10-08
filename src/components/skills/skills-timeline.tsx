"use client";

import { skillsTimeline } from "@/data/timeline";
import { useLanguage } from "@/context/language-context";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function SkillsTimeline() {
  const { t } = useLanguage();

  return (
    <div className="mt-24">
      <SectionHeading
        title={t.skills.timelineTitle}
        subtitle={t.skills.timelineSubtitle}
      />

      <ol className="relative mt-10 flex flex-col gap-6 border-l border-[var(--border)] pl-6 sm:pl-8">
        {skillsTimeline.map((entry, index) => (
          <li key={entry.period} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-[var(--accent)] ring-4 ring-[var(--background)] sm:-left-[39px]"
            />
            <Reveal delay={Math.min(index, 3) * 0.05}>
            <div className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {entry.title}
                </h3>
                <span className="text-xs text-[var(--muted)]">{entry.period}</span>
              </div>
              <p className="text-sm text-[var(--muted)]">{entry.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entry.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
