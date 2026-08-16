import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type GalleryRow = EntityRow<'gallery'>
export type GalleryInsert = EntityInsert<'gallery'>
export type GalleryUpdate = EntityUpdate<'gallery'>
export type GalleryCategory = 'campus' | 'events' | 'academic' | 'sports' | 'activities' | 'other'

export async function getGalleryImages(filters?: {
  category?: GalleryCategory
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as GalleryRow[], count: 0 }
  let query = supabase.from('gallery').select('*', { count: 'exact' }).eq('is_active', true)

  if (filters?.category) query = query.eq('category', filters.category)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 24)
  const to = from + (filters?.pageSize ?? 24) - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as GalleryRow[], count: count ?? 0 }
}

export async function createGalleryImage(item: GalleryInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('gallery').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateGalleryImage(id: string, updates: GalleryUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGalleryImage(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}
