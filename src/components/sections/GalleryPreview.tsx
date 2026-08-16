import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Images, Camera, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { getPublishedAlbums, type AlbumRow } from '@/services/galleryAlbums'
import { supabase } from '@/lib/supabase/client'

export default function GalleryPreview() {
  const reduceMotion = useReducedMotion()
  const [albums, setAlbums] = useState<AlbumRow[]>([])

  useEffect(() => {
    if (!supabase) return
    getPublishedAlbums(1, 3)
      .then(({ data }) => setAlbums(data))
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <SectionHeading
          label="Gallery"
          heading="Glimpses of campus life"
          ctaLabel="View full gallery"
          ctaLink="/gallery"
        />
        {albums.length === 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-navy-900 via-primary-600 to-accent-500 flex items-center justify-center"
                >
                  <Camera className="w-10 h-10 text-white/20" aria-hidden="true" />
                </div>
              ))}
            </div>
            <p className="text-center text-muted text-sm mt-4">
              Photo albums will appear here once published by the college.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : i * 0.08 }}
              >
                <Link
                  to={`/gallery/${album.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-border hover:shadow-md hover:-translate-y-0.5 transition-all"
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
                        <Images className="w-8 h-8 text-white/20" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-sm text-navy-900 group-hover:text-primary-500 transition-colors truncate">
                      {album.title}
                    </h3>
                    <p className="text-muted text-xs mt-1">
                      {album.photo_count} {album.photo_count === 1 ? 'Photo' : 'Photos'}
                      {album.event_date
                        ? ` · ${new Date(album.event_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}`
                        : ''}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 mt-8 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          Browse all albums
          <ArrowRight className="w-4 h-4" />
        </Link>
      </PageContainer>
    </section>
  )
}
