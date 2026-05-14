"use client";

import Link from "next/link";
import { useState } from "react";
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

const W = 600;
const H = 380;
const M = { top: 28, right: 28, bottom: 40, left: 56 };

export function EmergingRadar({
  items,
}: {
  items: EmergingCapability[];
}) {
  const [hover, setHover] = useState<string | null>(null);

  const xFor = (v: number) =>
    M.left + v * (W - M.left - M.right);
  const yFor = (v: number) =>
    H - M.bottom - v * (H - M.top - M.bottom);

  const gridX = [0.25, 0.5, 0.75];
  const gridY = [0.25, 0.5, 0.75];

  return (
    <div className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-3">
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
        {gridX.map((g) => (
          <line
            key={`gx-${g}`}
            x1={xFor(g)}
            x2={xFor(g)}
            y1={M.top}
            y2={H - M.bottom}
            stroke="#e2e6f0"
            strokeDasharray="3 3"
          />
        ))}
        {gridY.map((g) => (
          <line
            key={`gy-${g}`}
            x1={M.left}
            x2={W - M.right}
            y1={yFor(g)}
            y2={yFor(g)}
            stroke="#e2e6f0"
            strokeDasharray="3 3"
          />
        ))}
        {/* Axes */}
        <text
          x={M.left}
          y={H - 14}
          fontSize={10}
          fill="#525a72"
          fontWeight={500}
        >
          Likelihood →
        </text>
        <text
          transform={`rotate(-90 16 ${M.top + 60})`}
          x={16}
          y={M.top + 60}
          fontSize={10}
          fill="#525a72"
          fontWeight={500}
        >
          Enterprise impact →
        </text>
        {/* Quadrant labels */}
        <text
          x={W - M.right - 6}
          y={M.top + 14}
          fontSize={10}
          fill="#7d859e"
          textAnchor="end"
        >
          Strategic priorities
        </text>
        <text
          x={M.left + 6}
          y={H - M.bottom - 6}
          fontSize={10}
          fill="#7d859e"
        >
          Background
        </text>
        {items.map((e) => {
          const cx = xFor(e.likelihood);
          const cy = yFor(e.impact);
          const r = 6 + e.urgency * 10;
          const fill = horizonColor[e.horizon];
          const isHover = hover === e.id;
          return (
            <Link key={e.id} href={`/emerging/${e.id}`}>
              <g
                onMouseEnter={() => setHover(e.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 4}
                  fill={fill}
                  opacity={isHover ? 0.18 : 0.1}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  opacity={0.9}
                  stroke="white"
                  strokeWidth={1.5}
                />
                {isHover && (
                  <g>
                    <rect
                      x={cx + r + 6}
                      y={cy - 14}
                      width={Math.max(80, e.name.length * 6.4)}
                      height={22}
                      rx={6}
                      fill="#171b27"
                    />
                    <text
                      x={cx + r + 14}
                      y={cy + 1}
                      fontSize={11}
                      fill="white"
                      fontWeight={500}
                    >
                      {e.name}
                    </text>
                  </g>
                )}
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
