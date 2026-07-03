import { useEffect, useRef } from "react";

export function TleCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(pointer:coarse)").matches) return;
    const s = { x: innerWidth / 2, y: innerHeight / 2, gx: 0, gy: 0 };
    const onMove = (e: PointerEvent) => {
      s.x = e.clientX; s.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX - 3}px,${e.clientY - 3}px,0)`;
    };
    let raf = 0;
    const loop = () => {
      s.gx += (s.x - s.gx) * 0.08;
      s.gy += (s.y - s.gy) * 0.08;
      if (glow.current) glow.current.style.transform = `translate3d(${s.gx - 170}px,${s.gy - 170}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);
  return (<>
    <div ref={glow} className="tle-cursor-glow" />
    <div ref={dot} className="tle-cursor-dot" />
  </>);
}
