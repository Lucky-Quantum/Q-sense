"use client";

import { useEffect } from "react";

/**
 * Adds a gentle mobile-only auto-advance to the landing-page algorithm track.
 * It stops after touch, pointer, or keyboard interaction, pauses on hover, and
 * respects the user's reduced-motion preference.
 */
export default function AlgorithmAutoScroll() {
  useEffect(() => {
    const track = document.getElementById("qsense-algorithm-grid");
    if (!(track instanceof HTMLElement)) return;

    let hovered = false;
    let userInteracted = false;

    const handleMouseEnter = () => {
      hovered = true;
    };
    const handleMouseLeave = () => {
      hovered = false;
    };
    const stopAutoplay = () => {
      userInteracted = true;
    };

    const intervalId = window.setInterval(() => {
      if (
        window.innerWidth > 620 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        hovered ||
        userInteracted
      ) {
        return;
      }

      const slides = Array.from(track.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );
      if (slides.length < 2) return;

      const trackLeft = track.getBoundingClientRect().left;
      const visiblePositions = slides.map((slide, index) => ({
        index,
        distance: Math.abs(slide.getBoundingClientRect().left - trackLeft - 2),
      }));
      const current = visiblePositions.reduce((best, item) =>
        item.distance < best.distance ? item : best,
      );
      const nextIndex = current.index + 1;

      if (nextIndex >= slides.length) {
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      const nextLeft = slides[nextIndex].getBoundingClientRect().left;
      const targetLeft = track.scrollLeft + nextLeft - trackLeft;
      track.scrollTo({ left: targetLeft, behavior: "smooth" });
    }, 3600);

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);
    track.addEventListener("touchstart", stopAutoplay, { passive: true, once: true });
    track.addEventListener("pointerdown", stopAutoplay, { once: true });
    track.addEventListener("focusin", stopAutoplay);

    return () => {
      window.clearInterval(intervalId);
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
      track.removeEventListener("touchstart", stopAutoplay);
      track.removeEventListener("pointerdown", stopAutoplay);
      track.removeEventListener("focusin", stopAutoplay);
    };
  }, []);

  return null;
}
