"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Shield, EyeOff, Zap, Scale, Smartphone, Lock, FileCheck, ShoppingCart, KeyRound } from "lucide-react";

function Ltr({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" className="inline-block">{children}</span>;
}

interface FAQEntry {
  icon: React.ReactNode;
  q: string;
  a: React.ReactNode;
}

const ENTRIES: FAQEntry[] = [
  {
    icon: <Shield size={16} />,
    q: "מה זה זיקאש (Zcash)?",
    a: (
      <span>
        דמיין שביטקוין הוא כמו חשבון בנק שבו כל העולם יכול לראות בדיוק כמה כסף יש לך, למי שלחת וממי קיבלת.
        זה אולי בטוח, אבל זה ממש לא פרטי. <Ltr>Zcash</Ltr> הוא מטבע דיגיטלי שנוצר כדי לפתור בדיוק את הבעיה הזו.
        <br /><br />
        <strong>הפרטיות במרכז: עסקאות מוגנות (<Ltr>Shielded</Ltr>)</strong>
        <br /><br />
        בניגוד לביטקוין, שבו כל היסטוריית העסקאות (כתובות וסכומים) גלויה לכולם, <Ltr>Zcash</Ltr> מאפשרת לבצע עסקאות מוגנות.
        בעסקאות אלו, הפרטים נשארים מוצפנים ואינם חשופים לציבור – המידע נשאר רק בין השולח למקבל.
        <br /><br />
        <strong>הטכנולוגיה: הוכחה באפס ידיעה (<Ltr>Zero-Knowledge Proofs</Ltr>)</strong>
        <br /><br />
        <Ltr>Zcash</Ltr> היא המטבע הראשון שהשתמש בטכנולוגיה פורצת דרך הנקראת <Ltr>zk-SNARKs</Ltr>.
        טכנולוגיה זו מאפשרת לרשת לאמת שהעסקה חוקית — מבלי לחשוף את פרטיה.
        משתמש יכול לבחור לשתף פרטי עסקאות ספציפיים עם צדדים שלישיים (כמו רשויות מס או רואי חשבון)
        באמצעות מפתחות צפייה (<Ltr>Viewing Keys</Ltr>). זה מעניק פרטיות מוחלטת מול העולם,
        אך מאפשר יכולת דיווח ובקרה כשצריך.
      </span>
    ),
  },
  {
    icon: <EyeOff size={16} />,
    q: "מה ההבדל המעשי בין כתובת 'שקופה' לכתובת 'מוגנת'?",
    a: (
      <span>
        בזיקאש יש שני סוגי כתובות:
        <br /><br />
        <strong>כתובת שקופה (<Ltr>t-address</Ltr>):</strong> עובדת בדיוק כמו ביטקוין — כל העולם יכול לראות את היתרה ואת היסטוריית העסקאות.
        <br /><br />
        <strong>כתובת מוגנת (<Ltr>z-address</Ltr>):</strong> משתמשת בטכנולוגיית הפרטיות של המטבע כדי להסתיר את היתרה ופרטי העסקה.
        <br /><br />
        השליטה אצלך: אתה יכול להחזיק כסף בפרטיות מוחלטת, ולשלוח אותו לכתובת שקופה (כמו בורסה) כשצריך.
      </span>
    ),
  },
  {
    icon: <Zap size={16} />,
    q: "האם עסקאות בזיקאש הן יקרות או איטיות?",
    a: (
      <span>
        ממש לא. עמלת העסקה הסטנדרטית בזיקאש היא אפסית (שבריר של אגורה), ללא קשר לסכום שאתה שולח.
        זמן האישור הממוצע הוא כ-75 שניות — ותוצאה אחת ברורה: אתה שולח, והצד השני מקבל. נקודה.
      </span>
    ),
  },
  {
    icon: <Scale size={16} />,
    q: "האם זה חוקי להחזיק זיקאש בישראל?",
    a: (
      <span>
        כן. זיקאש הוא מטבע מבוזר (<Ltr>Decentralized</Ltr>) ואין שום חוק בישראל שאוסר על החזקה או שימוש בו.
        בזכות &lsquo;מפתחות הצפייה&rsquo; (<Ltr>Viewing Keys</Ltr>) שקיימים בפרוטוקול, זיקאש הוא אחד המטבעות
        שהכי קל להצהיר עליהם לרשויות המס ולעבוד איתם בצורה חוקית מול המדינה —
        בזמן שהפרטיות שלך מול שאר העולם נשמרת.
      </span>
    ),
  },
  {
    icon: <Smartphone size={16} />,
    q: "אני צריך מחשב חזק או ידע טכני כדי להשתמש בזה?",
    a: (
      <span>
        לא. בעבר יצירת עסקה חסויה דרשה כוח מחשוב רב, אבל היום ניתן להוריד אפליקציית ארנק לטלפון הנייד
        ולשלוח עסקאות מוגנות תוך שניות בודדות. חוויית המשתמש פשוטה בדיוק כמו בכל אפליקציית תשלום רגילה.
      </span>
    ),
  },
  {
    icon: <Lock size={16} />,
    q: "האם מישהו יכול 'להקפיא' לי את הכסף או לצנזר עסקאות?",
    a: (
      <span>
        לא. אין שום גורם מרכזי — לא בנק, לא חברה, לא ממשלה — שיכול לחסום עסקה בזיקאש.
        הרשת מבוזרת לחלוטין וכל עוד המפתחות הפרטיים אצלך, השליטה על הכסף היא 100% שלך.
      </span>
    ),
  },
  {
    icon: <FileCheck size={16} />,
    q: "אם הכל חסוי, איך אני יכול להוכיח שבאמת שילמתי למישהו?",
    a: (
      <span>
        כאן נכנסת ה&rsquo;הוכחת תשלום&rsquo; (<Ltr>Payment Disclosure</Ltr>).
        למרות שהעסקה חסויה בבלוקצ&rsquo;יין, הארנק שלך מאפשר להפיק אישור דיגיטלי ספציפי לעסקה שביצעת.
        האישור מוכיח ששלחת סכום מסוים לכתובת מסוימת — בלי לחשוף את שאר היתרה שלך
        או את ההיסטוריה הכלכלית שלך. פתרון מושלם ליישוב מחלוקות מול ספקים או לקוחות.
      </span>
    ),
  },
  {
    icon: <ShoppingCart size={16} />,
    q: "איפה קונים זיקאש?",
    a: (
      <span>
        זיקאש זמין כמעט בכל הבורסות הגדולות בעולם (כמו <Ltr>Binance</Ltr>,{" "}
        <Ltr>Kraken</Ltr> או <Ltr>Coinbase</Ltr>). אחרי הקנייה בבורסה, מומלץ מאוד למשוך
        את המטבעות לארנק פרטי משלך (<Ltr>z-address</Ltr>) כדי ליהנות מיכולות הפרטיות המלאות.
      </span>
    ),
  },
  {
    icon: <KeyRound size={16} />,
    q: "מה קורה אם אני מאבד את הטלפון או המחשב?",
    a: (
      <span>
        הכסף שלך לא &lsquo;יושב&rsquo; על המכשיר. בזמן הקמת הארנק תקבל 12 או 24 מילים
        (<Ltr>Seed Phrase</Ltr>). כל עוד המילים האלו שמורות אצלך במקום בטוח,
        תוכל לשחזר את הגישה לכסף שלך מכל מכשיר בעולם תוך דקות.
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
      suppressHydrationWarning
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      style={{
        border: `1px solid ${open ? "#fde68a" : "#e2e8f0"}`,
        borderRadius: 12,
        overflow: "hidden",
        background: "#ffffff",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: open
          ? "0 4px 24px rgba(243,177,50,0.08), 0 1px 4px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 28px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          gap: 16,
        }}
        dir="rtl"
      >
        {/* Icon + Question */}
        <span style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <span
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: 8,
              background: open ? "#fffbeb" : "#f8fafc",
              border: `1px solid ${open ? "#fde68a" : "#e2e8f0"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: open ? "#F3B132" : "#71717a",
              transition: "all 0.2s",
            }}
          >
            {entry.icon}
          </span>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#09090b",
              lineHeight: 1.5,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textAlign: "right",
            }}
          >
            {entry.q}
          </span>
        </span>

        {/* Chevron */}
        <span
          style={{
            flexShrink: 0,
            color: "#a1a1aa",
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
          }}
        >
          <ChevronDown size={18} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "4px 28px 24px 28px",
                paddingRight: 72, /* align with question text (icon width + gap) */
                fontSize: "0.975rem",
                lineHeight: 1.8,
                color: "#52525b",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                borderTop: "1px solid #f1f5f9",
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
    <section id="faq" style={{ backgroundColor: "#fafafa", padding: "112px 0" }}>
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }} dir="rtl">
          <p style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "#F3B132",
            marginBottom: 12,
          }}>
            // FAQ
          </p>
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 700,
            color: "#09090b",
            letterSpacing: "-0.02em",
            marginBottom: 12,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}>
            שאלות נפוצות
          </h2>
          <p style={{
            fontSize: "1.05rem",
            color: "#71717a",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            lineHeight: 1.6,
          }}>
            תשובות ישירות, ללא שיווק.
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
