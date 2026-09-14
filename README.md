<div align="center">

# Miguel Ospina · Portafolio

**Desarrollador Full Stack con enfoque en Backend, especializado en Java, Spring Boot y desarrollo de APIs REST.**

Portafolio personal enfocado en desarrollo web, APIs REST y soluciones con Java, Spring Boot y JavaScript — con proyectos destacados, experiencia, habilidades técnicas y casos donde explico los retos, decisiones y resultados detrás de cada desarrollo.

<br>

## Enlaces principales

[![Demo](https://img.shields.io/badge/Demo-en_vivo-2563EB?style=for-the-badge\&logo=vercel\&logoColor=white)](https://miguelospinadev.vercel.app)
[![Figma](https://img.shields.io/badge/Figma-dise%C3%B1o-F24E1E?style=for-the-badge\&logo=figma\&logoColor=white)](https://www.figma.com/design/clo4maMz0d7bmX5WPvsLmo/PORTAFOLIO?node-id=20-26)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-perfil-0A66C2?style=for-the-badge)](https://www.linkedin.com/in/miguel-ospina-desarrollador-full-stack/)
[![GitHub](https://img.shields.io/badge/GitHub-migue2509-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/migue2509)

</div>

<br>

---

## Sobre el proyecto

## Sobre el proyecto

Este portafolio fue creado para mostrar mi trabajo como desarrollador de una forma más completa que una hoja de vida o una lista de tecnologías. La idea es que cada proyecto permita entender qué construí, qué problema abordé y qué decisiones tomé durante el desarrollo.

La experiencia está organizada para que quien lo visite pueda conocer rápidamente mi perfil, explorar mis proyectos, revisar las tecnologías con las que trabajo y profundizar en cada caso sin perder el contexto.

Está desarrollado con Astro y TypeScript, utilizando generación estática y optimización de imágenes para mantener una carga rápida. Las animaciones e interacciones se construyeron con GSAP, buscando una experiencia visual dinámica sin sacrificar rendimiento ni accesibilidad.

<br>

---

## Vista previa

Imagen utilizada en la presentación del portafolio:

<div align="center">

<img src="Portfolio/src/assets/profile/Image.png" alt="Retrato ilustrado de Miguel Ospina" width="280" />

</div>

Pendiente de añadir una captura completa o un video del sitio.

<br>

---

## Características

| Característica       | Descripción                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| Introducción animada | Cuadrícula de commits que forma «HEY!!», con opción de omitir.                |
| Galería de proyectos | Tarjetas con navegación por scroll y teclado.                                 |
| Detalle de proyectos | Presentación, reto, solución, decisiones técnicas, aprendizajes y resultados. |
| Sobre mí y stack     | Perfil y herramientas utilizadas.                                             |
| Experiencia          | Línea de tiempo con animaciones al desplazarse.                               |
| Testimonios          | Carrusel con comentarios y logos de las organizaciones.                       |
| Contacto             | Formulario conectado con Formspree.                                           |
| Descarga de CV       | Acceso directo a la hoja de vida en PDF.                                      |
| Diseño adaptable     | Presentación para escritorio y dispositivos móviles.                          |

<br>

---

## Stack

<div align="center">

![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge\&logo=astro\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399?style=for-the-badge\&logo=css\&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=for-the-badge\&logo=gsap\&logoColor=black)
![Formspree](https://img.shields.io/badge/Formspree-E5122E?style=for-the-badge)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

</div>

* **Astro:** generación estática y componentes.
* **TypeScript:** datos y comportamiento de la interfaz.
* **CSS:** estilos locales, variables y diseño responsive.
* **GSAP:** animaciones y transiciones.
* **Formspree:** envío del formulario de contacto.
* **Geist y Geist Mono:** tipografías.
* **Herramientas de trabajo:** npm, Git y GitHub.

<br>

---

## Estructura del proyecto

La aplicación se encuentra en la carpeta `Portfolio/`. Su estructura interna es:

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

<br>

---

## Desarrollo local

Requisito: **Node.js 22.12.0 o superior**.

```bash
cd Portfolio
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

<br>

---

## Enlaces

* [Demo del portafolio](https://miguelospinadev.vercel.app)
* [Diseño en Figma](https://www.figma.com/design/clo4maMz0d7bmX5WPvsLmo/PORTAFOLIO?node-id=20-26)
* [LinkedIn](https://www.linkedin.com/in/miguel-ospina-desarrollador-full-stack/)
* [Repositorio del portafolio](https://github.com/migue2509/Portfolio)
* [Repositorio de Tu Cancha](https://github.com/DilsiaLamadridTorres/APP_TuCancha)
* [Demo de Tu Cancha](https://dilsialamadridtorres.github.io/APP_TuCancha/)
* [Hoja de vida](Portfolio/public/documents/miguel-ospina-cv.pdf)

<br>

---

## Autor

**Miguel Ospina**

* GitHub: [@migue2509](https://github.com/migue2509)
* Correo: [miguel.ospina.dev@gmail.com](mailto:miguel.ospina.dev@gmail.com)
