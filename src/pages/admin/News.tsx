import { useEffect, useState, type FormEvent } from 'react'
import { Newspaper, Plus, Pencil, Trash2 } from 'lucide-react'
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
import { getNews, createNews, updateNews, deleteNews, type ContentStatus } from '@/services/news'

interface NewsRow {
  id: string
  title: string
  slug: string
  description: string
  content: string | null
  image_url: string | null
  category: string | null
  status: string
  is_featured: boolean
}

const emptyForm = {
  title: '',
  description: '',
  content: '',
  image_url: '',
  category: '',
  status: 'draft',
  is_featured: false,
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

export default function AdminNews() {
  useSeo({ title: 'Manage News' })

  const [items, setItems] = useState<NewsRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<NewsRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getNews({ page: p, pageSize: PAGE_SIZE })
      const filtered = debouncedSearch
        ? (data as NewsRow[]).filter((n) => n.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : (data as NewsRow[])
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

  function openEdit(item: NewsRow) {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description,
      content: item.content || '',
      image_url: item.image_url || '',
      category: item.category || '',
      status: item.status,
      is_featured: item.is_featured,
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
      slug: editing ? editing.slug : `${slugify(form.title)}-${Date.now().toString(36)}`,
      description: form.description.trim(),
      content: form.content.trim() || null,
      image_url: form.image_url.trim() || null,
      category: form.category.trim() || null,
      status: form.status as ContentStatus,
      is_featured: form.is_featured,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    }

    setSaving(true)
    try {
      if (editing) {
        await updateNews(editing.id, payload)
      } else {
        await createNews(payload)
      }
      setModalOpen(false)
      load(page)
    } catch {
      setFormError('Could not save the article. Check your permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return
    if (!window.confirm('Delete this news article permanently?')) return
    setDeletingId(id)
    try {
      await deleteNews(id)
      setItems((prev) => prev.filter((n) => n.id !== id))
    } catch {
      // keep on failure
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
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">News</h1>
          <p className="text-muted text-sm">Publish and manage college news articles.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        placeholder="Search articles..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={search ? 'No articles found' : 'No news yet'}
          description={search ? 'Try a different search.' : 'Publish your first article.'}
          actionLabel="New Article"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-bg text-left">
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Article</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-light-bg/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900">{item.title}</p>
                      <p className="text-muted text-xs">
                        {item.category || 'Uncategorized'}
                        {item.is_featured ? ' · Featured' : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          item.status === 'published' ? 'success' : item.status === 'draft' ? 'warning' : 'default'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
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
        title={editing ? 'Edit Article' : 'New Article'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="n-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="n-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="n-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Short Description <span className="text-error">*</span>
            </label>
            <textarea
              id="n-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="n-content" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Full Content
            </label>
            <textarea
              id="n-content"
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="n-category" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Category
              </label>
              <input
                id="n-category"
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Achievement, Announcement"
              />
            </div>
            <div>
              <label htmlFor="n-image" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Image URL
              </label>
              <input
                id="n-image"
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="n-status" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Status
              </label>
              <select
                id="n-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center pt-6">
              <label htmlFor="n-featured" className="flex items-center gap-2 text-sm text-dark-text cursor-pointer">
                <input
                  id="n-featured"
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-primary-500"
                />
                Featured article
              </label>
            </div>
          </div>

          {formError && (
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save Changes' : 'Create Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
