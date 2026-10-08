import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Nirmal Kandel, a frontend-focused Full Stack / MERN developer working with React, TypeScript, Next.js and Node.js.",
};

export default function AboutPage() {
  return <AboutContent />;
}
