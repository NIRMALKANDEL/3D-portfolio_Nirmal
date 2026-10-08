"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

import { SHAPES, type Shape } from "@/components/lab/shapes";

const COUNT = 14000;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each builder returns COUNT xyz points for one shape.
function buildShape(shape: Shape): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const random = mulberry32(shape.length * 97);
  for (let i = 0; i < COUNT; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    const t = i / COUNT;
    if (shape === "Sphere") {
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.1 + (random() - 0.5) * 0.08;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    } else if (shape === "Torus knot") {
      const a = t * Math.PI * 2 * 3;
      const p = 2;
      const q = 3;
      const r = 1.3 + 0.55 * Math.cos((q * a) / p);
      const jitter = 0.22;
      x = r * Math.cos(a) + (random() - 0.5) * jitter;
      y = r * Math.sin(a) + (random() - 0.5) * jitter;
      z = 0.55 * Math.sin((q * a) / p) * 1.6 + (random() - 0.5) * jitter;
    } else if (shape === "Galaxy") {
      const arms = 3;
      const arm = i % arms;
      const radius = Math.pow(random(), 0.7) * 2.5;
      const spin = radius * 1.6;
      const angle = (arm / arms) * Math.PI * 2 + spin;
      const spread = 0.35 * (1 - radius / 2.9);
      x = Math.cos(angle) * radius + (random() - 0.5) * spread;
      y = (random() - 0.5) * 0.25 * (1 - radius / 2.7);
      z = Math.sin(angle) * radius + (random() - 0.5) * spread;
    } else {
      const side = Math.ceil(Math.sqrt(COUNT));
      const gx = (i % side) / side - 0.5;
      const gz = Math.floor(i / side) / side - 0.5;
      x = gx * 5;
      z = gz * 5;
      y = Math.sin(x * 1.4) * 0.45 + Math.cos(z * 1.6) * 0.45;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uPointer;
  attribute vec3 aTarget;
  attribute float aSeed;
  varying float vDepth;
  varying float vSeed;

  void main() {
    // Stagger each particle a little so the morph ripples instead of snapping.
    float p = clamp((uProgress - aSeed * 0.35) / 0.65, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(position, aTarget, p);

    // Idle breathing.
    pos += 0.04 * vec3(
      sin(uTime * 0.9 + aSeed * 20.0),
      cos(uTime * 0.7 + aSeed * 15.0),
      sin(uTime * 0.8 + aSeed * 11.0)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Push particles away from the pointer in view space.
    vec2 toPointer = mv.xy - uPointer * 3.2;
    float d = length(toPointer);
    mv.xy += normalize(toPointer + 1e-4) * smoothstep(1.2, 0.0, d) * 0.35;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + aSeed) / -mv.z;
    vDepth = clamp((pos.z + 3.0) / 6.0, 0.0, 1.0);
    vSeed = aSeed;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vDepth;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * uOpacity;
    vec3 color = mix(uColorA, uColorB, vDepth * 0.8 + vSeed * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

const colors = {
  dark: { a: "#e08a63", b: "#fde6d8", blending: THREE.AdditiveBlending, opacity: 0.85, size: 26 },
  light: { a: "#c2410c", b: "#f08a5d", blending: THREE.NormalBlending, opacity: 0.55, size: 17 },
};

function Particles({ shape, animate }: { shape: Shape; animate: boolean }) {
  const { theme } = useTheme();
  const points = useRef<THREE.Points>(null);
  const geometry = useRef<THREE.BufferGeometry>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const shapes = useMemo(
    () => Object.fromEntries(SHAPES.map((s) => [s, buildShape(s)])) as Record<Shape, Float32Array>,
    []
  );
  const initial = useMemo(() => {
    const random = mulberry32(42);
    return {
      position: shapes.Sphere.slice(),
      target: shapes.Sphere.slice(),
      seeds: new Float32Array(COUNT).map(() => random()),
    };
  }, [shapes]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uOpacity: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    const mat = material.current;
    if (!mat) return;
    const c = colors[theme];
    mat.uniforms.uColorA.value.set(c.a);
    mat.uniforms.uColorB.value.set(c.b);
    mat.uniforms.uOpacity.value = c.opacity;
    mat.uniforms.uSize.value = c.size;
    mat.blending = c.blending;
    mat.needsUpdate = true;
  }, [theme]);

  // On shape change: freeze the in-between state as the new start, then morph to the new target.
  useEffect(() => {
    const geo = geometry.current;
    const mat = material.current;
    if (!geo || !mat) return;
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const target = geo.getAttribute("aTarget") as THREE.BufferAttribute;
    const seeds = geo.getAttribute("aSeed") as THREE.BufferAttribute;
    const progress = mat.uniforms.uProgress.value as number;
    for (let i = 0; i < COUNT; i++) {
      let p = Math.min(Math.max((progress - seeds.array[i] * 0.35) / 0.65, 0), 1);
      p = p * p * (3 - 2 * p);
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        pos.array[j] = pos.array[j] + (target.array[j] - pos.array[j]) * p;
      }
    }
    (target.array as Float32Array).set(shapes[shape]);
    pos.needsUpdate = true;
    target.needsUpdate = true;
    mat.uniforms.uProgress.value = animate ? 0 : 1;
  }, [shape, shapes, animate]);

  useFrame((state, delta) => {
    const mat = material.current;
    if (!mat) return;
    const u = mat.uniforms;
    u.uTime.value += animate ? delta : 0;
    u.uProgress.value = Math.min(1, u.uProgress.value + delta * 0.55);
    (u.uPointer.value as THREE.Vector2).lerp(state.pointer, 0.1);
    if (points.current && animate) {
      points.current.rotation.y += delta * 0.08;
      points.current.rotation.x = THREE.MathUtils.damp(points.current.rotation.x, shape === "Wave" ? 0.32 : 0.15, 3, delta);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[initial.position, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[initial.target, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[initial.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function ParticleMorph({ shape }: { shape: Shape }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  const animate = visible && !reduce;

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 7], fov: 45 }}
        frameloop={animate ? "always" : "demand"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <Particles shape={shape} animate={animate} />
      </Canvas>
    </div>
  );
}
