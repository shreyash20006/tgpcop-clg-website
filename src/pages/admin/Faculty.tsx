import { useEffect, useState, type FormEvent } from 'react'
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '@/services/faculty'

interface FacultyRow {
  id: string
  name: string
  designation: string
  department: string | null
  qualification: string | null
  experience: string | null
  email: string | null
  photo_url: string | null
  is_active: boolean
}

const emptyForm = {
  name: '',
  designation: '',
  department: '',
  qualification: '',
  experience: '',
  email: '',
  photo_url: '',
}

const PAGE_SIZE = 10

export default function AdminFaculty() {
  useSeo({ title: 'Manage Faculty' })

  const [items, setItems] = useState<FacultyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FacultyRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getFaculty({
        search: debouncedSearch || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      })
      setItems(data as FacultyRow[])
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

  function openEdit(item: FacultyRow) {
    setEditing(item)
    setForm({
      name: item.name,
      designation: item.designation,
      department: item.department || '',
      qualification: item.qualification || '',
      experience: item.experience || '',
      email: item.email || '',
      photo_url: item.photo_url || '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)
    if (!form.name.trim() || !form.designation.trim()) {
      setFormError('Name and designation are required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      department: form.department.trim() || null,
      qualification: form.qualification.trim() || null,
      experience: form.experience.trim() || null,
      email: form.email.trim() || null,
      photo_url: form.photo_url.trim() || null,
    }

    setSaving(true)
    try {
      if (editing) {
        await updateFaculty(editing.id, payload)
      } else {
        await createFaculty(payload)
      }
      setModalOpen(false)
      load(page)
    } catch {
      setFormError('Could not save the faculty member. Check your permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (deletingId) return
    if (!window.confirm('Remove this faculty member permanently?')) return
    setDeletingId(id)
    try {
      await deleteFaculty(id)
      setItems((prev) => prev.filter((f) => f.id !== id))
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
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Faculty</h1>
          <p className="text-muted text-sm">Manage faculty profiles shown on the public website.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Faculty
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        placeholder="Search faculty..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={search ? 'No faculty found' : 'No faculty added yet'}
          description={search ? 'Try a different search.' : 'Add verified faculty information only.'}
          actionLabel="Add Faculty"
          onAction={openCreate}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-bg text-left">
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Designation</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Department</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-light-bg/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900">{item.name}</p>
                      {item.email && <p className="text-muted text-xs">{item.email}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-dark-text">{item.designation}</td>
                    <td className="px-5 py-3.5 text-muted">{item.department || '—'}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-muted hover:text-primary-500 hover:bg-primary-50 rounded-md"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md disabled:opacity-40"
                        aria-label={`Delete ${item.name}`}
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
        title={editing ? 'Edit Faculty' : 'Add Faculty'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-name" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Name <span className="text-error">*</span>
              </label>
              <input
                id="f-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="f-designation" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Designation <span className="text-error">*</span>
              </label>
              <input
                id="f-designation"
                type="text"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className={inputClass}
                placeholder="e.g. Assistant Professor"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-dept" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Department
              </label>
              <input
                id="f-dept"
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="f-qual" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Qualification
              </label>
              <input
                id="f-qual"
                type="text"
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className={inputClass}
                placeholder="e.g. M.Pharm, Ph.D."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-exp" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Experience
              </label>
              <input
                id="f-exp"
                type="text"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className={inputClass}
                placeholder="e.g. 5 years"
              />
            </div>
            <div>
              <label htmlFor="f-email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Email
              </label>
              <input
                id="f-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="f-photo" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Photo URL
            </label>
            <input
              id="f-photo"
              type="url"
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              className={inputClass}
              placeholder="https://... (upload to Supabase Storage first)"
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
              {editing ? 'Save Changes' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
