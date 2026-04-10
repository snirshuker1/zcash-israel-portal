"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";

const AMBER = "#F3B132";
const BASE_TEXT = "למה הכסף שלך שקוף?";
const HOVER_TEXT = "גלה את האמת";

export default function GlitchHeroButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [slicePhase, setSlicePhase] = useState(0); // 0=idle, 1=top-slice, 2=bottom-slice

  const containerControls = useAnimation();
  const redControls = useAnimation();
  const cyanControls = useAnimation();

  const runGlitch = useCallback(async () => {
    // ── Phase 1: violent spike (180 ms) ─────────────────────────────────
    setSlicePhase(1);

    containerControls.start({
      x: [0, -5, 7, -4, 6, -2, 0],
      y: [0, 2, -3, 1, -2, 1, 0],
      skewX: [0, -3, 4, -2, 3, -1, 0],
      filter: [
        "brightness(1) contrast(1)",
        "brightness(2.2) contrast(1.4) saturate(2)",
        "brightness(0.5) contrast(2.5)",
        "brightness(1.8) contrast(1.2)",
        "brightness(1) contrast(1)",
      ],
      transition: {
        duration: 0.18,
        times: [0, 0.15, 0.35, 0.6, 0.8, 0.92, 1],
        ease: "linear",
      },
    });

    redControls.start({
      x: [0, -10, 6, -7, 3, 0],
      opacity: [0, 0.95, 0.7, 0.85, 0.3, 0],
      transition: { duration: 0.18, ease: "linear" },
    });

    cyanControls.start({
      x: [0, 10, -6, 7, -3, 0],
      opacity: [0, 0.85, 0.6, 0.75, 0.2, 0],
      transition: { duration: 0.18, ease: "linear" },
    });

    await new Promise((r) => setTimeout(r, 180));

    // ── Phase 2: offset artifact slice (110 ms) ──────────────────────────
    setSlicePhase(2);
    containerControls.start({
      x: [0, 3, -2, 1, 0],
      transition: { duration: 0.11, ease: "linear" },
    });

    await new Promise((r) => setTimeout(r, 110));

    // ── Phase 3: final twitch (60 ms) ────────────────────────────────────
    setSlicePhase(3);
    containerControls.start({
      x: [0, -2, 1, 0],
      filter: ["brightness(1.3)", "brightness(1)"],
      transition: { duration: 0.06, ease: "linear" },
    });

    await new Promise((r) => setTimeout(r, 60));
    setSlicePhase(0);
  }, [containerControls, redControls, cyanControls]);

  // Periodic glitch loop
  useEffect(() => {
    let active = true;
    const loop = async () => {
      while (active) {
        await new Promise((r) => setTimeout(r, 1400));
        if (active) await runGlitch();
      }
    };
    loop();
    return () => {
      active = false;
    };
  }, [runGlitch]);

  const sliceStyle = (phase: number): React.CSSProperties => {
    if (phase === 2)
      return { clipPath: "inset(22% 0 46% 0)", transform: "translateX(-7px)" };
    if (phase === 3)
      return { clipPath: "inset(58% 0 12% 0)", transform: "translateX(5px)" };
    return { clipPath: "inset(0 0 0 0)", opacity: 0 };
  };

  const currentText = isHovered ? HOVER_TEXT : BASE_TEXT;

  return (
    <Link href="/immersive" style={{ textDecoration: "none", display: "inline-block" }}>
      <motion.div
        animate={containerControls}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 32px",
          background: "#09090B",
          border: `1px solid ${AMBER}`,
          borderRadius: 12,
          cursor: "pointer",
          minWidth: 240,
          overflow: "visible",
          // Gold glow appears on hover via CSS transition
          boxShadow: isHovered
            ? `0 0 22px ${AMBER}99, 0 0 50px ${AMBER}55, 0 0 90px ${AMBER}28`
            : `0 0 0px ${AMBER}00`,
          transition: "box-shadow 0.35s ease",
        }}
      >
        {/* ── Scanline noise (glitch phases) ─────────────────────────── */}
        {slicePhase > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 12,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(243,177,50,0.14) 1px,rgba(243,177,50,0.14) 2px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* ── Red chromatic channel ───────────────────────────────────── */}
        <motion.span
          animate={redControls}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            color: "rgba(255, 30, 30, 0.95)",
            fontWeight: 700,
            fontSize: "1.05rem",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            pointerEvents: "none",
            mixBlendMode: "screen",
            zIndex: 2,
            whiteSpace: "nowrap",
          }}
          dir="rtl"
        >
          {currentText}
        </motion.span>

        {/* ── Cyan chromatic channel ──────────────────────────────────── */}
        <motion.span
          animate={cyanControls}
          initial={{ opacity: 0 }}
          style={{
            position: "absolute",
            color: "rgba(0, 220, 255, 0.85)",
            fontWeight: 700,
            fontSize: "1.05rem",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            pointerEvents: "none",
            mixBlendMode: "screen",
            zIndex: 2,
            whiteSpace: "nowrap",
          }}
          dir="rtl"
        >
          {currentText}
        </motion.span>

        {/* ── Clipped artifact slice ──────────────────────────────────── */}
        {slicePhase >= 2 && (
          <span
            style={{
              position: "absolute",
              color: AMBER,
              fontWeight: 700,
              fontSize: "1.05rem",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              pointerEvents: "none",
              zIndex: 4,
              whiteSpace: "nowrap",
              ...sliceStyle(slicePhase),
            }}
            dir="rtl"
          >
            {currentText}
          </span>
        )}

        {/* ── Main text (cross-fades on hover) ───────────────────────── */}
        <AnimatePresence mode="wait">
          {isHovered ? (
            <motion.span
              key="hover"
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.22 }}
              style={{
                color: AMBER,
                fontWeight: 700,
                fontSize: "1.05rem",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                position: "relative",
                zIndex: 3,
                whiteSpace: "nowrap",
                filter: `drop-shadow(0 0 10px ${AMBER}cc)`,
              }}
              dir="rtl"
            >
              {HOVER_TEXT}
            </motion.span>
          ) : (
            <motion.span
              key="base"
              initial={{ opacity: 0, y: -7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 7 }}
              transition={{ duration: 0.22 }}
              style={{
                color: AMBER,
                fontWeight: 700,
                fontSize: "1.05rem",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                position: "relative",
                zIndex: 3,
                whiteSpace: "nowrap",
              }}
              dir="rtl"
            >
              {BASE_TEXT}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
