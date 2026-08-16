import { useEffect, useState } from 'react'
import { Bell, Pin, FileText, ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getNotices } from '@/services/notices'
import { supabase } from '@/lib/supabase/client'

interface NoticeItem {
  id: string
  title: string
  description: string
  pdf_url: string | null
  priority: string
  is_pinned: boolean
  publish_date: string | null
}

const PAGE_SIZE = 10

const priorityVariant: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'error',
}

export default function StudentNotices() {
  useSeo({ title: 'My Notices' })

  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getNotices({ status: 'published', page, pageSize: PAGE_SIZE })
      .then(({ data, count }) => {
        setNotices(data as NoticeItem[])
        setTotal(count)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Notices</h1>
      <p className="text-muted text-sm mb-6">Official announcements relevant to students.</p>

      {loading ? (
        <LoadingState count={4} type="list" />
      ) : error ? (
        <ErrorState onRetry={() => setPage(page)} />
      ) : notices.length === 0 ? (
        <EmptyState icon={Bell} title="No notices" description="Notices will appear here when published." />
      ) : (
        <>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white border rounded-xl p-5 ${
                  notice.is_pinned ? 'border-cyan-300 bg-cyan-50/30' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {notice.is_pinned && (
                    <span className="inline-flex items-center gap-1 text-cyan-600 text-xs font-heading font-semibold">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <Badge variant={priorityVariant[notice.priority] || 'default'}>{notice.priority}</Badge>
                  <span className="text-xs text-muted ml-auto">
                    {notice.publish_date
                      ? new Date(notice.publish_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-sm text-navy-900">{notice.title}</h3>
                <p className="text-muted text-sm mt-1 leading-relaxed">{notice.description}</p>
                {notice.pdf_url && (
                  <a
                    href={notice.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-heading font-medium text-primary-500 hover:text-primary-600"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View PDF
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
        </>
      )}
    </div>
  )
}
