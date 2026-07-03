import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";

import mountains from "@/assets/scene-mountains.jpg";
import city from "@/assets/scene-city.jpg";
import cyberpunk from "@/assets/scene-cyberpunk.jpg";
import data from "@/assets/scene-data.jpg";
import core from "@/assets/scene-core.jpg";
import space from "@/assets/scene-space.jpg";
import quantum from "@/assets/scene-quantum.jpg";
import newera from "@/assets/scene-newera.jpg";

import { TleCursor } from "@/components/tle/Cursor";
import { TleParticles } from "@/components/tle/Particles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Last Evolution — Every Scroll Takes You Further Into the Future" },
      { name: "description", content: "An immersive cinematic parallax journey from Earth to a new civilization powered by artificial intelligence." },
      { property: "og:image", content: "https://cyborgevo.lovable.app" },
    ],
    links: [{ rel: "preload", as: "image", href: mountains, fetchpriority: "high" } as never],
  }),
  component: LastEvolution,
});

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Layer({
  src, className = "", style, alt = "",
}: { src?: string; className?: string; style?: React.CSSProperties; alt?: string }) {
  return (
    <div
      data-parallax
      className={`absolute inset-0 will-change-transform ${className}`}
      style={{
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        ...style,
      }}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    />
  );
}

function Chapter({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="font-mono text-[11px] tracking-[.4em] text-[#00E5FF]">CHAPTER {n}</span>
      <div className="h-px w-16 bg-gradient-to-r from-[#00E5FF] to-transparent" />
      <span className="font-mono text-[11px] tracking-[.35em] text-[#A9A9A9]">{title}</span>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >{children}</motion.div>
  );
}

function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}
          className="absolute top-0 h-[140%] w-[3px] origin-top"
          style={{
            left: `${20 + i * 20}%`,
            transform: `rotate(${-8 + i * 3}deg)`,
            background: "linear-gradient(to bottom, rgba(255,220,150,.35), transparent 70%)",
            filter: "blur(4px)",
            animation: `tle-shimmer ${4 + i}s ease-in-out infinite`,
          }} />
      ))}
    </div>
  );
}

function Stars({ n = 120 }: { n?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="tle-star" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random(),
          animationDelay: `${Math.random() * 4}s`,
          transform: `scale(${.5 + Math.random() * 1.5})`,
        }} />
      ))}
    </div>
  );
}

function Rain() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 90 }).map((_, i) => (
        <span key={i} className="absolute -top-20 w-px h-16 bg-gradient-to-b from-transparent via-[#00E5FF]/60 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `tle-rain ${.7 + Math.random()}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: .3 + Math.random() * .5,
          }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

function LastEvolution() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, lerp: 0.09 });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);

    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Parallax on every [data-parallax]
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = parseFloat(el.dataset.depth || "0.3");
        gsap.fromTo(el, { yPercent: -depth * 30 }, {
          yPercent: depth * 40,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-scene]"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Scene crossfades (each scene has data-scene and inner .scene-inner)
      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((scene) => {
        const inner = scene.querySelector<HTMLElement>(".scene-inner");
        if (!inner) return;
        gsap.fromTo(inner, { opacity: 0 }, {
          opacity: 1,
          scrollTrigger: {
            trigger: scene, start: "top 80%", end: "top 30%", scrub: true,
          },
        });
        gsap.to(inner, {
          opacity: 0,
          scrollTrigger: { trigger: scene, start: "bottom 70%", end: "bottom 20%", scrub: true },
        });
      });

      // Camera zoom on core scene
      gsap.to("[data-zoom]", {
        scale: 1.4,
        ease: "none",
        scrollTrigger: { trigger: "[data-zoom]", start: "top bottom", end: "bottom top", scrub: true },
      });

      // Progress rail
      gsap.to("#tle-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, rootRef);

    return () => { ctx.revert(); lenis.destroy(); };
  }, []);

  return (
    <div ref={rootRef} className="tle-root relative">
      <TleCursor />
      <div className="tle-noise" />
      <div className="tle-vignette" />

      {/* Top HUD */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]" />
          <span className="font-mono text-[11px] tracking-[.4em] text-white/80">T.L.E — 2087</span>
        </div>
        <nav className="hidden gap-8 font-mono text-[11px] tracking-[.35em] text-white/70 md:flex">
          <span>PRESENT</span><span>CITY</span><span>CORE</span><span>SPACE</span><span>TOMORROW</span>
        </nav>
        <span className="font-mono text-[11px] tracking-[.4em] text-white/60">SCROLL ↓</span>
      </header>

      {/* Progress rail */}
      <div className="fixed right-6 top-1/2 z-50 hidden h-[40vh] w-px -translate-y-1/2 bg-white/10 md:block">
        <div id="tle-progress" className="h-full w-full origin-top scale-y-0 bg-gradient-to-b from-[#00E5FF] via-[#7B61FF] to-[#FF4D8D]" />
      </div>

      {/* -------------------- SCENE 1 : THE PRESENT -------------------- */}
      <section data-scene className="relative h-[160vh] w-full overflow-hidden bg-[#040404]">
        <Layer src={mountains} data-depth="0.15" className="scale-110 opacity-90" alt="Misty mountains at sunrise" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#040404]" />
        <div data-parallax data-depth="0.5" className="absolute inset-0">
          <LightRays />
        </div>
        {/* birds */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <span key={i}
              className="absolute text-white/60"
              style={{
                top: `${18 + i * 6}%`, fontSize: 18,
                animation: `tle-drift-x ${28 + i * 8}s linear infinite`,
                animationDelay: `${i * 6}s`,
              }}>˅ ˅</span>
          ))}
        </div>
        {/* foreground silhouette */}
        <div data-parallax data-depth="0.9" className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to top, #040404 20%, transparent), radial-gradient(ellipse at bottom, rgba(0,0,0,.9), transparent 70%)",
          }}>
          <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-full w-full">
            <path d="M0,300 L0,180 C120,150 200,90 320,110 C440,130 500,60 620,80 C740,100 820,40 940,70 C1060,100 1160,50 1280,80 C1360,100 1440,120 1440,120 L1440,300 Z"
              fill="#040404" />
            {/* pine silhouettes */}
            {Array.from({ length: 14 }).map((_, i) => (
              <polygon key={i}
                points={`${80 + i * 100},${230 - (i % 3) * 20} ${100 + i * 100},${170 - (i % 3) * 20} ${120 + i * 100},${230 - (i % 3) * 20}`}
                fill="#020202" />
            ))}
          </svg>
        </div>

        <div className="scene-inner absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Chapter n="I" title="THE PRESENT" />
          <h1 className="max-w-5xl text-5xl font-light leading-[1.05] md:text-8xl">
            The Future Begins<br />
            <span className="italic text-[#00E5FF]">With A Single Step.</span>
          </h1>
          <p className="mt-8 max-w-md text-sm tracking-[.3em] text-[#A9A9A9]">SCROLL TO BEGIN YOUR JOURNEY</p>
          <div className="mt-10 flex flex-col items-center gap-2 text-[#00E5FF]">
            <span style={{ animation: "tle-bounce-y 2s ease-in-out infinite" }} className="text-2xl">↓</span>
          </div>
        </div>
      </section>

      {/* -------------------- SCENE 2 : DIGITAL AGE -------------------- */}
      <section data-scene className="relative h-[140vh] w-full overflow-hidden">
        <Layer src={city} data-depth="0.15" className="opacity-90" alt="Futuristic city at dusk" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040404]/60 via-transparent to-[#040404]" />
        <Rain />
        {/* horizontal cars */}
        <div className="pointer-events-none absolute inset-0">
          {[65, 72, 80].map((top, i) => (
            <span key={i} className="absolute h-[2px] w-24 rounded-full"
              style={{
                top: `${top}%`,
                background: i % 2 ? "linear-gradient(90deg, transparent, #FF4D8D, transparent)" : "linear-gradient(90deg, transparent, #00E5FF, transparent)",
                animation: `tle-drift-x ${8 + i * 2}s linear infinite`,
                animationDelay: `${i * 2}s`,
                filter: "blur(1px)",
              }} />
          ))}
        </div>
        {/* neon foreground signs */}
        <div data-parallax data-depth="0.85" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[6%] top-[30%] rotate-[-6deg] font-mono text-3xl text-[#FF4D8D]" style={{ textShadow: "0 0 20px #FF4D8D" }}>覚醒</div>
          <div className="absolute right-[8%] top-[22%] rotate-[4deg] font-mono text-2xl text-[#00E5FF]" style={{ textShadow: "0 0 20px #00E5FF" }}>NEO_2087</div>
          <div className="absolute right-[14%] top-[55%] font-mono text-xl text-[#00FFA8]" style={{ textShadow: "0 0 16px #00FFA8" }}>◆ SYSTEM ONLINE</div>
        </div>

        <div className="scene-inner absolute inset-0 flex items-center justify-center px-6">
          <div className="grid max-w-6xl grid-cols-1 items-end gap-16 md:grid-cols-2">
            <div>
              <Chapter n="II" title="THE DIGITAL AGE" />
              <h2 className="text-4xl font-light leading-tight md:text-7xl">
                Cities learned<br />to <span className="text-[#7B61FF] italic">breathe</span>.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[#A9A9A9] md:text-lg">
              Steel became sensor. Glass became screen. Every window a pulse, every road a nerve.
              The machines did not arrive — the city itself opened its eyes.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------- SCENE 3 : AI CITY -------------------- */}
      <section data-scene className="relative h-[150vh] w-full overflow-hidden">
        <Layer src={cyberpunk} data-depth="0.1" className="opacity-95" alt="Cyberpunk AI city" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(4,4,4,.85) 80%)" }} />
        {/* fog drift */}
        <div data-parallax data-depth="0.6" className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(123,97,255,.12), transparent 40%, rgba(0,229,255,.14) 90%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(180deg, transparent, #00E5FF20 50%, transparent)", animation: "tle-shimmer 3s ease-in-out infinite" }} />

        <div className="scene-inner absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Chapter n="III" title="THE AI CITY" />
          <Reveal>
            <h2 className="max-w-5xl text-5xl font-light md:text-8xl">
              A skyline<br /><span className="text-[#00E5FF]">alive with thought.</span>
            </h2>
          </Reveal>
          <Reveal delay={.15}>
            <div className="mt-16 grid grid-cols-3 gap-8 font-mono text-[11px] tracking-[.3em] text-white/70 md:gap-24">
              <div><div className="text-3xl text-[#00E5FF]">4.2M</div>NEURAL LINKS</div>
              <div><div className="text-3xl text-[#7B61FF]">98.7%</div>UPTIME</div>
              <div><div className="text-3xl text-[#00FFA8]">∞</div>ITERATIONS</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------- SCENE 4 : DATA STREAM -------------------- */}
      <section data-scene className="relative h-[140vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[#040404]" />
        <div data-parallax data-depth="0.2" data-zoom className="absolute inset-0">
          <img src={data} alt="Cyberspace data stream" className="h-full w-full object-cover opacity-70" />
        </div>
        <div className="absolute inset-0 tle-grid-bg opacity-60" />
        <TleParticles density={90} color="#00E5FF" />
        {/* binary streams */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden font-mono text-[10px] text-[#00FFA8]/50">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute top-0 whitespace-nowrap"
              style={{
                left: `${i * 9}%`,
                animation: `tle-rain ${6 + Math.random() * 6}s linear infinite`,
                animationDelay: `${Math.random() * 4}s`,
                writingMode: "vertical-rl",
              }}>
              01001010 11010011 00110101 10110100 01001010 11010011 00110101
            </div>
          ))}
        </div>

        <div className="scene-inner absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <Chapter n="IV" title="THE DATA STREAM" />
            <h2 className="text-4xl font-light leading-tight md:text-7xl">
              We stopped writing code.<br />
              <span className="italic text-[#00FFA8]">Code started writing us.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* -------------------- SCENE 5 : AI CORE -------------------- */}
      <section data-scene className="relative h-[160vh] w-full overflow-hidden bg-black">
        <Layer src={core} data-depth="0.1" className="opacity-95" alt="Glowing AI core sphere" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 30%, #040404 75%)" }} />
        {/* orbital rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[300, 460, 620].map((s, i) => (
            <div key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: s, height: s,
                borderColor: i === 0 ? "#00E5FF" : i === 1 ? "#7B61FF" : "#FF4D8D",
                opacity: .35,
                animation: `tle-spin-slow ${20 + i * 12}s linear infinite ${i % 2 ? "reverse" : ""}`,
                boxShadow: `0 0 40px ${i === 0 ? "#00E5FF" : i === 1 ? "#7B61FF" : "#FF4D8D"}40`,
              }} />
          ))}
        </div>

        <div className="scene-inner absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Chapter n="V" title="THE AI CORE" />
          <Reveal>
            <h2 className="max-w-5xl text-5xl font-light md:text-8xl">
              Intelligence<br />
              <span className="text-[#FFB347]" style={{ textShadow: "0 0 40px #FFB34780" }}>Without Limits.</span>
            </h2>
          </Reveal>
          <Reveal delay={.2}>
            <p className="mt-8 max-w-xl text-[#A9A9A9]">
              A mind of light. A pulse of will. Every question ever asked, answered before it is spoken.
            </p>
          </Reveal>
          <Reveal delay={.35}>
            <div className="mt-10 flex gap-4">
              <button className="group relative overflow-hidden rounded-full border border-[#00E5FF]/60 px-8 py-4 font-mono text-xs tracking-[.35em] text-[#00E5FF] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_#00E5FF80]"
                style={{ background: "linear-gradient(180deg, rgba(0,229,255,.08), transparent)" }}>
                INITIATE CORE
              </button>
              <button className="rounded-full border border-white/20 px-8 py-4 font-mono text-xs tracking-[.35em] text-white/80 transition-all hover:-translate-y-0.5 hover:border-white/60">
                LEARN MORE
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------- SCENE 6 : SPACE ASCENT -------------------- */}
      <section data-scene className="relative h-[160vh] w-full overflow-hidden bg-black">
        <div data-parallax data-depth="0.1" className="absolute inset-0"><Stars n={200} /></div>
        <Layer src={space} data-depth="0.25" className="opacity-90" alt="View from space, Earth and Milky Way" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        {/* asteroids fast */}
        <div data-parallax data-depth="0.9" className="pointer-events-none absolute inset-0">
          {[15, 40, 70].map((t, i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-white/70"
              style={{
                top: `${t}%`, left: `${i * 30}%`,
                boxShadow: "0 0 20px #fff, 40px 0 30px #fff",
              }} />
          ))}
        </div>

        <div className="scene-inner absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <Chapter n="VI" title="THE SPACE ASCENT" />
            <h2 className="text-4xl font-light leading-tight md:text-7xl">
              Earth grew <span className="text-[#7B61FF] italic">smaller.</span><br />
              Everything else grew <span className="text-[#00E5FF] italic">infinite.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* -------------------- SCENE 7 : QUANTUM WORLD -------------------- */}
      <section data-scene className="relative h-[140vh] w-full overflow-hidden">
        <Layer src={quantum} data-depth="0.15" className="opacity-90" alt="Quantum world of floating crystals" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 10%, rgba(4,4,4,.7) 80%)" }} />
        {/* floating crystals */}
        <div className="pointer-events-none absolute inset-0">
          {[
            { l: 12, t: 24, s: 60, c: "#FF4D8D" },
            { l: 78, t: 20, s: 80, c: "#00E5FF" },
            { l: 22, t: 70, s: 46, c: "#7B61FF" },
            { l: 68, t: 66, s: 70, c: "#00FFA8" },
          ].map((c, i) => (
            <div key={i} className="absolute"
              style={{
                left: `${c.l}%`, top: `${c.t}%`, width: c.s, height: c.s,
                transform: `rotate(45deg)`,
                background: `linear-gradient(135deg, ${c.c}66, transparent)`,
                border: `1px solid ${c.c}`,
                boxShadow: `0 0 40px ${c.c}80, inset 0 0 20px ${c.c}40`,
                animation: `tle-float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * .4}s`,
              }} />
          ))}
        </div>

        <div className="scene-inner absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-4xl">
            <Chapter n="VII" title="THE QUANTUM WORLD" />
            <h2 className="text-4xl font-light leading-tight md:text-7xl">
              Reality became <span className="italic text-[#FF4D8D]">a language</span><br />
              anyone could rewrite.
            </h2>
          </div>
        </div>
      </section>

      {/* -------------------- FINAL : THE NEW ERA -------------------- */}
      <section data-scene className="relative h-[180vh] w-full overflow-hidden bg-black">
        <div data-parallax data-depth="0.1" className="absolute inset-0"><Stars n={260} /></div>
        <Layer src={newera} data-depth="0.2" className="opacity-90" alt="Floating city above Earth" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#040404]" />
        {/* aurora */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background: "conic-gradient(from 180deg at 50% 100%, transparent, rgba(0,255,168,.25), rgba(123,97,255,.25), rgba(255,77,141,.2), transparent 60%)",
            filter: "blur(60px)",
            opacity: .6,
          }} />

        <div className="scene-inner absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Chapter n="VIII" title="THE NEW ERA" />
          <Reveal>
            <h2 className="text-6xl font-light leading-[.95] md:text-[10rem]">
              Welcome<br />To <span className="italic bg-gradient-to-r from-[#00E5FF] via-[#7B61FF] to-[#FF4D8D] bg-clip-text text-transparent">Tomorrow.</span>
            </h2>
          </Reveal>
          <Reveal delay={.25}>
            <p className="mt-10 max-w-lg text-sm tracking-[.3em] text-[#A9A9A9]">
              THE LAST EVOLUTION IS NOT AN ENDING. IT IS THE FIRST MORNING OF EVERYTHING NEW.
            </p>
          </Reveal>
          <Reveal delay={.4}>
            <button className="group relative mt-14 overflow-hidden rounded-full px-12 py-6 font-mono text-sm tracking-[.4em] text-black transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, #00E5FF, #7B61FF 50%, #FF4D8D)",
                boxShadow: "0 20px 80px rgba(0,229,255,.45), 0 0 60px rgba(255,77,141,.35)",
              }}>
              <span className="relative z-10">BEGIN THE FUTURE →</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </Reveal>
        </div>

        <footer className="absolute inset-x-0 bottom-0 flex items-center justify-between px-8 py-8 font-mono text-[10px] tracking-[.4em] text-white/40">
          <span>© 2087 — THE LAST EVOLUTION</span>
          <span>CH. VIII / VIII</span>
          <span>MADE FOR TECHFEST</span>
        </footer>
      </section>
    </div>
  );
}
