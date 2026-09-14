import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const initialized = new WeakSet<HTMLElement>();

export function initializeExperience() {
  document.querySelectorAll<HTMLElement>("[data-experience]").forEach((section) => {
    if (initialized.has(section)) return;
    const track = section.querySelector<HTMLElement>("[data-experience-timeline]");
    const progress = section.querySelector<HTMLElement>("[data-experience-progress]");
    if (!track || !progress) return;
    initialized.add(section);

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // La línea acompaña el scroll, sin fijar ni cambiar la altura de la sección.
      gsap.fromTo(progress, { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      section.querySelectorAll<HTMLElement>("[data-experience-entry]").forEach((entry) => {
        const card = entry.querySelector<HTMLElement>("[data-experience-card]");
        const date = entry.querySelector<HTMLElement>("[data-experience-date]");
        const dot = entry.querySelector<HTMLElement>("[data-experience-dot]");
        if (!card || !date || !dot) return;
        gsap.timeline({
          scrollTrigger: { trigger: entry, start: "top 88%", once: true },
          defaults: { ease: "power3.out" },
        })
          .from(dot, { scale: 0.35, opacity: 0, duration: 0.4 })
          .from(date, { y: 12, opacity: 0, duration: 0.55 }, 0.05)
          .from(card, { y: 32, scale: 0.98, opacity: 0, duration: 0.8 }, 0.1);
      });
    }, section);

    document.addEventListener("astro:before-swap", () => {
      media.revert();
      initialized.delete(section);
    }, { once: true });
  });
}
