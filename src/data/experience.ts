export type Experience = {
  role: string;
  company: string;
  duration: string;
  location?: string;
  bullets: string;
  bulletList: string[];
  isEngineering: boolean;
  featuredOnHome: boolean;
};

// Sourced directly from resume. Reverse-chronological order.
export const experience: Experience[] = [
  {
    role: "Recruiter",
    company: "LanceSoft Inc.",
    duration: "Dec 2025 - Apr 2026",
    bullets: "",
    bulletList: [
      "Managed end-to-end recruitment for US healthcare professionals.",
      "Sourced, screened, and coordinated candidates through the hiring pipeline.",
    ],
    isEngineering: false,
    featuredOnHome: false,
  },
  {
    role: "Associate Software Engineer",
    company: "GammaEdge Technologies",
    duration: "Mar 2025 - Oct 2025",
    bullets: "",
    bulletList: [
      "Developed production-ready, responsive UIs using React, TypeScript, and Material UI.",
      "Integrated backend APIs for seamless data retrieval and updates.",
      "Collaborated closely with backend developers to optimize API structure and performance.",
      "Used GitLab and CI/CD pipelines for deployment and version control.",
    ],
    isEngineering: true,
    featuredOnHome: true,
  },
  {
    role: "MERN Stack Intern (Full-time)",
    company: "Startappss System",
    duration: "Sept 2024 - Jan 2025",
    bullets: "",
    bulletList: [
      "Designed and implemented REST API integration between frontend and backend services.",
      "Built responsive UI components in React.js and Tailwind CSS.",
      "Participated in Agile sprints, working on both frontend and backend enhancements.",
    ],
    isEngineering: true,
    featuredOnHome: true,
  },
];
