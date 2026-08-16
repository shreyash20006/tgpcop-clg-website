import { Microscope, BookMarked, Lightbulb } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'

export default function Research() {
  useSeo({
    title: 'Research',
    description: 'Research at TGPCOP Nagpur — research areas, projects, publications and achievements.',
  })

  return (
    <>
      <PageHeader
        title="Research"
        description="Fostering a culture of inquiry, innovation and scientific contribution."
        breadcrumbItems={[{ label: 'Research' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="max-w-3xl">
          <SectionHeading
            label="Overview"
            heading="Research at TGPCOP"
            description="The college encourages faculty and students to pursue research across pharmaceutical sciences. Detailed research output will be published here as projects and publications are formally documented."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[
            {
              icon: Microscope,
              title: 'Research Areas',
              description: 'Departmental focus areas spanning core pharmaceutical disciplines.',
            },
            {
              icon: Lightbulb,
              title: 'Projects',
              description: 'Ongoing and proposed research work by faculty and students.',
            },
            {
              icon: BookMarked,
              title: 'Publications',
              description: 'Peer-reviewed publications authored by the TGPCOP community.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-border rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-light-bg border border-border rounded-xl p-6 text-sm text-muted leading-relaxed">
          Research projects, publications and achievements will be listed here once verified data is
          available from the college administration. This section is managed through the admin CMS —
          no placeholder research data is displayed by design.
        </div>
      </PageContainer>
    </>
  )
}
