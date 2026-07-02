import { createFileRoute } from "@tanstack/react-router";
import cyborgHero from "@/assets/cyborg-hero.jpg";
import cyborgEye from "@/assets/cyborg-eye.jpg";
import cyborgArm from "@/assets/cyborg-arm.jpg";
import { HudPanel, EnergyBar, CircularHud } from "@/components/HudPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CYBORG // EVOLUTION — Next-Gen Human Augmentation" },
      {
        name: "description",
        content:
          "Enter the next stage of evolution. Neural enhancement, kinetic augmentation, and diagnostic HUD systems for the post-human era.",
      },
      { property: "og:title", content: "CYBORG // EVOLUTION" },
      {
        property: "og:description",
        content: "Neural enhancement and kinetic augmentation for the post-human era.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md">
      <div className="border-b border-border/60 bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center border border-hud/60">
              <div className="h-2 w-2 bg-hud animate-pulse-glow" />
              <div className="panel-corner absolute inset-0" />
            </div>
            <span className="font-display text-sm tracking-[0.3em]">
              CYBORG<span className="text-hud">//EVO</span>
            </span>
          </a>
          <nav className="hidden gap-8 md:flex">
            {["System", "Enhancements", "Diagnostics", "Protocol"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-hud"
              >
                {l}
              </a>
            ))}
          </nav>
          <button className="btn-tactile rounded-md px-4 py-2 text-[11px]">
            Initiate
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="system" className="relative min-h-screen overflow-hidden pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-hud animate-pulse-glow" />
            <span className="hud-text text-[10px]">MODEL_UNIT-07 // ONLINE</span>
          </div>
          <h1 className="font-display text-5xl leading-[0.9] md:text-7xl">
            The next
            <br />
            <span className="text-hud" style={{ textShadow: "0 0 24px var(--color-hud)" }}>
              evolution
            </span>
            <br />
            of humankind.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Fully integrated neural, kinetic, and sensory augmentation. Engineered for
            operators who refuse the limits of biology.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary-hud rounded-md px-8 py-3 text-sm">
              Begin Integration
            </button>
            <button className="btn-tactile rounded-md px-8 py-3 text-sm">
              View Specs
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-8">
            {[
              { v: "99.7", l: "Sync Rate" },
              { v: "0.8ms", l: "Neural Latency" },
              { v: "24/7", l: "Uptime" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-hud/60 pl-3">
                <div className="font-display text-2xl text-hud">{s.v}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="panel panel-corner scanline overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b border-border bg-black/40 px-4 py-2">
              <span className="hud-text text-[10px]">LIVE_FEED // CAM-03</span>
              <span className="hud-text text-[10px] animate-hud-blink text-destructive">
                ● REC
              </span>
            </div>
            <div className="relative">
              <img
                src={cyborgHero}
                alt="Cyborg unit 07"
                width={1280}
                height={1280}
                className="w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
              <div className="absolute left-4 top-4 space-y-2">
                <div className="hud-text bg-black/70 px-2 py-1 text-[9px]">
                  ID: 07-ΩX
                </div>
                <div className="hud-text bg-black/70 px-2 py-1 text-[9px]">
                  CLASS: KINETIC
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                <CircularHud value={97} label="Vitals" />
              </div>
              <div className="absolute bottom-4 left-4 w-40 space-y-2">
                <EnergyBar value={87} label="Power" />
                <EnergyBar value={62} label="Coolant" color="warn" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 border-r-2 border-t-2 border-hud/40" />
          <div className="absolute -left-6 -top-6 h-24 w-24 border-b-2 border-l-2 border-hud/40" />
        </div>
      </div>
    </section>
  );
}

function Enhancements() {
  const items = [
    {
      code: "ENH-01",
      title: "Neural Cortex",
      desc: "Direct neural interface with sub-millisecond thought-to-action translation. Cognitive throughput multiplied by 400%.",
      stats: [
        { label: "Bandwidth", value: 94 },
        { label: "Recall", value: 88 },
      ],
      img: cyborgEye,
    },
    {
      code: "ENH-02",
      title: "Kinetic Frame",
      desc: "Titanium-carbon composite exoskeleton with hydraulic assist. Load capacity: 2.4 metric tons. Fatigue: null.",
      stats: [
        { label: "Torque", value: 76 },
        { label: "Endurance", value: 99 },
      ],
      img: cyborgArm,
    },
    {
      code: "ENH-03",
      title: "Sensory Array",
      desc: "Multi-spectral vision, thermal overlay, and battlefield augmented reality feed. Blind spots eliminated.",
      stats: [
        { label: "Range", value: 82 },
        { label: "Resolution", value: 91 },
      ],
      img: cyborgHero,
    },
  ];

  return (
    <section id="enhancements" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="hud-text mb-3 text-xs">// 02_ENHANCEMENTS</div>
            <h2 className="font-display text-4xl md:text-5xl">
              Modular Augmentation
            </h2>
          </div>
          <div className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:block">
            SELECT_LOADOUT →
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <HudPanel key={it.code} label={it.code} className="group cursor-pointer transition-all hover:-translate-y-1">
              <div className="relative mb-4 h-40 overflow-hidden rounded-sm border border-border">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <h3 className="mb-2 font-display text-xl text-hud">{it.title}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{it.desc}</p>
              <div className="space-y-3">
                {it.stats.map((s) => (
                  <EnergyBar key={s.label} {...s} />
                ))}
              </div>
            </HudPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diagnostics() {
  return (
    <section id="diagnostics" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <div className="hud-text mb-3 text-xs">// 03_DIAGNOSTICS</div>
          <h2 className="font-display text-4xl md:text-5xl">Real-Time Telemetry</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <HudPanel label="VITALS_MONITOR" className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-6 py-4">
              <CircularHud value={87} label="Heart" />
              <CircularHud value={94} label="O₂ Sat" />
              <CircularHud value={72} label="Neural" />
              <CircularHud value={99} label="Sync" />
            </div>
          </HudPanel>

          <HudPanel label="POWER_GRID" className="lg:col-span-2">
            <div className="space-y-5 py-2">
              <EnergyBar value={92} label="Core Reactor" />
              <EnergyBar value={78} label="Kinetic Servos" />
              <EnergyBar value={54} label="Coolant Loop" color="warn" />
              <EnergyBar value={88} label="Neural Bus" color="accent" />
              <EnergyBar value={66} label="Shield Matrix" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                { l: "CPU LOAD", v: "34%" },
                { l: "MEM ALLOC", v: "12.4 TB" },
                { l: "THREADS", v: "8,192" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.l}
                  </div>
                  <div className="mt-1 font-display text-xl text-hud">{s.v}</div>
                </div>
              ))}
            </div>
          </HudPanel>
        </div>
      </div>
    </section>
  );
}

function Protocol() {
  return (
    <section id="protocol" className="relative py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="hud-text mb-6 text-xs">// 04_PROTOCOL</div>
        <h2 className="font-display text-4xl md:text-6xl">
          Are you ready to <span className="text-hud" style={{ textShadow: "0 0 24px var(--color-hud)" }}>upgrade</span>?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Integration is irreversible. Applicants undergo 72 hours of neural
          calibration. Only 3% of candidates are cleared for full deployment.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="btn-primary-hud rounded-md px-10 py-4 text-sm">
            Submit Application
          </button>
          <button className="btn-tactile rounded-md px-10 py-4 text-sm">
            Download Dossier
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["01", "Screening"],
            ["02", "Calibration"],
            ["03", "Integration"],
            ["04", "Deployment"],
          ].map(([n, l]) => (
            <div key={n} className="panel panel-corner p-4 text-left">
              <div className="hud-text text-xs">STEP_{n}</div>
              <div className="mt-2 font-display text-lg">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-black/40 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2087 CYBORG//EVOLUTION • ALL SYSTEMS NOMINAL
        </div>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-hud">Charter</a>
          <a href="#" className="hover:text-hud">Ethics</a>
          <a href="#" className="hover:text-hud">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Enhancements />
      <Diagnostics />
      <Protocol />
      <Footer />
    </div>
  );
}
