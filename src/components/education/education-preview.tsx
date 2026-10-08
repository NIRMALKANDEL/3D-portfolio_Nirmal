"use client";

import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { useLanguage } from "@/context/language-context";
import { LinkButton } from "@/components/ui/button";

export function EducationPreview() {
  const { t } = useLanguage();
  const primary = education.find((e) => e.level === "primary");
  if (!primary) return null;

  return (
      <div className="flex h-full flex-col justify-between gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]">
            <GraduationCap size={22} />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {t.education.title}
            </h2>
            <p className="text-lg font-medium text-[var(--foreground)]">{primary.degree}</p>
            <p className="text-sm text-[var(--muted)]">
              {primary.institution}, {primary.university}
            </p>
            <p className="font-mono text-xs text-[var(--muted)]">{primary.duration}</p>
          </div>
        </div>
        <LinkButton href="/education" variant="secondary" size="sm" className="w-fit" arrow>
          {t.education.viewAll}
        </LinkButton>
      </div>
  );
}
