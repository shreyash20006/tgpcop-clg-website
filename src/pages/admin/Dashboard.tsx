import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShieldCheck, CalendarDays, BookOpen, Mail, ClipboardList } from 'lucide-react'
import LoadingState from '@/components/ui/LoadingState'
import { useSeo } from '@/lib/seo'
import { supabase } from '@/lib/supabase/client'

interface Stats {
  totalStudents: number
  pendingVerification: number
  upcomingEvents: number
  eventRegistrations: number
  pendingResources: number
  newEnquiries: number
}

const initialStats: Stats = {
  totalStudents: 0,
  pendingVerification: 0,
  upcomingEvents: 0,
  eventRegistrations: 0,
  pendingResources: 0,
  newEnquiries: 0,
}

export default function AdminDashboard() {
  useSeo({ title: 'Admin Dashboard' })

  const [stats, setStats] = useState<Stats>(initialStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const [students, pending, events, regs, resources, enquiries] = await Promise.all([
          supabase!.from('students').select('*', { count: 'exact', head: true }),
          supabase!.from('students').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
          supabase!.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase!.from('event_registrations').select('*', { count: 'exact', head: true }),
          supabase!.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase!.from('admission_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        ])
        setStats({
          totalStudents: students.count ?? 0,
          pendingVerification: pending.count ?? 0,
          upcomingEvents: events.count ?? 0,
          eventRegistrations: regs.count ?? 0,
          pendingResources: resources.count ?? 0,
          newEnquiries: enquiries.count ?? 0,
        })
      } catch {
        // keep zeros
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, to: '/admin/students' },
    { label: 'Pending Verification', value: stats.pendingVerification, icon: ShieldCheck, to: '/admin/verification', highlight: true },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: CalendarDays, to: '/admin/events' },
    { label: 'Event Registrations', value: stats.eventRegistrations, icon: ClipboardList, to: '/admin/events' },
    { label: 'Pending Resources', value: stats.pendingResources, icon: BookOpen, to: '/admin/resources', highlight: true },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: Mail, to: '/admin/enquiries', highlight: true },
  ]

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Dashboard</h1>
      <p className="text-muted text-sm mb-6">Overview of college platform activity.</p>

      {loading ? (
        <LoadingState count={6} type="card" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className={`rounded-xl p-6 border transition-all hover:shadow-md ${
                card.highlight && card.value > 0
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-white border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    card.highlight && card.value > 0 ? 'bg-amber-100' : 'bg-primary-50'
                  }`}
                >
                  <card.icon
                    className={`w-5 h-5 ${card.highlight && card.value > 0 ? 'text-amber-600' : 'text-primary-500'}`}
                  />
                </div>
                {card.highlight && card.value > 0 && (
                  <span className="text-xs font-heading font-semibold text-amber-600">Action needed</span>
                )}
              </div>
              <p className="font-heading font-bold text-2xl text-navy-900">{card.value}</p>
              <p className="text-muted text-sm">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {!loading && !supabase && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          Supabase is not configured. Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono">.env</code>{' '}
          file to enable live data.
        </div>
      )}
    </div>
  )
}
