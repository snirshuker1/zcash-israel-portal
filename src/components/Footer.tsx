"use client";

const AMBER = "#F3B132";

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#09090b",
        borderTop: "1px solid #27272a",
        padding: "48px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 32,
            marginBottom: 40,
          }}
          dir="rtl"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
              dir="ltr"
            >
              <svg width={28} height={28} viewBox="0 0 493.3 490.2" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="m245.4 20c-124.3 0-225.4 101.1-225.4 225.4s101.1 225.4 225.4 225.4 225.4-101.1 225.4-225.4-101.1-225.4-225.4-225.4zm0 413.6c-103.8 0-188.2-84.4-188.2-188.2s84.4-188.2 188.2-188.2 188.2 84.4 188.2 188.2-84.4 188.2-188.2 188.2z"
                  fill="#e4e4e7"
                />
                <circle cx="245.4" cy="245.4" r="177.6" fill={AMBER} />
                <path
                  d="m165 315.5v34.4h61.5v37.7h37.8v-37.7h61.5v-45.5h-95.4l95.4-129.4v-34.4h-61.5v-37.6h-37.8v37.6h-61.5v45.6h95.4z"
                  fill="#09090b"
                />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: AMBER,
                  letterSpacing: "0.04em",
                }}
              >
                Zcash IL
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#52525b", fontFamily: "Inter, system-ui, sans-serif", maxWidth: 240 }} dir="rtl">
              פרטיות מוכחת מתמטית לקהילה הישראלית.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }} dir="ltr">
            <div>
              <p style={{ fontSize: "0.65rem", color: "#52525b", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "var(--font-mono), monospace" }}>
                PROTOCOL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Zcash (z.cash)", href: "https://z.cash" },
                  { label: "Electric Coin Co", href: "https://electriccoin.co" },
                  { label: "Shielded Labs", href: "https://shieldedlabs.net" },
                  { label: "Zcash Foundation", href: "https://zfnd.org" },
                  { label: "Zcash Community Forum", href: "https://forum.zcashcommunity.com" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      color: "#71717a",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#71717a")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: "0.65rem", color: "#52525b", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "var(--font-mono), monospace" }}>
                WALLETS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Zodl (Mobile)", href: "https://zodl.app" },
                  { label: "Edge Wallet", href: "https://edge.app" },
                  { label: "Near Intents (Buy ZEC)", href: "https://near-intents.org/?from=USDT&to=ZEC" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      color: "#71717a",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#71717a")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: "0.65rem", color: "#52525b", letterSpacing: "0.1em", marginBottom: 10, fontFamily: "var(--font-mono), monospace" }}>
                CONTACT
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "X · @ZcashIsrael", href: "https://x.com/ZcashIsrael" },
                  { label: "Email · pyroninfo@gmail.com", href: "https://mail.google.com/mail/?view=cm&fs=1&to=pyroninfo@gmail.com" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.8rem",
                      color: "#71717a",
                      textDecoration: "none",
                      fontFamily: "Inter, system-ui, sans-serif",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#71717a")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "#27272a", marginBottom: 24 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
          dir="ltr"
        >
          <p style={{ fontSize: "0.72rem", color: "#3f3f46", fontFamily: "var(--font-mono), monospace" }}>
            © 2025 Zcash IL · Not financial advice · Protocol data only
          </p>
          <p style={{ fontSize: "0.72rem", color: "#3f3f46", fontFamily: "var(--font-mono), monospace" }}>
            ZEC · zk-SNARKs · Halo 2 · No Trusted Setup
          </p>
        </div>
      </div>
    </footer>
  );
}
