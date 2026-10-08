"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/reveal";
import { ProjectMeta } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "The challenge" },
  { id: "features", label: "Features" },
  { id: "build", label: "How it's built" },
  { id: "stack", label: "Tech stack" },
] as const;

/** Browser-window mockup that tilts back in 3D and flattens as you scroll. */
function DeviceHero({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const rotateX = useTransform(smooth, [0, 1], [28, 0]);
  const scale = useTransform(smooth, [0, 1], [0.86, 1]);
  const y = useTransform(smooth, [0, 1], [40, 0]);

  return (
    <div ref={ref} className="[perspective:1400px]">
      <motion.div
        style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 0%" }}
        className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_50px_100px_-40px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate rounded-md bg-[var(--card)] px-3 py-1 font-mono text-[11px] text-[var(--muted)]">
            {project.links.live?.replace(/^https?:\/\//, "") ?? `github.com/NIRMALKANDEL/${project.slug}`}
          </span>
        </div>
        <div className="relative aspect-video w-full">
          <Image src={project.image} alt={`${project.title} preview`} fill sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" priority />
        </div>
      </motion.div>
    </div>
  );
}

/** Highlights the section currently in view. */
function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function BuildTimeline({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <ol ref={ref} className="relative flex flex-col gap-8 pl-8">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--border)]" />
      <motion.span aria-hidden style={{ scaleY }} className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-[var(--accent)]" />
      {steps.map((step, i) => (
        <li key={step} className="relative">
          <span aria-hidden className="absolute -left-8 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--background)]" />
          <Reveal delay={i * 0.04}>
            <p className="text-[15px] leading-relaxed text-[var(--foreground)]/90">{step}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const active = useActiveSection();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const { live, github, githubFrontend, githubBackend } = project.links;

  const links = [
    live && { href: live, label: t.projects.liveDemo, icon: <ExternalLink size={14} />, primary: true },
    githubFrontend && { href: githubFrontend, label: t.projects.frontendRepo, icon: <GithubIcon size={14} /> },
    githubBackend && { href: githubBackend, label: t.projects.backendRepo, icon: <GithubIcon size={14} /> },
    github && { href: github, label: t.projects.githubLabel, icon: <GithubIcon size={14} /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; primary?: boolean }[];

  return (
    <article className="pb-24">
      <Container className="max-w-6xl pt-10 sm:pt-14">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={14} />
          {t.projects.backToProjects}
        </Link>

        <motion.header
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col gap-5"
        >
          <ProjectMeta project={project} />
          <h1 className="text-5xl font-semibold tracking-[-0.045em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">{project.title}</h1>
          <p className="max-w-[60ch] text-lg leading-relaxed text-[var(--muted)]">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-[color,border-color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  l.primary
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                )}
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
        </motion.header>

        <div className="mt-14">
          <DeviceHero project={project} />
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          <nav aria-label="Case study sections" className="hidden lg:block">
            <ul className="sticky top-28 flex flex-col gap-1 border-l border-[var(--border)]">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? "true" : undefined}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                      active === s.id
                        ? "border-[var(--accent)] font-medium text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-20">
            <section id="overview" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">Overview</h2>
                <p className="mt-5 max-w-[68ch] text-[17px] leading-relaxed text-[var(--foreground)]/85">{project.description}</p>
              </Reveal>
            </section>

            <section id="challenge" className="scroll-mt-28">
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl bg-[var(--accent)] p-8 text-[var(--accent-foreground)] sm:p-10">
                  <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
                  <h2 className="relative text-2xl font-semibold sm:text-3xl">The challenge</h2>
                  <p className="relative mt-4 max-w-[60ch] text-[17px] leading-relaxed opacity-90">{project.problem}</p>
                </div>
              </Reveal>
            </section>

            <section id="features" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">{t.projects.keyFeatures}</h2>
              </Reveal>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {project.features.map((feature, i) => (
                  <li key={feature}>
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 24, rotateX: -18 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: "spring", stiffness: 140, damping: 20, delay: (i % 2) * 0.08 }}
                      className="flex h-full gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 card-elevated"
                      style={{ transformPerspective: 800 }}
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)]">
                        <Check size={13} />
                      </span>
                      <p className="text-sm leading-relaxed text-[var(--foreground)]/90">{feature}</p>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="build" className="scroll-mt-28">
              <Reveal>
                <h2 className="mb-8 text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">How it&apos;s built</h2>
              </Reveal>
              <BuildTimeline steps={project.implementation} />
            </section>

            <section id="stack" className="scroll-mt-28">
              <Reveal>
                <h2 className="text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">{t.projects.technologies}</h2>
              </Reveal>
              <ul className="mt-8 flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <motion.li
                    key={tech}
                    initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.03 }}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 font-mono text-xs text-[var(--foreground)]"
                  >
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <nav aria-label="More projects" className="mt-28 grid gap-4 sm:grid-cols-2">
          {[
            { p: prev, label: "Previous", icon: <ArrowLeft size={16} />, align: "items-start" },
            { p: next, label: "Next", icon: <ArrowRight size={16} />, align: "items-end text-right" },
          ].map(({ p, label, icon, align }) => (
            <Link
              key={label}
              href={`/projects/${p.slug}`}
              className={cn(
                "group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-colors hover:border-[var(--accent)]",
                align
              )}
            >
              <span className="flex items-center gap-2 font-mono text-xs text-[var(--muted)]">
                {label === "Previous" && icon}
                {label} project
                {label === "Next" && icon}
              </span>
              <span className="text-2xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">{p.title}</span>
              <span className="line-clamp-1 text-sm text-[var(--muted)]">{p.tagline}</span>
            </Link>
          ))}
        </nav>
      </Container>
    </article>
  );
}
