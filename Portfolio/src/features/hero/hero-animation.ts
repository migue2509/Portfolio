import { gsap } from 'gsap';

const initialized = new WeakMap<HTMLElement, () => void>();

export function initializeHeroAnimation() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero || initialized.has(hero)) return;
  const portrait = hero.querySelector<HTMLElement>('.hero__portrait');
  const role = hero.querySelector<HTMLElement>('.hero__role');
  const title = hero.querySelector<HTMLElement>('.hero__title');
  const description = hero.querySelector<HTMLElement>('.hero__description');
  const actions = hero.querySelector<HTMLElement>('.hero__actions');
  const name = hero.querySelector<HTMLElement>('.hero__name');
  const letters = hero.querySelectorAll<HTMLElement>('.hero__letter');
  if (!portrait || !role || !title || !description || !actions || !name || !letters.length) return;

  const lifecycle = new AbortController();
  const media = gsap.matchMedia();
  let hasEntered = false;

  media.add({
    animate: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
  }, (context) => {
    if (context.conditions?.reduce) { hasEntered = true; return; }

    const events = new AbortController();
    let started = false;
    let titleReady = false;
    let visible = false;
    const targets = [portrait, role, title, description, actions];
    // Solo se oculta cuando el controlador está listo; sin JS todo es visible.
    gsap.set(targets, { opacity: 0, y: 16 });
    gsap.set(letters, { opacity: 0 });

    const typing = gsap.timeline({ paused: true, repeat: -1 })
      .to(letters, { opacity: 1, duration: 0, stagger: 0.18 }, 0)
      .to({}, { duration: 3 })
      .to(letters, { opacity: 0, duration: 0, stagger: { each: 0.12, from: 'end' } })
      .to({}, { duration: 0.65 });

    function syncTyping() {
      const active = titleReady && visible && !document.hidden;
      name!.toggleAttribute('data-typing-active', active);
      if (active) typing.play();
      else typing.pause();
    }

    const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
      .to(portrait, { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to(role, { opacity: 1, y: 0, duration: 0.38 }, 0.04)
      .to(title, { opacity: 1, y: 0, duration: 0.38 }, 0.08)
      .call(() => { titleReady = true; syncTyping(); }, [], 0.46)
      .to(description, { opacity: 1, y: 0, duration: 0.4 }, 0.14)
      .to(actions, { opacity: 1, y: 0, duration: 0.4 }, 0.2)
      .set(targets, { clearProps: 'opacity,transform' });

    function finishEntrance() {
      started = hasEntered = titleReady = true;
      entrance.progress(1, true).pause();
      syncTyping();
    }
    function startEntrance() {
      if (started) return;
      // No animar fuera de pantalla ni interrumpir enlaces a otras secciones.
      const rect = hero!.getBoundingClientRect();
      if (hasEntered || location.hash || rect.bottom <= 0 || rect.top >= innerHeight) {
        finishEntrance();
        return;
      }
      started = hasEntered = true;
      entrance.play(0);
    }

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncTyping();
    }, { threshold: 0.5 });
    visibility.observe(name!);
    document.addEventListener('visibilitychange', syncTyping, { signal: events.signal });

    document.addEventListener('intro:revealing', startEntrance, { signal: events.signal });
    document.addEventListener('intro:finished', startEntrance, { signal: events.signal });
    hero!.addEventListener('focusin', finishEntrance, { signal: events.signal });

    // También cubre el watchdog de la intro si su bundle no llega a ejecutarse.
    const introState = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('intro-pending')) startEntrance();
    });
    introState.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (!document.documentElement.classList.contains('intro-pending')
      || document.querySelector('[data-commit-intro][data-revealing]')) startEntrance();

    return () => {
      events.abort();
      visibility.disconnect();
      introState.disconnect();
      name!.removeAttribute('data-typing-active');
      // matchMedia revierte los tweens y devuelve el texto completo.
    };
  }, hero);

  function dispose() {
    lifecycle.abort();
    media.revert();
    initialized.delete(hero!);
  }
  initialized.set(hero, dispose);
  document.addEventListener('astro:before-swap', dispose, { once: true, signal: lifecycle.signal });
}

export function destroyHeroAnimation() {
  document.querySelectorAll<HTMLElement>('[data-hero]').forEach((hero) => initialized.get(hero)?.());
}
