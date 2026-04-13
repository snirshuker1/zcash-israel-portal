'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Wallet, CreditCard, Coins, PartyPopper } from 'lucide-react'
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

const bulletListStyle: React.CSSProperties = {
  margin: 0,
  paddingInlineStart: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  listStyleType: 'disc',
}

// ─── Exchange list item (Step 1) ─────────────────────────────────────────────

function ExchangeItem({ name, desc }: { name: string; desc: React.ReactNode }) {
  return (
    <li
      style={{
        border: '1px solid #E4E4E7',
        borderRadius: 10,
        padding: '14px 18px',
        backgroundColor: '#FAFAFA',
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.98rem',
          fontWeight: 700,
          color: '#09090B',
        }}
      >
        <Ltr>{name}</Ltr>
      </span>
      <span style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.75 }}>
        {desc}
      </span>
    </li>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BuyExchangeGuide() {
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
              <Ltr>GUIDE · BEGINNERS</Ltr>
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
            המדריך השלם: איך לקנות <Ltr>Zcash</Ltr> (<Ltr>ZEC</Ltr>) בבורסה
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2.6vw, 1.05rem)',
              lineHeight: 1.85,
              color: '#475569',
            }}
          >
            ברוכים הבאים לעולם הכלכלה הפרטית. אם זו הפעם הראשונה שאתם רוכשים מטבעות
            דיגיטליים, התהליך עשוי להיראות מעט טכני בהתחלה — אבל אל דאגה. המדריך הזה
            נועד להעביר אתכם את התהליך יד ביד, בצורה הבטוחה והפשוטה ביותר.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2.6vw, 1.05rem)',
              lineHeight: 1.85,
              color: '#475569',
            }}
          >
            קניית <Ltr>Zcash</Ltr> מתבצעת לרוב דרך בורסות קריפטו גדולות, המאפשרות
            המרה של כסף רגיל (דולרים, יורו או שקלים) למטבעות דיגיטליים.
          </p>
        </motion.header>

        {/* ─── Steps ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* STEP 1 */}
          <StepCard
            number={1}
            icon={CheckCircle2}
            title="שלב 1: בחירת פלטפורמה ופתיחת חשבון"
          >
            <p style={{ margin: 0 }}>
              כדי להתחיל, עליכם לבחור בורסה חוקית ומוסדרת. הנה כמה מהאפשרויות המובילות
              והאמינות ביותר שתומכות ב-<Ltr>Zcash</Ltr>:
            </p>
            <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ExchangeItem
                name="Kraken"
                desc={
                  <>
                    אחת הבורסות הוותיקות והמאובטחות בעולם. מציעה ממשק נוח מאוד
                    למתחילים ותמיכה מצוינת במשיכות <Ltr>ZEC</Ltr>.
                  </>
                }
              />
              <ExchangeItem
                name="Binance"
                desc={
                  <>
                    בורסת הקריפטו הגדולה בעולם מבחינת נפח מסחר. מציעה עמלות נמוכות
                    ומגוון רחב של אפשרויות הפקדה.
                  </>
                }
              />
              <ExchangeItem
                name="KuCoin / Bybit"
                desc={
                  <>
                    בורסות בינלאומיות פופולריות נוספות המהוות חלופות מצוינות, עם
                    נזילות גבוהה למסחר ב-<Ltr>ZEC</Ltr>.
                  </>
                }
              />
            </ul>
            <p style={{ margin: 0, fontWeight: 600, color: '#09090B' }}>
              תהליך ההרשמה (זהה בכולן):
            </p>
            <ol style={orderedListStyle}>
              <li>
                <strong style={{ color: '#09090B' }}>הרשמה:</strong> היכנסו לאתר הרשמי
                של הבורסה שבחרתם (או הורידו את האפליקציה שלה) ופתחו חשבון עם אימייל
                וסיסמה חזקה.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>
                  אימות זהות (<Ltr>KYC</Ltr>):
                </strong>{' '}
                על פי חוקי הלבנת הון הבינלאומיים, תתבקשו לאמת את זהותכם. זהו הליך
                סטנדרטי הכולל העלאת צילום של תעודה מזהה וסלפי קצר. האימות לרוב מאושר
                תוך מספר דקות.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>הגדרת אבטחה (חובה!):</strong>{' '}
                לפני שמפקידים כסף, חובה להפעיל אימות דו-שלבי (<Ltr>2FA</Ltr>). הורידו
                אפליקציה כמו <Ltr>Google Authenticator</Ltr> לטלפון שלכם וקשרו אותה
                לחשבון הבורסה. זה יבטיח שגם אם מישהו יגלה את הסיסמה שלכם, הוא לא יוכל
                להיכנס לחשבון.
              </li>
            </ol>
          </StepCard>

          {/* STEP 2 */}
          <StepCard number={2} icon={CreditCard} title="שלב 2: הפקדת כספים לחשבון">
            <p style={{ margin: 0 }}>
              כעת, כשהחשבון מאושר ומאובטח, הגיע הזמן לטעון אותו בכסף.
            </p>
            <ol style={orderedListStyle}>
              <li>
                חפשו בתפריט הראשי של הבורסה את האפשרות <Ltr>Deposit</Ltr> (הפקדה) או{' '}
                <Ltr>Buy Crypto</Ltr> (קניית קריפטו).
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span>
                  <strong style={{ color: '#09090B' }}>בחירת אמצעי תשלום:</strong>
                </span>
                <ul style={bulletListStyle}>
                  <li>
                    <strong style={{ color: '#09090B' }}>כרטיס אשראי:</strong> הדרך
                    המהירה ביותר, אך עשויה לגרור עמלות סליקה מעט גבוהות יותר.
                  </li>
                  <li>
                    <strong style={{ color: '#09090B' }}>
                      העברה בנקאית (<Ltr>SWIFT/SEPA</Ltr>):
                    </strong>{' '}
                    לרוב זולה משמעותית מבחינת עמלות, אך הכסף עשוי להופיע בחשבון רק
                    לאחר מספר ימי עסקים.
                  </li>
                </ul>
              </li>
              <li>
                הזינו את הסכום שברצונכם להשקיע והשלימו את הפעולה מול הבורסה.
              </li>
            </ol>
          </StepCard>

          {/* STEP 3 */}
          <StepCard
            number={3}
            icon={Coins}
            title={
              <>
                שלב 3: רכישת ה-<Ltr>Zcash</Ltr> (<Ltr>ZEC</Ltr>)
              </>
            }
          >
            <p style={{ margin: 0 }}>
              הכסף שהפקדתם יושב כעת ביתרה שלכם בבורסה. עכשיו פשוט נמיר אותו למטבעות{' '}
              <Ltr>ZEC</Ltr>.
            </p>
            <ol style={orderedListStyle}>
              <li>
                גשו לאזור המסחר (<Ltr>Trade</Ltr>) או ההמרה (<Ltr>Convert</Ltr>)
                בבורסה.
              </li>
              <li>
                חפשו את המטבע <Ltr>ZEC</Ltr> ובחרו בצמד המסחר שמתאים למטבע שהפקדתם
                (למשל, <Ltr>ZEC/USD</Ltr> לדולרים, או <Ltr>ZEC/USDT</Ltr> אם קניתם
                קודם מטבע יציב).
              </li>
              <li>
                הזינו את הסכום שברצונכם להמיר, ולחצו על <Ltr>Buy</Ltr> (קנייה).
              </li>
              <li>
                ברכות! מטבעות ה-<Ltr>Zcash</Ltr> מופיעים כעת בארנק שלכם בתוך הבורסה.
              </li>
            </ol>
          </StepCard>

          {/* ─── Golden Rule blockquote ─────────────────────────────────────── */}
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              margin: '6px 0',
              padding: 'clamp(22px, 4.8vw, 34px) clamp(22px, 4.8vw, 36px)',
              borderInlineStart: `4px solid ${AMBER}`,
              backgroundColor: '#FFFBEB',
              borderRadius: '0 14px 14px 0',
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: AMBER,
                letterSpacing: '0.12em',
                marginBottom: 14,
              }}
            >
              <Ltr>THE GOLDEN RULE OF CRYPTO</Ltr>
            </span>
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                lineHeight: 1.8,
                fontStyle: 'italic',
                color: '#09090B',
                fontWeight: 500,
              }}
            >
              &ldquo;לא המפתחות שלך, לא המטבעות שלך&rdquo;. השארת המטבעות בבורסה
              משמעותה שהם עדיין לא באמת שלכם – הם בפיקדון אצל חברה צד-שלישי. כדי
              להבטיח את חירותכם הפיננסית ואת הפרטיות שלכם, חובה להעביר אותם לארנק
              הפרטי שלכם.
            </p>
          </motion.blockquote>

          {/* STEP 4 */}
          <StepCard
            number={4}
            icon={Wallet}
            title={
              <>
                שלב 4: העברת המטבעות לארנק <Ltr>Zodl</Ltr> שלכם
              </>
            }
          >
            <p style={{ margin: 0 }}>
              זהו השלב החשוב ביותר: משיכת המטבעות לארנק שבו רק לכם יש שליטה על
              המפתחות. אם עדיין לא התקנתם את ארנק <Ltr>Zodl</Ltr> וגיביתם את מילות
              השחזור, אנא עשו זאת לפני שתמשיכו.
            </p>
            <Link
              href="/guides/start?tab=open-wallet"
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 18px',
                minHeight: 44,
                borderRadius: 10,
                border: '1px solid #E4E4E7',
                backgroundColor: '#FFFFFF',
                color: '#09090B',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                flexWrap: 'wrap',
                transition: 'background-color 0.15s, border-color 0.15s, gap 0.18s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#FFFBEB'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#F3B13260'
                ;(e.currentTarget as HTMLElement).style.gap = '14px'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#E4E4E7'
                ;(e.currentTarget as HTMLElement).style.gap = '10px'
              }}
            >
              <Wallet size={16} color={AMBER} />
              <span>
                עדיין לא פתחתם ארנק <Ltr>Zodl</Ltr>? לחצו כאן למדריך ההתקנה
              </span>
              <ArrowLeft size={14} color="#71717A" />
            </Link>
            <ol style={orderedListStyle}>
              <li style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span>
                  <strong style={{ color: '#09090B' }}>מציאת הכתובת בארנק:</strong>{' '}
                  פתחו את אפליקציית <Ltr>Zodl</Ltr> שלכם ולחצו על <Ltr>Receive</Ltr>{' '}
                  (קבל). על המסך תופיע הכתובת האישית שלכם.
                </span>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #F3B13230',
                    fontSize: '0.88rem',
                    color: '#475569',
                    lineHeight: 1.8,
                  }}
                >
                  <strong style={{ color: '#09090B' }}>הערה חשובה:</strong> ודאו
                  שאתם משתמשים בכתובת פרטית ומוגנת (<Ltr>Shielded Address</Ltr>).
                  כתובות אלו מתחילות באות <Ltr>z</Ltr> וארוכות יותר מכתובות שקופות
                  (המתחילות ב-<Ltr>t</Ltr>). העתיקו את הכתובת.
                </div>
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>בקשת משיכה מהבורסה:</strong>{' '}
                חזרו לבורסה שלכם, גשו לאזור המשיכות (
                <Ltr>Withdraw / Withdrawal</Ltr>), ובחרו במטבע <Ltr>ZEC</Ltr>.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>הדבקת הכתובת:</strong> הדביקו
                את כתובת ה-<Ltr>Zodl</Ltr> שהעתקתם אל תוך שורת &ldquo;כתובת
                היעד&rdquo; (<Ltr>Destination / Recipient Address</Ltr>).
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>בדיקה כפולה:</strong> לעולם אל
                תסמכו על &ldquo;העתק-הדבק&rdquo; באופן עיוור. בדקו תמיד ש-4 האותיות
                הראשונות ו-4 האותיות האחרונות של הכתובת שהדבקתם בבורסה זהות לחלוטין
                למה שמופיע באפליקציית <Ltr>Zodl</Ltr>.
              </li>
              <li>
                <strong style={{ color: '#09090B' }}>אישור:</strong> הזינו את הסכום
                שברצונכם למשוך ואשרו את הפעולה. תתבקשו כנראה לאמת את המשיכה דרך קוד
                ה-<Ltr>2FA</Ltr> שלכם ואישור במייל.
              </li>
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
            background:
              'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
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
              fontSize: 'clamp(1.25rem, 3.6vw, 1.55rem)',
              fontWeight: 800,
              color: '#09090B',
              letterSpacing: '-0.01em',
            }}
          >
            סיימנו!
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.92rem, 2.5vw, 1rem)',
              lineHeight: 1.85,
              color: '#475569',
            }}
          >
            תוך מספר דקות, רשת הבלוקצ&apos;יין תאשר את ההעברה. תקבלו התראה באפליקציית{' '}
            <Ltr>Zodl</Ltr>, והמטבעות יופיעו ביתרה שלכם. מרגע זה, הכסף נמצא בשליטתכם
            המוחלטת, והפרטיות שלכם מובטחת.
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
