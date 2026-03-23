import HeroSection from "@/components/HeroSection";
import MetricsTicker from "@/components/MetricsTicker";
import Timeline from "@/components/Timeline";
import IdeologicalCTA from "@/components/IdeologicalCTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const AMBER = "#F3B132";

export default function Home() {
  return (
    <main>
      {/* ── 1. Hero ── */}
      <HeroSection />

      {/* ── 2. Live Metrics — dark band ── */}
      <section id="metrics" style={{ backgroundColor: "#09090b", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 36, textAlign: "center" }} dir="rtl">
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.16em",
                color: AMBER,
                marginBottom: 10,
              }}
            >
              // LIVE_PROTOCOL_DATA
            </p>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                fontWeight: 700,
                color: "#e4e4e7",
                letterSpacing: "-0.02em",
                marginBottom: 6,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              מטריקות פרוטוקול בזמן אמת
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#52525b", fontFamily: "Inter, system-ui, sans-serif" }}>
              לחץ על כל כרטיס לפתיחת גרף אינטראקטיבי
            </p>
          </div>
          <MetricsTicker />
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: "0.6rem",
              color: "#27272a",
              fontFamily: "var(--font-mono), monospace",
              letterSpacing: "0.08em",
            }}
            dir="ltr"
          >
            Data: Blockchair API · CoinGecko · refreshed every 60s
          </p>
        </div>
      </section>

      {/* ── 3. Protocol Timeline ── */}
      <Timeline />

      {/* ── 4. Ideological CTA ── */}
      <IdeologicalCTA />

      {/* ── 5. Technical FAQ ── */}
      <FAQ />

      {/* ── 6. Footer ── */}
      <Footer />
    </main>
  );
}
