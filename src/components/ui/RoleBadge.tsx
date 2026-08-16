import type { UserRole } from '@/types/database'
import { cn } from '@/lib/cn'
import { ROLE_LABELS, ROLE_BADGE_CLASSES } from '@/lib/adminRoles'

export default function RoleBadge({ role, className }: { role?: UserRole | string | null; className?: string }) {
  if (!role) return null
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-heading font-semibold uppercase tracking-wide',
        ROLE_BADGE_CLASSES[role] ?? ROLE_BADGE_CLASSES.student,
        className
      )}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}
