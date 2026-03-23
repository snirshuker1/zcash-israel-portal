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
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: AMBER,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#09090b",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                ◎
              </span>
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
                  { label: "ECC (Electric Coin Co.)", href: "https://electriccoin.co" },
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
                  { label: "Zashi (Mobile)", href: "https://zashi.app" },
                  { label: "Edge Wallet", href: "https://edge.app" },
                  { label: "Near Intents (Buy ZEC)", href: "https://near.org/intents" },
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
