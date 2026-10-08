"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Fade-up on scroll. Progressive: content is visible without JS once hydrated fails. */
export default function Reveal({ children, className = "", as: Tag = "div", delay = 0 }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" | "article"; delay?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T = Tag as any;
  return <T ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</T>;
}
