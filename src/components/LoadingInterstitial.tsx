"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CryptoMemoryCanvas from "./CryptoMemoryCanvas";

// ─── Constants ────────────────────────────────────────────────────────────────
const AMBER = "#F3B132";
const SCRAMBLE_CHARS = "0123456789ABCDEFabcdef◎⬡▓░∑∏≈≠±∞⚡✦◆▪▫";
const FINAL_TEXT = "זיקאש ישראל";

const SCRAMBLE_START_MS = 200;
const SCRAMBLE_STAGGER_MS = 80;
const HOLD_AFTER_DONE_MS = 900;
const FADE_DURATION_S = 0.7;

// ─── Zcash SVG (official ECC logo) ────────────────────────────────────────────
function ZcashLogo({ size = 58 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 493.3 490.2"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Zcash"
    >
      {/* Outer dark ring */}
      <path
        d="m245.4 20c-124.3 0-225.4 101.1-225.4 225.4s101.1 225.4 225.4 225.4 225.4-101.1 225.4-225.4-101.1-225.4-225.4-225.4zm0 413.6c-103.8 0-188.2-84.4-188.2-188.2s84.4-188.2 188.2-188.2 188.2 84.4 188.2 188.2-84.4 188.2-188.2 188.2z"
        fill="#09090B"
      />
      {/* Gold circle */}
      <circle cx="245.4" cy="245.4" r="177.6" fill={AMBER} />
      {/* Official Z mark */}
      <path
        d="m165 315.5v34.4h61.5v37.7h37.8v-37.7h61.5v-45.5h-95.4l95.4-129.4v-34.4h-61.5v-37.6h-37.8v37.6h-61.5v45.6h95.4z"
        fill="#09090B"
      />
    </svg>
  );
}

// ─── Scramble hook ────────────────────────────────────────────────────────────
function useScramble(target: string, startDelay: number) {
  const chars = target.split("");
  const [display, setDisplay] = useState<string[]>(() => [...chars]);
  const [phase, setPhase] = useState<("idle" | "scrambling" | "settled")[]>(() =>
    chars.map(() => "idle")
  );
  const [done, setDone] = useState(false);
  const phaseRef = useRef<("idle" | "scrambling" | "settled")[]>(chars.map(() => "idle"));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const startT = setTimeout(() => {
      phaseRef.current = chars.map((ch) => (ch === " " ? "settled" : "scrambling"));
      setPhase([...phaseRef.current]);

      interval = setInterval(() => {
        setDisplay((prev) =>
          prev.map((_, i) =>
            phaseRef.current[i] !== "scrambling"
              ? target[i]
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          )
        );
      }, 33);

      const lastNonSpace = chars.reduce((acc, ch, idx) => (ch !== " " ? idx : acc), 0);
      chars.forEach((ch, i) => {
        if (ch === " ") return;
        setTimeout(() => {
          phaseRef.current[i] = "settled";
          setPhase((p) => { const n = [...p]; n[i] = "settled"; return n; });
          setDisplay((p) => { const n = [...p]; n[i] = target[i]; return n; });
          if (i === lastNonSpace) {
            setTimeout(() => { clearInterval(interval); setDone(true); }, 120);
          }
        }, i * SCRAMBLE_STAGGER_MS);
      });
    }, startDelay);

    return () => { clearTimeout(startT); clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { display, phase, done };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoadingInterstitial({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { display, phase, done } = useScramble(FINAL_TEXT, SCRAMBLE_START_MS);

  // Mouse parallax on card
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!cardRef.current) return;
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      cardRef.current.style.transform = `translate(${(x * -8).toFixed(1)}px,${(y * -8).toFixed(1)}px)`;
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Trigger unified fade-out once scramble is done
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setFading(true), HOLD_AFTER_DONE_MS);
    return () => clearTimeout(t);
  }, [done]);

  const progressDuration =
    (SCRAMBLE_START_MS + FINAL_TEXT.length * SCRAMBLE_STAGGER_MS + 200) / 1000;

  return (
    // Outer wrapper — fades as a whole unit, both layers together
    <motion.div
      initial={{ opacity: 1 }}
      animate={fading ? { opacity: 0 } : { opacity: 1 }}
      transition={fading ? { duration: FADE_DURATION_S, ease: [0.4, 0, 0.2, 1] } : {}}
      onAnimationComplete={() => { if (fading) onDone(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "#020202",
      }}
    >

      {/* ── LAYER 1: Cryptographic Memory Matrix canvas background ── */}
      <CryptoMemoryCanvas />

      {/* Vignette — softens edges of code rain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 20%, rgba(2,2,2,0.45) 65%, rgba(2,2,2,0.88) 100%)",
        }}
      />

      {/* Scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* ── LAYER 2: Centered content overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div ref={cardRef} style={{ willChange: "transform" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "52px 72px 44px",
              borderRadius: 28,
              background: "rgba(2,2,2,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(32px) saturate(1.4)",
              WebkitBackdropFilter: "blur(32px) saturate(1.4)",
              boxShadow: [
                "0 0 0 1px rgba(243,177,50,0.05)",
                "0 32px 100px rgba(0,0,0,0.85)",
                "0 8px 32px rgba(0,0,0,0.4)",
                "inset 0 1px 0 rgba(255,255,255,0.04)",
                "inset 0 -1px 0 rgba(0,0,0,0.2)",
              ].join(", "),
            }}
          >
            {/* Zcash logo with bloom */}
            <div
              style={{
                filter: [
                  `drop-shadow(0 0 40px ${AMBER}55)`,
                  `drop-shadow(0 0 14px ${AMBER}35)`,
                  `drop-shadow(0 0 4px ${AMBER}20)`,
                  `drop-shadow(0 2px 6px rgba(0,0,0,0.7))`,
                ].join(" "),
              }}
            >
              <ZcashLogo size={58} />
            </div>

            {/* Hebrew text — rapid decipher reveal */}
            <div
              dir="rtl"
              style={{
                display: "inline-flex",
                fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontFamily: "var(--font-sans), Heebo, system-ui, sans-serif",
              }}
            >
              {display.map((ch, i) => {
                const isScrambling = phase[i] === "scrambling";
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      width: FINAL_TEXT[i] === " " ? "0.4em" : undefined,
                      color: isScrambling ? AMBER : "#ffffff",
                      textShadow: isScrambling
                        ? `0 0 12px ${AMBER}70, 0 0 4px ${AMBER}40`
                        : "0 0 40px rgba(255,255,255,0.08)",
                      transition: "color 0.16s ease, text-shadow 0.3s ease",
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>

            {/* Subtitle */}
            <p
              dir="ltr"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                color: AMBER,
                marginTop: -8,
                textTransform: "uppercase" as const,
                opacity: done ? 1 : 0,
                transition: "opacity 0.45s ease",
              }}
            >
              Financial_Sovereignty // ZK_Proven
            </p>

            {/* Progress bar */}
            <div
              style={{
                width: "100%",
                height: 1.5,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 2,
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: progressDuration,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.12,
                }}
                style={{
                  height: "100%",
                  background: `linear-gradient(to right, ${AMBER}50, ${AMBER})`,
                  boxShadow: `0 0 12px ${AMBER}40, 0 0 4px ${AMBER}60`,
                  borderRadius: 2,
                  transformOrigin: "left center",
                  willChange: "transform",
                }}
              />
            </div>

            {/* Technical info */}
            <div
              dir="ltr"
              style={{
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                fontSize: "0.54rem",
                color: "#555",
                letterSpacing: "0.12em",
                marginTop: -8,
                opacity: 0.24,
              }}
            >
              BLOCK #2,726,400 &middot; NU6 &middot; SHA-256d &middot; zk-SNARKs [Halo 2]
            </div>
          </div>
        </div>
      </div>

      {/* ── Corner brackets ── */}
      {[
        { top: 20, left: 20, rot: 0 },
        { top: 20, right: 20, rot: 90 },
        { bottom: 20, right: 20, rot: 180 },
        { bottom: 20, left: 20, rot: 270 },
      ].map((pos, i) => {
        const { rot, ...position } = pos;
        return (
          <div
            key={`corner-${i}`}
            style={{
              position: "absolute",
              width: 30,
              height: 30,
              borderTop: `1px solid ${AMBER}30`,
              borderLeft: `1px solid ${AMBER}30`,
              transform: `rotate(${rot}deg)`,
              zIndex: 3,
              ...position,
            }}
          />
        );
      })}

      {/* ── Corner labels ── */}
      <div
        dir="ltr"
        style={{
          position: "absolute", top: 28, left: 56, zIndex: 3,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.48rem", color: AMBER, letterSpacing: "0.1em", opacity: 0.16,
        }}
      >
        0x1A2F...C7E9
      </div>
      <div
        dir="ltr"
        style={{
          position: "absolute", bottom: 28, right: 56, zIndex: 3,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.48rem", color: AMBER, letterSpacing: "0.1em", opacity: 0.16,
        }}
      >
        ZEC::SHIELDED
      </div>
    </motion.div>
  );
}
