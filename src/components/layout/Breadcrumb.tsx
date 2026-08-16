import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/types'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted py-4">
      <Link to="/" className="hover:text-primary-500 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5" />
          {item.path ? (
            <Link to={item.path} className="hover:text-primary-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark-text font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
