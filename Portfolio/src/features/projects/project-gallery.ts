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
