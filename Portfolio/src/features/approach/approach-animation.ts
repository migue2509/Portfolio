import { gsap } from "gsap";

const initialized = new WeakSet<HTMLElement>();

export function initializeApproach() {
  document.querySelectorAll<HTMLElement>("[data-approach]").forEach((root) => {
    if (initialized.has(root)) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-approach-card]"));
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-approach-button]"));
    const nav = root.querySelector<HTMLElement>("[data-approach-navigation]");
    const status = root.querySelector<HTMLElement>("[data-approach-status]");
    if (!nav || !status || cards.length < 2 || cards.length !== buttons.length) return;
    initialized.add(root);
    root.setAttribute("data-enhanced", "");
    nav.hidden = false;
    const last = cards.length - 1;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const events = new AbortController();
    const position = { value: 0 };
    let active = -1;
    let visible = new Set<number>();
    let raf = 0;
    let announcement = 0;
    let step = 480;
    const context = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 0, scale: 1, transformOrigin: "center top", zIndex: (i: number) => cards.length - i });
    }, root);
    cards.forEach((card) => { card.inert = true; card.setAttribute("aria-hidden", "true"); });

    function render() {
      const value = reduced.matches ? Math.round(position.value) : position.value;
      const front = Math.floor(value);
      const next = new Set<number>();
      for (let i = front; i <= Math.min(last, front + 2); i++) {
        next.add(i);
        const distance = i - value;
        gsap.set(cards[i], {
          y: distance < 0 ? -distance * 30 : -distance * 14,
          scale: distance < 0 ? 1 + distance * 0.04 : 1 - distance * 0.045,
          opacity: distance < 0 ? 1 + distance : 1 - distance * 0.12,
        });
      }
      visible.forEach((i) => { if (!next.has(i)) gsap.set(cards[i], { opacity: 0 }); });
      visible = next;
      const index = Math.round(value);
      if (active === index) return;
      cards.forEach((card, i) => {
        card.inert = i !== index;
        card.setAttribute("aria-hidden", String(i !== index));
        if (i === index) buttons[i].setAttribute("aria-current", "step");
        else buttons[i].removeAttribute("aria-current");
      });
      active = index;
      window.clearTimeout(announcement);
      announcement = window.setTimeout(() => {
        status!.textContent = `Paso ${index + 1} de ${cards.length}: ${cards[index].querySelector("h4")?.textContent ?? ""}`;
      }, 200);
    }

    const smooth = gsap.quickTo(position, "value", { duration: 0.28, ease: "power2.out", onUpdate: render });
    function sync() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      const value = gsap.utils.clamp(0, last, root.scrollTop / step);
      if (reduced.matches) { smooth.tween.pause(); position.value = value; render(); }
      else smooth(value, position.value);
    }
    function select(index: number) {
      root.scrollTo({ top: index * step, behavior: "instant" });
      sync();
    }
    function measure() {
      const value = root.scrollTop / step;
      step = Math.max(1, (root.scrollHeight - root.clientHeight) / last);
      root.scrollTop = value * step;
      sync();
    }
    measure();
    render();
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    root.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true, signal: events.signal });
    buttons.forEach((button, index) => button.addEventListener("click", () => select(index), { signal: events.signal }));
    root.addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const destinations: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: last };
      const index = destinations[event.key];
      if (index === undefined || index < 0 || index > last) return;
      event.preventDefault();
      if (event.target instanceof HTMLButtonElement) buttons[index].focus({ preventScroll: true });
      select(index);
    }, { signal: events.signal });
    reduced.addEventListener("change", sync, { signal: events.signal });
    document.addEventListener("astro:before-swap", () => {
      events.abort(); resize.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(announcement);
      smooth.tween.kill(); context.revert();
      cards.forEach((card) => { card.inert = false; card.removeAttribute("aria-hidden"); });
      buttons.forEach((button) => button.removeAttribute("aria-current"));
      nav.hidden = true; status.textContent = ""; root.removeAttribute("data-enhanced");
      initialized.delete(root);
    }, { once: true, signal: events.signal });
  });
}
