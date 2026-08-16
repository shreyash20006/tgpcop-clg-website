import { useEffect, useState } from 'react'
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { getStudents, verifyStudent } from '@/services/students'

interface PendingStudent {
  id: string
  prn: string
  full_name: string
  email: string
  phone: string | null
  course: string
  year: number
  semester: number
  verification_status: string
  created_at: string
}

export default function AdminVerification() {
  useSeo({ title: 'Student Verification' })

  const [pending, setPending] = useState<PendingStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const { data } = await getStudents({ verification_status: 'pending', pageSize: 50 })
      setPending(data as PendingStudent[])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleVerify(id: string, status: 'approved' | 'rejected') {
    setActionId(id)
    try {
      await verifyStudent(id, status)
      setPending((prev) => prev.filter((s) => s.id !== id))
    } catch {
      load()
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Student Verification</h1>
      <p className="text-muted text-sm mb-6">
        Approve or reject student profiles. Approved students become publicly verifiable by PRN.
      </p>

      {loading ? (
        <LoadingState count={3} type="list" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : pending.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No pending verifications"
          description="All student profiles have been reviewed."
        />
      ) : (
        <div className="space-y-4">
          {pending.map((student) => (
            <div key={student.id} className="bg-white border border-amber-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-900 to-primary-600 flex items-center justify-center shrink-0">
                  <span className="font-heading font-bold text-white text-lg">
                    {student.full_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-semibold text-base text-navy-900">
                      {student.full_name}
                    </h3>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-3 text-sm">
                    <div>
                      <dt className="text-muted text-xs">PRN</dt>
                      <dd className="font-medium text-dark-text">{student.prn}</dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs">Email</dt>
                      <dd className="font-medium text-dark-text truncate">{student.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs">Phone</dt>
                      <dd className="font-medium text-dark-text">{student.phone || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs">Course</dt>
                      <dd className="font-medium text-dark-text">
                        {student.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs">Year / Semester</dt>
                      <dd className="font-medium text-dark-text">
                        {student.year} / {student.semester}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted text-xs">Submitted</dt>
                      <dd className="font-medium text-dark-text">
                        {new Date(student.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleVerify(student.id, 'approved')}
                    loading={actionId === student.id}
                    className="flex-1 sm:flex-none"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleVerify(student.id, 'rejected')}
                    disabled={actionId === student.id}
                    className="flex-1 sm:flex-none"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
