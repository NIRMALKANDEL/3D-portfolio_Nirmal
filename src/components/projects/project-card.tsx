"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { GithubIcon } from "@/components/ui/brand-icons";
import { TiltCard } from "@/components/ui/tilt-card";
import { cn } from "@/lib/utils";

export function ProjectMeta({ project }: { project: Project }) {
  const { t } = useLanguage();
  const statusLabel = {
    live: t.projects.live,
    completed: t.projects.completed,
    "in-progress": t.projects.inProgress,
  }[project.status];

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium">
      <span className="font-mono uppercase tracking-[0.14em] text-[var(--accent-ink)]">{project.category}</span>
      <span className="text-[var(--muted)]">{statusLabel}</span>
      {project.builtWithClaude && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-[var(--accent-ink)]">
          <Sparkles size={12} />
          {t.projects.builtWithClaude}
        </span>
      )}
    </div>
  );
}

const linkChip =
  "relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 text-xs font-medium text-[var(--foreground)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

/** Compact card: image, title, short description, Live / Frontend / Backend links. */
export function ProjectCard({
  project,
  layout = "stack",
}: {
  project: Project;
  /** "row" puts a small image beside the text for a shorter card. */
  layout?: "stack" | "row";
}) {
  const { t } = useLanguage();
  const { live, github, githubFrontend, githubBackend } = project.links;
  const href = `/projects/${project.slug}`;
  const row = layout === "row";

  return (
    <TiltCard max={row ? 3 : 4}>
      <article
        className={cn(
          "group relative flex h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated hoverable",
          row ? "flex-col sm:flex-row" : "flex-col"
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-[var(--surface)]",
            row
              ? "aspect-[16/9] border-b border-[var(--border)] sm:aspect-auto sm:w-[38%] sm:border-b-0 sm:border-r"
              : "aspect-[16/9] border-b border-[var(--border)]"
          )}
        >
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes={row ? "(min-width: 1024px) 20vw, (min-width: 640px) 38vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className={cn("object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]", row && "sm:object-left")}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
          <ProjectMeta project={project} />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            {/* The whole card is clickable through this stretched link. */}
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {project.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{project.tagline}</p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className={linkChip}>
                <ExternalLink size={12} />
                {t.projects.liveDemo}
              </a>
            )}
            {githubFrontend && (
              <a href={githubFrontend} target="_blank" rel="noopener noreferrer" className={linkChip}>
                <GithubIcon size={12} />
                Frontend
              </a>
            )}
            {githubBackend && (
              <a href={githubBackend} target="_blank" rel="noopener noreferrer" className={linkChip}>
                <GithubIcon size={12} />
                Backend
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className={linkChip}>
                <GithubIcon size={12} />
                Code
              </a>
            )}
            <Link href={href} className={cn(linkChip, "border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] text-[var(--accent-ink)]")}>
              {t.projects.caseStudy}
            </Link>
            <span
              aria-hidden
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--foreground)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-ink)]"
            >
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
