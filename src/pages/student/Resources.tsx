import { useEffect, useState, type FormEvent } from 'react'
import { BookOpen, FileText, Upload, Clock, CheckCircle2, XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { getResources } from '@/services/resources'

interface ResourceItem {
  id: string
  title: string
  file_url: string
  category: string
  course: string
  subject: string | null
}

interface MySubmission {
  id: string
  title: string
  status: string
  created_at: string
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export default function StudentResources() {
  useSeo({ title: 'My Resources' })

  const { user } = useAuth()
  const [approved, setApproved] = useState<ResourceItem[]>([])
  const [submissions, setSubmissions] = useState<MySubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: '', subject: '', course: 'bpharm', category: 'notes', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    Promise.all([
      getResources({ pageSize: 10 }),
      user
        ? supabase
            .from('resources')
            .select('id, title, status, created_at')
            .eq('uploaded_by', user.id)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] as MySubmission[] }),
    ])
      .then(([resources, subs]) => {
        setApproved(resources.data as ResourceItem[])
        setSubmissions(((subs.data ?? []) as MySubmission[]).slice(0, 10))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting || submitted) return
    setSubmitError(null)

    if (!file) {
      setSubmitError('Please choose a PDF file to upload.')
      return
    }
    if (file.type !== 'application/pdf') {
      setSubmitError('Only PDF files are accepted.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('File must be smaller than 20 MB.')
      return
    }
    if (!form.title.trim()) {
      setSubmitError('Please enter a title.')
      return
    }

    setSubmitting(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${user!.id}/${Date.now()}_${safeName}`
      const { error: uploadError } = await supabase!.storage
        .from('resources')
        .upload(path, file, { contentType: 'application/pdf' })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase!.storage.from('resources').getPublicUrl(path)

      await supabase!.from('resources').insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        file_url: urlData.publicUrl,
        file_type: 'pdf',
        file_size: file.size,
        course: form.course as 'bpharm' | 'dpharm',
        subject: form.subject.trim() || null,
        category: form.category as 'notes' | 'study_material' | 'question_papers' | 'previous_year',
        status: 'pending',
        uploaded_by: user!.id,
      })

      setSubmitted(true)
    } catch {
      setSubmitError('Upload failed. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Resources</h1>
        <p className="text-muted text-sm">Browse approved resources and submit your own for review.</p>
      </div>

      {loading ? (
        <LoadingState count={4} type="list" />
      ) : (
        <>
          {/* Approved resources */}
          <section>
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-3">Recommended Resources</h2>
            {approved.length === 0 ? (
              <EmptyState icon={BookOpen} title="No resources yet" description="Approved resources will appear here." />
            ) : (
              <div className="space-y-2.5">
                {approved.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-medium text-sm text-navy-900 truncate">{resource.title}</p>
                      <p className="text-muted text-xs">
                        {resource.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}
                        {resource.subject ? ` · ${resource.subject}` : ''}
                      </p>
                    </div>
                    <Badge variant="primary">{resource.category.replace(/_/g, ' ')}</Badge>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* Upload form */}
          <section className="max-w-2xl">
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary-500" />
              Submit a Resource
            </h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-sm text-navy-900">Submitted for review</p>
                  <p className="text-muted text-sm mt-0.5">
                    Your resource will appear publicly once approved by the administrator.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 space-y-4" noValidate>
                <div>
                  <label htmlFor="file" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    PDF File (max 20 MB)
                  </label>
                  <input
                    id="file"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-muted border border-border rounded-lg px-4 py-2.5 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-500 file:text-sm file:font-heading file:cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="r-title" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Title <span className="text-error">*</span>
                    </label>
                    <input
                      id="r-title"
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="r-subject" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="r-subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="r-course" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Course
                    </label>
                    <select
                      id="r-course"
                      value={form.course}
                      onChange={(e) => setForm({ ...form, course: e.target.value })}
                      className={inputClass}
                    >
                      <option value="bpharm">B.Pharm</option>
                      <option value="dpharm">D.Pharm</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="r-category" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Type
                    </label>
                    <select
                      id="r-category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass}
                    >
                      <option value="notes">Notes</option>
                      <option value="study_material">Study Material</option>
                      <option value="question_papers">Question Papers</option>
                      <option value="previous_year">Previous Year Papers</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="r-desc" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="r-desc"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputClass}
                  />
                </div>
                {submitError && (
                  <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {submitError}
                  </p>
                )}
                <Button type="submit" loading={submitting}>
                  Submit for Review
                </Button>
              </form>
            )}
          </section>

          {/* My submissions */}
          {submissions.length > 0 && (
            <section>
              <h2 className="font-heading font-semibold text-base text-navy-900 mb-3">My Submissions</h2>
              <div className="bg-white border border-border rounded-xl divide-y divide-border">
                {submissions.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-9 h-9 rounded-lg bg-light-bg flex items-center justify-center shrink-0">
                      {sub.status === 'approved' ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : sub.status === 'rejected' ? (
                        <XCircle className="w-4 h-4 text-error" />
                      ) : (
                        <Clock className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <p className="text-sm text-dark-text flex-1 min-w-0 truncate">{sub.title}</p>
                    <Badge
                      variant={
                        sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'error' : 'warning'
                      }
                    >
                      {sub.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
