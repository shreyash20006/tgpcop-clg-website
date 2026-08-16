import { useState } from 'react'
import { cn } from '@/lib/cn'

interface BrandLogoProps {
  /** Visual context — dark marks sit on white surfaces, light marks on navy */
  variant?: 'dark' | 'light'
  className?: string
}

/** Official TGPCOP logo lockup (emblem + college name), auto-optimized by Cloudinary */
export const LOGO_URL =
  'https://res.cloudinary.com/dsqxboxoc/image/upload/f_auto,q_auto,w_560/v1786880201/ChatGPT_Image_Aug_16_2026_05_06_11_PM_rra1cm.png'

/**
 * Official TGPCOP logo. The source image carries a white background and a
 * ~3:1 lockup aspect, so the light variant sits on a white rounded chip to
 * look intentional on navy surfaces. Falls back to a brand-colored crest
 * only if the remote image fails to load.
 */
export default function BrandLogo({ variant = 'dark', className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false)
  const isDark = variant === 'dark'

  if (!failed) {
    return (
      <img
        src={LOGO_URL}
        alt="Tulsiramji Gaikwad-Patil College of Pharmacy"
        className={cn(
          'h-10 md:h-12 w-auto object-contain',
          !isDark && 'bg-white rounded-lg px-2 py-1 shadow-sm',
          className
        )}
        onError={() => setFailed(true)}
        draggable={false}
      />
    )
  }

  // Fallback crest (brand colors) if the remote logo cannot load
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="TGPCOP logo"
      className={cn('w-10 h-10 shrink-0', className)}
    >
      <path
        d="M24 2 42 8v14c0 11.2-7.52 20.4-18 24C13.52 42.4 6 33.2 6 22V8l18-6Z"
        fill={isDark ? '#0B2341' : '#FFFFFF'}
      />
      <path d="M6 13.5h36v4H6z" fill="#F58220" />
      <path d="M9.6 34.6h28.8c-.86 1.66-1.9 3.2-3.08 4.6H12.68a24.6 24.6 0 0 1-3.08-4.6Z" fill="#2E9E5B" />
      <g fill="none" stroke={isDark ? '#FFFFFF' : '#0B2341'} strokeWidth="2.4" strokeLinecap="round">
        <path d="M16.5 22.5h15l-1.2 4.2a6.9 6.9 0 0 1-6.6 4.9h-.6a6.9 6.9 0 0 1-6.6-4.9l-1.2-4.2Z" />
        <path d="m29.5 20.5 4.5-5.5" stroke="#F58220" />
      </g>
      <circle cx="24" cy="18.6" r="1.5" fill="#F58220" />
    </svg>
  )
}
