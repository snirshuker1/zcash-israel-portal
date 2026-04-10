"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const AMBER = "#F3B132";

interface Chapter {
  era: string;
  year: string;
  date: string;
  titleHe: string;
  descHe: string[];
  tags: string[];
  milestone?: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    era: "GENESIS",
    year: "2013–14",
    date: "מאי 2013 · מאי 2014",
    titleHe: "המקורות האקדמיים",
    descHe: [
      "מאמר Zerocoin (2013), מאת יאן מירס, כריסטינה גרמן, מת'יו גרין ואביאל רובין ב-Johns Hopkins, מציע ניתוק הקישור בין עסקאות ב-Bitcoin — אך עדיין חושף את היעד ואת הסכום.",
      "שנה לאחר מכן, מאמר Zerocash (2014) — בשיתוף אלי בן-ששון ואחרים — מביא את zk-SNARKs אל הפרוטוקול: שולח, מקבל וסכום כולם מוסתרים לחלוטין. עסקאות מתחת ל-1KB, אימות ב-6 מילישניות.",
      "הפרוטוקול מוצג ב-IEEE Symposium on Security and Privacy — ומניח את אבן הפינה של פרטיות פיננסית מוכחת מתמטית.",
    ],
    tags: ["Zerocoin", "Zerocash", "Johns Hopkins", "zk-SNARKs", "IEEE S&P 2014"],
    milestone: false,
  },
  {
    era: "SPROUT",
    year: "2016",
    date: "28 באוקטובר, 2016",
    titleHe: "השקת הפרוטוקול — הבלוק הראשון",
    descHe: [
      'Zcash 1.0 "Sprout" יוצא לאוויר. שבעה ימים קודם לכן מתקיים טקס ה-Trusted Setup: שישה אנשים, בחדרים נפרדים ברחבי העולם, יוצרים יחד פרמטרים קריפטוגרפיים.',
      'המשתתפים: Zooko Wilcox, Peter Todd, Andrew Miller, Peter Van Valkenburgh — ואדוארד סנודן, שהשתתף תחת הכינוי "John Dobbertin". כדי לפגוע בביטחון, כל ששת המשתתפים היו צריכים לקנות קשר. מספיק שאחד מהם ישר.',
      "20% מכל בלוק מופנים למייסדים (Founders' Reward) — גמול שנוי במחלוקת שממן את ECC במשך ארבע שנות הפיתוח הראשונות.",
    ],
    tags: ["Sprout", "Mainnet", "Trusted Setup", "MPC", "Founders' Reward", "Edward Snowden"],
    milestone: false,
  },
  {
    era: "OVERWINTER",
    year: "2018",
    date: "25 ביוני, 2018 — בלוק 347,500",
    titleHe: "הפורק הראשון — תשתית לעתיד",
    descHe: [
      "שדרוג הרשת הראשון (Hard Fork) בהיסטוריית Zcash — עובר ללא תקלות עם תמיכה של 12+ בורסות.",
      "Overwinter מציג: גרסאות עסקה, Replay Protection בין פורקים, ותפוגה אוטומטית לעסקאות תקועות (כ-50 דקות).",
      'לא שינוי גלוי למשתמש — אלא הנחת שכבת תשתית שמאפשרת לכל השדרוגים הבאים להתרחש בצורה בטוחה ומסודרת. Zooko Wilcox מתאר אותו כ"חיסון לפני העונה".',
    ],
    tags: ["Overwinter", "Hard Fork", "Replay Protection", "Transaction Expiry", "ZIP 200"],
    milestone: false,
  },
  {
    era: "SAPLING",
    year: "2018",
    date: "29 באוקטובר, 2018 — בלוק 419,200",
    titleHe: "קפיצת הביצועים — הגנה על הסלולרי",
    descHe: [
      "אבן דרך קריטית בביצועים: יצירת הוכחת zk-SNARK ירדה מ-40 שניות לפחות משנייה. השימוש בזיכרון צנח מ-3GB ל-40MB בלבד — הגנה מלאה על מכשיר נייד הפכה לאפשרית.",
      "Sapling מציג את Viewing Keys: בעל כתובת יכול לשתף גישת קריאה לעסקאות שלו מבלי לחשוף את מפתח ההוצאה — כלי ציות ייחודי לפרוטוקול.",
      "טקס Trusted Setup שני — 90+ משתתפים מרחבי העולם, הגדול ביותר שבוצע אי פעם — מבסס את ה-Powers of Tau.",
      "Sapling הפך לתקן תעשייתי שאומץ על ידי Filecoin, Ethereum ואחרים.",
    ],
    tags: ["Sapling", "Mobile ZK", "Viewing Keys", "40MB RAM", "Powers of Tau", "ZIP 202"],
    milestone: true,
  },
  {
    era: "BLOSSOM",
    year: "2019",
    date: "11 בדצמבר, 2019 — בלוק 653,600",
    titleHe: "הכפלת הקיבולת",
    descHe: [
      "זמן הבלוק קוצר בדיוק מ-150 שניות ל-75 שניות — פי שניים בלוקים ביום, פי שניים קיבולת רשת.",
      "גמול הבלוק הותאם פרופורציונלית (12.5 ← 6.25 ZEC) כדי לשמור במדויק על לוח ההנפקה של 21 מיליון ZEC.",
      "אישורים מגיעים מהר יותר, עמלות נמוכות יותר, ורשת מוכנה לנפח גדול יותר. שדרוג יחסית שקט — אך משנה את הקצב הבסיסי של הפרוטוקול לנצח.",
    ],
    tags: ["Blossom", "75s Block Time", "Throughput ×2", "6.25 ZEC/Block", "ZIP 208"],
    milestone: false,
  },
  {
    era: "HEARTWOOD",
    year: "2020",
    date: "16 ביולי, 2020 — בלוק 903,000",
    titleHe: "כורים בבריכה המוגנת",
    descHe: [
      "Shielded Coinbase (ZIP 213): לראשונה, כורים יכולים לשלוח ישירות את גמול הכרייה לכתובת Sapling מוגנת — ללא מעבר מחויב דרך כתובת שקופה. פרצה היסטורית בשרשרת השקיפות נסגרת.",
      "FlyClient (ZIP 221): Merkle Mountain Range נוסף לכותרות הבלוקים. מאפשר אימות Proof-of-Work לקליינטים קלים ומניח תשתית לתקשורת עתידית עם בלוקצ'יינים אחרים — כולל Ethereum.",
    ],
    tags: ["Heartwood", "Shielded Coinbase", "FlyClient", "MMR", "ZIP 213", "ZIP 221"],
    milestone: false,
  },
  {
    era: "CANOPY",
    year: "2020",
    date: "18 בנובמבר, 2020 — בלוק 1,046,400",
    titleHe: "חציון ראשון — סוף עידן המייסדים",
    descHe: [
      "החציון הראשון: גמול הבלוק חצי (6.25 ← 3.125 ZEC). ה-Founders' Reward שחולק מאז 2016 מגיע לסיומו.",
      "קרן פיתוח חדשה נכנסת לתוקף: 80% לכורים, 8% לקהילה דרך Zcash Community Grants (ZCG), 7% ל-Electric Coin Company, 5% ל-Zcash Foundation.",
      "ההמרה: מגמול מייסדים ריכוזי — לממשל מבוזר. NU5 כבר בפיתוח — הצוות יודע שהשלב הבא הוא המהפכה האמיתית.",
    ],
    tags: ["Canopy", "First Halving", "Founders' Reward Ends", "ZCG", "Dev Fund", "3.125 ZEC"],
    milestone: true,
  },
  {
    era: "ORCHARD · NU5",
    year: "2022",
    date: "31 במאי, 2022 — בלוק 1,687,104",
    titleHe: "Halo 2 — הסוף ל-Trusted Setup, לנצח",
    descHe: [
      "האבן הגדולה ביותר בהיסטוריית Zcash. Halo 2 — מערכת הוכחה ZK רקורסיבית שאינה דורשת Trusted Setup כלל.",
      "מה שהצריך 6 אנשים ב-2016, ו-90 ב-2018 — אינו נדרש עוד לעולם, לאף שדרוג עתידי.",
      "Orchard מחליפה את Sapling כבריכה הראשית. Unified Addresses מאחדות את כל הפרוטוקולים בכתובת בודדת. עסקאות מוגנות מלאות על מכשיר נייד — ללא פשרות.",
      "Halo 2 נכתב מאפס על ידי הצוות ב-ECC וכבר מאומץ על ידי מחקר ZK ברחבי העולם.",
    ],
    tags: ["NU5", "Orchard", "Halo 2", "No Trusted Setup", "Recursive ZK", "Unified Addresses"],
    milestone: true,
  },
  {
    era: "NU6",
    year: "2024",
    date: "23 בנובמבר, 2024 — בלוק 2,726,400",
    titleHe: "חציון שני — הקרן הנעולה",
    descHe: [
      "החציון השני: גמול הבלוק חצי (3.125 ← 1.5625 ZEC). 16.6 מיליון ZEC במחזור — 79% מהמקסימום.",
      'NU6 מוסיף את "Deferred Dev Fund Lockbox": 12% מכל בלוק נצבר בקרן שטרם נשלטת — עד שהקהילה תחליט כיצד לנהל אותה. 8% ממשיכים דרך ZCG לפרויקטים קהילתיים.',
      "ZSA (Zcash Shielded Assets) בפיתוח פעיל ב-QEDIT — הנפקת טוקנים פרטיים על Orchard מתקרבת.",
    ],
    tags: ["NU6", "Second Halving", "Lockbox", "1.5625 ZEC", "16.6M ZEC", "ZSA Dev"],
    milestone: false,
  },
  {
    era: "NU6.1",
    year: "2025",
    date: "24 בנובמבר, 2025 — בלוק 3,146,400",
    titleHe: "ממשל מחזיקים — הפרוטוקול שייך לקהילה",
    descHe: [
      "מהלך ממשלי היסטורי: הקרן הנעולה (12% מגמול הבלוקים) עוברת לשליטת מחזיקי ZEC עצמם — לא ל-ECC ולא ל-Zcash Foundation. 8% ממשיכים לקהילה דרך ZCG.",
      "Crosslink — פרוטוקול PoS היברידי שפיתחה Shielded Labs — עובר Milestone 4 ונמצא בשלב Hardening: PoW שומר על המינינג כמנגנון Sybil-resistance, PoS מוסיף שכבת Finality מהירה ותשואה למחזיקים — כולו בתוך Orchard, פרטי לחלוטין.",
      "Zebra, מימוש Consensus מלא של Zcash Foundation, מוכן להחליף את zcashd ב-NU7.",
    ],
    tags: ["NU6.1", "Holder Governance", "Crosslink", "Hybrid PoS", "Zebra Node", "Shielded Staking"],
    milestone: false,
  },
  {
    era: "FUTURE · NU7+",
    year: "2026+",
    date: "בפיתוח",
    titleHe: "ZSA, Crosslink, Project Tachyon — ו-21M ZEC לנצח",
    descHe: [
      "NU7 מביא Zcash Shielded Assets: הנפקה, העברה ושריפה של טוקנים מותאמים אישית — כמו ERC-20 אך עם הגנת Orchard מלאה.",
      "Crosslink (היברידי PoW + PoS) מציג staking מכומת ב-1, 10 או 100 ZEC עם Finality מהיר. 51% attack הופך לדרמטית יותר קשה.",
      "Project Tachyon, יוזמת ECC, מחדשת את מערכת ההוכחה: מהירות ייצור הוכחת ZK עולה פי כמה, כך שעסקה מוגנת מלאה מסתיימת תחת שנייה על כל מכשיר נייד.",
      "כל זה על גבי רשת עם 21 מיליון ZEC בסכום קבוע לנצח — שנולדה מהוכחה מתמטית ב-2013, ומוכיחה את עצמה מחדש בכל שדרוג.",
    ],
    tags: ["NU7", "ZSA", "Crosslink", "Project Tachyon", "Shielded Staking", "51% Resistance", "21M ZEC Cap"],
    milestone: false,
  },
];

const LTR_TERMS = [
  "Zcash Shielded Assets", "Trusted Setup", "Founders' Reward", "Viewing Keys", "Unified Addresses",
  "Electric Coin Company", "Zcash Foundation", "Zcash Community Grants", "Shielded Labs",
  "Shielded Coinbase", "Proof-of-Work", "Sybil-resistance", "Replay Protection", "Transaction Expiry",
  "Merkle Mountain Range", "Powers of Tau", "Deferred Dev Fund Lockbox",
  "Project Tachyon", "Halo 2", "Halo Arc", "NU6.1", "NU6", "NU5", "NU7", "ZSA", "ZCG", "ECC", "ZK",
  "Orchard", "Sapling", "Sprout", "Overwinter", "Blossom", "Heartwood", "Canopy", "Crosslink", "Zebra",
  "zk-SNARKs", "zk-SNARK", "FlyClient", "MPC", "PoS", "PoW",
  "Johns Hopkins", "IEEE", "Bitcoin", "Ethereum", "Filecoin",
  "Edward Snowden", "Zooko Wilcox", "Peter Todd",
  "ERC-20", "MMR", "Milestone 4",
];

function RenderBidi({ text }: { text: string }) {
  const escaped = LTR_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${escaped})`, "g");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        LTR_TERMS.includes(part) ? (
          <span key={i} dir="ltr" style={{ display: "inline" }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface Props {
  onClose: () => void;
}

export default function ProtocolJourneyModal({ onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= CHAPTERS.length) return;
      setDir(next > idx ? 1 : -1);
      setIdx(next);
    },
    [idx]
  );

  const prev = useCallback(() => goTo(idx - 1), [idx, goTo]);
  const next = useCallback(() => goTo(idx + 1), [idx, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") prev(); // RTL: right arrow = back
      if (e.key === "ArrowLeft") next();  // RTL: left arrow = forward
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  const chapter = CHAPTERS[idx];

  // RTL: "next" (forward) slides in from the left, exits to the right
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? -64 : 64, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? 64 : -64, opacity: 0 }),
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#09090B",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: "1px solid #141414",
          flexShrink: 0,
        }}
        dir="ltr"
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.62rem",
            color: AMBER,
            letterSpacing: "0.15em",
          }}
        >
          // PROTOCOL_EVOLUTION
        </span>

        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.62rem",
            color: "#333",
            letterSpacing: "0.1em",
          }}
        >
          {String(idx + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
        </span>

        <button
          onClick={onClose}
          style={{
            background: "#141414",
            border: "1px solid #222",
            borderRadius: 7,
            padding: "6px 8px",
            cursor: "pointer",
            color: "#555",
            display: "flex",
            alignItems: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#555")}
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Main chapter area ─────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Year watermark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={chapter.year}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              dir="ltr"
              style={{
                fontSize: "clamp(96px, 18vw, 180px)",
                fontFamily: "var(--font-mono), monospace",
                fontWeight: 800,
                color: "#111",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {chapter.year}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Left / Right nav arrows — RTL: left = next (forward), right = prev (back) */}
        <button
          onClick={next}
          disabled={idx === CHAPTERS.length - 1}
          style={{
            position: "absolute",
            left: 16,
            zIndex: 2,
            background: "transparent",
            border: "1px solid",
            borderColor: idx === CHAPTERS.length - 1 ? "#1a1a1a" : "#2a2a2a",
            borderRadius: 8,
            padding: "10px",
            cursor: idx === CHAPTERS.length - 1 ? "default" : "pointer",
            color: idx === CHAPTERS.length - 1 ? "#1f1f1f" : "#444",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (idx < CHAPTERS.length - 1) (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            if (idx < CHAPTERS.length - 1) (e.currentTarget as HTMLElement).style.color = "#444";
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={prev}
          disabled={idx === 0}
          style={{
            position: "absolute",
            right: 16,
            zIndex: 2,
            background: "transparent",
            border: "1px solid",
            borderColor: idx === 0 ? "#1a1a1a" : "#2a2a2a",
            borderRadius: 8,
            padding: "10px",
            cursor: idx === 0 ? "default" : "pointer",
            color: idx === 0 ? "#1f1f1f" : "#444",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (idx > 0) (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            if (idx > 0) (e.currentTarget as HTMLElement).style.color = "#444";
          }}
        >
          <ChevronRight size={18} />
        </button>

        {/* Chapter content */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 760,
              margin: "0 auto",
              padding: "0 64px",
            }}
            dir="rtl"
          >
            {/* Era badge + milestone */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }} dir="ltr">
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  color: AMBER,
                  padding: "3px 9px",
                  border: `1px solid ${AMBER}35`,
                  borderRadius: 4,
                }}
              >
                {chapter.era}
              </span>
              {chapter.milestone && (
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "#555",
                    padding: "3px 9px",
                    border: "1px solid #1f1f1f",
                    borderRadius: 4,
                  }}
                >
                  ★ MILESTONE
                </span>
              )}
            </div>

            {/* Date */}
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.68rem",
                color: "#3a3a3a",
                marginBottom: 14,
                letterSpacing: "0.04em",
                textAlign: "right",
              }}
              dir="ltr"
            >
              {chapter.date}
            </p>

            {/* Title */}
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.3,
                marginBottom: 18,
                fontFamily: "Inter, var(--font-sans), system-ui, sans-serif",
                textAlign: "right",
              }}
            >
              {chapter.titleHe}
            </h2>

            {/* Description */}
            <div style={{ marginBottom: 28 }}>
              {chapter.descHe.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "clamp(0.88rem, 1.4vw, 1rem)",
                    color: "#777",
                    lineHeight: 1.85,
                    marginBottom: i < chapter.descHe.length - 1 ? 14 : 0,
                    fontFamily: "Inter, var(--font-sans), system-ui, sans-serif",
                    textAlign: "right",
                  }}
                >
                  <RenderBidi text={para} />
                </p>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} dir="ltr">
              {chapter.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.58rem",
                    padding: "3px 9px",
                    borderRadius: 4,
                    background: "#111",
                    border: "1px solid #1e1e1e",
                    color: "#444",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom progress ───────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 28px 20px",
          borderTop: "1px solid #141414",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Era name label */}
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.58rem",
            color: "#2a2a2a",
            letterSpacing: "0.1em",
          }}
        >
          {CHAPTERS[idx].era} ERA
        </span>

        {/* Progress dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {CHAPTERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 22 : 5,
                height: 5,
                borderRadius: 3,
                background: i === idx ? AMBER : i < idx ? "#2a2a2a" : "#1a1a1a",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.52rem",
            color: "#1e1e1e",
            letterSpacing: "0.08em",
          }}
          dir="ltr"
        >
          ← → navigate · ESC close
        </span>
      </div>
    </div>
  );
}
