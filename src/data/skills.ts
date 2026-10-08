export type SkillGroup = {
  key: "frontend" | "backend" | "database" | "tools";
  items: string[];
};

// Verified against resume + NIRMALKANDEL GitHub repositories (devTinder,
// devTinder-web, netflix-gpt, mern-todo, NEXT-project-imagekit,
// Food-dilivery-app- / Nibblr, DUMMY-client-website- / Brightway Solar).
export const skillGroups: SkillGroup[] = [
  {
    key: "frontend",
    items: [
      "React.js",
      "Next.js",
      "JavaScript (ES6+)",
      "TypeScript",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "Material UI",
      "Motion",
      "Three.js",
      "React Three Fiber",
      "GLSL Shaders",
      "Bootstrap",
    ],
  },
  {
    key: "backend",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Next.js API Routes",
      "JWT Auth",
      "NextAuth.js",
    ],
  },
  {
    key: "database",
    items: ["MongoDB", "Mongoose", "Firebase", "ImageKit", "Vercel", "AWS EC2", "AWS SES", "nginx", "Cloudflare"],
  },
  {
    key: "tools",
    items: [
      "Claude Code",
      "Gemini API",
      "Git",
      "GitHub",
      "GitLab",
      "CI/CD",
      "Vite",
      "Jest",
      "Postman",
      "Jira",
      "Figma",
    ],
  },
];
