import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, CheckCircle2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { getUpcomingEvents } from '@/services/events'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  date: string
  venue: string | null
  is_online: boolean
  category: string | null
}

export default function StudentEvents() {
  useSeo({ title: 'My Events' })

  const { user } = useAuth()
  const [events, setEvents] = useState<EventItem[]>([])
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    Promise.all([
      getUpcomingEvents(20),
      user
        ? supabase
            .from('event_registrations')
            .select('event_id')
            .eq('user_id', user.id)
            .neq('status', 'cancelled')
        : Promise.resolve({ data: [] as { event_id: string }[] }),
    ])
      .then(([eventsData, regs]) => {
        setEvents(eventsData as EventItem[])
        setRegisteredIds(new Set(((regs.data ?? []) as { event_id: string }[]).map((r) => r.event_id)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Events</h1>
      <p className="text-muted text-sm mb-6">Upcoming events and your registrations.</p>

      {loading ? (
        <LoadingState count={4} type="list" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming events"
          description="New events will appear here when announced."
        />
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const registered = registeredIds.has(event.id)
            return (
              <div
                key={event.id}
                className={`bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  registered ? 'border-green-200' : 'border-border'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {event.category && <Badge variant="primary">{event.category}</Badge>}
                    {registered && (
                      <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/events/${event.slug}`}
                    className="font-heading font-semibold text-sm text-navy-900 hover:text-primary-500 transition-colors"
                  >
                    {event.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.is_online ? 'Online' : event.venue || 'TBA'}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/events/${event.slug}`}
                  className="inline-flex items-center justify-center px-5 py-2 bg-primary-500 text-white text-xs font-heading font-medium rounded-md hover:bg-primary-600 transition-colors shrink-0"
                >
                  {registered ? 'View Details' : 'Register'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
