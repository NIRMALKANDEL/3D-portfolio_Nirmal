import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects built by Nirmal Kandel, including Paylog, DevTinder, Nibblr, Netflix GPT, Brightway Solar, a Next.js video app and a MERN todo app.",
};

export default function ProjectsPage() {
  return <ProjectGrid />;
}
