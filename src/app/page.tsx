import { Hero } from "@/components/hero/hero";
import { SkillsSection } from "@/components/skills/skills-section";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ExperiencePreview } from "@/components/experience/experience-preview";
import { BackgroundGrid } from "@/components/home/background-grid";
import { ContactCta } from "@/components/contact/contact-cta";
import { ThreeLab } from "@/components/lab/three-lab";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <ThreeLab />
      <SkillsSection />
      <ExperiencePreview />
      <BackgroundGrid />
      <ContactCta />
    </>
  );
}
