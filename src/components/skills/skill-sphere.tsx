"use client";

import { useEffect, useMemo, useRef } from "react";

type Vec = { x: number; y: number; z: number };

const BASE_SPIN = 0.0035;

// Spread points evenly over a unit sphere (Fibonacci lattice).
function fibonacciSphere(count: number): Vec[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
}

/**
 * A draggable 3D globe of skill tags. Positions are written straight to the
 * DOM from a rAF loop (no React state), and the loop sleeps when offscreen.
 */
export function SkillSphere({ skills }: { skills: string[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const initial = useMemo(() => fibonacciSphere(skills.length), [skills.length]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;

    const points = initial.map((p) => ({ ...p }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let radius = el.clientWidth * 0.42;
    let vx = 0;
    let vy = reduce ? 0 : BASE_SPIN;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;
    let running = false;

    const rotate = (ax: number, ay: number) => {
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      for (const p of points) {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        p.x = x1;
        p.y = y2;
        p.z = z2;
      }
    };

    const paint = () => {
      points.forEach((p, i) => {
        const tag = tags.current[i];
        if (!tag) return;
        const depth = (p.z + 1) / 2; // 0 = back, 1 = front
        const scale = 0.6 + depth * 0.6;
        tag.style.transform = `translate(-50%, -50%) translate3d(${p.x * radius}px, ${p.y * radius}px, 0) scale(${scale})`;
        tag.style.opacity = String(0.18 + depth * 0.82);
        tag.style.zIndex = String(Math.round(depth * 100));
        tag.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : "none";
      });
    };

    const tick = () => {
      if (!dragging) {
        // Ease any fling back toward the gentle idle spin.
        vx *= 0.95;
        vy += ((reduce ? 0 : BASE_SPIN) - vy) * 0.04;
      }
      rotate(vx, vy);
      paint();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      vy = (e.clientX - lastX) * 0.006;
      vx = (e.clientY - lastY) * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    const ro = new ResizeObserver(() => {
      radius = el.clientWidth * 0.42;
      paint();
    });
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) start();
      else stop();
    });

    paint();
    ro.observe(el);
    io.observe(el);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [initial]);

  return (
    <div
      ref={stage}
      className="relative mx-auto aspect-square w-full max-w-[520px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      role="img"
      aria-label={`Skills: ${skills.join(", ")}`}
    >
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full border border-[var(--border)] bg-[radial-gradient(circle_at_35%_30%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute inset-[30%] rounded-full border border-dashed border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
      />
      {skills.map((skill, i) => (
        <span
          key={skill}
          ref={(node) => {
            tags.current[i] = node;
          }}
          aria-hidden
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--foreground)] shadow-[var(--shadow-card)] will-change-transform"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
