"use client";

import { useEffect, useRef, useState } from "react";
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
import ShieldedPoolGrowthChart from "./ShieldedPoolGrowthChart";

// Throw on HTTP errors and on API-level { error } payloads so SWR correctly
// surfaces failures in its `error` field instead of silently stashing a
// { error: "..." } object in `data` (which blanks the chart with no feedback).
const fetcher = async (url: string) => {
  const r = await fetch(url);
  const json = await r.json();
  if (!r.ok || (json && typeof json === "object" && "error" in json)) {
    throw new Error(json?.error ?? `HTTP ${r.status}`);
  }
  return json;
};

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
  livePrice?: number | null;
  circulatingSupply?: number | null;
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
    subtitleHe: "ZEC בכתובות מוצפנות (Sprout + Sapling + Orchard)",
    source: "zecprice.com",
    dataKey: "total",
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

// ─── Tooltip ─────────────────────────────────────────────────────────────────
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
  const val = payload[0]?.value;
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
        {typeof val === "number" ? val.toLocaleString("en-US") : val}
        {suffix}
      </p>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Compute a tight [min, max] domain for the price Y-axis with ~4% padding. */
function priceDomain(points: Array<{ price: number }>): [number, number] {
  const vals = points.map((p) => p.price).filter(Number.isFinite);
  if (vals.length === 0) return [0, 1];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  // If all values are the same (e.g. a single point), create a small range.
  const span = hi - lo || Math.max(lo * 0.08, 1);
  const pad = span * 0.08;
  return [Math.max(0, lo - pad), hi + pad];
}

/** Y-axis tick label for price values — clean $X / $Xk formatting. */
function priceTickFmt(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  if (v >= 10) return `$${Math.round(v)}`;
  return `$${v.toFixed(2)}`;
}

/** X-axis tick formatter — single format for all periods: "Apr 26". */
function xTickFmt(value: string): string {
  if (value === "Live") return "Live";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function ChartModal({ type, onClose, liveShielded, livePrice, circulatingSupply }: Props) {
  const [period, setPeriod] = useState<Period>("1y");

  // Holds the last successfully fetched dataset for the current chart type so
  // we can keep the old data visible while the next period's fetch is in flight
  // (prevents the "blank chart / loading text flicker" on period switches).
  const [displayed, setDisplayed] = useState<{ type: ChartType; data: unknown[] } | null>(null);
  // Bumped each time displayed.data is swapped — drives the fade-in animation key.
  const [displayKey, setDisplayKey] = useState(0);
  // Keeps a stable ref to the current type so effects can compare without
  // needing to add `type` to dependency arrays that only care about `data`.
  const typeRef = useRef(type);

  const config = type ? CONFIGS[type] : null;
  // "shielded" is handled entirely by ShieldedPoolGrowthChart — skip the fetch.
  const endpoint =
    config && type !== "shielded" ? `${config.endpoint}?period=${period}` : null;

  const { data, isLoading, error } = useSWR(endpoint, fetcher, {
    shouldRetryOnError: false, // don't hammer CoinGecko on rate-limit / auth errors
  });

  // Reset period when a new chart type opens.
  useEffect(() => {
    if (type) setPeriod(type === "shielded" ? "all" : "1y");
  }, [type]);

  // Close on Escape.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Scroll lock: hide overflow while the modal is open.
  // We intentionally avoid the position:fixed + top trick — that approach
  // resets the paint position and causes a visible jump even with scrollY
  // compensation. Instead, scrollbar-gutter:stable both-edges (set on <html>
  // in globals.css) permanently reserves the scrollbar lane, so toggling
  // overflow:hidden never shifts the layout width and no jump occurs.
  useEffect(() => {
    if (!type) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      // Restore scroll in the rare case a browser resets it when overflow is cleared.
      if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
    };
  }, [type]);

  // When a new valid dataset arrives, store it and bump the fade key.
  // Intentionally only depends on `data`: we want this to fire when SWR resolves,
  // not on every type/period change (those are handled by the clear effect below).
  useEffect(() => {
    if (typeRef.current && Array.isArray(data) && data.length > 0) {
      setDisplayed({ type: typeRef.current, data });
      setDisplayKey((k) => k + 1);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // When the chart TYPE changes, clear the stale display immediately so we
  // don't flash price bars inside the blocks chart (or vice-versa).
  useEffect(() => {
    typeRef.current = type;
    setDisplayed(null);
  }, [type]);

  const axisStyle = {
    fontSize: 11,
    fill: "#71717a",
    fontFamily: "var(--font-mono), monospace",
  };

  function renderChart(chartData: unknown[]) {
    if (!config || chartData.length === 0) return null;

    const gradId = `bwgrad-${type}`;
    const commonProps = { data: chartData, margin: { top: 10, right: 10, left: 0, bottom: 0 } };

    const sharedXAxis = (
      <XAxis
        dataKey={config.xKey}
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        minTickGap={60}
        tickFormatter={xTickFmt}
        padding={{ left: 10, right: 20 }}
        height={30}
      />
    );
    const sharedYAxis = (
      <YAxis
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        width={60}
        tickFormatter={(v: number) =>
          v >= 1_000_000
            ? `${(v / 1_000_000).toFixed(1)}M`
            : v >= 1000
            ? `${(v / 1000).toFixed(1)}K`
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

    // ── Blocks chart ─────────────────────────────────────────────────────────
    if (config.chartKind === "bar") {
      return (
        <BarChart {...commonProps}>
          {grid}
          {sharedXAxis}
          {sharedYAxis}
          {tooltip}
          <Bar
            dataKey={config.dataKey}
            fill="#ffffff"
            opacity={0.85}
            radius={[3, 3, 0, 0]}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </BarChart>
      );
    }

    // ── Price chart ───────────────────────────────────────────────────────────
    // Stitch live price as a brand-new FINAL point so the chart has a genuine
    // "today" slot at the far right. Overwriting the last CoinGecko point keeps
    // yesterday's date label and leaves the cursor orphaned past it — pushing a
    // new entry creates a real rightmost slot that the tooltip can land on.
    let areaData = [...(chartData as Array<{ date: string; price: number }>)];
    if (type === "price" && livePrice != null) {
      // Unique label so Recharts allocates a distinct categorical X-axis slot.
      areaData = [...areaData, { date: "Live", price: Math.round(livePrice * 100) / 100 }];
    }

    // Tight domain: Y-axis hugs the actual data range for the selected period.
    const [domainMin, domainMax] = priceDomain(areaData);

    // padding.right nudges the plot area inward so the "Live" point lands
    // fully inside the chart — without it the rightmost categorical slot is
    // flush with the container edge and half its hover band is clipped.
    const priceXAxis = (
      <XAxis
        dataKey={config.xKey}
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        minTickGap={60}
        tickFormatter={xTickFmt}
        padding={{ left: 10, right: 30 }}
        height={30}
      />
    );

    const priceYAxis = (
      <YAxis
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
        width={60}
        domain={[domainMin, domainMax]}
        tickFormatter={priceTickFmt}
      />
    );

    return (
      <AreaChart {...commonProps} data={areaData}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        {priceXAxis}
        {priceYAxis}
        <Tooltip
          content={<BwTooltip prefix={config.prefix} suffix={config.suffix} />}
          cursor={{ stroke: "#555", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey={config.dataKey}
          stroke="#ffffff"
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 5, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
          isAnimationActive
          animationDuration={800}
          animationEasing="ease-in-out"
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

              {/* Live summary metrics */}
              {type === "price" && livePrice != null && (
                <div
                  style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}
                  dir="ltr"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    ${livePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background: "#071407",
                      border: "1px solid #1a3a1a",
                    }}
                  >
                    <span className="live-dot" data-state="on" style={{ width: 5, height: 5 }} aria-hidden />
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.6rem",
                        color: "#4ade80",
                        letterSpacing: "0.12em",
                        fontWeight: 600,
                      }}
                    >
                      LIVE
                    </span>
                  </span>
                </div>
              )}

              {type === "shielded" && liveShielded?.total != null && (
                <div
                  dir="ltr"
                  style={{
                    marginBottom: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 6,
                  }}
                >
                  {/* Primary: total shielded ZEC */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "2.2rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {Math.round(liveShielded.total).toLocaleString("en-US")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "1rem",
                        color: "#555",
                        fontWeight: 400,
                      }}
                    >
                      ZEC
                    </span>
                  </div>

                  {/* Secondary: Hebrew text left, number right — RTL reader hits number first */}
                  {circulatingSupply != null && (
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          fontSize: "0.78rem",
                          color: "#a1a1aa",
                        }}
                      >
                        מהיצע המחזור מוצפן
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "#a1a1aa",
                        }}
                      >
                        {((liveShielded.total / circulatingSupply) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timeframe tabs — hidden for shielded (ShieldedPoolGrowthChart owns its data) */}
              {type !== "shielded" && (
                <div style={{ display: "flex", gap: 6, marginBottom: 20 }} dir="ltr">
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
              )}

              {/* Chart area */}
              <div style={{ height: 360, position: "relative" }}>
                {type === "shielded" ? (
                  <ShieldedPoolGrowthChart compact liveTotal={liveShielded?.total} />
                ) : (
                  <>
                    {/* ── Primary: render chart using stable `displayed` data so the
                        previous period stays visible while the next fetch is in flight.
                        The motion.div key changes only when new data is committed, which
                        triggers a smooth opacity fade-in rather than a hard snap. ── */}
                    {displayed?.type === type && displayed.data.length > 0 && (() => {
                      const chartEl = renderChart(displayed.data);
                      if (!chartEl) return null;
                      return (
                        <motion.div
                          key={displayKey}
                          initial={{ opacity: 0.65 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          style={{ width: "100%", height: "100%", position: "relative" }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            {chartEl as React.ReactElement}
                          </ResponsiveContainer>
                          {/* Subtle in-flight indicator — doesn't blank the chart */}
                          {isLoading && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: 6,
                                right: 8,
                                color: "#444",
                                fontFamily: "var(--font-mono), monospace",
                                fontSize: "0.6rem",
                                letterSpacing: "0.15em",
                              }}
                            >
                              ···
                            </span>
                          )}
                        </motion.div>
                      );
                    })()}

                    {/* ── Fallback states: only shown when there is no prior data to
                        display (i.e. the very first load for this chart type). ── */}
                    {(!displayed || displayed.type !== type) && isLoading && (
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
                    {(!displayed || displayed.type !== type) && error && !isLoading && (
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
                    {(!displayed || displayed.type !== type) && !isLoading && !error && Array.isArray(data) && data.length === 0 && (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#444",
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "0.75rem",
                        }}
                      >
                        אין נתונים זמינים
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
