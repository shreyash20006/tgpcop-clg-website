import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  Images,
  Camera,
  FolderKanban,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Layers,
} from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import {
  getPublishedAlbums,
  getAllPublishedPhotos,
  ALBUM_CATEGORIES,
  type AlbumWithPhotos,
  type PublishedPhotoWithAlbum,
} from '@/services/galleryAlbums'
import { supabase } from '@/lib/supabase/client'

const PAGE_SIZE = 12

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description: 'Photo albums and moments from TGPCOP Nagpur — events, academics, sports and campus life.',
  })

  const [viewMode, setViewMode] = useState<'photos' | 'albums'>('photos')
  const [category, setCategory] = useState<string>('all')
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>([])
  const [photos, setPhotos] = useState<PublishedPhotoWithAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  // Load data based on view mode and category
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)

    if (viewMode === 'albums') {
      getPublishedAlbums(page, PAGE_SIZE, category)
        .then(({ data, count }) => {
          setAlbums(data)
          setTotal(count)
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    } else {
      getAllPublishedPhotos({ category, page, pageSize: 24 })
        .then(({ data, count }) => {
          setPhotos(data)
          setTotal(count)
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }, [viewMode, category, page])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  )
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  return (
    <>
      <PageHeader
        title="Campus Gallery"
        description="Explore vibrant moments, cultural events, academic milestones, and campus life at TGPCOP Nagpur."
        breadcrumbItems={[{ label: 'Gallery' }]}
      />

      <PageContainer className="py-10 md:py-14">
        {/* Controls Toolbar: View Mode Switcher + Category Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
          {/* View Mode Tabs */}
          <div className="inline-flex p-1 bg-light-bg rounded-xl border border-border self-start">
            <button
              onClick={() => { setViewMode('photos'); setPage(1) }}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-heading font-medium rounded-lg transition-all ${
                viewMode === 'photos'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-muted hover:text-dark-text'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-primary-500" />
              All Photos
            </button>
            <button
              onClick={() => { setViewMode('albums'); setPage(1) }}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-heading font-medium rounded-lg transition-all ${
                viewMode === 'albums'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-muted hover:text-dark-text'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-primary-500" />
              Albums
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => { setCategory('all'); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-heading font-medium rounded-full shrink-0 transition-colors ${
                category === 'all'
                  ? 'bg-navy-900 text-white'
                  : 'bg-light-bg text-muted hover:bg-border/60 hover:text-dark-text'
              }`}
            >
              All Categories
            </button>
            {ALBUM_CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => { setCategory(c.value); setPage(1) }}
                className={`px-3 py-1.5 text-xs font-heading font-medium rounded-full shrink-0 transition-colors ${
                  category === c.value
                    ? 'bg-navy-900 text-white'
                    : 'bg-light-bg text-muted hover:bg-border/60 hover:text-dark-text'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <LoadingState count={viewMode === 'photos' ? 8 : 6} />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : viewMode === 'photos' ? (
          /* ================= ALL PHOTOS VIEW ================= */
          photos.length === 0 ? (
            <EmptyState
              icon={Images}
              title="No photos found"
              description={
                category !== 'all'
                  ? 'No photos in this category yet. Try selecting another category.'
                  : 'Photo albums from college events and campus life will appear here.'
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : (i % 8) * 0.04 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-navy-950/5 border border-border/80 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text || photo.album?.title || 'Campus photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay & Info on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-between p-3.5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-navy-900 backdrop-blur-sm transition-colors shadow"
                          aria-label="Enlarge photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        {photo.album?.category && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-heading font-semibold uppercase tracking-wider rounded-md bg-accent-500/90 text-navy-950 mb-1">
                            {ALBUM_CATEGORIES.find((c) => c.value === photo.album?.category)?.label ?? photo.album.category}
                          </span>
                        )}
                        <p className="text-xs font-heading font-semibold text-white truncate line-clamp-1">
                          {photo.album?.title || photo.caption || 'Campus Life'}
                        </p>
                        {photo.album?.slug && (
                          <Link
                            to={`/gallery/${photo.album.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white mt-1 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>View album</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Quick click to open lightbox */}
                    <button
                      onClick={() => setLightboxIndex(i)}
                      className="absolute inset-0 w-full h-full cursor-zoom-in"
                      aria-label={photo.caption || photo.album?.title || `Open photo ${i + 1}`}
                    />
                  </motion.div>
                ))}
              </div>

              <Pagination
                page={page}
                pageSize={24}
                total={total}
                onPageChange={setPage}
                className="mt-10"
              />
            </>
          )
        ) : (
          /* ================= ALBUMS VIEW ================= */
          albums.length === 0 ? (
            <EmptyState
              icon={Images}
              title="No albums found"
              description={
                category !== 'all'
                  ? 'No albums in this category yet.'
                  : 'Photo albums from college events will appear here.'
              }
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
                      className="group block bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                    >
                      {/* Main Cover Image */}
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
                            <Camera className="w-12 h-12 text-white/20" aria-hidden="true" />
                          </div>
                        )}

                        {/* Photo count floating pill */}
                        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-950/75 backdrop-blur-md text-white text-xs font-heading font-medium">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          <span>{album.photo_count} {album.photo_count === 1 ? 'Photo' : 'Photos'}</span>
                        </div>
                      </div>

                      {/* Preview Photo Strip (if multiple photos exist) */}
                      {album.previewPhotos && album.previewPhotos.length > 1 && (
                        <div className="grid grid-cols-4 gap-1 p-2 bg-light-bg/80 border-t border-border">
                          {album.previewPhotos.slice(0, 4).map((p) => (
                            <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-navy-950/10">
                              <img src={p.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Details */}
                      <div className="p-5">
                        <Badge variant="primary" className="mb-2">
                          {ALBUM_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category.replace(/_/g, ' ')}
                        </Badge>
                        <h3 className="font-heading font-semibold text-lg text-navy-900 group-hover:text-primary-500 transition-colors line-clamp-1">
                          {album.title}
                        </h3>
                        {album.description && (
                          <p className="text-muted text-xs line-clamp-2 mt-1.5 leading-relaxed">
                            {album.description}
                          </p>
                        )}
                        {album.event_date && (
                          <div className="flex items-center gap-1.5 text-muted text-xs mt-3 pt-3 border-t border-border/60">
                            <Calendar className="w-3.5 h-3.5 text-primary-500" />
                            <span>
                              {new Date(album.event_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-10" />
            </>
          )
        )}
      </PageContainer>

      {/* Lightbox Modal for All Photos */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={closeLightbox}
          >
            {/* Top Bar */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
              <p className="text-white/80 text-sm font-heading font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {lightboxIndex + 1} / {photos.length}
              </p>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); showPrev() }}
              className="absolute left-3 md:left-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Image & Caption */}
            <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <motion.img
                key={photos[lightboxIndex].id}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                src={photos[lightboxIndex].image_url}
                alt={photos[lightboxIndex].alt_text || photos[lightboxIndex].album?.title || 'Campus photo'}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                {photos[lightboxIndex].album?.title && (
                  <h4 className="text-white font-heading font-semibold text-base md:text-lg">
                    {photos[lightboxIndex].album?.title}
                  </h4>
                )}
                {photos[lightboxIndex].caption && (
                  <p className="text-white/75 text-sm mt-0.5">
                    {photos[lightboxIndex].caption}
                  </p>
                )}
                {photos[lightboxIndex].album?.slug && (
                  <Link
                    to={`/gallery/${photos[lightboxIndex].album.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white mt-2 font-heading font-medium underline underline-offset-4"
                  >
                    <span>View full album</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </figure>

            <button
              onClick={(e) => { e.stopPropagation(); showNext() }}
              className="absolute right-3 md:right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
