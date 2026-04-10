"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Layers, TrendingUp } from "lucide-react";
import useSWR from "swr";
import ChartModal, { ChartType } from "./ChartModal";

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
}

function MetricCard({ icon, techLabel, hebrewLabel, value, chartType, onOpen, index }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
      onClick={() => onOpen(chartType)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1c1c1c" : "#141414",
        border: `1px solid ${hovered ? "#444" : "#2a2a2a"}`,
        borderRadius: 12,
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        textAlign: "right",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.5)" : "none",
      }}
      dir="rtl"
    >
      {/* Top row: tech label + live dot */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} dir="ltr">
        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.4 }}>
          {icon}
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem", letterSpacing: "0.12em", color: "#888" }}>
            {techLabel}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            className="pulse-amber"
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#666", display: "inline-block" }}
          />
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.63rem", color: "#444", letterSpacing: "0.08em" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
        dir="ltr"
      >
        {value}
      </div>

      {/* Hebrew label */}
      <div style={{ fontSize: "0.92rem", color: "#555", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        {hebrewLabel}
      </div>

      {/* Hover hint */}
      <div
        style={{
          fontSize: "0.7rem",
          color: "#888",
          fontFamily: "var(--font-mono), monospace",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
          letterSpacing: "0.08em",
        }}
        dir="ltr"
      >
        → click to open chart
      </div>
    </motion.button>
  );
}

export default function MetricsTicker() {
  const [activeChart, setActiveChart] = useState<ChartType | null>(null);

  const { data: stats, isLoading } = useSWR("/api/zcash/stats", fetcher, { refreshInterval: 60_000 });

  const blockHeight: number = stats?.blockHeight ?? 2_571_844;
  const priceUsd: number | null = stats?.priceUsd ?? null;
  const shieldedTotal: number | null = stats?.shieldedTotal ?? null;
  const shieldedOrchard: number | null = stats?.shieldedOrchard ?? null;
  const shieldedSapling: number | null = stats?.shieldedSapling ?? null;

  function fmtShielded(v: number): string {
    // v is already BigInt-rounded on the server; display to 3 significant decimal places
    return `~${(v / 1_000_000).toFixed(3)}M`;
  }

  function fmtPool(v: number | null): string {
    if (v === null) return "";
    return `${(v / 1_000).toFixed(1)}k`;
  }

  const cards: Omit<CardProps, "onOpen" | "index">[] = [
    {
      icon: <Layers size={12} style={{ color: "#666" }} />,
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
    },
    {
      icon: <Shield size={12} style={{ color: "#666" }} />,
      techLabel: "SHIELDED POOL",
      hebrewLabel: (
        <span>
          ZEC מוצפן
          {!isLoading && shieldedOrchard !== null && shieldedSapling !== null && (
            <span style={{ display: "block", fontSize: "0.73rem", color: "#444", marginTop: 2 }}>
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
          <span style={{ fontSize: "0.85rem", opacity: 0.4, marginLeft: 4 }}>ZEC</span>
        </Ltr>
      ),
      chartType: "shielded",
    },
    {
      icon: <TrendingUp size={12} style={{ color: "#666" }} />,
      techLabel: "ZEC / USD",
      hebrewLabel: "מחיר שוק עדכני",
      value: (
        <Ltr>
          <span className="tabular-nums" suppressHydrationWarning>
            {isLoading ? "..." : priceUsd !== null ? `$${priceUsd.toFixed(2)}` : "—"}
          </span>
        </Ltr>
      ),
      chartType: "price",
    },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {cards.map((card, i) => (
          <MetricCard key={i} {...card} index={i} onOpen={setActiveChart} />
        ))}
      </div>
      <ChartModal
        type={activeChart}
        onClose={() => setActiveChart(null)}
        liveShielded={{ total: shieldedTotal, sapling: shieldedSapling, orchard: shieldedOrchard }}
      />
    </>
  );
}
