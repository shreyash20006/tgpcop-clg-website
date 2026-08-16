import { useEffect, useState } from 'react'
import { Mail, Phone, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getEnquiries, updateEnquiryStatus, type EnquiryStatus } from '@/services/enquiries'

interface EnquiryRow {
  id: string
  name: string
  phone: string
  email: string
  course: string | null
  message: string | null
  status: string
  created_at: string
}

const PAGE_SIZE = 10

const statusVariant: Record<string, 'warning' | 'info' | 'success' | 'default'> = {
  new: 'warning',
  contacted: 'info',
  converted: 'success',
  closed: 'default',
}

const nextStatus: Record<string, EnquiryStatus[]> = {
  new: ['contacted', 'closed'],
  contacted: ['converted', 'closed'],
  converted: ['closed'],
  closed: ['new'],
}

export default function AdminEnquiries() {
  useSeo({ title: 'Admission Enquiries' })

  const [items, setItems] = useState<EnquiryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'' | EnquiryStatus>('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getEnquiries({
        status: statusFilter || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      })
      setItems(data as EnquiryRow[])
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
  }, [statusFilter, page])

  async function handleStatus(id: string, status: EnquiryStatus) {
    setActionId(id)
    try {
      await updateEnquiryStatus(id, status)
      setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    } catch {
      load(page)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Admission Enquiries</h1>
      <p className="text-muted text-sm mb-6">Enquiries submitted through the admissions and contact forms.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'All', value: '' },
          { label: 'New', value: 'new' },
          { label: 'Contacted', value: 'contacted' },
          { label: 'Converted', value: 'converted' },
          { label: 'Closed', value: 'closed' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value as '' | EnquiryStatus)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-heading font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-border text-dark-text hover:border-primary-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState count={3} type="list" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No enquiries"
          description="Admission enquiries submitted through the website will appear here."
        />
      ) : (
        <>
          <div className="space-y-4">
            {items.map((enquiry) => (
              <div key={enquiry.id} className="bg-white border border-border rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-heading font-semibold text-base text-navy-900">
                        {enquiry.name}
                      </h3>
                      <Badge variant={statusVariant[enquiry.status] || 'default'}>{enquiry.status}</Badge>
                      {enquiry.course && <Badge variant="primary">{enquiry.course}</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted mb-2">
                      <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 hover:text-primary-500">
                        <Mail className="w-3.5 h-3.5" />
                        {enquiry.email}
                      </a>
                      <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1.5 hover:text-primary-500">
                        <Phone className="w-3.5 h-3.5" />
                        {enquiry.phone}
                      </a>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {enquiry.message && (
                      <p className="text-dark-text/80 text-sm leading-relaxed bg-light-bg rounded-lg px-4 py-3">
                        {enquiry.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {(nextStatus[enquiry.status] || []).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatus(enquiry.id, status)}
                        disabled={actionId === enquiry.id}
                        className="px-3 py-1.5 text-xs font-heading font-medium border border-border rounded-md hover:bg-primary-50 hover:border-primary-300 hover:text-primary-500 transition-colors capitalize disabled:opacity-40"
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-6" />
        </>
      )}
    </div>
  )
}
