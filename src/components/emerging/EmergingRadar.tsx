"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdoptionHorizon, EmergingCapability } from "@/lib/types";

const horizonColor: Record<AdoptionHorizon, string> = {
  now: "#22c55e",
  next: "#3b82f6",
  later: "#a855f7",
  watch: "#94a3b8",
};

const horizonLabel: Record<AdoptionHorizon, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
  watch: "Watch",
};

const W = 760;
const H = 440;
const M = { top: 32, right: 40, bottom: 48, left: 64 };

type Placed = {
  item: EmergingCapability;
  cx: number;
  cy: number;
  r: number;
  labelX: number;
  labelY: number;
  anchor: "start" | "end";
};

export function EmergingRadar({ items }: { items: EmergingCapability[] }) {
  const [hover, setHover] = useState<string | null>(null);

  const placed: Placed[] = useMemo(() => {
    const xFor = (v: number) => M.left + v * (W - M.left - M.right);
    const yFor = (v: number) => H - M.bottom - v * (H - M.top - M.bottom);
    const midX = (W - M.left - M.right) / 2 + M.left;

    // First pass: positions and dot radius.
    const initial = items.map((item) => {
      const cx = xFor(item.likelihood);
      const cy = yFor(item.impact);
      const r = 7 + item.urgency * 9;
      const onRight = cx > midX;
      return {
        item,
        cx,
        cy,
        r,
        anchor: (onRight ? "end" : "start") as "start" | "end",
        labelX: onRight ? cx - r - 8 : cx + r + 8,
        labelY: cy + 4,
      };
    });

    // Second pass: simple greedy de-overlap of labels.
    // Sort by y, then nudge any label that's within 18px of a previous one.
    const sorted = [...initial].sort((a, b) => a.cy - b.cy);
    const adjusted: Placed[] = [];
    for (const p of sorted) {
      let y = p.labelY;
      // Only collide with labels on the same side.
      const sameSide = adjusted.filter((q) => q.anchor === p.anchor);
      // Find the closest label above with overlap; push this one down.
      let collision = true;
      let safety = 0;
      while (collision && safety < 12) {
        collision = false;
        for (const q of sameSide) {
          if (Math.abs(q.labelY - y) < 18 && Math.abs(q.cx - p.cx) < 220) {
            y = q.labelY + 18;
            collision = true;
          }
        }
        safety += 1;
      }
      adjusted.push({ ...p, labelY: y });
    }
    return adjusted;
  }, [items]);

  const gridX = [0.25, 0.5, 0.75];
  const gridY = [0.25, 0.5, 0.75];

  return (
    <div className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
      <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">
            Likelihood × enterprise impact
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Larger dot · greater urgency. Colour · adoption horizon.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-ink-500">
          {(Object.keys(horizonLabel) as AdoptionHorizon[]).map((h) => (
            <span key={h} className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: horizonColor[h] }}
              />
              {horizonLabel[h]}
            </span>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Emerging capabilities radar"
      >
        <rect
          x={M.left}
          y={M.top}
          width={W - M.left - M.right}
          height={H - M.top - M.bottom}
          fill="#f6f7fb"
          rx={10}
        />
        {gridX.map((g) => {
          const x = M.left + g * (W - M.left - M.right);
          return (
            <line
              key={`gx-${g}`}
              x1={x}
              x2={x}
              y1={M.top}
              y2={H - M.bottom}
              stroke="#e2e6f0"
              strokeDasharray="3 3"
            />
          );
        })}
        {gridY.map((g) => {
          const y = H - M.bottom - g * (H - M.top - M.bottom);
          return (
            <line
              key={`gy-${g}`}
              x1={M.left}
              x2={W - M.right}
              y1={y}
              y2={y}
              stroke="#e2e6f0"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Axis labels */}
        <text
          x={(M.left + W - M.right) / 2}
          y={H - 14}
          fontSize={11}
          fill="#525a72"
          fontWeight={500}
          textAnchor="middle"
        >
          Likelihood of adoption →
        </text>
        <text
          transform={`rotate(-90 18 ${(M.top + H - M.bottom) / 2})`}
          x={18}
          y={(M.top + H - M.bottom) / 2}
          fontSize={11}
          fill="#525a72"
          fontWeight={500}
          textAnchor="middle"
        >
          Enterprise impact →
        </text>

        {/* Subtle quadrant hints in corners */}
        <text
          x={W - M.right - 8}
          y={M.top + 16}
          fontSize={10}
          fill="#b1b8cc"
          textAnchor="end"
          fontWeight={500}
        >
          High impact · high likelihood
        </text>
        <text
          x={M.left + 8}
          y={H - M.bottom - 8}
          fontSize={10}
          fill="#b1b8cc"
          fontWeight={500}
        >
          Low impact · low likelihood
        </text>

        {/* Dots */}
        {placed.map((p) => {
          const isHover = hover === p.item.id;
          const fill = horizonColor[p.item.horizon];
          return (
            <g key={p.item.id}>
              <Link href={`/emerging/${p.item.id}`}>
                <g
                  onMouseEnter={() => setHover(p.item.id)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r + 5}
                    fill={fill}
                    opacity={isHover ? 0.22 : 0.1}
                  />
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill={fill}
                    opacity={0.92}
                    stroke="white"
                    strokeWidth={1.8}
                  />
                </g>
              </Link>
            </g>
          );
        })}

        {/* Labels rendered after dots so they sit on top */}
        {placed.map((p) => {
          const isHover = hover === p.item.id;
          const text = p.item.name;
          const padX = 6;
          const padY = 3;
          const charW = 6.2;
          const textW = Math.max(40, text.length * charW);
          const boxW = textW + padX * 2;
          const boxH = 18;
          const boxX = p.anchor === "end" ? p.labelX - boxW : p.labelX;
          const boxY = p.labelY - boxH / 2 - 1;
          return (
            <g
              key={`label-${p.item.id}`}
              onMouseEnter={() => setHover(p.item.id)}
              onMouseLeave={() => setHover(null)}
              style={{ pointerEvents: "none" }}
            >
              <rect
                x={boxX}
                y={boxY}
                width={boxW}
                height={boxH}
                rx={5}
                fill={isHover ? "#171b27" : "white"}
                stroke={isHover ? "#171b27" : "#e2e6f0"}
                strokeWidth={1}
              />
              <text
                x={p.anchor === "end" ? p.labelX - padX : p.labelX + padX}
                y={p.labelY + 3}
                fontSize={11}
                fontWeight={500}
                fill={isHover ? "white" : "#252a3a"}
                textAnchor={p.anchor}
              >
                {text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
