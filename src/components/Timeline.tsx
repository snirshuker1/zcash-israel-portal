"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AMBER = "#F3B132";

interface Entry {
  year: string;
  titleHe: string;
  descHe: string;
  tags: string[];
  highlight: boolean;
}

const ENTRIES: Entry[] = [
  {
    year: "2013",
    titleHe: "מקורות אקדמיים",
    descHe: 'מאמר "Zerocash" מפורסם על ידי חוקרי אוניברסיטת Johns Hopkins — הבסיס המתמטי לפרטיות מוכחת מוגש לקהילה המדעית.',
    tags: ["Zerocash Paper", "Johns Hopkins", "zk-SNARKs"],
    highlight: false,
  },
  {
    year: "2016",
    titleHe: "השקת הפרוטוקול",
    descHe: "השקת Zcash Mainnet עם טקס MPC (Multi-Party Computation) — ה\"Ceremony\" שיצר את ה-Trusted Setup המקורי. שישה משתתפים, אף אחד לא מחזיק את כל המפתח.",
    tags: ["Mainnet", "MPC", "Trusted Setup", "Ceremony"],
    highlight: false,
  },
  {
    year: "2018",
    titleHe: "שדרוג Sapling",
    descHe: "קפיצת ביצועים היסטורית — זמן יצירת הוכחת zk-SNARK ירד מ-40 שניות לפחות משנייה. הגנה מלאה הפכה לאפשרית על מכשירים ניידים.",
    tags: ["Sapling", "Mobile Proofs", "Performance"],
    highlight: false,
  },
  {
    year: "2022",
    titleHe: "Halo 2 ו-NU5 — ביטול ה-Trusted Setup",
    descHe: "אבן הדרך הגדולה ביותר בהיסטוריית הפרוטוקול. הוכחות ZK רקורסיביות מבטלות לצמיתות את הצורך בטקסי Trusted Setup. מה שנדרש 6 אנשים ב-2016 — לא נדרש יותר לעולם.",
    tags: ["Halo 2", "NU5", "No Trusted Setup", "Orchard", "Recursive ZK"],
    highlight: true,
  },
  {
    year: "עתיד",
    titleHe: "PoS ו-ZSA",
    descHe: "מפת הדרכים כוללת מעבר ל-Proof of Stake ופיתוח Zcash Shielded Assets — בריכה מוגנת עם תמיכה בנכסים מרובים, לא רק ZEC.",
    tags: ["PoS", "ZSA", "Multi-Asset", "Roadmap"],
    highlight: false,
  },
];

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

function TimelineCard({ entry, index }: { entry: Entry; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="relative flex gap-6 items-start"
      dir="rtl"
    >
      {/* Year + dot */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 64 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: entry.highlight ? AMBER : "#ffffff",
            border: `2px solid ${entry.highlight ? AMBER : "#e4e4e7"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            boxShadow: entry.highlight ? `0 0 0 6px rgba(243,177,50,0.12)` : "none",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: entry.highlight ? "#09090b" : "#e4e4e7",
              display: "block",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.65rem",
            color: entry.highlight ? AMBER : "#a1a1aa",
            marginTop: 6,
            letterSpacing: "0.05em",
          }}
        >
          {entry.year}
        </span>
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          border: `1px solid ${entry.highlight ? AMBER + "40" : "#e4e4e7"}`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 8,
          boxShadow: entry.highlight ? `0 4px 24px rgba(243,177,50,0.08)` : "none",
        }}
      >
        {entry.highlight && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              color: AMBER,
              fontFamily: "var(--font-mono), monospace",
              marginBottom: 8,
              padding: "3px 8px",
              background: "rgba(243,177,50,0.08)",
              borderRadius: 4,
            }}
          >
            <span>★</span> MILESTONE
          </div>
        )}
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#09090b",
            marginBottom: 8,
            lineHeight: 1.4,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {entry.titleHe.split(/(Halo 2|NU5|Trusted Setup|MPC|Sapling|PoS|ZSA|zk-SNARK|ZK)/g).map((part, i) =>
            ["Halo 2", "NU5", "Trusted Setup", "MPC", "Sapling", "PoS", "ZSA", "zk-SNARK", "ZK"].includes(part)
              ? <Ltr key={i}>{part}</Ltr>
              : <span key={i}>{part}</span>
          )}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.65, marginBottom: 12, fontFamily: "Inter, system-ui, sans-serif" }}>
          {entry.descHe}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} dir="ltr">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.6rem",
                padding: "3px 8px",
                borderRadius: 4,
                background: "#fafafa",
                border: "1px solid #e4e4e7",
                color: "#71717a",
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  return (
    <section id="timeline" style={{ backgroundColor: "#ffffff", padding: "96px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }} dir="rtl">
          <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: AMBER, marginBottom: 12 }}>
            // PROTOCOL_EVOLUTION
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, color: "#09090b", letterSpacing: "-0.02em", marginBottom: 12, fontFamily: "Inter, system-ui, sans-serif" }}>
            ציר הזמן של הפרוטוקול
          </h2>
          <p style={{ fontSize: "1rem", color: "#71717a", fontFamily: "Inter, system-ui, sans-serif" }}>
            מהמאמר האקדמי ב-2013 ועד לביטול ה-<Ltr>Trusted Setup</Ltr> — כל שלב מוכיח מחדש.
          </p>
        </div>

        {/* Vertical line + entries */}
        <div style={{ position: "relative" }}>
          {/* The vertical spine */}
          <div
            style={{
              position: "absolute",
              top: 18,
              bottom: 18,
              right: 49,
              width: 1,
              background: "linear-gradient(to bottom, transparent, #e4e4e7 10%, #e4e4e7 90%, transparent)",
              zIndex: 0,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {ENTRIES.map((entry, i) => (
              <TimelineCard key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
