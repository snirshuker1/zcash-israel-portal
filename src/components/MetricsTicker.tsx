"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Layers, TrendingUp } from "lucide-react";
import useSWR from "swr";
import ChartModal, { ChartType } from "./ChartModal";
import RollingPrice from "./RollingPrice";
import { useLiveZecPrice } from "@/hooks/useLiveZecPrice";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

interface CardProps {
  icon: React.ReactNode;
  techLabel: string;
  hebrewLabel: React.ReactNode;
  value: React.ReactNode;
  chartType: ChartType;
  onOpen: (t: ChartType) => void;
  index: number;
  live?: boolean;
}

function MetricCard({ icon, techLabel, hebrewLabel, value, chartType, onOpen, index, live = true }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(chartType)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0f0f12",
        border: `1px solid ${hovered ? "#3f3f46" : "#1f1f23"}`,
        borderRadius: 14,
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "pointer",
        textAlign: "right",
        transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered
          ? "0 10px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
        position: "relative",
        overflow: "hidden",
      }}
      dir="rtl"
    >
      {/* Top row: tech label + live pill */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} dir="ltr">
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ display: "flex", color: "#52525b" }}>{icon}</span>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.66rem",
              letterSpacing: "0.14em",
              color: "#71717a",
              fontWeight: 500,
            }}
          >
            {techLabel}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="live-dot"
            data-state={live ? "on" : "off"}
            style={{ width: 5, height: 5 }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "0.6rem",
              color: live ? "#71717a" : "#52525b",
              letterSpacing: "0.12em",
              fontWeight: 500,
            }}
          >
            {live ? "LIVE" : "—"}
          </span>
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "1.9rem",
          fontWeight: 700,
          color: "#fafafa",
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
        dir="ltr"
      >
        {value}
      </div>

      {/* Hebrew label */}
      <div
        style={{
          fontSize: "0.88rem",
          color: "#71717a",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          lineHeight: 1.5,
        }}
      >
        {hebrewLabel}
      </div>

      {/* Bottom accent line — fills on hover */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1,
          width: hovered ? "100%" : "0%",
          background: "linear-gradient(90deg, transparent, #3f3f46, transparent)",
          transition: "width 0.4s ease",
        }}
      />
    </motion.button>
  );
}

export default function MetricsTicker() {
  const [activeChart, setActiveChart] = useState<ChartType | null>(null);

  const { data: stats, isLoading } = useSWR("/api/zcash/stats", fetcher, { refreshInterval: 60_000 });

  const blockHeight: number = stats?.blockHeight ?? 2_571_844;
  const restPrice: number | null = stats?.priceUsd ?? null;
  const { price: priceUsd, connected: priceConnected } = useLiveZecPrice(restPrice);
  const shieldedTotal: number | null = stats?.shieldedTotal ?? null;
  const shieldedOrchard: number | null = stats?.shieldedOrchard ?? null;
  const shieldedSapling: number | null = stats?.shieldedSapling ?? null;
  const circulatingSupply: number | null = stats?.circulatingSupply ?? null;

  function fmtShielded(v: number): string {
    // v is already BigInt-rounded on the server; display to 3 significant decimal places
    return `~${(v / 1_000_000).toFixed(3)}M`;
  }

  function fmtPool(v: number | null): string {
    if (v === null) return "";
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
    return `${(v / 1_000).toFixed(1)}K`;
  }

  const cards: Omit<CardProps, "onOpen" | "index">[] = [
    {
      icon: <Layers size={13} strokeWidth={1.6} />,
      techLabel: "BLOCK HEIGHT",
      hebrewLabel: "גובה הבלוק הנוכחי",
      value: (
        <Ltr>
          <span className="tabular-nums" suppressHydrationWarning>
            {isLoading ? "..." : blockHeight.toLocaleString("en-US")}
          </span>
        </Ltr>
      ),
      chartType: "blocks",
      live: !!stats,
    },
    {
      icon: <Shield size={13} strokeWidth={1.6} />,
      techLabel: "SHIELDED POOL",
      hebrewLabel: (
        <span>
          ZEC מוצפן
          {!isLoading && shieldedOrchard !== null && shieldedSapling !== null && (
            <span style={{ display: "block", fontSize: "0.72rem", color: "#52525b", marginTop: 3 }}>
              Orchard {fmtPool(shieldedOrchard)} · Sapling {fmtPool(shieldedSapling)}
            </span>
          )}
        </span>
      ),
      value: (
        <Ltr>
          <span className="tabular-nums" suppressHydrationWarning>
            {isLoading ? "..." : shieldedTotal !== null ? fmtShielded(shieldedTotal) : "—"}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#52525b", marginLeft: 4 }}>ZEC</span>
        </Ltr>
      ),
      chartType: "shielded",
      live: !!stats,
    },
    {
      icon: <TrendingUp size={13} strokeWidth={1.6} />,
      techLabel: "ZEC / USD",
      hebrewLabel: "מחיר שוק · זמן אמת",
      value: (
        <Ltr>
          {priceUsd !== null ? (
            <RollingPrice
              value={priceUsd}
              prefix="$"
              color="#fafafa"
              fontWeight={700}
            />
          ) : (
            <span className="tabular-nums" suppressHydrationWarning>
              {isLoading ? "..." : "—"}
            </span>
          )}
        </Ltr>
      ),
      chartType: "price",
      live: priceConnected, // green only when the real WS connection is open
    },
  ];

  return (
    <>
      <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: 14 }}>
        {cards.map((card, i) => (
          <MetricCard key={i} {...card} index={i} onOpen={setActiveChart} />
        ))}
      </div>
      <ChartModal
        type={activeChart}
        onClose={() => setActiveChart(null)}
        liveShielded={{ total: shieldedTotal, sapling: shieldedSapling, orchard: shieldedOrchard }}
        livePrice={priceUsd}
        circulatingSupply={circulatingSupply}
      />
    </>
  );
}
