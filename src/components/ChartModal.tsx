"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const AMBER = "#F3B132";

export type ChartType = "price" | "shielded" | "blocks";
type Period = "1w" | "1m" | "3m" | "1y" | "all";

const PERIODS: { key: Period; label: string }[] = [
  { key: "1w", label: "1W" },
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "1y", label: "1Y" },
  { key: "all", label: "ALL" },
];

interface Props {
  type: ChartType | null;
  onClose: () => void;
  liveShielded?: { total: number | null; sapling: number | null; orchard: number | null };
}

interface ChartConfig {
  endpoint: string;
  titleHe: string;
  subtitleHe: string;
  source: string;
  dataKey: string;
  xKey: string;
  prefix?: string;
  suffix?: string;
  chartKind: "area" | "bar";
}

const CONFIGS: Record<ChartType, ChartConfig> = {
  price: {
    endpoint: "/api/zcash/price-history",
    titleHe: "מחיר ZEC",
    subtitleHe: "מחיר שוק בדולר אמריקאי",
    source: "CoinGecko",
    dataKey: "price",
    xKey: "date",
    prefix: "$",
    chartKind: "area",
  },
  shielded: {
    endpoint: "/api/zcash/shielded-history",
    titleHe: "בריכה מוגנת",
    subtitleHe: "ZEC בכתובות מוצפנות (Sapling + Orchard)",
    source: "zecprice.com",
    dataKey: "zec",
    xKey: "date",
    suffix: " ZEC",
    chartKind: "area",
  },
  blocks: {
    endpoint: "/api/zcash/blocks-history",
    titleHe: "בלוקים ליום",
    subtitleHe: "מספר הבלוקים שנכרו בכל יום",
    source: "Blockchair",
    dataKey: "blocks",
    xKey: "date",
    chartKind: "bar",
  },
};

// ─── Tooltip (single-series) ─────────────────────────────────────────────────
function BwTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <p style={{ color: "#666", fontSize: "0.62rem", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>
        {prefix}
        {typeof payload[0]?.value === "number"
          ? payload[0].value.toLocaleString("en-US")
          : payload[0]?.value}
        {suffix}
      </p>
    </div>
  );
}

// ─── Tooltip (shielded — multi-series) ───────────────────────────────────────
function ShieldedTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const sapling = payload.find((p) => p.dataKey === "sapling")?.value ?? 0;
  const orchard = payload.find((p) => p.dataKey === "orchard")?.value ?? 0;
  const total = sapling + orchard;
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <p style={{ color: "#666", fontSize: "0.62rem", marginBottom: 6 }}>{label}</p>
      <p style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 600, marginBottom: 4 }}>
        {total.toLocaleString("en-US")} ZEC
      </p>
      <p style={{ color: "#fff", fontSize: "0.72rem", margin: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#fff", display: "inline-block" }} />
        Orchard: {orchard.toLocaleString("en-US")}
      </p>
      <p style={{ color: AMBER, fontSize: "0.72rem", margin: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: AMBER, display: "inline-block" }} />
        Sapling: {sapling.toLocaleString("en-US")}
      </p>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function ChartModal({ type, onClose, liveShielded }: Props) {
  const [period, setPeriod] = useState<Period>("1y");

  const config = type ? CONFIGS[type] : null;
  const endpoint = config ? `${config.endpoint}?period=${period}` : null;
  const { data, isLoading, error } = useSWR(endpoint, fetcher);

  // Reset period when a new chart type opens (shielded defaults to "all")
  useEffect(() => {
    if (type) setPeriod(type === "shielded" ? "all" : "1y");
  }, [type]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const axisStyle = {
    fontSize: "0.6rem",
    fill: "#555",
    fontFamily: "var(--font-mono), monospace",
  };

  function renderChart() {
    if (!config || !data || data.error) return null;

    const gradId = `bwgrad-${type}`;
    const commonProps = { data, margin: { top: 10, right: 10, left: 0, bottom: 0 } };

    const xAxis = (
      <XAxis dataKey={config.xKey} tick={axisStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
    );
    const yAxis = (
      <YAxis
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        width={60}
        tickFormatter={(v: number) =>
          config.prefix
            ? `${config.prefix}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
            : v >= 1_000_000
            ? `${(v / 1_000_000).toFixed(1)}M`
            : v >= 1000
            ? `${(v / 1000).toFixed(0)}k`
            : String(v)
        }
      />
    );
    const grid = <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />;
    const tooltip = (
      <Tooltip
        content={<BwTooltip prefix={config.prefix} suffix={config.suffix} />}
        cursor={{ stroke: "#555", strokeWidth: 1 }}
      />
    );

    if (config.chartKind === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}{xAxis}{yAxis}{tooltip}
          <Bar dataKey={config.dataKey} fill="#ffffff" opacity={0.85} radius={[3, 3, 0, 0]} />
        </BarChart>
      );
    }

    // ── Shielded pool: single combined area (Sapling + Orchard) ─────────────
    if (type === "shielded") {
      const combined = (data as Array<{ date: string; sapling: number; orchard: number }>).map(
        (row) => ({ ...row, total: row.sapling + row.orchard })
      );
      // Overwrite the last point with live values so chart tip matches the metric card
      if (
        combined.length > 0 &&
        liveShielded?.sapling != null &&
        liveShielded?.orchard != null
      ) {
        const last = combined[combined.length - 1];
        combined[combined.length - 1] = {
          ...last,
          sapling: liveShielded.sapling,
          orchard: liveShielded.orchard,
          total: liveShielded.total ?? liveShielded.sapling + liveShielded.orchard,
        };
      }
      return (
        <AreaChart {...commonProps} data={combined}>
          <defs>
            <linearGradient id="grad-shielded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {grid}{xAxis}{yAxis}
          <Tooltip
            content={<BwTooltip suffix=" ZEC" />}
            cursor={{ stroke: "#555", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#ffffff"
            strokeWidth={1.5}
            fill="url(#grad-shielded)"
            dot={false}
            activeDot={{ r: 4, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
          />
        </AreaChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}{xAxis}{yAxis}{tooltip}
        <Area
          type="monotone"
          dataKey={config.dataKey}
          stroke="#ffffff"
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 4, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
        />
      </AreaChart>
    );
  }

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 50,
            }}
          />

          {/* Panel wrapper — flex centres regardless of RTL/Framer transforms */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 51,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              pointerEvents: "auto",
              width: "min(94vw, 1040px)",
              background: "#0a0a0a",
              border: "1px solid #222",
              borderRadius: 20,
              padding: "32px 36px 28px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.9)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
              dir="rtl"
            >
              <div>
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: 4,
                  }}
                >
                  {config?.titleHe}
                </h2>
                <p
                  style={{
                    color: "#555",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {config?.subtitleHe}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#888")}
              >
                <X size={16} />
              </button>
            </div>

            {/* Timeframe tabs */}
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 20,
              }}
              dir="ltr"
            >
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    border: "1px solid",
                    borderColor: period === p.key ? "#ffffff" : "#2a2a2a",
                    background: period === p.key ? "#ffffff" : "transparent",
                    color: period === p.key ? "#000000" : "#555",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (period !== p.key) {
                      (e.currentTarget as HTMLElement).style.borderColor = "#555";
                      (e.currentTarget as HTMLElement).style.color = "#ccc";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (period !== p.key) {
                      (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                      (e.currentTarget as HTMLElement).style.color = "#555";
                    }
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chart area */}
            <div style={{ height: 360 }}>
              {isLoading && (
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
                    color: "#666",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.75rem",
                  }}
                >
                  שגיאה בטעינת נתונים
                </div>
              )}
              {!isLoading && data && !data.error && (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart() as React.ReactElement}
                </ResponsiveContainer>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
                fontSize: "0.62rem",
                fontFamily: "var(--font-mono), monospace",
                color: "#333",
              }}
              dir="ltr"
            >
              <span>
                מקור: <span style={{ color: "#555" }}>{config?.source}</span>
              </span>
              <span>● LIVE · עודכן אוטומטית</span>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
