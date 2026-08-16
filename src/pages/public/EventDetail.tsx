import { useEffect, useState, type FormEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Users, ArrowLeft, CheckCircle2 } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { getEventBySlug, registerForEvent } from '@/services/events'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'

interface EventData {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string | null
  venue: string | null
  organizer: string | null
  registration_deadline: string | null
  registration_link: string | null
  status: string
  category: string | null
  is_online: boolean
  max_participants: number | null
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useSeo({
    title: event ? event.title : 'Event',
    description: event?.description?.slice(0, 150),
  })

  useEffect(() => {
    if (!slug || !supabase) {
      setLoading(false)
      return
    }
    getEventBySlug(slug)
      .then((data) => setEvent(data as EventData | null))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [slug])

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!event || registering || registered) return
    if (!user) {
      navigate('/login', { state: { from: `/events/${slug}` } })
      return
    }
    setRegistering(true)
    setError(null)
    try {
      await registerForEvent({
        event_id: event.id,
        user_id: user.id,
        name: (user.user_metadata?.full_name as string) || user.email || '',
        email: user.email || '',
      })
      setRegistered(true)
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  if (loading) {
    return (
      <PageContainer className="py-16">
        <LoadingState count={1} type="text" />
      </PageContainer>
    )
  }

  if (!event) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={CalendarDays}
          title="Event not found"
          description="This event may have been removed or the link is incorrect."
          actionLabel="Browse events"
          onAction={() => navigate('/events')}
        />
      </PageContainer>
    )
  }

  const canRegister =
    event.status === 'upcoming' &&
    (!event.registration_deadline || new Date(event.registration_deadline) > new Date())

  return (
    <>
      <div className="bg-navy-900 py-14 md:py-20">
        <PageContainer>
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white mb-2">
            <Breadcrumb items={[{ label: 'Events', path: '/events' }, { label: event.title }]} />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {event.category && <Badge variant="primary">{event.category}</Badge>}
            <Badge variant={event.status === 'upcoming' ? 'success' : 'default'}>{event.status}</Badge>
            {event.is_online && <Badge variant="info">Online</Badge>}
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">{event.title}</h1>
        </PageContainer>
      </div>

      <PageContainer className="py-12 md:py-16">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-navy-800 to-primary-500 rounded-xl h-64 flex items-center justify-center mb-8">
              <CalendarDays className="w-16 h-16 text-white/20" aria-hidden="true" />
            </div>
            <h2 className="font-heading font-bold text-xl text-navy-900 mb-4">About this event</h2>
            <p className="text-dark-text/85 leading-relaxed whitespace-pre-line font-body">
              {event.description}
            </p>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-border rounded-xl p-6 space-y-4 text-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900">Details</h3>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted text-xs">Date</p>
                  <p className="font-medium text-dark-text">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {event.time && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted text-xs">Time</p>
                    <p className="font-medium text-dark-text">{event.time}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted text-xs">Venue</p>
                  <p className="font-medium text-dark-text">
                    {event.is_online ? 'Online' : event.venue || 'To be announced'}
                  </p>
                </div>
              </div>
              {event.organizer && (
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted text-xs">Organizer</p>
                    <p className="font-medium text-dark-text">{event.organizer}</p>
                  </div>
                </div>
              )}
            </div>

            {canRegister && (
              <div className="bg-white border border-border rounded-xl p-6">
                {registered ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                    <div>
                      <h3 className="font-heading font-semibold text-sm text-navy-900 mb-1">
                        Registered
                      </h3>
                      <p className="text-muted text-sm">
                        You're registered for this event. See you there!
                      </p>
                    </div>
                  </div>
                ) : event.registration_link ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-5 py-3 bg-primary-500 text-white font-heading font-medium text-sm rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Register (External Link)
                  </a>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <Button type="submit" className="w-full" loading={registering}>
                      {user ? 'Register for this event' : 'Sign in to register'}
                    </Button>
                    {error && <p className="text-error text-xs text-center">{error}</p>}
                  </form>
                )}
              </div>
            )}

            {event.registration_deadline && (
              <p className="text-muted text-xs text-center">
                Registration closes:{' '}
                {new Date(event.registration_deadline).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </aside>
        </div>
      </PageContainer>
    </>
  )
}
