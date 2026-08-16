import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { SITE } from '@/lib/site'

export default function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-light-bg">
      <PageContainer>
        <SectionHeading
          label="Contact"
          heading="Get in touch"
          description="Have questions about admissions, programs or campus life? We're here to help."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">Visit Us</h3>
            <p className="text-muted text-sm leading-relaxed">{SITE.address}</p>
          </a>
          <a
            href={SITE.phoneHref}
            className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">Call Us</h3>
            <p className="text-muted text-sm">{SITE.phone}</p>
          </a>
          <a
            href={SITE.emailHref}
            className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">Email Us</h3>
            <p className="text-muted text-sm break-all">{SITE.email}</p>
          </a>
        </div>
        <div className="text-center mt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-heading font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            Contact Page
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageContainer>
    </section>
  )
}
