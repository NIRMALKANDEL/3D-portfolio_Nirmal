"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/brand-icons";
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
      <span className="uppercase tracking-[0.16em] text-[var(--accent)]">{project.category}</span>
      <span className="inline-flex items-center gap-1.5 text-[var(--muted)]">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            project.status === "live" && "bg-[var(--accent-2)]",
            project.status === "completed" && "bg-[var(--muted)]",
            project.status === "in-progress" && "bg-[var(--accent)]"
          )}
        />
        {statusLabel}
      </span>
      {project.builtWithClaude && (
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[var(--accent)]">
          <Sparkles size={12} />
          {t.projects.builtWithClaude}
        </span>
      )}
    </div>
  );
}

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { t } = useLanguage();
  const techLimit = featured ? 8 : 4;
  const extraTech = project.technologies.length - techLimit;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]",
        featured && "lg:flex-row"
      )}
    >
      <div
        className={cn(
          "w-full border-b border-[var(--border)]",
          featured && "lg:flex lg:w-1/2 lg:shrink-0 lg:items-center lg:border-b-0 lg:bg-[var(--surface)] lg:p-6"
        )}
      >
        <Link
          href={`/projects/${project.slug}`}
          tabIndex={-1}
          aria-hidden
          className={cn(
            "relative block aspect-video w-full overflow-hidden",
            featured && "lg:rounded-xl lg:border lg:border-[var(--border)]"
          )}
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={featured}
          />
        </Link>
      </div>

      <div className={cn("flex flex-1 flex-col gap-4 p-6", featured && "lg:p-8")}>
        <ProjectMeta project={project} />

        <div className="flex flex-col gap-2">
          <h3
            className={cn(
              "font-semibold tracking-tight text-[var(--foreground)]",
              featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            )}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]"
            >
              {project.title}
              <ArrowUpRight
                size={18}
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </Link>
          </h3>
          <p className="text-sm font-medium text-foreground/80">{project.tagline}</p>
        </div>

        <p
          className={cn(
            "text-sm leading-relaxed text-[var(--muted)]",
            !featured && "line-clamp-4"
          )}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, techLimit).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {extraTech > 0 && (
            <Badge className="border-dashed">
              +{extraTech} {t.projects.moreTech}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
          {project.links.live && (
            <LinkButton href={project.links.live} size="sm">
              <ExternalLink size={14} />
              {t.projects.liveDemo}
            </LinkButton>
          )}
          {project.links.github && (
            <LinkButton href={project.links.github} variant="secondary" size="sm">
              <GithubIcon size={14} />
              {t.projects.githubLabel}
            </LinkButton>
          )}
          {project.links.githubFrontend && (
            <LinkButton href={project.links.githubFrontend} variant="secondary" size="sm">
              <GithubIcon size={14} />
              {t.projects.frontendRepo}
            </LinkButton>
          )}
          {project.links.githubBackend && (
            <LinkButton href={project.links.githubBackend} variant="secondary" size="sm">
              <GithubIcon size={14} />
              {t.projects.backendRepo}
            </LinkButton>
          )}
          <LinkButton href={`/projects/${project.slug}`} variant="ghost" size="sm">
            {t.projects.caseStudy}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
