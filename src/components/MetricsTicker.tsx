"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Layers, TrendingUp } from "lucide-react";
import useSWR from "swr";
import ChartModal, { ChartType } from "./ChartModal";

const AMBER = "#F3B132";
const GREEN = "#22c55e";
const PURPLE = "#8b5cf6";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

interface CardProps {
  icon: React.ReactNode;
  techLabel: string;
  hebrewLabel: string;
  value: React.ReactNode;
  accent: string;
  chartType: ChartType;
  onOpen: (t: ChartType) => void;
  index: number;
}

function MetricCard({ icon, techLabel, hebrewLabel, value, accent, chartType, onOpen, index }: CardProps) {
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
        border: `1px solid ${hovered ? accent + "50" : "#27272a"}`,
        borderRadius: 12,
        padding: "20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        textAlign: "right",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4)` : "none",
      }}
      dir="rtl"
    >
      {/* Top row: tech label + live dot */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        dir="ltr"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.5 }}>
          {icon}
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#71717a" }}>
            {techLabel}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            className="pulse-amber"
            style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block" }}
          />
          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.55rem", color: "#3f3f46", letterSpacing: "0.08em" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: accent,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
        dir="ltr"
      >
        {value}
      </div>

      {/* Hebrew label */}
      <div style={{ fontSize: "0.78rem", color: "#52525b", fontFamily: "Inter, system-ui, sans-serif" }}>
        {hebrewLabel}
      </div>

      {/* Hover hint */}
      <div
        style={{
          fontSize: "0.62rem",
          color: accent,
          fontFamily: "var(--font-mono), monospace",
          opacity: hovered ? 0.7 : 0,
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

  const cards: Omit<CardProps, "onOpen" | "index">[] = [
    {
      icon: <Layers size={12} style={{ color: "#71717a" }} />,
      techLabel: "BLOCK HEIGHT",
      hebrewLabel: "גובה הבלוק הנוכחי",
      value: (
        <Ltr>
          <span className="tabular-nums">{isLoading ? "..." : blockHeight.toLocaleString("en-US")}</span>
        </Ltr>
      ),
      accent: AMBER,
      chartType: "blocks",
    },
    {
      icon: <Clock size={12} style={{ color: "#71717a" }} />,
      techLabel: "UPTIME SINCE 2016",
      hebrewLabel: "זמינות רצופה מאז ההשקה",
      value: <Ltr>100.00%</Ltr>,
      accent: GREEN,
      chartType: "blocks",
    },
    {
      icon: <Shield size={12} style={{ color: "#71717a" }} />,
      techLabel: "SHIELDED POOL",
      hebrewLabel: "ZEC בכתובות מוצפנות",
      value: (
        <Ltr>
          <span className="tabular-nums">~1.24M</span>
          <span style={{ fontSize: "0.85rem", opacity: 0.5, marginLeft: 4 }}>ZEC</span>
        </Ltr>
      ),
      accent: PURPLE,
      chartType: "shielded",
    },
    {
      icon: <TrendingUp size={12} style={{ color: "#71717a" }} />,
      techLabel: "ZEC / USD",
      hebrewLabel: "מחיר שוק עדכני",
      value: (
        <Ltr>
          <span className="tabular-nums">
            {isLoading ? "..." : priceUsd !== null ? `$${priceUsd.toFixed(2)}` : "—"}
          </span>
        </Ltr>
      ),
      accent: AMBER,
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
      <ChartModal type={activeChart} onClose={() => setActiveChart(null)} />
    </>
  );
}
