import type { Metadata } from "next";
import { NonTechContent } from "@/components/beyond-code/non-tech-content";

export const metadata: Metadata = {
  title: "Beyond Code",
  description:
    "Events, operations and community experience outside of software engineering, esports, brand launch events and volunteering.",
};

export default function NonTechPage() {
  return <NonTechContent />;
}
