import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type ClubRow = EntityRow<'clubs'>
export type ClubInsert = EntityInsert<'clubs'>
export type ClubUpdate = EntityUpdate<'clubs'>

export async function getClubs(): Promise<ClubRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('clubs')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })
  return (data ?? []) as ClubRow[]
}

export async function getClubBySlug(slug: string): Promise<ClubRow | null> {
  if (!supabase) return null
  const { data } = await supabase.from('clubs').select('*').eq('slug', slug).single()
  return (data as ClubRow) ?? null
}

export async function createClub(item: ClubInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('clubs').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateClub(id: string, updates: ClubUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('clubs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteClub(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('clubs').delete().eq('id', id)
  if (error) throw error
}
