import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Images, Camera, ArrowRight, Layers } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { getPublishedAlbums, type AlbumWithPhotos } from '@/services/galleryAlbums'
import { supabase } from '@/lib/supabase/client'

export default function GalleryPreview() {
  const reduceMotion = useReducedMotion()
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>([])

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  className="group block rounded-2xl overflow-hidden bg-white border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-navy-900 to-primary-600 overflow-hidden">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images className="w-8 h-8 text-white/20" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-950/75 backdrop-blur-md text-white text-[11px] font-heading font-medium">
                      <Layers className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{album.photo_count} {album.photo_count === 1 ? 'Photo' : 'Photos'}</span>
                    </div>
                  </div>

                  {/* 3 mini photo previews */}
                  {album.previewPhotos && album.previewPhotos.length > 1 && (
                    <div className="grid grid-cols-3 gap-1 p-1.5 bg-light-bg/80 border-t border-border">
                      {album.previewPhotos.slice(0, 3).map((p) => (
                        <div key={p.id} className="aspect-square rounded-md overflow-hidden bg-navy-950/10">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-base text-navy-900 group-hover:text-primary-500 transition-colors truncate">
                      {album.title}
                    </h3>
                    <p className="text-muted text-xs mt-1">
                      {album.event_date
                        ? new Date(album.event_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : `${album.photo_count} photos`}
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
