"use client";

import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function EducationTimeline() {
  const { t } = useLanguage();

  return (
    <Container className="py-16 sm:py-20">
      <SectionHeading eyebrow={t.education.eyebrow} title={t.education.title} subtitle={t.education.subtitle} />

      <div className="mt-10 flex flex-col gap-5">
        {education.map((item) => {
          const isPrimary = item.level === "primary";
          return (
            <div
              key={item.institution + item.degree}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border p-6 sm:flex-row sm:items-start",
                isPrimary
                  ? "border-[var(--accent)] bg-[var(--card)] card-elevated"
                  : "border-[var(--border)] bg-[var(--surface)]"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  isPrimary
                    ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent-ink)]"
                    : "bg-[var(--card)] text-[var(--muted)]"
                )}
              >
                <GraduationCap size={isPrimary ? 22 : 18} />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={cn(
                      "font-semibold text-[var(--foreground)]",
                      isPrimary ? "text-lg" : "text-base"
                    )}
                  >
                    {item.degree}
                  </h3>
                  <Badge>{isPrimary ? t.education.primaryLabel : t.education.supportingLabel}</Badge>
                </div>
                <p className="text-sm text-[var(--muted)]">{item.institution}</p>
                {(item.university || item.duration) && (
                  <p className="text-xs text-[var(--muted)]">
                    {[item.university, item.duration].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
