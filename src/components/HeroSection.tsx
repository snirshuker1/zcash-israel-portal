"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import ShieldedTxSVG from "./ShieldedTxSVG";
import GlitchHeroButton from "./GlitchHeroButton";
import { PageReadyContext } from "./PageWrapper";

const statsFetcher = (url: string) => fetch(url).then((r) => r.json());

function formatSupply(zec: number): string {
  return `${(zec / 1_000_000).toFixed(2)}M`;
}

const AMBER = "#F3B132";
const NEAR_INTENTS_URL = "https://near-intents.org/?from=USDT&to=ZEC";

// ── Scramble / code-decrypt animation ─────────────────────────────────────────
// First character locks in instantly when the reveal starts; the rest cascade
// left→right, top→bottom across REVEAL_SPAN.
const SCRAMBLE_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]|/\\~";
const SCRAMBLE_FPS = 28; // ms between scramble frames
const REVEAL_START = 0; // first char locks in immediately
const REVEAL_SPAN = 1400; // ms over which the remaining chars lock in

const HEADLINE_LINES: [string, string][] = [
  ["Zcash:", "#09090b"],
  ["Encrypt Your", AMBER],
  ["Money.", "#09090b"],
];

function randChar() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
}

function buildResolved(): boolean[][] {
  return HEADLINE_LINES.map(([t]) => t.split("").map((c) => c === " "));
}

function buildScrambledBuf(): string[][] {
  return HEADLINE_LINES.map(([t]) =>
    t.split("").map((c) => (c === " " ? " " : randChar()))
  );
}

function ScrambleHeadline({ pageReady }: { pageReady: boolean }) {
  // Initial state: scrambled chars on both server and client. The space is
  // reserved correctly and the headline is visible from the very first paint.
  // Hydration mismatch is expected (server randoms ≠ client randoms) and
  // suppressed — both look like scramble noise to the user.
  const [display, setDisplay] = useState<string[]>(() =>
    buildScrambledBuf().map((chars) => chars.join(""))
  );

  // Refs shared by the always-on scramble loop and the gated reveal timers.
  const bufRef = useRef<string[][]>(buildScrambledBuf());
  const resolvedRef = useRef<boolean[][]>(buildResolved());

  // Always-on scramble loop — re-randomises every unresolved char each frame.
  // Runs from mount so the headline is alive even while the loading
  // interstitial is fading out, with no static frame in between.
  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      const buf = bufRef.current;
      const resolved = resolvedRef.current;
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
    };
  }, []);

  // Reveal timers — only scheduled once the loading interstitial has
  // dismissed, so the resolve animation plays for the user instead of
  // running invisibly behind the cover. The first character is locked in
  // synchronously so the sentence starts appearing on the same frame.
  useEffect(() => {
    if (!pageReady) return;

    const positions: { li: number; ci: number; ch: string }[] = [];
    HEADLINE_LINES.forEach(([text], li) =>
      text.split("").forEach((ch, ci) => {
        if (ch !== " ") positions.push({ li, ci, ch });
      })
    );
    if (positions.length === 0) return;

    // Lock in the first character immediately, then push it to display so
    // the user sees a real letter on the very first paint after pageReady.
    const first = positions[0];
    resolvedRef.current[first.li][first.ci] = true;
    bufRef.current[first.li][first.ci] = first.ch;
    setDisplay(bufRef.current.map((chars) => chars.join("")));

    const timers = positions.slice(1).map((pos, i) => {
      const idx = i + 1;
      const t =
        REVEAL_START +
        (idx / Math.max(positions.length - 1, 1)) * REVEAL_SPAN;
      return setTimeout(() => {
        resolvedRef.current[pos.li][pos.ci] = true;
        bufRef.current[pos.li][pos.ci] = pos.ch;
      }, t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [pageReady]);

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
  // Headline always renders with scrambled chars (no opacity-0 placeholder).
  // The reveal animation only kicks in once PageWrapper signals the loading
  // interstitial has dismissed.
  const pageReady = useContext(PageReadyContext);

  // Live ZEC circulating supply via CoinGecko (proxied through /api/zcash/stats)
  const { data: stats } = useSWR<{ circulatingSupply: number | null }>(
    "/api/zcash/stats",
    statsFetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false }
  );
  const circulatingSupply = stats?.circulatingSupply ?? null;

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
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>

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
          <ScrambleHeadline pageReady={pageReady} />

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
              {
                label: "ZEC Circulating Supply",
                value: circulatingSupply !== null ? formatSupply(circulatingSupply) : "—",
              },
              { label: "Since", value: "2016" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  suppressHydrationWarning
                  className="tabular-nums"
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
          style={{ flex: "1 1 300px", minWidth: 0, width: "100%", display: "flex", justifyContent: "center" }}
          dir="ltr"
        >
          <ShieldedTxSVG />
        </motion.div>
      </div>
    </section>
  );
}
