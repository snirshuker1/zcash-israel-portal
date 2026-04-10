'use client'
import { ArrowRight, AlertTriangle, ExternalLink, MapPin, Scale, Newspaper } from 'lucide-react'
import { motion } from 'framer-motion'
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

// ─── Alert (styled like Shadcn) ───────────────────────────────────────────────

function Alert({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      role="alert"
      style={{
        border: '1px solid #F3B13240',
        backgroundColor: '#FFFBEB',
        borderRadius: 8,
        padding: '14px 16px',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <AlertTriangle
        size={16}
        color={AMBER}
        style={{ flexShrink: 0, marginTop: 2 }}
      />
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
        <div style={{ fontSize: '0.82rem', color: '#71717A', lineHeight: 1.65 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Exchange card ────────────────────────────────────────────────────────────

interface Exchange {
  name: string
  type: string
  zecSupport: string
  note: string
  href: string
  local: boolean
}

function ExchangeCard({ exchange }: { exchange: Exchange }) {
  return (
    <a
      href={exchange.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          border: '1px solid #E4E4E7',
          borderRadius: 10,
          padding: '16px 18px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          transition: 'border-color 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = AMBER)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = '#E4E4E7')
        }
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#09090B',
              }}
              dir="ltr"
            >
              {exchange.name}
            </span>
            {exchange.local && (
              <span
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'var(--font-mono), monospace',
                  color: '#FFFFFF',
                  backgroundColor: '#09090B',
                  padding: '2px 6px',
                  borderRadius: 4,
                  letterSpacing: '0.06em',
                }}
              >
                IL
              </span>
            )}
          </div>
          <span
            dir="ltr"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.62rem',
              color: '#A1A1AA',
              marginBottom: 6,
            }}
          >
            {exchange.type}
          </span>
          <p style={{ fontSize: '0.8rem', color: '#71717A', margin: 0 }}>{exchange.note}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <span
            dir="ltr"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.62rem',
              color: exchange.zecSupport === 'ZEC ✓' ? '#22C55E' : '#A1A1AA',
              fontWeight: 600,
            }}
          >
            {exchange.zecSupport}
          </span>
          <ExternalLink size={12} color="#A1A1AA" />
        </div>
      </div>
    </a>
  )
}

// ─── Update card ──────────────────────────────────────────────────────────────

interface Update {
  date: string
  source: string
  title: string
  summary: string
  href: string
}

function UpdateCard({ update }: { update: Update }) {
  return (
    <div
      style={{
        borderBottom: '1px solid #F4F4F5',
        paddingBottom: 20,
        paddingTop: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          dir="ltr"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.62rem',
            color: '#A1A1AA',
          }}
        >
          {update.date}
        </span>
        <span
          dir="ltr"
          style={{
            fontSize: '0.6rem',
            fontFamily: 'var(--font-mono), monospace',
            color: AMBER,
            backgroundColor: '#FEF3C7',
            padding: '1px 6px',
            borderRadius: 3,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          {update.source}
        </span>
      </div>
      <a
        href={update.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#09090B',
          textDecoration: 'none',
          lineHeight: 1.4,
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: 6,
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = AMBER)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = '#09090B')
        }
      >
        {update.title}
        <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 3 }} />
      </a>
      <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0, lineHeight: 1.6 }}>
        {update.summary}
      </p>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const exchanges: Exchange[] = [
  {
    name: 'Bit2C',
    type: 'Israeli Exchange · ILS / ZEC',
    zecSupport: 'ZEC ✓',
    note: 'הבורסה הישראלית הוותיקה ביותר. תומכת ב-ZEC עם זוג מסחר שקל-זיקאש.',
    href: 'https://www.bit2c.co.il',
    local: true,
  },
  {
    name: 'Kraken',
    type: 'International Exchange',
    zecSupport: 'ZEC ✓',
    note: 'אחת הבורסות הגדולות בעולם, נגישה מישראל עם תמיכה ב-ZEC מלאה.',
    href: 'https://www.kraken.com',
    local: false,
  },
  {
    name: 'Binance',
    type: 'International Exchange',
    zecSupport: 'ZEC ✓',
    note: 'הבורסה הגדולה בעולם. יש לשים לב לדרישות KYC ומגבלות אזוריות.',
    href: 'https://www.binance.com',
    local: false,
  },
  {
    name: 'Near Intents',
    type: 'Decentralized / DEX',
    zecSupport: 'ZEC ✓',
    note: 'החלפה מבוזרת — אין KYC, ישירות מארנק לארנק. מומלץ למי שמעריך פרטיות.',
    href: 'https://near-intents.org/?from=USDT&to=ZEC',
    local: false,
  },
  {
    name: 'Gemini',
    type: 'International Exchange',
    zecSupport: 'ZEC ✓',
    note: 'בורסה מוסדרת בארה"ב, תומכת ב-ZEC. נגישה לתושבי ישראל.',
    href: 'https://www.gemini.com',
    local: false,
  },
]

const updates: Update[] = [
  {
    date: '2025-01',
    source: 'ZF',
    title: 'Zcash Shielded Assets (ZSA) — עדכון מצב',
    summary:
      'מיסוד Zcash פרסם עדכון על התקדמות ZSA — נכסים מוגנים מותאמים-אישית על רשת Zcash. המשמעות: טוקנים שמורשים עם אותה פרטיות כמו ZEC.',
    href: 'https://zfnd.org',
  },
  {
    date: '2024-12',
    source: 'ZF',
    title: 'Zcash Foundation — דוח שנתי 2024',
    summary:
      'מיסוד Zcash פרסם דוח שנתי הכולל מימון מחקר, קידום קהילות ותמיכה בפיתוח פרוטוקול Halo 2.',
    href: 'https://zfnd.org',
  },
  {
    date: '2024-11',
    source: 'ZF',
    title: 'Zodl 1.3 — שיפורי ביצועים ו-Unified Addresses',
    summary:
      'גרסה חדשה של ארנק Zodl כוללת סנכרון מהיר יותר, תמיכה מלאה ב-Orchard, ושיפורים ב-UX לשליחת ZEC מוגן.',
    href: 'https://zfnd.org',
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
              היכן לרכוש <Ltr>ZEC</Ltr>, מה אומר חוק המיסוי הישראלי, ועדכונים מתורגמים ממיסוד <Ltr>Zcash</Ltr>.
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
              gap: 56,
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
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}
              >
                <MapPin size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  היכן לרכוש <Ltr>ZEC</Ltr>
                </h2>
              </div>
              <p style={{ color: '#71717A', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
                הרשימה כוללת בורסות נגישות לתושבי ישראל עם תמיכה ב-<Ltr>ZEC</Ltr>.
                לרכישה ישירה ללא <Ltr>KYC</Ltr> — מומלץ <Ltr>Near Intents</Ltr>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {exchanges.map((ex) => (
                  <ExchangeCard key={ex.name} exchange={ex} />
                ))}
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
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}
              >
                <Scale size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.2rem',
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
                  fontSize: '0.85rem',
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                המסגרת הרגולטורית של קריפטו בישראל מתפתחת. להלן עיקרי המצב הנוכחי:
              </p>

              <Alert title="לצרכים חינוכיים בלבד">
                המידע בעמוד זה הוא כללי ואינפורמטיבי בלבד ואינו מהווה ייעוץ משפטי, פיסקלי
                או פיננסי. לפני כל פעולה, יש להתייעץ עם עורך דין ו/או רואה חשבון מוסמך
                הבקיא בדיני המס הישראליים.
              </Alert>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  marginTop: 24,
                }}
              >
                {[
                  {
                    title: 'קריפטו כנכס',
                    content:
                      'רשות המיסים רואה במטבעות קריפטוגרפיים "נכס" לצרכי מס ולא "מטבע". רווחים ממכירה חייבים במס רווח הון (25% ליחיד).',
                  },
                  {
                    title: 'דיווח חובה',
                    content:
                      'ישנה חובת דיווח על הכנסות מקריפטו בדוח השנתי לרשות המיסים. אי-דיווח עלול להוות עבירה פלילית.',
                  },
                  {
                    title: 'Viewing Keys לציות',
                    content:
                      'Zcash מאפשר לייצר Viewing Key שחושף את היסטוריית העסקאות לרואה חשבון בלבד — מבלי למסור גישה לכספים.',
                  },
                  {
                    title: 'AML / KYC',
                    content:
                      'בורסות ישראליות מחויבות בחוק איסור הלבנת הון. ציות לדרישות KYC של הבורסה הוא חובה חוקית.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      border: '1px solid #E4E4E7',
                      borderRadius: 8,
                      padding: '14px 16px',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#09090B',
                        marginBottom: 6,
                      }}
                    >
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0, lineHeight: 1.65 }}>
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Section 3: Updates ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}
              >
                <Newspaper size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.2rem',
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
                  fontSize: '0.85rem',
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                סיכומים נבחרים ממיסוד <Ltr>Zcash</Ltr>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {updates.map((u) => (
                  <UpdateCard key={u.title} update={u} />
                ))}
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
