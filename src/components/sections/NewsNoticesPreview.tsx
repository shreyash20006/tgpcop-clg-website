import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, Bell, Pin, FileText } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import { getLatestNews } from '@/services/news'
import { getLatestNotices } from '@/services/notices'
import { supabase } from '@/lib/supabase/client'

interface NewsItem {
  id: string
  title: string
  slug: string
  description: string
  published_at: string | null
  category: string | null
}

interface NoticeItem {
  id: string
  title: string
  description: string
  is_pinned: boolean
  priority: string
  publish_date: string | null
  pdf_url: string | null
}

export default function NewsNoticesPreview() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    Promise.all([getLatestNews(2), getLatestNotices(4)])
      .then(([n, t]) => {
        setNews(n as NewsItem[])
        setNotices(t as NoticeItem[])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 md:py-24 bg-light-bg">
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* News */}
          <div>
            <SectionHeading
              label="News"
              heading="Latest from the college"
              ctaLabel="All news"
              ctaLink="/news"
            />
            {loading ? (
              <LoadingState count={2} />
            ) : news.length === 0 ? (
              <EmptyState
                icon={Newspaper}
                title="No news yet"
                description="College news and announcements will appear here."
              />
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug}`}
                    className="block bg-white border border-border rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    {item.category && <Badge variant="primary">{item.category}</Badge>}
                    <h3 className="font-heading font-semibold text-base text-navy-900 mt-2 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-muted text-sm line-clamp-2 mb-2">{item.description}</p>
                    <span className="text-xs text-muted">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notices */}
          <div>
            <SectionHeading
              label="Notices"
              heading="Official announcements"
              ctaLabel="All notices"
              ctaLink="/notices"
            />
            {loading ? (
              <LoadingState count={4} type="list" />
            ) : notices.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notices"
                description="Official notices and circulars will be published here."
              />
            ) : (
              <div className="bg-white border border-border rounded-xl divide-y divide-border">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                      {notice.pdf_url ? (
                        <FileText className="w-4 h-4 text-primary-500" />
                      ) : (
                        <Bell className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {notice.is_pinned && (
                          <Pin className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-label="Pinned" />
                        )}
                        <h4 className="font-heading font-medium text-sm text-navy-900 truncate">
                          {notice.title}
                        </h4>
                      </div>
                      <p className="text-muted text-xs mt-1 line-clamp-1">{notice.description}</p>
                    </div>
                    <span className="text-xs text-muted shrink-0">
                      {notice.publish_date
                        ? new Date(notice.publish_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
