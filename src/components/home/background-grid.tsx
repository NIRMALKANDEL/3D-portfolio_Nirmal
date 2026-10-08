import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { EducationPreview } from "@/components/education/education-preview";
import { BeyondCodeTeaser } from "@/components/beyond-code/beyond-code-teaser";

export function BackgroundGrid() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="h-full lg:col-span-3">
            <EducationPreview />
          </Reveal>
          <Reveal delay={0.08} className="h-full lg:col-span-2">
            <BeyondCodeTeaser />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
