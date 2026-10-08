"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

/*
 * "AI pair-programming" scene: a neural-network core streams data packets
 * into three floating editors that type real code from Nirmal's projects.
 */

type Palette = {
  accent: string;
  accent2: string;
  edge: string;
  panelBg: string;
  panelBar: string;
  text: string;
  dim: string;
  keyword: string;
  string: string;
  comment: string;
  fn: string;
};

const palettes: Record<"dark" | "light", Palette> = {
  dark: {
    accent: "#3ecf8e",
    accent2: "#22d3ee",
    edge: "#3ecf8e",
    panelBg: "#0d1311",
    panelBar: "#141c18",
    text: "#d7e4dc",
    dim: "#4b5d53",
    keyword: "#3ecf8e",
    string: "#fbbf24",
    comment: "#5d7267",
    fn: "#22d3ee",
  },
  light: {
    accent: "#10b981",
    accent2: "#06b6d4",
    edge: "#10b981",
    panelBg: "#ffffff",
    panelBar: "#ecf7f1",
    text: "#0b1711",
    dim: "#a3b8ac",
    keyword: "#047857",
    string: "#b45309",
    comment: "#7b9086",
    fn: "#0e7490",
  },
};

const snippets: { file: string; code: string[] }[] = [
  {
    file: "ai/pair.ts",
    code: [
      "import Anthropic from \"@anthropic-ai/sdk\";",
      "",
      "const claude = new Anthropic();",
      "",
      "export async function review(diff: string) {",
      "  const res = await claude.messages.create({",
      "    model: \"claude-opus-5-5\",",
      "    max_tokens: 1024,",
      "    messages: [{ role: \"user\", content: diff }],",
      "  });",
      "  return res.content;",
      "}",
    ],
  },
  {
    file: "devTinder/routes/auth.js",
    code: [
      "authRouter.post(\"/login\", async (req, res) => {",
      "  const { emailId, password } = req.body;",
      "  const user = await User.findOne({ emailId });",
      "  if (!user?.isEmailVerified) {",
      "    return res.status(403).send(\"Verify email\");",
      "  }",
      "  // httpOnly cookie, 8h expiry",
      "  const token = await user.getJWT();",
      "  res.cookie(\"token\", token, { httpOnly: true });",
      "  res.json(user);",
      "});",
    ],
  },
  {
    file: "hooks/useTodos.ts",
    code: [
      "export function useTodos() {",
      "  const [todos, setTodos] = useState<Todo[]>([]);",
      "",
      "  async function toggle(id: string) {",
      "    const prev = todos;",
      "    // optimistic update, roll back on error",
      "    setTodos(flip(todos, id));",
      "    try { await api.patch(`/todos/${id}`); }",
      "    catch { setTodos(prev); }",
      "  }",
      "  return { todos, toggle };",
      "}",
    ],
  },
];

const KEYWORDS = new Set([
  "import", "from", "const", "export", "async", "function", "await", "return", "if", "new", "try", "catch",
]);

type Token = { text: string; kind: "keyword" | "string" | "comment" | "fn" | "text" };

// Minimal highlighter: enough for the snippets above.
function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const commentAt = line.indexOf("//");
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const re = /("[^"]*"|`[^`]*`|[A-Za-z_$][\w$]*|\s+|.)/g;
  for (const m of code.matchAll(re)) {
    const t = m[0];
    const next = code[(m.index ?? 0) + t.length];
    if (t.startsWith("\"") || t.startsWith("`")) tokens.push({ text: t, kind: "string" });
    else if (KEYWORDS.has(t)) tokens.push({ text: t, kind: "keyword" });
    else if (/^[A-Za-z_$]/.test(t) && next === "(") tokens.push({ text: t, kind: "fn" });
    else tokens.push({ text: t, kind: "text" });
  }
  if (commentAt >= 0) tokens.push({ text: line.slice(commentAt), kind: "comment" });
  return tokens;
}

const W = 720;
const H = 460;

/** Draws an editor window with `chars` characters of the snippet typed so far. */
function drawEditor(
  ctx: CanvasRenderingContext2D,
  snippet: (typeof snippets)[number],
  chars: number,
  palette: Palette,
  font: string,
  cursorOn: boolean
) {
  ctx.clearRect(0, 0, W, H);
  const r = 22;
  ctx.fillStyle = palette.panelBg;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, r);
  ctx.fill();
  ctx.strokeStyle = palette.dim;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Title bar.
  ctx.fillStyle = palette.panelBar;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, 52, [r, r, 0, 0]);
  ctx.fill();
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(30 + i * 22, 26, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = `500 20px ${font}`;
  ctx.fillStyle = palette.comment;
  ctx.fillText(snippet.file, 110, 33);

  ctx.font = `22px ${font}`;
  const lineH = 31;
  let remaining = chars;
  let cursorX = -1;
  let cursorY = 0;
  snippet.code.forEach((line, row) => {
    const y = 92 + row * lineH;
    ctx.fillStyle = palette.dim;
    ctx.fillText(String(row + 1).padStart(2, " "), 22, y);
    if (remaining < 0) return;
    let x = 70;
    for (const tok of tokenize(line)) {
      if (remaining <= 0) break;
      const text = tok.text.slice(0, remaining);
      remaining -= text.length;
      ctx.fillStyle = tok.kind === "text" ? palette.text : palette[tok.kind];
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
    if (remaining <= 0 && cursorX < 0) {
      cursorX = x;
      cursorY = y;
    }
    remaining -= 1; // the newline
  });
  if (cursorX >= 0 && cursorOn) {
    ctx.fillStyle = palette.accent;
    ctx.fillRect(cursorX + 2, cursorY - 20, 11, 25);
  }
}

const totalChars = (s: (typeof snippets)[number]) => s.code.reduce((n, l) => n + l.length + 1, 0);

function EditorPanel({
  index,
  palette,
  animate,
  position,
  rotation,
}: {
  index: number;
  palette: Palette;
  animate: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const state = useRef({ ctx: null as CanvasRenderingContext2D | null, tex: null as THREE.CanvasTexture | null, font: "monospace", chars: 0, last: 0, hold: 0 });
  const snippet = snippets[index];

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx || !material.current) return;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const s = state.current;
    s.ctx = ctx;
    s.tex = tex;
    s.chars = animate ? index * 60 : totalChars(snippet);
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim();
    s.font = mono ? `${mono}, monospace` : "monospace";
    material.current.map = tex;
    material.current.needsUpdate = true;
    const paint = () => drawEditor(ctx, snippet, s.chars, palette, s.font, true);
    paint();
    tex.needsUpdate = true;
    document.fonts?.ready.then(() => {
      paint();
      tex.needsUpdate = true;
    });
    return () => tex.dispose();
    // Re-create on theme change so colours update.
  }, [palette, snippet, index, animate]);

  useFrame((frame, delta) => {
    const s = state.current;
    if (!animate || !s.ctx || !s.tex) return;
    s.last += delta;
    if (s.last < 0.045) return; // ~22 fps redraw is plenty for typing
    s.last = 0;
    const total = totalChars(snippet);
    if (s.chars >= total) {
      s.hold += 0.045;
      if (s.hold > 2.6) {
        s.chars = 0;
        s.hold = 0;
      }
    } else {
      s.chars += 2;
    }
    const cursorOn = Math.floor(frame.clock.elapsedTime * 2.2) % 2 === 0;
    drawEditor(s.ctx, snippet, s.chars, palette, s.font, cursorOn);
    s.tex.needsUpdate = true;
  });

  return (
    <Float speed={animate ? 1.2 : 0} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[2.5, 2.5 * (H / W)]} />
        <meshBasicMaterial ref={material} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The "AI": a sphere of neurons with links between near neighbours.
function NeuralCore({ palette, animate }: { palette: Palette; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const { nodes, edges } = useMemo(() => {
    const random = mulberry32(11);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 70; i++) {
      const v = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
      pts.push(v.multiplyScalar(0.75 + random() * 0.35));
    }
    const lines: number[] = [];
    pts.forEach((a, i) => {
      pts.forEach((b, j) => {
        if (j > i && a.distanceTo(b) < 0.55) lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
      });
    });
    return { nodes: new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), edges: new Float32Array(lines) };
  }, []);

  useFrame((state, delta) => {
    if (!animate) return;
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x += delta * 0.08;
    }
    if (glow.current) glow.current.scale.setScalar(0.42 + Math.sin(state.clock.elapsedTime * 2) * 0.04);
  });

  return (
    <group>
      <mesh ref={glow}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh scale={0.62}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <group ref={group}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={palette.edge} transparent opacity={0.35} />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
          </bufferGeometry>
          <pointsMaterial color={palette.accent2} size={0.06} sizeAttenuation transparent opacity={0.95} />
        </points>
      </group>
    </group>
  );
}

const PANELS: { position: [number, number, number]; rotation: [number, number, number] }[] = [
  { position: [-2.1, 1.25, -0.6], rotation: [0.05, 0.38, -0.03] },
  { position: [1.9, 0.55, -0.3], rotation: [-0.02, -0.4, 0.02] },
  { position: [-0.4, -1.55, 0.4], rotation: [-0.12, 0.08, 0.01] },
];

// Packets travel from the core to each panel along curved paths.
function DataStreams({ palette, animate }: { palette: Palette; animate: boolean }) {
  const points = useRef<THREE.Points>(null);
  const PER = 16;
  const curves = useMemo(
    () =>
      PANELS.map(({ position: [x, y, z] }) => {
        const end = new THREE.Vector3(x * 0.82, y * 0.82, z);
        const mid = new THREE.Vector3(x * 0.4, y * 0.4 + 0.6, z + 0.9);
        return new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, end);
      }),
    []
  );
  const initial = useMemo(() => new Float32Array(PANELS.length * PER * 3), []);
  const paths = useMemo(
    () => new Float32Array(curves.flatMap((c) => c.getPoints(40).flatMap((p) => [p.x, p.y, p.z]))),
    [curves]
  );

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.getAttribute("position").array as Float32Array;
    const t = animate ? state.clock.elapsedTime : 0;
    const v = new THREE.Vector3();
    curves.forEach((curve, c) => {
      for (let i = 0; i < PER; i++) {
        const u = (t * 0.32 + i / PER + c * 0.13) % 1;
        curve.getPoint(u, v);
        const k = (c * PER + i) * 3;
        arr[k] = v.x;
        arr[k + 1] = v.y;
        arr[k + 2] = v.z;
      }
    });
    geo.getAttribute("position").needsUpdate = true;
  });

  return (
    <>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[paths, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={palette.edge} transparent opacity={0.12} />
      </lineSegments>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initial, 3]} />
        </bufferGeometry>
        <pointsMaterial color={palette.accent} size={0.07} sizeAttenuation transparent opacity={0.9} toneMapped={false} />
      </points>
    </>
  );
}

function Rig({ children, animate }: { children: React.ReactNode; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || !animate) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, x * 0.25, 2.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.15, 2.5, delta);
  });
  return <group ref={group}>{children}</group>;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function HeroScene() {
  const { theme } = useTheme();
  const palette = palettes[theme];
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const reduce = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

  // Stop rendering frames while the hero is scrolled out of view.
  useEffect(() => {
    if (!wrapper.current) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  const animate = visible && !reduce;

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.9], fov: 45 }}
        frameloop={animate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden
      >
        <Rig animate={animate}>
          <NeuralCore palette={palette} animate={animate} />
          <DataStreams palette={palette} animate={animate} />
          {PANELS.map((p, i) => (
            <EditorPanel key={i} index={i} palette={palette} animate={animate} position={p.position} rotation={p.rotation} />
          ))}
        </Rig>
      </Canvas>
    </div>
  );
}
