import { useEffect, useState, type FormEvent } from 'react'
import { Images, Plus, Trash2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getGalleryImages, createGalleryImage, deleteGalleryImage, type GalleryCategory } from '@/services/gallery'

interface GalleryRow {
  id: string
  title: string | null
  image_url: string
  thumbnail_url: string | null
  category: string
}

const emptyForm: { title: string; image_url: string; category: GalleryCategory } = {
  title: '',
  image_url: '',
  category: 'campus',
}

const PAGE_SIZE = 12

export default function AdminGallery() {
  useSeo({ title: 'Manage Gallery' })

  const [items, setItems] = useState<GalleryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<{ title: string; image_url: string; category: GalleryCategory }>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getGalleryImages({ page: p, pageSize: PAGE_SIZE })
      setItems(data as GalleryRow[])
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
  }, [page])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)
    if (!form.image_url.trim()) {
      setFormError('Image URL is required.')
      return
    }

    setSaving(true)
    try {
      await createGalleryImage({
        title: form.title.trim() || null,
        image_url: form.image_url.trim(),
        category: form.category,
      })
      setModalOpen(false)
      setForm(emptyForm)
      load(page)
    } catch {
      setFormError('Could not add the image. Check your permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return
    if (!window.confirm('Remove this image from the gallery?')) return
    setDeletingId(id)
    try {
      await deleteGalleryImage(id)
      setItems((prev) => prev.filter((g) => g.id !== id))
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
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Gallery</h1>
          <p className="text-muted text-sm">Manage photos displayed in the public gallery.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No images yet"
          description="Add campus, event and activity photos to the gallery."
          actionLabel="Add Image"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-border rounded-xl overflow-hidden group relative">
                <div className="aspect-square bg-light-bg">
                  <img
                    src={item.thumbnail_url || item.image_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-navy-900 truncate">{item.title || 'Untitled'}</p>
                    <Badge className="mt-1">{item.category}</Badge>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md shrink-0 disabled:opacity-40"
                    aria-label={`Delete ${item.title || 'image'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-6" />
        </>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Image">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="g-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Title
            </label>
            <input
              id="g-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Inauguration Ceremony"
            />
          </div>
          <div>
            <label htmlFor="g-url" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Image URL <span className="text-error">*</span>
            </label>
            <input
              id="g-url"
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className={inputClass}
              placeholder="https://... (upload to Supabase Storage first)"
            />
          </div>
          <div>
            <label htmlFor="g-category" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Category
            </label>
            <select
              id="g-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })}
              className={inputClass}
            >
              <option value="campus">Campus</option>
              <option value="events">Events</option>
              <option value="academic">Academic</option>
              <option value="sports">Sports</option>
              <option value="activities">Activities</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formError && (
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add Image
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
