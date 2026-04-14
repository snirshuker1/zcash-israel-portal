"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { useLiveZecPrice } from "@/hooks/useLiveZecPrice";
import RollingPrice from "./RollingPrice";

const AMBER = "#F3B132";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Anchor links that scroll the home page
const NAV_ANCHORS = [
  { label: "מטריקות",        id: "metrics" },
  { label: "מסע הפרוטוקול", id: "timeline", mono: true },
  { label: "FAQ",            id: "faq" },
  { label: "רכישה",          id: "cta" },
];

// Standalone educational pages
const NAV_PAGES = [
  { label: "Zcash בישראל",    href: "/israel-context" },
  { label: "פרטיות והסברים", href: "/privacy-explained" },
  { label: "תנאי שימוש",     href: "/terms" },
];

type DropdownKey = "nav" | "info";

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [openDropdown, setOpenDropdown]   = useState<DropdownKey | null>(null);
  const desktopNavRef                     = useRef<HTMLElement>(null);

  const pathname  = usePathname();
  const router    = useRouter();
  const isHome    = pathname === "/";
  const isDark    = pathname === "/immersive";

  const { data: stats } = useSWR("/api/zcash/stats", fetcher, { refreshInterval: 60_000 });
  const restPrice: number | null = stats?.priceUsd ?? null;
  const { price, connected } = useLiveZecPrice(restPrice);
  const blockHeight: number | null = stats?.blockHeight ?? null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close desktop dropdowns on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleNavLink(id: string) {
    if (isHome) {
      scrollToSection(id);
    } else {
      router.push(`/#${id}`);
    }
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const navBg   = isDark ? (scrolled ? "rgba(9,9,11,0.95)"    : "rgba(9,9,11,0.85)")    : (scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)");
  const border  = isDark ? (scrolled ? "#27272a"              : "transparent")           : (scrolled ? "#e4e4e7"               : "transparent");
  const textCol = isDark ? "#a1a1aa" : "#71717a";
  const hiCol   = isDark ? "#ffffff" : "#09090b";
  const hiBg    = isDark ? "#27272a" : "#f4f4f5";
  const priceBg = isDark ? "#141414" : "#fafafa";
  const priceB  = isDark ? "#27272a" : "#e4e4e7";
  const mutedC  = isDark ? "#52525b" : "#a1a1aa";
  const mainCol = isDark ? "#e4e4e7" : "#09090b";
  const logoCol = isDark ? "#e4e4e7" : "#09090b";
  const panelBg = isDark ? "#0d0d10" : "#ffffff";
  const panelB  = isDark ? "#27272a" : "#e4e4e7";

  // ── Dropdown trigger style factory ─────────────────────────────────────────
  function triggerStyle(key: DropdownKey): React.CSSProperties {
    const active = openDropdown === key;
    return {
      background: active ? hiBg : "none",
      border: "none", cursor: "pointer",
      padding: "6px 12px", borderRadius: 6,
      fontSize: "0.85rem",
      color: active ? hiCol : textCol,
      fontFamily: "Inter, system-ui, sans-serif",
      transition: "all 0.15s",
      display: "flex", alignItems: "center", gap: 5,
      whiteSpace: "nowrap",
    };
  }

  // ── Dropdown panel style ───────────────────────────────────────────────────
  const panelStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: panelBg,
    border: `1px solid ${panelB}`,
    borderRadius: 12,
    boxShadow: "0 16px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.06)",
    padding: "6px",
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  // ── Shared item hover handlers ─────────────────────────────────────────────
  function itemEnter(e: React.MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.color = hiCol;
    el.style.background = hiBg;
  }
  function itemLeave(e: React.MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.color = textCol;
    el.style.background = "transparent";
  }

  return (
    <motion.header
      suppressHydrationWarning
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: navBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        transition: "all 0.25s",
      }}
    >
      <div
        className="navbar-inner"
        dir="rtl"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        {/* ── Logo ─────────────────────────────────────────────────────────── */}
        <Link
          href="/"
          dir="ltr"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
        >
          <svg width={28} height={28} viewBox="0 0 493.3 490.2" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="m245.4 20c-124.3 0-225.4 101.1-225.4 225.4s101.1 225.4 225.4 225.4 225.4-101.1 225.4-225.4-101.1-225.4-225.4-225.4zm0 413.6c-103.8 0-188.2-84.4-188.2-188.2s84.4-188.2 188.2-188.2 188.2 84.4 188.2 188.2-84.4 188.2-188.2 188.2z" fill={logoCol} />
            <circle cx="245.4" cy="245.4" r="177.6" fill={AMBER} />
            <path d="m165 315.5v34.4h61.5v37.7h37.8v-37.7h61.5v-45.5h-95.4l95.4-129.4v-34.4h-61.5v-37.6h-37.8v37.6h-61.5v45.6h95.4z" fill="#09090b" />
          </svg>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: "0.9rem", color: logoCol, letterSpacing: "0.03em" }}>
            Zcash <span style={{ color: AMBER }}>IL</span>
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────────────────── */}
        <nav
          ref={desktopNavRef}
          className="nav-desktop-only"
          style={{ position: "relative", display: "flex", alignItems: "center", gap: 4 }}
        >
          {/* Dropdown 1 — ניווט מהיר (anchor links) */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "nav" ? null : "nav")}
              style={triggerStyle("nav")}
              onMouseEnter={(e) => { if (openDropdown !== "nav") { (e.currentTarget as HTMLElement).style.color = hiCol; (e.currentTarget as HTMLElement).style.background = hiBg; } }}
              onMouseLeave={(e) => { if (openDropdown !== "nav") { (e.currentTarget as HTMLElement).style.color = textCol; (e.currentTarget as HTMLElement).style.background = "none"; } }}
            >
              ניווט מהיר
              <ChevronDown size={13} style={{ transform: openDropdown === "nav" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>

            <AnimatePresence>
              {openDropdown === "nav" && (
                <motion.div
                  key="panel-nav"
                  dir="rtl"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  style={{ ...panelStyle, minWidth: 190 }}
                >
                  {NAV_ANCHORS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavLink(item.id)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 8, padding: "9px 12px", borderRadius: 8,
                        background: "transparent", border: "none", cursor: "pointer",
                        width: "100%", textAlign: "right",
                        fontSize: item.mono ? "0.8rem" : "0.855rem",
                        color: textCol,
                        fontFamily: item.mono ? "var(--font-mono), monospace" : "Inter, system-ui, sans-serif",
                        transition: "all 0.1s", whiteSpace: "nowrap",
                      }}
                      onMouseEnter={itemEnter}
                      onMouseLeave={itemLeave}
                    >
                      <span>{item.label}</span>
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", color: mutedC }}>#</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown 2 — מידע וקהילה (page links) */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpenDropdown(openDropdown === "info" ? null : "info")}
              style={triggerStyle("info")}
              onMouseEnter={(e) => { if (openDropdown !== "info") { (e.currentTarget as HTMLElement).style.color = hiCol; (e.currentTarget as HTMLElement).style.background = hiBg; } }}
              onMouseLeave={(e) => { if (openDropdown !== "info") { (e.currentTarget as HTMLElement).style.color = textCol; (e.currentTarget as HTMLElement).style.background = "none"; } }}
            >
              מידע וקהילה
              <ChevronDown size={13} style={{ transform: openDropdown === "info" ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>

            <AnimatePresence>
              {openDropdown === "info" && (
                <motion.div
                  key="panel-info"
                  dir="rtl"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                  style={{ ...panelStyle, minWidth: 200 }}
                >
                  {NAV_PAGES.map((page) => (
                    <Link
                      key={page.href}
                      href={page.href}
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 8, padding: "9px 12px", borderRadius: 8,
                        background: "transparent",
                        fontSize: "0.855rem", color: textCol,
                        fontFamily: "Inter, system-ui, sans-serif",
                        transition: "all 0.1s", textDecoration: "none", whiteSpace: "nowrap",
                      }}
                      onMouseEnter={itemEnter}
                      onMouseLeave={itemLeave}
                    >
                      <span>{page.label}</span>
                      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.6rem", color: mutedC }}>→</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 18, background: isDark ? "#27272a" : "#e4e4e7", margin: "0 4px", flexShrink: 0 }} />

          {/* Primary CTA — standalone amber-bordered button */}
          <Link
            href="/guides/start"
            style={{
              border: `1px solid ${AMBER}`,
              background: "transparent",
              cursor: "pointer",
              padding: "5px 14px", borderRadius: 7,
              fontSize: "0.85rem", color: AMBER,
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6,
              textDecoration: "none", whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(243,177,50,0.12)" : "rgba(243,177,50,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.65rem" }}>◎</span>
            איך מתחילים?
          </Link>
        </nav>

        {/* ── Desktop right: price chip + buy button ──────────────────────── */}
        <div className="nav-desktop-only" dir="ltr" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {price !== null && (
            <div
              title={connected ? "Binance WebSocket · LIVE" : "Reconnecting…"}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 11px", borderRadius: 7,
                background: priceBg, border: `1px solid ${priceB}`,
                fontFamily: "var(--font-mono), monospace", fontSize: "0.72rem", lineHeight: 1,
              }}
            >
              <span className="live-dot" data-state={connected ? "on" : "off"} aria-label={connected ? "live" : "disconnected"} />
              <span style={{ color: mutedC }}>ZEC</span>
              <RollingPrice value={price} prefix="$" color={mainCol} fontWeight={600} />
              {blockHeight && (
                <>
                  <span style={{ color: mutedC }}>·</span>
                  <span style={{ color: mutedC }} suppressHydrationWarning>#{blockHeight.toLocaleString("en-US")}</span>
                </>
              )}
            </div>
          )}
          <a
            href="https://near-intents.org/?from=USDT&to=ZEC"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "7px 16px", borderRadius: 8,
              background: AMBER, color: "#09090b",
              fontWeight: 700, fontSize: "0.8rem",
              fontFamily: "Inter, system-ui, sans-serif",
              textDecoration: "none", transition: "opacity 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            קנה ZEC ◎
          </a>
        </div>

        {/* ── Mobile: hamburger + price chip ───────────────────────────────── */}
        <div className="nav-mobile-only" dir="ltr" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={mobileOpen}
            style={{
              background: mobileOpen ? hiBg : "transparent",
              border: `1px solid ${mobileOpen ? (isDark ? "#e4e4e7" : "#09090b") : (isDark ? "#3f3f46" : "#e4e4e7")}`,
              color: mobileOpen ? hiCol : textCol,
              cursor: "pointer",
              width: 44, height: 44, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
            }}
          >
            <motion.span key={mobileOpen ? "x" : "menu"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.18 }} style={{ display: "flex" }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </button>
          {price !== null && (
            <div
              title={connected ? "Binance WebSocket · LIVE" : "Reconnecting…"}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "6px 10px", borderRadius: 7,
                background: priceBg, border: `1px solid ${priceB}`,
                fontFamily: "var(--font-mono), monospace", fontSize: "0.7rem",
                lineHeight: 1, whiteSpace: "nowrap",
              }}
            >
              <span className="live-dot" data-state={connected ? "on" : "off"} aria-label={connected ? "live" : "disconnected"} />
              <span style={{ color: mutedC }}>ZEC</span>
              <RollingPrice value={price} prefix="$" color={mainCol} fontWeight={600} />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="nav-mobile-only"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed", top: 56, left: 0, right: 0, bottom: 0,
                background: "rgba(9,9,11,0.55)",
                backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
                zIndex: 40,
              }}
            />
            <motion.div
              key="drawer"
              className="nav-mobile-only"
              dir="rtl"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                position: "absolute", top: 56, left: 12, right: 12,
                background: isDark ? "#0b0b0e" : "#ffffff",
                border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                borderRadius: 14,
                boxShadow: "0 24px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)",
                padding: 14, zIndex: 45,
                display: "flex", flexDirection: "column", gap: 4,
                maxHeight: "calc(100vh - 80px)", overflowY: "auto",
              }}
            >
              {/* Live data pill */}
              {(price !== null || blockHeight !== null) && (
                <div
                  dir="ltr"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", marginBottom: 4, borderRadius: 10,
                    background: isDark ? "#141418" : "#fafafa",
                    border: `1px solid ${isDark ? "#27272a" : "#f0f0f3"}`,
                    fontFamily: "var(--font-mono), monospace", fontSize: "0.72rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 7, color: mutedC }}>
                    <span className="live-dot" data-state={connected ? "on" : "off"} aria-label={connected ? "live" : "disconnected"} />
                    {connected ? "LIVE" : "RECONNECT"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {price !== null && <RollingPrice value={price} prefix="$" color={mainCol} fontWeight={600} />}
                    {blockHeight !== null && (
                      <>
                        <span style={{ color: mutedC }}>·</span>
                        <span style={{ color: mutedC }} suppressHydrationWarning>#{blockHeight.toLocaleString("en-US")}</span>
                      </>
                    )}
                  </span>
                </div>
              )}

              {/* Group — ניווט מהיר */}
              <div>
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.58rem", letterSpacing: "0.12em", color: mutedC, margin: "4px 12px 6px", textTransform: "uppercase" }}>
                  ניווט מהיר
                </p>
                {NAV_ANCHORS.map((link, i) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavLink(link.id)}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "13px 12px", textAlign: "right",
                      fontSize: link.mono ? "0.95rem" : "1rem",
                      color: isDark ? "#e4e4e7" : "#09090b",
                      fontFamily: link.mono ? "var(--font-mono), monospace" : "Inter, system-ui, sans-serif",
                      borderBottom: i < NAV_ANCHORS.length - 1 ? `1px solid ${isDark ? "#18181b" : "#f4f4f5"}` : "none",
                      width: "100%", borderRadius: 8, minHeight: 48, fontWeight: 500,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <span>{link.label}</span>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.65rem", color: mutedC }}>#</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isDark ? "#1c1c1f" : "#f0f0f3", margin: "2px 0" }} />

              {/* Group — מידע וקהילה */}
              <div>
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.58rem", letterSpacing: "0.12em", color: mutedC, margin: "6px 12px 6px", textTransform: "uppercase" }}>
                  מידע וקהילה
                </p>
                {NAV_PAGES.map((page, i) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      background: "transparent",
                      padding: "13px 12px", textAlign: "right",
                      fontSize: "1rem", color: isDark ? "#e4e4e7" : "#09090b",
                      fontFamily: "Inter, system-ui, sans-serif",
                      borderBottom: i < NAV_PAGES.length - 1 ? `1px solid ${isDark ? "#18181b" : "#f4f4f5"}` : "none",
                      width: "100%", borderRadius: 8, minHeight: 48, fontWeight: 500,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      textDecoration: "none",
                    }}
                  >
                    <span>{page.label}</span>
                    <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.65rem", color: mutedC }}>→</span>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: isDark ? "#1c1c1f" : "#f0f0f3", margin: "2px 0" }} />

              {/* Primary CTA */}
              <Link
                href="/guides/start"
                onClick={() => setMobileOpen(false)}
                style={{
                  background: isDark ? "rgba(243,177,50,0.08)" : "rgba(243,177,50,0.05)",
                  border: `1px solid ${AMBER}`,
                  cursor: "pointer",
                  padding: "13px 14px", marginTop: 4,
                  textAlign: "right", fontSize: "1rem", color: AMBER,
                  fontFamily: "Inter, system-ui, sans-serif",
                  borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 10, textDecoration: "none", minHeight: 48, fontWeight: 600,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.85rem" }}>◎</span>
                  איך מתחילים?
                </span>
                <span style={{ color: mutedC, fontSize: "0.85rem" }}>←</span>
              </Link>

              {/* Buy ZEC */}
              <a
                href="https://near-intents.org/?from=USDT&to=ZEC"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                style={{
                  marginTop: 8, padding: "15px", borderRadius: 12,
                  background: AMBER, color: "#09090b",
                  fontWeight: 700, textAlign: "center",
                  fontSize: "1rem", fontFamily: "Inter, system-ui, sans-serif",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, minHeight: 52,
                  boxShadow: "0 4px 14px rgba(243,177,50,0.25)",
                }}
              >
                קנה ZEC <span style={{ fontFamily: "var(--font-mono), monospace" }}>◎</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
