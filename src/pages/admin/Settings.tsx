import { useEffect, useState, type FormEvent } from 'react'
import { Settings as SettingsIcon, Megaphone } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import { useSeo } from '@/lib/seo'
import { supabase } from '@/lib/supabase/client'
import { getAnnouncements } from '@/services/siteSettings'

interface Announcement {
  id: string
  content: string
  is_active: boolean
  priority: number
}

interface AnnouncementForm {
  content: string
  is_active: boolean
  priority: number
}

export default function AdminSettings() {
  useSeo({ title: 'Site Settings' })

  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<AnnouncementForm>({ content: '', is_active: true, priority: 1 })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAnnouncements()
      setAnnouncements(data as Announcement[])
    } catch {
      // empty state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    load()
  }, [])

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (saving || !form.content.trim()) return
    setSaving(true)
    setMessage(null)
    try {
      const { error } = await supabase!.from('announcements').insert({
        content: form.content.trim(),
        is_active: form.is_active,
        priority: form.priority,
      })
      if (error) throw error
      setForm({ content: '', is_active: true, priority: announcements.length + 1 })
      setMessage({ type: 'success', text: 'Announcement added.' })
      load()
    } catch {
      setMessage({ type: 'error', text: 'Could not add the announcement. Check your permissions.' })
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(announcement: Announcement) {
    setActionId(announcement.id)
    try {
      const { error } = await supabase!
        .from('announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id)
      if (error) throw error
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === announcement.id ? { ...a, is_active: !a.is_active } : a))
      )
    } catch {
      load()
    } finally {
      setActionId(null)
    }
  }

  async function handleDelete(id: string) {
    if (actionId) return
    if (!window.confirm('Delete this announcement?')) return
    setActionId(id)
    try {
      const { error } = await supabase!.from('announcements').delete().eq('id', id)
      if (error) throw error
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    } catch {
      load()
    } finally {
      setActionId(null)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Site Settings</h1>
      <p className="text-muted text-sm mb-6">
        Control dynamic content shown across the website, starting with the announcement bar.
      </p>

      {loading ? (
        <LoadingState count={2} type="list" />
      ) : (
        <div className="space-y-8">
          {/* Announcements */}
          <section className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-1 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary-500" />
              Announcement Bar
            </h2>
            <p className="text-muted text-sm mb-4">
              Messages scroll across the navy announcement strip at the top of every page.
            </p>

            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-5" noValidate>
              <input
                type="text"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="e.g. Admissions Open 2026–27 — B.Pharm & D.Pharm"
                className={inputClass}
                aria-label="Announcement text"
              />
              <Button type="submit" loading={saving} className="shrink-0">
                Add
              </Button>
            </form>

            {message && (
              <p
                className={`text-sm rounded-lg px-4 py-2.5 mb-4 border ${
                  message.type === 'success'
                    ? 'text-success bg-green-50 border-green-200'
                    : 'text-error bg-red-50 border-red-200'
                }`}
              >
                {message.text}
              </p>
            )}

            {announcements.length === 0 ? (
              <p className="text-muted text-sm bg-light-bg border border-border rounded-lg px-4 py-3">
                No announcements yet. The bar stays hidden until an active announcement exists.
              </p>
            ) : (
              <ul className="divide-y divide-border border border-border rounded-lg">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-sm text-dark-text flex-1 min-w-0 truncate">
                      {announcement.content}
                    </span>
                    <Badge variant={announcement.is_active ? 'success' : 'default'}>
                      {announcement.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                    <button
                      onClick={() => toggleActive(announcement)}
                      disabled={actionId === announcement.id}
                      className="text-xs font-heading font-medium text-primary-500 hover:text-primary-600 disabled:opacity-40"
                    >
                      {announcement.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      disabled={actionId === announcement.id}
                      className="text-xs font-heading font-medium text-error hover:text-red-600 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Static institutional info */}
          <section className="bg-light-bg border border-border rounded-xl p-6">
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-1 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-primary-500" />
              Institutional Information
            </h2>
            <p className="text-muted text-sm mb-4">
              Official college details are defined in the codebase (<code className="font-mono text-xs">src/lib/site.ts</code>)
              to guarantee accuracy. Update them there and redeploy.
            </p>
            <ul className="text-sm text-dark-text/80 space-y-1.5">
              <li>• Address, phone, email and DTE code are sourced from the official record.</li>
              <li>• Approvals and affiliations are fixed institutional facts, not editable content.</li>
            </ul>
          </section>
        </div>
      )}

      {!loading && !supabase && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          Supabase is not configured — settings cannot be persisted. Set{' '}
          <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono">.env</code> file.
        </div>
      )}
    </div>
  )
}
