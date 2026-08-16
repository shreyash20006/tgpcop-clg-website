import { Link } from 'react-router-dom'
import { GraduationCap, Bell, CalendarDays, BookOpen, ArrowRight } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'

const perks = [
  { icon: Bell, label: 'Notices' },
  { icon: CalendarDays, label: 'Events' },
  { icon: BookOpen, label: 'Resources' },
]

export default function PortalCta() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-primary-600">
      <PageContainer>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-3">
              Your college experience, in one portal
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
              Sign in to the student portal to track notices, register for events, access study
              resources and manage your profile.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {perks.map((perk) => (
                <span
                  key={perk.label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-sm font-heading font-medium text-white"
                >
                  <perk.icon className="w-4 h-4 text-cyan-400" />
                  {perk.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/student"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-navy-900 font-heading font-semibold rounded-md hover:bg-cyan-400 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Go to Student Portal
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-heading font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
