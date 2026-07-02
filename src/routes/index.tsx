import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { Experience } from "@/components/experience/Experience";
import { Overlay, TOTAL_PANELS } from "@/components/experience/Overlay";
import { BootLoader } from "@/components/experience/BootLoader";
import { Cursor } from "@/components/experience/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cybernetic Evolution — The Future Begins Beyond Humanity" },
      {
        name: "description",
        content:
          "An immersive cinematic 3D journey through nine worlds of AI, robotics, and human enhancement. Scroll to travel.",
      },
      { property: "og:title", content: "Cybernetic Evolution" },
      { property: "og:description", content: "The Future Begins Beyond Humanity. A cinematic 3D web experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [booted, setBooted] = useState(false);
  const scroll = useRef(0);

  // Lenis smooth scroll + scroll progress tracking
  useEffect(() => {
    if (!booted) return;
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [booted]);

  return (
    <main className="relative bg-[#060606] text-white">
      <Cursor />
      {!booted && <BootLoader onDone={() => setBooted(true)} />}

      {/* Fixed 3D canvas */}
      <div className="fixed inset-0 z-0">
        <Experience scroll={scroll} />
      </div>

      {/* Global scanlines + vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
        style={{
          background:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,.12) 3px,rgba(0,0,0,.12) 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.75) 100%)" }}
      />

      {/* Scroll spine — panels drive the scene camera via scroll ref */}
      <div style={{ height: `${TOTAL_PANELS * 100}vh` }} className="relative">
        <div className="fixed inset-0 z-10 overflow-hidden">
          <Overlay />
        </div>
      </div>

      {/* Side HUD rails */}
      <SideRails />
    </main>
  );
}

function SideRails() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scene = Math.min(TOTAL_PANELS, Math.floor(pct * TOTAL_PANELS) + 1);
  return (
    <>
      <div className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex">
        <div className="font-mono text-[9px] tracking-[0.4em] text-white/40 [writing-mode:vertical-rl] rotate-180">
          SCENE {String(scene).padStart(2, "0")} / {String(TOTAL_PANELS).padStart(2, "0")}
        </div>
        <div className="h-40 w-px bg-white/10">
          <div className="w-px bg-[#00E5FF]" style={{ height: `${pct * 100}%`, boxShadow: "0 0 10px #00E5FF" }} />
        </div>
      </div>
      <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex">
        <div className="font-mono text-[9px] tracking-[0.4em] text-white/40">TELEMETRY</div>
        {Array.from({ length: TOTAL_PANELS }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em]">
            <span className={i + 1 === scene ? "text-[#00E5FF]" : "text-white/30"}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`h-px transition-all ${i + 1 === scene ? "w-8 bg-[#00E5FF]" : "w-3 bg-white/20"}`} />
          </div>
        ))}
      </div>
    </>
  );
}
