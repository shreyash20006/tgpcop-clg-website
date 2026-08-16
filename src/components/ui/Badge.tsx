import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-heading font-medium',
        variant === 'default' && 'bg-light-bg text-muted',
        variant === 'success' && 'bg-green-50 text-green-700',
        variant === 'warning' && 'bg-amber-50 text-amber-700',
        variant === 'error' && 'bg-red-50 text-red-700',
        variant === 'info' && 'bg-blue-50 text-blue-700',
        variant === 'primary' && 'bg-primary-50 text-primary-500',
        className
      )}
    >
      {children}
    </span>
  )
}
