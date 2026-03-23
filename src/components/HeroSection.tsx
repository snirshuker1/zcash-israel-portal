"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ShieldedTxSVG from "./ShieldedTxSVG";

const AMBER = "#F3B132";
const NEAR_INTENTS_URL = "https://near.org/intents";

function Ltr({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <span
      dir="ltr"
      className="inline-block"
      style={mono ? { fontFamily: "var(--font-mono), monospace" } : undefined}
    >
      {children}
    </span>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "96px 24px 64px",
        borderBottom: "1px solid #e4e4e7",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 64,
          flexWrap: "wrap",
        }}
        dir="rtl"
      >
        {/* ── Left: Text content (appears on right in RTL) ── */}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>

          {/* Protocol tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              color: "#92400e",
              fontFamily: "var(--font-mono), monospace",
              marginBottom: 24,
              padding: "4px 12px",
              background: "rgba(243,177,50,0.1)",
              border: "1px solid rgba(243,177,50,0.3)",
              borderRadius: 20,
            }}
          >
            <span className="pulse-amber" style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, display: "inline-block" }} />
            <Ltr>ZCASH MAINNET · ACTIVE</Ltr>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#09090b",
              marginBottom: 20,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
            dir="ltr"
          >
            <span style={{ color: "#09090b" }}>Zcash:</span>
            <br />
            <span style={{ color: AMBER }}>Encrypt Your</span>
            <br />
            <span style={{ color: "#09090b" }}>Money.</span>
          </motion.h1>

          {/* Hebrew sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "1.1rem",
              color: "#71717a",
              lineHeight: 1.7,
              marginBottom: 12,
              fontFamily: "Inter, system-ui, sans-serif",
              maxWidth: 480,
            }}
          >
            ריבונות פיננסית מוכחת מתמטית. אספקה קבועה של{" "}
            <Ltr mono>
              <span style={{ color: "#09090b", fontWeight: 600 }}>21,000,000 ZEC</span>
            </Ltr>
            .
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontSize: "0.8rem",
              color: "#a1a1aa",
              marginBottom: 36,
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "0.05em",
            }}
            dir="ltr"
          >
            // <Ltr>zk-SNARKs</Ltr> · <Ltr>Halo 2</Ltr> · <Ltr>No Trusted Setup</Ltr> · since 2016
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            {/* Primary — buy */}
            <a
              href={NEAR_INTENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 10,
                background: "#09090b",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.9rem",
                fontFamily: "Inter, system-ui, sans-serif",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              <span style={{ color: AMBER }}>◎</span>
              <span>
                רכישת <Ltr mono>Zcash</Ltr>
              </span>
            </a>

            {/* Secondary — timeline */}
            <button
              onClick={() => scrollTo("timeline")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 24px",
                borderRadius: 10,
                background: "transparent",
                border: "1px solid #e4e4e7",
                color: "#71717a",
                fontWeight: 500,
                fontSize: "0.9rem",
                fontFamily: "Inter, system-ui, sans-serif",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = AMBER;
                (e.currentTarget as HTMLElement).style.color = AMBER;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e4e4e7";
                (e.currentTarget as HTMLElement).style.color = "#71717a";
              }}
            >
              היסטוריית הפרוטוקול ↓
            </button>
          </motion.div>

          {/* Key stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              display: "flex",
              gap: 28,
              marginTop: 44,
              paddingTop: 28,
              borderTop: "1px solid #f4f4f5",
              flexWrap: "wrap",
            }}
            dir="ltr"
          >
            {[
              { label: "Supply Cap", value: "21M ZEC" },
              { label: "Uptime", value: "100%" },
              { label: "Since", value: "2016" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "1.1rem", fontWeight: 700, color: "#09090b" }}>
                  {value}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#a1a1aa", marginTop: 2, fontFamily: "Inter, system-ui, sans-serif" }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Animated SVG mockup (appears on left in RTL) ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ flex: "1 1 400px", minWidth: 0, display: "flex", justifyContent: "center" }}
          dir="ltr"
        >
          <ShieldedTxSVG />
        </motion.div>
      </div>
    </section>
  );
}
