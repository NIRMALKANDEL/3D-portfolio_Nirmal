"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Download } from "lucide-react";
import { site } from "@/data/site";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";

// three.js is large, so the scene is code-split and only runs in the browser.
const HeroScene = dynamic(() => import("@/components/hero/hero-scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-48 w-48 animate-pulse rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_70%)]" />
    </div>
  );
}

// Splits a word into letters that rise into place one after another.
function RevealWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className ?? ""}`} aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ type: "spring", stiffness: 220, damping: 26, delay: delay + i * 0.035 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

const iconLink =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-[color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function Hero() {
  const { t } = useLanguage();
  const [firstName, ...lastName] = site.name.split(" ");
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Scroll-linked: the scene drifts down, shrinks and fades as the hero leaves.
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section ref={section} className="relative overflow-hidden pt-8 pb-10 sm:pt-12">
      <Container className="max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-6 lg:min-h-[calc(100dvh-6.5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-0">
          <div className="relative z-10 flex flex-col gap-6 animate-fade-up">
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              {t.hero.eyebrow}
            </span>

            <h1 className="text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              <span className="sr-only">{site.name}</span>
              <RevealWord word={firstName} delay={0.1} />
              <br />
              <RevealWord word={lastName.join(" ")} delay={0.3} className="text-[var(--accent-display)]" />
            </h1>

            <p className="max-w-[34ch] text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              {t.hero.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <LinkButton href="/projects" arrow>
                {t.hero.viewProjects}
              </LinkButton>
              <LinkButton href={site.resumeUrl} variant="secondary" target="_blank">
                <Download size={16} />
                {t.hero.resume}
              </LinkButton>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className={iconLink}
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className={iconLink}
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
          </div>

          <motion.div
            style={reduce ? undefined : { y: sceneY, scale: sceneScale, opacity: sceneOpacity }}
            className="relative -mx-5 h-[380px] sm:h-[460px] lg:mx-0 lg:h-[640px]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_50%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_70%)]"
            />
            <HeroScene />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
