import { useEffect, useRef } from "react";

export function TleParticles({ density = 60, color = "#00E5FF" }: { density?: number; color?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!; const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      pts.length = 0;
      for (let i = 0; i < density; i++)
        pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: .5 + Math.random() * 1.6 });
    };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y; const d2 = dx * dx + dy * dy;
        if (d2 < 14400) { const f = (14400 - d2) / 14400 * 0.6; p.vx += (dx / Math.sqrt(d2 + .01)) * f * .05; p.vy += (dy / Math.sqrt(d2 + .01)) * f * .05; }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.fillStyle = color; ctx.globalAlpha = .8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    resize(); seed(); loop();
    window.addEventListener("resize", () => { resize(); seed(); });
    window.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [density, color]);
  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
