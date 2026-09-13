# Galería de proyectos: archivos completos

Los cambios ya están aplicados en el workspace. Los dos bloques siguientes contienen los archivos completos para reemplazarlos.

Se reutilizan ProjectCard.astro (portada optimizada, enlace, hover y acción táctil), Projects.astro (fondo, cuadrícula y pie de GitHub), el catálogo y las páginas de detalle. No se modificaron otras secciones en esta tarea.

## Decisiones

- La altura exterior se reserva incluso sin JavaScript. El recorrido adicional pertenece al contenedor con overflow, no al documento.
- El scroll es nativo, sin pin ni captura de wheel/touch. En los extremos se permite encadenar el desplazamiento a la página; el gesto concreto depende del navegador.
- Cada transición tiene al menos 52rem de recorrido o 110svh, lo que sea mayor. Para cambiar la sensibilidad, ajusta --gallery-step.
- GSAP anima el contenedor de la portada; el hover existente anima la imagen interior. Así no comparten transform.
- La posición visual, el título y el indicador derivan del mismo progreso. Se actualizan como máximo cuatro portadas cercanas y las que dejan de verse.
- Flechas, PageUp/PageDown, Home/End y botones permiten elegir proyectos. Las tarjetas inactivas son inert y quedan fuera del árbol accesible.
- Con movimiento reducido, la selección cambia directamente y conserva la profundidad estática.
- AbortController, ResizeObserver y la limpieza en astro:before-swap evitan conservar listeners al cambiar de página.
- El suavizado reutiliza el tween de [gsap.quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo()/). Los estilos iniciales se restauran con [gsap.context](https://gsap.com/docs/v3/GSAP/gsap.context()/).

## Comprobaciones ejecutadas

- npm run build: correcto; página principal y dos páginas de detalle generadas.
- TypeScript estricto sobre src/features/projects/project-gallery.ts: correcto.
- 36 comprobaciones en Happy DOM, con geometría simulada: 0, 1, 2 y 8 tarjetas, selección por botones, scroll adelante/atrás, Home, salida de teclado en el extremo superior, movimiento reducido, foco al ocultar tarjetas, links de detalle existentes y eliminación de listeners. El caso de 8 tarjetas repite nodos reales solo en memoria; no modifica el catálogo.
- git diff --check: sin errores de espacios.

No había un navegador conectado. Las pruebas DOM no verifican layout real, fluidez, hover, gestos táctiles ni scroll chaining. No se añadieron dependencias al package.json del proyecto.

## Comprobaciones manuales pendientes

1. Ejecuta npm run dev y abre la página local a 1440px y 390px; comprueba que la portada cabe completa y las siguientes asoman sin tapar el título.
2. Desplaza dentro de la galería en ambos sentidos. Sobre mí debe mantener su posición en el documento; en los extremos debes poder continuar desplazando la página.
3. Prueba rueda, trackpad y un móvil real; un gesto pequeño no debería saltar varios proyectos. Ajusta --gallery-step si necesitas otro ritmo.
4. Pulsa los indicadores y usa Tab, flechas, Inicio y Fin. Comprueba el foco visible y que Abrir proyecto lleva al detalle correcto.
5. En móvil, comprueba que Abrir proyecto permanece visible. En escritorio, verifica el zoom sutil y la aparición de la acción en hover y foco.
6. Activa y desactiva reducir movimiento durante la navegación. La selección debe seguir funcionando, sin interpolación del desplazamiento.
7. Desactiva JavaScript y recarga: las portadas deben seguir accesibles como lista dentro de la misma altura exterior.

## Commit sugerido

```text
feat(proyectos): rediseñar galería con tarjetas apiladas y navegación accesible
```

## src/features/projects/ProjectGallery.astro

```astro
---
import ProjectCard from "./ProjectCard.astro";
import type { Project } from "./model/project";

interface Props {
  projects: readonly Project[];
}

const { projects } = Astro.props;
---

<div
  class="project-gallery"
  data-project-gallery
  role="region"
  aria-label="Galería de proyectos. Usa las flechas arriba y abajo para cambiar de proyecto."
  tabindex={projects.length > 1 ? 0 : undefined}
  style={`--project-steps: ${Math.max(projects.length - 1, 0)}`}
>
  <div class="project-gallery__stage">
    <div class="project-gallery__cards">
      {projects.map((project) => (
        <div class="project-gallery__item" data-gallery-item>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>

    <nav
      class="project-gallery__navigation"
      aria-label="Seleccionar proyecto"
      hidden
      data-gallery-navigation
    >
      {projects.map((project, index) => (
        <button
          type="button"
          class="project-gallery__button"
          aria-label={`Ver ${project.title}, proyecto ${index + 1} de ${projects.length}`}
          data-gallery-button
        >
          <span aria-hidden="true"></span>
        </button>
      ))}
    </nav>

    <p class="project-gallery__hint" aria-hidden="true">
      Desliza o usa ↑ ↓ para explorar
    </p>
    <p class="project-gallery__status" role="status" aria-atomic="true" data-gallery-status></p>
  </div>
  <div class="project-gallery__scroll-space" aria-hidden="true"></div>
</div>

<script>
  import { initializeProjectGalleries } from "./project-gallery";

  initializeProjectGalleries();
  document.addEventListener("astro:page-load", initializeProjectGalleries);
</script>

<style>
  .project-gallery {
    --gallery-height: clamp(24rem, 68svh, 42rem);
    --gallery-step: max(52rem, 110svh);
    position: relative;
    height: var(--gallery-height);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: auto;
    overflow-anchor: none;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  .project-gallery:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: -4px;
  }

  .project-gallery__stage {
    position: relative;
    display: grid;
    align-content: center;
    min-height: var(--gallery-height);
    padding: 3.5rem clamp(2.75rem, 5vw, 4rem) 4rem;
  }

  .project-gallery__cards {
    display: grid;
    gap: var(--space-12);
    isolation: isolate;
    min-width: 0;
  }

  .project-gallery__item {
    min-width: 0;
  }

  .project-gallery :global(.project-card__heading) {
    display: grid;
    place-items: center;
    min-height: 4.5rem;
    margin-bottom: 3rem;
    padding-inline: 0;
  }

  .project-gallery :global(.project-card__preview) {
    width: min(100%, max(10rem, calc((var(--gallery-height) - 15rem) * 2)));
    margin-inline: auto;
    box-shadow: 0 16px 36px rgb(0 0 0 / 28%);
  }

  .project-gallery__scroll-space,
  .project-gallery__navigation[hidden],
  .project-gallery__hint {
    display: none;
  }

  .project-gallery[data-enhanced] .project-gallery__stage {
    position: sticky;
    top: 0;
    height: var(--gallery-height);
  }

  .project-gallery[data-enhanced] .project-gallery__cards {
    gap: 0;
  }

  .project-gallery[data-enhanced] .project-gallery__item {
    grid-area: 1 / 1;
  }

  .project-gallery[data-enhanced] .project-gallery__scroll-space {
    display: block;
    height: calc(var(--project-steps) * var(--gallery-step));
  }

  .project-gallery__navigation {
    position: absolute;
    top: 50%;
    right: 0.125rem;
    z-index: 2;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    max-height: min(18rem, 70%);
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .project-gallery__button {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }

  .project-gallery__button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: -5px;
  }

  .project-gallery__button span {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--color-text-muted);
  }

  .project-gallery__button[aria-current="true"] span {
    background: var(--color-accent);
    transform: scale(1.4);
    box-shadow: 0 0 0 4px rgb(147 197 253 / 12%);
  }

  .project-gallery[data-enhanced] .project-gallery__hint {
    display: block;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    margin: 0;
    color: var(--color-text-muted);
    font: 0.75rem var(--font-mono);
    text-align: center;
    pointer-events: none;
  }

  .project-gallery__status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
```

## src/features/projects/project-gallery.ts

```typescript
import { gsap } from "gsap";

const initialized = new WeakSet<HTMLElement>();

export function initializeProjectGalleries() {
  document.querySelectorAll<HTMLElement>("[data-project-gallery]").forEach((gallery) => {
    if (initialized.has(gallery)) return;

    const items = Array.from(gallery.querySelectorAll<HTMLElement>("[data-gallery-item]"));
    const previews = Array.from(gallery.querySelectorAll<HTMLElement>(".project-card__preview"));
    const headings = Array.from(gallery.querySelectorAll<HTMLElement>(".project-card__heading"));
    const buttons = Array.from(gallery.querySelectorAll<HTMLButtonElement>("[data-gallery-button]"));
    const navigation = gallery.querySelector<HTMLElement>("[data-gallery-navigation]");
    const status = gallery.querySelector<HTMLElement>("[data-gallery-status]");
    const spacer = gallery.querySelector<HTMLElement>(".project-gallery__scroll-space");

    if (!navigation || !status || !spacer || items.length < 2 ||
        previews.length !== items.length || headings.length !== items.length ||
        buttons.length !== items.length) return;

    initialized.add(gallery);
    const lastIndex = items.length - 1;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const titles = headings.map((heading) => heading.textContent?.trim() ?? "");
    let activeIndex = -1;
    let visible = new Set<number>();
    let step = 1;
    let railHeight = 0;
    let buttonHeight = 44;
    let frame = 0;
    let announceTimer = 0;
    let disposed = false;
    const playhead = { position: 0 };

    gallery.setAttribute("data-enhanced", "");
    navigation.hidden = false;
    // Guardamos los estilos iniciales para restaurarlos al salir de la página.
    const context = gsap.context(() => {
      gsap.set(items, { zIndex: (index: number) => items.length - index });
      gsap.set(previews, { autoAlpha: 0, y: 0, scale: 1, transformOrigin: "center top" });
      gsap.set(headings, { autoAlpha: 0, y: 0 });
    }, gallery);
    items.forEach((item) => {
      item.inert = true;
      item.setAttribute("aria-hidden", "true");
    });

    function updateActive(index: number) {
      if (index === activeIndex) return;
      if (activeIndex >= 0) {
        // El foco no debe quedarse dentro de una tarjeta inactiva.
        if (items[activeIndex].contains(document.activeElement)) {
          gallery.focus({ preventScroll: true });
        }
        items[activeIndex].inert = true;
        items[activeIndex].setAttribute("aria-hidden", "true");
        buttons[activeIndex].removeAttribute("aria-current");
      }
      items[index].inert = false;
      items[index].removeAttribute("aria-hidden");
      buttons[index].setAttribute("aria-current", "true");
      navigation!.scrollTop = Math.max(0, (index + 0.5) * buttonHeight - railHeight / 2);
      activeIndex = index;
      window.clearTimeout(announceTimer);
      announceTimer = window.setTimeout(() => {
        status!.textContent = `${titles[index]}. Proyecto ${index + 1} de ${items.length}.`;
      }, 180);
    }

    function render() {
      const raw = gsap.utils.clamp(0, lastIndex, playhead.position);
      // Una pausa visual al inicio y al final permite apreciar cada portada.
      const fraction = gsap.utils.clamp(0, 1, (raw % 1 - 0.15) / 0.7);
      const eased = fraction * fraction * (3 - 2 * fraction);
      const position = motion.matches ? Math.round(raw) : Math.floor(raw) + eased;
      const front = Math.floor(position);
      const nextVisible = new Set<number>();

      for (let index = front; index <= Math.min(lastIndex, front + 3); index++) {
        nextVisible.add(index);
        const distance = index - position;
        const exiting = distance < 0;
        const depth = Math.max(0, distance);
        gsap.set(previews[index], {
          y: exiting ? -distance * 48 : -depth * 16,
          scale: exiting ? 1 + distance * 0.065 : 1 - depth * 0.045,
          autoAlpha: exiting ? 1 + distance : Math.min(1, 4 - depth),
        });
        const titleOpacity = Math.max(0, 1 - Math.abs(distance) * 2);
        gsap.set(headings[index], {
          autoAlpha: titleOpacity,
          y: motion.matches ? 0 : gsap.utils.clamp(-8, 8, distance * 12),
        });
      }
      visible.forEach((index) => {
        if (!nextVisible.has(index)) {
          gsap.set(previews[index], { autoAlpha: 0 });
          gsap.set(headings[index], { autoAlpha: 0 });
        }
      });
      visible = nextVisible;
      updateActive(Math.round(position));
    }

    // Reutilizamos un tween: el scroll no crea una animación nueva por evento.
    const smoothPosition = gsap.quickTo(playhead, "position", {
      duration: 0.24,
      ease: "power2.out",
      onUpdate: render,
    });

    function syncScroll() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      const position = gsap.utils.clamp(0, lastIndex, gallery.scrollTop / step);
      if (motion.matches) {
        smoothPosition.tween.pause();
        playhead.position = position;
        render();
      } else {
        smoothPosition(position, playhead.position);
      }
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(syncScroll);
    }

    function select(index: number) {
      gallery.scrollTo({ top: gsap.utils.clamp(0, lastIndex, index) * step, behavior: "instant" });
      syncScroll();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable]")) return;
      const destination: Record<string, number> = {
        ArrowDown: activeIndex + 1, ArrowRight: activeIndex + 1,
        ArrowUp: activeIndex - 1, ArrowLeft: activeIndex - 1,
        PageDown: activeIndex + 1, PageUp: activeIndex - 1,
        Home: 0, End: lastIndex,
      };
      const index = destination[event.key];
      if (index === undefined || index < 0 || index > lastIndex) return;
      event.preventDefault();
      if (target instanceof HTMLButtonElement && buttons.includes(target)) {
        buttons[index].focus({ preventScroll: true });
      }
      select(index);
    }

    // Medimos el layout al iniciar o redimensionar, nunca en cada frame.
    function measure() {
      const position = gallery.scrollTop / step;
      step = Math.max(1, (gallery.scrollHeight - gallery.clientHeight) / lastIndex);
      railHeight = navigation!.clientHeight;
      buttonHeight = buttons[0].offsetHeight || 44;
      gallery.scrollTop = gsap.utils.clamp(0, lastIndex, position) * step;
      syncScroll();
    }
    measure();
    render();
    const resize = new ResizeObserver(measure);
    resize.observe(spacer);
    gallery.addEventListener("scroll", onScroll, { passive: true, signal: events.signal });
    gallery.addEventListener("keydown", onKeyDown, { signal: events.signal });
    motion.addEventListener("change", syncScroll, { signal: events.signal });
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => select(index), { signal: events.signal });
    });

    function dispose() {
      if (disposed) return;
      disposed = true;
      events.abort();
      resize.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(announceTimer);
      smoothPosition.tween.kill();
      context.revert();
      items.forEach((item) => {
        item.inert = false;
        item.removeAttribute("aria-hidden");
      });
      buttons.forEach((button) => button.removeAttribute("aria-current"));
      navigation!.hidden = true;
      status!.textContent = "";
      gallery.removeAttribute("data-enhanced");
      initialized.delete(gallery);
    }
    document.addEventListener("astro:before-swap", dispose, { once: true, signal: events.signal });
  });
}
```
