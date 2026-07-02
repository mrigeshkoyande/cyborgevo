import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Cpu, Zap, Radar, Globe2, Sparkles as SparklesIcon, Boxes, Activity, DoorOpen } from "lucide-react";

/**
 * Nine full-viewport panels stacked over the fixed 3D canvas.
 * Each panel fades in/out based on its own scroll progress so text
 * feels welded to the scene camera transitions.
 */
export function Overlay() {
  return (
    <div className="relative z-10 pointer-events-none">
      <Nav />
      <Panel index={0}>
        <Hero />
      </Panel>
      <Panel index={1}>
        <SceneBlock
          tag="SCENE 02 // NEO-KOWLOON"
          title={<>DIGITAL<br /><span className="text-[#00E5FF]">METROPOLIS</span></>}
          body="A living city of light. Autonomous drones stitch neon skylines while rain refracts a thousand holograms."
          icon={<Cpu size={14} />}
          side="right"
        />
      </Panel>
      <Panel index={2}>
        <SceneBlock
          tag="SCENE 03 // FABRICATION LAB"
          title={<>ROBOTIC<br /><span className="text-[#6A5CFF]">GENESIS</span></>}
          body="Seven-axis arms assemble sentience one photon at a time. Quantum cores tuned to a heartbeat of 4.2 THz."
          icon={<Zap size={14} />}
          side="left"
        />
      </Panel>
      <Panel index={3}>
        <SceneBlock
          tag="SCENE 04 // SYNAPSE MESH"
          title={<>NEURAL<br /><span className="text-[#00FFA8]">LATTICE</span></>}
          body="Ninety billion virtual neurons firing in perfect symphony. Thought becomes signal. Signal becomes will."
          icon={<Radar size={14} />}
          side="right"
        />
      </Panel>
      <Panel index={4}>
        <OrbitBlock />
      </Panel>
      <Panel index={5}>
        <ShowcaseBlock />
      </Panel>
      <Panel index={6}>
        <HudBlock />
      </Panel>
      <Panel index={7}>
        <SceneBlock
          tag="SCENE 08 // THRESHOLD"
          title={<>THE<br /><span className="text-[#6A5CFF]">PORTAL</span></>}
          body="Reality bends. Photons collapse into a singular gate. Step through — and let go of what you were."
          icon={<DoorOpen size={14} />}
          side="left"
        />
      </Panel>
      <Panel index={8}>
        <Finale />
      </Panel>
    </div>
  );
}

const PANELS = 9;

function Panel({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);
  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center"
      aria-label={`Scene ${index + 1}`}
    >
      <motion.div style={{ opacity, y }} className="pointer-events-auto w-full">
        {children}
      </motion.div>
    </section>
  );
}

function Nav() {
  return (
    <header className="pointer-events-auto fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rotate-45 border border-[#00E5FF]/60" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" style={{ boxShadow: "0 0 10px #00E5FF" }} />
          </div>
          <div className="font-display text-[11px] tracking-[0.45em] text-white/90">
            CYBERNETIC<span className="text-[#00E5FF]"> // </span>EVOLUTION
          </div>
        </div>
        <nav className="hidden items-center gap-8 font-mono text-[10px] tracking-[0.4em] text-white/50 md:flex">
          <a href="#" className="transition-colors hover:text-[#00E5FF]">CORE</a>
          <a href="#" className="transition-colors hover:text-[#00E5FF]">CITY</a>
          <a href="#" className="transition-colors hover:text-[#00E5FF]">LAB</a>
          <a href="#" className="transition-colors hover:text-[#00E5FF]">ORBIT</a>
          <a href="#" className="transition-colors hover:text-[#00E5FF]">EARTH</a>
        </nav>
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.35em] text-white/60">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FFA8]" />
          LINK SECURE
        </div>
      </div>
    </header>
  );
}

/* -------- Scene 1 Hero -------- */
function Hero() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-8 px-8">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
        <span className="h-px w-10 bg-[#00E5FF]" />
        SCENE 01 // THE AI CORE
      </div>
      <h1 className="font-display text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.9] tracking-tight text-white">
        THE FUTURE<br />
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #00E5FF" }}>ISN'T COMING.</span><br />
        IT'S <span style={{ textShadow: "0 0 40px #00E5FF" }} className="text-[#00E5FF]">ALREADY</span> HERE.
      </h1>
      <p className="max-w-xl font-sans text-lg text-white/60">
        A cinematic passage through nine worlds of the post-human age. Scroll to travel.
      </p>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Magnetic>
          <button className="group relative flex items-center gap-3 border border-[#00E5FF] bg-[#00E5FF]/10 px-8 py-4 font-display text-xs tracking-[0.35em] text-[#00E5FF] backdrop-blur transition-all hover:bg-[#00E5FF]/20" style={{ boxShadow: "0 0 30px rgba(0,229,255,.3)" }}>
            LAUNCH AI
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            <Corner />
          </button>
        </Magnetic>
        <Magnetic>
          <button className="relative flex items-center gap-3 border border-white/20 px-8 py-4 font-display text-xs tracking-[0.35em] text-white/80 backdrop-blur hover:border-white/60">
            EXPLORE
            <Corner />
          </button>
        </Magnetic>
      </div>
      <ScrollHint />
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.4em] text-white/40">
      <span>SCROLL TO ENTER</span>
      <div className="h-8 w-px overflow-hidden bg-white/10">
        <div className="h-full w-full animate-pulse bg-[#00E5FF]" />
      </div>
    </div>
  );
}

function SceneBlock({ tag, title, body, icon, side }: { tag: string; title: React.ReactNode; body: string; icon: React.ReactNode; side: "left" | "right" }) {
  return (
    <div className={`mx-auto flex max-w-[1600px] px-8 ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl">
        <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
          {icon}
          {tag}
        </div>
        <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-black leading-[0.95] tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-6 font-sans text-lg leading-relaxed text-white/60">{body}</p>
        <div className="mt-8 flex items-center gap-4 font-mono text-[10px] tracking-[0.35em] text-white/40">
          <div className="h-px w-16 bg-[#00E5FF]/60" />
          <span>READ TELEMETRY</span>
        </div>
      </div>
    </div>
  );
}

/* -------- Scene 5 Orbit -------- */
function OrbitBlock() {
  const planets = [
    { name: "ARTIFICIAL INTELLIGENCE", code: "A.I.", c: "#00E5FF" },
    { name: "ROBOTICS", code: "R.B.", c: "#6A5CFF" },
    { name: "QUANTUM COMPUTING", code: "Q.C.", c: "#00FFA8" },
    { name: "CYBER SECURITY", code: "C.S.", c: "#FF2D75" },
    { name: "HUMAN ENHANCEMENT", code: "H.E.", c: "#ffffff" },
  ];
  return (
    <div className="mx-auto max-w-[1600px] px-8">
      <div className="mb-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
        <Globe2 size={14} />
        SCENE 05 // ORBITAL DISCIPLINES
      </div>
      <h2 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,6rem)] font-black leading-[0.95] text-white">
        FIVE PLANETS.<br />
        <span className="text-[#00E5FF]">ONE SINGULARITY.</span>
      </h2>
      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-5">
        {planets.map((p, i) => (
          <div key={i} className="group relative overflow-hidden border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all hover:border-[#00E5FF]/60 hover:bg-white/[0.06]">
            <div className="font-mono text-[9px] tracking-[0.35em]" style={{ color: p.c }}>{p.code}</div>
            <div className="mt-8 font-display text-sm font-bold leading-tight tracking-wider text-white">{p.name}</div>
            <div className="mt-6 h-px w-full bg-white/10" />
            <div className="mt-3 font-mono text-[9px] tracking-[0.3em] text-white/40">0{i + 1} / 05</div>
            <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-40 blur-xl transition-opacity group-hover:opacity-90" style={{ background: p.c }} />
            <Corner />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- Scene 6 Showcase -------- */
function ShowcaseBlock() {
  const items = [
    { n: "ROBOT HEAD", i: "MK-VII" },
    { n: "CYBER HELMET", i: "AEGIS" },
    { n: "ENERGY CUBE", i: "K-9" },
    { n: "AI PROCESSOR", i: "N-CORE" },
    { n: "DRONE UNIT", i: "SWIFT" },
    { n: "QUANTUM BATTERY", i: "Q-42" },
  ];
  return (
    <div className="mx-auto max-w-[1600px] px-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
            <Boxes size={14} />
            SCENE 06 // ARSENAL
          </div>
          <h2 className="font-display text-[clamp(2rem,5vw,5rem)] font-black leading-[0.95] text-white">
            SIX ARTIFACTS.<br />
            <span className="text-[#6A5CFF]">EACH ONE ALIVE.</span>
          </h2>
        </div>
        <div className="hidden font-mono text-[10px] tracking-[0.35em] text-white/40 md:block">ROTATE → CLICK TO EXPAND</div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6">
        {items.map((it, i) => (
          <div key={i} className="group relative aspect-[3/4] overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 transition-all hover:border-[#00E5FF]/60">
            <div className="flex h-full flex-col justify-between">
              <div className="font-mono text-[9px] tracking-[0.35em] text-[#00E5FF]">{it.i}</div>
              <div>
                <div className="font-display text-xs font-bold tracking-wider text-white">{it.n}</div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.3em] text-white/30">◆ ACTIVE</div>
              </div>
            </div>
            <Corner />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- Scene 7 HUD -------- */
function HudBlock() {
  return (
    <div className="mx-auto max-w-[1600px] px-8">
      <div className="mb-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
        <Activity size={14} />
        SCENE 07 // LIVE TELEMETRY
      </div>
      <h2 className="font-display text-[clamp(2rem,5vw,5rem)] font-black leading-[0.95] text-white">
        A NERVOUS SYSTEM<br />
        <span className="text-[#00FFA8]">MADE OF LIGHT.</span>
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <HudStat label="NEURAL LOAD" v="87.4" u="%" />
        <HudStat label="CPU CYCLES" v="4.21" u="THz" />
        <HudStat label="ENERGY OUT" v="2.06" u="MW" />
        <HudStat label="LATENCY" v="0.003" u="ms" />
      </div>
    </div>
  );
}

function HudStat({ label, v, u }: { label: string; v: string; u: string }) {
  return (
    <div className="relative border border-white/10 bg-black/40 p-5 backdrop-blur">
      <div className="font-mono text-[9px] tracking-[0.35em] text-white/50">{label}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-4xl font-black tabular-nums text-white" style={{ textShadow: "0 0 20px rgba(0,229,255,.6)" }}>{v}</span>
        <span className="font-mono text-[10px] tracking-widest text-[#00E5FF]">{u}</span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden bg-white/5">
        <div className="h-full animate-pulse" style={{ width: "72%", background: "linear-gradient(90deg,#00E5FF,#6A5CFF)" }} />
      </div>
      <Corner />
    </div>
  );
}

/* -------- Finale -------- */
function Finale() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-8 text-center">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#00E5FF]">
        <SparklesIcon size={14} />
        SCENE 09 // ORIGIN
      </div>
      <h2 className="font-display text-[clamp(3rem,9vw,9rem)] font-black leading-[0.9] text-white">
        WELCOME<br />
        <span className="text-transparent" style={{ WebkitTextStroke: "1.5px #00E5FF" }}>TO</span>{" "}
        <span style={{ textShadow: "0 0 60px #6A5CFF" }} className="text-[#6A5CFF]">EVOLUTION.</span>
      </h2>
      <p className="max-w-xl font-sans text-lg text-white/60">
        The next species won't be born. It will be booted.
      </p>
      <Magnetic>
        <button className="group relative flex items-center gap-4 border border-[#00E5FF] bg-[#00E5FF]/15 px-12 py-6 font-display text-sm font-bold tracking-[0.4em] text-[#00E5FF]" style={{ boxShadow: "0 0 60px rgba(0,229,255,.5)" }}>
          ENTER THE FUTURE
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          <Corner />
        </button>
      </Magnetic>
      <div className="mt-10 flex items-center gap-6 font-mono text-[10px] tracking-[0.35em] text-white/40">
        <span>© 2087 CYBERNETIC EVOLUTION</span>
        <span>◆</span>
        <span>ALL SIGNALS RESERVED</span>
      </div>
    </div>
  );
}

function Corner() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-[#00E5FF]" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-[#00E5FF]" />
    </>
  );
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current!;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)";
      }}
      style={{ transition: "transform .3s cubic-bezier(.2,.9,.2,1)" }}
      className="inline-block"
    >
      {children}
    </div>
  );
}

export const TOTAL_PANELS = PANELS;
