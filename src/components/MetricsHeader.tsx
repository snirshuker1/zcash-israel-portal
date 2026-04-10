"use client";

import { useState } from "react";
import LiveDataModal from "./LiveDataModal";

const AMBER = "#F3B132";

export default function MetricsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ marginBottom: 36, textAlign: "center" }} dir="rtl">
        <button
          onClick={() => setOpen(true)}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            color: AMBER,
            marginBottom: 10,
            padding: "6px 14px",
            borderRadius: 6,
            border: `1px solid ${AMBER}30`,
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${AMBER}12`;
            (e.currentTarget as HTMLElement).style.borderColor = `${AMBER}60`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = `${AMBER}30`;
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: AMBER,
              display: "inline-block",
              animation: "pulse-amber 2s ease-in-out infinite",
            }}
          />
          // LIVE_PROTOCOL_DATA
        </button>
        <h2
          style={{
            fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
            fontWeight: 700,
            color: "#e4e4e7",
            letterSpacing: "-0.02em",
            marginBottom: 6,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          מטריקות פרוטוקול בזמן אמת
        </h2>
        <p style={{ fontSize: "0.92rem", color: "#52525b", fontFamily: "Inter, system-ui, sans-serif" }}>
          לחץ על כל כרטיס לפתיחת גרף אינטראקטיבי
        </p>
      </div>

      <LiveDataModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
