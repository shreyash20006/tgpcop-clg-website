import { useEffect, useRef, useState, type FormEvent, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Images, Plus, Trash2, Eye, Send, Globe, Archive,
  CheckCircle2, XCircle, ImagePlus, Star, UploadCloud, AlertCircle,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { logAction } from '@/lib/audit'
import {
  getAlbumsAdmin, createAlbum, updateAlbum, deleteAlbum,
  getAlbumPhotosAdmin, uploadAlbumPhotos, deleteAlbumPhoto, setAlbumCover,
  slugify, ALBUM_CATEGORIES, MAX_IMAGE_BYTES,
  type AlbumRow, type AlbumPhotoRow, type AlbumStatus, type AlbumCategory,
} from '@/services/galleryAlbums'

interface SelectedPhoto {
  id: string
  file: File
  preview: string
  status: 'waiting' | 'uploading' | 'done' | 'error'
}

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  category: 'events' as AlbumCategory,
}

const statusVariant: Record<AlbumStatus, 'default' | 'warning' | 'success' | 'info'> = {
  draft: 'default',
  pending_approval: 'warning',
  published: 'success',
  archived: 'info',
}

export default function AdminGallery() {
  useSeo({ title: 'Manage Gallery' })
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const [albums, setAlbums] = useState<AlbumRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | AlbumStatus>('')
  const debouncedSearch = useDebounce(search, 300)

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<AlbumRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [selected, setSelected] = useState<SelectedPhoto[]>([])
  const [coverId, setCoverId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [existingPhotos, setExistingPhotos] = useState<AlbumPhotoRow[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      setAlbums(await getAlbumsAdmin({ search: debouncedSearch || undefined, status: statusFilter || undefined }))
    } catch {
      setError(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter])

  // ---------- Photo selection ----------

  function addFiles(files: FileList | File[]) {
    const next: SelectedPhoto[] = []
    let tooLarge = false
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_IMAGE_BYTES) {
        tooLarge = true
        continue
      }
      next.push({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'waiting',
      })
    }
    if (tooLarge) {
      setFormError('One or more images were skipped — please select images below 10 MB.')
    }
    if (next.length > 0) {
      setSelected((prev) => [...prev, ...next])
      setFormError(null)
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files)
  }

  function removeSelected(id: string) {
    setSelected((prev) => {
      const item = prev.find((p) => p.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((p) => p.id !== id)
    })
    if (coverId === id) setCoverId(null)
  }

  // ---------- Album CRUD ----------

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSelected([])
    setCoverId(null)
    setExistingPhotos([])
    setFormError(null)
    setSuccessMsg(null)
    setEditorOpen(true)
  }

  async function openEdit(album: AlbumRow) {
    setEditing(album)
    setForm({
      title: album.title,
      description: album.description || '',
      event_date: album.event_date || '',
      category: album.category as AlbumCategory,
    })
    setSelected([])
    setCoverId(null)
    setFormError(null)
    setSuccessMsg(null)
    setExistingPhotos(await getAlbumPhotosAdmin(album.id))
    setEditorOpen(true)
  }

  async function refreshAlbum(id: string): Promise<AlbumRow> {
    const { data } = await supabase!.from('gallery_albums').select('*').eq('id', id).single()
    return data as AlbumRow
  }

  async function performSave(): Promise<AlbumRow | null> {
    if (!form.title.trim()) {
      setFormError('Album title is required.')
      return null
    }

    setSaving(true)
    setFormError(null)
    setSuccessMsg(null)
    try {
      let album = editing
      if (!album) {
        const baseSlug = slugify(form.title) || 'album'
        album = await createAlbum({
          title: form.title.trim(),
          slug: `${baseSlug}-${Date.now().toString(36)}`,
          description: form.description.trim() || null,
          event_date: form.event_date || null,
          category: form.category,
          status: 'draft',
          created_by: (await supabase!.auth.getUser()).data.user?.id ?? null,
        })
        await logAction({ action: 'gallery.album_create', entity: 'gallery_albums', entity_id: album.id })
      } else {
        album = await updateAlbum(album.id, {
          title: form.title.trim(),
          description: form.description.trim() || null,
          event_date: form.event_date || null,
          category: form.category,
        })
      }

      if (selected.length > 0 && album) {
        setUploading(true)
        const coverIndex = coverId ? selected.findIndex((p) => p.id === coverId) : 0
        const result = await uploadAlbumPhotos(
          album,
          selected.map((p) => p.file),
          (index, status) => {
            setSelected((prev) => prev.map((p, i) => (i === index ? { ...p, status } : p)))
          },
          coverIndex >= 0 ? coverIndex : 0
        )
        setUploading(false)
        album = await refreshAlbum(album.id)
        if (result.errors.length > 0) {
          setFormError(`Uploaded ${result.uploadedCount} photos, but ${result.errors.length} failed: ${result.errors[0]}`)
        } else {
          setSelected([])
          setCoverId(null)
        }
      }

      setSuccessMsg('Album saved successfully.')
      setEditing(album)
      if (album) {
        setExistingPhotos(await getAlbumPhotosAdmin(album.id))
      }
      load()
      return album
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save the album.')
      return null
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (saving || uploading) return
    await performSave()
  }

  async function handleSubmitForApproval() {
    if (uploading) return
    const album = editing && selected.length === 0 ? editing : await performSave()
    if (!album) return
    try {
      await updateAlbum(album.id, { status: 'pending_approval' })
      await logAction({ action: 'gallery.album_submit', entity: 'gallery_albums', entity_id: album.id })
      setSuccessMsg('Album submitted for approval.')
      setEditing({ ...album, status: 'pending_approval' })
      load()
    } catch {
      setFormError('Could not submit the album.')
    }
  }

  async function handlePublishFlow() {
    if (uploading) return
    const album = editing && selected.length === 0 ? editing : await performSave()
    if (!album) return
    try {
      await updateAlbum(album.id, { status: 'published' })
      await logAction({ action: 'gallery.album_publish', entity: 'gallery_albums', entity_id: album.id })
      setSuccessMsg('Album published.')
      setEditing({ ...album, status: 'published' })
      load()
    } catch {
      setFormError('Could not publish the album.')
    }
  }

  async function handleUnpublish(album: AlbumRow) {
    try {
      await updateAlbum(album.id, { status: 'draft' })
      await logAction({ action: 'gallery.album_unpublish', entity: 'gallery_albums', entity_id: album.id })
      load()
    } catch {
      load()
    }
  }

  async function handleDelete(album: AlbumRow) {
    if (deletingId) return
    if (!window.confirm(`Delete "${album.title}" and all its photos permanently?`)) return
    setDeletingId(album.id)
    try {
      await deleteAlbum(album.id)
      await logAction({ action: 'gallery.album_delete', entity: 'gallery_albums', entity_id: album.id })
      setAlbums((prev) => prev.filter((a) => a.id !== album.id))
    } catch {
      load()
    } finally {
      setDeletingId(null)
    }
  }

  async function handleDeletePhoto(photo: AlbumPhotoRow) {
    if (!editing) return
    try {
      await deleteAlbumPhoto(photo, editing)
      setExistingPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      setEditing(await refreshAlbum(editing.id))
      load()
    } catch {
      setFormError('Could not delete the photo.')
    }
  }

  async function handleSetCover(photo: AlbumPhotoRow) {
    if (!editing) return
    try {
      await setAlbumCover(editing, photo)
      setEditing(await refreshAlbum(editing.id))
      load()
    } catch {
      setFormError('Could not set the cover photo.')
    }
  }

  const totalSelectedSize = selected.reduce((sum, p) => sum + p.file.size, 0)
  const uploadedCount = selected.filter((p) => p.status === 'done').length
  const overallProgress = selected.length > 0 ? Math.round((uploadedCount / selected.length) * 100) : 0

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">
            {isAdmin ? 'Gallery' : 'My Albums'}
          </h1>
          <p className="text-muted text-sm">
            {isAdmin
              ? 'Album-based gallery — create albums, upload photos, approve submissions.'
              : 'Create albums from events, select photos, and submit for approval.'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Album
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search albums..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | AlbumStatus)}
          className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : albums.length === 0 ? (
        <EmptyState
          icon={Images}
          title={search || statusFilter ? 'No albums found' : 'No albums yet'}
          description={
            search || statusFilter
              ? 'Try adjusting your filters.'
              : 'Create your first photo album — select multiple photos from your phone or computer.'
          }
          actionLabel="Create Album"
          onAction={openCreate}
        />
      ) : (
        <div className="bg-white border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-light-bg text-left">
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Album</th>
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Photos</th>
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {albums.map((album) => (
                <tr key={album.id} className="hover:bg-light-bg/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {album.cover_image_url ? (
                        <img src={album.cover_image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-light-bg flex items-center justify-center shrink-0">
                          <Images className="w-4 h-4 text-muted" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-navy-900 truncate">{album.title}</p>
                        <p className="text-muted text-xs">/{album.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {ALBUM_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category}
                  </td>
                  <td className="px-5 py-3.5 text-dark-text">{album.photo_count}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant[album.status]}>{album.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-muted whitespace-nowrap">
                    {album.event_date
                      ? new Date(album.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {album.status === 'published' && (
                      <Link
                        to={`/gallery/${album.slug}`}
                        className="inline-flex p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md"
                        aria-label={`View ${album.title}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => openEdit(album)}
                      className="inline-flex p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md"
                      aria-label={`Edit ${album.title}`}
                    >
                      <Images className="w-4 h-4" />
                    </button>
                    {isAdmin && album.status === 'pending_approval' && (
                      <button
                        onClick={async () => {
                          try {
                            await updateAlbum(album.id, { status: 'published' })
                            await logAction({ action: 'gallery.album_publish', entity: 'gallery_albums', entity_id: album.id })
                            load()
                          } catch { load() }
                        }}
                        className="inline-flex p-1.5 text-success hover:bg-green-50 rounded-md"
                        aria-label={`Approve ${album.title}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {isAdmin && album.status === 'published' && (
                      <button
                        onClick={() => handleUnpublish(album)}
                        className="inline-flex p-1.5 text-muted hover:text-warning hover:bg-amber-50 rounded-md"
                        aria-label={`Unpublish ${album.title}`}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(album)}
                      disabled={deletingId === album.id}
                      className="inline-flex p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md disabled:opacity-40"
                      aria-label={`Delete ${album.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* -------- Album Editor Modal -------- */}
      <Modal
        isOpen={editorOpen}
        onClose={() => { if (!uploading) setEditorOpen(false) }}
        title={editing ? `Edit — ${editing.title}` : 'Create Album'}
        size="lg"
        className="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-5" noValidate>
          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="a-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Album Title <span className="text-error">*</span>
              </label>
              <input
                id="a-title" type="text" value={form.title} disabled={!!editing}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`${inputClass} ${editing ? 'bg-light-bg text-muted' : ''}`}
                placeholder="e.g. Independence Day 2026"
              />
            </div>
            <div>
              <label htmlFor="a-date" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Event Date
              </label>
              <input
                id="a-date" type="date" value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="a-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Description
              </label>
              <textarea
                id="a-desc" rows={2} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputClass} placeholder="Short description shown on the album page"
              />
            </div>
            <div>
              <label htmlFor="a-cat" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Category
              </label>
              <select
                id="a-cat" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as AlbumCategory })}
                className={inputClass}
              >
                {ALBUM_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop zone */}
          <div>
            <p className="text-sm font-heading font-medium text-navy-900 mb-2">Photos</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                dragOver ? 'border-primary-500 bg-primary-50' : 'border-border bg-light-bg'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-sm text-dark-text font-medium">Drag & drop photos here</p>
              <p className="text-xs text-muted mt-0.5 mb-3">JPG / PNG / WEBP · up to 10 MB each · select many at once</p>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <ImagePlus className="w-4 h-4" />
                Select Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>
          </div>

          {/* Selected photos preview */}
          {selected.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-heading font-medium text-navy-900">
                  Selected Photos ({selected.length})
                </p>
                <p className="text-xs text-muted">{(totalSelectedSize / 1024 / 1024).toFixed(1)} MB total</p>
              </div>
              {uploading && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span>Uploading — {uploadedCount}/{selected.length}</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selected.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-light-bg group border border-border">
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                    {photo.status === 'uploading' && (
                      <div className="absolute inset-0 bg-navy-900/50 flex items-center justify-center">
                        <span className="text-white text-xs font-heading">Uploading…</span>
                      </div>
                    )}
                    {photo.status === 'done' && (
                      <div className="absolute top-1.5 left-1.5 bg-success rounded-full p-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {photo.status === 'error' && (
                      <div className="absolute top-1.5 left-1.5 bg-error rounded-full p-0.5">
                        <XCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {coverId === photo.id && (
                      <div className="absolute top-1.5 right-1.5 bg-accent-500 rounded-full p-0.5">
                        <Star className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    {photo.status !== 'uploading' && photo.status !== 'done' && (
                      <div className="absolute bottom-0 inset-x-0 flex justify-center gap-1 p-1.5 bg-navy-900/70">
                        <button
                          type="button" onClick={() => setCoverId(photo.id)}
                          className="text-[11px] font-heading font-medium text-white hover:text-accent-400 px-1.5 py-1"
                        >
                          {coverId === photo.id ? 'Cover ✓' : 'Set Cover'}
                        </button>
                        <button
                          type="button" onClick={() => removeSelected(photo.id)}
                          className="text-[11px] font-heading font-medium text-white hover:text-error px-1.5 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button" onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full py-2.5 border border-dashed border-border rounded-xl text-sm font-heading font-medium text-primary-500 hover:bg-primary-50 transition-colors"
              >
                + Add More Photos
              </button>
            </div>
          )}

          {/* Existing photos (edit mode) */}
          {editing && existingPhotos.length > 0 && (
            <div>
              <p className="text-sm font-heading font-medium text-navy-900 mb-2">
                Album Photos ({existingPhotos.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-light-bg group border border-border">
                    <img src={photo.image_url} alt={photo.alt_text || ''} className="w-full h-full object-cover" loading="lazy" />
                    {editing.cover_image_url === photo.image_url && (
                      <div className="absolute top-1.5 right-1.5 bg-accent-500 rounded-full p-0.5">
                        <Star className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 flex justify-center gap-1 p-1.5 bg-navy-900/70">
                      <button
                        type="button" onClick={() => handleSetCover(photo)}
                        className="text-[11px] font-heading font-medium text-white hover:text-accent-400 px-1.5 py-1"
                      >
                        {editing.cover_image_url === photo.image_url ? 'Cover ✓' : 'Set Cover'}
                      </button>
                      <button
                        type="button" onClick={() => handleDeletePhoto(photo)}
                        className="text-[11px] font-heading font-medium text-white hover:text-error px-1.5 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formError && (
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {formError}
            </p>
          )}
          {successMsg && !uploading && (
            <p className="text-success text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
              {successMsg}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={() => !uploading && setEditorOpen(false)}>
              Close
            </Button>
            <Button type="submit" loading={saving || uploading} disabled={uploading}>
              {uploading ? `Uploading… ${overallProgress}%` : editing ? 'Save Changes' : 'Create Album'}
            </Button>
            {!isAdmin && editing && editing.status === 'draft' && (
              <Button type="button" variant="secondary" onClick={handleSubmitForApproval} disabled={uploading || saving}>
                <Send className="w-4 h-4" />
                Submit for Approval
              </Button>
            )}
            {isAdmin && editing && editing.status !== 'published' && (
              <Button type="button" onClick={handlePublishFlow} disabled={uploading || saving}>
                <Globe className="w-4 h-4" />
                Publish
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}
