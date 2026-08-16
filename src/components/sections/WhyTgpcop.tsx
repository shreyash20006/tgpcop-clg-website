import { FlaskConical, BookOpen, Users, Building2, Award, HeartPulse } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'

const features = [
  {
    icon: FlaskConical,
    title: 'Practical Laboratory Learning',
    description: 'Hands-on training in pharmaceutical laboratories across core disciplines.',
  },
  {
    icon: Award,
    title: 'PCI & DTE Approved',
    description: 'Programs recognized by the Pharmacy Council of India and DTE Maharashtra.',
  },
  {
    icon: BookOpen,
    title: 'Industry-Aligned Curriculum',
    description: 'Syllabus set by DBATU, designed around the needs of the pharmaceutical industry.',
  },
  {
    icon: Users,
    title: 'Mentor-Focused Teaching',
    description: 'Learning guided by qualified faculty in compact classroom settings.',
  },
  {
    icon: Building2,
    title: 'Growing Campus',
    description: 'A developing campus on Wardha Road with modern academic infrastructure.',
  },
  {
    icon: HeartPulse,
    title: 'Healthcare Focus',
    description: 'Education anchored in the college’s mission of service to healthcare.',
  },
]

export default function WhyTgpcop() {
  return (
    <section className="py-16 md:py-24 bg-navy-900">
      <PageContainer>
        <SectionHeading
          label="Why TGPCOP"
          heading="An institution built around student success"
          description="Everything at TGPCOP — from curriculum to campus — is designed to prepare students for meaningful careers in pharmaceutical sciences."
          align="center"
          className="[&_h2]:text-white [&_p:last-child]:text-white/60"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-heading font-semibold text-base text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
