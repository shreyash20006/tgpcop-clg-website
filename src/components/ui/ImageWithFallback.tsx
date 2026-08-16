import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClass?: string
  aspectRatio?: string
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClass,
  aspectRatio,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center',
          aspectRatio || 'aspect-video',
          fallbackClass || className
        )}
      >
        <ImageIcon className="w-12 h-12 text-white/20" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  )
}
