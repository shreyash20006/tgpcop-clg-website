import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CalendarDays, BookOpen, Award, Clock, ShieldCheck, ShieldAlert } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'
import { getStudentByUserId } from '@/services/students'
import { getUpcomingEvents } from '@/services/events'
import { getLatestNotices } from '@/services/notices'
import { supabase } from '@/lib/supabase/client'

interface StudentProfile {
  prn: string
  full_name: string
  course: string
  year: number
  verification_status: string
}

export default function StudentDashboard() {
  useSeo({ title: 'Dashboard' })

  const { user } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [events, setEvents] = useState<{ id: string; title: string; slug: string; date: string }[]>([])
  const [notices, setNotices] = useState<{ id: string; title: string; is_pinned: boolean }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !user) {
      setLoading(false)
      return
    }
    Promise.all([
      getStudentByUserId(user.id),
      getUpcomingEvents(4),
      getLatestNotices(4),
    ])
      .then(([p, e, n]) => {
        setProfile(p as StudentProfile | null)
        setEvents(e as typeof events)
        setNotices(n as typeof notices)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const firstName =
    profile?.full_name || (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Student'

  const cards = [
    { icon: Bell, label: 'Notices', value: notices.length, to: '/student/notices' },
    { icon: CalendarDays, label: 'Upcoming Events', value: events.length, to: '/student/events' },
    { icon: BookOpen, label: 'Resources', value: 'Browse', to: '/student/resources' },
    { icon: Award, label: 'Certificates', value: 'View', to: '/student/certificates' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-navy-900 rounded-xl p-6 sm:p-8">
        <h1 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1">
          Welcome back, {firstName}
        </h1>
        {profile ? (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="info">{profile.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}</Badge>
            <Badge>Year {profile.year}</Badge>
            <Badge>PRN: {profile.prn}</Badge>
            {profile.verification_status === 'approved' ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" /> Verification {profile.verification_status}
              </span>
            )}
          </div>
        ) : (
          <p className="text-white/60 text-sm mt-2">
            Complete your profile to access all portal features.{' '}
            <Link to="/student/profile" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Set up profile →
            </Link>
          </p>
        )}
      </div>

      {/* Quick cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white border border-border rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
              <card.icon className="w-5 h-5 text-primary-500" />
            </div>
            <p className="font-heading font-bold text-xl text-navy-900">{card.value}</p>
            <p className="text-muted text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      {loading ? (
        <LoadingState count={2} type="list" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming events */}
          <section className="bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-sm text-navy-900">Upcoming Events</h2>
              <Link to="/student/events" className="text-xs font-heading font-medium text-primary-500 hover:text-primary-600">
                View all
              </Link>
            </div>
            {events.length === 0 ? (
              <EmptyState icon={CalendarDays} title="No upcoming events" description="Check back soon." className="py-10" />
            ) : (
              <ul className="divide-y divide-border">
                {events.map((event) => (
                  <li key={event.id}>
                    <Link to={`/events/${event.slug}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-light-bg transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-medium text-sm text-navy-900 truncate">{event.title}</p>
                        <p className="text-muted text-xs flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Latest notices */}
          <section className="bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-heading font-semibold text-sm text-navy-900">Latest Notices</h2>
              <Link to="/student/notices" className="text-xs font-heading font-medium text-primary-500 hover:text-primary-600">
                View all
              </Link>
            </div>
            {notices.length === 0 ? (
              <EmptyState icon={Bell} title="No notices" description="Notices will appear here." className="py-10" />
            ) : (
              <ul className="divide-y divide-border">
                {notices.map((notice) => (
                  <li key={notice.id} className="px-5 py-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4 text-primary-500" />
                    </div>
                    <p className="text-sm text-dark-text leading-snug">{notice.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
