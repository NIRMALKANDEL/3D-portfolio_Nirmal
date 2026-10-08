"use client";

import { projects } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCarousel } from "@/components/projects/project-carousel";

export function FeaturedProjects() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="flex min-h-[100dvh] items-center overflow-x-clip py-20">
      <Container className="max-w-7xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle="Drag the ring, use the arrow keys, or click a card." />
          <LinkButton href="/projects" variant="secondary" size="sm" arrow className="shrink-0">
            {t.projects.viewAll}
          </LinkButton>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <ProjectCarousel projects={projects} />
        </Reveal>
      </Container>
    </section>
  );
}
