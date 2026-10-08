"use client";

import { Gamepad2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLanguage } from "@/context/language-context";
import { LinkButton } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";

export function BeyondCodeTeaser() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <TiltCard max={5}>
      <div className="relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-[var(--accent)] p-6 text-[var(--accent-foreground)] sm:p-7">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-10 opacity-15"
          animate={reduce ? undefined : { rotate: [-14, -4, -14], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotate: -14 }}
        >
          <Gamepad2 size={220} strokeWidth={1} />
        </motion.div>
        <div className="relative flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{t.beyondCode.title}</h2>
          <p className="text-lg font-medium">{t.beyondCode.subtitle}</p>
          <p className="max-w-[44ch] text-sm leading-relaxed opacity-85">{t.beyondCode.description}</p>
        </div>
        <LinkButton href="/non-tech" size="sm" variant="inverse" className="relative w-fit" arrow>
          {t.beyondCode.viewMore}
        </LinkButton>
      </div>
    </TiltCard>
  );
}
