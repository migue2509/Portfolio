import type { Project } from "../features/projects/model/project";
import { tuCanchaContent } from "./tu-cancha-content";
import { tuCanchaGallery } from "./tu-cancha-gallery";
import { juanChupeContent } from "./juan-chupe-content";
import { juanChupeGallery } from "./juan-chupe-gallery";

import tucanchaCover from "../assets/projects/tu-cancha/cover.png";
import juanChupeCover from "../assets/projects/juan-chupe/gallery/cover.png";
import juanChupePaper from "../assets/projects/juan-chupe/registro-papel.jpeg";

export const projects = [
  {
    slug: "tu-cancha",
    ...tuCanchaContent,
    repositoryUrl: "https://github.com/DilsiaLamadridTorres/APP_TuCancha",
    liveUrl: "https://dilsialamadridtorres.github.io/APP_TuCancha/",
    title: "Tu Cancha",
    team: "Proyecto en Equipo",
    summary: "Sistema de reserva de complejos deportivos.",
    role: "Desarrollador Full Stack | Líder Técnico",
    category: "Sistema de Reservas",
    client: "Proyecto académico — Generation Colombia",
    technologies: ["html", "css", "javascript", "trello", "figma", "java", "springBoot", "postman"],
    cover: {
      src: tucanchaCover,
      alt: "Vista del inicio de Tu Cancha",
    },
    gallery: tuCanchaGallery,
  },
  {
    slug: "juan-chupe",
    ...juanChupeContent,
    repositoryUrl: "https://github.com/migue2509/juan-chupe-erp/tree/main",
    challengeImage: { src: juanChupePaper, alt: "Registro original en papel de la operación de Juan Chupe" },
    title: "Juan Chupe Granizados ERP",
    team: "Proyecto Individual",
    dateLabel: "Julio, 2026",
    status: "Completado",
    summary: "Sistema ERP para Juan Chupe Granizados.",
    category: "ERP",
    role: "Desarrollador Full Stack freelance",
    client: "Juan Chupe Granizados",
    tags: ["ERP", "Full Stack"],
    // Información documentada en la experiencia del CV.
    tools: ["Python", "Django REST Framework", "PostgreSQL", "React", "Tailwind CSS", "Git", "GitHub"],
    technologies: [],
    cover: {
      src: juanChupeCover,
      alt: "Vista del sistema Juan Chupe Granizados ERP",
    },
    gallery: juanChupeGallery,
  },
] satisfies readonly Project[];
