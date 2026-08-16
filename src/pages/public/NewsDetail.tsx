import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Newspaper, ArrowLeft, CalendarDays } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { getNewsBySlug } from '@/services/news'

interface NewsData {
  id: string
  title: string
  slug: string
  description: string
  content: string | null
  image_url: string | null
  category: string | null
  published_at: string | null
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useSeo({
    title: item ? item.title : 'News',
    description: item?.description?.slice(0, 150),
  })

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    getNewsBySlug(slug)
      .then((data) => setItem(data as NewsData | null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <PageContainer className="py-16">
        <LoadingState count={1} type="text" />
      </PageContainer>
    )
  }

  if (!item) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={Newspaper}
          title="Article not found"
          description="This news article may have been removed or the link is incorrect."
          actionLabel="Browse news"
          onAction={() => navigate('/news')}
        />
      </PageContainer>
    )
  }

  return (
    <>
      <div className="bg-navy-900 py-14 md:py-20">
        <PageContainer>
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white mb-2">
            <Breadcrumb items={[{ label: 'News', path: '/news' }, { label: item.title }]} />
          </div>
          {item.category && <Badge variant="primary" className="mb-3">{item.category}</Badge>}
          <h1 className="font-heading font-bold text-2xl md:text-4xl text-white leading-snug">
            {item.title}
          </h1>
          {item.published_at && (
            <p className="text-white/60 text-sm mt-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {new Date(item.published_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </PageContainer>
      </div>

      <PageContainer className="py-12 md:py-16">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to news
        </Link>

        <article className="max-w-3xl">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full rounded-xl mb-8"
              loading="lazy"
            />
          ) : (
            <div className="bg-gradient-to-br from-navy-800 to-primary-500 rounded-xl h-64 flex items-center justify-center mb-8">
              <Newspaper className="w-16 h-16 text-white/20" aria-hidden="true" />
            </div>
          )}
          <p className="text-dark-text/85 text-base leading-relaxed mb-6">{item.description}</p>
          {item.content && (
            <div className="text-dark-text/85 leading-relaxed whitespace-pre-line font-body">
              {item.content}
            </div>
          )}
        </article>
      </PageContainer>
    </>
  )
}
