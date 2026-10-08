"use client";

import { Gamepad2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LinkButton } from "@/components/ui/button";

export function BeyondCodeTeaser() {
  const { t } = useLanguage();

  return (
      <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-[var(--accent)] p-7 text-[var(--accent-foreground)] sm:p-9">
        <Gamepad2
          aria-hidden
          size={220}
          strokeWidth={1}
          className="pointer-events-none absolute -bottom-10 -right-10 rotate-[-14deg] opacity-15"
        />
        <div className="relative flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{t.beyondCode.title}</h2>
          <p className="text-lg font-medium">{t.beyondCode.subtitle}</p>
          <p className="max-w-[44ch] text-sm leading-relaxed opacity-85">{t.beyondCode.description}</p>
        </div>
        <LinkButton
          href="/non-tech"
          size="sm"
          variant="inverse"
          className="relative w-fit"
          arrow
        >
          {t.beyondCode.viewMore}
        </LinkButton>
      </div>
  );
}
