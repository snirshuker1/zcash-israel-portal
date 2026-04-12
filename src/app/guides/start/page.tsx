'use client'
import { useState } from 'react'
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
}: {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  const Icon = item.icon
  return (
    <div
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
          padding: '18px 20px',
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
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#09090B',
              textAlign: 'right',
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
                padding: '4px 20px 22px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
        <p style={{ margin: 0 }}>
          <Ltr>Bitcoin</Ltr> ו-<Ltr>Ethereum</Ltr> הם <strong>שקופים לחלוטין</strong> — כל
          אחד עם גישה לאינטרנט יכול לראות את כל ההיסטוריה הפיננסית שלך, הרכישות שלך, ממי
          קיבלת ולמי שלחת.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            "כל עסקה שלך מאוחסנת לנצח על הבלוקצ'יין ונגישה לכל",
            'בורסות יכולות לחסום כספים בהתבסס על היסטוריית עסקאות',
            'גורמים עוינים יכולים לזהות יעדי תשלום ולמפות רשת קשרים',
            'פרסומאים ועסקים מבצעים פרופיילינג פיננסי מפורט',
          ].map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span
                style={{ color: '#EF4444', marginTop: 1, flexShrink: 0, fontWeight: 600 }}
              >
                ✕
              </span>
              <span style={{ fontSize: '0.85rem', color: '#71717A' }}>{point}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: '1px solid #E4E4E7',
            paddingTop: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {[
            'פרטיות ברמת הפרוטוקול — לא תוסף, לא שכבה שנייה',
            'הסכום, השולח והמקבל מוגנים כברירת מחדל',
            'ניתן לחשוף נתונים רצוניים עם Viewing Keys לצרכי ציות',
          ].map((point, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: AMBER, marginTop: 1, flexShrink: 0, fontWeight: 600 }}>
                ✓
              </span>
              <span style={{ fontSize: '0.85rem', color: '#71717A' }}>{point}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          <Ltr>Zcash</Ltr> פותר את הבעיות הללו ברמת הפרוטוקול — כחלק מהיסוד המתמטי של כל
          עסקה, באמצעות <Ltr>zk-SNARKs</Ltr> ועדכון <Ltr>Halo 2</Ltr>.
        </p>
      </div>
    ),
  },
  {
    value: 'wallet',
    icon: BookOpen,
    question: (
      <>
        כיצד לפתוח ארנק <Ltr>Zodl</Ltr>?
      </>
    ),
    answer: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
        <p style={{ margin: 0 }}>
          <Ltr>Zodl</Ltr> הוא ארנק הנייד הרשמי של <Ltr>Zcash</Ltr>. הוא מספק ממשק פשוט ומאובטח לניהול כספים בצורה
          מוגנת מלאה ברמת הפרוטוקול.
        </p>
        <ol
          style={{
            paddingRight: 20,
            paddingLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            margin: 0,
          }}
        >
          {[
            <>
              הורד את <Ltr>Zodl</Ltr> מ-<Ltr>App Store</Ltr> או <Ltr>Google Play</Ltr>
            </>,
            <>
              בחר &quot;ארנק חדש&quot; וכתוב את ה-<Ltr>seed phrase</Ltr> (12 מילים) במקום בטוח
              ומנותק מהאינטרנט — עדיף על נייר
            </>,
            <>
              המתן לסנכרון הרשת — עשוי להימשך מספר דקות בהתאם לגיל הארנק
            </>,
            <>
              ארנקך מוכן. כתובת <Ltr>Z-address</Ltr> (מתחילה ב-<Ltr>u1</Ltr>) מאפשרת עסקאות
              מוגנות מלאות
            </>,
          ].map((step, i) => (
            <li key={i} style={{ paddingRight: 4 }}>
              {step}
            </li>
          ))}
        </ol>
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #F3B13230',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#71717A',
          }}
        >
          <strong style={{ color: '#09090B' }}>חשוב:</strong> אל תשמור את ה-
          <Ltr>seed phrase</Ltr> בענן, בצילום מסך, או בדוא&quot;ל. מי שמחזיק ב-
          <Ltr>seed phrase</Ltr> שולט בכספים.
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
          <GetZecBlock
            title="למתקדמים (אנונימיות מלאה):"
            text={
              <>
                קנייה ישירה מאנשים אחרים (<Ltr>P2P</Ltr>) או קבלת <Ltr>ZEC</Ltr> כתשלום על
                שירותים.
              </>
            }
            cta={
              <>
                איך לקבל <Ltr>ZEC</Ltr> באופן פרטי
              </>
            }
            href="/guides/receive-privately"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 14 }}>
        <p style={{ margin: 0 }}>
          עסקאות מוגנות (<Ltr>Shielded Transactions</Ltr>) מסתירות את הסכום, כתובת השולח
          וכתובת המקבל מכל צופה ברשת — תוך כדי אימות מתמטי מלא של תקינותן באמצעות{' '}
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
          }}
        >
          {[
            <>
              בתוך <Ltr>Zodl</Ltr>, לחץ &quot;שלח&quot;
            </>,
            <>
              הכנס את כתובת ה-<Ltr>Z-address</Ltr> של הנמען (מתחילה ב-<Ltr>u1</Ltr> עבור{' '}
              <Ltr>Unified Address</Ltr>)
            </>,
            <>
              הגדר סכום ו-<Ltr>memo</Ltr> אופציונלי — ה-<Ltr>memo</Ltr> מוצפן ואינו גלוי לצד
              שלישי
            </>,
            <>
              אשר — <Ltr>Zodl</Ltr> ייצור הוכחת <Ltr>zk-SNARK</Ltr> אוטומטית ויחתום את
              העסקה
            </>,
          ].map((step, i) => (
            <li key={i} style={{ paddingRight: 4 }}>
              {step}
            </li>
          ))}
        </ol>
        <div
          style={{
            backgroundColor: '#F4F4F5',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#71717A',
          }}
        >
          <strong style={{ color: '#09090B' }}>שים לב:</strong> אם הנמען שולח לך כתובת{' '}
          <Ltr>T-address</Ltr> (שקופה), העסקה תהיה גלויה לכולם — כמו ב-<Ltr>Bitcoin</Ltr>.
          תמיד בקש <Ltr>Z-address</Ltr> לפרטיות מלאה.
        </div>
      </div>
    ),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidesStartPage() {
  const [openItem, setOpenItem] = useState<string | null>('matters')

  const toggle = (value: string) =>
    setOpenItem((prev) => (prev === value ? null : value))

  return (
    <>
      <main style={{ paddingTop: 72, minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
        {/* Page hero */}
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderBottom: '1px solid #E4E4E7',
            padding: '52px 24px 48px',
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

            <span
              dir="ltr"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '0.65rem',
                color: '#A1A1AA',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              USER_GUIDES
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
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
                fontSize: '0.95rem',
                maxWidth: 480,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              מדריכים שלב-אחר-שלב לארנק <Ltr>Zodl</Ltr>, עסקאות מוגנות, וההיגיון מאחורי
              פרטיות ברמת הפרוטוקול.
            </p>
          </div>
        </div>

        {/* Accordion section */}
        <div style={{ padding: '60px 24px 80px' }}>
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
              />
            ))}
          </div>

          {/* Premium CTA card */}
          <div
            style={{
              maxWidth: 760,
              margin: '56px auto 0',
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
                <span
                  dir="ltr"
                  style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.65rem',
                    color: AMBER,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  NEXT_STEP
                </span>
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
                    padding: '13px 22px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    border: `1px solid #09090B`,
                    transition: 'transform 0.18s ease, background-color 0.18s',
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
