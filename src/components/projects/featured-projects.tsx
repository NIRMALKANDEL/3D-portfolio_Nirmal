"use client";

import { getFeaturedProjects } from "@/data/projects";
import { useLanguage } from "@/context/language-context";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";

export function FeaturedProjects() {
  const { t } = useLanguage();
  const featured = getFeaturedProjects();

  return (
    <section id="projects" className="py-24 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={t.projects.eyebrow} title={t.projects.title} subtitle={t.projects.subtitle} />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.08} className="h-full">
              <ProjectCard project={project} layout="row" />
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <LinkButton href="/projects" variant="secondary" size="sm" arrow>
            {t.projects.viewAll}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
