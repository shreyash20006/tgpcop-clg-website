import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Images, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import { getAlbumBySlug, getAlbumPhotos, ALBUM_CATEGORIES, type AlbumRow, type AlbumPhotoRow } from '@/services/galleryAlbums'

export default function AlbumDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [album, setAlbum] = useState<AlbumRow | null>(null)
  const [photos, setPhotos] = useState<AlbumPhotoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useSeo({
    title: album ? album.title : 'Gallery',
    description:
      album?.description ??
      `Photo album — ${album?.title ?? 'gallery'} at Tulsiramji Gaikwad-Patil College of Pharmacy.`,
  })

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    setLoading(true)
    getAlbumBySlug(slug)
      .then(async (a) => {
        setAlbum(a)
        if (a) setPhotos(await getAlbumPhotos(a.id))
      })
      .catch(() => setAlbum(null))
      .finally(() => setLoading(false))
  }, [slug])

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

  if (loading) {
    return (
      <PageContainer className="py-16">
        <LoadingState count={1} type="text" />
      </PageContainer>
    )
  }

  if (!album) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={Images}
          title="Album not found"
          description="This album may have been removed or the link is incorrect."
          actionLabel="Browse gallery"
          onAction={() => navigate('/gallery')}
        />
      </PageContainer>
    )
  }

  return (
    <>
      <div className="bg-navy-900 py-14 md:py-20">
        <PageContainer>
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white mb-2">
            <Breadcrumb items={[{ label: 'Gallery', path: '/gallery' }, { label: album.title }]} />
          </div>
          <Badge variant="primary" className="mb-3 !bg-white/10 !text-cyan-300 !border-white/20">
            {ALBUM_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category.replace(/_/g, ' ')}
          </Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">{album.title}</h1>
          {album.event_date && (
            <p className="text-white/60 text-sm mt-2">
              {new Date(album.event_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' · '}
              {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
            </p>
          )}
          {album.description && (
            <p className="text-white/70 text-sm md:text-base max-w-2xl mt-3 leading-relaxed">
              {album.description}
            </p>
          )}
        </PageContainer>
      </div>

      <PageContainer className="py-12 md:py-16">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to gallery
        </Link>

        {photos.length === 0 ? (
          <EmptyState
            icon={Images}
            title="No photos in this album yet"
            description="Photos will appear here once published."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : (index % 8) * 0.05 }}
                onClick={() => setLightboxIndex(index)}
                className="aspect-square rounded-xl overflow-hidden bg-light-bg group"
                aria-label={photo.caption || `Open photo ${index + 1}`}
              >
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || photo.caption || album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        )}
      </PageContainer>

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <p className="absolute top-5 left-5 text-white/80 text-sm font-heading">
            {lightboxIndex + 1} / {photos.length}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); showPrev() }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh]">
            <motion.img
              key={photos[lightboxIndex].id}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              src={photos[lightboxIndex].image_url}
              alt={photos[lightboxIndex].alt_text || album.title}
              className="max-h-[80vh] max-w-full object-contain rounded-lg mx-auto"
            />
            {photos[lightboxIndex].caption && (
              <figcaption className="text-white/80 text-sm text-center mt-3">
                {photos[lightboxIndex].caption}
              </figcaption>
            )}
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); showNext() }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
