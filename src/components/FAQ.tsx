"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const AMBER = "#F3B132";

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

interface FAQEntry {
  q: string;
  a: React.ReactNode;
}

const ENTRIES: FAQEntry[] = [
  {
    q: "מהם מפתחות צפייה (Viewing Keys) וכיצד הם מאפשרים ציות לרשויות המס בישראל?",
    a: (
      <span>
        <Ltr>Viewing Key</Ltr> הוא מפתח קריאה בלבד שניתן להפיק מהארנק שלך.
        הוא מאפשר לצד שלישי — כגון רואה חשבון או פקיד רשות המסים — לצפות בכל
        היסטוריית העסקאות הנכנסות והיוצאות, <strong>מבלי</strong> שתיתן לו גישה
        לכספים עצמם. כך תוכל לעמוד בדרישות הדיווח הישראליות תוך שמירה מלאה על
        פרטיותך מול כל גורם אחר. זו פרטיות <em>סלקטיבית</em> — לא אנונימיות
        מוחלטת.
      </span>
    ),
  },
  {
    q: "מה ההבדל הטכני בין Zcash ל-Monero?",
    a: (
      <span>
        <Ltr>Zcash</Ltr> משתמשת ב-<Ltr>zk-SNARKs</Ltr> — הוכחות מתמטיות
        שמאמתות עסקה מבלי לחשוף <em>כל</em> מידע לגביה. הפרטיות היא{" "}
        <strong>מוכחת מתמטית</strong>: בלתי אפשרי לחשוף נתונים ללא המפתח
        הנכון. <Ltr>Monero</Ltr> משתמשת ב-<Ltr>Ring Signatures</Ltr> — טכניקת
        ערפול שמערבבת את העסקה שלך עם עסקאות של משתמשים אחרים. הפרטיות שם היא{" "}
        <strong>הסתברותית</strong>, לא מוכחת. עם מספיק נתוני שרשרת, ניתן
        להצר את הסבירות. ב-<Ltr>Zcash</Ltr> — אי אפשר.
      </span>
    ),
  },
  {
    q: "מה זה zk-SNARKs ולמה זה הכי חשוב בקריפטו?",
    a: (
      <span>
        <Ltr>zk-SNARKs</Ltr> הם ראשי תיבות של{" "}
        <Ltr>Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge</Ltr>
        . בעברית פשוטה: הוכחה מתמטית שמאפשרת לך להוכיח שאתה יודע משהו — מבלי
        לחשוף מה אתה יודע. ב-<Ltr>Zcash</Ltr>, כל עסקה מוגנת כוללת הוכחת{" "}
        <Ltr>zk-SNARK</Ltr> שמאמתת: (א) אין כפל הוצאה, (ב) יש מספיק יתרה,
        (ג) העסקה חתומה כראוי — הכל מבלי לחשוף כתובות, סכומים, או זהויות.
        זו לא הצפנה רגילה; זו מתמטיקה ברמת ההוכחה.
      </span>
    ),
  },
  {
    q: "למה בדיוק 21,000,000 ZEC? מה קורה אחרי?",
    a: (
      <span>
        כמו ב-<Ltr>Bitcoin</Ltr>, אספקת ה-<Ltr>ZEC</Ltr> מוגבלת ל-
        <Ltr>
          <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 600 }}>
            21,000,000
          </span>
        </Ltr>{" "}
        מטבעות. מגבלה זו מוצפנת בקוד הפרוטוקול עצמו ואינה ניתנת לשינוי ללא
        קונצנזוס רשתי מוחלט — שאינו יכול להתרחש ללא הסכמת כל המשתתפים.
        הנפקת מטבעות מאטה כל ארבע שנים (Halving), עד שתגיע לאספקה מקסימלית.
        אחרי כן, כורים יתוגמלו אך ורק מעמלות עסקאות. זו נדירות אמיתית,
        קריפטוגרפית — בניגוד לכסף פיאט שניתן להדפסה ללא הגבלה.
      </span>
    ),
  },
];

function FAQItem({ entry, index }: { entry: FAQEntry; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        border: `1px solid ${open ? AMBER + "40" : "#e4e4e7"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.25s",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: open ? "#fffbeb" : "#ffffff",
          border: "none",
          cursor: "pointer",
          textAlign: "right",
          gap: 12,
          transition: "background 0.2s",
        }}
        dir="rtl"
      >
        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "#09090b",
            lineHeight: 1.5,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {entry.q}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: open ? AMBER : "#f4f4f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          {open ? (
            <Minus size={12} color="#09090b" />
          ) : (
            <Plus size={12} color="#71717a" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 20px 18px",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                color: "#52525b",
                fontFamily: "Inter, system-ui, sans-serif",
                borderTop: "1px solid #f4f4f5",
                paddingTop: 16,
              }}
              dir="rtl"
            >
              {entry.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" style={{ backgroundColor: "#fafafa", padding: "96px 0" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }} dir="rtl">
          <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: AMBER, marginBottom: 12 }}>
            // TECHNICAL_FAQ
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 700, color: "#09090b", letterSpacing: "-0.02em", marginBottom: 12, fontFamily: "Inter, system-ui, sans-serif" }}>
            שאלות טכניות
          </h2>
          <p style={{ fontSize: "1rem", color: "#71717a", fontFamily: "Inter, system-ui, sans-serif" }}>
            תשובות ישירות, ללא שיווק. רק מתמטיקה ופרוטוקול.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ENTRIES.map((entry, i) => (
            <FAQItem key={i} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
