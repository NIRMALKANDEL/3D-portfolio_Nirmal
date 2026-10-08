"use client";

import { GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { education } from "@/data/education";
import { useLanguage } from "@/context/language-context";
import { LinkButton } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";

export function EducationPreview() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const primary = education.find((e) => e.level === "primary");
  if (!primary) return null;

  return (
    <TiltCard max={5}>
      <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated hoverable p-6 sm:p-7">
        <div className="flex flex-col gap-4">
          <motion.span
            animate={reduce ? undefined : { y: [0, -5, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent-ink)]"
          >
            <GraduationCap size={22} />
          </motion.span>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{t.education.title}</h2>
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
    </TiltCard>
  );
}
