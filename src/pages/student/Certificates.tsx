import { useEffect, useState } from 'react'
import { Award, Download } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { getStudentByUserId } from '@/services/students'

interface Certificate {
  id: string
  title: string
  description: string | null
  certificate_url: string
  issued_date: string | null
  type: string | null
}

export default function StudentCertificates() {
  useSeo({ title: 'My Certificates' })

  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !user) {
      setLoading(false)
      return
    }
    getStudentByUserId(user.id)
      .then(async (student) => {
        if (!student) return
        const { data } = await supabase!
          .from('certificates')
          .select('*')
          .eq('student_id', student.id)
          .order('issued_date', { ascending: false })
        setCertificates((data ?? []) as Certificate[])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Certificates</h1>
      <p className="text-muted text-sm mb-6">
        Event participation, achievement and course certificates issued to you by the college.
      </p>

      {loading ? (
        <LoadingState count={3} type="list" />
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Certificates issued by the college will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                {cert.type && <Badge variant="warning">{cert.type}</Badge>}
              </div>
              <h3 className="font-heading font-semibold text-sm text-navy-900">{cert.title}</h3>
              {cert.description && <p className="text-muted text-sm mt-1">{cert.description}</p>}
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted">
                  {cert.issued_date
                    ? new Date(cert.issued_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : ''}
                </span>
                <a
                  href={cert.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-xs font-heading font-medium rounded-md hover:bg-primary-600 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
