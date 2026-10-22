export interface Experience {
  id: string;
  company: string;
  initials: string;
  role: string;
  start: string;
  end?: string;
  startLabel: string;
  endLabel: string;
  year: string;
  technologies: readonly string[];
  impact: readonly string[];
}

// Fuente: public/documents/miguel-ospina-cv.pdf, experiencia laboral.
export const experiences = [
  {
    id: "juan-chupe-granizados",
    company: "Juan Chupe Granizados",
    initials: "JC",
    role: "Desarrollador Full Stack",
    start: "2026-02",
    startLabel: "Feb 2026",
    endLabel: "Sep 2026",
    year: "2026",
    technologies: ["Python", "Django REST Framework", "PostgreSQL", "React", "Tailwind CSS", "Git", "GitHub"],
    impact: [
      "Desarrollé un ERP de 17 módulos para centralizar inventario, caja y gestión operativa, sustituyendo registros en papel.",
      "Automaticé el cierre de jornada y reduje el arqueo de caja de 60–90 minutos a menos de 20 minutos.",
    ],
  },
  {
    id: "prebel",
    company: "Prebel S.A.S",
    initials: "P",
    role: "Desarrollador de Software · Prácticas profesionales",
    start: "2025-06",
    end: "2026-01",
    startLabel: "Jun 2025",
    endLabel: "Ene 2026",
    year: "2025–26",
    technologies: ["Power Automate", "SharePoint", "Microsoft Forms"],
    impact: [
      "Desarrollé e implementé cuatro automatizaciones: evaluación de desempeño, clasificación de capacitaciones, postulación interna y captura de conocimiento crítico.",
      "En GPS, centralicé más de 800 registros para aproximadamente 100 usuarios activos y reduje de un mes a una semana por etapa la consolidación y revisión.",
    ],
  },
] satisfies readonly Experience[];
