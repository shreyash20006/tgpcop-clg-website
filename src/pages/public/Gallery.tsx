import { useEffect, useState, useCallback } from 'react'
import { Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { getGalleryImages, type GalleryCategory } from '@/services/gallery'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/cn'

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string
}

const categories = [
  { label: 'All', value: '' },
  { label: 'Campus', value: 'campus' },
  { label: 'Events', value: 'events' },
  { label: 'Academic', value: 'academic' },
  { label: 'Sports', value: 'sports' },
  { label: 'Activities', value: 'activities' },
]

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description: 'Photo gallery of TGPCOP Nagpur — campus, events, academics, sports and activities.',
  })

  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [category, setCategory] = useState<'' | GalleryCategory>('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getGalleryImages({ category: category || undefined, pageSize: 48 })
      .then(({ data }) => setImages(data as GalleryImage[]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [category])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  )
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
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
        title="Gallery"
        description="Moments from campus life at TGPCOP."
        breadcrumbItems={[{ label: 'Gallery' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value as '' | GalleryCategory)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-heading font-medium transition-colors',
                category === c.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white border border-border text-dark-text hover:border-primary-300'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={() => setCategory(category)} />
        ) : images.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Gallery coming soon"
            description="Photographs of campus, events and activities will be published here."
          />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [&>*]:mb-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setLightboxIndex(index)}
                className="block w-full rounded-xl overflow-hidden bg-light-bg group"
                aria-label={image.title || 'Open image'}
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Gallery image'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </PageContainer>

      {/* Lightbox */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              showPrev()
            }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh]">
            <img
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].title || 'Gallery image'}
              className="max-h-[80vh] max-w-full object-contain rounded-lg mx-auto"
            />
            {images[lightboxIndex].title && (
              <figcaption className="text-white/80 text-sm text-center mt-3">
                {images[lightboxIndex].title}
              </figcaption>
            )}
          </figure>
          <button
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
