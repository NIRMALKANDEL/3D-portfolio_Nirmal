"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * A soft light that trails the cursor and brightens whatever it passes over.
 * Mouse only: hidden on touch screens and when reduced motion is requested.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduce, x, y]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="cursor-glow transition-opacity duration-500"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    />
  );
}
