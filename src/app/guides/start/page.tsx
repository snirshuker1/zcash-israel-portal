'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ChevronDown,
  BookOpen,
  Shield,
  Zap,
  ArrowRight,
  ArrowLeft,
  Coins,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Footer from '@/components/Footer'

const AMBER = '#F3B132'

function Ltr({ children }: { children: React.ReactNode }) {
  return (
    <span dir="ltr" className="inline-block">
      {children}
    </span>
  )
}

// ─── Accordion ───────────────────────────────────────────────────────────────

interface AccordionItem {
  value: string
  icon: React.ElementType
  question: React.ReactNode
  answer: React.ReactNode
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  registerRef,
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  registerRef: (el: HTMLDivElement | null) => void
}) {
  const Icon = item.icon
  return (
    <div
      ref={registerRef}
      style={{
        border: `1px solid ${isOpen ? '#F3B13240' : '#E4E4E7'}`,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: 'clamp(16px, 3.2vw, 20px) clamp(16px, 3.6vw, 22px)',
          minHeight: 60,
          backgroundColor: isOpen ? '#FFFBEB' : '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          textAlign: 'right',
          transition: 'background-color 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: isOpen ? '#FEF3C7' : '#F4F4F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s',
            }}
          >
            <Icon size={15} color={isOpen ? AMBER : '#71717A'} />
          </div>
          <span
            style={{
              fontSize: 'clamp(0.9rem, 2.4vw, 0.98rem)',
              fontWeight: 600,
              color: '#09090B',
              textAlign: 'right',
              lineHeight: 1.35,
            }}
          >
            {item.question}
          </span>
        </div>
        <ChevronDown
          size={16}
          color="#A1A1AA"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s',
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '6px clamp(16px, 3.6vw, 22px) clamp(18px, 4vw, 24px)',
                fontSize: '0.875rem',
                color: '#71717A',
                lineHeight: 1.75,
                borderTop: '1px solid #F4F4F5',
              }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Content ─────────────────────────────────────────────────────────────────

// Shared styles for the "איך משיגים ZEC" blocks
const GetZecBlock = ({
  title,
  text,
  cta,
  href,
}: {
  title: React.ReactNode
  text: React.ReactNode
  cta: React.ReactNode
  href: string
}) => (
  <div
    style={{
      border: '1px solid #E4E4E7',
      borderRadius: 10,
      padding: '18px 20px',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <h4
      style={{
        margin: 0,
        fontSize: '0.92rem',
        fontWeight: 700,
        color: '#09090B',
        lineHeight: 1.4,
      }}
    >
      {title}
    </h4>
    <p
      style={{
        margin: 0,
        fontSize: '0.85rem',
        color: '#71717A',
        lineHeight: 1.7,
      }}
    >
      {text}
    </p>
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
        fontSize: '0.8rem',
        fontWeight: 600,
        color: AMBER,
        textDecoration: 'none',
        alignSelf: 'flex-start',
        padding: '4px 0',
        transition: 'gap 0.18s ease',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = '10px')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = '6px')}
    >
      <span>{cta}</span>
      <ArrowLeft size={14} />
    </Link>
  </div>
)

const items: AccordionItem[] = [
  {
    value: 'matters',
    icon: Zap,
    question: 'למה זה חשוב?',
    answer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.4,
            }}
          >
            החזון: מזומן דיגיטלי אמיתי
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.75 }}>
            החזון המקורי של יוצר הביטקוין, סאטושי נאקאמוטו, היה ליצור רשת שמתנהגת כמו מזומן
            פיזי. בפועל, ביטקוין נבנה כיומן פומבי ושקוף לחלוטין – המשמעות היא שכל ההיסטוריה
            הפיננסית, היתרה והעסקאות שלכם גלויות לעיני כל.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.4,
            }}
          >
            הפתרון של <Ltr>Zcash</Ltr>: פרטיות מתמטית
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.75 }}>
            <Ltr>Zcash</Ltr> נוצר כדי לתקן את הפגם הזה ולהגשים את חזון המזומן הדיגיטלי.
            באמצעות פריצת דרך הצפנתית (<Ltr>zk-SNARKs</Ltr>), הרשת מאמתת עסקאות בצורה
            מאובטחת, מבלי לחשוף את זהות השולח, המקבל או את הסכום.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.4,
            }}
          >
            שליטה מלאה (<Ltr>Opt-in</Ltr>)
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.75 }}>
            הפרטיות ב-<Ltr>Zcash</Ltr> היא ברירת מחדל ברמת הפרוטוקול, לא תוסף חיצוני. עם
            זאת, במידת הצורך (למשל דיווחי מס או ביקורת), המערכת מאפשרת לכם לשתף מידע ספציפי
            באופן רצוני לחלוטין באמצעות מפתחות צפייה (<Ltr>Viewing Keys</Ltr>).
          </p>
        </div>
      </div>
    ),
  },
  {
    value: 'open-wallet',
    icon: BookOpen,
    question: (
      <>
        כיצד לפתוח ארנק <Ltr>Zodl</Ltr>?
      </>
    ),
    answer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 14 }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.75 }}>
          <Ltr>Zodl</Ltr> הוא הארנק הנייד המומלץ עבור <Ltr>Zcash</Ltr>. הוא מספק ממשק פשוט,
          נקי ומאובטח לניהול הכספים שלכם, עם תמיכה מלאה בפרטיות ברמת הפרוטוקול.
        </p>
        <ol
          style={{
            paddingRight: 20,
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            margin: 0,
            fontSize: '0.875rem',
            color: '#1e293b',
            lineHeight: 1.75,
          }}
        >
          <li style={{ paddingRight: 4 }}>
            הורידו את אפליקציית <Ltr>Zodl</Ltr> מחנות האפליקציות (<Ltr>App Store</Ltr> או{' '}
            <Ltr>Google Play</Ltr>).
          </li>
          <li style={{ paddingRight: 4 }}>
            בחרו באפשרות &quot;יצירת ארנק חדש&quot; (<Ltr>Create New Wallet</Ltr>).
          </li>
          <li style={{ paddingRight: 4 }}>
            גבו את מילות השחזור: האפליקציה תציג לכם 12 מילים. כתבו אותן על דף נייר ושמרו
            במקום בטוח.{' '}
            <strong style={{ color: '#09090B' }}>כלל ברזל:</strong> אל תשמרו את המילים בענן,
            בצילום מסך או בדוא&quot;ל. מי שמחזיק במילים – מחזיק בכסף.
          </li>
          <li style={{ paddingRight: 4 }}>
            המתינו לסנכרון הרשת – תהליך ראשוני שעשוי לקחת מספר דקות.
          </li>
          <li style={{ paddingRight: 4 }}>
            הארנק מוכן! כעת יש לכם כתובת לקבלת כספים (כתובות מאוחדות ופרטיות ב-
            <Ltr>Zcash</Ltr> יתחילו לרוב באותיות <Ltr>u</Ltr> או <Ltr>z</Ltr>).
          </li>
        </ol>
        {/* Premium highlight — Shielded Address power */}
        <div
          style={{
            backgroundColor: '#0D0D0D',
            border: `1px solid ${AMBER}30`,
            borderTop: `2px solid ${AMBER}`,
            borderRadius: 10,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.8rem',
              fontWeight: 700,
              color: AMBER,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            <Ltr>Shielded Address</Ltr>
          </p>
          <h4
            style={{
              margin: 0,
              fontSize: '0.975rem',
              fontWeight: 700,
              color: '#F5F5F5',
              lineHeight: 1.4,
            }}
          >
            העוצמה של הכתובת המוגנת
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.8 }}>
            ברגע שמישהו שולח לכם <Ltr>ZEC</Ltr> לכתובת המוגנת (המתחילה ב-<Ltr>u1</Ltr> או{' '}
            <Ltr>z</Ltr>), קורה דבר מדהים: הכסף עובר תהליך של &quot;הגנה&quot; (
            <Ltr>Shielding</Ltr>).
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.8 }}>
            עבור שאר העולם, הכסף פשוט{' '}
            <strong style={{ color: '#F5F5F5' }}>נעלם מהרדאר</strong>. מהרגע שהסכום נחת
            בארנק ה-<Ltr>Zodl</Ltr> שלכם, לאף אחד בעולם – כולל זה ששלח לכם את הכסף – אין
            שום דרך לדעת מה היתרה שלכם, ממי עוד קיבלתם כסף, או מה אתם עושים איתו הלאה.
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#A1A1AA', lineHeight: 1.8 }}>
            זה לא סתם ארנק דיגיטלי, זה{' '}
            <strong style={{ color: '#F5F5F5' }}>כספת מתמטית חסינה</strong>. אתם הופכים
            להיות היחידים בעולם שרואים את הנתונים הללו. זו הפרטיות המוחלטת שסאטושי חלם
            עליה, והיא נמצאת אצלכם בכיס.
          </p>
        </div>
        {/* Caution — transparent addresses */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            padding: '10px 14px',
            backgroundColor: '#FAFAFA',
            border: '1px solid #E4E4E7',
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: '0.8rem', flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p
              style={{
                margin: 0,
                fontSize: '0.775rem',
                fontWeight: 700,
                color: '#52525B',
                lineHeight: 1.4,
              }}
            >
              שימו לב לכתובות שקופות (<Ltr>Transparent</Ltr>)
            </p>
            <p style={{ margin: 0, fontSize: '0.775rem', color: '#71717A', lineHeight: 1.7 }}>
              אם תבחרו להשתמש בכתובת שקופה (המתחילה ב-<Ltr>t</Ltr>), חשוב לדעת שהיא עובדת
              בדיוק כמו ב-<Ltr>Bitcoin</Ltr>: היתרה וההיסטוריה של אותה כתובת גלויות לכולם.
              היא נועדה בעיקר לצרכי תאימות מול בורסות ישנות. לפרטיות אמיתית — תמיד
              השתמשו בכתובת המוגנת שלכם.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'get-zec',
    icon: Coins,
    question: (
      <>
        איך משיגים <Ltr>ZEC</Ltr>?
      </>
    ),
    answer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 14 }}>
        <p style={{ margin: 0 }}>
          קיימות מספר דרכים מרכזיות להשגת <Ltr>ZEC</Ltr>, בהתאם לנקודת הפתיחה שלכם:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <GetZecBlock
            title="למשתמשים מתחילים (קנייה בכסף רגיל):"
            text={
              <>
                רכישה באמצעות בורסות בינלאומיות או חלפנים מקומיים. דורש תהליך הרשמה קצר,
                ולאחריו משיכת המטבעות לארנק ה-<Ltr>Zodl</Ltr>.
              </>
            }
            cta="למדריך הקנייה בבורסה"
            href="/guides/buy-exchange"
          />
          <GetZecBlock
            title="למחזיקי קריפטו (המרה מהירה ללא זיהוי):"
            text={
              <>
                אם יש ברשותכם מטבעות אחרים (כמו <Ltr>USDT</Ltr>, ביטקוין או אתריום), הדרך
                החלקה ביותר היא להמיר אותם ישירות ל-<Ltr>ZEC</Ltr> באמצעות{' '}
                <Ltr>NEAR Intents</Ltr>.
              </>
            }
            cta={
              <>
                למדריך ההמרה ב-<Ltr>NEAR Intents</Ltr>
              </>
            }
            href="/guides/near-intents"
          />
        </div>
      </div>
    ),
  },
  {
    value: 'shielded',
    icon: Shield,
    question: 'שליחת עסקאות מוגנות',
    answer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 14 }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.75 }}>
          עסקאות מוגנות (<Ltr>Shielded Transactions</Ltr>) מסתירות את הסכום, כתובת השולח
          וכתובת המקבל מכל צופה ברשת — תוך שמירה על אימות מתמטי מלא באמצעות הוכחות{' '}
          <Ltr>zk-SNARKs</Ltr>.
        </p>
        <ol
          style={{
            paddingRight: 20,
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            margin: 0,
            fontSize: '0.875rem',
            color: '#1e293b',
            lineHeight: 1.75,
          }}
        >
          <li style={{ paddingRight: 4 }}>
            בתוך אפליקציית <Ltr>Zodl</Ltr>, לחצו על כפתור השליחה (<Ltr>Send</Ltr>).
          </li>
          <li style={{ paddingRight: 4 }}>הדביקו את כתובת הנמען.</li>
          <li style={{ paddingRight: 4 }}>
            הגדירו את הסכום שתרצו להעביר. תוכלו גם להוסיף הערה (<Ltr>Memo</Ltr>) אופציונלית
            – ההערה מוצפנת לחלוטין וגלויה אך ורק לנמען.
          </li>
          <li style={{ paddingRight: 4 }}>
            אשרו את העסקה. הארנק ייצור הוכחת פרטיות באופן אוטומטי מאחורי הקלעים וישגר את
            העסקה.
          </li>
        </ol>
        <div
          style={{
            borderRight: `3px solid #E4E4E7`,
            paddingRight: 14,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            backgroundColor: '#FAFAFA',
            borderRadius: '0 6px 6px 0',
          }}
        >
          <p
            style={{
              margin: '0 0 6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#09090B',
              lineHeight: 1.4,
            }}
          >
            מה קורה כששולחים לכתובת שקופה?
          </p>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#52525B', lineHeight: 1.7 }}>
            לעיתים תצטרכו לשלוח <Ltr>ZEC</Ltr> לכתובת שקופה (כתובת שמתחילה באות{' '}
            <Ltr>t</Ltr>, למשל בהפקדה לבורסה). במקרה כזה, כתובת היעד והסכום יהיו גלויים
            ברשת.{' '}
            <strong style={{ color: '#09090B' }}>אבל הנה היתרון העצום:</strong> הפרטיות שלכם
            כיוזמי העסקה נשמרת. היתרה בארנק שלכם, היסטוריית הפעולות שלכם והכתובת הפרטית
            שלכם נשארים חסויים לחלוטין. איש לא יוכל לעקוב אחורה אל הארנק שלכם או לדעת כמה
            כסף יש לכם.
          </p>
        </div>
      </div>
    ),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

function GuidesStartPageContent() {
  const searchParams = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const initialTab =
    requestedTab && items.some((item) => item.value === requestedTab)
      ? requestedTab
      : 'matters'

  const [openItem, setOpenItem] = useState<string | null>(initialTab)

  const toggle = (value: string) =>
    setOpenItem((prev) => (prev === value ? null : value))

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const isInitialMount = useRef(true)

  // Wait for the 0.25s expand/collapse to settle before scrolling so we land on the final layout, not a mid-animation one.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (!openItem) return

    const timeoutId = window.setTimeout(() => {
      const el = itemRefs.current[openItem]
      if (!el) return
      const prefersReduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const HEADER_OFFSET = 80
      const targetY =
        el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({
        top: Math.max(targetY, 0),
        behavior: prefersReduced ? 'auto' : 'smooth',
      })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [openItem])

  return (
    <>
      <main style={{ paddingTop: 72, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        {/* Page hero */}
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderBottom: '1px solid #E4E4E7',
            padding:
              'clamp(40px, 7vw, 64px) clamp(20px, 5vw, 32px) clamp(36px, 6vw, 56px)',
          }}
        >
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 20,
                direction: 'ltr',
              }}
            >
              <Link
                href="/"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.7rem',
                  color: '#A1A1AA',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = AMBER)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#A1A1AA')
                }
              >
                <ArrowRight size={12} />
                HOME
              </Link>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.7rem',
                  color: '#E4E4E7',
                }}
              >
                /
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.7rem',
                  color: '#71717A',
                  letterSpacing: '0.06em',
                }}
              >
                GUIDES
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.6rem, 4.6vw, 2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#09090B',
                marginBottom: 12,
                lineHeight: 1.2,
              }}
            >
              מדריכים למשתמש
            </h1>
            <p
              style={{
                color: '#71717A',
                fontSize: 'clamp(0.9rem, 2.4vw, 0.975rem)',
                maxWidth: 520,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              מדריכים שלב-אחר-שלב לארנק <Ltr>Zodl</Ltr>, עסקאות מוגנות, וההיגיון מאחורי
              פרטיות ברמת הפרוטוקול.
            </p>
          </div>
        </div>

        {/* Accordion section */}
        <div
          style={{
            padding:
              'clamp(44px, 7vw, 72px) clamp(20px, 5vw, 32px) clamp(60px, 9vw, 96px)',
          }}
        >
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {items.map((item) => (
              <AccordionItem
                key={item.value}
                item={item}
                isOpen={openItem === item.value}
                onToggle={() => toggle(item.value)}
                registerRef={(el) => {
                  itemRefs.current[item.value] = el
                }}
              />
            ))}
          </div>

          {/* Premium CTA card */}
          <div
            style={{
              maxWidth: 760,
              margin: 'clamp(40px, 6vw, 64px) auto 0',
              position: 'relative',
              border: '1px solid #E4E4E7',
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(9, 9, 11, 0.04)',
            }}
          >
            {/* top amber hairline */}
            <div
              style={{
                height: 3,
                width: '100%',
                background: `linear-gradient(90deg, transparent 0%, ${AMBER} 50%, transparent 100%)`,
              }}
            />
            <div
              style={{
                padding: 'clamp(28px, 4vw, 44px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  maxWidth: 560,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 'clamp(1.35rem, 2.6vw, 1.75rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#09090B',
                    lineHeight: 1.25,
                  }}
                >
                  הזמן לעבור לכלכלה פרטית
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: '#71717A',
                    lineHeight: 1.7,
                  }}
                >
                  מוכנים לרכוש <Ltr>ZEC</Ltr>? המירו מטבעות דיגיטליים קיימים ל-
                  <Ltr>Zcash</Ltr> ישירות לארנק שלכם, ללא תהליכי הרשמה ובתעריפים המשתלמים
                  ביותר.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a
                  href="https://near-intents.org/?from=USDT&to=ZEC"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: '#09090B',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    padding: '14px 22px',
                    minHeight: 48,
                    borderRadius: 10,
                    textDecoration: 'none',
                    border: `1px solid #09090B`,
                    transition: 'background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = AMBER
                    el.style.borderColor = AMBER
                    el.style.color = '#09090B'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = '#09090B'
                    el.style.borderColor = '#09090B'
                    el.style.color = '#FFFFFF'
                  }}
                >
                  <span>
                    פתח את <Ltr>NEAR Intents</Ltr>
                  </span>
                  <ArrowLeft size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function GuidesStartPage() {
  return (
    <Suspense fallback={null}>
      <GuidesStartPageContent />
    </Suspense>
  )
}
