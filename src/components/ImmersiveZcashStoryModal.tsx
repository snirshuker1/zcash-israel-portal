"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";

const AMBER   = "#F3B132";
const RED     = "#ef4444";
const GREEN   = "rgba(0,255,70,0.65)";

// ─── Mouse parallax hook ───────────────────────────────────────────────────────
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      setPos({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;   // -1…+1 in each axis
}

// ─── Shared person silhouette ──────────────────────────────────────────────────
// pose: "trapped" | "transitioning" | "free"
function Person({ pose, color }: { pose: "trapped" | "transitioning" | "free"; color: string }) {
  const armsTrapped = (
    <>
      <path d="M -18 -22 Q -30 2 -28 26 Q -26 32 -20 30 Q -14 28 -15 22 L -15 2 L -14 -18 Z" fill={color} />
      <path d="M  18 -22 Q  30 2  28 26 Q  26 32  20 30 Q  14 28  15 22 L  15 2 L  14 -18 Z" fill={color} />
    </>
  );
  const armsFree = (
    <>
      <path d="M -18 -22 Q -44 -46 -56 -62 Q -54 -68 -48 -65 Q -42 -62 -44 -56 L -27 -34 L -14 -18 Z" fill={color} />
      <path d="M  18 -22 Q  44 -46  56 -62 Q  54 -68  48 -65 Q  42 -62  44 -56 L  27 -34 L  14 -18 Z" fill={color} />
    </>
  );
  const arms = pose === "free" ? armsFree : armsTrapped;

  return (
    <g>
      <circle cy="-62" r="20" fill={color} />
      <rect x="-8" y="-42" width="16" height="11" rx="4" fill={color} />
      <path d="M -19 -31 Q 0 -35 19 -31 L 17 24 Q 0 28 -17 24 Z" fill={color} />
      {arms}
      <rect x={pose === "free" ? "-18" : "-16"} y="24" width="13" height="44" rx="6" fill={color} />
      <rect x={pose === "free" ?   "5" : "3"}  y="24" width="13" height="44" rx="6" fill={color} />
    </g>
  );
}

// ─── Eye node ─────────────────────────────────────────────────────────────────
function EyeNode({
  x, y, label, mouseOffset, multiplier, animated,
}: {
  x: number; y: number; label: string;
  mouseOffset: { x: number; y: number };
  multiplier: number;
  animated: boolean;
}) {
  const tx = x + mouseOffset.x * 13 * multiplier;
  const ty = y + mouseOffset.y * 10 * multiplier;

  return (
    <motion.g
      animate={{ x: tx, y: ty }}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
    >
      <motion.circle
        r="24" fill="rgba(12,4,4,0.92)"
        stroke="rgba(239,68,68,0.55)" strokeWidth="1.5"
        animate={animated ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 2.6, repeat: Infinity, delay: multiplier }}
      />
      {/* Eyelid curves */}
      <path d="M -13 0 Q 0 -9 13 0 Q 0 9 -13 0 Z"
        fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
      {/* Iris */}
      <motion.circle
        r="7" fill={RED} opacity="0.88"
        animate={animated ? { r: [7, 5, 8, 7] } : {}}
        transition={{ duration: 3.2, repeat: Infinity, delay: multiplier * 0.4 }}
      />
      {/* Pupil */}
      <circle r="3.2" fill="#060202" />
      {/* Specular highlight */}
      <circle cx="2.5" cy="-2.5" r="1.5" fill="rgba(255,255,255,0.55)" />
      {/* Label */}
      <text y="36" textAnchor="middle" fontSize="7" letterSpacing="0.14em"
        fill="rgba(239,68,68,0.55)" fontFamily="monospace">{label}</text>
    </motion.g>
  );
}

// Pre-computed data stream paths (character heart ≈ 0,-25 → each eye)
const DATA_STREAMS = [
  { id: 0, d: "M 0 -30 C -55 -70 -125 -88 -175 -108", speed: 1.1 },
  { id: 1, d: "M 0 -30 C  55 -70  125 -88  175 -108", speed: 1.3 },
  { id: 2, d: "M 0  -5 C -75   0 -145   8 -183   13", speed: 0.9 },
  { id: 3, d: "M 0  -5 C  75   0  145   8  183   13", speed: 1.5 },
  { id: 4, d: "M 0 -30 C   5 -95    3 -138    0 -158", speed: 1.2 },
];

const EYE_CONFIGS = [
  { x: -175, y: -108, label: "GOV",  m: 0.6 },
  { x:  175, y: -108, label: "CORP", m: 0.8 },
  { x: -183, y:   13, label: "ISP",  m: 0.5 },
  { x:  183, y:   13, label: "BANK", m: 0.7 },
  { x:    0, y: -158, label: "NSA",  m: 1.0 },
];

// ─── STAGE 1: Digital Panopticon ───────────────────────────────────────────────
function PanopticonScene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <svg viewBox="-215 -185 430 360" fill="none"
      style={{ width: "100%", maxWidth: 480, height: "auto" }} aria-hidden>
      <defs>
        <radialGradient id="threat-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(239,68,68,0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="eye-glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient threat glow */}
      <motion.circle r="210" fill="url(#threat-bg)"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Data stream paths: 3 "packets" per stream at different phases ── */}
      {DATA_STREAMS.map((s) =>
        [0, -90, -180].map((phase, pi) => (
          <motion.path key={`${s.id}-${pi}`}
            d={s.d}
            stroke={GREEN}
            strokeWidth={pi === 0 ? 1.8 : 1}
            strokeDasharray="16 200"
            opacity={pi === 0 ? 0.7 : 0.35}
            animate={{ strokeDashoffset: [phase, phase - 230] }}
            transition={{ duration: s.speed * (1 + pi * 0.15), repeat: Infinity, ease: "linear" }}
          />
        ))
      )}

      {/* ── Eye nodes (with mouse parallax) ── */}
      {EYE_CONFIGS.map((e, i) => (
        <EyeNode key={i} x={e.x} y={e.y} label={e.label}
          mouseOffset={mouse} multiplier={e.m} animated />
      ))}

      {/* ── Trapped character (subtle anxious tremor) ── */}
      <motion.g
        animate={{ x: [0, 0.6, -0.5, 0.4, 0], y: [0, 0.3, -0.4, 0.2, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Person pose="trapped" color="#374151" />
      </motion.g>

      {/* Scanning overlay — horizontal sweep */}
      <motion.rect
        x="-215" width="430" height="2"
        fill="rgba(239,68,68,0.18)"
        animate={{ y: [-185, 175] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

// ─── ZK hexagon paths (pre-computed) ──────────────────────────────────────────
function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * (Math.PI / 180);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  return `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`;
}

const ZK_HEXAGONS = [
  { d: hexPath(0, 0, 38),  delay: 0.1, w: 2.5 },
  { d: hexPath(0, 0, 62),  delay: 0.25, w: 1.8 },
  { d: hexPath(0, 0, 90),  delay: 0.4,  w: 1.3 },
  { d: hexPath(0, 0, 120), delay: 0.55, w: 0.9 },
];

// Spoke lines from center to hexagon vertices of outer ring
const ZK_SPOKES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * 60 - 30) * (Math.PI / 180);
  return {
    id: i,
    x1: Math.cos(a) * 38, y1: Math.sin(a) * 38,
    x2: Math.cos(a) * 120, y2: Math.sin(a) * 120,
    delay: 0.3 + i * 0.06,
  };
});

// ─── STAGE 2: Cryptographic Shattering ────────────────────────────────────────
function ShatteringScene() {
  return (
    <svg viewBox="-215 -185 430 360" fill="none"
      style={{ width: "100%", maxWidth: 480, height: "auto" }} aria-hidden>
      <defs>
        <radialGradient id="zk-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={`${AMBER}40`} />
          <stop offset="60%"  stopColor={`${AMBER}10`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="zk-glow">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Dissolving data streams ── */}
      {DATA_STREAMS.map((s) => (
        <motion.path key={s.id} d={s.d}
          stroke={GREEN} strokeWidth="1.2" strokeDasharray="10 200"
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0, strokeDasharray: "3 200" }}
          transition={{ duration: 1.0, delay: 0.1 + s.id * 0.1 }}
        />
      ))}

      {/* ── ZK burst background ── */}
      <motion.circle r="200" fill="url(#zk-burst)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      />

      {/* ── ZK hexagons drawing in ── */}
      {ZK_HEXAGONS.map((h, i) => (
        <motion.path key={i} d={h.d}
          stroke={AMBER} strokeWidth={h.w} opacity="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.65 }}
          transition={{ duration: 0.7, delay: h.delay, ease: "easeOut" }}
        />
      ))}

      {/* ── ZK spokes ── */}
      {ZK_SPOKES.map((s) => (
        <motion.line key={s.id}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={AMBER} strokeWidth="1" opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: s.delay }}
        />
      ))}

      {/* ── Dissolving eye nodes (fade out) ── */}
      {EYE_CONFIGS.map((e, i) => (
        <motion.g key={i}
          transform={`translate(${e.x},${e.y})`}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.65, delay: 0.08 + i * 0.08 }}
        >
          <circle r="24" fill="rgba(12,4,4,0.92)" stroke="rgba(239,68,68,0.55)" strokeWidth="1.5" />
          <path d="M -13 0 Q 0 -9 13 0 Q 0 9 -13 0 Z" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.7)" strokeWidth="1" />
          <circle r="7" fill={RED} opacity="0.88" />
          <circle r="3.2" fill="#060202" />
        </motion.g>
      ))}

      {/* ── Transitioning character (color shifts to amber) ── */}
      <motion.g
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <motion.g
          initial={{ color: "#374151" }}
          animate={{ color: AMBER }}
        >
          <Person pose="transitioning" color="#5a6478" />
        </motion.g>
      </motion.g>

      {/* ── Zcash shield (center, scales in with bloom) ── */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        filter="url(#zk-glow)"
        style={{ transformOrigin: "0 0" }}
      >
        {/* Shield outer ring */}
        <motion.circle r="34" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2.2"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
        {/* Z mark */}
        <path d="M -14 -12 L 14 -12 L -14 12 L 14 12"
          stroke={AMBER} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* ── Burst shockwave rings ── */}
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.circle key={i} r="0" fill="none"
          stroke={AMBER} strokeWidth="1.5" opacity="0.6"
          animate={{ r: [0, 180], opacity: [0.6, 0] }}
          transition={{ duration: 1.1, delay: 0.3 + delay, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// Pre-computed ambient gold particles for Stage 3
const AURA_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  const r = 85 + (i % 3) * 22;
  return {
    id: i, cx: Math.cos(a) * r, cy: Math.sin(a) * r,
    size: 2 + (i % 3) * 1,
    delay: i * 0.12,
  };
});

// ─── STAGE 3: Sovereign Money ──────────────────────────────────────────────────
function SovereignScene() {
  return (
    <svg viewBox="-215 -185 430 360" fill="none"
      style={{ width: "100%", maxWidth: 480, height: "auto" }} aria-hidden>
      <defs>
        <radialGradient id="aura-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={`${AMBER}28`} />
          <stop offset="55%"  stopColor={`${AMBER}0a`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="aura-glow">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shield-glow">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Pulsing aura ── */}
      <motion.circle r="160" fill="url(#aura-grad)"
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Concentric aura rings ── */}
      {[70, 105, 140].map((r, i) => (
        <motion.circle key={r} r={r}
          fill="none" stroke={`${AMBER}${["18", "0f", "08"][i]}`} strokeWidth="1"
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.8 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* ── Ambient particles orbiting ── */}
      {AURA_PARTICLES.map((p) => (
        <motion.circle key={p.id} cx={p.cx} cy={p.cy} r={p.size}
          fill={AMBER}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.75, 0.45], scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, delay: p.delay, repeatDelay: 3.5, repeat: Infinity }}
        />
      ))}

      {/* ── Free character ── */}
      <motion.g filter="url(#aura-glow)"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65 }}
      >
        <Person pose="free" color={AMBER} />
      </motion.g>

      {/* ── Crystallized Zcash shield — top right ── */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        filter="url(#shield-glow)"
        transform="translate(82, -95)"
        style={{ transformOrigin: "82px -95px" }}
      >
        {hexPath(0, 0, 28).split("").length && (
          <motion.path d={hexPath(0, 0, 28)}
            stroke={AMBER} strokeWidth="1.8"
            fill={`${AMBER}15`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          />
        )}
        <motion.path d={hexPath(0, 0, 20)} stroke={AMBER} strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M -9 -8 L 9 -8 L -9 8 L 9 8"
          stroke={AMBER} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

// ─── Stage metadata ────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: 0,
    badge: "SURVEILLANCE_ACTIVE · ZERO_PRIVACY",
    badgeColor: RED,
    badgeBg: "rgba(239,68,68,0.08)",
    badgeBorder: "rgba(239,68,68,0.3)",
    title: (
      <>
        בעולם השקוף,{" "}
        <span style={{ color: RED }}>אתה לא חופשי.</span>
      </>
    ),
    body: "שקיפות מלאה בבלוקצ'יין (כמו בביטקוין) היא לא רק פגיעה בפרטיות — היא כלי שליטה. כשהכסף שלך גלוי, חברות בונות עליך פרופיל, מוסדות מנתחים את הצעדים שלך, וההתנהגות שלך משתנה בגלל הידיעה שצופים בך. זהו הפנופטיקון הדיגיטלי. אתה נשלט.",
    quote: null,
    nextLabel: "המשך",
  },
  {
    id: 1,
    badge: "ZK-SNARKs · MATHEMATICAL_PROOF",
    badgeColor: AMBER,
    badgeBg: "rgba(243,177,50,0.08)",
    badgeBorder: "rgba(243,177,50,0.3)",
    title: (
      <>
        <span style={{ color: AMBER }}>המתמטיקה</span> מנתקת את השלשלאות.
      </>
    ),
    body: "הוכחות אפס-ידיעה (ZK-SNARKs) מאפשרות לאשר עסקה מבלי לחשוף פרט אחד עליה — לא מי שלח, לא מי קיבל, לא כמה. המתמטיקה עצמה שוברת את מנגנון המעקב. לא הבטחה. הוכחה.",
    quote: null,
    nextLabel: "המשך",
  },
  {
    id: 2,
    badge: "PRIVATE_BY_DEFAULT · SOVEREIGN_MONEY",
    badgeColor: AMBER,
    badgeBg: "rgba(243,177,50,0.08)",
    badgeBorder: "rgba(243,177,50,0.3)",
    title: (
      <>
        זיקאש:{" "}
        <span style={{ color: AMBER }}>החופש להיות פרטי.</span>
      </>
    ),
    body: "זיקאש היא הוכחה מתמטית לכך שאפשר לאשר עסקה מבלי לחשוף את תוכנה. זהו כסף דיגיטלי המתנהג כמו מזומן פיזי — פרטי, מהיר ומוגן מברירת מחדל. רק אתה מחליט מי יראה מה, מתי ולמה. אתה חופשי.",
    quote: '"Privacy is not the opposite of transparency — it is the foundation of dignity."',
    nextLabel: null,
  },
];

// ─── Slide variants ────────────────────────────────────────────────────────────
const SLIDE_IN  = { opacity: 0, y: 28, scale: 0.98 };
const SLIDE_OUT = { opacity: 0, y: -20, scale: 0.98 };
const SLIDE_VISIBLE = { opacity: 1, y: 0, scale: 1 };

// ─── Main modal ────────────────────────────────────────────────────────────────
function ImmersiveZcashStoryModal({
  isOpen, onClose,
}: {
  isOpen: boolean; onClose: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [dir, setDir] = useState(1);       // +1 forward, -1 back
  const mouse = useMouseParallax();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) { setStage(0); setDir(1); }
  }, [isOpen]);

  // Scroll-lock + Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function goNext() { setDir(1); setStage((s) => Math.min(s + 1, 2)); }
  function goBack() { setDir(-1); setStage((s) => Math.max(s - 1, 0)); }

  const current = STAGES[stage];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="imm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="backdrop-blur-md"
          style={{
            position: "fixed", inset: 0, zIndex: 3000,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "12px",
          }}
        >
          <motion.div
            key="imm-panel"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 880, width: "100%",
              maxHeight: "94vh",
              borderRadius: 22,
              border: "1px solid rgba(243,177,50,0.14)",
              background: "#04040a",
              backgroundImage: "url('/images/zcash-modal-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 48px 120px rgba(0,0,0,0.9), 0 0 60px rgba(243,177,50,0.04)",
              position: "relative",
            }}
          >
            {/* Dark overlay on bg image */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 22, zIndex: 0,
              background: "linear-gradient(160deg, rgba(3,3,9,0.97) 0%, rgba(3,3,9,0.94) 100%)",
              pointerEvents: "none",
            }} />

            {/* ── Content above overlay ── */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>

              {/* ── Top bar ── */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 22px",
                borderBottom: "1px solid rgba(243,177,50,0.07)",
                flexShrink: 0,
              }}>
                {/* Stage dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }} dir="ltr">
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i}
                      animate={{
                        width:   i === stage ? 22 : 7,
                        background: i === stage ? AMBER : i < stage ? `${AMBER}60` : "rgba(255,255,255,0.12)",
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ height: 7, borderRadius: 4 }}
                    />
                  ))}
                  <span style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.56rem", letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.25)", marginRight: 4,
                  }}>{stage + 1} / 3</span>
                </div>

                {/* CLASSIFIED label */}
                <div dir="ltr" style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.52rem", letterSpacing: "0.2em",
                  color: AMBER, opacity: 0.5,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span className="pulse-amber"
                    style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER, display: "inline-block" }} />
                  ZCASH-IL · ZK_PROVEN
                </div>

                {/* Close */}
                <button onClick={onClose} aria-label="סגור"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: 7, cursor: "pointer",
                    color: "#71717a", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#fff"; el.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#71717a"; el.style.background = "rgba(255,255,255,0.05)";
                  }}
                ><X size={15} /></button>
              </div>

              {/* ── Stage content (scrollable) ── */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={stage}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ ...SLIDE_IN,  x: d * 40 }),
                      center: () => ({ ...SLIDE_VISIBLE, x: 0 }),
                      exit:  (d: number) => ({ ...SLIDE_OUT, x: d * -30 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    style={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 32,
                      alignItems: "center",
                      padding: "clamp(20px,4vw,44px) clamp(18px,4vw,44px)",
                      flex: 1,
                    }} dir="rtl">

                      {/* ── Text panel ── */}
                      <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                        {/* Badge */}
                        <div dir="ltr" style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "0.56rem", letterSpacing: "0.17em",
                          color: current.badgeColor,
                          padding: "4px 12px", borderRadius: 20, marginBottom: 18,
                          border: `1px solid ${current.badgeBorder}`,
                          background: current.badgeBg,
                        }}>
                          <span className="pulse-amber" style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: current.badgeColor, display: "inline-block",
                          }} />
                          {current.badge}
                        </div>

                        {/* Title */}
                        <h2 dir="rtl" style={{
                          fontSize: "clamp(1.45rem,3.5vw,2.2rem)",
                          fontWeight: 800, color: "#f4f4f5",
                          letterSpacing: "-0.025em", lineHeight: 1.22,
                          marginBottom: 16,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                        }}>
                          {current.title}
                        </h2>

                        {/* Body */}
                        <p dir="rtl" style={{
                          fontSize: "clamp(0.87rem,1.8vw,1rem)",
                          color: "#a1a1aa", lineHeight: 1.85,
                          fontFamily: "var(--font-sans), system-ui, sans-serif",
                          marginBottom: current.quote ? 20 : 0,
                        }}>
                          {current.body}
                        </p>

                        {/* Closing quote (Stage 3 only) */}
                        {current.quote && (
                          <div dir="ltr" style={{
                            borderRight: `3px solid ${AMBER}`,
                            paddingRight: 16, marginTop: 4,
                          }}>
                            <p style={{
                              fontSize: "0.78rem", color: "#6b6b6b",
                              fontStyle: "italic", lineHeight: 1.65,
                              fontFamily: "var(--font-sans), system-ui, sans-serif",
                              margin: 0,
                            }}>{current.quote}</p>
                          </div>
                        )}
                      </div>

                      {/* ── Visual panel ── */}
                      <div style={{ flex: "0 1 420px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {stage === 0 && <PanopticonScene mouse={mouse} />}
                        {stage === 1 && <ShatteringScene />}
                        {stage === 2 && <SovereignScene />}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Bottom navigation ── */}
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                padding: "16px 22px",
                display: "flex",
                alignItems: "center",
                justifyContent: stage === 0 ? "flex-start" : "space-between",
                gap: 12,
                flexShrink: 0,
              }} dir="rtl">

                {/* Back button (stages 1 & 2) */}
                {stage > 0 && (
                  <button onClick={goBack} style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "9px 16px",
                    color: "#71717a", cursor: "pointer",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "0.82rem", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = "#71717a"; el.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    <ArrowLeft size={14} />
                    חזור
                  </button>
                )}

                {/* Next / CTA */}
                {stage < 2 ? (
                  <motion.button
                    onClick={goNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      background: "#09090b",
                      border: `1px solid rgba(243,177,50,0.45)`,
                      borderRadius: 10, padding: "11px 26px",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "0.9rem", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.15s",
                      boxShadow: `0 0 20px rgba(243,177,50,0.08)`,
                    }}
                  >
                    {current.nextLabel}
                    <span style={{ color: AMBER }}>←</span>
                  </motion.button>
                ) : (
                  <motion.a
                    href="https://near-intents.org/?from=USDT&to=ZEC"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 10,
                      padding: "13px 28px", borderRadius: 11,
                      background: AMBER, color: "#09090b",
                      fontWeight: 700, fontSize: "0.95rem",
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      textDecoration: "none",
                      boxShadow: `0 0 28px ${AMBER}40, 0 4px 20px rgba(0,0,0,0.4)`,
                    }}
                  >
                    <span>◎</span>
                    אני רוצה להתחיל להגן על הכסף שלי
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SSR-safe portal ───────────────────────────────────────────────────────────
export function ImmersiveZcashPortal({
  isOpen, onClose,
}: {
  isOpen: boolean; onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <ImmersiveZcashStoryModal isOpen={isOpen} onClose={onClose} />,
    document.body
  );
}
