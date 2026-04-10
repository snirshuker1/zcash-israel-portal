"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const AMBER       = "#F3B132";
const AMBER_LIGHT = "#FDE68A";
const AMBER_DARK  = "#92400E";
const RED         = "#EF4444";
const RED_DARK    = "#7F1D1D";

/* ─────────────────────────────────────────────────────────────
   Deterministic pseudo-random (no Math.random → no hydration mismatch)
───────────────────────────────────────────────────────────── */
function prand(seed: number, max = 1, min = 0): number {
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  const r = s - Math.floor(s);
  return min + r * (max - min);
}

/* ─────────────────────────────────────────────────────────────
   32 pre-computed shatter fragments
   Each fragment has a `startAt` within [0, 0.55] so they
   stagger across the scroll range rather than all firing at once.
───────────────────────────────────────────────────────────── */
interface FragDatum {
  startX: number; startY: number;
  exitX:  number; exitY:  number;
  rotate: number;
  w: number; h: number;
  startAt: number;
  color: string;
}

const PALETTE = [RED, "#DC2626", "#B91C1C", RED_DARK, "#991B1B"];
const FRAGMENT_COUNT = 32;

const SHATTER: FragDatum[] = Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
  const baseAngle = (i / FRAGMENT_COUNT) * Math.PI * 2;
  const spread    = prand(i + 7,  0.6, -0.3);
  const innerR    = prand(i + 20, 55,  8);
  const outerR    = prand(i + 40, 290, 160);
  return {
    startX:  Math.cos(baseAngle) * innerR,
    startY:  Math.sin(baseAngle) * innerR,
    exitX:   Math.cos(baseAngle + spread) * outerR,
    exitY:   Math.sin(baseAngle + spread) * outerR,
    rotate:  prand(i + 200, 720, -720),
    w:       prand(i + 300, 22,  5),
    h:       prand(i + 400,  6,  2),
    startAt: (i / FRAGMENT_COUNT) * 0.55,
    color:   PALETTE[Math.floor(prand(i + 500, PALETTE.length, 0))],
  };
});

/* ─────────────────────────────────────────────────────────────
   LTR wrapper for Hebrew pages
───────────────────────────────────────────────────────────── */
function Ltr({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <span dir="ltr" className="inline-block"
      style={mono ? { fontFamily: "var(--font-mono), monospace" } : undefined}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   CRT Overlay — scanlines + moving beam + vignette
───────────────────────────────────────────────────────────── */
function CRTOverlay() {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, " +
          "rgba(0,0,0,0.065) 3px, rgba(0,0,0,0.065) 4px)",
      }} />
      <motion.div
        style={{
          position: "fixed", left: 0, right: 0, height: 140, zIndex: 61,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(243,177,50,0.03) 50%, transparent 100%)",
        }}
        initial={{ y: "-140px" }}
        animate={{ y: "110vh" }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />
      <div style={{
        position: "fixed", inset: 0, zIndex: 59, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 58, pointerEvents: "none",
        boxShadow: "inset 0 0 120px rgba(0,0,0,0.4)",
      }} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Grid overlay + Section-3 golden tint (fixed, scroll-driven)
───────────────────────────────────────────────────────────── */
function GridOverlay({ goldenTint }: { goldenTint: MotionValue<number> }) {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(243,177,50,0.028) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(243,177,50,0.028) 1px, transparent 1px)",
        backgroundSize: "58px 58px",
      }} />
      <motion.div style={{
        position: "fixed", inset: 0, zIndex: 3, pointerEvents: "none",
        backgroundColor: AMBER,
        opacity: goldenTint,
      }} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 1 — Surveillance web
───────────────────────────────────────────────────────────── */
function SurveillanceWeb({ sectionProgress }: { sectionProgress: MotionValue<number> }) {
  const webScale   = useTransform(sectionProgress, [0.55, 1], [1,   0.7]);
  const webOpacity = useTransform(sectionProgress, [0.5,  1], [1,   0  ]);

  const nodes = Array.from({ length: 12 }, (_, i) => {
    const a  = (i / 12) * Math.PI * 2;
    const rx = 130 + prand(i, 35, 0);
    const ry = 100 + prand(i + 50, 30, 0);
    return { x: 200 + rx * Math.cos(a), y: 200 + ry * Math.sin(a) };
  });

  return (
    <motion.div style={{ scale: webScale, opacity: webOpacity }}>
      <svg viewBox="0 0 400 400" fill="none" style={{ width: "100%", maxWidth: 370 }}>
        <defs>
          <filter id="cam-glow">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {nodes.map((n, i) => (
          <motion.path key={`tl-${i}`}
            d={`M${n.x},${n.y} L200,205`}
            stroke={RED} strokeWidth="1.2" strokeOpacity="0.82"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{
              duration: 4.5, delay: i * 0.38, repeat: Infinity,
              ease: "easeInOut", times: [0, 0.35, 0.78, 1],
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g key={`cn-${i}`}
            transform={`translate(${n.x - 11},${n.y - 7})`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2 + prand(i, 1.2), delay: prand(i, 1.8), repeat: Infinity }}>
            <rect width="22" height="14" rx="2" fill={RED_DARK}/>
            <rect x="22" y="4" width="7" height="6" rx="1" fill="#6B1414"/>
            <circle cx="11" cy="7" r="4" fill="#1C1917"/>
            <circle cx="11" cy="7" r="2" fill={RED} opacity="0.9"/>
            <motion.circle cx="18.5" cy="2.5" r="1.8" fill={RED}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, delay: prand(i, 1), repeat: Infinity }}/>
          </motion.g>
        ))}
        <g opacity="0.9">
          <circle cx="200" cy="155" r="28" fill="#52525B"/>
          <rect x="178" y="183" width="44" height="66" rx="10" fill="#52525B"/>
          <rect x="144" y="189" width="34" height="12" rx="6" fill="#3F3F46"/>
          <rect x="222" y="189" width="34" height="12" rx="6" fill="#3F3F46"/>
          <rect x="184" y="249" width="14" height="52" rx="7" fill="#3F3F46"/>
          <rect x="202" y="249" width="14" height="52" rx="7" fill="#3F3F46"/>
        </g>
        {[-42, -14, 14, 42].map((ox, i) => (
          <motion.path key={`pb-${i}`}
            d={`M${200 + ox},122 L${200 + ox},318`}
            stroke={RED} strokeWidth="2" strokeOpacity="0.60"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: "easeOut" }}
          />
        ))}
        {[0, 1].map(j => (
          <motion.circle key={`pr-${j}`} cx="200" cy="200" r="55"
            stroke={RED} strokeWidth="1" fill="none"
            animate={{ r: [55, 115, 175], opacity: [0.9, 0.42, 0] }}
            transition={{ duration: 4, delay: j * 2, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Single shatter fragment — ALL motion driven by scroll MotionValue.
   No animate/transition; position is purely derived from `shatterProgress`.
───────────────────────────────────────────────────────────── */
function ShatterFragment({
  f,
  shatterProgress,
}: {
  f: FragDatum;
  shatterProgress: MotionValue<number>;
}) {
  const endAt = Math.min(f.startAt + 0.38, 1);
  const midAt = Math.min(f.startAt + 0.07, endAt);

  const x       = useTransform(shatterProgress, [f.startAt, endAt], [0, f.exitX - f.startX]);
  const y       = useTransform(shatterProgress, [f.startAt, endAt], [0, f.exitY - f.startY]);
  const rotate  = useTransform(shatterProgress, [f.startAt, endAt], [0, f.rotate]);
  const scale   = useTransform(shatterProgress, [f.startAt, endAt], [1.1, 0.05]);
  const opacity = useTransform(shatterProgress, [f.startAt, midAt, endAt], [0, 1, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left:  `calc(50% + ${f.startX}px - ${f.w / 2}px)`,
        top:   `calc(50% + ${f.startY}px - ${f.h / 2}px)`,
        width:  f.w,
        height: f.h,
        backgroundColor: f.color,
        borderRadius: 2,
        transformOrigin: "center",
        x, y, rotate, scale, opacity,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 2 — ZK Shield shatter (scroll-driven)
   sectionProgress 0.22→0.65 maps to shatter 0→1
───────────────────────────────────────────────────────────── */
function ShatterReveal({ sectionProgress }: { sectionProgress: MotionValue<number> }) {
  const shatterProgress = useTransform(sectionProgress, [0.22, 0.65], [0, 1]);

  const preOpacity  = useTransform(shatterProgress, [0, 0.18, 0.52], [1, 1, 0]);
  const postOpacity = useTransform(shatterProgress, [0.42, 0.78], [0, 1]);
  const postScale   = useTransform(shatterProgress, [0.42, 0.78], [0.85, 1]);
  const proofOpacity = useTransform(shatterProgress, [0.72, 0.9], [0, 0.7]);
  const proofY       = useTransform(shatterProgress, [0.72, 0.9], [8, 0]);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 380, aspectRatio: "1", margin: "0 auto" }}>

      {/* Pre-shatter: dim chained shield */}
      <motion.div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: preOpacity,
      }}>
        <svg viewBox="0 0 280 260" fill="none"
          style={{ width: "min(280px, 90%)", filter: "sepia(1) saturate(0.15) hue-rotate(180deg) brightness(0.55)" }}>
          <path d="M140 22 L205 47 L205 122 Q205 180 140 200 Q75 180 75 122 L75 47 Z" fill="#71717A"/>
          <path d="M140 22 L205 47 L205 122 Q205 180 140 200 Q75 180 75 122 L75 47 Z"
            fill="none" stroke="#52525B" strokeWidth="2"/>
          <text x="140" y="133" textAnchor="middle" dominantBaseline="auto"
            fill="#3F3F46" fontSize="68" fontWeight="900" fontFamily="monospace">Z</text>
        </svg>
      </motion.div>

      {/* Post-shatter: gold shield */}
      <motion.div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: postOpacity, scale: postScale,
      }}>
        <svg viewBox="0 0 280 260" fill="none" style={{ width: "min(280px, 90%)" }}>
          <defs>
            <linearGradient id="gold-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={AMBER_LIGHT}/>
              <stop offset="22%"  stopColor={AMBER}/>
              <stop offset="48%"  stopColor={AMBER_DARK} stopOpacity="0.85"/>
              <stop offset="72%"  stopColor={AMBER}/>
              <stop offset="100%" stopColor={AMBER_LIGHT}/>
            </linearGradient>
            <linearGradient id="gold-sheen" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={AMBER_LIGHT} stopOpacity="0.55"/>
              <stop offset="50%"  stopColor={AMBER_LIGHT} stopOpacity="0.08"/>
              <stop offset="100%" stopColor={AMBER_DARK}  stopOpacity="0.25"/>
            </linearGradient>
            <filter id="shield-core-glow" x="-45%" y="-45%" width="190%" height="190%">
              <feGaussianBlur stdDeviation="11" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d="M140 22 L205 47 L205 122 Q205 180 140 200 Q75 180 75 122 L75 47 Z"
            fill="url(#gold-leaf)"
            filter="url(#shield-core-glow)"
            animate={{ opacity: [0.85, 1, 0.9, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d="M140 22 L205 47 L205 122 Q205 180 140 200 Q75 180 75 122 L75 47 Z"
            fill="url(#gold-sheen)"
          />
          <text x="140" y="133" textAnchor="middle" dominantBaseline="auto"
            fill="#09090B" fontSize="68" fontWeight="900" fontFamily="monospace">Z</text>
          {Array.from({ length: 8 }, (_, i) => {
            const a  = (i / 8) * Math.PI * 2;
            const r1 = 108, r2 = 136;
            return (
              <motion.line key={`ray-${i}`}
                x1={140 + r1 * Math.cos(a)} y1={111 + r1 * Math.sin(a)}
                x2={140 + r2 * Math.cos(a)} y2={111 + r2 * Math.sin(a)}
                stroke={AMBER_LIGHT} strokeWidth="1.5" strokeOpacity="0.65"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: [0, 0.9, 0.5], pathLength: 1 }}
                transition={{ duration: 0.9, delay: i * 0.07 }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* 32 scroll-driven shatter fragments */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
        {SHATTER.map((f, i) => (
          <ShatterFragment key={`sf-${i}`} f={f} shatterProgress={shatterProgress} />
        ))}
      </div>

      {/* Proof equation — appears when liberation completes */}
      <motion.div style={{
        position: "absolute", bottom: -48, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "var(--font-mono), monospace",
        fontSize: "0.68rem", color: AMBER, letterSpacing: "0.1em",
        opacity: proofOpacity,
        y: proofY,
      }}>
        <span dir="ltr">∀ x : Prove(x) → ¬Reveal(witness)</span>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section 3 — Luminous Sovereign
───────────────────────────────────────────────────────────── */
function LuminousSovereign({ inView }: { inView: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 380, margin: "0 auto" }}>
      <motion.div style={{
        position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)",
        width: 240, height: 340, borderRadius: "50%",
        backgroundColor: AMBER, filter: "blur(90px)", zIndex: 0,
      }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.16 } : { opacity: 0 }}
        transition={{ duration: 2.2 }}
      />
      <motion.div style={{
        position: "absolute", top: "24%", left: "50%", transform: "translateX(-50%)",
        width: 130, height: 210, borderRadius: "50%",
        backgroundColor: AMBER_LIGHT, filter: "blur(40px)", zIndex: 0,
      }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.21 } : { opacity: 0 }}
        transition={{ duration: 2, delay: 0.3 }}
      />

      <svg viewBox="0 0 400 480" fill="none"
        style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <defs>
          <linearGradient id="sov-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={AMBER_LIGHT}/>
            <stop offset="38%"  stopColor={AMBER}/>
            <stop offset="100%" stopColor={AMBER_DARK} stopOpacity="0.82"/>
          </linearGradient>
          <radialGradient id="sov-body-shine" cx="40%" cy="30%">
            <stop offset="0%"   stopColor={AMBER_LIGHT} stopOpacity="0.55"/>
            <stop offset="100%" stopColor={AMBER}       stopOpacity="0"/>
          </radialGradient>
          <filter id="fig-glow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="9" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="crown-glow" x="-65%" y="-65%" width="230%" height="230%">
            <feGaussianBlur stdDeviation="16" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {[88, 114, 140].map((r, i) => (
          <motion.circle key={`pcr-${r}`}
            cx="200" cy="272" r={r}
            stroke={AMBER} strokeWidth="0.6" fill="none" strokeOpacity="0.22"
            style={{ transformOrigin: "200px 272px" }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 1.1, delay: 0.45 + i * 0.22, ease: "easeOut" }}
          />
        ))}

        <motion.g
          style={{ transformOrigin: "200px 272px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
          {[0, 90, 180, 270].map(deg => {
            const r   = 120;
            const rad = (deg * Math.PI) / 180;
            const sx  = 200 + r * Math.cos(rad);
            const sy  = 272 + r * Math.sin(rad);
            return (
              <g key={deg} transform={`translate(${sx - 9},${sy - 11})`}>
                <path d="M9 0 L18 4 L18 12 Q18 20 9 23 Q0 20 0 12 L0 4 Z"
                  fill={AMBER} opacity="0.8"/>
              </g>
            );
          })}
        </motion.g>

        <motion.g filter="url(#crown-glow)"
          style={{ transformOrigin: "200px 78px" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <path d="M200 22 L248 42 L248 84 Q248 125 200 142 Q152 125 152 84 L152 42 Z"
            fill="url(#sov-gold)"/>
          <text x="200" y="98" textAnchor="middle" fill="#09090B"
            fontSize="50" fontWeight="900" fontFamily="monospace">Z</text>
        </motion.g>

        <motion.g filter="url(#fig-glow)"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}>
          <circle cx="200" cy="194" r="34" fill="url(#sov-gold)"/>
          <rect x="174" y="228" width="52" height="86" rx="14" fill="url(#sov-gold)"/>
          <rect x="174" y="228" width="52" height="86" rx="14" fill="url(#sov-body-shine)"/>
          <rect x="134" y="234" width="40" height="15" rx="7" fill={AMBER_DARK}/>
          <rect x="226" y="234" width="40" height="15" rx="7" fill={AMBER_DARK}/>
          <rect x="180" y="314" width="17" height="72" rx="8" fill={AMBER_DARK}/>
          <rect x="203" y="314" width="17" height="72" rx="8" fill={AMBER_DARK}/>
        </motion.g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Scroll indicator
───────────────────────────────────────────────────────────── */
function ScrollCue() {
  return (
    <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}>
        <div style={{
          width: 22, height: 38, borderRadius: 11,
          border: "1.5px solid rgba(243,177,50,0.38)",
          display: "flex", justifyContent: "center", paddingTop: 7,
        }}>
          <motion.div
            style={{ width: 3, height: 8, borderRadius: 2, backgroundColor: "rgba(243,177,50,0.72)" }}
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 2.3, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function ZcashImmersivePage() {
  const sec1Ref = useRef<HTMLElement>(null);
  const sec2Ref = useRef<HTMLElement>(null);
  const sec3Ref = useRef<HTMLElement>(null);

  const { scrollYProgress: s1p } = useScroll({ target: sec1Ref, offset: ["start end", "end start"] });
  const { scrollYProgress: s2p } = useScroll({ target: sec2Ref, offset: ["start end", "end start"] });
  const { scrollYProgress: s3p } = useScroll({ target: sec3Ref, offset: ["start end", "end start"] });

  const s1Opacity = useTransform(s1p, [0, 0.18, 0.72, 1], [0, 1, 1, 0]);
  const s1TextY   = useTransform(s1p, [0, 1], ["3%", "-14%"]);
  const s1VisualY = useTransform(s1p, [0, 1], ["6%", "-20%"]);

  const s2Opacity = useTransform(s2p, [0, 0.15, 0.82, 1], [0, 1, 1, 0]);
  const s2TextY   = useTransform(s2p, [0, 1], ["4%", "-16%"]);
  const s2VisualY = useTransform(s2p, [0, 1], ["7%", "-22%"]);

  const s3Opacity = useTransform(s3p, [0, 0.18, 0.92, 1], [0, 1, 1, 0.85]);
  const s3TextY   = useTransform(s3p, [0, 1], ["4%", "-12%"]);
  const s3VisualY = useTransform(s3p, [0, 1], ["6%", "-18%"]);

  // Golden tint — constant amber wash across all sections
  const goldenTint = useMotionValue(0.10);

  const sec3InView = useInView(sec3Ref, { margin: "-25%", once: false });

  const sectionStyle: React.CSSProperties = {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
  };
  const innerStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
    padding: "32px 28px",
  };
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: "16px 48px",
    alignItems: "center",
  };
  const eyebrow = (color = AMBER): React.CSSProperties => ({
    fontSize: "0.67rem", letterSpacing: "0.26em",
    textTransform: "uppercase", color,
    fontFamily: "var(--font-mono), monospace", marginBottom: 10,
  });
  const heading: React.CSSProperties = {
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700,
    color: "#ffffff", lineHeight: 1.2, marginBottom: 14,
    letterSpacing: "-0.018em", fontFamily: "Inter, system-ui, sans-serif",
  };
  const body: React.CSSProperties = {
    fontSize: "clamp(1.1rem, 2vw, 1.28rem)",
    color: "#A1A1AA", lineHeight: 1.8,
    fontFamily: "Inter, system-ui, sans-serif",
  };
  const rule = (color = AMBER): React.CSSProperties => ({
    width: 44, height: 2, borderRadius: 2,
    backgroundColor: color, marginTop: 16,
  });

  return (
    <div
      dir="rtl"
      style={{
        backgroundImage: "url('/matrix-bg.png')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <CRTOverlay />
      <GridOverlay goldenTint={goldenTint} />

      {/* ══ Section 1 — האשליה של חופש בעולם שקוף ══ */}
      <section ref={sec1Ref} style={sectionStyle}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.70)" }}/>
        <motion.div suppressHydrationWarning style={{ ...innerStyle, opacity: s1Opacity }}>
          <div style={gridStyle}>
            <motion.div suppressHydrationWarning style={{ y: s1TextY }}>
              <p style={eyebrow()}>פרק א׳ — האשליה</p>
              <h1 style={heading}>האשליה של חופש בעולם שקוף</h1>
              <p style={body}>
                בכל פעם שאתה משלם ב‑<Ltr><span style={{ color: "#fff" }}>Bitcoin</span></Ltr>,
                אתה משאיר טביעת אצבע נצחית. המערכת לא רק צופה —{" "}
                <span style={{ color: "#ffffff", fontWeight: 500 }}>היא זוכרת</span>.
                <br/><br/>
                ללא פרטיות, הכסף שלך הוא לא שלך. הוא שייך למי
                ששולט במידע.
                <br/><br/>
                גם הכסף בבנק{" "}
                <span style={{ color: "#ffffff", fontWeight: 500 }}>לא שלך ולא פרטי</span>.
                הבנק יכול להקפיא את חשבונך, לחשוף כל עסקה לרשויות
                ולמנוע ממך גישה — בכל עת, ללא הסכמתך. פרטיות אמיתית
                דורשת מערכת שאיש אינו יכול לשנות את כלליה.
              </p>
              <div style={rule(RED)}/>
            </motion.div>
            <motion.div suppressHydrationWarning style={{ y: s1VisualY }}>
              <SurveillanceWeb sectionProgress={s1p}/>
            </motion.div>
          </div>
        </motion.div>
        <ScrollCue/>
      </section>

      {/* ══ Section 2 — ZK-SNARKs: המתמטיקה של החירות ══ */}
      <section ref={sec2Ref} style={sectionStyle}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.74)" }}/>
        <motion.div suppressHydrationWarning style={{ ...innerStyle, opacity: s2Opacity }}>
          <div style={gridStyle}>
            <motion.div suppressHydrationWarning style={{ y: s2VisualY, paddingBottom: 56 }}>
              <ShatterReveal sectionProgress={s2p} />
            </motion.div>
            <motion.div suppressHydrationWarning style={{ y: s2TextY }}>
              <p style={eyebrow()}>פרק ב׳ — השחרור</p>
              <h2 style={heading}>
                <Ltr mono><span style={{ color: AMBER }}>ZK-SNARKs</span></Ltr>
                {": המתמטיקה של החירות"}
              </h2>
              <p style={body}>
                <Ltr mono><span style={{ color: AMBER }}>zk-SNARKs</span></Ltr>{" "}
                מאפשרים להוכיח שידיעה מבלי לחשוף אותה. עסקה מאומתת
                ברמת הפרוטוקול — ללא שם, ללא כתובת, ללא היסטוריה.
                <br/><br/>
                זו לא{" "}
                <span style={{ color: "#ffffff" }}>&ldquo;הבטחה&rdquo;</span>{" "}
                לפרטיות —{" "}זו{" "}
                <span style={{ color: AMBER, fontWeight: 600 }}>&ldquo;הוכחה&rdquo;</span>{" "}
                מתמטית שלא ניתן לפרוץ.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 26 }}>
                {["zk-SNARKs", "Halo 2", "Sapling", "NU5", "Groth16", "PLONK"].map(t => (
                  <span key={t} dir="ltr" style={{
                    padding: "4px 10px",
                    border: `1px solid rgba(243,177,50,0.28)`,
                    borderRadius: 5, color: AMBER,
                    fontSize: "0.69rem",
                    fontFamily: "var(--font-mono), monospace",
                    letterSpacing: "0.05em",
                  }}>{t}</span>
                ))}
              </div>
              <div style={rule()}/>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══ Section 3 — ריבונות פיננסית מוחלטת ══ */}
      <section ref={sec3Ref} style={sectionStyle}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.72)" }}/>
        <motion.div suppressHydrationWarning style={{ ...innerStyle, opacity: s3Opacity }}>
          <div style={gridStyle}>
            <motion.div suppressHydrationWarning style={{ y: s3TextY }}>
              <p style={eyebrow(AMBER_LIGHT)}>פרק ג׳ — הריבונות</p>
              <h2 style={heading}>ריבונות פיננסית מוחלטת</h2>
              <p style={body}>
                עכשיו, הכסף שלך הוא באמת שלך. רק אתה מחליט מי יראה
                מה, מתי ולמה. הזהות שלך — בידיים שלך.
                <br/><br/>
                פרטיות ברירת המחדל, כמו מזומן פיזי, אבל בעולם
                דיגיטלי ללא גבולות.{" "}
                <span style={{ color: "#ffffff", fontWeight: 600 }}>אתה חופשי.</span>
              </p>
              <div style={{ marginTop: 42 }}>
                <motion.button
                  suppressHydrationWarning
                  style={{
                    padding: "15px 40px",
                    borderRadius: 12,
                    backgroundColor: AMBER,
                    color: "#09090B",
                    fontWeight: 700,
                    fontSize: "1.02rem",
                    fontFamily: "Inter, system-ui, sans-serif",
                    border: "none",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 14px rgba(243,177,50,0.28), 0 0 38px rgba(243,177,50,0.09)`,
                      `0 0 34px rgba(243,177,50,0.72), 0 0 85px rgba(243,177,50,0.3)`,
                      `0 0 14px rgba(243,177,50,0.28), 0 0 38px rgba(243,177,50,0.09)`,
                    ],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open("https://near-intents.org/?from=USDT&to=ZEC", "_blank")}
                >
                  אני רוצה פרטיות
                </motion.button>
              </div>
              <p style={{
                marginTop: 14, fontSize: "0.69rem", color: "#3F3F46",
                fontFamily: "var(--font-mono), monospace", letterSpacing: "0.07em",
              }}>
                <Ltr>// protocol-level privacy · 21M cap · mathematically proven</Ltr>
              </p>
            </motion.div>
            <motion.div suppressHydrationWarning style={{ y: s3VisualY }}>
              <LuminousSovereign inView={sec3InView} />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
