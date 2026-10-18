"use client";

import { useEffect } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * Home hero: the face and the SPARK wordmark are two Lottie animations whose
 * playhead is driven by the mouse X position (ported 1:1 from the inline
 * script of the Webflow build — easing 0.2 in a rAF loop, goToAndStop 0–100,
 * frames as units). Desktop only (≥992px); below that, and without JS, the
 * static SVGs render instead.
 *
 * The containers are plain divs rendered by the page:
 *   <div data-lottie="face" />  and  <div data-lottie="logo" />
 * Elements marked data-hero-reveal fade in once the logo animation is ready
 * (h1 + button), as on the original.
 */
export default function HeroLottie() {
  useEffect(() => {
    if (!window.matchMedia("(min-width: 992px)").matches) return;
    const face = document.querySelector<HTMLElement>('[data-lottie="face"]');
    const logo = document.querySelector<HTMLElement>('[data-lottie="logo"]');
    if (!face || !logo) return;

    let cancelled = false;
    let raf = 0;
    const anims: AnimationItem[] = [];
    let targetProgress = 0;
    let currentProgress = 0;
    const easing = 0.2;

    const onMove = (event: MouseEvent) => {
      targetProgress = (event.clientX / window.innerWidth) * 100;
    };

    const reveal = () => {
      document.querySelectorAll<HTMLElement>("[data-hero-reveal]").forEach((el) => {
        el.style.opacity = "1";
      });
    };

    (async () => {
      const lottie = (await import("lottie-web/build/player/lottie_light")).default;
      if (cancelled) return;

      const load = (container: HTMLElement, path: string, onReady?: () => void) => {
        const a = lottie.loadAnimation({ container, renderer: "svg", loop: true, autoplay: true, path });
        a.addEventListener("DOMLoaded", () => {
          container.style.opacity = "1";
          onReady?.();
        });
        anims.push(a);
      };
      load(face, "/lottie/face.json");
      load(logo, "/lottie/spark_logo.json", reveal);

      document.addEventListener("mousemove", onMove);
      const update = () => {
        const diff = targetProgress - currentProgress;
        currentProgress += diff * easing;
        for (const a of anims) a.goToAndStop(currentProgress, true);
        raf = requestAnimationFrame(update);
      };
      update();
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      for (const a of anims) a.destroy();
      reveal();
    };
  }, []);

  return null;
}
