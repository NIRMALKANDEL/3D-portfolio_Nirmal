"use client";

import { skillsTimeline } from "@/data/timeline";
import { useLanguage } from "@/context/language-context";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";

export function SkillsTimeline() {
  const { t } = useLanguage();

  return (
    <div className="mt-16">
      <SectionHeading
        eyebrow={t.skills.timelineEyebrow}
        title={t.skills.timelineTitle}
        subtitle={t.skills.timelineSubtitle}
      />

      <ol className="relative mt-10 flex flex-col gap-6 border-l border-[var(--border)] pl-6 sm:pl-8">
        {skillsTimeline.map((entry, index) => (
          <li key={entry.period} className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-6 h-3 w-3 rounded-full ring-4 ring-[var(--surface)] sm:-left-[39px]"
              style={{
                background: index % 2 === 0 ? "var(--accent)" : "var(--accent-2)",
              }}
            />
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
          </li>
        ))}
      </ol>
    </div>
  );
}
