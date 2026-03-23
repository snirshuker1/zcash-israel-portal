"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import useSWR from "swr";

const AMBER = "#F3B132";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const NAV_LINKS = [
  { label: "מטריקות", id: "metrics" },
  { label: "ציר הזמן", id: "timeline" },
  { label: "FAQ", id: "faq" },
  { label: "רכישה", id: "cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: stats } = useSWR("/api/zcash/stats", fetcher, { refreshInterval: 60_000 });
  const price: number | null = stats?.priceUsd ?? null;
  const blockHeight: number | null = stats?.blockHeight ?? null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid #e4e4e7" : "1px solid transparent",
        transition: "all 0.25s",
      }}
    >
      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        dir="rtl"
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo("hero")}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}
          dir="ltr"
        >
          <span
            style={{
              width: 28, height: 28, borderRadius: "50%",
              backgroundColor: AMBER,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono), monospace",
              fontWeight: 800, fontSize: "0.8rem", color: "#09090b",
            }}
          >
            ◎
          </span>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: "0.9rem", color: "#09090b", letterSpacing: "0.03em" }}>
            Zcash <span style={{ color: AMBER }}>IL</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 12px", borderRadius: 6,
                fontSize: "0.85rem", color: "#71717a",
                fontFamily: "Inter, system-ui, sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#09090b";
                (e.currentTarget as HTMLElement).style.background = "#f4f4f5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#71717a";
                (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side: price ticker + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} dir="ltr" className="hidden md:flex">
          {/* Live price */}
          {price !== null && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 6,
                background: "#fafafa", border: "1px solid #e4e4e7",
                fontFamily: "var(--font-mono), monospace", fontSize: "0.72rem",
              }}
            >
              <span style={{ color: "#a1a1aa" }}>ZEC</span>
              <span style={{ color: "#09090b", fontWeight: 600 }}>${price.toFixed(2)}</span>
              {blockHeight && (
                <>
                  <span style={{ color: "#e4e4e7" }}>·</span>
                  <span style={{ color: "#a1a1aa" }}>#{blockHeight.toLocaleString("en-US")}</span>
                </>
              )}
            </div>
          )}
          {/* CTA */}
          <a
            href="https://near.org/intents"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "7px 16px", borderRadius: 8,
              background: AMBER, color: "#09090b",
              fontWeight: 700, fontSize: "0.8rem",
              fontFamily: "Inter, system-ui, sans-serif",
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            קנה ZEC ◎
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", padding: 4 }}
          className="md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#ffffff", borderTop: "1px solid #e4e4e7",
            padding: "16px 24px 20px",
            display: "flex", flexDirection: "column", gap: 4,
          }}
          dir="rtl"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => { scrollTo(link.id); setOpen(false); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 0", textAlign: "right",
                fontSize: "1rem", color: "#52525b",
                fontFamily: "Inter, system-ui, sans-serif",
                borderBottom: "1px solid #f4f4f5",
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://near.org/intents"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 8, padding: "12px", borderRadius: 8,
              background: AMBER, color: "#09090b",
              fontWeight: 700, textAlign: "center", fontSize: "0.95rem",
              fontFamily: "Inter, system-ui, sans-serif", textDecoration: "none",
            }}
          >
            קנה ZEC ◎
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
