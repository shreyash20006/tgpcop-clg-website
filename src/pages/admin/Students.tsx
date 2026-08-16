import { useEffect, useState } from 'react'
import { Users, CheckCircle2, XCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getStudents, verifyStudent, type VerificationStatus } from '@/services/students'

interface Student {
  id: string
  prn: string
  full_name: string
  email: string
  course: string
  year: number
  verification_status: string
  created_at: string
}

const PAGE_SIZE = 10

export default function AdminStudents() {
  useSeo({ title: 'Manage Students' })

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | VerificationStatus>('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getStudents({
        search: debouncedSearch || undefined,
        verification_status: statusFilter || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      })
      setStudents(data as Student[])
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
  }, [debouncedSearch, statusFilter, page])

  async function handleVerify(id: string, status: 'approved' | 'rejected') {
    setActionId(id)
    try {
      await verifyStudent(id, status)
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, verification_status: status } : s))
      )
    } catch {
      // RLS or network error — reload to reflect actual state
      load(page)
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Students</h1>
      <p className="text-muted text-sm mb-6">Registered student profiles and verification status.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search by name..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as '' | VerificationStatus)
            setPage(1)
          }}
          className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <LoadingState count={5} type="table" />
      ) : error ? (
        <ErrorState onRetry={() => load(page)} />
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search || statusFilter ? 'No students found' : 'No students registered yet'}
          description={search || statusFilter ? 'Try adjusting your filters.' : 'Student registrations will appear here.'}
        />
      ) : (
        <>
          <div className="bg-white border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-light-bg text-left">
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Student</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">PRN</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wrier">Course</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-light-bg/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-navy-900">{student.full_name}</p>
                      <p className="text-muted text-xs">{student.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{student.prn}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-dark-text">
                        {student.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}
                      </span>
                      <span className="text-muted text-xs block">Year {student.year}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          student.verification_status === 'approved'
                            ? 'success'
                            : student.verification_status === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {student.verification_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {student.verification_status !== 'approved' && (
                        <button
                          onClick={() => handleVerify(student.id, 'approved')}
                          disabled={actionId === student.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-heading font-medium text-success hover:bg-green-50 rounded-md disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {student.verification_status !== 'rejected' && (
                        <button
                          onClick={() => handleVerify(student.id, 'rejected')}
                          disabled={actionId === student.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-heading font-medium text-error hover:bg-red-50 rounded-md disabled:opacity-50 ml-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-6" />
        </>
      )}
    </div>
  )
}
