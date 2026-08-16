import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export const CAMPUS_VIDEO_URL =
  'https://res.cloudinary.com/dsqxboxoc/video/upload/v1786876976/add_animation_vedio_for_websit_exxxh9.mp4'

interface CampusHeroVideoProps {
  className?: string
}

/**
 * Full-bleed background video for the homepage hero.
 * - Muted + autoplay + loop + playsInline for reliable browser autoplay.
 * - Falls back to the navy brand gradient when the video fails to load,
 *   is loading, or the user prefers reduced motion — the hero is never blank.
 * - Purely decorative: hidden from assistive technology, not clickable,
 *   and carries no essential information.
 */
export default function CampusHeroVideo({ className }: CampusHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [usable, setUsable] = useState(true)

  // React sets the `muted` attribute, but some browsers only honour the DOM
  // property — set both so autoplay never gets blocked.
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.defaultMuted = true
    }
  }, [])

  if (!usable || reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-500',
          className
        )}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn('absolute inset-0 w-full h-full object-cover object-center', className)}
      src={CAMPUS_VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      onError={() => setUsable(false)}
    />
  )
}
