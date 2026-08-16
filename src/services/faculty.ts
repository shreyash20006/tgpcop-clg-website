import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type FacultyRow = EntityRow<'faculty'>
export type FacultyInsert = EntityInsert<'faculty'>
export type FacultyUpdate = EntityUpdate<'faculty'>

export async function getFaculty(filters?: {
  department?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as FacultyRow[], count: 0 }
  let query = supabase.from('faculty').select('*', { count: 'exact' }).eq('is_active', true)

  if (filters?.department) query = query.eq('department', filters.department)
  if (filters?.search) query = query.ilike('name', `%${filters.search}%`)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 12)
  const to = from + (filters?.pageSize ?? 12) - 1
  query = query.range(from, to).order('sort_order', { ascending: true })

  const { data, count } = await query
  return { data: (data ?? []) as FacultyRow[], count: count ?? 0 }
}

export async function createFaculty(item: FacultyInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('faculty').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateFaculty(id: string, updates: FacultyUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('faculty')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFaculty(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('faculty').delete().eq('id', id)
  if (error) throw error
}
