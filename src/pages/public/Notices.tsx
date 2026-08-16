import { useEffect, useState } from 'react'
import { Bell, Pin, FileText, ExternalLink } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getNotices } from '@/services/notices'
import { supabase } from '@/lib/supabase/client'

interface NoticeItem {
  id: string
  title: string
  description: string
  pdf_url: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
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

export default function Notices() {
  useSeo({
    title: 'Notices',
    description: 'Official notices and circulars from TGPCOP Nagpur.',
  })

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
    <>
      <PageHeader
        title="Notices"
        description="Official announcements, circulars and important updates."
        breadcrumbItems={[{ label: 'Notices' }]}
      />

      <PageContainer className="py-12 md:py-16">
        {loading ? (
          <LoadingState count={5} type="list" />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : notices.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notices"
            description="Official notices will be published here as they are issued."
          />
        ) : (
          <>
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`bg-white border rounded-xl p-5 flex items-start gap-4 ${
                    notice.is_pinned ? 'border-cyan-300 bg-cyan-50/30' : 'border-border'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    {notice.pdf_url ? (
                      <FileText className="w-5 h-5 text-primary-500" />
                    ) : (
                      <Bell className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {notice.is_pinned && (
                        <span className="inline-flex items-center gap-1 text-cyan-600 text-xs font-heading font-semibold">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                      <Badge variant={priorityVariant[notice.priority] || 'default'}>
                        {notice.priority}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-semibold text-base text-navy-900">
                      {notice.title}
                    </h3>
                    <p className="text-muted text-sm mt-1 leading-relaxed">{notice.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-muted whitespace-nowrap">
                      {notice.publish_date
                        ? new Date(notice.publish_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                    {notice.pdf_url && (
                      <a
                        href={notice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-heading font-medium text-primary-500 hover:text-primary-600"
                      >
                        View PDF
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </PageContainer>
    </>
  )
}
