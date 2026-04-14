'use client'
import { ArrowRight, AlertTriangle, Scale, Database, RefreshCw, ShieldAlert } from 'lucide-react'
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

function SectionCard({
  num,
  title,
  icon,
  children,
}: {
  num: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        {icon}
        <span
          dir="ltr"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.62rem',
            color: '#A1A1AA',
            letterSpacing: '0.1em',
          }}
        >
          §{num}
        </span>
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#09090B',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 28 }}>
        {children}
      </div>
    </section>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#71717A', lineHeight: 1.8, margin: 0, fontSize: '0.9rem' }}>
      {children}
    </p>
  )
}

function Callout({ amber, children }: { amber?: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        backgroundColor: amber ? '#FFFBEB' : '#FAFAFA',
        border: `1px solid ${amber ? '#F3B13240' : '#E4E4E7'}`,
        borderRadius: 8,
        padding: '14px 16px',
      }}
    >
      <span style={{ color: amber ? AMBER : '#A1A1AA', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
        {amber ? '◎' : '—'}
      </span>
      <p style={{ fontSize: '0.855rem', color: '#71717A', margin: 0, lineHeight: 1.75 }}>
        {children}
      </p>
    </div>
  )
}

function BulletList({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ color: AMBER, fontSize: '0.6rem', marginTop: 5, flexShrink: 0 }}>◆</span>
          <span style={{ color: '#71717A', fontSize: '0.875rem', lineHeight: 1.75 }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TermsPage() {
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
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#A1A1AA')}
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
                TERMS
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
              LEGAL_TERMS
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
              תנאי שימוש
            </h1>
            <p
              style={{
                color: '#71717A',
                fontSize: '0.9rem',
                maxWidth: 560,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              עדכון אחרון: אפריל 2026 · אתר זה מופעל על-ידי קהילת{' '}
              <Ltr>Zcash</Ltr> ישראל למטרות חינוכיות ומידעיות בלבד.
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
              gap: 52,
            }}
          >
            {/* Intro callout */}
            <Callout amber>
              אתר זה אינו מורשה כיועץ השקעות, מנהל תיקים, או נותן שירותים פיננסיים מוסדרים
              כלשהם לפי חוק ניירות ערך, תשכ&quot;ח-1968, או כל דין ישראלי אחר. אין לראות
              בתוכן האתר ייעוץ השקעות, ייעוץ מס, המלצה לפעולה, או תחליף לייעוץ מקצועי
              מורשה.
            </Callout>

            {/* §01 — No Financial Advice */}
            <SectionCard
              num="01"
              title="היעדר ייעוץ פיננסי"
              icon={<Scale size={18} color={AMBER} />}
            >
              <Para>
                כל המידע, הנתונים, הניתוחים, והתכנים המופיעים באתר זה מיועדים למטרות חינוכיות
                ומידעיות בלבד. אין לפרש תוכן זה כייעוץ השקעות, ייעוץ פיננסי, ייעוץ מס, ייעוץ
                משפטי, או כל המלצה אחרת לרכישה, מכירה, החזקה, או ביצוע כל פעולה בנכסים
                פיננסיים, לרבות מטבעות קריפטוגרפיים.
              </Para>
              <Para>
                קהילת <Ltr>Zcash</Ltr> ישראל אינה רשומה, מורשית, או מוסמכת כיועץ השקעות,
                מנהל תיקים, או נותן שירותים פיננסיים מוסדרים כלשהם לפי חוק ניירות ערך,
                תשכ&quot;ח-1968, חוק הייעוץ להשקעות, ניהול תיקי השקעות ושיווק השקעות,
                תשנ&quot;ה-1995, או כל דין ישראלי רלוונטי אחר.
              </Para>
              <Callout>
                לפני קבלת כל החלטת השקעה, פנה ליועץ השקעות מורשה על-ידי הרשות לניירות ערך.
                מידע נוסף זמין באתר הרשות לניירות ערך בישראל (isa.gov.il).
              </Callout>
            </SectionCard>

            {/* §02 — Crypto & Wallet Risks */}
            <SectionCard
              num="02"
              title="סיכוני קריפטו ואובדן ארנקים"
              icon={<AlertTriangle size={18} color="#EF4444" />}
            >
              <Para>
                השקעה במטבעות קריפטוגרפיים כרוכה ברמת סיכון גבוהה מאוד. אין כל ודאות לגבי
                שימור ערך, נזילות, או המשך פעילות כלשהי. בין הסיכונים המרכזיים:
              </Para>
              <BulletList
                items={[
                  'תנודתיות קיצונית — ערך המטבעות עשוי לרדת לאפס או לאבד חלק ניכר מערכו בפרק זמן קצר.',
                  <>
                    אובדן בלתי הפיך — אבדן מפתח פרטי (<Ltr>Private Key</Ltr>) או ביטוי זרע (
                    <Ltr>Seed Phrase</Ltr>) גורר אובדן מוחלט ובלתי ניתן להשבה של הנכסים, ללא כל
                    אפשרות שחזור.
                  </>,
                  'סיכון טכנולוגי — ארנקים, פרוטוקולים, ורשתות עלולים להכיל באגים, לחוות התקפות, או להפסיק לפעול.',
                  'סיכון רגולטורי — שינויים בחקיקה ישראלית או בינלאומית עלולים להגביל, לאסור, או למסות שימוש במטבעות קריפטוגרפיים.',
                  'חובות דיווח ומיסוי — בישראל, רשות המסים רואה ברווחי קריפטו רווח הון החייב במס. חובתך לדווח ולשלם מס בהתאם לדין.',
                  'סיכון נזילות — ייתכנו מצבים בהם לא ניתן יהיה לממש את הנכסים במחיר הרצוי, או כלל.',
                ]}
              />
              <Callout amber>
                אין להשקיע יותר ממה שאתה מוכן להפסיד לחלוטין. מטבעות קריפטוגרפיים אינם
                מוגנים על-ידי ביטוח פיקדונות, קרן להגנת המשקיע, או כל רשת ביטחון ממשלתית.
              </Callout>
            </SectionCard>

            {/* §03 — Limitation of Liability */}
            <SectionCard
              num="03"
              title="הגבלת אחריות"
              icon={<ShieldAlert size={18} color="#71717A" />}
            >
              <Para>
                כל התוכן באתר מסופק &quot;כמות שהוא&quot; (<Ltr>AS-IS</Ltr>) ו&quot;כפי שזמין&quot;
                (<Ltr>AS-AVAILABLE</Ltr>), ללא כל אחריות מפורשת או משתמעת מכל סוג שהוא, לרבות
                ללא אחריות לדיוק, שלמות, התאמה למטרה מסוימת, או זמינות רציפה.
              </Para>
              <BulletList
                items={[
                  <>
                    קהילת <Ltr>Zcash</Ltr> ישראל לא תישא בכל אחריות לנזקים ישירים, עקיפים,
                    מיוחדים, תוצאתיים, או עונשיים הנובעים משימוש או אי-יכולת שימוש באתר, לרבות
                    הפסדים כספיים.
                  </>,
                  'הקהילה לא תישא באחריות לטעויות, השמטות, אי-דיוקים, או שינויים בנתונים המוצגים.',
                  'קישורים לאתרי צד שלישי אינם מהווים אישור לתוכנם, ואין לקהילה שליטה על זמינותם, דיוקם, או תוכנם.',
                  'הקהילה שומרת לעצמה את הזכות לשנות, להסיר, או להפסיק תוכן בכל עת וללא הודעה מוקדמת.',
                ]}
              />
            </SectionCard>

            {/* §04 — Third-party Data */}
            <SectionCard
              num="04"
              title="נתונים ממקורות צד שלישי"
              icon={<Database size={18} color="#71717A" />}
            >
              <Para>
                נתוני הפרוטוקול המוצגים באתר — לרבות מחיר, גובה בלוק, נפח עסקאות, ונתוני
                ה-<Ltr>Shielded Pool</Ltr> — מגיעים ממקורות צד שלישי כגון{' '}
                <Ltr>Blockchair</Ltr> ו-<Ltr>CoinGecko</Ltr>. נתונים אלו:
              </Para>
              <BulletList
                items={[
                  'עשויים להיות מושהים, חלקיים, מוערכים, או שגויים.',
                  'מתעדכנים במרווחים קבועים ואינם מייצגים זמן-אמת מדויק.',
                  'אינם מיועדים לשמש בסיס לקבלת החלטות מסחריות או השקעתיות.',
                ]}
              />
              <Para>
                חברי קהילת <Ltr>Zcash</Ltr> ישראל, לרבות מפעילי ומתחזקי האתר, עשויים להחזיק{' '}
                <Ltr>ZEC</Ltr> ונכסים קריפטוגרפיים אחרים בכל עת. עובדה זו עלולה להוות ניגוד
                עניינים פוטנציאלי ויש להביאה בחשבון בעת קריאת התוכן.
              </Para>
            </SectionCard>

            {/* §05 — Changes */}
            <SectionCard
              num="05"
              title="שינויים בתנאים ורציפות השירות"
              icon={<RefreshCw size={18} color="#71717A" />}
            >
              <Para>
                הקהילה שומרת לעצמה את הזכות לשנות תנאים אלו בכל עת וללא הודעה מוקדמת. המשך
                שימוש באתר לאחר פרסום שינויים מהווה הסכמה לתנאים המעודכנים. מומלץ לבדוק דף
                זה מעת לעת.
              </Para>
              <Para>
                אתר זה עשוי להפסיק לפעול, להשתנות, או להיות מופסק בכל עת וללא הודעה מוקדמת.
                אין כל מחויבות לשמר, לעדכן, או להמשיך ולתחזק את השירות.
              </Para>
            </SectionCard>

            {/* Governing law */}
            <div
              style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E4E4E7',
                borderRadius: 12,
                padding: '24px 28px',
              }}
            >
              <p
                dir="ltr"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.62rem',
                  color: '#A1A1AA',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  margin: '0 0 10px 0',
                }}
              >
                GOVERNING_LAW
              </p>
              <p style={{ color: '#71717A', lineHeight: 1.8, margin: 0, fontSize: '0.875rem' }}>
                תנאים אלו כפופים לדין הישראלי. כל סכסוך הנובע מהם יובא לפני בתי המשפט
                המוסמכים בישראל. שימוש באתר מהווה קבלה מלאה ובלתי מסויגת של תנאים אלו.
              </p>
            </div>

            {/* Nav footer */}
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
                href="/"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#71717A')}
              >
                ← עמוד הבית
              </Link>
              <Link
                href="/privacy-explained"
                style={{
                  fontSize: '0.82rem',
                  color: '#71717A',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = AMBER)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#71717A')}
              >
                חשיבות הפרטיות →
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
