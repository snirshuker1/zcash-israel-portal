"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtocolJourneyModal from "./ProtocolJourneyModal";

const AMBER = "#F3B132";

const ERAS = [
  { year: "2013", label: "Genesis" },
  { year: "2016", label: "Sprout" },
  { year: "2018", label: "Sapling" },
  { year: "2022", label: "Orchard" },
  { year: "2026", label: "Future" },
];

export default function Timeline() {
  const [open, setOpen] = useState(false);

  // Allow the navbar (or any other caller) to open the modal via a custom event
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-protocol-journey", handler);
    return () => window.removeEventListener("open-protocol-journey", handler);
  }, []);

  return (
    <>
      {open && <ProtocolJourneyModal onClose={() => setOpen(false)} />}

      <section
        id="timeline"
        style={{ backgroundColor: "#ffffff", padding: "96px 24px" }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
          >
            {/* ── Invite card ──────────────────────────────────────── */}
            <div
              style={{
                background: "#09090B",
                border: "1px solid #1e1e1e",
                borderRadius: 20,
                padding: "48px 52px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ambient amber glow top-right */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: -80,
                  right: -80,
                  width: 240,
                  height: 240,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${AMBER}18 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Header */}
              <div dir="rtl">
                <p
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.16em",
                    color: AMBER,
                    marginBottom: 16,
                  }}
                >
                  // PROTOCOL_EVOLUTION
                </p>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    marginBottom: 14,
                    fontFamily: "Inter, var(--font-sans), system-ui, sans-serif",
                    lineHeight: 1.25,
                  }}
                >
                  המסע של הפרוטוקול
                </h2>
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "#555",
                    lineHeight: 1.7,
                    marginBottom: 36,
                    fontFamily: "Inter, var(--font-sans), system-ui, sans-serif",
                    maxWidth: 520,
                  }}
                >
                  מהוכחה מתמטית בחדרי אוניברסיטה ב-2013, דרך טקסי הצפנה עם אדוארד סנודן, ועד לביטול לצמיתות של ה-
                  <span dir="ltr" style={{ display: "inline" }}>Trusted Setup</span>
                  {" "}ב-2022 —{" "}
                  <span dir="ltr" style={{ display: "inline" }}>11</span>{" "}
                  פרקים שמגדירים את הריבונות הפיננסית של הדור הבא.
                </p>

                {/* Mini era strip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    marginBottom: 40,
                    direction: "ltr",
                  }}
                >
                  {ERAS.map((era, i) => (
                    <div key={era.year} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: AMBER,
                            opacity: 0.7,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: "0.6rem",
                            color: "#333",
                            letterSpacing: "0.08em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {era.year}
                        </span>
                      </div>
                      {i < ERAS.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            background: `linear-gradient(to right, ${AMBER}40, #1e1e1e)`,
                            margin: "0 4px",
                            marginBottom: 14,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <button
                  onClick={() => setOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 28px",
                    borderRadius: 10,
                    background: AMBER,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, var(--font-sans), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#09090B",
                    transition: "opacity 0.15s, transform 0.15s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.88";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <span>פתח את המסע</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "0.9rem",
                      opacity: 0.7,
                    }}
                    dir="ltr"
                  >
                    ◎ 2013 → 2026+
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
