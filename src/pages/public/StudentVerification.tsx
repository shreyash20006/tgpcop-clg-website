import { useState, type FormEvent } from 'react'
import { ShieldCheck, Search, CheckCircle2, XCircle, Clock } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useSeo } from '@/lib/seo'
import { getStudentByPRN } from '@/services/students'
import { supabase } from '@/lib/supabase/client'

interface VerificationResult {
  full_name: string
  course: string
  year: number
  verification_status: 'pending' | 'approved' | 'rejected'
}

function maskName(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase()
  return `${firstName} ${lastInitial}.`
}

export default function StudentVerification() {
  useSeo({
    title: 'Student Verification',
    description: 'Verify a TGPCOP student by PRN — public verification service.',
  })

  const [prn, setPrn] = useState('')
  const [searching, setSearching] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!prn.trim() || searching) return
    setSearching(true)
    setResult(null)
    setNotFound(false)
    setSearched(false)
    try {
      const data = (await getStudentByPRN(prn.trim())) as VerificationResult | null
      if (data) {
        setResult(data)
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }

  return (
    <>
      <PageHeader
        title="Student Verification"
        description="Verify the enrollment status of a TGPCOP student using their PRN (Permanent Registration Number)."
        breadcrumbItems={[{ label: 'Student Verification' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white border border-border rounded-xl p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prn" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Enter PRN
                </label>
                <input
                  id="prn"
                  type="text"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  placeholder="e.g. 2023B0001"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-body tracking-wide"
                />
              </div>
              <Button type="submit" loading={searching} className="w-full">
                <Search className="w-4 h-4" />
                Verify Student
              </Button>
            </form>
          </div>

          {searched && result && (
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-lg text-navy-900">Verification Result</h2>
                  <p className="text-muted text-xs">PRN: {prn}</p>
                </div>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Name</dt>
                  <dd className="font-medium text-dark-text">{maskName(result.full_name)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Course</dt>
                  <dd className="font-medium text-dark-text">
                    {result.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Year</dt>
                  <dd className="font-medium text-dark-text">{result.year}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted">Status</dt>
                  <dd>
                    {result.verification_status === 'approved' ? (
                      <span className="inline-flex items-center gap-1.5 text-success font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Verified Student
                      </span>
                    ) : result.verification_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 text-warning font-medium">
                        <Clock className="w-4 h-4" /> Verification Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-error font-medium">
                        <XCircle className="w-4 h-4" /> Not Verified
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
              <p className="text-muted text-xs mt-5 pt-4 border-t border-border">
                For privacy reasons, only limited information is displayed. Contact the college
                office for official verification certificates.
              </p>
            </div>
          )}

          {searched && notFound && (
            <div className="bg-white border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-error" />
              </div>
              <h2 className="font-heading font-semibold text-base text-navy-900 mb-1.5">
                {supabase ? 'No record found' : 'Verification service unavailable'}
              </h2>
              <p className="text-muted text-sm">
                {supabase
                  ? 'No student was found with this PRN. Please check the PRN and try again, or contact the college office.'
                  : 'The verification service requires backend configuration. Please contact the college office to verify a student.'}
              </p>
            </div>
          )}

          <div className="bg-light-bg border border-border rounded-xl p-5 mt-8 text-sm text-muted leading-relaxed">
            <Badge variant="info" className="mb-2">Privacy note</Badge>
            <p className="mt-2">
              This service displays only the student's name (first name with last initial), course,
              year and verification status. Contact details and private records are never exposed.
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
