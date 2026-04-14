"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataPoint {
  date: string;
  total: number;
}

// ─── Y-axis formatter ────────────────────────────────────────────────────────
function fmtY(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────
function PoolTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <p style={{ color: "#555", fontSize: "0.62rem", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600 }}>
        {typeof val === "number" ? val.toLocaleString("en-US") : "—"}{" "}
        <span style={{ color: "#666", fontWeight: 400 }}>ZEC</span>
      </p>
    </div>
  );
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function nowMonthLabel(): string {
  const d = new Date();
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// ─── Chart ───────────────────────────────────────────────────────────────────
export default function ShieldedPoolGrowthChart({
  compact = false,
  liveTotal,
}: {
  compact?: boolean;
  liveTotal?: number | null;
}) {
  const [data, setData]       = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    fetch("/api/zcash/shielded-pool-growth")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((json: DataPoint[] | { error: string }) => {
        if (Array.isArray(json)) setData(json);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Stitch live value as the absolute final point so the chart tip always
  // matches the card. If the current month already appears in the API data,
  // overwrite it; otherwise append a fresh "now" point.
  const displayData = useMemo<DataPoint[]>(() => {
    if (!liveTotal || data.length === 0) return data;
    const label = nowMonthLabel();
    const last  = data[data.length - 1];
    const base  = last.date === label ? data.slice(0, -1) : data;
    return [...base, { date: label, total: liveTotal }];
  }, [data, liveTotal]);

  // Year ticks: first occurrence of each calendar year → clean sparse X-axis
  const yearTicks = useMemo(() => {
    const seen = new Set<string>();
    return displayData
      .filter((d) => {
        const yr = d.date.split(" ")[1];
        if (!yr || seen.has(yr)) return false;
        seen.add(yr);
        return true;
      })
      .map((d) => d.date);
  }, [displayData]);

  const axisStyle = {
    fontSize: "0.6rem",
    fill: "#555",
    fontFamily: "var(--font-mono), monospace",
  } as const;

  const chartArea = (
      <div style={{ height: 360, width: "100%" }}>
        {loading && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#444",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
            }}
          >
            טוען נתונים...
          </div>
        )}

        {error && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.75rem",
            }}
          >
            שגיאה בטעינת נתונים
          </div>
        )}

        {!loading && !error && displayData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e1e1e"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                ticks={yearTicks}
                tickFormatter={(v: string) => v.split(" ")[1] ?? v}
              />
              <YAxis
                tick={axisStyle}
                axisLine={false}
                tickLine={false}
                width={52}
                tickFormatter={fmtY}
              />
              <Tooltip
                content={<PoolTooltip />}
                cursor={{ stroke: "#333", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ffffff"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
  );

  if (compact) return chartArea;

  return (
    <div style={{ marginTop: 48, borderTop: "1px solid #1f1f23", paddingTop: 48, width: "100%" }}>
      {/* Header */}
      <div dir="rtl" style={{ marginBottom: 32 }}>
        <h2
          style={{
            color: "#ffffff",
            fontSize: "1.35rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: 6,
          }}
        >
          גידול הבריכה המוגנת
        </h2>
        <p
          style={{
            color: "#555",
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          סך{" "}
          <span dir="ltr" className="inline-block">
            ZEC
          </span>{" "}
          בכתובות מוצפנות —{" "}
          <span dir="ltr" className="inline-block">
            Sprout + Sapling + Orchard
          </span>
        </p>
      </div>
      {chartArea}
    </div>
  );
}
