import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Award, Landmark, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { SITE } from '@/lib/site'

const badges = [
  { icon: ShieldCheck, label: 'PCI Approved' },
  { icon: Award, label: 'DTE Approved' },
  { icon: Landmark, label: 'DBATU Affiliated' },
]

export default function AboutSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="py-16 md:py-24 bg-light-bg">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Campus video */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden bg-navy-950 aspect-[4/3]"
          >
            <video
              src="https://res.cloudinary.com/dsqxboxoc/video/upload/v1786899422/tgpcop_nagpur_14050525_222641717_le6ze7.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="TGPCOP campus video"
            />
          </motion.div>

          {/* Copy */}
          <div>
            <SectionHeading
              label="About TGPCOP"
              heading="Building Knowledge. Creating Healthcare Innovators."
              className="mb-6"
            />
            <div className="space-y-4 text-dark-text/90 text-sm md:text-base leading-relaxed font-body">
              <p>
                Tulsiramji Gaikwad-Patil College of Pharmacy was established in {SITE.established} by{' '}
                {SITE.parentTrust}. The college is affiliated to {SITE.university} and approved by the
                Pharmacy Council of India and the Directorate of Technical Education, Maharashtra.
              </p>
              <p>
                The institution is committed to imparting quality pharmaceutical education that blends
                strong academic foundations with practical, industry-focused learning.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full text-sm font-heading font-medium text-navy-900"
                >
                  <badge.icon className="w-4 h-4 text-cyan-500" />
                  {badge.label}
                </span>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-500 text-white font-heading font-medium rounded-md hover:bg-primary-600 transition-colors"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
