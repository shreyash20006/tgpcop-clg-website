import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Images, Camera } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { getPublishedAlbums, ALBUM_CATEGORIES, type AlbumRow } from '@/services/galleryAlbums'
import { supabase } from '@/lib/supabase/client'

const PAGE_SIZE = 12

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description: 'Photo albums from TGPCOP Nagpur — events, academics, sports and campus life.',
  })

  const [albums, setAlbums] = useState<AlbumRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getPublishedAlbums(page, PAGE_SIZE)
      .then(({ data, count }) => {
        setAlbums(data)
        setTotal(count)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Moments from campus life at TGPCOP, album by album."
        breadcrumbItems={[{ label: 'Gallery' }]}
      />

      <PageContainer className="py-12 md:py-16">
        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : albums.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Gallery coming soon"
            description="Photo albums from college events and campus life will appear here."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, i) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : (i % 3) * 0.08 }}
                >
                  <Link
                    to={`/gallery/${album.slug}`}
                    className="group block bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-navy-900 to-primary-600 overflow-hidden">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-10 h-10 text-white/20" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Badge variant="primary" className="mb-2">
                        {ALBUM_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category.replace(/_/g, ' ')}
                      </Badge>
                      <h3 className="font-heading font-semibold text-base text-navy-900 group-hover:text-primary-500 transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-muted text-sm mt-1.5">
                        {album.event_date
                          ? new Date(album.event_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : ''}
                        {album.photo_count > 0 && (
                          <>{' · '}{album.photo_count} {album.photo_count === 1 ? 'Photo' : 'Photos'}</>
                        )}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-10" />
          </>
        )}
      </PageContainer>
    </>
  )
}
