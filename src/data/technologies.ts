import type { TechnologyCategory } from './types';

export const technologyCategories: TechnologyCategory[] = [
  {
    name: "Backend",
    techs: [
      { name: "PHP", level: "Expert" },
      { name: "Laravel", level: "Expert" },
      { name: "Genexus", level: "Expert" },
    ],
  },
  {
    name: "Bases de Datos",
    techs: [
      { name: "MySQL", level: "Expert" },
      { name: "PostgreSQL", level: "Expert" },
    ],
  },
  {
    name: "Frontend",
    techs: [
      { name: "JavaScript", level: "Proficient" },
      { name: "HTML/CSS", level: "Expert" },
      { name: "React", level: "Proficient" },
      { name: "Angular", level: "Familiar" },
    ],
  },
  {
    name: "DevOps & Herramientas",
    techs: [
      { name: "Docker", level: "Proficient" },
      { name: "Git", level: "Expert" },
      { name: "Linux", level: "Proficient" },
    ],
  },
  {
    name: "Mobile",
    techs: [
      { name: "Android", level: "Proficient" },
    ],
  },
  {
    name: "Otros",
    techs: [
      { name: "WordPress", level: "Proficient" },
      { name: "REST APIs", level: "Expert" },
      { name: "Integraciones B2B", level: "Expert" },
    ],
  },
];
