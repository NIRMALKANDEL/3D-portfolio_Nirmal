"use client";

import { Gamepad2 } from "lucide-react";
import { nonTechExperience } from "@/data/non-tech";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export function NonTechContent() {
  const { t } = useLanguage();

  return (
    <Container className="py-16 sm:py-20">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-ink)]">
          {t.beyondCode.eyebrow}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {t.beyondCode.title}
        </h1>
        <p className="max-w-2xl text-[15px] text-[var(--muted)]">{t.beyondCode.subtitle}</p>
        <p className="max-w-2xl text-sm text-[var(--muted)]">{t.beyondCode.description}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {nonTechExperience.map((entry) => (
          <div
            key={entry.title}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent-ink)]">
              <Gamepad2 size={18} />
            </span>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {entry.title}
            </h2>
            <span className="text-xs font-medium text-[var(--muted)]">{entry.context}</span>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{entry.description}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {entry.highlights.map((h) => (
                <Badge key={h}>{h}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
