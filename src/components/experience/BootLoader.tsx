import { useEffect, useState } from "react";

const STEPS = [
  "SYSTEM BOOTING",
  "LOADING NEURAL CORE",
  "INITIALIZING QUANTUM PROCESSOR",
  "CALIBRATING SENSORS",
  "LOADING AI MEMORY",
  "CONNECTING SATELLITE GRID",
  "AUTHENTICATION COMPLETE",
];

export function BootLoader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [step, setStep] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 3800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setPct(Math.round(eased * 100));
      setStep(Math.min(STEPS.length - 1, Math.floor(eased * STEPS.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => setGone(true), 400);
        setTimeout(onDone, 1100);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#060606] transition-opacity duration-700 ${
        gone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={gone}
    >
      {/* grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.08) 1px,transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse at center,#000 30%,transparent 75%)",
        }}
      />
      {/* rotating ring */}
      <div className="relative flex h-[420px] w-[420px] items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 animate-rotate-slow">
          <circle cx="100" cy="100" r="96" fill="none" stroke="#00E5FF" strokeOpacity=".2" strokeWidth=".5" strokeDasharray="1 4" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#00E5FF" strokeOpacity=".35" strokeWidth=".3" strokeDasharray="20 6" />
        </svg>
        <svg viewBox="0 0 200 200" className="absolute inset-0" style={{ animation: "rotate-slow 12s linear infinite reverse" }}>
          <circle cx="100" cy="100" r="70" fill="none" stroke="#6A5CFF" strokeOpacity=".5" strokeWidth=".4" strokeDasharray="2 3" />
        </svg>
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="font-mono text-[10px] tracking-[0.5em] text-[#00E5FF]/70">
            CYBERNETIC EVOLUTION // BOOT SEQUENCE
          </div>
          <div className="font-display text-7xl font-black tracking-tight text-white tabular-nums" style={{ textShadow: "0 0 30px rgba(0,229,255,.6)" }}>
            {String(pct).padStart(3, "0")}
            <span className="text-2xl text-[#00E5FF]">%</span>
          </div>
          <div className="h-[2px] w-64 overflow-hidden bg-white/10">
            <div
              className="h-full transition-[width] duration-100"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#00E5FF,#6A5CFF,#00FFA8)",
                boxShadow: "0 0 12px #00E5FF",
              }}
            />
          </div>
          <div className="mt-2 flex h-4 items-center gap-2 font-mono text-[10px] tracking-[0.35em] text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-[#00FFA8]" />
            {STEPS[step]}
          </div>
        </div>
      </div>
      {/* corner labels */}
      <div className="pointer-events-none absolute inset-6 flex flex-col justify-between font-mono text-[10px] tracking-[0.35em] text-white/40">
        <div className="flex justify-between">
          <span>◤ NODE_00A</span>
          <span>QUANTUM_LINK ▲</span>
        </div>
        <div className="flex justify-between">
          <span>LAT 00.0000 // LON 00.0000</span>
          <span>◢ CHANNEL SECURED</span>
        </div>
      </div>
    </div>
  );
}
