import { cn } from '@/lib/cn'

interface BrandLogoProps {
  /** Visual context — dark marks sit on white surfaces, light marks on navy */
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * TGPCOP brand mark.
 *
 * This is a placeholder crest rendered in the official logo's colour family
 * (navy / royal blue / orange / green). To install the official logo, drop the
 * file at `public/images/logo.png` and replace this component's body with a
 * simple <img src="/images/logo.png" /> — proportions are already constrained
 * by the parent navbar/footer layout.
 */
export default function BrandLogo({ variant = 'dark', className }: BrandLogoProps) {
  const isDark = variant === 'dark'

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="TGPCOP logo"
      className={cn('w-10 h-10 shrink-0', className)}
    >
      {/* Shield */}
      <path
        d="M24 2 42 8v14c0 11.2-7.52 20.4-18 24C13.52 42.4 6 33.2 6 22V8l18-6Z"
        fill={isDark ? '#0B2341' : '#FFFFFF'}
      />
      {/* Orange band across the shield — links to the logo's orange */}
      <path d="M6 13.5h36v4H6z" fill="#F58220" />
      {/* Green base band — links to the logo's green */}
      <path d="M9.6 34.6h28.8c-.86 1.66-1.9 3.2-3.08 4.6H12.68a24.6 24.6 0 0 1-3.08-4.6Z" fill="#2E9E5B" />
      {/* Mortar & pestle — pharmaceutical identity */}
      <g fill="none" stroke={isDark ? '#FFFFFF' : '#0B2341'} strokeWidth="2.4" strokeLinecap="round">
        <path d="M16.5 22.5h15l-1.2 4.2a6.9 6.9 0 0 1-6.6 4.9h-.6a6.9 6.9 0 0 1-6.6-4.9l-1.2-4.2Z" />
        <path d="m29.5 20.5 4.5-5.5" stroke="#F58220" />
      </g>
      <circle cx="24" cy="18.6" r="1.5" fill="#F58220" />
    </svg>
  )
}
