"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEX = "0123456789abcdef";
const rnd = (n: number) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");

const T_ADDR = "t1KqBjAeHbPn";
const Z_ADDR = "zs1z7rejlpsa98s2rrr";

const AMBER = "#F3B132";
const GREEN = "#22c55e";
const PURPLE = "#8b5cf6";

const STATUS_STEPS = [
  { label: "Nullifier Created", color: GREEN },
  { label: "Commitment Added", color: GREEN },
  { label: "zk-SNARK Proof Verified", color: AMBER },
];

export default function ShieldedTxSVG() {
  const [phase, setPhase] = useState(0); // 0=idle 1=shielding 2=proving 3=verified
  const [progress, setProgress] = useState(0);
  const [scrambled, setScrambled] = useState(rnd(12));
  const [tick, setTick] = useState(0); // drives animation loop

  useEffect(() => {
    setPhase(0);
    setProgress(0);

    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 3400);
    const t3 = setTimeout(() => setPhase(3), 5200);
    const t4 = setTimeout(() => setTick((n) => n + 1), 8500); // loop

    // Progress bar
    let p = 0;
    const prog = setInterval(() => {
      p = Math.min(p + 1.8, 100);
      setProgress(p);
      if (p >= 100) clearInterval(prog);
    }, 55);

    // Hex scramble during phase 1
    const scrambleTimer = setInterval(() => setScrambled(rnd(12)), 75);
    const stopScramble = setTimeout(() => clearInterval(scrambleTimer), 3200);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
      clearInterval(prog);
      clearInterval(scrambleTimer);
      clearTimeout(stopScramble);
    };
  }, [tick]);

  const progressPct = Math.round(progress);

  return (
    <div
      style={{
        background: "#0D0D0D",
        border: "1px solid #27272a",
        borderRadius: 16,
        overflow: "hidden",
        width: "100%",
        maxWidth: 560,
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: "#141414",
          borderBottom: "1px solid #27272a",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        dir="ltr"
      >
        {/* Zodl wallet logo — replaces mac window dots */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/zodl-icon.png"
          alt="Zodl wallet"
          width={26}
          height={20}
          style={{
            display: "block",
            height: 20,
            width: "auto",
            filter: "brightness(0) invert(1)",
            opacity: 0.92,
          }}
        />
        <span className="shield-tx-title" style={{ color: "#52525b", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
          zcash · shield-transaction.ts
        </span>
        <span style={{ color: AMBER, fontSize: "0.75rem" }}>◎</span>
      </div>

      {/* Body */}
      <div className="shield-tx-body" style={{ padding: "26px 22px", display: "flex", flexDirection: "column", gap: 18 }} dir="ltr">

        {/* FROM */}
        <div>
          <div style={{ color: "#52525b", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: 6 }}>
            FROM · T-ADDRESS (TRANSPARENT)
          </div>
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #27272a",
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#52525b", fontSize: "0.82rem" }}>t1</span>
            <span style={{ color: "#a1a1aa", fontSize: "0.84rem", letterSpacing: "0.04em" }}>
              {phase === 1 ? scrambled : T_ADDR}
              <span style={{ opacity: 0.4 }}>···</span>
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(161,161,170,0.1)",
                color: "#52525b",
                letterSpacing: "0.08em",
              }}
            >
              EXPOSED
            </span>
          </div>
        </div>

        {/* Shield arrow + progress */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ color: "#27272a", fontSize: "0.82rem" }}>↓</div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: AMBER, fontSize: "0.7rem", letterSpacing: "0.12em" }}>
                {phase === 3 ? "✓ SHIELDED" : phase >= 1 ? "⏳ SHIELDING..." : "PENDING"}
              </span>
              <span style={{ color: "#52525b", fontSize: "0.7rem" }}>{progressPct}%</span>
            </div>
            <div style={{ height: 5, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${PURPLE}, ${AMBER})`,
                }}
                animate={{ width: `${progressPct}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>
          <div style={{ color: "#27272a", fontSize: "0.82rem" }}>↓</div>
        </div>

        {/* TO */}
        <div>
          <div style={{ color: "#52525b", fontSize: "0.7rem", letterSpacing: "0.12em", marginBottom: 6 }}>
            TO · Z-ADDRESS (SHIELDED)
          </div>
          <div
            style={{
              background: "#1a1a1a",
              border: `1px solid ${phase >= 2 ? PURPLE + "60" : "#27272a"}`,
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "border-color 0.4s",
            }}
          >
            <span style={{ color: PURPLE, fontSize: "0.82rem" }}>zs</span>
            <span style={{ color: phase >= 2 ? "#e4e4e7" : "#3a3a3a", fontSize: "0.84rem", letterSpacing: "0.04em", transition: "color 0.6s" }}>
              {Z_ADDR}
              <span style={{ opacity: 0.4 }}>···</span>
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: 4,
                background: phase >= 2 ? "rgba(139,92,246,0.15)" : "transparent",
                color: phase >= 2 ? PURPLE : "#3a3a3a",
                letterSpacing: "0.08em",
                transition: "all 0.4s",
              }}
            >
              PRIVATE
            </span>
          </div>
        </div>

        {/* Status checklist */}
        <div
          className="shield-tx-checklist"
          style={{
            borderTop: "1px solid #1f1f1f",
            paddingTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {STATUS_STEPS.map((step, i) => (
            <AnimatePresence key={i}>
              {phase >= 2 + (i > 1 ? 1 : 0) && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.75rem",
                  }}
                >
                  <span style={{ color: step.color }}>✓</span>
                  <span style={{ color: "#71717a", letterSpacing: "0.06em" }}>{step.label}</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* PROOF VERIFIED badge — wrapper is display:contents on desktop so
            it stays layout-transparent; on mobile it becomes a fixed-height
            slot that reserves space whether or not the badge is mounted. */}
        <div className="shield-tx-badge-slot">
          <AnimatePresence>
            {phase === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: `rgba(243,177,50,0.08)`,
                  border: `1px solid ${AMBER}40`,
                }}
              >
                <span style={{ color: AMBER, fontSize: "0.85rem", letterSpacing: "0.12em", fontWeight: 600 }}>
                  ◎ PROOF VERIFIED
                </span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: AMBER,
                    display: "inline-block",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
