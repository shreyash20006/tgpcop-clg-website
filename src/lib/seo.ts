import { useEffect } from 'react'

interface SeoOptions {
  title: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
}

export function useSeo({ title, description, canonical, ogImage, ogType = 'website' }: SeoOptions) {
  useEffect(() => {
    document.title = `${title} | TGPCOP Nagpur`

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, key)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }

    setMeta('property', 'og:title', `${title} | TGPCOP Nagpur`)
    setMeta('name', 'twitter:title', `${title} | TGPCOP Nagpur`)
    setMeta('property', 'og:type', ogType)

    if (ogImage) {
      setMeta('property', 'og:image', ogImage)
      setMeta('name', 'twitter:image', ogImage)
    }

    if (canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
  }, [title, description, canonical, ogImage, ogType])
}
