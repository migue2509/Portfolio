import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | undefined;
let cleanup: (() => void) | undefined;

export function initializeSmoothScroll() {
  if (typeof window === 'undefined' || cleanup) return;

  const events = new AbortController();
  const root = document.documentElement;
  const header = document.querySelector<HTMLElement>('[data-header]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let destination: HTMLElement | undefined;
  let focusOrigin: Element | null = null;
  const temporaryFocus = new Set<HTMLElement>();

  function measureHeader() {
    const style = header && getComputedStyle(header);
    const pinned = style?.position === 'sticky' || style?.position === 'fixed';
    const offset = header && pinned
      ? header.getBoundingClientRect().height + (parseFloat(style!.top) || 0) + 16
      : 0;
    root.style.setProperty('--anchor-offset', `${Math.ceil(offset)}px`);
  }
  measureHeader();
  const sizeObserver = new ResizeObserver(measureHeader);
  if (header) sizeObserver.observe(header);
  window.addEventListener('resize', measureHeader, { signal: events.signal });

  function focusDestination() {
    const target = destination;
    destination = undefined;
    // No quitar el foco a quien ya pulsó Tab o seleccionó otro control.
    if (!target?.isConnected || document.activeElement !== focusOrigin) return;
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      temporaryFocus.add(target);
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
        temporaryFocus.delete(target);
      }, { once: true, signal: events.signal });
    }
    target.focus({ preventScroll: true });
  }

  // GSAP ya tiene un ticker: no creamos un segundo requestAnimationFrame.
  const tick = (seconds: number) => instance?.raf(seconds * 1000);
  function destroyInstance() {
    gsap.ticker.remove(tick);
    instance?.destroy();
    instance = undefined;
    destination = undefined;
  }
  function syncIntro() {
    if (!instance) return;
    const blocked = root.classList.contains('intro-pending');
    if (blocked && !instance.isStopped) instance.stop();
    else if (!blocked && instance.isStopped) instance.start();
  }
  function configure() {
    const pending = destination;
    destroyInstance();
    if (motion.matches) {
      if (pending?.isConnected) {
        pending.scrollIntoView({ behavior: 'instant', block: 'start' });
        destination = pending;
        focusDestination();
      }
      return;
    }
    instance = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.1,
      syncTouch: false,
      // Conserva el scroll nativo interno y cede a la página en sus extremos.
      allowNestedScroll: true,
      anchors: { onComplete: focusDestination },
    });
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    syncIntro();
  }

  // Antes del listener de anchors de Lenis (window): cerrar menú y evitar
  // el salto nativo. Lenis obtiene la compensación desde scroll-margin-top.
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.host !== location.host || url.pathname !== location.pathname || !url.hash) return;
    if (url.origin !== location.origin || url.search !== location.search || event.defaultPrevented
      || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || link.hasAttribute('download') || (link.target && link.target !== '_self')) {
      // Evitar que anchors intercepte navegación nativa o eventos cancelados.
      if (instance) event.stopPropagation();
      return;
    }
    let target: HTMLElement | null;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); }
    catch { if (instance) event.stopPropagation(); return; }
    if (!target) { if (instance) event.stopPropagation(); return; }

    document.dispatchEvent(new Event('navigation:close-menu'));
    measureHeader();
    if (root.classList.contains('intro-pending')) {
      event.preventDefault();
      if (instance) event.stopPropagation();
      return;
    }
    event.preventDefault();
    destination = target;
    focusOrigin = document.activeElement;
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    if (!instance) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      focusDestination();
    }
  }, { signal: events.signal });

  function restoreHistory() {
    destination = undefined;
    // Detener el destino anterior para no sobrescribir Atrás/Adelante.
    if (instance) { instance.stop(); instance.start(); syncIntro(); }
    if (!location.hash || root.classList.contains('intro-pending')) return;
    let target: HTMLElement | null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch { return; }
    if (!target) return;
    if (instance) instance.scrollTo(target, { immediate: true });
    else target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  window.addEventListener('popstate', restoreHistory, { signal: events.signal });
  window.addEventListener('hashchange', restoreHistory, { signal: events.signal });

  configure();
  motion.addEventListener('change', configure, { signal: events.signal });
  const introObserver = new MutationObserver(syncIntro);
  introObserver.observe(root, { attributes: true, attributeFilter: ['class'] });

  cleanup = () => {
    events.abort();
    sizeObserver.disconnect();
    introObserver.disconnect();
    destroyInstance();
    temporaryFocus.forEach((target) => target.removeAttribute('tabindex'));
    temporaryFocus.clear();
    root.style.removeProperty('--anchor-offset');
    cleanup = undefined;
  };
}

export function destroySmoothScroll() { cleanup?.(); }
