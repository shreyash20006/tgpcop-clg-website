import { useEffect, useState, useRef, type FormEvent } from 'react'
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  Pin,
  UploadCloud,
  FileText,
  Link2,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react'
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
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  type NoticeStatus,
  type NoticePriority,
} from '@/services/notices'
import { supabase } from '@/lib/supabase/client'

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
const MAX_PDF_SIZE = 25 * 1024 * 1024 // 25 MB

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

  // PDF upload state
  const [pdfMode, setPdfMode] = useState<'upload' | 'link'>('upload')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getNotices({ page: p, pageSize: PAGE_SIZE })
      const filtered = debouncedSearch
        ? (data as NoticeRow[]).filter((n) =>
            n.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
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
    setPdfFile(null)
    setPdfMode('upload')
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
    setPdfFile(null)
    // If existing URL is a drive/external link, switch to link mode by default
    if (item.pdf_url && (item.pdf_url.includes('drive.google') || item.pdf_url.includes('docs.google') || item.pdf_url.includes('dropbox'))) {
      setPdfMode('link')
    } else {
      setPdfMode(item.pdf_url ? 'upload' : 'upload')
    }
    setFormError(null)
    setModalOpen(true)
  }

  async function uploadPdfToStorage(file: File): Promise<string> {
    if (!supabase) throw new Error('Supabase is not configured.')
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `notices/${Date.now()}_${safeName}`

    // Try documents bucket first, then fallback to resources bucket
    let bucket = 'documents'
    let { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: 'application/pdf', upsert: true })

    if (uploadError) {
      bucket = 'resources'
      const fallback = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: 'application/pdf', upsert: true })
      if (fallback.error) {
        throw new Error(fallback.error.message || uploadError.message)
      }
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    return urlData.publicUrl
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving || pdfUploading) return
    setFormError(null)

    if (!form.title.trim() || !form.description.trim()) {
      setFormError('Title and description are required.')
      return
    }

    setSaving(true)
    let finalPdfUrl: string | null = form.pdf_url.trim() || null

    // If user selected a local PDF file to upload
    if (pdfMode === 'upload' && pdfFile) {
      setPdfUploading(true)
      try {
        finalPdfUrl = await uploadPdfToStorage(pdfFile)
      } catch (err) {
        console.error('PDF Upload Error:', err)
        setFormError(
          err instanceof Error
            ? `Failed to upload PDF: ${err.message}`
            : 'Could not upload PDF from device. Check your storage connection.'
        )
        setSaving(false)
        setPdfUploading(false)
        return
      }
      setPdfUploading(false)
    } else if (pdfMode === 'link') {
      finalPdfUrl = form.pdf_url.trim() || null
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      pdf_url: finalPdfUrl,
      priority: form.priority as NoticePriority,
      status: form.status as NoticeStatus,
      is_pinned: form.is_pinned,
      publish_date: form.publish_date || new Date().toISOString(),
      expiry_date: form.expiry_date || null,
    }

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
      setPdfUploading(false)
    }
  }

  async function togglePin(item: NoticeRow) {
    try {
      await updateNotice(item.id, { is_pinned: !item.is_pinned })
      load(page)
    } catch {
      load(page)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this notice?')) return
    setDeletingId(id)
    try {
      await deleteNotice(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } catch {
      load(page)
    } finally {
      setDeletingId(null)
    }
  }

  const priorityVariant: Record<string, 'default' | 'primary' | 'warning' | 'error'> = {
    low: 'default',
    medium: 'primary',
    high: 'warning',
    urgent: 'error',
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body transition-colors'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Notices</h1>
          <p className="text-muted text-sm">
            Publish official notices, circulars, and updates with PDF attachments or Drive links.
          </p>
        </div>
        <Button onClick={openCreate} className="self-start sm:self-auto shrink-0">
          <Plus className="w-4 h-4" />
          New Notice
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search notices..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={5} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={search ? 'No matching notices' : 'No notices yet'}
          description={
            search ? 'Try a different search query.' : 'Create your first notice to get started.'
          }
          actionLabel={search ? undefined : 'Create Notice'}
          onAction={search ? undefined : openCreate}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-light-bg border-b border-border text-xs font-heading font-semibold text-muted uppercase">
                  <tr>
                    <th className="px-5 py-3.5 w-10"></th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Attachment</th>
                    <th className="px-5 py-3.5">Publish Date</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-light-bg/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => togglePin(item)}
                          className={`p-1 rounded hover:bg-light-bg transition-colors ${
                            item.is_pinned ? 'text-primary-500' : 'text-muted/40 hover:text-muted'
                          }`}
                          title={item.is_pinned ? 'Unpin' : 'Pin to top'}
                          aria-label={item.is_pinned ? 'Unpin notice' : 'Pin notice to top'}
                        >
                          <Pin className={`w-4 h-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-heading font-medium text-navy-900 max-w-md truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted max-w-md truncate mt-0.5">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={priorityVariant[item.priority] || 'default'}>
                          {item.priority}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={item.status === 'published' ? 'primary' : 'default'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.pdf_url ? (
                          <a
                            href={item.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-heading font-medium hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            PDF
                            <ExternalLink className="w-3 h-3 text-muted" />
                          </a>
                        ) : (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-muted text-xs whitespace-nowrap">
                        {item.publish_date ? new Date(item.publish_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
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
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && !pdfUploading && setModalOpen(false)}
        title={editing ? 'Edit Notice' : 'New Notice'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="t-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              id="t-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Schedule for Mid-Semester Examinations"
            />
          </div>

          <div>
            <label htmlFor="t-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="t-desc"
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              placeholder="Detailed description of the notice or announcement..."
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

          <div className="pt-1">
            <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              PDF Document Attachment (Optional)
            </label>

            <div className="flex rounded-lg bg-light-bg p-1 border border-border mb-3">
              <button
                type="button"
                onClick={() => setPdfMode('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-heading font-medium rounded-md transition-all ${
                  pdfMode === 'upload'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-muted hover:text-dark-text'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-primary-500" />
                Upload PDF from Device
              </button>
              <button
                type="button"
                onClick={() => setPdfMode('link')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-heading font-medium rounded-md transition-all ${
                  pdfMode === 'link'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-muted hover:text-dark-text'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-primary-500" />
                Google Drive / Web Link
              </button>
            </div>

            {pdfMode === 'upload' ? (
              <div>
                {pdfFile ? (
                  <div className="flex items-center justify-between p-3.5 bg-primary-50/70 border border-primary-200 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-heading font-semibold text-navy-900 truncate">
                          {pdfFile.name}
                        </p>
                        <p className="text-xs text-muted">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB · Selected from device
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const blobUrl = URL.createObjectURL(pdfFile)
                          window.open(blobUrl, '_blank')
                        }}
                        className="px-2.5 py-1 text-xs text-primary-600 hover:text-primary-800 bg-white border border-primary-200 rounded-md font-heading font-medium transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : form.pdf_url ? (
                  <div className="flex items-center justify-between p-3.5 bg-light-bg border border-border rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-heading font-medium text-navy-900 truncate">
                          Attached PDF Document
                        </p>
                        <p className="text-xs text-muted truncate max-w-xs sm:max-w-sm">
                          {form.pdf_url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={form.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-heading font-medium px-2 py-1 hover:bg-primary-50 rounded-md transition-colors"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-muted hover:text-navy-900 font-heading font-medium px-2 py-1 hover:bg-border/50 rounded-md transition-colors"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, pdf_url: '' })}
                        className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      if (e.dataTransfer.files?.[0]) {
                        const f = e.dataTransfer.files[0]
                        if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
                          if (f.size > MAX_PDF_SIZE) {
                            setFormError('PDF file size must be less than 25 MB.')
                          } else {
                            setPdfFile(f)
                            setFormError(null)
                          }
                        } else {
                          setFormError('Please choose a valid PDF file.')
                        }
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                      dragOver
                        ? 'border-primary-500 bg-primary-50/50'
                        : 'border-border bg-light-bg/50 hover:bg-light-bg'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-muted mx-auto mb-1.5" />
                    <p className="text-sm font-heading font-medium text-dark-text">
                      Drag & drop a PDF here, or browse from device
                    </p>
                    <p className="text-xs text-muted mt-0.5 mb-3">
                      Accepts PDF files up to 25 MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-4 h-4" />
                      Choose PDF File
                    </Button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const f = e.target.files[0]
                      if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
                        if (f.size > MAX_PDF_SIZE) {
                          setFormError('PDF file size must be less than 25 MB.')
                        } else {
                          setPdfFile(f)
                          setFormError(null)
                        }
                      } else {
                        setFormError('Please choose a valid PDF file.')
                      }
                    }
                    e.target.value = ''
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    id="t-pdf"
                    type="url"
                    value={form.pdf_url}
                    onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="https://drive.google.com/file/d/... or any PDF link"
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-xs text-muted">
                  <span>Paste any Google Drive view/share link, Dropbox, or public PDF URL.</span>
                  {form.pdf_url && (
                    <a
                      href={form.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-500 hover:underline shrink-0 ml-2 font-medium"
                    >
                      Test Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center pt-1">
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
            <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              disabled={saving || pdfUploading}
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving || pdfUploading}>
              {pdfUploading
                ? 'Uploading PDF…'
                : saving
                ? 'Saving…'
                : editing
                ? 'Save Changes'
                : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
