import { gsap } from 'gsap';

const initialized = new WeakSet<HTMLElement>();

export function initializeTestimonials() {
  document.querySelectorAll<HTMLElement>('[data-testimonials]').forEach((root) => {
    if (initialized.has(root)) return;
    const stage = root.querySelector<HTMLElement>('[data-testimonial-stage]');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-testimonial-card]'));
    const controls = root.querySelector<HTMLElement>('[data-testimonial-controls]');
    const status = root.querySelector<HTMLElement>('[data-testimonial-status]');
    if (!stage || !controls || !status || cards.length < 2) return;
    initialized.add(root);
    const events = new AbortController();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let active = 0;
    let spacing = 240;
    let startX = 0;
    let startY = 0;
    let pointer: number | null = null;
    let animation: gsap.core.Tween | undefined;
    root.setAttribute('data-enhanced', '');
    controls.hidden = false;

    function render(animate = true) {
      animation?.kill();
      cards.forEach((card, index) => {
        card.inert = index !== active;
        card.setAttribute('aria-hidden', String(index !== active));
      });
      const distance = (index: number) => index - active;
      animation = gsap.to(cards, {
        xPercent: -50, yPercent: -50,
        x: (index: number) => distance(index) * spacing,
        y: (index: number) => reduced.matches || index === active ? 0 : index % 2 ? 15 : -15,
        rotation: (index: number) => reduced.matches || index === active ? 0 : index % 2 ? 2.5 : -2.5,
        scale: (index: number) => index === active ? 1 : .94,
        opacity: (index: number) => Math.abs(distance(index)) > 2 ? 0 : index === active ? 1 : .55,
        zIndex: (index: number) => cards.length - Math.abs(distance(index)),
        duration: animate && !reduced.matches ? .5 : 0,
        ease: 'power3.out',
      });
      status!.textContent = `${active + 1} / ${cards.length}`;
    }
    function select(index: number) { active = (index + cards.length) % cards.length; render(); }
    function measure() {
      // Todas las lecturas se agrupan; no medimos durante la animación.
      const width = cards[0].offsetWidth;
      const height = Math.max(...cards.map((card) => card.offsetHeight));
      spacing = width * .72;
      stage!.style.setProperty('--testimonial-height', `${height + 80}px`);
      render(false);
    }
    root.querySelector('[data-testimonial-prev]')?.addEventListener('click', () => select(active - 1), { signal: events.signal });
    root.querySelector('[data-testimonial-next]')?.addEventListener('click', () => select(active + 1), { signal: events.signal });
    root.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const destinations: Record<string, number> = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: cards.length - 1 };
      if (!(event.key in destinations)) return;
      event.preventDefault(); select(destinations[event.key]);
    }, { signal: events.signal });
    stage.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.pointerType === 'mouse') return;
      pointer = event.pointerId; startX = event.clientX; startY = event.clientY;
    }, { signal: events.signal });
    stage.addEventListener('pointerup', (event) => {
      if (pointer !== event.pointerId) return;
      pointer = null;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(event.clientY - startY)) select(active + (delta < 0 ? 1 : -1));
    }, { signal: events.signal });
    stage.addEventListener('pointercancel', () => { pointer = null; }, { signal: events.signal });
    reduced.addEventListener('change', () => render(false), { signal: events.signal });
    const resize = new ResizeObserver(measure);
    cards.forEach((card) => resize.observe(card));
    measure();
    document.addEventListener('astro:before-swap', () => {
      events.abort(); resize.disconnect(); animation?.kill();
      cards.forEach((card) => { card.inert = false; card.removeAttribute('aria-hidden'); card.removeAttribute('style'); });
      stage.style.removeProperty('--testimonial-height');
      root.removeAttribute('data-enhanced'); controls.hidden = true;
      initialized.delete(root);
    }, { once: true, signal: events.signal });
  });
}
