export type EducationItem = {
  level: "primary" | "secondary";
  degree: string;
  institution: string;
  university?: string;
  duration?: string;
};

// Sourced from resume. Percentages/CGPA are omitted where not provided
// on the resume rather than estimated.
export const education: EducationItem[] = [
  {
    level: "primary",
    degree: "B.Tech, Computer Science Engineering",
    institution: "Sushila Devi Bansal College of Technology (SDBCT), Indore",
    university: "RGPV University",
    duration: "2020 - 2024",
  },
  {
    level: "secondary",
    degree: "Class XII",
    institution: "Carmel Convent Higher Secondary School",
  },
  {
    level: "secondary",
    degree: "Class X",
    institution: "Carmel Convent Higher Secondary School",
  },
];
