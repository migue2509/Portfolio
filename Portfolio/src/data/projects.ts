import type { Project } from "../features/projects/model/project";

import tucanchaCover from "../assets/projects/tu-cancha/cover.png";
import juanChupeCover from "../assets/projects/juan-chupe/cover.png";

export const projects = [
  {
    slug: "tu-cancha",
    title: "Tu Cancha",
    summary: "Sistema de reserva de complejos deportivos.",
    technologies: [],
    cover: {
      src: tucanchaCover,
      alt: "Vista del inicio de Tu Cancha",
    },
    gallery: [],
  },
  {
    slug: "juan-chupe",
    title: "Juan Chupe Granizados ERP",
    summary: "Sistema ERP para Juan Chupe Granizados.",
    technologies: [],
    cover: {
      src: juanChupeCover,
      alt: "Vista del sistema Juan Chupe Granizados ERP",
    },
    gallery: [],
  },
] satisfies readonly Project[];