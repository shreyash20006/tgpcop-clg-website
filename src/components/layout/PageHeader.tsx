import PageContainer from './PageContainer'
import Breadcrumb from './Breadcrumb'
import type { BreadcrumbItem } from '@/types'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbItems?: BreadcrumbItem[]
}

export default function PageHeader({ title, description, breadcrumbItems }: PageHeaderProps) {
  return (
    <div className="bg-navy-900 py-14 md:py-20">
      <PageContainer>
        {breadcrumbItems && (
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white mb-2">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        )}
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">{title}</h1>
        {description && (
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </PageContainer>
    </div>
  )
}
