# Miguel Ospina · Portafolio

**Desarrollador Full Stack** con enfoque en Java, Spring Boot y JavaScript.

Portafolio personal para presentar mis proyectos, experiencia, habilidades y forma de trabajar.

## Enlaces principales

- [Demo del portafolio](https://miguelospinadev.vercel.app)
- [Diseño en Figma](https://www.figma.com/design/clo4maMz0d7bmX5WPvsLmo/PORTAFOLIO?node-id=20-26)
- [LinkedIn](https://www.linkedin.com/in/miguel-ospina-desarrollador-full-stack/)
- [GitHub](https://github.com/migue2509)

## Sobre el proyecto

Este sitio reúne mi trabajo y experiencia en un solo lugar. Se creó para mostrar las soluciones que desarrollo, explicar las decisiones detrás de cada proyecto y facilitar el contacto con posibles clientes y equipos.

Está construido con Astro y TypeScript. Genera páginas estáticas, optimiza las imágenes y utiliza GSAP para las animaciones, respetando la preferencia de movimiento reducido.

## Vista previa

Imagen utilizada en la presentación del portafolio:

<img src="src/assets/profile/Image.png" alt="Retrato ilustrado de Miguel Ospina" width="280" />

Pendiente de añadir una captura completa o un video del sitio.

## Características

| Característica | Descripción |
| --- | --- |
| Introducción animada | Cuadrícula de commits que forma «HEY!!», con opción de omitir. |
| Galería de proyectos | Tarjetas con navegación por scroll y teclado. |
| Detalle de proyectos | Presentación, reto, solución, decisiones técnicas, aprendizajes y resultados. |
| Sobre mí y stack | Perfil y herramientas utilizadas. |
| Experiencia | Línea de tiempo con animaciones al desplazarse. |
| Testimonios | Carrusel con comentarios y logos de las organizaciones. |
| Contacto | Formulario conectado con Formspree. |
| Descarga de CV | Acceso directo a la hoja de vida en PDF. |
| Diseño adaptable | Presentación para escritorio y dispositivos móviles. |

## Stack

- **Astro:** generación estática y componentes.
- **TypeScript:** datos y comportamiento de la interfaz.
- **CSS:** estilos locales, variables y diseño responsive.
- **GSAP:** animaciones y transiciones.
- **Formspree:** envío del formulario de contacto.
- **Geist y Geist Mono:** tipografías.
- **Herramientas de trabajo:** npm, Git y GitHub.

## Estructura del proyecto

```text
public/
└── documents/           # Hoja de vida
src/
├── assets/              # Imágenes, logos y texturas
├── data/                # Proyectos, experiencia y testimonios
├── features/            # Componentes y lógica por funcionalidad
├── layouts/             # Estructura general de las páginas
├── pages/
│   ├── index.astro      # Página principal
│   └── proyectos/
│       └── [slug].astro # Página individual de cada proyecto
├── sections/            # Secciones del portafolio
└── shared/              # Componentes reutilizables y estilos globales
astro.config.mjs
package.json
```

El contenido se mantiene separado de la presentación. Las páginas de proyectos se generan desde el catálogo de `src/data/projects.ts`.

## Desarrollo local

Requisito: **Node.js 22.12.0 o superior**.

```bash
npm install
npm run dev
```

Abre [localhost:4321](http://localhost:4321). Si el puerto está ocupado, utiliza la dirección indicada en la terminal.

Para compilar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

La compilación se genera en `dist/`. Para utilizar otro formulario de Formspree, configura `PUBLIC_FORMSPREE_ENDPOINT` en un archivo `.env`, siguiendo `.env.example`.

## Enlaces

- [Demo del portafolio](https://miguelospinadev.vercel.app)
- [Diseño en Figma](https://www.figma.com/design/clo4maMz0d7bmX5WPvsLmo/PORTAFOLIO?node-id=20-26)
- [LinkedIn](https://www.linkedin.com/in/miguel-ospina-desarrollador-full-stack/)
- [Repositorio del portafolio](https://github.com/migue2509/Portfolio)
- [Repositorio de Tu Cancha](https://github.com/DilsiaLamadridTorres/APP_TuCancha)
- [Demo de Tu Cancha](https://dilsialamadridtorres.github.io/APP_TuCancha/)
- [Hoja de vida](public/documents/miguel-ospina-cv.pdf)

## Autor

**Miguel Ospina**

- GitHub: [@migue2509](https://github.com/migue2509)
- Correo: [miguel.ospina.dev@gmail.com](mailto:miguel.ospina.dev@gmail.com)
