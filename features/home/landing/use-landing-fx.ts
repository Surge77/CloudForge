"use client";

import { useEffect } from "react";

/** Reveal-on-scroll: adds `.in` to any `.forge-reveal` inside `root` when it enters view. */
export function useReveals(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18 }
    );
    for (const node of el.querySelectorAll(".forge-reveal")) io.observe(node);
    return () => io.disconnect();
  }, [root]);
}

/** Splits a string into per-character spans for the ignite animation. */
export function igniteChars(text: string, startIndex = 0) {
  const chars = [...text];
  return chars.map((ch, i) => ({
    ch: ch === " " ? " " : ch,
    delay: (startIndex + i) * 28,
    key: `${startIndex}-${i}`,
  }));
}

/** 3D tilt driven by pointer position over `zone`, applied to `target`. */
export function useTilt(
  zone: React.RefObject<HTMLElement | null>,
  target: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const z = zone.current;
    const t = target.current;
    if (!z || !t) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = z.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 5}deg)`;
    };
    const onLeave = () => { t.style.transform = ""; };
    z.addEventListener("pointermove", onMove);
    z.addEventListener("pointerleave", onLeave);
    return () => {
      z.removeEventListener("pointermove", onMove);
      z.removeEventListener("pointerleave", onLeave);
    };
  }, [zone, target]);
}
