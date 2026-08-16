import { cn } from '@/lib/cn'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'main' | 'section'
}

export default function PageContainer({ children, className, as: Component = 'div' }: PageContainerProps) {
  return (
    <Component className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  )
}
