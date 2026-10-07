"use client";

import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ProjectMeta } from "@/components/projects/project-card";

export function ProjectDetail({ project }: { project: Project }) {
  const { t } = useLanguage();

  return (
    <Container className="py-16 sm:py-20">
      <LinkButton href="/projects" variant="ghost" size="sm" className="mb-8 -ml-2">
        <ArrowLeft size={14} />
        {t.projects.backToProjects}
      </LinkButton>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)]">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <ProjectMeta project={project} />
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {project.title}
        </h1>
        <p className="max-w-2xl text-[15px] text-[var(--muted)]">{project.tagline}</p>

        <div className="flex flex-wrap gap-3 pt-2">
          {project.links.live && (
            <LinkButton href={project.links.live}>
              <ExternalLink size={14} />
              {t.projects.liveDemo}
            </LinkButton>
          )}
          {project.links.github && (
            <LinkButton href={project.links.github} variant="secondary">
              <GithubIcon size={14} />
              {t.projects.githubLabel}
            </LinkButton>
          )}
          {project.links.githubFrontend && (
            <LinkButton href={project.links.githubFrontend} variant="secondary">
              <GithubIcon size={14} />
              {t.projects.frontendRepo}
            </LinkButton>
          )}
          {project.links.githubBackend && (
            <LinkButton href={project.links.githubBackend} variant="secondary">
              <GithubIcon size={14} />
              {t.projects.backendRepo}
            </LinkButton>
          )}
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {t.projects.overview}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              {project.description}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              {project.problem}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {t.projects.keyFeatures}
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-[15px] text-[var(--muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Technical Implementation
            </h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {project.implementation.map((line) => (
                <li key={line} className="flex gap-2.5 text-[15px] text-[var(--muted)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--muted)]" />
                  {line}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-3 self-start rounded-2xl border border-[var(--border)] bg-[var(--card)] card-elevated p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]">
            {t.projects.technologies}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </aside>
      </div>
    </Container>
  );
}
