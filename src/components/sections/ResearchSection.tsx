import { Link } from 'react-router-dom'
import { Microscope, BookMarked, GraduationCap, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'

const highlights = [
  {
    icon: Microscope,
    title: 'Research Areas',
    description: 'Focus areas across pharmaceutical sciences guided by faculty expertise.',
  },
  {
    icon: BookMarked,
    title: 'Publications',
    description: 'Research output by faculty and students, updated as work is published.',
  },
  {
    icon: GraduationCap,
    title: 'Student Research',
    description: 'Opportunities for students to engage in guided research projects.',
  },
]

export default function ResearchSection() {
  return (
    <section className="py-16 md:py-24 bg-light-bg">
      <PageContainer>
        <div className="max-w-3xl">
          <SectionHeading
            label="Research"
            heading="Advancing pharmaceutical knowledge"
            description="TGPCOP encourages a culture of inquiry — supporting faculty research and involving students in meaningful scientific work."
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <highlight.icon className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">
                {highlight.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
        <Link
          to="/research"
          className="inline-flex items-center gap-1.5 mt-8 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          Explore research at TGPCOP
          <ArrowRight className="w-4 h-4" />
        </Link>
      </PageContainer>
    </section>
  )
}
