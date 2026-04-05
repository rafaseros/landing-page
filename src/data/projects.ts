import type { Project } from './types';

export const projects: Project[] = [
  {
    title: "Tótem de Autoagendamiento",
    role: "Tech Lead",
    summary: "Sistema de gestión autónoma de citas médicas mediante tótem interactivo. Permite a los pacientes agendar, reprogramar y cancelar citas sin intervención del personal.",
    tech: ["Laravel", "PHP", "MySQL", "REST API"],
    impact: "Reducción del 40% en tiempos de espera",
    featured: true,
  },
  {
    title: "Integración con Aseguradoras",
    role: "Tech Lead",
    summary: "Sistema de validación en tiempo real con aseguradoras Alianza y Bisa. Automatiza la verificación de cobertura y autorización de procedimientos médicos.",
    tech: ["Laravel", "PostgreSQL", "REST API", "B2B"],
    impact: "Validación en tiempo real vs. proceso manual de 24h",
    featured: true,
  },
  {
    title: "Sistema de Reportería Clínica",
    role: "Tech Lead",
    summary: "Modernización completa del sistema de reportería de almacenes y farmacia. Dashboard en tiempo real con métricas clave para la toma de decisiones.",
    tech: ["Laravel", "MySQL", "Docker", "Genexus"],
    impact: "Reportes que tomaban horas ahora se generan en segundos",
    featured: false,
  },
];
