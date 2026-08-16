import { useEffect, useState } from 'react'

interface PharmacyLoaderProps {
  onComplete?: () => void
  duration?: number
}

export default function PharmacyLoader({ onComplete, duration = 2800 }: PharmacyLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)

      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        setPhase('done')
        setTimeout(() => onComplete?.(), 400)
      }
    }

    requestAnimationFrame(tick)
  }, [duration, onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #071A33 0%, #0B2341 45%, #1D5290 100%)',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.4s ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Floating background particles ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'rgba(93,147,212,0.15)',
              animation: `floatParticle ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Pill + icon assembly ── */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        {/* Pulsing glow rings */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          border: '2px solid rgba(93,147,212,0.25)',
          animation: 'ringPulse 1.8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          border: '2px solid rgba(93,147,212,0.45)',
          animation: 'ringPulse 1.8s 0.4s ease-in-out infinite',
        }} />

        <svg
          width="124" height="124" viewBox="0 0 120 120" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'spinSlow 4s linear infinite' }}
        >
          {/* Backdrop circle */}
          <circle cx="60" cy="60" r="56"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(93,147,212,0.4)" strokeWidth="1.5" />

          {/* ── Pill capsule ── */}
          <g transform="translate(60,52) rotate(-35)">
            <path d="M-22,-11 Q-38,-11 -38,0 Q-38,11 -22,11 L0,11 L0,-11 Z"
              fill="#1557A6" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M22,-11 Q38,-11 38,0 Q38,11 22,11 L0,11 L0,-11 Z"
              fill="#F58220" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            {/* Shine on blue side */}
            <path d="M-22,-9 Q-35,-9 -36,-3 Q-30,-6 -18,-7 Z" fill="rgba(255,255,255,0.22)" />
            {/* Shine on orange side */}
            <path d="M22,-9 Q35,-9 36,-3 Q30,-6 18,-7 Z" fill="rgba(255,255,255,0.12)" />
          </g>

          {/* ── Medical cross ── */}
          <g transform="translate(60,36)">
            <rect x="-3.5" y="-10" width="7" height="20" rx="2.5" fill="#00BCE8" opacity="0.9" />
            <rect x="-10" y="-3.5" width="20" height="7" rx="2.5" fill="#00BCE8" opacity="0.9" />
          </g>

          {/* ── Mortar & Pestle ── */}
          <g transform="translate(60,80)">
            {/* Bowl */}
            <path d="M-15,0 Q-15,12 0,12 Q15,12 15,0 Z" fill="#164076" />
            <ellipse cx="0" cy="0" rx="15" ry="4" fill="#2E6FBE" />
            {/* Rim */}
            <ellipse cx="0" cy="0" rx="15" ry="4"
              fill="none" stroke="#5C93D4" strokeWidth="1" />
            {/* Pestle handle */}
            <rect x="-2" y="-18" width="4" height="20" rx="2" fill="#5C93D4" />
            {/* Pestle head */}
            <ellipse cx="0" cy="-18" rx="5" ry="3.5" fill="#5C93D4" />
          </g>
        </svg>
      </div>

      {/* ── Name block ── */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 11,
          letterSpacing: '0.3em',
          color: '#5C93D4',
          textTransform: 'uppercase',
          marginBottom: 6,
          animation: 'fadeUp 0.7s 0.3s both',
        }}>Welcome to</p>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.15,
          animation: 'fadeUp 0.7s 0.5s both',
        }}>TGPCOP Nagpur</h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: 'rgba(255,255,255,0.45)',
          marginTop: 5,
          animation: 'fadeUp 0.7s 0.7s both',
        }}>Takshashila Group of Pharmacy Colleges</p>
      </div>

      {/* ── DNA bounce dots ── */}
      <div style={{
        display: 'flex',
        gap: 7,
        marginBottom: 24,
        animation: 'fadeUp 0.7s 0.9s both',
      }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#1557A6' : '#F58220',
            boxShadow: i % 2 === 0
              ? '0 0 6px rgba(21,87,166,0.7)'
              : '0 0 6px rgba(245,130,32,0.7)',
            animation: `dnaBounce 0.9s ${i * 0.13}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div style={{ width: 230, animation: 'fadeUp 0.7s 1.0s both' }}>
        <div style={{
          height: 4,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 99,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 99,
            background: 'linear-gradient(90deg, #1557A6 0%, #00BCE8 50%, #F58220 100%)',
            backgroundSize: '200% 100%',
            transition: 'width 0.07s linear',
            animation: 'shimmer 1.8s linear infinite',
          }} />
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: '0.02em',
        }}>
          {Math.round(progress)}% — Preparing your experience...
        </p>
      </div>

      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1);    opacity: 0.9; }
          100% { transform: scale(1.2);  opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dnaBounce {
          from { transform: translateY(0px);  opacity: 0.4; }
          to   { transform: translateY(-9px); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position:  200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes floatParticle {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(14px, -20px) scale(1.4); }
        }
      `}</style>
    </div>
  )
}

/** Pre-computed particle positions so they don't shift on re-render */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7)  % 100,
  size: `${6 + (i % 5) * 4}px`,
  dur: 3 + (i % 4),
  delay: (i * 0.35) % 2.5,
}))
