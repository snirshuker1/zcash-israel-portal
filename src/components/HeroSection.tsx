"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ShieldedTxSVG from "./ShieldedTxSVG";
import GlitchHeroButton from "./GlitchHeroButton";

const AMBER = "#F3B132";
const NEAR_INTENTS_URL = "https://near-intents.org/?from=USDT&to=ZEC";

// ── Scramble / code-decrypt animation ─────────────────────────────────────────
// All characters start randomised and resolve left→right, top→bottom over 2 s.
const SCRAMBLE_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]|/\\~";
const SCRAMBLE_FPS = 32; // ms between scramble frames
const REVEAL_START = 250; // ms before first char locks in
const REVEAL_SPAN = 1750; // ms over which all chars lock in (total ≈ 2 s)

const HEADLINE_LINES: [string, string][] = [
  ["Zcash:", "#09090b"],
  ["Encrypt Your", AMBER],
  ["Money.", "#09090b"],
];

function randChar() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
}

function ScrambleHeadline() {
  // Start with visible random characters so the scramble is instant
  const [display, setDisplay] = useState<string[]>(() =>
    HEADLINE_LINES.map(([t]) =>
      t
        .split("")
        .map((c) => (c === " " ? " " : randChar()))
        .join("")
    )
  );

  useEffect(() => {
    let cancelled = false;

    // Flat list of every non-space character position (top→bottom, left→right)
    const positions: { li: number; ci: number; ch: string }[] = [];
    HEADLINE_LINES.forEach(([text], li) =>
      text.split("").forEach((ch, ci) => {
        if (ch !== " ") positions.push({ li, ci, ch });
      })
    );

    // Mutable working arrays
    const resolved: boolean[][] = HEADLINE_LINES.map(([t]) =>
      t.split("").map((c) => c === " ")
    );
    const buf: string[][] = HEADLINE_LINES.map(([t]) =>
      t.split("").map((c) => (c === " " ? " " : randChar()))
    );

    // Schedule each character's lock-in time
    const timers = positions.map((pos, idx) => {
      const t =
        REVEAL_START +
        (idx / Math.max(positions.length - 1, 1)) * REVEAL_SPAN;
      return setTimeout(() => {
        if (cancelled) return;
        resolved[pos.li][pos.ci] = true;
        buf[pos.li][pos.ci] = pos.ch;
      }, t);
    });

    // Scramble loop — re-randomise every unresolved character each frame
    const interval = setInterval(() => {
      if (cancelled) return;
      let allDone = true;
      for (let li = 0; li < buf.length; li++) {
        for (let ci = 0; ci < buf[li].length; ci++) {
          if (!resolved[li][ci]) {
            buf[li][ci] = randChar();
            allDone = false;
          }
        }
      }
      setDisplay(buf.map((chars) => chars.join("")));
      if (allDone) {
        clearInterval(interval);
        setDisplay(HEADLINE_LINES.map(([t]) => t));
      }
    }, SCRAMBLE_FPS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <h1
      suppressHydrationWarning
      dir="ltr"
      style={{
        fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.08,
        fontFamily: "var(--font-mono), monospace",
        margin: 0,
        marginBottom: 24,
        textAlign: "left",
      }}
    >
      {HEADLINE_LINES.map(([, color], li) => (
        <span key={li}>
          {li > 0 && <br />}
          <span suppressHydrationWarning style={{ color }}>
            {display[li]}
          </span>
        </span>
      ))}
    </h1>
  );
}

// Static headline — holds space before hydration (invisible)
function StaticHeadline() {
  return (
    <h1
      dir="ltr"
      style={{
        fontSize: "clamp(3.2rem, 8vw, 5.5rem)",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        lineHeight: 1.08,
        fontFamily: "var(--font-mono), monospace",
        margin: 0,
        marginBottom: 24,
        opacity: 0,
        textAlign: "left",
      }}
    >
      <span style={{ color: "#09090b" }}>Zcash:</span>
      <br />
      <span style={{ color: AMBER }}>Encrypt Your</span>
      <br />
      <span style={{ color: "#09090b" }}>Money.</span>
    </h1>
  );
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "108px 24px 72px",
        borderBottom: "1px solid #e4e4e7",
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 72,
          flexWrap: "wrap",
        }}
        dir="rtl"
      >
        {/* ── Text content ── */}
        <div style={{ flex: "1 1 440px", minWidth: 0 }}>

          {/* Protocol tag */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
              padding: "5px 14px",
              background: "rgba(243,177,50,0.1)",
              border: "1px solid rgba(243,177,50,0.3)",
              borderRadius: 20,
            }}
          >
            <span
              className="pulse-amber"
              style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, display: "inline-block" }}
            />
            <Ltr>ZCASH MAINNET · ACTIVE</Ltr>
          </motion.div>

          {/* Headline */}
          {mounted ? <ScrambleHeadline /> : <StaticHeadline />}

          {/* Hebrew sub-headline */}
          <motion.p
            suppressHydrationWarning
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: "1.35rem",
              color: "#71717a",
              lineHeight: 1.75,
              marginBottom: 14,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              maxWidth: 500,
              fontWeight: 400,
            }}
          >
            ריבונות פיננסית מוכחת מתמטית. אספקה קבועה של{" "}
            <Ltr mono>
              <span style={{ color: "#09090b", fontWeight: 700 }}>21,000,000 ZEC</span>
            </Ltr>
            .
          </motion.p>
          <motion.p
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontSize: "0.9rem",
              color: "#a1a1aa",
              marginBottom: 40,
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "0.05em",
            }}
            dir="ltr"
          >
            // <Ltr>zk-SNARKs</Ltr> · <Ltr>Halo 2</Ltr> · <Ltr>No Trusted Setup</Ltr> · since 2016
          </motion.p>

          {/* CTAs */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
          >
            {/* Primary glitch CTA → immersive page */}
            <GlitchHeroButton />

            <a
              href={NEAR_INTENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                background: "transparent",
                border: "1px solid #e4e4e7",
                color: "#71717a",
                fontWeight: 500,
                fontSize: "1.05rem",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                textDecoration: "none",
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
              <span style={{ color: AMBER }}>◎</span>
              <span>
                רכישת <Ltr mono>Zcash</Ltr>
              </span>
            </a>
          </motion.div>

          {/* Key stats strip */}
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{
              display: "flex",
              gap: 36,
              marginTop: 52,
              paddingTop: 32,
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
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#09090b",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#a1a1aa",
                    marginTop: 3,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── SVG mockup ── */}
        <motion.div
          suppressHydrationWarning
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ flex: "1 1 480px", minWidth: 0, display: "flex", justifyContent: "center" }}
          dir="ltr"
        >
          <ShieldedTxSVG />
        </motion.div>
      </div>
    </section>
  );
}
