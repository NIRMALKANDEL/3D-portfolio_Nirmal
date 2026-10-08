"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SHAPES, type Shape } from "@/components/lab/shapes";
import { cn } from "@/lib/utils";

const ParticleMorph = dynamic(() => import("@/components/lab/particle-morph"), { ssr: false });

const stack = ["Three.js", "React Three Fiber", "GLSL shaders", "Motion", "Next.js"];

const notes = [
  { title: "Custom shaders", body: "Each particle is placed and lit on the GPU in a hand-written GLSL vertex and fragment shader." },
  { title: "Staggered morph", body: "Particles start moving at slightly different times, so shapes ripple into each other." },
  { title: "Pointer field", body: "Move your cursor over the canvas and the particles step out of the way." },
];

export function ThreeLab() {
  const [shape, setShape] = useState<Shape>("Sphere");
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();

  // Cycle shapes until the visitor picks one.
  useEffect(() => {
    if (!auto || reduce) return;
    const id = window.setInterval(() => {
      setShape((s) => SHAPES[(SHAPES.indexOf(s) + 1) % SHAPES.length]);
    }, 4200);
    return () => window.clearInterval(id);
  }, [auto, reduce]);

  return (
    <section id="lab" className="py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div className="flex min-w-0 flex-col gap-8">
            <Reveal>
              <SectionHeading
                eyebrow="3D Lab"
                title="Interactive 3D, built for the web"
                subtitle="About 14,000 particles morphing between shapes in real time. Pick a shape, or let it cycle."
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div
                role="tablist"
                aria-label="Particle shape"
                className="inline-flex flex-wrap gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1"
              >
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={shape === s}
                    onClick={() => {
                      setAuto(false);
                      setShape(s);
                    }}
                    className={cn(
                      "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                      shape === s ? "text-[var(--accent-foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {shape === s && (
                      <motion.span
                        layoutId="lab-tab"
                        className="absolute inset-0 rounded-xl bg-[var(--accent)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{s}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            <ul className="flex flex-col gap-5">
              {notes.map((note, i) => (
                <li key={note.title} className="border-t border-[var(--border)] pt-4">
                  <Reveal delay={0.08 + i * 0.06}>
                    <h3 className="text-[15px] font-semibold text-[var(--foreground)]">{note.title}</h3>
                    <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-[var(--muted)]">{note.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <p className="font-mono text-xs text-[var(--muted)]">{stack.join("  /  ")}</p>
            </Reveal>
          </div>

          <Reveal className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]"
              />
              <ParticleMorph shape={shape} />
              <p className="pointer-events-none absolute bottom-4 left-5 font-mono text-[11px] text-[var(--muted)]" aria-live="polite">
                {shape}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
