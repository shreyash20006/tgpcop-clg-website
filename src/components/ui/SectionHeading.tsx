import { cn } from '@/lib/cn'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface SectionHeadingProps {
  label?: string
  heading: string
  description?: string
  ctaLabel?: string
  ctaLink?: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  label,
  heading,
  description,
  ctaLabel,
  ctaLink,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8', align === 'center' && 'text-center', className)}>
      {label && (
        <span className="inline-block text-cyan-500 text-sm font-heading font-semibold uppercase tracking-wider mb-2">
          {label}
        </span>
      )}
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-navy-900 mb-3">{heading}</h2>
      {description && (
        <p className={cn('text-muted text-sm md:text-base max-w-2xl leading-relaxed', align === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
      {ctaLabel && ctaLink && (
        <Link
          to={ctaLink}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
