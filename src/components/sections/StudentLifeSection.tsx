import { Link } from 'react-router-dom'
import { FlaskConical, Trophy, Users, Palette, Megaphone, HeartHandshake, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'

const activities = [
  { icon: FlaskConical, label: 'Technical Activities' },
  { icon: Palette, label: 'Cultural' },
  { icon: Trophy, label: 'Sports' },
  { icon: Users, label: 'Student Council' },
  { icon: Megaphone, label: 'Media' },
  { icon: HeartHandshake, label: 'Social Initiatives' },
]

export default function StudentLifeSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              label="Student Life"
              heading="Learning beyond the classroom"
              description="Clubs and student activities at TGPCOP encourage teamwork, creativity, leadership and community engagement."
              className="mb-6"
            />
            <div className="grid grid-cols-2 gap-3">
              {activities.map((activity) => (
                <div
                  key={activity.label}
                  className="flex items-center gap-3 bg-light-bg border border-border rounded-lg px-4 py-3"
                >
                  <activity.icon className="w-4 h-4 text-primary-500 shrink-0" />
                  <span className="text-sm font-body font-medium text-dark-text">{activity.label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/clubs"
              className="inline-flex items-center gap-1.5 mt-6 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              Explore clubs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-500 to-primary-500 rounded-2xl p-6 text-white col-span-2 md:col-span-1 md:row-span-2 flex flex-col justify-between min-h-[220px]">
              <Trophy className="w-8 h-8 text-white/70" aria-hidden="true" />
              <div>
                <h3 className="font-heading font-semibold text-lg mb-1">Clubs & Activities</h3>
                <p className="text-white/80 text-sm">
                  Join a club, participate in events and build skills outside the syllabus.
                </p>
              </div>
            </div>
            <div className="bg-navy-900 rounded-2xl p-6 text-white flex flex-col justify-between min-h-[100px]">
              <Users className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              <p className="text-white/80 text-sm font-heading font-medium mt-3">Student Council</p>
            </div>
            <div className="bg-light-bg border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[100px]">
              <HeartHandshake className="w-6 h-6 text-primary-500" aria-hidden="true" />
              <p className="text-muted text-sm font-heading font-medium mt-3">Social Initiatives</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
