import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function HudPanel({
  children,
  label,
  className,
  corners = true,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  corners?: boolean;
}) {
  return (
    <div className={cn("panel scanline p-6", corners && "panel-corner", className)}>
      {label && (
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-hud animate-pulse-glow" />
          <span className="hud-text text-[10px]">{label}</span>
          <span className="ml-auto hud-text text-[10px] opacity-60">
            SYS_OK
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function EnergyBar({
  value,
  label,
  color = "hud",
}: {
  value: number;
  label: string;
  color?: "hud" | "warn" | "accent";
}) {
  const barColor =
    color === "warn"
      ? "oklch(0.78 0.2 60)"
      : color === "accent"
      ? "oklch(0.75 0.19 55)"
      : "oklch(0.82 0.16 200)";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
        <span className="text-muted-foreground">{label}</span>
        <span style={{ color: barColor }}>{value.toString().padStart(3, "0")}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-sm bg-black/60 border border-border">
        <div
          className="h-full animate-energy-flow"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${barColor}00, ${barColor}, ${barColor}00)`,
            backgroundSize: "200% 100%",
            boxShadow: `0 0 12px ${barColor}`,
          }}
        />
      </div>
    </div>
  );
}

export function CircularHud({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex flex-col items-center">
      <svg width="110" height="110" className="-rotate-90">
        <circle
          cx="55"
          cy="55"
          r="42"
          fill="none"
          stroke="oklch(0.28 0.03 240)"
          strokeWidth="3"
        />
        <circle
          cx="55"
          cy="55"
          r="42"
          fill="none"
          stroke="var(--color-hud)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px var(--color-hud))" }}
        />
        <circle
          cx="55"
          cy="55"
          r="50"
          fill="none"
          stroke="var(--color-hud)"
          strokeOpacity="0.2"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="animate-rotate-slow origin-center"
          style={{ transformOrigin: "55px 55px" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl text-hud" style={{ textShadow: "0 0 8px var(--color-hud)" }}>
          {value}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
