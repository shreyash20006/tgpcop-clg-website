import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getEvents, type EventStatus } from '@/services/events'
import { supabase } from '@/lib/supabase/client'

interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  date: string
  venue: string | null
  status: string
  category: string | null
  is_online: boolean
}

const PAGE_SIZE = 9
const statusFilters = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'completed' },
]

export default function Events() {
  useSeo({
    title: 'Events',
    description: 'Events at TGPCOP Nagpur — workshops, seminars, cultural and technical activities.',
  })

  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [status, setStatus] = useState<'upcoming' | 'completed'>('upcoming')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getEvents({
      status: status as EventStatus,
      category: category || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then(({ data, count }) => {
        setEvents(data as EventItem[])
        setTotal(count)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [status, category, page])

  const categories = Array.from(new Set(events.map((e) => e.category).filter(Boolean))) as string[]

  return (
    <>
      <PageHeader
        title="Events"
        description="Workshops, seminars and student activities at TGPCOP."
        breadcrumbItems={[{ label: 'Events' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex rounded-lg border border-border overflow-hidden w-fit">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setStatus(f.value as 'upcoming' | 'completed')
                  setPage(1)
                }}
                className={`px-4 py-2.5 text-sm font-heading font-medium transition-colors ${
                  status === f.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-dark-text hover:bg-light-bg'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={status === 'upcoming' ? 'No upcoming events' : 'No past events'}
            description="Event announcements will appear here. Check back soon."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="bg-gradient-to-br from-navy-800 to-primary-500 h-36 flex items-center justify-center">
                    <CalendarDays className="w-10 h-10 text-white/20" aria-hidden="true" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {event.category && <Badge variant="primary">{event.category}</Badge>}
                      <Badge variant={event.status === 'upcoming' ? 'success' : 'default'}>
                        {event.status}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-semibold text-base text-navy-900 mb-2 group-hover:text-primary-500 transition-colors">
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
                        {event.is_online ? 'Online' : event.venue || 'Venue TBA'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </PageContainer>
    </>
  )
}
