"use client";

import { useState } from "react";
import LiveDataModal from "./LiveDataModal";

export default function MetricsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ marginBottom: 40, textAlign: "center" }} dir="rtl">
        <button
          onClick={() => setOpen(true)}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: "#a1a1aa",
            marginBottom: 14,
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid #27272a",
            background: "#0f0f12",
            transition: "all 0.2s",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#3f3f46";
            (e.currentTarget as HTMLElement).style.color = "#e4e4e7";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#27272a";
            (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
          }}
        >
          <span className="live-dot" aria-hidden />
          LIVE · PROTOCOL DATA
        </button>
        <h2
          style={{
            fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.025em",
            marginBottom: 8,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          מטריקות פרוטוקול בזמן אמת
        </h2>
        <p
          style={{
            fontSize: "0.92rem",
            color: "#71717a",
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: "-0.005em",
          }}
        >
          לחץ על כל כרטיס לפתיחת גרף אינטראקטיבי
        </p>
      </div>

      <LiveDataModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
