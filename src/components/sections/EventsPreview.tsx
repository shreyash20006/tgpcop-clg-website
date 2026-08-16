import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { getUpcomingEvents } from '@/services/events'
import { supabase } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'

interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  date: string
  venue: string | null
  category: string | null
  is_online: boolean
}

export default function EventsPreview() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    getUpcomingEvents(3)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <SectionHeading
          label="Events"
          heading="What's happening at TGPCOP"
          ctaLabel="View all events"
          ctaLink="/events"
        />
        {loading ? (
          <LoadingState count={3} />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming events"
            description="New events will be announced here. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-navy-800 to-primary-500 h-32 flex items-center justify-center">
                  <CalendarDays className="w-10 h-10 text-white/20" aria-hidden="true" />
                </div>
                <div className="p-5">
                  {event.category && <Badge variant="primary">{event.category}</Badge>}
                  <h3 className="font-heading font-semibold text-base text-navy-900 mt-2 mb-2 group-hover:text-primary-500 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 text-sm text-muted">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.is_online ? 'Online' : event.venue || 'Venue to be announced'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  )
}
