import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const initialized = new WeakSet<HTMLElement>();

export function initializeProjectGalleries() {
  const galleries = document.querySelectorAll<HTMLElement>(
    "[data-project-gallery]",
  );

  galleries.forEach((gallery) => {
    if (initialized.has(gallery)) return;

    const items = Array.from(
      gallery.querySelectorAll<HTMLElement>("[data-gallery-item]"),
    );

    const navigation = gallery.querySelector<HTMLElement>(
      "[data-gallery-navigation]",
    );

    const buttons = Array.from(
      gallery.querySelectorAll<HTMLButtonElement>(
        "[data-gallery-button]",
      ),
    );

    const previews = Array.from(
      gallery.querySelectorAll<HTMLElement>(".project-card__preview"),
    );

    const headings = Array.from(
      gallery.querySelectorAll<HTMLElement>(".project-card__heading"),
    );

    // Con un proyecto se conserva la presentación estática.
    if (
      !navigation ||
      items.length < 2 ||
      previews.length !== items.length ||
      headings.length !== items.length ||
      buttons.length !== items.length
    ) {
      return;
    }

    initialized.add(gallery);

    const media = gsap.matchMedia();

    media.add(
      {
        always: "all",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const reducedMotion = Boolean(
          context.conditions?.reduceMotion,
        );

        const lastIndex = items.length - 1;

        let activeIndex = -1;
        let visibleIndices = new Set<number>();

        gallery.setAttribute("data-enhanced", "");
        navigation.hidden = false;

        gsap.set(items, {
          zIndex: (index: number) => items.length - index,
        });

        gsap.set(previews, {
          y: 0,
          scale: 1,
          autoAlpha: 0,
          transformOrigin: "center top",
        });

        gsap.set(headings, { autoAlpha: 0 });

        function updateActive(index: number) {
          if (index === activeIndex) return;

          if (activeIndex >= 0) {
            gsap.set(headings[activeIndex], {
              autoAlpha: 0,
            });
          }

          gsap.set(headings[index], {
            autoAlpha: 1,
          });

          items.forEach((item, itemIndex) => {
            const active = itemIndex === index;

            item.inert = !active;
            item.setAttribute("aria-hidden", String(!active));

            if (active) {
              buttons[itemIndex].setAttribute(
                "aria-current",
                "true",
              );
            } else {
              buttons[itemIndex].removeAttribute("aria-current");
            }
          });

          activeIndex = index;
        }

        function render(progress: number) {
          const rawPosition = gsap.utils.clamp(
            0,
            lastIndex,
            progress * lastIndex,
          );

          // Con movimiento reducido, la tarjeta cambia directamente.
          const position = reducedMotion
            ? Math.round(rawPosition)
            : rawPosition;

          const frontIndex = Math.floor(position);
          const fraction = position - frontIndex;

          const nextVisible = new Set<number>();
          const limit = Math.min(frontIndex + 4, lastIndex);

          // Solo actualizamos las tarjetas cercanas al frente.
          for (let index = frontIndex; index <= limit; index++) {
            nextVisible.add(index);

            if (index === frontIndex) {
              gsap.set(previews[index], {
                y: fraction * 80,
                scale: 1 - fraction * 0.04,
                autoAlpha: 1 - fraction,
              });
            } else {
              const distance = index - position;
              const depth = Math.min(distance, 3);

              gsap.set(previews[index], {
                y: -depth * 12,
                scale: 1 - depth * 0.04,
                autoAlpha: gsap.utils.clamp(
                  0,
                  1,
                  4 - distance,
                ),
              });
            }
          }

          visibleIndices.forEach((index) => {
            if (!nextVisible.has(index)) {
              gsap.set(previews[index], {
                autoAlpha: 0,
              });
            }
          });

          visibleIndices = nextVisible;
          updateActive(Math.round(position));
        }

        render(0);

        // Observamos el scroll interior de la galería.
        // No fijamos la sección ni añadimos espacio a la página.
        const trigger = ScrollTrigger.create({
          scroller: gallery,
          trigger: gallery,
          start: 0,
          end: () =>
            Math.max(
              1,
              gallery.scrollHeight - gallery.clientHeight,
            ),
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => render(self.progress),
        });

        const removeListeners = buttons.map((button, index) => {
          const handleClick = () => {
            const progress = index / lastIndex;

            const position =
              trigger.start +
              (trigger.end - trigger.start) * progress;

            gallery.scrollTo({
              top: position,
              behavior: "instant",
            });
          };

          button.addEventListener("click", handleClick);

          return () => {
            button.removeEventListener("click", handleClick);
          };
        });

        // Limpieza cuando cambia la preferencia de movimiento.
        // GSAP revierte sus estilos y elimina el ScrollTrigger.
        return () => {
          removeListeners.forEach((remove) => remove());

          items.forEach((item) => {
            item.inert = false;
            item.removeAttribute("aria-hidden");
          });

          buttons.forEach((button) => {
            button.removeAttribute("aria-current");
          });

          navigation.hidden = true;
          gallery.removeAttribute("data-enhanced");
        };
      },
    );
  });
}