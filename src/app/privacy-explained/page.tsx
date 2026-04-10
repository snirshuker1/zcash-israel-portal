'use client'
import { ArrowRight, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
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

// ─── Comparison table row ─────────────────────────────────────────────────────

function CompareRow({
  label,
  transparent,
  shielded,
  transparentOk,
}: {
  label: string
  transparent: string
  shielded: string
  transparentOk?: boolean
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: '1px solid #F4F4F5',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          fontSize: '0.82rem',
          fontWeight: 500,
          color: '#09090B',
          borderLeft: '1px solid #F4F4F5',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: '14px 16px',
          fontSize: '0.82rem',
          color: '#71717A',
          borderLeft: '1px solid #F4F4F5',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: transparentOk ? 'transparent' : '#FEF2F2',
        }}
      >
        {!transparentOk && <XCircle size={13} color="#EF4444" style={{ flexShrink: 0 }} />}
        {transparentOk && <CheckCircle size={13} color="#22C55E" style={{ flexShrink: 0 }} />}
        {transparent}
      </div>
      <div
        style={{
          padding: '14px 16px',
          fontSize: '0.82rem',
          color: '#71717A',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#FFFBEB',
        }}
      >
        <CheckCircle size={13} color={AMBER} style={{ flexShrink: 0 }} />
        {shielded}
      </div>
    </div>
  )
}

// ─── Inline code block ────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="ltr"
      style={{
        backgroundColor: '#09090B',
        borderRadius: 8,
        padding: '14px 16px',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.72rem',
        color: '#A1A1AA',
        lineHeight: 1.8,
        overflowX: 'auto',
        margin: '16px 0',
      }}
    >
      {children}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyExplainedPage() {
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
                PRIVACY
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
              PRIVACY_EXPLAINED
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
              חשיבות הפרטיות
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
              מדוע בלוקצ&apos;יין שקוף הוא בעיה, וכיצד <Ltr>Zcash</Ltr> פותר אותה ברמת
              הפרוטוקול באמצעות <Ltr>zk-SNARKs</Ltr>.
            </p>
          </div>
        </div>

        {/* Article body */}
        <article style={{ padding: '60px 24px 80px' }}>
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 48,
            }}
          >
            {/* ── Section 1: The problem ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Eye size={18} color="#EF4444" />
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  הבעיה: בלוקצ&apos;יין שקוף
                </h2>
              </div>
              <p style={{ color: '#71717A', lineHeight: 1.75, marginBottom: 14 }}>
                כאשר אתה שולח <Ltr>Bitcoin</Ltr> או <Ltr>Ethereum</Ltr>, כל עסקה נרשמת
                לנצח בפנקס ציבורי שכל אחד יכול לקרוא. הכתובות הן פסאודואנונימיות — אך
                ברגע שכתובת מקושרת לזהות (דרך בורסה, סוחר, או ניתוח שרשרת), כל ההיסטוריה
                חשופה.
              </p>
              <CodeBlock>
                <span style={{ color: '#F87171' }}>// Bitcoin transaction — visible to all</span>
                {'\n'}From:{' '}
                <span style={{ color: '#FCD34D' }}>1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf</span>
                {'\n'}To:{' '}
                <span style={{ color: '#FCD34D' }}>1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2</span>
                {'\n'}Amount:{' '}
                <span style={{ color: '#86EFAC' }}>0.42 BTC</span>
                {'  '}
                <span style={{ color: '#F87171' }}>// ← public forever</span>
              </CodeBlock>
              <p style={{ color: '#71717A', lineHeight: 1.75 }}>
                תאגידי ניתוח נתונים כמו <Ltr>Chainalysis</Ltr> מוכרים גישה לממשלות ובורסות
                כדי לעקוב אחר כספים. מדובר בתשתית מעקב פיננסי בהיקף שלא נראה מעולם.
              </p>
            </motion.section>

            {/* ── Section 2: The solution ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <EyeOff size={18} color={AMBER} />
                <h2
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  הפתרון: <Ltr>Zcash Shielded Pool</Ltr>
                </h2>
              </div>
              <p style={{ color: '#71717A', lineHeight: 1.75, marginBottom: 14 }}>
                <Ltr>Zcash</Ltr> משתמש בהוכחות אפס-ידע (<Ltr>zk-SNARKs</Ltr>) — מנגנון
                קריפטוגרפי שמאפשר לצד אחד להוכיח שמשפט מתמטי הוא נכון, מבלי לחשוף שום
                מידע נוסף. בהקשר של עסקאות:
              </p>
              <CodeBlock>
                <span style={{ color: '#86EFAC' }}>// Zcash shielded transaction</span>
                {'\n'}From:{' '}
                <span style={{ color: '#A78BFA' }}>
                  [ENCRYPTED — zk-proof validates ownership]
                </span>
                {'\n'}To:{' '}
                <span style={{ color: '#A78BFA' }}>[ENCRYPTED — valid recipient]</span>
                {'\n'}Amount:{' '}
                <span style={{ color: '#A78BFA' }}>[ENCRYPTED — non-negative, proven]</span>
                {'\n'}
                <span style={{ color: '#86EFAC' }}>// Consensus: valid ✓  |  Data: private ✓</span>
              </CodeBlock>
              <p style={{ color: '#71717A', lineHeight: 1.75 }}>
                הרשת מאמתת שהסכום אינו שלילי ושהשולח מחזיק בכספים — אך ללא חשיפת הסכום,
                הזהות, או היסטוריית ההעברות. זוהי הגנה מוכחת מתמטית, לא הבטחה של צד
                שלישי.
              </p>
            </motion.section>

            {/* ── Section 3: Comparison table ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#09090B',
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                }}
              >
                השוואה: שקוף מול מוגן
              </h2>

              {/* Table */}
              <div
                style={{
                  border: '1px solid #E4E4E7',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    backgroundColor: '#FAFAFA',
                    borderBottom: '1px solid #E4E4E7',
                  }}
                >
                  {[
                    { label: 'מאפיין', align: 'right' },
                    { label: 'שקוף (BTC / ETH)', align: 'right' },
                    { label: 'מוגן (ZEC Shielded)', align: 'right' },
                  ].map((col) => (
                    <div
                      key={col.label}
                      style={{
                        padding: '12px 16px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#09090B',
                        fontFamily: 'var(--font-mono), monospace',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        borderLeft: '1px solid #E4E4E7',
                      }}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>

                <CompareRow
                  label="סכום עסקה"
                  transparent="גלוי לכולם"
                  shielded="מוצפן ומוסתר"
                />
                <CompareRow
                  label="כתובת שולח"
                  transparent="רשומה בבלוקצ'יין"
                  shielded="מוגנת בהוכחת ZK"
                />
                <CompareRow
                  label="כתובת מקבל"
                  transparent="רשומה בבלוקצ'יין"
                  shielded="מוגנת בהוכחת ZK"
                />
                <CompareRow
                  label="Memo / הערה"
                  transparent="ציבורי לחלוטין"
                  shielded="מוצפן — רק לנמען"
                />
                <CompareRow
                  label="אימות תקינות"
                  transparent="מלא"
                  shielded="מלא"
                  transparentOk
                />
                <CompareRow
                  label="עמידה ב-21M cap"
                  transparent="כן"
                  shielded="כן — מוכח מתמטית"
                  transparentOk
                />
                <CompareRow
                  label="Viewing Keys לציות"
                  transparent="לא רלוונטי"
                  shielded="כן — חשיפה רצונית"
                />
              </div>
            </motion.section>

            {/* ── Section 4: zk-SNARKs explainer ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E4E4E7',
                borderRadius: 12,
                padding: '28px 28px',
              }}
            >
              <span
                dir="ltr"
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.62rem',
                  color: '#A1A1AA',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                DEEP_DIVE
              </span>
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#09090B',
                  letterSpacing: '-0.02em',
                  marginBottom: 14,
                }}
              >
                מה זה <Ltr>zk-SNARKs</Ltr>?
              </h2>
              <p style={{ color: '#71717A', lineHeight: 1.75, marginBottom: 12 }}>
                <Ltr>zk-SNARK</Ltr> הוא קיצור של{' '}
                <em>Zero-Knowledge Succinct Non-interactive Argument of Knowledge</em>.
                המשמעות: הוכחה קריפטוגרפית שניתן לאמת ב-מילי-שניות, מבלי שהמאמת יוצר
                אינטראקציה עם המוכיח, ומבלי שנחשף שום מידע.
              </p>
              <p style={{ color: '#71717A', lineHeight: 1.75, marginBottom: 12 }}>
                <Ltr>Zcash</Ltr> עלתה לאוויר ב-2016 עם מעגל <Ltr>Sprout</Ltr>, שדרגה ל-
                <Ltr>Sapling</Ltr> ב-2018 (ביצועים מוביליים), ועל עדכון <Ltr>NU5</Ltr>{' '}
                ב-2022 הוטמעה <Ltr>Halo 2</Ltr> — גרסה שמבטלת לחלוטין את הצורך ב-
                <em>Trusted Setup</em> חד-פעמי.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #F3B13225',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}
              >
                <span style={{ color: AMBER, fontWeight: 700, flexShrink: 0 }}>◎</span>
                <p style={{ fontSize: '0.82rem', color: '#71717A', margin: 0, lineHeight: 1.65 }}>
                  עם <Ltr>Halo 2</Ltr>, גם ה-<em>trusted setup</em> — ההנחה הקריפטוגרפית
                  היחידה שהייתה נדרשת — בוטל. כל ההוכחות כיום מתבססות על הנחות
                  מתמטיות סטנדרטיות בלבד.
                </p>
              </div>
            </motion.section>

            {/* ── Section 5: Viewing Keys ── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#09090B',
                  letterSpacing: '-0.02em',
                  marginBottom: 14,
                }}
              >
                <Ltr>Viewing Keys</Ltr>: פרטיות עם אפשרות לשקיפות
              </h2>
              <p style={{ color: '#71717A', lineHeight: 1.75, marginBottom: 12 }}>
                <Ltr>Zcash</Ltr> מאפשר לחשוף נתוני עסקאות רצונית לגורם מורשה — רואה
                חשבון, רגולטור, או קרוב משפחה — מבלי לאבד שליטה על שאר הנכסים.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {[
                  {
                    title: 'Incoming Viewing Key',
                    desc: 'מאפשר לראות כספים נכנסים בלבד — אידיאלי לרואה חשבון',
                  },
                  {
                    title: 'Full Viewing Key',
                    desc: 'חשיפה מלאה של עסקאות נכנסות ויוצאות — לדיווח מס',
                  },
                  {
                    title: 'Payment Disclosure',
                    desc: 'הוכחה קריפטוגרפית לתשלום ספציפי — ניתן לצרף לחשבונית',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: 'flex',
                      gap: 14,
                      padding: '14px 16px',
                      border: '1px solid #E4E4E7',
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '0.72rem',
                        color: AMBER,
                        fontWeight: 600,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                      dir="ltr"
                    >
                      {item.title}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#71717A' }}>{item.desc}</span>
                  </div>
                ))}
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
                href="/guides/start"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = AMBER)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#71717A')
                }
              >
                ← מדריכים למשתמש
              </Link>
              <Link
                href="/israel-context"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = AMBER)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#71717A')
                }
              >
                זיקאש בישראל →
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
