import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type NoticeRow = EntityRow<'notices'>
export type NoticeInsert = EntityInsert<'notices'>
export type NoticeUpdate = EntityUpdate<'notices'>
export type NoticeStatus = 'draft' | 'published' | 'archived'
export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent'

export async function getNotices(filters?: {
  status?: NoticeStatus
  priority?: NoticePriority
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as NoticeRow[], count: 0 }
  let query = supabase.from('notices').select('*', { count: 'exact' })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.priority) query = query.eq('priority', filters.priority)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 12)
  const to = from + (filters?.pageSize ?? 12) - 1
  query = query.range(from, to).order('is_pinned', { ascending: false }).order('publish_date', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as NoticeRow[], count: count ?? 0 }
}

export async function getLatestNotices(limit: number = 5) {
  if (!supabase) return []
  const { data } = await supabase
    .from('notices')
    .select('*')
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('publish_date', { ascending: false })
    .limit(limit)
  return data ?? []
}

export async function createNotice(item: NoticeInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('notices').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateNotice(id: string, updates: NoticeUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('notices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNotice(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('notices').delete().eq('id', id)
  if (error) throw error
}
