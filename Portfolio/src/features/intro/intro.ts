import { gsap } from 'gsap';

export function initializeIntro() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-commit-intro]');
  if (!dialog?.open || dialog.dataset.initialized) return;
  dialog.dataset.initialized = 'true';
  const finish = () => dialog.dispatchEvent(new Event('intro:finish'));
  const columns = dialog.querySelectorAll<SVGGElement>('[data-intro-column]');
  const composition = dialog.querySelector<HTMLElement>('[data-intro-composition]');
  const status = dialog.querySelector<HTMLElement>('[data-intro-status]');
  if (!composition || !status || !columns.length) { finish(); return; }
  const elapsed = (performance.now() - Number(dialog.dataset.startedAt)) / 1000;
  const remaining = Math.min(2.6, 2.9 - elapsed);
  // Si el bundle llega tarde, no aceleramos el mensaje hasta hacerlo ilegible.
  if (!Number.isFinite(remaining) || remaining < 2) { finish(); return; }

  const timeline = gsap.timeline({ onComplete: finish });
  dialog.addEventListener('intro:finished', () => timeline.kill(), { once: true });
  timeline
    .fromTo(columns, { opacity: 0 }, { opacity: 1, duration: 0.12, stagger: { amount: 1.12 }, ease: 'none' }, 0.15)
    .call(() => { status.textContent = 'Commit successful ✓'; }, [], 1.4)
    .to(composition, { scale: 1.035, opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 2.05)
    .to(dialog, { opacity: 0, duration: 0.2, ease: 'power1.out' }, 2.4);
  timeline.timeScale(2.6 / remaining);
}
