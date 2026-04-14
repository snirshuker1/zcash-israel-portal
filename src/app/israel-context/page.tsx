'use client'
import type { ReactNode } from 'react'
import {
  ArrowRight,
  AlertTriangle,
  Info,
  ExternalLink,
  MapPin,
  Scale,
  Newspaper,
  Shield,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Footer from '@/components/Footer'

const AMBER = '#F3B132'

function Ltr({ children }: { children: ReactNode }) {
  return (
    <span dir="ltr" className="inline-block">
      {children}
    </span>
  )
}

// ─── Alert ────────────────────────────────────────────────────────────────────

function Alert({
  title,
  tone = 'info',
  children,
}: {
  title: string
  tone?: 'info' | 'warn'
  children: ReactNode
}) {
  const palette =
    tone === 'warn'
      ? {
          border: '1px solid rgba(243,177,50,0.35)',
          background:
            'linear-gradient(180deg, rgba(254,243,199,0.55) 0%, rgba(255,251,235,0.9) 100%)',
          icon: <AlertTriangle size={16} color={AMBER} />,
        }
      : {
          border: '1px solid #E4E4E7',
          background: '#FAFAFA',
          icon: <Info size={16} color="#71717A" />,
        }

  return (
    <div
      role="alert"
      style={{
        border: palette.border,
        background: palette.background,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 2 }}>{palette.icon}</span>
      <div>
        <p
          style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#09090B',
            marginBottom: 6,
          }}
        >
          {title}
        </p>
        <div style={{ fontSize: '0.82rem', color: '#52525B', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Exchange card (dark) ─────────────────────────────────────────────────────

interface Exchange {
  name: string
  type: string
  badges: ReactNode[]
  note: string
  href: string
  highlight?: boolean
}

function Badge({
  children,
  accent = false,
}: {
  children: ReactNode
  accent?: boolean
}) {
  return (
    <span
      style={{
        fontSize: '0.58rem',
        fontFamily: 'var(--font-mono), monospace',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: 999,
        border: accent
          ? '1px solid rgba(243,177,50,0.5)'
          : '1px solid #3F3F46',
        color: accent ? AMBER : '#D4D4D8',
        backgroundColor: accent ? 'rgba(243,177,50,0.08)' : 'rgba(39,39,42,0.6)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

function ExchangeCard({ exchange }: { exchange: Exchange }) {
  return (
    <a
      href={exchange.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          position: 'relative',
          border: exchange.highlight
            ? '1px solid rgba(243,177,50,0.45)'
            : '1px solid #27272A',
          borderRadius: 14,
          padding: '18px 20px',
          backgroundColor: 'rgba(24,24,27,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition:
            'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
          boxShadow: exchange.highlight
            ? '0 0 0 1px rgba(243,177,50,0.08), 0 10px 40px -20px rgba(243,177,50,0.35)'
            : '0 1px 0 rgba(255,255,255,0.02) inset',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = AMBER
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow =
            '0 0 0 1px rgba(243,177,50,0.12), 0 18px 50px -22px rgba(243,177,50,0.45)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = exchange.highlight
            ? 'rgba(243,177,50,0.45)'
            : '#27272A'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = exchange.highlight
            ? '0 0 0 1px rgba(243,177,50,0.08), 0 10px 40px -20px rgba(243,177,50,0.35)'
            : '0 1px 0 rgba(255,255,255,0.02) inset'
        }}
      >
        {exchange.highlight && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(120% 60% at 100% 0%, rgba(243,177,50,0.08) 0%, transparent 55%)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6,
                flexWrap: 'wrap',
              }}
            >
              <span
                dir="ltr"
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#FAFAFA',
                  letterSpacing: '-0.01em',
                }}
              >
                {exchange.name}
              </span>
              <span
                dir="ltr"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.6rem',
                  color: '#71717A',
                  letterSpacing: '0.06em',
                }}
              >
                {exchange.type}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: 10,
              }}
            >
              {exchange.badges.map((b, i) => (
                <Badge key={i} accent={exchange.highlight && i === 0}>
                  {b}
                </Badge>
              ))}
            </div>

            <p
              style={{
                fontSize: '0.82rem',
                color: '#A1A1AA',
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {exchange.note}
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 8,
              border: '1px solid #27272A',
              backgroundColor: 'rgba(9,9,11,0.6)',
            }}
          >
            <ExternalLink size={14} color="#A1A1AA" />
          </div>
        </div>
      </div>
    </a>
  )
}

// ─── Timeline entry ───────────────────────────────────────────────────────────

interface Update {
  date: string
  source: 'ZF' | 'ECC' | 'ZCAP'
  title: string
  summary: string
  href: string
}

function TimelineItem({
  update,
  index,
  isLast,
}: {
  update: Update
  index: number
  isLast: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        display: 'flex',
        gap: 18,
        paddingBottom: isLast ? 0 : 34,
        position: 'relative',
      }}
    >
      {/* Rail column */}
      <div
        style={{
          position: 'relative',
          width: 14,
          flexShrink: 0,
        }}
      >
        {/* Line segment extending into the next item's gap */}
        {!isLast && (
          <div
            style={{
              position: 'absolute',
              right: 6,
              top: 16,
              bottom: -18,
              width: 1.5,
              background:
                'linear-gradient(180deg, #27272A 0%, rgba(39,39,42,0.35) 100%)',
            }}
          />
        )}
        {/* Marker */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 6,
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#09090B',
            border: `1.5px solid ${AMBER}`,
            boxShadow:
              '0 0 0 3px rgba(243,177,50,0.1), 0 0 18px -4px rgba(243,177,50,0.45)',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            dir="ltr"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.65rem',
              color: '#FAFAFA',
              letterSpacing: '0.08em',
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: '#18181B',
              border: '1px solid #27272A',
              fontWeight: 600,
            }}
          >
            {update.date}
          </span>
          <span
            dir="ltr"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.58rem',
              color: AMBER,
              backgroundColor: 'rgba(243,177,50,0.1)',
              border: '1px solid rgba(243,177,50,0.3)',
              padding: '2px 7px',
              borderRadius: 4,
              letterSpacing: '0.1em',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            SOURCE · {update.source}
          </span>
        </div>

        <a
          href={update.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#FAFAFA',
            textDecoration: 'none',
            lineHeight: 1.4,
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 6,
            letterSpacing: '-0.01em',
            marginBottom: 6,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = AMBER)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '#FAFAFA')
          }
        >
          {update.title}
          <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 4 }} />
        </a>
        <p
          style={{
            fontSize: '0.84rem',
            color: '#A1A1AA',
            margin: 0,
            lineHeight: 1.7,
          }}
        >
          {update.summary}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const exchanges: Exchange[] = [
  {
    name: 'Near Intents',
    type: 'Decentralized Swap',
    badges: [
      'מומלץ לפרטיות',
      <>
        מבוזר (<Ltr>DEX</Ltr>)
      </>,
      <>
        ללא <Ltr>KYC</Ltr>
      </>,
    ],
    note: 'החלפה מבוזרת ישירות מארנק לארנק — ללא חשבון, ללא KYC. הדרך המהירה והפרטית ביותר להמיר מטבע בסיסי ל-ZEC מוגן.',
    href: 'https://near-intents.org/?from=USDT&to=ZEC',
    highlight: true,
  },
  {
    name: 'Kraken',
    type: 'International CEX',
    badges: [
      'בינלאומי',
      <>
        מוסדר (<Ltr>Regulated</Ltr>)
      </>,
    ],
    note: 'בורסה מרכזית ותיקה ומבוססת בארה"ב. נגישה לתושבי ישראל, עם זוגות מסחר ישירים של USD/ZEC ו-BTC/ZEC.',
    href: 'https://www.kraken.com',
  },
  {
    name: 'Gemini',
    type: 'International CEX',
    badges: [
      'בינלאומי',
      <>
        מוסדר (<Ltr>Regulated</Ltr>)
      </>,
    ],
    note: 'בורסה מוסדרת תחת רגולציית NYDFS עם סטנדרטים גבוהים של ציות. ניתן להמיר ישירות USD/ZEC ולמשוך לארנק.',
    href: 'https://www.gemini.com',
  },
  {
    name: 'Binance',
    type: 'International CEX',
    badges: ['בינלאומי'],
    note: 'הבורסה הגדולה בעולם לפי נפח מסחר. יש לבדוק זמינות אזורית ודרישות KYC לפני פתיחת חשבון מישראל.',
    href: 'https://www.binance.com',
  },
]

const updates: Update[] = [
  {
    date: '2025-01',
    source: 'ZF',
    title: 'Zcash Shielded Assets (ZSA) — עדכון מצב',
    summary:
      'מיסוד Zcash פרסם עדכון על התקדמות ZSA — נכסים מוגנים מותאמים-אישית על רשת Zcash. המשמעות: טוקנים מורשים שנושאים את אותה פרטיות ברמת-פרוטוקול כמו ZEC עצמו.',
    href: 'https://zfnd.org',
  },
  {
    date: '2024-12',
    source: 'ZF',
    title: 'Zcash Foundation — דוח שנתי 2024',
    summary:
      'מיסוד Zcash פרסם דוח שנתי הכולל מימון מחקר, תמיכה בפיתוח Halo 2, וקידום קהילות אזוריות ברחבי העולם.',
    href: 'https://zfnd.org',
  },
  {
    date: '2024-11',
    source: 'ECC',
    title: 'Zashi 1.3 — שיפורי ביצועים ו-Unified Addresses',
    summary:
      'גרסה חדשה של ארנק Zashi כוללת סנכרון מהיר יותר, תמיכה מלאה ב-Orchard, ושיפורים משמעותיים ב-UX לשליחת ZEC מוגן בתוך הבריכה.',
    href: 'https://zfnd.org',
  },
]

// ─── Tax cards ────────────────────────────────────────────────────────────────

interface TaxCard {
  title: string
  content: string
  icon?: ReactNode
  highlight?: boolean
}

const taxCards: TaxCard[] = [
  {
    title: 'קריפטו כנכס',
    content:
      'רשות המיסים רואה במטבעות קריפטוגרפיים "נכס" לצרכי מס ולא "מטבע". רווחים ממכירה חייבים במס רווח הון (25% ליחיד).',
  },
  {
    title: 'דיווח חובה',
    content:
      'קיימת חובת דיווח על הכנסות מקריפטו בדוח השנתי לרשות המיסים. אי-דיווח עלול להוות עבירה פלילית.',
  },
  {
    title: 'Viewing Keys — יתרון ייחודי של Zcash',
    content:
      'Zcash מאפשר לייצר Viewing Key — מפתח לצפייה-בלבד שחושף את היסטוריית העסקאות לרואה חשבון או לרשות מס, מבלי למסור שליטה על הכספים. פרטיות כברירת-מחדל + ציות לפי דרישה. שום מטבע אחר לא מציע זאת ברמת הפרוטוקול.',
    icon: <Shield size={15} color={AMBER} />,
    highlight: true,
  },
  {
    title: 'AML / KYC',
    content:
      'בורסות ישראליות מחויבות בחוק איסור הלבנת הון. ציות לדרישות KYC של הבורסה הוא חובה חוקית.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IsraelContextPage() {
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
                ISRAEL
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
              IL_CONTEXT
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
              זיקאש בישראל
            </h1>
            <p
              style={{
                color: '#71717A',
                fontSize: '0.95rem',
                maxWidth: 520,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              היכן לרכוש <Ltr>ZEC</Ltr>, מה אומר חוק המיסוי הישראלי, ועדכונים
              מתורגמים ממיסוד <Ltr>Zcash</Ltr>.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '60px 24px 80px' }}>
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 64,
            }}
          >
            {/* ── Section 1: Where to buy ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <MapPin size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  היכן לרכוש <Ltr>ZEC</Ltr>
                </h2>
              </div>
              <p
                style={{
                  color: '#71717A',
                  fontSize: '0.88rem',
                  marginBottom: 20,
                  lineHeight: 1.7,
                }}
              >
                הרשימה כוללת פלטפורמות נגישות לתושבי ישראל עם תמיכה מלאה ב-
                <Ltr>ZEC</Ltr>. לרכישה ישירה ללא <Ltr>KYC</Ltr> — מומלץ{' '}
                <Ltr>Near Intents</Ltr>.
              </p>

              <div style={{ marginBottom: 24 }}>
                <Alert title="שימו לב: אין רכישה ישירה של ZEC בשקלים" tone="warn">
                  בורסות ישראליות (כמו <Ltr>Bit2C</Ltr> או{' '}
                  <Ltr>Bits of Gold</Ltr>) אינן תומכות כיום ברכישה ישירה של{' '}
                  <Ltr>ZEC</Ltr> עקב מגבלות רגולטוריות. הדרך הנפוצה עבור
                  ישראלים היא רכישת מטבע בסיסי (<Ltr>BTC</Ltr> או{' '}
                  <Ltr>LTC</Ltr>) בשקלים, והמרתו ל-<Ltr>ZEC</Ltr> בבורסות
                  בינלאומיות או ב-<Ltr>DEX</Ltr>.
                </Alert>
              </div>

              {/* Dark exchange grid */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  padding: '22px 20px',
                  background:
                    'radial-gradient(120% 80% at 0% 0%, rgba(243,177,50,0.05) 0%, transparent 55%), linear-gradient(180deg, #09090B 0%, #0B0B0E 100%)',
                  border: '1px solid #18181B',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.6)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <Sparkles size={13} color={AMBER} />
                  <span
                    dir="ltr"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.62rem',
                      letterSpacing: '0.14em',
                      color: '#A1A1AA',
                      textTransform: 'uppercase',
                    }}
                  >
                    VERIFIED_ON_RAMPS
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  {exchanges.map((ex) => (
                    <ExchangeCard key={ex.name} exchange={ex} />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ── Section 2: Tax & Regulation ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <Scale size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  מיסוי והסדרה
                </h2>
              </div>
              <p
                style={{
                  color: '#71717A',
                  fontSize: '0.88rem',
                  marginBottom: 20,
                  lineHeight: 1.7,
                }}
              >
                המסגרת הרגולטורית של קריפטו בישראל מתפתחת. להלן עיקרי המצב
                הנוכחי:
              </p>

              <Alert title="לצרכים חינוכיים בלבד">
                המידע בעמוד זה הוא כללי ואינפורמטיבי בלבד ואינו מהווה ייעוץ
                משפטי, פיסקלי או פיננסי. לפני כל פעולה, יש להתייעץ עם עורך דין
                ו/או רואה חשבון מוסמך הבקיא בדיני המס הישראליים.
              </Alert>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  marginTop: 24,
                }}
              >
                {taxCards.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      position: 'relative',
                      border: item.highlight
                        ? '1px solid rgba(243,177,50,0.45)'
                        : '1px solid #E4E4E7',
                      borderRadius: 10,
                      padding: '16px 18px',
                      background: item.highlight
                        ? 'linear-gradient(180deg, rgba(254,243,199,0.4) 0%, rgba(255,255,255,0.8) 100%)'
                        : '#FFFFFF',
                      boxShadow: item.highlight
                        ? '0 8px 30px -18px rgba(243,177,50,0.3)'
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      {item.icon}
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#09090B',
                          margin: 0,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.title}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: '0.83rem',
                        color: '#52525B',
                        margin: 0,
                        lineHeight: 1.7,
                      }}
                    >
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Section 3: Updates Timeline ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <Newspaper size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  עדכונים מתורגמים
                </h2>
              </div>
              <p
                style={{
                  color: '#71717A',
                  fontSize: '0.88rem',
                  marginBottom: 24,
                  lineHeight: 1.7,
                }}
              >
                סיכומים נבחרים ממיסוד <Ltr>Zcash</Ltr> וחברת <Ltr>ECC</Ltr>.
              </p>

              {/* Dark timeline container */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  padding: '28px 24px 28px 28px',
                  background:
                    'radial-gradient(120% 80% at 100% 0%, rgba(243,177,50,0.05) 0%, transparent 55%), linear-gradient(180deg, #09090B 0%, #0B0B0E 100%)',
                  border: '1px solid #18181B',
                  boxShadow:
                    '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {updates.map((u, i) => (
                    <TimelineItem
                      key={u.title}
                      update={u}
                      index={i}
                      isLast={i === updates.length - 1}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <a
                  href="https://zfnd.org/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.82rem',
                    color: '#71717A',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono), monospace',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = AMBER)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = '#71717A')
                  }
                >
                  <span dir="ltr" className="inline-block">
                    Zcash Foundation Blog →
                  </span>
                </a>
              </div>
            </motion.section>

            {/* ── Nav footer ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                paddingTop: 24,
                borderTop: '1px solid #E4E4E7',
              }}
            >
              <Link
                href="/privacy-explained"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = AMBER)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#71717A')
                }
              >
                ← חשיבות הפרטיות
              </Link>
              <Link
                href="/"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = AMBER)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#71717A')
                }
              >
                חזרה לדף הבית →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
