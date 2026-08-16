import { useEffect, useState, type FormEvent } from 'react'
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getEvents, createEvent, updateEvent, deleteEvent, type EventStatus } from '@/services/events'

interface EventRow {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string | null
  venue: string | null
  organizer: string | null
  registration_link: string | null
  status: string
  category: string | null
  is_online: boolean
}

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  organizer: '',
  registration_link: '',
  status: 'upcoming',
  category: '',
  is_online: false,
}

const PAGE_SIZE = 10

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminEvents() {
  useSeo({ title: 'Manage Events' })

  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EventRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getEvents({ page: p, pageSize: PAGE_SIZE })
      const filtered = debouncedSearch
        ? (data as EventRow[]).filter((e) => e.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : (data as EventRow[])
      setEvents(filtered)
      setTotal(count)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(event: EventRow) {
    setEditing(event)
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      time: event.time || '',
      venue: event.venue || '',
      organizer: event.organizer || '',
      registration_link: event.registration_link || '',
      status: event.status,
      category: event.category || '',
      is_online: event.is_online,
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)
    if (!form.title.trim() || !form.date || !form.description.trim()) {
      setFormError('Title, date and description are required.')
      return
    }

    const payload = {
      title: form.title.trim(),
      slug: editing ? editing.slug : `${slugify(form.title)}-${Date.now().toString(36)}`,
      description: form.description.trim(),
      date: form.date,
      time: form.time || null,
      venue: form.venue.trim() || null,
      organizer: form.organizer.trim() || null,
      registration_link: form.registration_link.trim() || null,
      status: form.status as EventStatus,
      category: form.category.trim() || null,
      is_online: form.is_online,
    }

    setSaving(true)
    try {
      if (editing) {
        await updateEvent(editing.id, payload)
      } else {
        await createEvent(payload)
      }
      setModalOpen(false)
      load(page)
    } catch {
      setFormError('Could not save the event. Check your permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return
    if (!window.confirm('Delete this event permanently?')) return
    setDeletingId(id)
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch {
      // keep item on failure
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Events</h1>
          <p className="text-muted text-sm">Create and manage college events.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Event
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        placeholder="Search events..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={search ? 'No events found' : 'No events yet'}
          description={search ? 'Try a different search.' : 'Create your first event.'}
          actionLabel="New Event"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-bg text-left">
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Event</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-light-bg/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900">{event.title}</p>
                      <p className="text-muted text-xs">
                        {event.is_online ? 'Online' : event.venue || 'Venue TBA'}
                        {event.category ? ` · ${event.category}` : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-muted whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          event.status === 'upcoming'
                            ? 'success'
                            : event.status === 'cancelled'
                              ? 'error'
                              : 'default'
                        }
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md"
                        aria-label={`Edit ${event.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md disabled:opacity-40"
                        aria-label={`Delete ${event.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-6" />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Event' : 'New Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="e-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="e-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="e-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="e-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-date" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Date <span className="text-error">*</span>
              </label>
              <input
                id="e-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="e-time" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Time
              </label>
              <input
                id="e-time"
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={inputClass}
                placeholder="e.g. 10:00 AM"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-venue" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Venue
              </label>
              <input
                id="e-venue"
                type="text"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className={inputClass}
                disabled={form.is_online}
              />
            </div>
            <div>
              <label htmlFor="e-category" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Category
              </label>
              <input
                id="e-category"
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Workshop, Seminar"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-status" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Status
              </label>
              <select
                id="e-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label htmlFor="e-online" className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
                <input
                  id="e-online"
                  type="checkbox"
                  checked={form.is_online}
                  onChange={(e) => setForm({ ...form, is_online: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
                This is an online event
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="e-link" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              External Registration Link
            </label>
            <input
              id="e-link"
              type="url"
              value={form.registration_link}
              onChange={(e) => setForm({ ...form, registration_link: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {formError && (
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
