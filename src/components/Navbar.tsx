"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";

const AMBER = "#F3B132";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const NAV_LINKS = [
  { label: "מטריקות", id: "metrics" },
  { label: "מסע הפרוטוקול", id: "timeline", mono: true },
  { label: "FAQ", id: "faq" },
  { label: "רכישה", id: "cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isDark = pathname === "/immersive";

  const { data: stats } = useSWR("/api/zcash/stats", fetcher, { refreshInterval: 60_000 });
  const price: number | null = stats?.priceUsd ?? null;
  const blockHeight: number | null = stats?.blockHeight ?? null;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleNavLink(id: string) {
    if (isHome) {
      scrollToSection(id);
    } else {
      router.push(`/#${id}`);
    }
  }

  // Adaptive theme: dark for /immersive, light for all other pages
  const navBg    = isDark ? (scrolled ? "rgba(9,9,11,0.95)"    : "rgba(9,9,11,0.85)")    : (scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)");
  const border   = isDark ? (scrolled ? "#27272a"              : "transparent")           : (scrolled ? "#e4e4e7"               : "transparent");
  const textCol  = isDark ? "#a1a1aa" : "#71717a";
  const hoverCol = isDark ? "#ffffff" : "#09090b";
  const hoverBg  = isDark ? "#27272a" : "#f4f4f5";
  const priceBg  = isDark ? "#141414" : "#fafafa";
  const priceBdr = isDark ? "#27272a" : "#e4e4e7";
  const mutedCol = isDark ? "#52525b" : "#a1a1aa";
  const mainCol  = isDark ? "#e4e4e7" : "#09090b";
  const linkBdr  = isDark ? "#3f3f46" : "#e4e4e7";
  const linkHBdr = isDark ? "#e4e4e7" : "#09090b";
  const logoCol  = isDark ? "#e4e4e7" : "#09090b";

  return (
    <motion.header
      suppressHydrationWarning
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: navBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${border}`,
        transition: "all 0.25s",
      }}
    >
      <div
        className="navbar-inner"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        dir="rtl"
      >
        {/* Logo — always navigates to homepage */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
          dir="ltr"
        >
          <svg width={28} height={28} viewBox="0 0 493.3 490.2" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="m245.4 20c-124.3 0-225.4 101.1-225.4 225.4s101.1 225.4 225.4 225.4 225.4-101.1 225.4-225.4-101.1-225.4-225.4-225.4zm0 413.6c-103.8 0-188.2-84.4-188.2-188.2s84.4-188.2 188.2-188.2 188.2 84.4 188.2 188.2-84.4 188.2-188.2 188.2z"
              fill={logoCol}
            />
            <circle cx="245.4" cy="245.4" r="177.6" fill={AMBER} />
            <path
              d="m165 315.5v34.4h61.5v37.7h37.8v-37.7h61.5v-45.5h-95.4l95.4-129.4v-34.4h-61.5v-37.6h-37.8v37.6h-61.5v45.6h95.4z"
              fill="#09090b"
            />
          </svg>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: "0.9rem", color: logoCol, letterSpacing: "0.03em" }}>
            Zcash <span style={{ color: AMBER }}>IL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavLink(link.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 12px", borderRadius: 6,
                fontSize: link.mono ? "0.8rem" : "0.85rem",
                color: textCol,
                fontFamily: link.mono ? "var(--font-mono), monospace" : "Inter, system-ui, sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = hoverCol;
                (e.currentTarget as HTMLElement).style.background = hoverBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = textCol;
                (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/guides/start"
            style={{
              background: "none", border: `1px solid ${linkBdr}`, cursor: "pointer",
              padding: "5px 12px", borderRadius: 6,
              fontSize: "0.85rem", color: textCol,
              fontFamily: "Inter, system-ui, sans-serif",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 5,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = hoverCol;
              (e.currentTarget as HTMLElement).style.borderColor = linkHBdr;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = textCol;
              (e.currentTarget as HTMLElement).style.borderColor = linkBdr;
            }}
          >
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.65rem", color: AMBER }}>◎</span>
            איך מתחילים?
          </Link>
        </nav>

        {/* Right side: price ticker + CTA */}
        <div className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 12 }} dir="ltr">
          {price !== null && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 6,
                background: priceBg, border: `1px solid ${priceBdr}`,
                fontFamily: "var(--font-mono), monospace", fontSize: "0.72rem",
              }}
            >
              <span style={{ color: mutedCol }}>ZEC</span>
              <span style={{ color: mainCol, fontWeight: 600 }} suppressHydrationWarning>${price.toFixed(2)}</span>
              {blockHeight && (
                <>
                  <span style={{ color: mutedCol }}>·</span>
                  <span style={{ color: mutedCol }} suppressHydrationWarning>#{blockHeight.toLocaleString("en-US")}</span>
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
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            קנה ZEC ◎
          </a>
        </div>

        {/* Mobile right cluster: price chip + hamburger */}
        <div className="nav-mobile-only" style={{ display: "flex", alignItems: "center", gap: 10 }} dir="ltr">
          {price !== null && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 9px", borderRadius: 6,
                background: priceBg, border: `1px solid ${priceBdr}`,
                fontFamily: "var(--font-mono), monospace", fontSize: "0.68rem",
                lineHeight: 1,
              }}
            >
              <span style={{ color: mutedCol }}>ZEC</span>
              <span style={{ color: mainCol, fontWeight: 600 }} suppressHydrationWarning>
                ${price.toFixed(2)}
              </span>
            </div>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            style={{
              background: open ? hoverBg : "transparent",
              border: `1px solid ${open ? linkHBdr : linkBdr}`,
              color: open ? hoverCol : textCol,
              cursor: "pointer",
              width: 42, height: 42,
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <motion.span
              key={open ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex" }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </button>
        </div>
      </div>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="nav-mobile-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                top: 56, left: 0, right: 0, bottom: 0,
                background: "rgba(9,9,11,0.55)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 40,
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              className="nav-mobile-only"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              dir="rtl"
              style={{
                position: "absolute",
                top: 56, left: 12, right: 12,
                background: isDark ? "#0b0b0e" : "#ffffff",
                border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                borderRadius: 14,
                boxShadow: "0 24px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.08)",
                padding: 14,
                zIndex: 45,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                maxHeight: "calc(100vh - 80px)",
                overflowY: "auto",
              }}
            >
              {/* Live status pill */}
              {(price !== null || blockHeight !== null) && (
                <div
                  dir="ltr"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    marginBottom: 6,
                    borderRadius: 10,
                    background: isDark ? "#141418" : "#fafafa",
                    border: `1px solid ${isDark ? "#27272a" : "#f0f0f3"}`,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.72rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: mutedCol }}>
                    <span
                      className="pulse-amber"
                      style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, display: "inline-block" }}
                    />
                    LIVE
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {price !== null && (
                      <span style={{ color: mainCol, fontWeight: 600 }} suppressHydrationWarning>
                        ${price.toFixed(2)}
                      </span>
                    )}
                    {blockHeight !== null && (
                      <>
                        <span style={{ color: mutedCol }}>·</span>
                        <span style={{ color: mutedCol }} suppressHydrationWarning>
                          #{blockHeight.toLocaleString("en-US")}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              )}

              {NAV_LINKS.map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => { handleNavLink(link.id); setOpen(false); }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 12px",
                    textAlign: "right",
                    fontSize: link.mono ? "0.95rem" : "1.02rem",
                    color: isDark ? "#e4e4e7" : "#09090b",
                    fontFamily: link.mono ? "var(--font-mono), monospace" : "Inter, system-ui, sans-serif",
                    borderBottom: i < NAV_LINKS.length - 1
                      ? `1px solid ${isDark ? "#18181b" : "#f4f4f5"}`
                      : "none",
                    width: "100%",
                    borderRadius: 8,
                    minHeight: 48,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{ color: mutedCol, fontSize: "0.85rem" }}>←</span>
                </button>
              ))}

              <Link
                href="/guides/start"
                onClick={() => setOpen(false)}
                style={{
                  background: isDark ? "#141418" : "#fafafa",
                  border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                  cursor: "pointer",
                  padding: "13px 14px",
                  marginTop: 8,
                  textAlign: "right",
                  fontSize: "1rem",
                  color: isDark ? "#e4e4e7" : "#09090b",
                  fontFamily: "Inter, system-ui, sans-serif",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  textDecoration: "none",
                  minHeight: 48,
                  fontWeight: 600,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.85rem", color: AMBER }}>◎</span>
                  איך מתחילים?
                </span>
                <span style={{ color: mutedCol, fontSize: "0.85rem" }}>←</span>
              </Link>

              <a
                href="https://near-intents.org/?from=USDT&to=ZEC"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  marginTop: 10,
                  padding: "15px",
                  borderRadius: 12,
                  background: AMBER,
                  color: "#09090b",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: "1rem",
                  fontFamily: "Inter, system-ui, sans-serif",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  minHeight: 52,
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
