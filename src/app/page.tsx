import { Hero } from "@/components/hero/hero";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { SkillsSection } from "@/components/skills/skills-section";
import { Journey } from "@/components/journey/journey";
import { ExperiencePreview } from "@/components/experience/experience-preview";
import { ContactCta } from "@/components/contact/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsSection />
      <Journey />
      <ExperiencePreview />
      <ContactCta />
    </>
  );
}
