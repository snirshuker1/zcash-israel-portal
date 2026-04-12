'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const AMBER = '#F3B132'

// ─── Data ─────────────────────────────────────────────────────────────────────
// Edit this array to update supporters without touching any component code.

interface SupporterPerson {
  name: string
  role: string
  initials: string
  avatarGradient: string
  href?: string
  imageSrc?: string
}

interface Supporter extends SupporterPerson {
  /** If set, renders two people in one card separated by a divider */
  duo?: SupporterPerson
  /** Shared role line shown below both people in a duo card */
  duoRole?: string
}

export const SUPPORTERS: Supporter[] = [
  {
    name: 'Zooko Wilcox',
    role: 'מייסד Zcash וחלוץ קריפטוגרפיה',
    initials: 'ZW',
    avatarGradient: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)',
    imageSrc: '/avatars/zooko.jpg',
    href: 'https://twitter.com/zooko',
  },
  {
    name: 'Edward Snowden',
    role: 'פעיל זכויות פרטיות וחושף שחיתויות',
    initials: 'ES',
    avatarGradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
    imageSrc: '/avatars/snowden.jpg',
    href: 'https://twitter.com/Snowden',
  },
  {
    name: 'Vitalik Buterin',
    role: 'מייסד Ethereum ותומך בטכנולוגיית הפרטיות של Zcash',
    initials: 'VB',
    avatarGradient: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)',
    imageSrc: '/avatars/vitalik.jpg',
    href: 'https://twitter.com/VitalikButerin',
  },
  {
    name: 'Chamath Palihapitiya',
    role: 'משקיע הון סיכון וממייסדי Social Capital',
    initials: 'CP',
    avatarGradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    imageSrc: '/avatars/chamath.jpg',
    href: 'https://twitter.com/chamath',
  },
  {
    name: 'Balaji Srinivasan',
    role: 'לשעבר CTO של Coinbase, יזם וכותב',
    initials: 'BS',
    avatarGradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    imageSrc: '/avatars/balaji.jpg',
    href: 'https://twitter.com/balajis',
  },
  {
    name: 'Naval Ravikant',
    role: 'מייסד AngelList, משקיע ופילוסוף של ריבונות אישית',
    initials: 'NR',
    avatarGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
    imageSrc: '/avatars/naval.jpg',
    href: 'https://twitter.com/naval',
  },
  {
    name: 'Barry Silbert',
    role: 'מייסד Digital Currency Group ואחד ממשקיעי הקריפטו הגדולים בעולם',
    initials: 'BS',
    avatarGradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
    imageSrc: '/avatars/barry-silbert.jpg',
    href: 'https://twitter.com/BarrySilbert',
  },
  {
    name: 'Tyler Winklevoss',
    role: 'ממייסדי Gemini, מיליארדר ביטקוין מוקדם ותומך בולט ב-Zcash ובפרטיות פיננסית',
    initials: 'TW',
    avatarGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    imageSrc: '/avatars/winklevoss.jpg',
    href: 'https://twitter.com/tyler',
  },
  {
    name: 'Cameron Winklevoss',
    role: 'ממייסדי Gemini, משקיע הון סיכון וחלוץ בעולם הקריפטו עם מיקוד בתשתית מבוזרת',
    initials: 'CW',
    avatarGradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    imageSrc: '/avatars/cameron-winklevoss.jpg',
    href: 'https://twitter.com/cameron',
  },
  {
    name: 'Tim Ferriss',
    role: 'מחבר "שבוע העבודה של ארבע שעות", משקיע ומגיש פודקאסט',
    initials: 'TF',
    avatarGradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
    imageSrc: '/avatars/tim-ferriss.jpg',
    href: 'https://twitter.com/tferriss',
  },
  {
    name: 'David Friedberg',
    role: 'מייסד The Production Board ומגיש All-In Podcast',
    initials: 'DF',
    avatarGradient: 'linear-gradient(135deg, #4a1d96 0%, #7c3aed 100%)',
    imageSrc: '/avatars/david-friedberg.jpg',
    href: 'https://twitter.com/friedberg',
  },
]

// ─── Avatar ───────────────────────────────────────────────────────────────────
// Mirrors Shadcn's Avatar pattern: tries image first, falls back to initials.

function Avatar({
  src,
  name,
  initials,
  gradient,
  size = 80,
}: {
  src?: string
  name: string
  initials: string
  gradient: string
  size?: number
}) {
  const [imgError, setImgError] = useState(false)
  const showImage = !!src && !imgError

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        background: gradient,
      }}
    >
      {showImage ? (
        // AvatarImage
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        // AvatarFallback
        <div
          aria-label={name}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: 700,
            fontSize: size * 0.28,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  )
}

// ─── PersonSlot — one person inside a card (used for both single and duo) ──────

function PersonSlot({
  person,
  hovered,
  avatarSize = 78,
}: {
  person: SupporterPerson
  hovered: boolean
  avatarSize?: number
}) {
  return (
    <div
      className="supporter-person"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}
    >
      <div
        className="supporter-avatar-ring"
        style={{
          padding: 3,
          borderRadius: '50%',
          background: hovered ? `linear-gradient(135deg, ${AMBER}40, ${AMBER}15)` : 'transparent',
          transition: 'background 0.2s',
        }}
      >
        <Avatar
          src={person.imageSrc}
          name={person.name}
          initials={person.initials}
          gradient={person.avatarGradient}
          size={avatarSize}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          dir="ltr"
          className="supporter-name"
          style={{ fontSize: '0.95rem', fontWeight: 700, color: '#09090B', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 5 }}
        >
          {person.name}
        </p>
        <p
          className="supporter-role"
          style={{ fontSize: '0.78rem', color: '#71717A', lineHeight: 1.55, maxWidth: 180, margin: '0 auto' }}
        >
          {person.role}
        </p>
      </div>
      {person.href && (
        <a
          href={person.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="supporter-profile"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono), monospace', fontSize: '0.6rem',
            color: hovered ? AMBER : '#A1A1AA', textDecoration: 'none',
            letterSpacing: '0.06em', transition: 'color 0.15s',
          }}
          dir="ltr"
        >
          <ExternalLink size={10} />
          PROFILE
        </a>
      )}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function SupporterCard({ supporter, index }: { supporter: Supporter; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`supporter-card${supporter.duo ? ' supporter-card--duo' : ''}`}
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${hovered ? AMBER + '60' : '#E4E4E7'}`,
          borderRadius: 14,
          padding: '28px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          textAlign: 'center',
          transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
          boxShadow: hovered
            ? '0 8px 24px rgba(0,0,0,0.07), 0 2px 8px rgba(243,177,50,0.06)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          position: 'relative',
          height: '100%',
        }}
      >
        {/* Amber top accent bar on hover */}
        <div
          style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: hovered ? 40 : 0, height: 2,
            backgroundColor: AMBER, borderRadius: '0 0 2px 2px',
            transition: 'width 0.25s ease',
          }}
        />

        {supporter.duo ? (
          /* ── Duo layout (side by side) ── */
          <>
            <div
              className="supporter-duo-row"
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 0, width: '100%' }}
            >
              <div style={{ flex: 1 }}>
                <PersonSlot person={supporter} hovered={hovered} avatarSize={64} />
              </div>
              <div style={{ width: 1, backgroundColor: '#E4E4E7', alignSelf: 'stretch', margin: '0 8px' }} />
              <div style={{ flex: 1 }}>
                <PersonSlot person={supporter.duo} hovered={hovered} avatarSize={64} />
              </div>
            </div>
            {supporter.duoRole && (
              <>
                <div style={{ width: '100%', height: 1, backgroundColor: '#E4E4E7' }} />
                <p
                  className="supporter-duo-role"
                  style={{ fontSize: '0.78rem', color: '#71717A', lineHeight: 1.55, textAlign: 'center', margin: 0 }}
                >
                  {supporter.duoRole}
                </p>
              </>
            )}
          </>
        ) : (
          /* ── Single layout ── */
          <PersonSlot person={supporter} hovered={hovered} avatarSize={78} />
        )}
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function SupportersSection() {
  return (
    <section
      id="supporters"
      style={{ backgroundColor: '#FFFFFF', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <span
            dir="ltr"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.65rem',
              color: '#A1A1AA',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            KEY_SUPPORTERS
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#09090B',
              marginBottom: 12,
              lineHeight: 1.25,
            }}
          >
            דמויות מפתח התומכות בחופש ופרטיות
          </h2>
          <p
            style={{
              color: '#71717A',
              fontSize: '0.9rem',
              maxWidth: 440,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            אנשים שמבינים את ערך הפרטיות הפיננסית ומכירים בכך ש-{' '}
            <span dir="ltr" className="inline-block">
              Zcash
            </span>{' '}
            מספקת אותה ברמת הפרוטוקול.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="supporters-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: 14,
            justifyItems: 'stretch',
          }}
        >
          {SUPPORTERS.map((supporter, i) => (
            <SupporterCard key={supporter.name} supporter={supporter} index={i} />
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
          dir="ltr"
          style={{
            marginTop: 40,
            textAlign: 'center',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.62rem',
            color: '#D4D4D8',
            letterSpacing: '0.06em',
          }}
        >
          Public statements and endorsements · Not financial advice
        </motion.p>
      </div>
    </section>
  )
}
