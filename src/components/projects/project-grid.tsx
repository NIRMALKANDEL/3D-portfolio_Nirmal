"use client";

import { projects } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";

export function ProjectGrid() {
  const { t } = useLanguage();

  return (
    <Container className="py-20 lg:py-28">
      <Reveal>
        <SectionHeading title={t.projects.viewAllProjects} subtitle={t.projects.subtitle} />
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 3) * 0.06} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
