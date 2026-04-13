'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Wallet,
  Plug,
  Settings2,
  CheckCircle2,
  PartyPopper,
  Sparkles,
} from 'lucide-react'
import Footer from '@/components/Footer'

const AMBER = '#F3B132'

function Ltr({ children }: { children: React.ReactNode }) {
  return (
    <span dir="ltr" className="inline-block">
      {children}
    </span>
  )
}

// ─── Reusable pieces ─────────────────────────────────────────────────────────

function BackButton({ placement = 'top' }: { placement?: 'top' | 'bottom' }) {
  return (
    <Link
      href="/guides/start"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#09090B',
        backgroundColor: 'transparent',
        textDecoration: 'none',
        transition: 'background-color 0.15s, gap 0.18s',
        marginTop: placement === 'bottom' ? 48 : 0,
        marginBottom: placement === 'top' ? 28 : 0,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = '#F4F4F5'
        ;(e.currentTarget as HTMLElement).style.gap = '12px'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
        ;(e.currentTarget as HTMLElement).style.gap = '8px'
      }}
    >
      <span>חזרה למדריכים</span>
      <ArrowLeft size={16} />
    </Link>
  )
}

// ─── Step card ───────────────────────────────────────────────────────────────

interface StepProps {
  number: number
  icon: React.ElementType
  title: React.ReactNode
  children: React.ReactNode
}

function StepCard({ number, icon: Icon, title, children }: StepProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        position: 'relative',
        border: '1px solid #E4E4E7',
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        padding: 'clamp(22px, 4.5vw, 34px) clamp(20px, 4.5vw, 34px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#FFFBEB',
            border: '1px solid #F3B13230',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={AMBER} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: AMBER,
              letterSpacing: '0.08em',
            }}
          >
            <Ltr>STEP {number.toString().padStart(2, '0')}</Ltr>
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.1rem, 3.4vw, 1.35rem)',
              fontWeight: 700,
              color: '#09090B',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>
        </div>
      </div>
      <div
        style={{
          fontSize: 'clamp(0.9rem, 2.4vw, 0.97rem)',
          lineHeight: 1.9,
          color: '#334155',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {children}
      </div>
    </motion.section>
  )
}

// ─── Shared list styles ──────────────────────────────────────────────────────

const orderedListStyle: React.CSSProperties = {
  margin: 0,
  paddingInlineStart: 22,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NearIntentsGuide() {
  return (
    <main
      dir="rtl"
      style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        paddingTop: 'clamp(80px, 12vw, 104px)',
        paddingBottom: 'clamp(56px, 9vw, 88px)',
      }}
    >
      <div
        style={{
          maxWidth: 780,
          marginInline: 'auto',
          paddingInline: 'clamp(16px, 4.5vw, 28px)',
        }}
      >
        <BackButton placement="top" />

        {/* ─── Header ───────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              backgroundColor: '#FFFBEB',
              border: '1px solid #F3B13240',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: AMBER,
                letterSpacing: '0.1em',
              }}
            >
              <Ltr>GUIDE · CRYPTO HOLDERS</Ltr>
            </span>
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily:
                '-apple-system, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(1.55rem, 5.2vw, 2.5rem)',
              fontWeight: 600,
              color: '#09090B',
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
            }}
          >
            המדריך המהיר: המרת קריפטו ל-<Ltr>Zcash</Ltr> (<Ltr>ZEC</Ltr>) דרך{' '}
            <Ltr>NEAR Intents</Ltr>
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2.6vw, 1.05rem)',
              lineHeight: 1.85,
              color: '#475569',
            }}
          >
            אם כבר יש ברשותכם מטבעות דיגיטליים (כמו <Ltr>USDT</Ltr>, <Ltr>USDC</Ltr>,
            ביטקוין או אתריום) על רשתות אחרות, אתם לא צריכים לעבור שוב דרך בורסות
            ריכוזיות או תהליכי אימות זהות (<Ltr>KYC</Ltr>) כדי להשיג <Ltr>Zcash</Ltr>.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2.6vw, 1.05rem)',
              lineHeight: 1.85,
              color: '#475569',
            }}
          >
            באמצעות טכנולוגיית <strong style={{ color: '#09090B' }}><Ltr>NEAR Intents</Ltr></strong>,
            אתם יכולים להמיר מטבעות מיותר מ-20 רשתות שונות ולקבל <Ltr>ZEC</Ltr> טבעי
            ונקי ישירות לארנק הפרטי שלכם, בעמלות אפסיות ובפעולה אחת פשוטה.
          </p>
        </motion.header>

        {/* ─── "What is NEAR Intents?" callout ─────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            marginBottom: 'clamp(24px, 4.5vw, 40px)',
            padding: 'clamp(22px, 4.5vw, 32px) clamp(20px, 4.5vw, 34px)',
            borderRadius: 14,
            backgroundColor: '#FAFAFA',
            border: '1px solid #E4E4E7',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E4E4E7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={16} color={AMBER} />
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 'clamp(1rem, 2.8vw, 1.15rem)',
                fontWeight: 700,
                color: '#09090B',
                letterSpacing: '-0.01em',
              }}
            >
              מה זה בעצם <Ltr>NEAR Intents</Ltr>?
            </h3>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.9rem, 2.5vw, 0.97rem)',
              lineHeight: 1.9,
              color: '#475569',
            }}
          >
            במקום להתעסק עם &ldquo;גשרים&rdquo; (<Ltr>Bridges</Ltr>) מסובכים או מטבעות
            עטופים (<Ltr>Wrapped</Ltr>), הפרוטוקול עובד על &ldquo;כוונות&rdquo;. אתם
            פשוט מצהירים מה אתם רוצים לתת ומה אתם רוצים לקבל. מאחורי הקלעים, רשת של
            פותרים (<Ltr>Solvers</Ltr>) חכמים מוצאת עבורכם את הנתיב הזול והמהיר
            ביותר, ומשלימה את העסקה עבורכם.
          </p>
        </motion.section>

        {/* ─── Steps ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* STEP 1 */}
          <StepCard number={1} icon={Wallet} title="שלב 1: הכנות נדרשות">
            <p style={{ margin: 0 }}>
              לפני שמתחילים, ודאו שיש לכם את שני הדברים הבאים:
            </p>
            <ol style={orderedListStyle}>
              <li>
                <strong style={{ color: '#09090B' }}>ארנק מקור (שולח):</strong> כל
                ארנק קריפטו אישי (<Ltr>Web3</Ltr>) שבו נמצאים המטבעות שתרצו להמיר
                (למשל <Ltr>MetaMask</Ltr>, <Ltr>Trust Wallet</Ltr>,{' '}
                <Ltr>Phantom</Ltr>, או כל ארנק שתומך ב-<Ltr>WalletConnect</Ltr>), יחד
                עם מעט מטבעות רשת לתשלום עמלת השליחה הבסיסית של אותה רשת.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>ארנק יעד (מקבל):</strong> ארנק{' '}
                <strong style={{ color: '#09090B' }}><Ltr>Zodl</Ltr></strong> מותקן
                ומוכן לקבלה. פתחו את האפליקציה, לחצו על{' '}
                <strong style={{ color: '#09090B' }}><Ltr>Receive</Ltr></strong>{' '}
                והעתיקו את הכתובת הפרטית שלכם (<Ltr>Shielded Address</Ltr> שמתחילה
                באות <strong style={{ color: '#09090B' }}><Ltr>z</Ltr></strong>).
              </li>
            </ol>
          </StepCard>

          {/* STEP 2 */}
          <StepCard number={2} icon={Plug} title="שלב 2: גישה לממשק ההמרה">
            <p style={{ margin: 0 }}>
              מכיוון ש-<Ltr>NEAR Intents</Ltr> הוא פרוטוקול, קיימים מספר ממשקים (
              <Ltr>DApps</Ltr>) שדרכם ניתן להשתמש בו.
            </p>
            <ol style={orderedListStyle}>
              <li>
                היכנסו לאחת מהפלטפורמות התומכות בפרוטוקול (למשל, האתר הרשמי של ארנק{' '}
                <Ltr>NEAR</Ltr> או אפליקציות צד-שלישי המשלבות את הפרוטוקול).
              </li>
              <li>
                לחצו על{' '}
                <strong style={{ color: '#09090B' }}>
                  <Ltr>Connect Wallet</Ltr>
                </strong>{' '}
                וחברו את ארנק המקור שלכם.
              </li>
            </ol>
          </StepCard>

          {/* STEP 3 */}
          <StepCard
            number={3}
            icon={Settings2}
            title={
              <>
                שלב 3: הגדרת ההמרה (ה&ldquo;כוונה&rdquo;)
              </>
            }
          >
            <p style={{ margin: 0 }}>כעת נגדיר איזו המרה אנחנו רוצים לבצע:</p>
            <ol style={orderedListStyle}>
              <li>
                <strong style={{ color: '#09090B' }}>
                  בחירת מטבע המקור (<Ltr>Pay</Ltr>):
                </strong>{' '}
                בחרו את הרשת (למשל, <Ltr>Arbitrum</Ltr>) ואת המטבע שאתם רוצים למכור
                (למשל, <Ltr>USDC</Ltr>), והזינו את הסכום.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>
                  בחירת מטבע היעד (<Ltr>Receive</Ltr>):
                </strong>{' '}
                בחרו ברשת <strong style={{ color: '#09090B' }}><Ltr>Zcash</Ltr></strong>{' '}
                ובמטבע <strong style={{ color: '#09090B' }}><Ltr>ZEC</Ltr></strong>.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>הזנת כתובת היעד:</strong>{' '}
                המערכת תבקש מכם להזין את הכתובת שאליה יישלח ה-<Ltr>Zcash</Ltr>.
                הדביקו כאן את כתובת ה-<Ltr>Zodl</Ltr> שהעתקתם בשלב 1. בדקו שוב
                שהכתובת מדויקת.
              </li>
              <li>
                המערכת תחשב כעת את שער ההמרה ותציג לכם בדיוק כמה <Ltr>ZEC</Ltr>{' '}
                תקבלו. שימו לב: הפרוטוקול עצמו לוקח עמלה זעירה בלבד (לרוב כ-0.01%)
                או פועל ללא עמלה כלל בתקופות קמפיין.
              </li>
            </ol>
          </StepCard>

          {/* STEP 4 */}
          <StepCard number={4} icon={CheckCircle2} title="שלב 4: אישור וביצוע">
            <ol style={orderedListStyle}>
              <li>
                לחצו על{' '}
                <strong style={{ color: '#09090B' }}>
                  <Ltr>Swap</Ltr>
                </strong>{' '}
                או{' '}
                <strong style={{ color: '#09090B' }}>
                  <Ltr>Review Order</Ltr>
                </strong>
                .
              </li>
              <li>
                ארנק המקור שלכם יקפוץ ויבקש מכם לאשר את העסקה ולחתום עליה (
                <Ltr>Sign</Ltr>).
              </li>
              <li>לאחר החתימה, העסקה יוצאת לדרך!</li>
            </ol>
          </StepCard>
        </div>

        {/* ─── Finale ──────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            marginTop: 'clamp(28px, 5vw, 48px)',
            padding: 'clamp(26px, 5vw, 40px) clamp(22px, 4.8vw, 36px)',
            borderRadius: 14,
            background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
            border: '1px solid #F3B13240',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              border: '1px solid #F3B13240',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PartyPopper size={22} color={AMBER} />
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily:
                '-apple-system, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
              fontSize: 'clamp(1.25rem, 3.6vw, 1.55rem)',
              fontWeight: 700,
              color: '#09090B',
              letterSpacing: '-0.02em',
            }}
          >
            זהו!
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.92rem, 2.5vw, 1rem)',
              lineHeight: 1.9,
              color: '#475569',
            }}
          >
            אין צורך להמתין מול המסך. ה&ldquo;פותרים&rdquo; של הרשת ייקחו את המטבעות
            שלכם, יבצעו את ההמרות הנדרשות מאחורי הקלעים, וישלחו <Ltr>ZEC</Ltr> טהור
            ישירות לכתובת ה-<Ltr>Zodl</Ltr> שלכם. תוך מספר דקות (תלוי בעומס הרשתות),
            היתרה תתעדכן באפליקציה שלכם.
          </p>
        </motion.section>

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <BackButton placement="bottom" />
        </div>
      </div>

      <Footer />
    </main>
  )
}
