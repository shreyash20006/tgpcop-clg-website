import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type ProgramRow = EntityRow<'programs'>
export type ProgramInsert = EntityInsert<'programs'>
export type ProgramUpdate = EntityUpdate<'programs'>

export async function getPrograms(): Promise<ProgramRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  return (data ?? []) as ProgramRow[]
}

export async function createProgram(item: ProgramInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('programs').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateProgram(id: string, updates: ProgramUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('programs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProgram(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) throw error
}
