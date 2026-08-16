import { FlaskConical, Library, Presentation, MonitorSmartphone, Trophy, Building2 } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'

const facilities = [
  {
    icon: FlaskConical,
    title: 'Laboratories',
    description:
      'Pharmaceutics, pharmacology, pharmaceutical chemistry and pharmacognosy labs built to PCI norms.',
  },
  {
    icon: Library,
    title: 'Library',
    description:
      'A growing collection of textbooks, reference books, journals and digital learning resources.',
  },
  {
    icon: Presentation,
    title: 'Classrooms & Seminar Hall',
    description:
      'Spacious, well-ventilated classrooms and a seminar hall for lectures and events.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Computer Facilities',
    description:
      'Computer lab with internet access supporting digital learning and e-resources.',
  },
  {
    icon: Trophy,
    title: 'Sports',
    description: 'Indoor and outdoor sports facilities encouraging physical activity and teamwork.',
  },
  {
    icon: Building2,
    title: 'Infrastructure',
    description:
      'A developing campus on NH-44, Wardha Road with modern academic infrastructure.',
  },
]

export default function Campus() {
  useSeo({
    title: 'Campus',
    description: 'Campus and facilities at TGPCOP Nagpur — laboratories, library, classrooms, seminar hall, computer facilities and sports.',
  })

  return (
    <>
      <PageHeader
        title="Campus & Facilities"
        description="Infrastructure supporting quality pharmaceutical education at TGPCOP."
        breadcrumbItems={[{ label: 'Campus' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <SectionHeading
          label="Infrastructure"
          heading="Explore our campus"
          description="Facilities at TGPCOP are designed to support both academic learning and student wellbeing."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-br from-navy-900 to-primary-600 h-36 flex items-center justify-center">
                <facility.icon className="w-10 h-10 text-white/25" aria-hidden="true" />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">
                  {facility.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-light-bg border border-border rounded-xl p-6 text-sm text-muted leading-relaxed">
          Hostel and cafeteria details will be published once officially confirmed by the college
          administration. For specific facility enquiries, please contact the college office.
        </div>
      </PageContainer>
    </>
  )
}
