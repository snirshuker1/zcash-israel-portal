"use client";

import { useEffect } from "react";
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
import type { TooltipProps } from "recharts";
import useSWR from "swr";

const ZCASH_YELLOW = "#F3B132";
const SHIELDED_PURPLE = "#7B5FFF";
const TERMINAL_GREEN = "#00FF88";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export type ChartType = "price" | "shielded" | "blocks";

interface Props {
  type: ChartType | null;
  onClose: () => void;
}

// ─── Custom tooltip ──────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string; color?: string }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}

function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(12,12,22,0.95)",
        border: "1px solid #1E1E35",
        borderRadius: 10,
        padding: "10px 14px",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      <p style={{ color: "#5050A0", fontSize: "0.65rem", marginBottom: 4 }}>{label}</p>
      <p style={{ color: payload[0]?.color ?? ZCASH_YELLOW, fontSize: "0.9rem", fontWeight: 600 }}>
        {prefix}
        {typeof payload[0]?.value === "number"
          ? payload[0].value.toLocaleString("en-US")
          : payload[0]?.value}
        {suffix}
      </p>
    </div>
  );
}

// Keep the import for TooltipProps even if unused to avoid tree-shaking issues
type _TooltipPropsRef = TooltipProps<number, string>;

// ─── Chart configs ────────────────────────────────────────────────────────────
const CONFIGS: Record<
  ChartType,
  {
    endpoint: string;
    titleHe: string;
    subtitleHe: string;
    source: string;
    color: string;
    dataKey: string;
    xKey: string;
    prefix?: string;
    suffix?: string;
    chartType: "area" | "line" | "bar";
  }
> = {
  price: {
    endpoint: "/api/zcash/price-history",
    titleHe: "מחיר ZEC — 30 ימים אחרונים",
    subtitleHe: "מחיר שוק בדולר אמריקאי",
    source: "CoinGecko",
    color: ZCASH_YELLOW,
    dataKey: "price",
    xKey: "date",
    prefix: "$",
    chartType: "area",
  },
  shielded: {
    endpoint: "/api/zcash/shielded-history",
    titleHe: "בריכה מוגנת — היסטוריה",
    subtitleHe: "ZEC בכתובות מוצפנות (Sapling + Orchard)",
    source: "zcashblockexplorer.com · נתון משוער",
    color: SHIELDED_PURPLE,
    dataKey: "zec",
    xKey: "date",
    suffix: " ZEC",
    chartType: "area",
  },
  blocks: {
    endpoint: "/api/zcash/blocks-history",
    titleHe: "בלוקים ליום — 30 ימים אחרונים",
    subtitleHe: "מספר הבלוקים שנכרו בכל יום",
    source: "Blockchair",
    color: TERMINAL_GREEN,
    dataKey: "blocks",
    xKey: "date",
    chartType: "bar",
  },
};

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function ChartModal({ type, onClose }: Props) {
  const config = type ? CONFIGS[type] : null;
  const { data, isLoading, error } = useSWR(config?.endpoint ?? null, fetcher);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const axisStyle = { fontSize: "0.6rem", fill: "#3A3A6A", fontFamily: "var(--font-mono), monospace" };

  function renderChart() {
    if (!config || !data || data.error) return null;

    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    const xAxis = (
      <XAxis dataKey={config.xKey} tick={axisStyle} axisLine={false} tickLine={false} />
    );
    const yAxis = (
      <YAxis
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v: number) =>
          config.prefix
            ? `${config.prefix}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
            : v >= 1_000_000
            ? `${(v / 1_000_000).toFixed(1)}M`
            : v >= 1000
            ? `${(v / 1000).toFixed(0)}k`
            : String(v)
        }
        width={55}
      />
    );
    const grid = <CartesianGrid strokeDasharray="3 3" stroke="#1A1A30" vertical={false} />;
    const tooltip = (
      <Tooltip
        content={<CustomTooltip prefix={config.prefix} suffix={config.suffix} />}
        cursor={{ stroke: config.color, strokeWidth: 1, strokeOpacity: 0.3 }}
      />
    );

    if (config.chartType === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tooltip}
          <Bar dataKey={config.dataKey} fill={config.color} opacity={0.8} radius={[3, 3, 0, 0]} />
        </BarChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={config.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        {xAxis}
        {yAxis}
        {tooltip}
        <Area
          type="monotone"
          dataKey={config.dataKey}
          stroke={config.color}
          strokeWidth={2}
          fill="url(#chartGrad)"
          dot={false}
          activeDot={{ r: 4, fill: config.color, stroke: "#08080E", strokeWidth: 2 }}
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
              backgroundColor: "rgba(4,4,10,0.85)",
              backdropFilter: "blur(6px)",
              zIndex: 50,
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 51,
              width: "min(92vw, 780px)",
              background: "#0D0D1A",
              border: "1px solid #1E1E35",
              borderRadius: 20,
              padding: "28px 28px 24px",
              boxShadow: `0 0 60px rgba(0,0,0,0.8), 0 0 0 1px ${config?.color ?? ZCASH_YELLOW}18`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6" dir="rtl">
              <div>
                <h2
                  style={{
                    color: "#E8E8F0",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    fontFamily: "system-ui, sans-serif",
                    marginBottom: 4,
                  }}
                >
                  {config?.titleHe}
                </h2>
                <p style={{ color: "#5050A0", fontSize: "0.72rem", fontFamily: "system-ui, sans-serif" }}>
                  {config?.subtitleHe}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "#1A1A2E",
                  border: "1px solid #2A2A40",
                  borderRadius: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: "#6060A0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Chart area */}
            <div style={{ height: 280 }}>
              {isLoading && (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3A3A6A",
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
                    color: "#FF4444",
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
              className="flex items-center justify-between mt-4"
              dir="ltr"
              style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono), monospace" }}
            >
              <span style={{ color: "#2A2A4A" }}>
                מקור:{" "}
                <span style={{ color: "#4A4A7A" }}>{config?.source}</span>
              </span>
              <span style={{ color: "#2A2A4A" }}>
                ● LIVE · עודכן אוטומטית
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
