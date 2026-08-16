import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getNews } from '@/services/news'
import { supabase } from '@/lib/supabase/client'

interface NewsItem {
  id: string
  title: string
  slug: string
  description: string
  image_url: string | null
  category: string | null
  is_featured: boolean
  published_at: string | null
}

const PAGE_SIZE = 9

export default function News() {
  useSeo({
    title: 'News',
    description: 'News and updates from Tulsiramji Gaikwad-Patil College of Pharmacy, Nagpur.',
  })

  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getNews({ status: 'published', page, pageSize: PAGE_SIZE })
      .then(({ data, count }) => {
        const filtered = debouncedSearch
          ? (data as NewsItem[]).filter((n) =>
              n.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
          : (data as NewsItem[])
        setNews(filtered)
        setTotal(count)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [debouncedSearch, page])

  return (
    <>
      <PageHeader
        title="News"
        description="Latest news, achievements and updates from TGPCOP."
        breadcrumbItems={[{ label: 'News' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search news..."
          className="max-w-md mb-8"
        />

        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : news.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title={debouncedSearch ? 'No news found' : 'No news yet'}
            description={
              debouncedSearch
                ? 'Try a different search term.'
                : 'College news and announcements will appear here.'
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-navy-800 to-primary-500 h-44 flex items-center justify-center">
                      <Newspaper className="w-10 h-10 text-white/20" aria-hidden="true" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {item.category && <Badge variant="primary">{item.category}</Badge>}
                      {item.is_featured && <Badge variant="warning">Featured</Badge>}
                    </div>
                    <h3 className="font-heading font-semibold text-base text-navy-900 mb-2 group-hover:text-primary-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted text-sm line-clamp-2 mb-3">{item.description}</p>
                    <span className="text-xs text-muted">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </PageContainer>
    </>
  )
}
