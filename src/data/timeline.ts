export type TimelineEntry = {
  period: string;
  title: string;
  description: string;
  skills: string[];
};

// Built from GitHub repository dates and the resume. Oldest first.
export const skillsTimeline: TimelineEntry[] = [
  {
    period: "Aug 2024",
    title: "Web fundamentals",
    description: "First portfolio, an Amazon landing page clone and a tic-tac-toe game.",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    period: "Sept 2024 – Jan 2025",
    title: "MERN Stack Intern",
    description: "Built React UIs and integrated REST APIs in Agile sprints at Startappss System.",
    skills: ["React", "Tailwind CSS", "REST APIs", "Agile"],
  },
  {
    period: "Feb – Mar 2025",
    title: "Full-stack MERN — DevTinder",
    description: "Designed a backend from scratch: auth, database models and a connection-request system.",
    skills: ["Node.js", "Express.js", "MongoDB", "JWT", "Redux Toolkit"],
  },
  {
    period: "Mar – Oct 2025",
    title: "Associate Software Engineer",
    description: "Production UIs at GammaEdge Technologies with TypeScript and Material UI, shipped through CI/CD.",
    skills: ["TypeScript", "Material UI", "GitLab", "CI/CD"],
  },
  {
    period: "Feb 2026",
    title: "Full-stack Next.js",
    description: "A video-sharing app with NextAuth, protected API routes and ImageKit uploads.",
    skills: ["Next.js", "NextAuth.js", "Mongoose", "ImageKit"],
  },
  {
    period: "Jul – Aug 2026",
    title: "AI integrations",
    description: "Netflix GPT with AI movie search on the Gemini API, and a deployed MERN Todo app.",
    skills: ["Gemini API", "Firebase", "React 19", "Vite"],
  },
  {
    period: "Sept 2026 – Now",
    title: "Building with Claude Code",
    description: "Using Claude Code to build multiple websites — Nibblr, Brightway Solar and this portfolio — and experimenting with new AI-assisted workflows.",
    skills: ["Claude Code", "Next.js 16", "Leaflet", "Jest", "Vercel"],
  },
];
