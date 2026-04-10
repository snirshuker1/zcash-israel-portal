"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const AMBER = "#F3B132";

interface Props {
  open: boolean;
  onClose: () => void;
}

function fmt(n: number | null, type: "price" | "block" | "shielded"): string {
  if (n === null) return "—";
  if (type === "price") return `$${n.toFixed(2)}`;
  if (type === "block") return n.toLocaleString("en-US");
  if (type === "shielded") return `~${(n / 1_000_000).toFixed(3)}M`;
  return String(n);
}

export default function LiveDataModal({ open, onClose }: Props) {
  const { data: stats } = useSWR(open ? "/api/zcash/stats" : null, fetcher, {
    refreshInterval: 60_000,
  });

  const [tick, setTick] = useState(60);

  useEffect(() => {
    if (!open) return;
    setTick(60);
    const id = setInterval(() => setTick((t) => (t <= 1 ? 60 : t - 1)), 1000);
    return () => clearInterval(id);
  }, [open, stats]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const metrics = [
    {
      id: "block",
      tech: "BLOCK_HEIGHT",
      he: "גובה בלוק נוכחי",
      value: fmt(stats?.blockHeight ?? null, "block"),
      glow: "#ffffff18",
      border: "#2a2a2a",
    },
    {
      id: "price",
      tech: "ZEC / USD",
      he: "מחיר שוק",
      value: fmt(stats?.priceUsd ?? null, "price"),
      glow: `${AMBER}18`,
      border: `${AMBER}40`,
    },
    {
      id: "shielded",
      tech: "SHIELDED_POOL",
      he: "ZEC מוצפן (Sapling + Orchard)",
      value: fmt(stats?.shieldedTotal ?? null, "shielded"),
      glow: "#8b5cf618",
      border: "#8b5cf640",
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ldbg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(12px)",
              zIndex: 60,
            }}
          />

          {/* Modal — flex wrapper centres regardless of RTL / Framer transforms */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 61,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
          <motion.div
            key="ldpanel"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              pointerEvents: "auto",
              width: "min(96vw, 900px)",
              background: "#080808",
              border: `1px solid ${AMBER}30`,
              borderRadius: 20,
              boxShadow: `0 0 80px ${AMBER}18, 0 40px 100px rgba(0,0,0,0.95)`,
              overflow: "hidden",
            }}
          >
            {/* Scan-line overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
                zIndex: 1,
              }}
            />

            {/* Top bar */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 28px",
                borderBottom: `1px solid ${AMBER}20`,
                background: "#0d0d0d",
              }}
              dir="ltr"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: AMBER,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.22em",
                    color: AMBER,
                    fontWeight: 600,
                  }}
                >
                  // LIVE_PROTOCOL_DATA
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.58rem",
                    color: "#444",
                    letterSpacing: "0.08em",
                  }}
                >
                  refresh in {tick}s
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: 8,
                    padding: "5px 7px",
                    cursor: "pointer",
                    color: "#555",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.borderColor = "#555";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#555";
                    (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a";
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Metrics grid */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 1,
                background: "#1a1a1a",
              }}
            >
              {metrics.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  style={{
                    background: "#080808",
                    padding: "32px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    boxShadow: `inset 0 0 40px ${m.glow}`,
                    borderBottom: `2px solid ${m.border}`,
                  }}
                  dir="ltr"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.18em",
                      color: "#444",
                      fontWeight: 600,
                    }}
                  >
                    {m.tech}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                      fontWeight: 800,
                      color: "#ffffff",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                    suppressHydrationWarning
                  >
                    {!stats ? (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 0.9 }}
                        style={{ color: "#333" }}
                      >
                        ████
                      </motion.span>
                    ) : (
                      m.value
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "0.75rem",
                      color: "#3a3a3a",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  >
                    {m.he}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 28px",
                borderTop: "1px solid #111",
                background: "#0d0d0d",
              }}
              dir="ltr"
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.58rem",
                  color: "#2a2a2a",
                  letterSpacing: "0.08em",
                }}
              >
                Blockchair · Binance · zecprice.com
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.58rem",
                  color: "#2a2a2a",
                  letterSpacing: "0.08em",
                }}
              >
                ● ZCASH MAINNET · AUTO-REFRESH 60s
              </span>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
