import { supabase } from '@/lib/supabase/client'
import type { EntityRow, EntityInsert, EntityUpdate } from '@/types/database'

export type AlbumRow = EntityRow<'gallery_albums'>
export type AlbumInsert = EntityInsert<'gallery_albums'>
export type AlbumUpdate = EntityUpdate<'gallery_albums'>
export type AlbumPhotoRow = EntityRow<'gallery_photos'>
export type AlbumStatus = 'draft' | 'pending_approval' | 'published' | 'archived'
export type AlbumCategory =
  | 'events' | 'academic' | 'sports' | 'cultural' | 'campus'
  | 'independence_day' | 'republic_day' | 'workshops' | 'seminars'
  | 'student_activities' | 'lab' | 'library' | 'other'

export const ALBUM_CATEGORIES: { value: AlbumCategory; label: string }[] = [
  { value: 'events', label: 'Events' },
  { value: 'academic', label: 'Academic' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'campus', label: 'Campus' },
  { value: 'independence_day', label: 'Independence Day' },
  { value: 'republic_day', label: 'Republic Day' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'seminars', label: 'Seminars' },
  { value: 'student_activities', label: 'Student Activities' },
  { value: 'lab', label: 'Laboratory' },
  { value: 'library', label: 'Library' },
  { value: 'other', label: 'Other' },
]

export function slugify(text: string) {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
  return clean || 'album'
}

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB

/** Downscale/compress in the browser so phone photos stay reasonable. */
export async function compressImage(file: File, maxDimension = 1920, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size <= MAX_IMAGE_BYTES) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob ?? file), 'image/jpeg', quality)
    )
  } catch {
    return file
  }
}

// ---------------- Public queries ----------------

export interface PublishedPhotoWithAlbum extends AlbumPhotoRow {
  album?: {
    id: string
    title: string
    slug: string
    category: string
    event_date: string | null
  } | null
}

export interface AlbumWithPhotos extends AlbumRow {
  previewPhotos?: AlbumPhotoRow[]
}

export async function getPublishedAlbums(page = 1, pageSize = 12, category?: string) {
  if (!supabase) return { data: [] as AlbumWithPhotos[], count: 0 }
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = supabase
    .from('gallery_albums')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  query = query
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  const { data, count, error } = await query
  if (error) {
    console.error('Error fetching published albums:', error)
    return { data: [] as AlbumWithPhotos[], count: 0 }
  }

  const albums = (data ?? []) as AlbumWithPhotos[]

  // Fetch up to 4 preview photos for each album for thumbnail stacks
  if (albums.length > 0) {
    const albumIds = albums.map((a) => a.id)
    const { data: photosData } = await supabase
      .from('gallery_photos')
      .select('*')
      .in('album_id', albumIds)
      .order('sort_order', { ascending: true })

    if (photosData) {
      const photosByAlbum = new Map<string, AlbumPhotoRow[]>()
      for (const p of photosData as AlbumPhotoRow[]) {
        const list = photosByAlbum.get(p.album_id) ?? []
        if (list.length < 4) list.push(p)
        photosByAlbum.set(p.album_id, list)
      }
      for (const album of albums) {
        album.previewPhotos = photosByAlbum.get(album.id) ?? []
      }
    }
  }

  return { data: albums, count: count ?? 0 }
}

export async function getAllPublishedPhotos(options?: {
  category?: string
  page?: number
  pageSize?: number
}): Promise<{ data: PublishedPhotoWithAlbum[]; count: number }> {
  if (!supabase) return { data: [], count: 0 }

  const page = options?.page ?? 1
  const pageSize = options?.pageSize ?? 24
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    // 1. Fetch published albums
    let albumsQuery = supabase
      .from('gallery_albums')
      .select('id, title, slug, category, event_date')
      .eq('status', 'published')

    if (options?.category && options.category !== 'all') {
      albumsQuery = albumsQuery.eq('category', options.category)
    }

    const { data: albums, error: albumsError } = await albumsQuery
    if (albumsError || !albums || albums.length === 0) {
      return { data: [], count: 0 }
    }

    const albumMap = new Map(albums.map((a) => [a.id, a]))
    const albumIds = albums.map((a) => a.id)

    // 2. Fetch photos for these published albums
    const { data: photos, count, error: photosError } = await supabase
      .from('gallery_photos')
      .select('*', { count: 'exact' })
      .in('album_id', albumIds)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (photosError || !photos) {
      console.error('Error fetching published photos:', photosError)
      return { data: [], count: 0 }
    }

    const result: PublishedPhotoWithAlbum[] = (photos as AlbumPhotoRow[]).map((photo) => ({
      ...photo,
      album: albumMap.get(photo.album_id) ?? null,
    }))

    return { data: result, count: count ?? result.length }
  } catch (err) {
    console.error('Failed to get all published photos:', err)
    return { data: [], count: 0 }
  }
}

export async function getAlbumBySlug(slug: string): Promise<AlbumRow | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) {
    console.error('Error fetching album by slug:', error)
    return null
  }
  return (data as AlbumRow) ?? null
}

export async function getAlbumPhotos(albumId: string): Promise<AlbumPhotoRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('Error fetching album photos:', error)
    return []
  }
  return (data ?? []) as AlbumPhotoRow[]
}

// ---------------- Admin queries ----------------

export async function getAlbumsAdmin(filters?: {
  status?: AlbumStatus
  mineOnly?: boolean
  search?: string
}) {
  if (!supabase) return [] as AlbumRow[]
  let query = supabase.from('gallery_albums').select('*')
  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.mineOnly) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) query = query.eq('created_by', user.id)
  }
  query = query.order('updated_at', { ascending: false })
  const { data, error } = await query
  if (error) {
    console.error('Error fetching admin albums:', error)
    return []
  }
  let albums = (data ?? []) as AlbumRow[]
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    albums = albums.filter((a) => a.title.toLowerCase().includes(q))
  }
  return albums
}

export async function createAlbum(album: AlbumInsert): Promise<AlbumRow> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('gallery_albums')
    .insert(album)
    .select()
    .single()
  if (error) {
    console.error('Error creating album:', error)
    if (error.code === '23505') throw new Error('An album with a similar title/slug already exists.')
    if (error.message) throw new Error(error.message)
    throw new Error('Could not create the album.')
  }
  return data as AlbumRow
}

export async function updateAlbum(id: string, updates: AlbumUpdate) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('gallery_albums')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) {
    console.error('Error updating album:', error)
    if (error.message) throw new Error(error.message)
    throw new Error('Could not save the album.')
  }
  return data as AlbumRow
}

export async function deleteAlbum(id: string) {
  if (!supabase) throw new Error('Supabase is not configured.')
  // remove storage objects first (best effort), rows cascade
  const photos = await getAlbumPhotosAdmin(id)
  const paths = photos.map((p) => p.storage_path).filter(Boolean)
  if (paths.length > 0) {
    await supabase.storage.from('gallery').remove(paths).catch(() => undefined)
  }
  const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
  if (error) {
    console.error('Error deleting album:', error)
    if (error.message) throw new Error(error.message)
    throw new Error('Could not delete the album.')
  }
}

export async function getAlbumPhotosAdmin(albumId: string): Promise<AlbumPhotoRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('Error fetching admin photos:', error)
    return []
  }
  return (data ?? []) as AlbumPhotoRow[]
}

export interface PhotoUploadItem {
  file: File
  status: 'waiting' | 'uploading' | 'done' | 'error'
  previewUrl: string
}

/** Upload photos sequentially, reporting progress per index. */
export async function uploadAlbumPhotos(
  album: AlbumRow,
  files: File[],
  onProgress: (index: number, status: PhotoUploadItem['status'], errorMsg?: string) => void,
  coverIndex: number
): Promise<{ firstUrl: string | null; uploadedCount: number; errors: string[] }> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data: { user } } = await supabase.auth.getUser()
  const existing = await getAlbumPhotosAdmin(album.id)
  let sortOrder = existing.length
  let firstUrl: string | null = album.cover_image_url
  let uploadedCount = 0
  const errors: string[] = []

  const folder = album.slug || album.id
  for (let i = 0; i < files.length; i++) {
    onProgress(i, 'uploading')
    try {
      const compressed = await compressImage(files[i])
      if (compressed.size > MAX_IMAGE_BYTES) {
        throw new Error(`File ${files[i].name} exceeds 10MB limit.`)
      }
      const ext = compressed.type === 'image/png' ? 'png' : 'jpg'
      const path = `${folder}/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, compressed, { contentType: compressed.type || 'image/jpeg', upsert: false })
      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Storage upload error: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
      const { error: insertError } = await supabase.from('gallery_photos').insert({
        album_id: album.id,
        image_url: urlData.publicUrl,
        storage_path: path,
        sort_order: sortOrder++,
        uploaded_by: user?.id ?? null,
        alt_text: album.title,
      })
      if (insertError) {
        console.error('Photo insert error:', insertError)
        throw new Error(`Database photo record error: ${insertError.message}`)
      }

      if (!firstUrl || i === coverIndex) firstUrl = urlData.publicUrl
      uploadedCount++
      onProgress(i, 'done')
    } catch (err) {
      console.error(`Photo upload error at index ${i}:`, err)
      const msg = err instanceof Error ? err.message : 'Upload failed'
      errors.push(msg)
      onProgress(i, 'error', msg)
    }
  }

  try {
    await updateAlbum(album.id, {
      photo_count: sortOrder,
      ...(firstUrl ? { cover_image_url: firstUrl } : {}),
    })
  } catch (err) {
    console.error('Failed to update album cover/count:', err)
  }

  if (errors.length > 0 && uploadedCount === 0) {
    throw new Error(`Failed to upload photos: ${errors[0]}`)
  }

  return { firstUrl, uploadedCount, errors }
}

export async function deleteAlbumPhoto(photo: AlbumPhotoRow, album: AlbumRow) {
  if (!supabase) throw new Error('Supabase is not configured.')
  await supabase.storage.from('gallery').remove([photo.storage_path]).catch(() => undefined)
  const { error } = await supabase.from('gallery_photos').delete().eq('id', photo.id)
  if (error) {
    console.error('Error deleting photo:', error)
    if (error.message) throw new Error(error.message)
    throw new Error('Could not delete the photo.')
  }
  const remaining = Math.max(0, album.photo_count - 1)
  const wasCover = album.cover_image_url === photo.image_url
  let patch: AlbumUpdate = { photo_count: remaining }
  if (wasCover) {
    const others = (await getAlbumPhotosAdmin(album.id)).filter((p) => p.id !== photo.id)
    patch = { ...patch, cover_image_url: others[0]?.image_url ?? null }
  }
  await updateAlbum(album.id, patch)
}

export async function setAlbumCover(album: AlbumRow, photo: AlbumPhotoRow) {
  return updateAlbum(album.id, { cover_image_url: photo.image_url })
}

// ---------------- Dashboard stats ----------------

export async function getGalleryStats(mineOnly = false) {
  if (!supabase) return { total: 0, published: 0, pending: 0, photos: 0 }
  let query = supabase.from('gallery_albums').select('id, status, photo_count, created_by')
  const albums = ((await query) as { data: EntityRow<'gallery_albums'>[] | null }).data ?? []
  let list = albums as EntityRow<'gallery_albums'>[]
  if (mineOnly) {
    const { data: { user } } = await supabase.auth.getUser()
    list = list.filter((a) => a.created_by === user?.id)
  }
  return {
    total: list.length,
    published: list.filter((a) => a.status === 'published').length,
    pending: list.filter((a) => a.status === 'pending_approval').length,
    photos: list.reduce((sum, a) => sum + (a.photo_count ?? 0), 0),
  }
}
