"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectMeta } from "@/components/projects/project-card";
import { cn } from "@/lib/utils";

const CARD_W = 340;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Projects on a 3D ring. Drag / swipe, arrow keys or buttons rotate it;
 * the front card's details and links show alongside.
 */
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const n = projects.length;
  const step = 360 / n;
  // Distance from the centre so neighbouring cards just touch.
  const radius = Math.round((CARD_W / 2) / Math.tan(Math.PI / n)) + 40;
  const rotation = useMotionValue(0);
  const [active, setActive] = useState(0);
  const dragStart = useRef(0);
  const moved = useRef(false);

  useMotionValueEvent(rotation, "change", (deg) => {
    const i = mod(Math.round(-deg / step), n);
    setActive((prev) => (prev === i ? prev : i));
  });

  const goTo = (target: number) => {
    animate(rotation, target, reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18 });
  };
  const shift = (dir: 1 | -1) => goTo(Math.round(rotation.get() / step) * step - dir * step);

  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 4) moved.current = true;
    rotation.set(dragStart.current + info.offset.x * 0.22);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const projected = rotation.get() + info.velocity.x * 0.05;
    goTo(Math.round(projected / step) * step);
  };

  // Click a side card to bring it to the front (shortest way round).
  const focusCard = (i: number) => {
    if (moved.current) return;
    const current = Math.round(-rotation.get() / step);
    let delta = mod(i - current, n);
    if (delta > n / 2) delta -= n;
    goTo(-(current + delta) * step);
  };

  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") shift(1);
      if (e.key === "ArrowLeft") shift(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  });

  const project = projects[active];
  const { live, github, githubFrontend, githubBackend } = project.links;

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
      <div className="relative">
        <motion.div
          ref={stage}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects. Use left and right arrow keys to rotate."
          onPanStart={() => {
            dragStart.current = rotation.get();
            moved.current = false;
          }}
          onPan={onPan}
          onPanEnd={onPanEnd}
          className="relative h-[300px] cursor-grab touch-pan-y select-none rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] active:cursor-grabbing sm:h-[380px] [perspective:1600px]"
        >
          <div className="absolute inset-0 scale-[0.72] [transform-style:preserve-3d] sm:scale-100">
          <motion.div
            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
            style={{ rotateY: rotation, z: -radius, x: "-50%", y: "-50%" }}
          >
            {projects.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.slug}
                  type="button"
                  tabIndex={-1}
                  aria-hidden={!isActive}
                  onClick={() => focusCard(i)}
                  className={cn(
                    "absolute left-0 top-0 overflow-hidden rounded-2xl border bg-[var(--card)] transition-[opacity,border-color,filter] duration-500 [backface-visibility:hidden]",
                    isActive
                      ? "border-[color-mix(in_srgb,var(--accent)_55%,var(--border))] opacity-100 shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
                      : "border-[var(--border)] opacity-55 saturate-50"
                  )}
                  style={{
                    width: CARD_W,
                    height: CARD_W * 0.62,
                    transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
                  }}
                >
                  <Image
                    src={p.image}
                    alt={`${p.title} preview`}
                    fill
                    sizes={`${CARD_W}px`}
                    draggable={false}
                    className="pointer-events-none object-cover"
                    priority={i < 2}
                  />
                </button>
              );
            })}
          </motion.div>
          </div>
          {/* Floor reflection glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[15%] bottom-2 h-10 rounded-[100%] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_30%,transparent),transparent)] blur-md"
          />
        </motion.div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {projects.map((p, i) => (
              <span
                key={p.slug}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-[var(--border)]"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative min-h-[300px]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug}
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <ProjectMeta project={project} />
            <h3 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">{project.title}</h3>
            <p className="text-base font-medium text-[var(--foreground)]/85">{project.tagline}</p>
            <p className="line-clamp-3 max-w-[56ch] text-sm leading-relaxed text-[var(--muted)]">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-1 font-mono text-[11px] text-[var(--accent-ink)]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Link
                href={`/projects/${project.slug}`}
                className="group/cs inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] pl-5 pr-1.5 text-sm font-medium text-[var(--accent-foreground)] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                {t.projects.caseStudy}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 transition-transform duration-300 group-hover/cs:-translate-y-px group-hover/cs:translate-x-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
              {live && <ExtLink href={live} icon={<ExternalLink size={13} />} label={t.projects.liveDemo} />}
              {githubFrontend && <ExtLink href={githubFrontend} icon={<GithubIcon size={13} />} label="Frontend" />}
              {githubBackend && <ExtLink href={githubBackend} icon={<GithubIcon size={13} />} label="Backend" />}
              {github && <ExtLink href={github} icon={<GithubIcon size={13} />} label="Code" />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ExtLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      {icon}
      {label}
    </a>
  );
}
