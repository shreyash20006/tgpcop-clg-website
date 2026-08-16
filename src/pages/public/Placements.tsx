import { Briefcase, Building2, GraduationCap, Compass } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

export default function Placements() {
  useSeo({
    title: 'Placements',
    description: 'Placements and career guidance at TGPCOP Nagpur.',
  })

  return (
    <>
      <PageHeader
        title="Placements & Careers"
        description="Supporting students as they step into the pharmaceutical industry."
        breadcrumbItems={[{ label: 'Placements' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {[
            { icon: Briefcase, title: 'Placement Support', description: 'Guidance on career pathways in pharmacy.' },
            { icon: Building2, title: 'Recruiters', description: 'Industry connections for campus recruitment.' },
            { icon: GraduationCap, title: 'Internships', description: 'Practical industry exposure for students.' },
            { icon: Compass, title: 'Career Guidance', description: 'Mentorship for higher studies and careers.' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-border rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-light-bg border border-border rounded-xl p-6 text-sm text-muted leading-relaxed">
          As a college established in 2023, placement statistics, recruiter lists and success stories
          will be published here as our first cohorts graduate and verified data becomes available.
          All figures on this page will come from the college administration — no projected or
          estimated statistics are displayed.
        </div>
      </PageContainer>
    </>
  )
}
