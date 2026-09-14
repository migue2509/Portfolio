export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  draft?: boolean;
}

// Borradores de diseño: no son declaraciones reales de estas personas.
// Sustituir el texto por el aprobado por su autor antes de retirar draft.
export const testimonials: readonly Testimonial[] = [
  {
    id: 'jean-franco-ochoa',
    name: 'Jean Franco Ochoa',
    role: 'CEO · Juan Chupe Granizados',
    quote: 'Una solución pensada para simplificar la operación y reunir en un solo lugar lo que el negocio necesita cada día.',
    draft: true,
  },
  {
    id: 'michelle-serna',
    name: 'Michelle Serna',
    role: 'CEO · Blossom Glow',
    quote: 'La atención a los detalles y una comunicación clara hacen que una idea empiece a tomar forma con confianza.',
    draft: true,
  },
  {
    id: 'egidio-mosquera',
    name: 'Egidio Mosquera',
    role: 'Institución Educativa Dinamarca',
    quote: 'La curiosidad, la disposición para aprender y el compromiso son una buena base para afrontar nuevos retos.',
    draft: true,
  },
];
