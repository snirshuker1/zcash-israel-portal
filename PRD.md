# Final PRD for Claude Code (English Prompt Context)

You can copy everything below this line and paste it directly into Claude Code to initialize the project.

## Project Context & Role:
You are an expert Full-Stack Next.js Developer and a UI/UX Designer specializing in "Crypto-Native" web applications. We are building a high-end, data-centric advocacy and educational portal for the Zcash (ZEC) protocol, specifically targeted at the Israeli crypto community.

## Core Philosophy & Vibe:

- **Tagline:** "Zcash: Encrypt Your money."
- **Target Audience:** Crypto Natives, Cypherpunks, Developers, and Privacy Advocates.
- **Aesthetic:** "Obsidian" Dark Mode, Cypherpunk minimalism, terminal/code UI elements, glassmorphism. No generic corporate marketing fluff. It must feel like a protocol dashboard.
- **Typography:** Monospace fonts (e.g., JetBrains Mono) for all numbers, metrics, and technical data. Clean Sans-serif for readable prose.
- **Language:** The entire UI MUST support strict RTL (Right-to-Left) direction for Hebrew content. Code variables and comments should remain in English.

## Project Architecture & Stack:

- Next.js 14+ (App Router).
- Tailwind CSS for styling.
- Framer Motion for subtle, functional animations (e.g., "decryption" text scramble effects on hover).
- Lucide-React for crisp, technical icons.

## Required Content Modules (Build these components step-by-step):

### 1. Protocol Status Hero Section:
- Large impact typography: "Zcash: Encrypt Your money."
- Hebrew sub-headline explaining mathematically proven privacy and limited supply.
- Live Metrics Dashboard: A top-level or hero-integrated ticker showing: Current Block Height, 100% Uptime since 2016, and current Shielded Pool size.

### 2. The Protocol Evolution (Timeline/Lore):
Design a sleek, technical timeline component featuring these factual milestones:
- **2013:** Academic origins (Zerocash paper at Johns Hopkins).
- **2016:** Launch & MPC (Multi-Party Computation setup).
- **2018:** Sapling Upgrade (Massive efficiency leap for mobile proofs).
- **2022:** Halo 2 & Nu5 (Historical elimination of the Trusted Setup via recursive ZK-proofs).
- **Future:** Roadmap to PoS (Proof of Stake) and ZSA (Zcash Shielded Assets).

### 3. The Tech & Economics (Zk-SNARKs & 21M Cap):
- Visual or structural comparison showing Transparent vs. Shielded transactions.
- Highlight the strict 21,000,000 supply cap.

### 4. Localization & Technical FAQ (Israeli Context):
- Wallet recommendations section specifically highlighting Zashi and Edge.
- FAQ Accordion including:
  - **Viewing Keys:** Explaining how to remain compliant with Israeli tax authorities by selectively sharing read-only access.
  - **Zcash vs. Monero:** Technical distinction between ZK-math privacy and Decoy-based privacy.

## First Action Required:
Please initialize the Next.js project with Tailwind CSS, configure the global layout for RTL (Hebrew), establish the deep dark mode color palette (Obsidian & Zcash Yellow/Orange #F3B132), and build the first iteration of the Protocol Status Hero Section with mock data for the live metrics.
