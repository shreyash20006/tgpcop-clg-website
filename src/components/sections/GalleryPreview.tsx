import { useEffect, useState } from 'react'
import { Images } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { getGalleryImages } from '@/services/gallery'
import { supabase } from '@/lib/supabase/client'

interface GalleryItem {
  id: string
  title: string | null
  image_url: string
  category: string
}

const placeholderTiles = [
  'from-navy-900 to-primary-600',
  'from-primary-600 to-cyan-500',
  'from-navy-800 to-navy-600',
  'from-cyan-500 to-primary-400',
]

export default function GalleryPreview() {
  const [images, setImages] = useState<GalleryItem[]>([])

  useEffect(() => {
    if (!supabase) return
    getGalleryImages({ pageSize: 4 })
      .then(({ data }) => setImages(data as GalleryItem[]))
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
        {images.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {placeholderTiles.map((gradient, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
              >
                <Images className="w-8 h-8 text-white/20" aria-hidden="true" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="aspect-square rounded-xl overflow-hidden bg-light-bg">
                <img
                  src={image.image_url}
                  alt={image.title || 'Campus photo'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        {images.length === 0 && (
          <p className="text-center text-muted text-sm mt-4">
            Campus photographs will appear here once published.
          </p>
        )}
      </PageContainer>
    </section>
  )
}
