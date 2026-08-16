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
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
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

export async function getPublishedAlbums(page = 1, pageSize = 12) {
  if (!supabase) return { data: [] as AlbumRow[], count: 0 }
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, count } = await supabase
    .from('gallery_albums')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('event_date', { ascending: false, nullsFirst: false })
    .range(from, to)
  return { data: (data ?? []) as AlbumRow[], count: count ?? 0 }
}

export async function getAlbumBySlug(slug: string): Promise<AlbumRow | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return (data as AlbumRow) ?? null
}

export async function getAlbumPhotos(albumId: string): Promise<AlbumPhotoRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })
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
  const { data } = await query
  let albums = (data ?? []) as AlbumRow[]
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    albums = albums.filter((a) => a.title.toLowerCase().includes(q))
  }
  return albums
}

export async function createAlbum(album: AlbumInsert): Promise<AlbumRow> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('gallery_albums')
    .insert(album)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('An album with a similar title already exists.')
    throw new Error('Could not create the album.')
  }
  return data as AlbumRow
}

export async function updateAlbum(id: string, updates: AlbumUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('gallery_albums')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error('Could not save the album.')
  return data as AlbumRow
}

export async function deleteAlbum(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  // remove storage objects first (best effort), rows cascade
  const photos = await getAlbumPhotosAdmin(id)
  const paths = photos.map((p) => p.storage_path).filter(Boolean)
  if (paths.length > 0) {
    await supabase.storage.from('gallery').remove(paths).catch(() => undefined)
  }
  const { error } = await supabase.from('gallery_albums').delete().eq('id', id)
  if (error) throw new Error('Could not delete the album.')
}

export async function getAlbumPhotosAdmin(albumId: string): Promise<AlbumPhotoRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: true })
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
  onProgress: (index: number, status: PhotoUploadItem['status']) => void,
  coverIndex: number
): Promise<{ firstUrl: string | null }> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data: { user } } = await supabase.auth.getUser()
  const existing = await getAlbumPhotosAdmin(album.id)
  let sortOrder = existing.length
  let firstUrl: string | null = album.cover_image_url

  const folder = album.slug
  for (let i = 0; i < files.length; i++) {
    onProgress(i, 'uploading')
    try {
      const compressed = await compressImage(files[i])
      if (compressed.size > MAX_IMAGE_BYTES) {
        throw new Error('too_large')
      }
      const ext = compressed.type === 'image/png' ? 'png' : 'jpg'
      const path = `${folder}/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, compressed, { contentType: compressed.type || 'image/jpeg', upsert: false })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(path)
      const { error: insertError } = await supabase.from('gallery_photos').insert({
        album_id: album.id,
        image_url: urlData.publicUrl,
        storage_path: path,
        sort_order: sortOrder++,
        uploaded_by: user?.id ?? null,
        alt_text: album.title,
      })
      if (insertError) throw insertError

      if (!firstUrl || i === coverIndex) firstUrl = urlData.publicUrl
      onProgress(i, 'done')
    } catch {
      onProgress(i, 'error')
    }
  }

  await updateAlbum(album.id, {
    photo_count: sortOrder,
    ...(firstUrl ? { cover_image_url: firstUrl } : {}),
  })

  return { firstUrl }
}

export async function deleteAlbumPhoto(photo: AlbumPhotoRow, album: AlbumRow) {
  if (!supabase) throw new Error('Supabase not configured')
  await supabase.storage.from('gallery').remove([photo.storage_path]).catch(() => undefined)
  const { error } = await supabase.from('gallery_photos').delete().eq('id', photo.id)
  if (error) throw new Error('Could not delete the photo.')
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
