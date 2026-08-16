import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Images, ArrowLeft, X, ChevronLeft, ChevronRight, Download, Calendar, Layers } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import { useSeo } from '@/lib/seo'
import {
  getAlbumBySlug,
  getAlbumPhotos,
  getPublishedAlbums,
  ALBUM_CATEGORIES,
  type AlbumRow,
  type AlbumPhotoRow,
} from '@/services/galleryAlbums'

export default function AlbumDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  const [album, setAlbum] = useState<AlbumRow | null>(null)
  const [photos, setPhotos] = useState<AlbumPhotoRow[]>([])
  const [otherAlbums, setOtherAlbums] = useState<AlbumRow[]>([])
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
        if (a) {
          const loadedPhotos = await getAlbumPhotos(a.id)
          // If no rows in gallery_photos but cover_image_url exists, fallback to displaying cover
          if (loadedPhotos.length === 0 && a.cover_image_url) {
            setPhotos([
              {
                id: 'cover-' + a.id,
                album_id: a.id,
                image_url: a.cover_image_url,
                storage_path: '',
                caption: a.title,
                alt_text: a.title,
                sort_order: 0,
                uploaded_by: a.created_by,
                created_at: a.created_at,
              },
            ])
          } else {
            setPhotos(loadedPhotos)
          }

          // Fetch other albums for recommendations
          getPublishedAlbums(1, 4)
            .then(({ data }) => setOtherAlbums(data.filter((other) => other.id !== a.id).slice(0, 3)))
            .catch(() => {})
        }
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
      <div className="bg-navy-900 py-12 md:py-16">
        <PageContainer>
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white mb-3">
            <Breadcrumb items={[{ label: 'Gallery', path: '/gallery' }, { label: album.title }]} />
          </div>
          <Badge variant="primary" className="mb-3 !bg-white/10 !text-cyan-300 !border-white/20">
            {ALBUM_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category.replace(/_/g, ' ')}
          </Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">{album.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mt-3">
            {album.event_date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                {new Date(album.event_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </div>

          {album.description && (
            <p className="text-white/80 text-sm md:text-base max-w-3xl mt-4 leading-relaxed">
              {album.description}
            </p>
          )}
        </PageContainer>
      </div>

      <PageContainer className="py-10 md:py-14">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 mb-8 transition-colors"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {photos.map((photo, index) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : (index % 8) * 0.04 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-light-bg border border-border hover:shadow-md transition-all text-left"
                aria-label={photo.caption || `Open photo ${index + 1}`}
              >
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || photo.caption || album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <p className="text-white text-xs font-heading font-medium truncate">
                    {photo.caption || `${album.title} #${index + 1}`}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Other Albums Section */}
        {otherAlbums.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <h3 className="text-xl font-heading font-bold text-navy-900 mb-6">
              More Albums from TGPCOP
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherAlbums.map((other) => (
                <Link
                  key={other.id}
                  to={`/gallery/${other.slug}`}
                  className="group block bg-white border border-border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className="aspect-[16/10] bg-navy-900 overflow-hidden">
                    {other.cover_image_url ? (
                      <img
                        src={other.cover_image_url}
                        alt={other.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Images className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-semibold text-sm text-navy-900 group-hover:text-primary-500 transition-colors line-clamp-1">
                      {other.title}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {other.photo_count} {other.photo_count === 1 ? 'Photo' : 'Photos'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageContainer>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeLightbox}
        >
          {/* Header Bar */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <p className="text-white/80 text-sm font-heading font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {lightboxIndex + 1} / {photos.length}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={photos[lightboxIndex].image_url}
                target="_blank"
                rel="noreferrer"
                download
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Download photo"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); showPrev() }}
            className="absolute left-3 md:left-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <motion.img
              key={photos[lightboxIndex].id}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              src={photos[lightboxIndex].image_url}
              alt={photos[lightboxIndex].alt_text || album.title}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {photos[lightboxIndex].caption && (
              <figcaption className="text-white/80 text-sm text-center mt-3 font-heading">
                {photos[lightboxIndex].caption}
              </figcaption>
            )}
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); showNext() }}
            className="absolute right-3 md:right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
