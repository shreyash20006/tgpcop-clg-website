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
    <section className="py-16 md:py-24 bg-navy-900">
      <PageContainer>
        <SectionHeading
          label="Research"
          heading="Advancing pharmaceutical knowledge"
          description="TGPCOP encourages a culture of inquiry — supporting faculty research and involving students in meaningful scientific work."
          className="[&_h2]:text-white [&_p:last-child]:text-white/60"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 hover:border-accent-500/50 transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-accent-500/15 flex items-center justify-center mb-4">
                <highlight.icon className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="font-heading font-semibold text-base text-white mb-2">
                {highlight.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
        <Link
          to="/research"
          className="inline-flex items-center gap-1.5 mt-8 text-sm font-heading font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Explore research at TGPCOP
          <ArrowRight className="w-4 h-4" />
        </Link>
      </PageContainer>
    </section>
  )
}
