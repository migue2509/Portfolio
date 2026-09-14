# Introducción de commits
Archivos completos de la implementación. La secuencia GSAP dura 2,6 segundos; los temporizadores adicionales solo sirven como salida de seguridad si falla la carga. El diálogo nativo mantiene el foco dentro de la intro. El Hero se renderiza desde el inicio y conserva su imagen prioritaria.

## Verificación manual
1. Primera visita: ejecuta sessionStorage.removeItem("portfolio:intro-seen") en la consola y recarga. Debe aparecer HEY!!, el estado de éxito y después el Hero.
2. Recarga: no debe repetirse la intro en esa pestaña.
3. Omisión: reinicia la clave y prueba el botón, Escape y Enter. Tab y Shift+Tab deben permanecer en el diálogo mientras está abierto; al cerrar debe funcionar la navegación y el scroll.
4. Móvil: prueba anchos de 320, 375 y 768 px, también orientación horizontal. La cuadrícula debe entrar sin scroll horizontal. Sus celdas serán más pequeñas en pantallas estrechas.
5. Movimiento reducido: emula prefers-reduced-motion: reduce, elimina la clave y recarga. El portafolio debe aparecer directamente. Activarlo durante la intro también debe cerrarla.
6. Fallos: desactiva JavaScript y recarga; el contenido debe ser accesible. Bloquea el bundle de la intro: el botón y Escape deben seguir funcionando y el diálogo debe cerrarse automáticamente. Si sessionStorage está bloqueado, no se muestra la intro.
7. Fluidez: graba una primera visita con Performance y CPU ralentizada; revisa frames, lectura de HEY!! y transición al Hero. No se han medido FPS ni realizado pruebas visuales en un navegador en esta entrega.

Comprobaciones realizadas: npm run build y TypeScript estricto para intro.ts y pattern.ts, ambos correctos.

## src/features/intro/CommitIntro.astro

```astro
---
import { cells } from './pattern';
---

<dialog class="commit-intro" data-commit-intro aria-label="Introducción: HEY!!">
  <div class="commit-intro__composition" data-intro-composition>
    <p class="commit-intro__status" role="status" aria-live="polite" data-intro-status>Committing...</p>
    <div class="commit-intro__grid" aria-hidden="true">
      {cells.map(({ lit, column, row, tone }) => (
        <span class="commit-intro__cell">
          {lit && <span data-intro-pixel data-column={column} data-row={row} class={`commit-intro__pixel commit-intro__pixel--${tone}`} />}
        </span>
      ))}
    </div>
  </div>
  <button class="commit-intro__skip" type="button" data-intro-skip autofocus>Omitir introducción</button>
</dialog>

<!-- Arranca sin esperar al bundle; Escape y el botón funcionan aunque GSAP falle. -->
<script is:inline>
  (() => {
    const root = document.documentElement;
    const dialog = document.querySelector('[data-commit-intro]');
    if (!dialog) return;
    if (!root.classList.contains('intro-pending')) { dialog.remove(); return; }
    const previousFocus = document.activeElement;
    const events = new AbortController();
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      events.abort();
      root.classList.remove('intro-pending');
      if (dialog.open) dialog.close();
      dialog.dispatchEvent(new Event('intro:finished'));
      dialog.remove();
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
    dialog.addEventListener('intro:finish', finish, { signal: events.signal });
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(); }, { signal: events.signal });
    dialog.querySelector('[data-intro-skip]').addEventListener('click', finish, { signal: events.signal });
    document.addEventListener('astro:before-swap', finish, { signal: events.signal });
    motion.addEventListener('change', finish, { signal: events.signal });
    try {
      dialog.showModal();
      timer = setTimeout(finish, 3500);
    } catch { finish(); }
  })();
</script>

<script>
  import { initializeIntro } from './intro';
  initializeIntro();
</script>

<style>
  .commit-intro {
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: 1rem;
    border: 0;
    background: #000;
    color: #f0f6fc;
    font-family: var(--font-mono);
  }
  .commit-intro[open] { display: grid; place-content: center; }
  .commit-intro::backdrop { background: transparent; }
  .commit-intro__composition { width: min(56rem, calc(100vw - 2rem)); }
  .commit-intro__status { margin: 0 0 1.5rem; text-align: center; font-size: clamp(.875rem, 3vw, 1rem); }
  .commit-intro__grid { display: grid; grid-template-columns: repeat(50, minmax(0, 1fr)); gap: clamp(1px, .35vw, 4px); }
  .commit-intro__cell { position: relative; aspect-ratio: 1; border-radius: 2px; background: #101913; overflow: hidden; }
  .commit-intro__pixel { position: absolute; inset: 0; background: #39d353; opacity: 0; }
  .commit-intro__pixel--1 { background: #2fbb4e; }
  .commit-intro__pixel--2 { background: #4ae168; }
  .commit-intro__skip {
    position: absolute;
    bottom: max(2rem, env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    min-height: 44px;
    padding: .5rem 1rem;
    border: 1px solid #536459;
    border-radius: .375rem;
    background: #101913;
    color: #f0f6fc;
    white-space: nowrap;
    cursor: pointer;
  }
  .commit-intro__skip:focus-visible { outline: 2px solid #39d353; outline-offset: 4px; }
</style>

```

## src/features/intro/pattern.ts

```typescript
export const COLUMNS = 50;
export const ROWS = 7;

const letters = [
  ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  ['1', '1', '1', '1', '1', '0', '1'],
  ['1', '1', '1', '1', '1', '0', '1'],
];
const messageWidth = letters.reduce((width, letter) => width + letter[0].length, 0)
  + (letters.length - 1) * 2;
const offset = Math.floor((COLUMNS - messageWidth) / 2);

export const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;
  let cursor = offset;
  let lit = false;
  for (const letter of letters) {
    if (letter[row][column - cursor] === '1') lit = true;
    cursor += letter[0].length + 2;
  }
  return { lit, column, row, tone: (column + row) % 3 };
});

```

## src/features/intro/intro.ts

```typescript
import { gsap } from 'gsap';

export function initializeIntro() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-commit-intro]');
  if (!dialog?.open || dialog.dataset.initialized) return;
  dialog.dataset.initialized = 'true';
  const finish = () => dialog.dispatchEvent(new Event('intro:finish'));
  const pixels = Array.from(dialog.querySelectorAll<HTMLElement>('[data-intro-pixel]'))
    .sort((a, b) => Number(a.dataset.column) - Number(b.dataset.column)
      || Number(a.dataset.row) - Number(b.dataset.row));
  const composition = dialog.querySelector<HTMLElement>('[data-intro-composition]');
  const status = dialog.querySelector<HTMLElement>('[data-intro-status]');
  if (!composition || !status || !pixels.length) { finish(); return; }

  const timeline = gsap.timeline({ onComplete: finish });
  dialog.addEventListener('intro:finished', () => timeline.kill(), { once: true });
  timeline
    .to(pixels, { opacity: 1, duration: 0.12, stagger: { amount: 1.12 }, ease: 'none' }, 0.15)
    .call(() => { status.textContent = 'Commit successful ✓'; }, [], 1.4)
    .to(composition, { scale: 1.035, opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.05)
    .to(dialog, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 2.4);
}

```

## src/layouts/MainLayout.astro

```astro
---
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import Header from "../shared/layout/Header.astro";
import CommitIntro from "../features/intro/CommitIntro.astro";
import "../shared/styles/global.css";

interface Props {
  title: string;
  description: string;
  intro?: boolean;
}

const { title, description, intro = false } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    {intro && <script is:inline>
      (() => {
        try {
          if (matchMedia('(prefers-reduced-motion: reduce)').matches || sessionStorage.getItem('portfolio:intro-seen')) return;
          sessionStorage.setItem('portfolio:intro-seen', '1');
          document.documentElement.classList.add('intro-pending');
          setTimeout(() => document.documentElement.classList.remove('intro-pending'), 4000);
        } catch { /* Si el almacenamiento está bloqueado, mostramos el sitio directamente. */ }
      })();
    </script>}
    <style is:global>
      html.intro-pending { overflow: hidden; }
      html.intro-pending::before { content: ''; position: fixed; inset: 0; z-index: 9999; background: #000; pointer-events: none; }
      html.intro-pending:has(dialog[open])::before { display: none; }
    </style>
  </head>

 <body class="site-body">
  {intro && <CommitIntro />}
  <Header />
  <slot />
</body>
</html>

<style>
  .site-body {
    --page-gutter: 0px;
    padding-inline: var(--page-gutter);
  }

  @media (min-width: 64rem) {
    .site-body {
      --page-gutter: 3.5rem;
    }
  }
</style>

```

## src/pages/index.astro

```astro
---
import MainLayout from "../layouts/MainLayout.astro";
import Hero from "../sections/Hero.astro";
import Projects from "../sections/Projects.astro";
import About from "../sections/About.astro";
import Experience from "../sections/Experience.astro";
import WhyMe from "../sections/WhyMe.astro";
import Contact from "../sections/Contact.astro";
---

<MainLayout
  intro
  title="Miguel Ospina | Desarrollador Full Stack"
  description="Portafolio de Miguel Ospina: proyectos, experiencia y desarrollo de aplicaciones con Java, Spring Boot y tecnologías web."
>
  <main id="inicio" tabindex="-1">
    <Hero />
    <Projects />
    <About />
    <Experience />
    <WhyMe />
    <Contact />
  </main>
</MainLayout>

```
