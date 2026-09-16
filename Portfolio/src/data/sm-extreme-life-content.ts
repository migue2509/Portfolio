import type { ImageMetadata } from "astro";
import type { ProjectImage } from "../features/projects/model/project";
import cover from "../assets/projects/sm-extreme-life/cover.png";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/projects/sm-extreme-life/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

function findImage(name: string): ImageMetadata | undefined {
  for (const extension of ["png", "jpg", "jpeg", "webp"]) {
    const image = images[`../assets/projects/sm-extreme-life/${name}.${extension}`]?.default;
    if (image) return image;
  }
}

const meeting = findImage("reunion-cliente");

// Alcance propuesto a partir de las respuestas escritas del formulario.
// Las opciones sin marcar no se consideran requisitos confirmados.
export const smExtremeLifeContent = {
  introduction: "SM EXTREME LIFE es un proyecto de página web para Smaya_Trainer, con una landing de presentación y funcionalidades backend. Actualmente se encuentra en etapa de requerimientos y primeras reuniones con el cliente.\n\nLa propuesta busca reunir su marca personal, contenido de entrenamiento y solicitudes de asesoría, además de definir una guía de seguimiento de rutinas para usuarios.",
  problem: "El reto inicial es definir el alcance de una web que reúna la presentación del entrenador, su marca y ropa personal, técnicas de ejecución de ejercicios, transformaciones, testimonios y solicitudes de asesoría.\n\nEl público descrito incluye personas que entrenan en gimnasio, adultos mayores y deportistas. Las primeras reuniones se centran en concretar estas necesidades antes de comenzar el desarrollo.",
  solution: "La solución está en definición. El formulario plantea presentar la historia del entrenador, reunir videos y explicaciones de técnicas de entrenamiento, mostrar cambios físicos y testimonios, facilitar el contacto con sus redes sociales y recibir solicitudes de asesoría.\n\nTambién se propone una guía de seguimiento de rutinas para usuarios. El alcance de estas funcionalidades backend se concretará durante el levantamiento de requerimientos; todavía no se presenta una aplicación implementada.",
  technicalDecisions: "El stack previsto es HTML, CSS, JavaScript, Java y Spring Boot, con Trello, Figma y Postman como herramientas de trabajo. Las decisiones de arquitectura, los flujos y las reglas del backend están pendientes de definición.",
  learnings: "Pendientes de documentar conforme avancen las reuniones y el desarrollo.",
  result: "Estado actual: formulario de requerimientos y primeras reuniones con el cliente. El proyecto aún no cuenta con un producto terminado ni resultados de implementación.",
  cover: {
    src: cover,
    alt: "Portada de SM EXTREME LIFE",
  },
  gallery: meeting ? [{
    src: meeting,
    alt: "Reunión con el cliente de SM EXTREME LIFE",
    title: "Reunión con el cliente",
    description: "Primeras reuniones para definir los requerimientos del proyecto.",
  }] satisfies ProjectImage[] : [],
};
