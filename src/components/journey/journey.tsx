"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { skillsTimeline } from "@/data/timeline";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

function Entry({ entry, index }: { entry: (typeof skillsTimeline)[number]; index: number }) {
  return (
    <article className="relative flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 card-elevated">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-[var(--accent)]">{entry.period}</span>
        <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="text-xl font-semibold text-[var(--foreground)]">{entry.title}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{entry.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {entry.skills.map((skill) => (
          <span key={skill} className="rounded-md bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--foreground)]">
            {skill}
          </span>
        ))}
      </div>
    </article>
  );
}

/**
 * Desktop: the section pins and vertical scroll pans the timeline sideways,
 * with a progress line filling underneath. Mobile: a plain vertical list.
 */
export function Journey() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const heading = (
    <SectionHeading title={t.skills.timelineTitle} subtitle={t.skills.timelineSubtitle} />
  );

  return (
    <section id="journey">
      {/* Desktop: pinned horizontal pan */}
      <div ref={wrap} className={reduce ? "hidden" : "relative hidden h-[260vh] lg:block"}>
        <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
          <Container className="max-w-7xl">{heading}</Container>
          <motion.ol style={{ x }} className="mt-12 flex gap-6 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-[20vw]">
            {skillsTimeline.map((entry, i) => (
              <li key={entry.period} className="w-[360px] shrink-0">
                <Entry entry={entry} index={i} />
              </li>
            ))}
          </motion.ol>
          <Container className="mt-10 max-w-7xl">
            <div className="h-px w-full bg-[var(--border)]">
              <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-[var(--accent)]" />
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile / reduced motion: vertical list */}
      <div className={reduce ? "py-24" : "py-24 lg:hidden"}>
        <Container>
          <Reveal>{heading}</Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {skillsTimeline.map((entry, i) => (
              <li key={entry.period}>
                <Reveal delay={(i % 2) * 0.05} className="h-full">
                  <Entry entry={entry} index={i} />
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  );
}
