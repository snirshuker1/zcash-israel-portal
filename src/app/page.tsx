import HeroSection from "@/components/HeroSection";
import MetricsTicker from "@/components/MetricsTicker";
import MetricsHeader from "@/components/MetricsHeader";
import Timeline from "@/components/Timeline";
import IdeologicalCTA from "@/components/IdeologicalCTA";
import SupportersSection from "@/components/SupportersSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
    <main>
      {/* ── 1. Hero ── */}
      <HeroSection />

      {/* ── 2. Live Metrics — dark band ── */}
      <section id="metrics" style={{ backgroundColor: "#09090b", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <MetricsHeader />
          <MetricsTicker />
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: "0.68rem",
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

      {/* ── 5. Prominent Supporters ── */}
      <SupportersSection />

      {/* ── 6. Technical FAQ ── */}
      <FAQ />

      {/* ── 7. Footer ── */}
      <Footer />
    </main>
    </PageWrapper>
  );
}
