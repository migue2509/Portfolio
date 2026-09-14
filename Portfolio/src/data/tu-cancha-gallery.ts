import type { ImageMetadata } from 'astro';
import type { ProjectImage } from '../features/projects/model/project';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/tu-cancha/gallery/*.png', { eager: true },
);

const entries = [
  {
    file: 'inicio.png', title: 'Inicio',
    alt: 'Vista de Inicio de TuCancha presentada en un portátil',
    description: 'Presenta de forma rápida qué es TuCancha y cuál es su propuesta de valor para el usuario.',
    highlights: ['Presentación general de la plataforma', 'Beneficios principales', 'Explicación resumida de cómo funciona', 'Canchas populares', 'Acceso rápido a la exploración de canchas'],
  },
  {
    file: 'canchas.png', title: 'Canchas',
    alt: 'Vista del catálogo de canchas de TuCancha presentada en un portátil',
    description: 'Es la sección donde el usuario puede explorar las opciones disponibles y encontrar una cancha según sus necesidades.',
    highlights: ['Catálogo de canchas', 'Búsqueda por nombre o ubicación', 'Filtros de búsqueda', 'Información básica de cada cancha', 'Acceso al proceso de reserva'],
  },
  {
    file: 'nosotros.png', title: 'Nosotros',
    alt: 'Vista de Nosotros de TuCancha presentada en un portátil',
    description: 'Explica el propósito de TuCancha, a quién va dirigido y qué beneficios ofrece tanto a jugadores como a administradores de complejos.',
    highlights: ['Propuesta de valor de la plataforma', 'Beneficios para administradores de complejos', 'Beneficios para jugadores', 'Enfoque en reservas y gestión deportiva', 'Presentación del equipo del proyecto'],
  },
  {
    file: 'contacto.png', title: 'Contacto',
    alt: 'Vista de Contacto de TuCancha presentada en un portátil',
    description: 'Centraliza la información de ayuda, soporte y comunicación con los usuarios.',
    highlights: ['Ayuda relacionada con reservas', 'Acceso al registro de complejos', 'Preguntas frecuentes', 'Dudas, sugerencias y reclamos', 'Formulario de contacto'],
  },
];

export const tuCanchaGallery: readonly ProjectImage[] = entries.flatMap(({ file, ...entry }) => {
  const image = images[`../assets/projects/tu-cancha/gallery/${file}`];
  return image ? [{ ...entry, src: image.default }] : [];
});
