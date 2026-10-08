"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

type Palette = { accent: string; ink: string; glow: string };

const palettes: Record<"dark" | "light", Palette> = {
  dark: { accent: "#e08a63", ink: "#f2f2ee", glow: "#ffb38f" },
  light: { accent: "#e2622a", ink: "#111111", glow: "#ffb08a" },
};

// The glossy core. It slowly turns and leans toward the pointer.
function Core({ palette, animate }: { palette: Palette; animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current || !animate) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, y * 0.35, 3, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, x * 0.25, 3, delta);
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.15, 24]} />
        <MeshDistortMaterial
          color={palette.accent}
          roughness={0.18}
          metalness={0.35}
          distort={animate ? 0.38 : 0.2}
          speed={animate ? 1.6 : 0}
        />
      </mesh>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={palette.ink} wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// Three tilted rings with a small "satellite" travelling on each.
function Orbits({ palette, animate }: { palette: Palette; animate: boolean }) {
  const rings = useMemo(
    () => [
      { radius: 2.0, tilt: [1.1, 0.2, 0], speed: 0.5, size: 0.09 },
      { radius: 2.35, tilt: [0.4, 1.0, 0.3], speed: -0.35, size: 0.07 },
      { radius: 2.7, tilt: [1.6, -0.5, 0.2], speed: 0.25, size: 0.11 },
    ],
    []
  );
  const sats = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    rings.forEach((ring, i) => {
      const sat = sats.current[i];
      if (!sat) return;
      const a = t * ring.speed + i * 2;
      sat.position.set(Math.cos(a) * ring.radius, Math.sin(a) * ring.radius, 0);
    });
  });

  return (
    <>
      {rings.map((ring, i) => (
        <group key={ring.radius} rotation={ring.tilt as [number, number, number]}>
          <mesh>
            <torusGeometry args={[ring.radius, 0.006, 8, 160]} />
            <meshBasicMaterial color={palette.ink} transparent opacity={0.22} />
          </mesh>
          <mesh
            ref={(el) => {
              sats.current[i] = el;
            }}
            position={[ring.radius, 0, 0]}
          >
            <sphereGeometry args={[ring.size, 24, 24]} />
            <meshStandardMaterial
              color={palette.glow}
              emissive={palette.glow}
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Small seeded PRNG so the particle layout is pure and identical every render.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

// A loose shell of particles that drifts behind everything for depth.
function Dust({ palette, animate }: { palette: Palette; animate: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 900;
    const random = mulberry32(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + random() * 3.5;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (points.current && animate) points.current.rotation.y -= delta * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={palette.ink}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  const palette = palettes[theme];
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );

  // Stop rendering frames while the hero is scrolled out of view.
  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  const animate = visible && !reduceMotion;

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        frameloop={animate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <ambientLight intensity={theme === "dark" ? 0.35 : 1.1} />
        <directionalLight position={[4, 5, 3]} intensity={2.2} />
        <pointLight position={[-4, -2, -3]} intensity={30} color={palette.glow} />
        <Float speed={animate ? 1.4 : 0} rotationIntensity={0.4} floatIntensity={0.8}>
          <Core palette={palette} animate={animate} />
        </Float>
        <Orbits palette={palette} animate={animate} />
        <Dust palette={palette} animate={animate} />
      </Canvas>
    </div>
  );
}
