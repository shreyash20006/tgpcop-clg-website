import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import { useSeo } from '@/lib/seo'

export default function NotFound() {
  useSeo({ title: 'Page Not Found' })

  return (
    <PageContainer className="py-24 md:py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-light-bg flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-primary-500" />
      </div>
      <p className="font-heading font-bold text-6xl text-navy-900 mb-3">404</p>
      <h1 className="font-heading font-semibold text-xl text-navy-900 mb-2">Page not found</h1>
      <p className="text-muted text-sm max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-heading font-medium text-sm rounded-md hover:bg-primary-600 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center px-6 py-3 border border-border text-dark-text font-heading font-medium text-sm rounded-md hover:bg-light-bg transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </PageContainer>
  )
}
