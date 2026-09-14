import type { ImageMetadata } from 'astro';
import juanChupeLogo from '../assets/testimonials/juan-chupe.png';
import blossomGlowLogo from '../assets/testimonials/blossom-glow.webp';
import dinamarcaLogo from '../assets/testimonials/dinamarca.png';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  draft?: boolean;
  logo?: { src: ImageMetadata; alt: string };
}

// Textos proporcionados por Miguel para el portafolio.
export const testimonials: readonly Testimonial[] = [
  {
    id: 'jean-franco-ochoa',
    logo: { src: juanChupeLogo, alt: 'Logo de Juan Chupe Granizados' },
    name: 'Jean Franco Ochoa',
    role: 'CEO · Juan Chupe Granizados',
    quote: 'Miguel entendió nuestras necesidades y las transformó en una solución funcional, cuidando tanto la experiencia del usuario como la parte técnica.',
  },
  {
    id: 'michelle-serna',
    logo: { src: blossomGlowLogo, alt: 'Logo de Blossom Glow' },
    name: 'Michelle Serna',
    role: 'CEO · Blossom Glow',
    quote: 'Destaco su creatividad, comunicación y capacidad para convertir una idea en un producto digital atractivo y bien estructurado.',
  },
  {
    id: 'egidio-mosquera',
    logo: { src: dinamarcaLogo, alt: 'Escudo de la Institución Educativa Dinamarca' },
    name: 'Egidio Mosquera',
    role: 'Institución Educativa Dinamarca',
    quote: 'Miguel demostró compromiso y responsabilidad durante el desarrollo, proponiendo soluciones claras y adaptadas a las necesidades de la institución.',
  },
];
