import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  Html,
  Instances,
  Instance,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Points,
  PointMaterial,
  Sparkles,
  Stars,
  Torus,
  useTexture,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/* -----------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------*/

// Smooth range mapping
function mapRange(v: number, a: number, b: number, c: number, d: number) {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return c + (d - c) * t;
}

/* -----------------------------------------------------------
 * Scroll -> camera flythrough. Waypoints defined per scene.
 * Total scroll length = 900vh (9 scenes).
 * ---------------------------------------------------------*/

// Waypoints: [x,y,z, lookX, lookY, lookZ]
const WAYPOINTS: [number, number, number, number, number, number][] = [
  [0, 0.5, 8, 0, 0, 0],           // 0 AI Core
  [40, 3, 14, 40, 0, 0],          // 1 City approach
  [40, 1.2, 4, 40, 0.5, 0],       // 1b City through
  [80, 2, 8, 80, 0, 0],           // 2 AI Lab
  [120, 0, 12, 120, 0, 0],        // 3 Neural Net
  [160, 4, 22, 160, 0, 0],        // 4 Orbit wide
  [200, 1, 10, 200, 0, 0],        // 5 Showcase
  [240, 0, 8, 240, 0, 0],         // 6 HUD dashboard
  [280, 0, 6, 285, 0, 0],         // 7 Portal
  [325, 2, 18, 320, 0, 0],        // 8 Earth
];

function CameraRig({ scroll }: { scroll: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const p = scroll.current * (WAYPOINTS.length - 1);
    const i = Math.floor(p);
    const f = p - i;
    const a = WAYPOINTS[Math.min(i, WAYPOINTS.length - 1)];
    const b = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)];
    const eased = f * f * (3 - 2 * f);
    const px = a[0] + (b[0] - a[0]) * eased + pointer.x * 0.6;
    const py = a[1] + (b[1] - a[1]) * eased + pointer.y * 0.4;
    const pz = a[2] + (b[2] - a[2]) * eased;
    camera.position.lerp(new THREE.Vector3(px, py, pz), Math.min(1, dt * 4));
    target.current.set(
      a[3] + (b[3] - a[3]) * eased,
      a[4] + (b[4] - a[4]) * eased,
      a[5] + (b[5] - a[5]) * eased,
    );
    camera.lookAt(target.current);
  });
  return null;
}

/* -----------------------------------------------------------
 * SCENE 1 — AI CORE
 * ---------------------------------------------------------*/
function AICore() {
  const group = useRef<THREE.Group>(null!);
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);
  useFrame((s, dt) => {
    group.current.rotation.y += dt * 0.15;
    ring1.current.rotation.x += dt * 0.3;
    ring2.current.rotation.z += dt * 0.4;
    ring3.current.rotation.y -= dt * 0.25;
    ring3.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.4;
  });
  return (
    <group ref={group} position={[0, 0, 0]}>
      <Float speed={1} floatIntensity={0.6} rotationIntensity={0.3}>
        <mesh>
          <icosahedronGeometry args={[1.4, 6]} />
          <MeshDistortMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={1.4}
            distort={0.35}
            speed={2}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
        <mesh scale={1.02}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>
      <Torus ref={ring1} args={[2.4, 0.02, 8, 128]}>
        <meshBasicMaterial color="#00E5FF" />
      </Torus>
      <Torus ref={ring2} args={[3.1, 0.015, 8, 128]}>
        <meshBasicMaterial color="#6A5CFF" />
      </Torus>
      <Torus ref={ring3} args={[3.9, 0.01, 8, 128]}>
        <meshBasicMaterial color="#00FFA8" />
      </Torus>
      <Sparkles count={200} scale={[8, 8, 8]} size={2} speed={0.4} color="#00E5FF" />
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 2 — DIGITAL CITY (instanced buildings)
 * ---------------------------------------------------------*/
function DigitalCity() {
  const buildings = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: [number, number, number]; color: string }[] = [];
    const rand = mulberry(11);
    for (let i = 0; i < 220; i++) {
      const x = 40 + (rand() - 0.5) * 60;
      const z = (rand() - 0.5) * 80;
      const h = 2 + rand() * 14;
      const w = 0.6 + rand() * 1.6;
      arr.push({
        pos: [x, h / 2 - 2, z],
        scale: [w, h, w],
        color: rand() > 0.6 ? "#6A5CFF" : "#00E5FF",
      });
    }
    return arr;
  }, []);
  const drones = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (drones.current)
      drones.current.children.forEach((c, i) => {
        c.position.x = 40 + Math.sin(s.clock.elapsedTime * 0.4 + i) * 20;
        c.position.y = 4 + Math.sin(s.clock.elapsedTime + i * 2) * 2;
      });
  });
  return (
    <group>
      <Instances limit={buildings.length} range={buildings.length}>
        <boxGeometry />
        <meshStandardMaterial color="#0a0a12" emissive="#00E5FF" emissiveIntensity={0.15} metalness={0.8} roughness={0.35} />
        {buildings.map((b, i) => (
          <Instance key={i} position={b.pos} scale={b.scale} color={b.color} />
        ))}
      </Instances>
      {/* road glow */}
      <mesh rotation-x={-Math.PI / 2} position={[40, -2.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#040409" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[40, -2, 0]}>
        <ringGeometry args={[0, 40, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.06} />
      </mesh>
      {/* drones */}
      <group ref={drones}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[40, 5, i * 2 - 8]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshBasicMaterial color="#00FFA8" />
          </mesh>
        ))}
      </group>
      {/* rain */}
      <RainField origin={[40, 0, 0]} />
    </group>
  );
}

function RainField({ origin }: { origin: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const p = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      p[i * 3] = origin[0] + (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = Math.random() * 20;
      p[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 60;
    }
    return p;
  }, [origin]);
  useFrame((_, dt) => {
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] -= dt * 12;
      if (arr[i] < -2) arr[i] = 18;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial color="#00E5FF" size={0.02} transparent opacity={0.5} depthWrite={false} />
    </Points>
  );
}

/* -----------------------------------------------------------
 * SCENE 3 — AI LAB (robotic arms + floating chips)
 * ---------------------------------------------------------*/
function AILab() {
  const arm1 = useRef<THREE.Group>(null!);
  const arm2 = useRef<THREE.Group>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (arm1.current) {
      arm1.current.rotation.z = Math.sin(t * 0.6) * 0.5 - 0.3;
      arm1.current.children[1].rotation.z = Math.sin(t * 0.9) * 0.7;
    }
    if (arm2.current) {
      arm2.current.rotation.z = -Math.sin(t * 0.5) * 0.5 + 0.3;
      arm2.current.children[1].rotation.z = -Math.sin(t * 0.8) * 0.7;
    }
  });
  const Arm = (ref: React.MutableRefObject<THREE.Group>, x: number) => (
    <group ref={ref} position={[x, -2, -1]}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 3, 12]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.9} roughness={0.3} emissive="#00E5FF" emissiveIntensity={0.05} />
      </mesh>
      <group position={[0, 3, 0]}>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[1.6, 0.25, 0.25]} />
          <meshStandardMaterial color="#22222c" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[1.6, -0.15, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.4]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  );
  return (
    <group position={[80, 0, 0]}>
      {Arm(arm1, -2)}
      {Arm(arm2, 2)}
      {/* floating chip */}
      <Float speed={2} floatIntensity={0.6} rotationIntensity={1}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.2, 0.15, 1.2]} />
          <meshStandardMaterial color="#0f1220" emissive="#6A5CFF" emissiveIntensity={0.4} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.4]} />
          <meshBasicMaterial color="#00FFA8" />
        </mesh>
      </Float>
      <Sparkles count={80} scale={[10, 6, 6]} size={1.5} speed={0.3} color="#6A5CFF" />
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 4 — NEURAL NETWORK
 * ---------------------------------------------------------*/
function NeuralNetwork() {
  const { nodes, lines } = useMemo(() => {
    const n = 90;
    const rand = mulberry(4);
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      positions.push(new THREE.Vector3((rand() - 0.5) * 14, (rand() - 0.5) * 8, (rand() - 0.5) * 8));
    }
    const lineArr: number[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (positions[i].distanceTo(positions[j]) < 2.4) {
          lineArr.push(positions[i].x, positions[i].y, positions[i].z, positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    return { nodes: positions, lines: new Float32Array(lineArr) };
  }, []);
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.05;
  });
  return (
    <group ref={group} position={[120, 0, 0]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.25} />
      </lineSegments>
      <Instances limit={nodes.length}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#00FFA8" />
        {nodes.map((p, i) => (
          <Instance key={i} position={p.toArray()} />
        ))}
      </Instances>
      <Sparkles count={120} scale={[16, 10, 10]} size={1.6} speed={0.6} color="#00E5FF" />
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 5 — ORBIT (planets around core)
 * ---------------------------------------------------------*/
function Orbit() {
  const planets = [
    { color: "#00E5FF", r: 4, s: 0.35, size: 0.55 },
    { color: "#6A5CFF", r: 6, s: -0.25, size: 0.75 },
    { color: "#00FFA8", r: 8, s: 0.18, size: 0.5 },
    { color: "#FF2D75", r: 10, s: -0.14, size: 0.85 },
    { color: "#ffffff", r: 12, s: 0.1, size: 0.4 },
  ];
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((s) => {
    planets.forEach((p, i) => {
      const g = refs.current[i];
      if (!g) return;
      const t = s.clock.elapsedTime * p.s + i;
      g.position.set(Math.cos(t) * p.r, Math.sin(t * 0.7) * 0.6, Math.sin(t) * p.r);
    });
  });
  return (
    <group position={[160, 0, 0]}>
      {/* central sun */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#0a0a14" emissive="#00E5FF" emissiveIntensity={1.5} />
      </mesh>
      {planets.map((p, i) => (
        <group key={i}>
          <Torus args={[p.r, 0.005, 6, 128]} rotation-x={Math.PI / 2}>
            <meshBasicMaterial color={p.color} transparent opacity={0.25} />
          </Torus>
          <group ref={(el) => (refs.current[i] = el)}>
            <mesh>
              <sphereGeometry args={[p.size, 24, 24]} />
              <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 6 — SHOWCASE (glass cubes)
 * ---------------------------------------------------------*/
function Showcase() {
  const items = [
    { x: -4, color: "#00E5FF" },
    { x: -2, color: "#6A5CFF" },
    { x: 0, color: "#00FFA8" },
    { x: 2, color: "#FF2D75" },
    { x: 4, color: "#ffffff" },
  ];
  return (
    <group position={[200, 0, 0]}>
      {items.map((it, i) => (
        <Float key={i} speed={1.5} floatIntensity={0.8} rotationIntensity={0.8}>
          <group position={[it.x, Math.sin(i) * 0.3, 0]}>
            <mesh>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <MeshTransmissionMaterial
                transmission={1}
                thickness={0.6}
                roughness={0.05}
                ior={1.4}
                chromaticAberration={0.4}
                color="#ffffff"
              />
            </mesh>
            <mesh scale={0.55}>
              <icosahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color={it.color} emissive={it.color} emissiveIntensity={1.4} metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 7 — HUD dashboard (3D holographic ring)
 * ---------------------------------------------------------*/
function HUDScene() {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    g.current.rotation.z += dt * 0.05;
  });
  return (
    <group ref={g} position={[240, 0, 0]}>
      {[1.4, 2.0, 2.6, 3.2].map((r, i) => (
        <Torus key={i} args={[r, 0.008, 6, 128]}>
          <meshBasicMaterial color={i % 2 === 0 ? "#00E5FF" : "#6A5CFF"} transparent opacity={0.7} />
        </Torus>
      ))}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0]}>
            <boxGeometry args={[0.05, 0.25, 0.02]} />
            <meshBasicMaterial color="#00FFA8" />
          </mesh>
        );
      })}
      <mesh>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 8 — PORTAL
 * ---------------------------------------------------------*/
function Portal() {
  const ring = useRef<THREE.Mesh>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  useFrame((s, dt) => {
    ring.current.rotation.z += dt * 0.4;
    (inner.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(s.clock.elapsedTime * 3) * 0.2;
  });
  return (
    <group position={[285, 0, 0]}>
      <Torus ref={ring} args={[2.4, 0.15, 32, 128]}>
        <meshStandardMaterial color="#6A5CFF" emissive="#6A5CFF" emissiveIntensity={2.5} metalness={0.9} roughness={0.2} />
      </Torus>
      <mesh ref={inner}>
        <circleGeometry args={[2.35, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Sparkles count={400} scale={[6, 6, 2]} size={3} speed={1} color="#00E5FF" />
    </group>
  );
}

/* -----------------------------------------------------------
 * SCENE 9 — EARTH
 * ---------------------------------------------------------*/
function EarthScene() {
  const earth = useRef<THREE.Mesh>(null!);
  const sats = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    earth.current.rotation.y += dt * 0.08;
    sats.current.rotation.y += dt * 0.25;
    sats.current.rotation.x = Math.PI / 6;
  });
  return (
    <group position={[320, 0, 0]}>
      <mesh ref={earth}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshStandardMaterial color="#08131f" emissive="#00E5FF" emissiveIntensity={0.15} metalness={0.4} roughness={0.7} wireframe={false} />
      </mesh>
      <mesh scale={1.005}>
        <sphereGeometry args={[2.6, 40, 40]} />
        <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh scale={1.15}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.05} />
      </mesh>
      <group ref={sats}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 3.6, 0, Math.sin(a) * 3.6]}>
              <boxGeometry args={[0.12, 0.12, 0.12]} />
              <meshBasicMaterial color="#00FFA8" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* -----------------------------------------------------------
 * Ambient environment: dust, distant stars
 * ---------------------------------------------------------*/
function Dust() {
  const positions = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 400;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return p;
  }, []);
  return (
    <Points positions={positions} stride={3}>
      <PointMaterial color="#00E5FF" size={0.015} transparent opacity={0.4} depthWrite={false} />
    </Points>
  );
}

/* -----------------------------------------------------------
 * Root Experience
 * ---------------------------------------------------------*/
export function Experience({ scroll }: { scroll: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 55, near: 0.1, far: 800 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
      style={{ position: "fixed", inset: 0, background: "#040406" }}
    >
      <color attach="background" args={["#040406"]} />
      <fog attach="fog" args={["#040406", 12, 55]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 6]} intensity={1.2} color="#00E5FF" />
      <pointLight position={[40, 6, 6]} intensity={2} color="#6A5CFF" />
      <pointLight position={[285, 0, 4]} intensity={3} color="#6A5CFF" />
      <directionalLight position={[10, 10, 5]} intensity={0.4} />

      <Suspense fallback={null}>
        <Environment preset="night" />
        <Stars radius={200} depth={50} count={2500} factor={4} fade speed={0.5} />
        <Dust />

        <AICore />
        <DigitalCity />
        <AILab />
        <NeuralNetwork />
        <Orbit />
        <Showcase />
        <HUDScene />
        <Portal />
        <EarthScene />

        <CameraRig scroll={scroll} />

        <EffectComposer>
          <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.4} mipmapBlur radius={0.8} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008]} radialModulation={false} modulationOffset={0} />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
          <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.08} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

/* small deterministic PRNG */
function mulberry(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
