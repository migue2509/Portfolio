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
