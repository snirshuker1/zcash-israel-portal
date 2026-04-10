'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, ShieldCheck, MapPin, ArrowLeft, type LucideIcon } from 'lucide-react'

const AMBER = '#F3B132'

interface CardData {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  href: string
  tag: string
}

const cards: CardData[] = [
  {
    icon: BookOpen,
    title: 'מדריכים למשתמש',
    subtitle: 'Step-by-step guides',
    description:
      'כיצד לפתוח ארנק Zodl, לשלוח עסקאות מוגנות, ולהבין את מחזור החיים של עסקה ב-Zcash.',
    href: '/guides/start',
    tag: 'Zodl · Shielded Tx',
  },
  {
    icon: ShieldCheck,
    title: 'חשיבות הפרטיות',
    subtitle: 'Why Privacy?',
    description:
      "ההבדל בין בלוקצ'יין שקוף לכזה מוגן — ומדוע zk-SNARKs מספקים הגנה מוכחת מתמטית.",
    href: '/privacy-explained',
    tag: 'zk-SNARKs · Protocol',
  },
  {
    icon: MapPin,
    title: 'זיקאש בישראל',
    subtitle: 'Zcash in Israel',
    description:
      'היכן לרכוש ZEC בישראל, מה אומר חוק המיסוי, ועדכונים מתורגמים ממיסוד Zcash.',
    href: '/israel-context',
    tag: 'IL Context · Tax · ZEC',
  },
]

function Card({ card }: { card: CardData }) {
  const [hovered, setHovered] = useState(false)
  const Icon = card.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '100%',
        border: `1px solid ${hovered ? AMBER : '#E4E4E7'}`,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered
          ? '0 4px 16px rgba(243,177,50,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Icon badge */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: hovered ? '#FEF3C7' : '#FAFAFA',
          border: `1px solid ${hovered ? '#F3B13240' : '#E4E4E7'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      >
        <Icon size={18} color={hovered ? AMBER : '#71717A'} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#09090B',
            marginBottom: 4,
          }}
        >
          {card.title}
        </h3>
        <span
          dir="ltr"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.62rem',
            color: '#A1A1AA',
            letterSpacing: '0.06em',
            marginBottom: 10,
          }}
        >
          {card.subtitle}
        </span>
        <p
          style={{
            fontSize: '0.85rem',
            color: '#71717A',
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {card.description}
        </p>
      </div>

      {/* Footer row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 14,
          borderTop: '1px solid #E4E4E7',
        }}
      >
        <span
          dir="ltr"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.62rem',
            color: '#A1A1AA',
          }}
        >
          {card.tag}
        </span>
        <ArrowLeft
          size={14}
          color={hovered ? AMBER : '#A1A1AA'}
          style={{ transition: 'color 0.2s', flexShrink: 0 }}
        />
      </div>
    </div>
  )
}

export default function GettingStarted() {
  return (
    <section
      id="getting-started"
      style={{ backgroundColor: '#FAFAFA', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
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
            GETTING_STARTED
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#09090B',
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            מאיפה מתחילים?
          </h2>
          <p style={{ color: '#71717A', fontSize: '0.95rem', maxWidth: 480, margin: 0 }}>
            שלושה נתיבים לפי רמת ההיכרות שלך עם פרוטוקול{' '}
            <span dir="ltr" className="inline-block">
              Zcash
            </span>
            .
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{ display: 'flex' }}
            >
              <Link
                href={card.href}
                style={{ textDecoration: 'none', display: 'block', width: '100%' }}
              >
                <Card card={card} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
