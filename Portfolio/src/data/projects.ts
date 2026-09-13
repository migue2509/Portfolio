import type { Project } from "../features/projects/model/project";
import tucanchaCover from "../assets/projects/tu-cancha/cover.png";

export const projects = [
  {
    slug: "tu-cancha",
    title: "Tu Cancha",
    summary: "Sistema de Reserva de complejos deportivos.",
    technologies: [],
    cover: {
      src: tucanchaCover,
      alt: "Vista del Inicio de Tu Cancha",
    },
    gallery: [],
  },
] satisfies readonly Project[];