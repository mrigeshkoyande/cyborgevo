import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer:coarse)").matches) return;
    const state = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2 };
    const move = (e: PointerEvent) => {
      state.x = e.clientX;
      state.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX - 3}px,${e.clientY - 3}px,0)`;
    };
    const loop = () => {
      state.rx += (state.x - state.rx) * 0.15;
      state.ry += (state.y - state.ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate3d(${state.rx - 18}px,${state.ry - 18}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[80] h-9 w-9 rounded-full border border-[#00E5FF]/60 mix-blend-screen" style={{ boxShadow: "0 0 20px rgba(0,229,255,.5)" }} />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[80] h-1.5 w-1.5 rounded-full bg-[#00E5FF] mix-blend-screen" style={{ boxShadow: "0 0 10px #00E5FF" }} />
    </>
  );
}
