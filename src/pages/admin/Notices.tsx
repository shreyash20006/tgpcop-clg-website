import { useEffect, useState, type FormEvent } from 'react'
import { Bell, Plus, Pencil, Trash2, Pin } from 'lucide-react'
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
import { getNotices, createNotice, updateNotice, deleteNotice, type NoticeStatus, type NoticePriority } from '@/services/notices'

interface NoticeRow {
  id: string
  title: string
  description: string
  pdf_url: string | null
  priority: string
  status: string
  is_pinned: boolean
  publish_date: string | null
  expiry_date: string | null
}

const emptyForm = {
  title: '',
  description: '',
  pdf_url: '',
  priority: 'medium',
  status: 'published',
  is_pinned: false,
  publish_date: '',
  expiry_date: '',
}

const PAGE_SIZE = 10

export default function AdminNotices() {
  useSeo({ title: 'Manage Notices' })

  const [items, setItems] = useState<NoticeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<NoticeRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getNotices({ page: p, pageSize: PAGE_SIZE })
      const filtered = debouncedSearch
        ? (data as NoticeRow[]).filter((n) => n.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : (data as NoticeRow[])
      setItems(filtered)
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

  function openEdit(item: NoticeRow) {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description,
      pdf_url: item.pdf_url || '',
      priority: item.priority,
      status: item.status,
      is_pinned: item.is_pinned,
      publish_date: item.publish_date?.slice(0, 10) || '',
      expiry_date: item.expiry_date?.slice(0, 10) || '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)
    if (!form.title.trim() || !form.description.trim()) {
      setFormError('Title and description are required.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      pdf_url: form.pdf_url.trim() || null,
      priority: form.priority as NoticePriority,
      status: form.status as NoticeStatus,
      is_pinned: form.is_pinned,
      publish_date: form.publish_date || new Date().toISOString(),
      expiry_date: form.expiry_date || null,
    }

    setSaving(true)
    try {
      if (editing) {
        await updateNotice(editing.id, payload)
      } else {
        await createNotice(payload)
      }
      setModalOpen(false)
      load(page)
    } catch {
      setFormError('Could not save the notice. Check your permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function togglePin(item: NoticeRow) {
    try {
      await updateNotice(item.id, { is_pinned: !item.is_pinned })
      setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, is_pinned: !n.is_pinned } : n)))
    } catch {
      load(page)
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return
    if (!window.confirm('Delete this notice permanently?')) return
    setDeletingId(id)
    try {
      await deleteNotice(id)
      setItems((prev) => prev.filter((n) => n.id !== id))
    } catch {
      // keep on failure
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  const priorityVariant: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
    low: 'default',
    medium: 'info',
    high: 'warning',
    urgent: 'error',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Notices</h1>
          <p className="text-muted text-sm">Publish official notices and circulars.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Notice
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        placeholder="Search notices..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={search ? 'No notices found' : 'No notices yet'}
          description={search ? 'Try a different search.' : 'Publish your first notice.'}
          actionLabel="New Notice"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-bg text-left">
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Notice</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-light-bg/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900 flex items-center gap-1.5">
                        {item.is_pinned && <Pin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                        {item.title}
                      </p>
                      <p className="text-muted text-xs">
                        {item.publish_date
                          ? new Date(item.publish_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={priorityVariant[item.priority] || 'default'}>{item.priority}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => togglePin(item)}
                        className={`p-1.5 rounded-md ${item.is_pinned ? 'text-cyan-500 bg-cyan-50' : 'text-muted hover:text-cyan-500 hover:bg-cyan-50'}`}
                        aria-label={item.is_pinned ? 'Unpin notice' : 'Pin notice'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md"
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md disabled:opacity-40"
                        aria-label={`Delete ${item.title}`}
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
        title={editing ? 'Edit Notice' : 'New Notice'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="t-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="t-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="t-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="t-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-priority" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Priority
              </label>
              <select
                id="t-priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className={inputClass}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label htmlFor="t-status" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Status
              </label>
              <select
                id="t-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-publish" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Publish Date
              </label>
              <input
                id="t-publish"
                type="date"
                value={form.publish_date}
                onChange={(e) => setForm({ ...form, publish_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="t-expiry" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Expiry Date
              </label>
              <input
                id="t-expiry"
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="t-pdf" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              PDF URL
            </label>
            <input
              id="t-pdf"
              type="url"
              value={form.pdf_url}
              onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
              className={inputClass}
              placeholder="https://... (upload to Supabase Storage first)"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="t-pinned" className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
              <input
                id="t-pinned"
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="w-4 h-4 accent-primary-500"
              />
              Pin this notice to the top
            </label>
          </div>

          {formError && (
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
