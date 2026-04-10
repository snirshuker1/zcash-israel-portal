"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";

const AMBER = "#F3B132";
const NEAR_INTENTS_URL = "https://near-intents.org/?from=USDT&to=ZEC";

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

export default function IdeologicalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="cta" style={{ backgroundColor: "#fffbeb", borderTop: "1px solid #fde68a", borderBottom: "1px solid #fde68a", padding: "80px 0" }}>
      <div ref={ref} style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", textAlign: "center" }} dir="rtl">

        {/* Protocol tag */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            color: "#92400e",
            fontFamily: "var(--font-mono), monospace",
            marginBottom: 28,
            padding: "4px 12px",
            background: "rgba(243,177,50,0.15)",
            border: "1px solid rgba(243,177,50,0.35)",
            borderRadius: 20,
          }}
        >
          <span>◎</span> FINANCIAL SOVEREIGNTY
        </motion.div>

        {/* Statement */}
        <motion.p
          suppressHydrationWarning
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 700,
            color: "#09090b",
            lineHeight: 1.55,
            marginBottom: 36,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          זו החובה שלך לדאוג לעתיד הילדים שלך
          <br />
          על ידי החזקת{" "}
          <Ltr>
            <span style={{ color: AMBER }}>Zcash</span>
          </Ltr>
          .
        </motion.p>

        {/* Sub-copy */}
        <motion.p
          suppressHydrationWarning
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "1.2rem",
            color: "#92400e",
            lineHeight: 1.75,
            marginBottom: 40,
            maxWidth: 560,
            margin: "0 auto 40px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          כסף פיאט מאבד ערך. בנקים מוקפאים. פרטיות נשחקת.{" "}
          <Ltr>Zcash</Ltr>{" "}
          הוא הפתרון הטכנולוגי היחיד שמציע פרטיות מוכחת מתמטית ואספקה מוגבלת במקביל.
        </motion.p>

        {/* CTA button */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <a
            href={NEAR_INTENTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 32px",
              borderRadius: 12,
              background: "#09090b",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "1.1rem",
              fontFamily: "Inter, system-ui, sans-serif",
              textDecoration: "none",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
            }}
          >
            <span>
              רכישת{" "}
              <Ltr mono>Zcash</Ltr>
              {" "}דרך{" "}
              <Ltr mono>Near Intents</Ltr>
            </span>
            <ArrowUpLeft size={16} style={{ transform: "rotate(180deg)" }} />
          </a>

          {/* Amber accent line */}
          <div
            style={{
              width: 48,
              height: 3,
              borderRadius: 2,
              background: AMBER,
              opacity: 0.6,
            }}
          />

          <p style={{ fontSize: "0.83rem", color: "#a1a1aa", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em" }}>
            <Ltr>// protocol-level privacy · 21M cap · no trusted setup</Ltr>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
