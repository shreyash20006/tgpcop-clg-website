import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow } from '@/types/database'

export type ResourceRow = EntityRow<'resources'>
export type ResourceInsert = EntityInsert<'resources'>
export type ResourceCategory =
  | 'notes'
  | 'study_material'
  | 'question_papers'
  | 'syllabus'
  | 'previous_year'
  | 'useful_links'
  | 'other'

export async function getResources(filters?: {
  course?: 'bpharm' | 'dpharm' | 'both'
  category?: ResourceCategory
  subject?: string
  year?: number
  semester?: number
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as ResourceRow[], count: 0 }
  let query = supabase.from('resources').select('*', { count: 'exact' }).eq('status', 'approved')

  if (filters?.course && filters.course !== 'both') query = query.eq('course', filters.course)
  if (filters?.course === 'both') query = query.in('course', ['bpharm', 'dpharm'])
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.subject) query = query.ilike('subject', `%${filters.subject}%`)
  if (filters?.year) query = query.eq('year', filters.year)
  if (filters?.semester) query = query.eq('semester', filters.semester)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 12)
  const to = from + (filters?.pageSize ?? 12) - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as ResourceRow[], count: count ?? 0 }
}

export async function uploadResource(resource: ResourceInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('resources').insert(resource).select().single()
  if (error) throw error
  return data
}

export async function getPendingResources() {
  if (!supabase) return []
  const { data } = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function approveResource(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('resources')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function rejectResource(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('resources')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteResource(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw error
}
