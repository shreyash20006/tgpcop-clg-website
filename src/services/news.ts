import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type NewsRow = EntityRow<'news'>
export type NewsInsert = EntityInsert<'news'>
export type NewsUpdate = EntityUpdate<'news'>
export type ContentStatus = 'draft' | 'published' | 'archived'

export async function getNews(filters?: {
  status?: ContentStatus
  category?: string
  is_featured?: boolean
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as NewsRow[], count: 0 }
  let query = supabase.from('news').select('*', { count: 'exact' })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 12)
  const to = from + (filters?.pageSize ?? 12) - 1
  query = query.range(from, to).order('published_at', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as NewsRow[], count: count ?? 0 }
}

export async function getNewsBySlug(slug: string) {
  if (!supabase) return null
  const { data } = await supabase.from('news').select('*').eq('slug', slug).single()
  return (data as NewsRow) ?? null
}

export async function getLatestNews(limit: number = 3) {
  if (!supabase) return []
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function createNews(item: NewsInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('news').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateNews(id: string, updates: NewsUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNews(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}
