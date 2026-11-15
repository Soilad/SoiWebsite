import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Runs after AddNorrisText, which replaces .landoText.unHighlight nodes with new ones.
export function GSAP() {
  // Wipe each highlight away every time it scrolls into view, from either direction.
  // Cover it again when it leaves, so the wipe can replay.
  // Wipes go through a queue: each one starts at least STAGGER seconds after the
  // previous one. So the gap between wipes stays the same however fast you scroll:
  // a slow scroll spaces them out naturally, a fast one queues them up.
  const STAGGER = 0.1;
  let nextStart = 0;
  // One sweep: the bar grows over the text from the left, the text colour swaps
  // while the bar hides it, then the bar slides out to the right.
  // GSAP cannot reach ::before directly, so it tweens the --left/--right insets
  // that the pseudo-element reads (see .unHighlight in text.css).
  // killTweensOf stops a half-run sweep, so leaving and re-entering never mixes two.
  const sweep = (highlight: Element, delay: number, color: string, duration: number) => {
    gsap.killTweensOf(highlight);
    gsap.timeline({ delay })
      .set(highlight, { "--left": "0%", "--right": "100%" })
      .to(highlight, { "--right": "0%", duration })
      .set(highlight, { color })
      .to(highlight, { "--left": "100%", duration });
  };
  const wipe = (highlight: Element) => {
    const now = gsap.ticker.time;
    nextStart = Math.max(now, nextStart + STAGGER);
    sweep(highlight, nextStart - now, "white", 0.5);
  };
  const cover = (highlight: Element) => sweep(highlight, 0, "transparent", 0.15);
  // Batch the elements that enter in the same frame, so the queue takes them in
  // document order (top to bottom), not in whatever order ScrollTrigger fires them.
  ScrollTrigger.batch(".unHighlight", {
    scroller: "#overlay",
    start: "clamp(top 80%)",
    onEnter: (batch) => batch.forEach(wipe),
    onEnterBack: (batch) => batch.forEach(wipe),
    onLeave: (batch) => batch.forEach(cover),
    onLeaveBack: (batch) => batch.forEach(cover),
  });
}

export function HeroScroll() {
  const overlay = document.getElementById("overlay")!;

  // The knockout text sits outside #overlay so mix-blend-mode can blend with the canvas.
  // Move it by hand to match #overlay's scroll. Translate the <p> itself:
  // a transform on .hero would isolate the blend.
  const knockout = document.querySelector<HTMLElement>(".knockout");
  overlay.addEventListener(
    "scroll",
    () => {
      if (knockout) knockout.style.translate = `0 ${-overlay.scrollTop}px`;
    },
    { passive: true }
  );

  // Fade each card in as soon as its top edge enters the screen.
  // (An 80% start left the card invisible while it crossed the bottom fifth of the screen.)
  // CSS starts cards at opacity 0 so they don't flash before this runs.
  gsap.utils.toArray<HTMLElement>(".tiltCard").forEach(
    (card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            scroller: overlay,
            start: "clamp(top bottom)",
          },
        }
      );
    }
  );

  // Cards change height after the triggers are measured: SetNowPlaying/SetAlbums fill
  // the music card from the network, and the album images load later still. Every
  // trigger below that card then fires at a stale scroll position (too early, so the
  // card has already faded in before you reach it). Re-measure whenever a card resizes,
  // at most once per frame.
  let refreshQueued = false;
  const resizeObserver = new ResizeObserver(() => {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      ScrollTrigger.refresh();
    });
  });
  document.querySelectorAll(".tiltCard").forEach((card) => resizeObserver.observe(card));
}

// Hide the header while #overlay scrolls down, show it again on any scroll up.
// THRESHOLD ignores tiny jitters (trackpad momentum, sub-pixel scrolls).
export function HeaderScroll() {
  const overlay = document.getElementById("overlay")!;
  const header = document.querySelector<HTMLElement>(".header");
  if (!header) return;
  const THRESHOLD = 5;
  let lastTop = overlay.scrollTop;
  overlay.addEventListener(
    "scroll",
    () => {
      const top = overlay.scrollTop;
      const delta = top - lastTop;
      if (Math.abs(delta) < THRESHOLD) return;
      // Always show the header near the top of the page.
      header.classList.toggle("headerHidden", delta > 0 && top > header.offsetHeight);
      lastTop = top;
    },
    { passive: true }
  );
}
