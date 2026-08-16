import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type EventRow = EntityRow<'events'>
export type EventInsert = EntityInsert<'events'>
export type EventUpdate = EntityUpdate<'events'>
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export async function getEvents(filters?: {
  status?: EventStatus
  category?: string
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as EventRow[], count: 0 }
  let query = supabase.from('events').select('*', { count: 'exact' })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.category) query = query.eq('category', filters.category)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 12)
  const to = from + (filters?.pageSize ?? 12) - 1
  query = query.range(from, to).order('date', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as EventRow[], count: count ?? 0 }
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()
  return (data as EventRow) ?? null
}

export async function getUpcomingEvents(limit: number = 3): Promise<EventRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(limit)
  return (data ?? []) as EventRow[]
}

export async function registerForEvent(registration: EntityInsert<'event_registrations'>) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('event_registrations')
    .insert(registration)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEventRegistrations(eventId: string) {
  if (!supabase) return [] as EntityRow<'event_registrations'>[]
  const { data } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
  return (data ?? []) as EntityRow<'event_registrations'>[]
}

export async function createEvent(event: EventInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from('events').insert(event).select().single()
  if (error) throw error
  return data
}

export async function updateEvent(id: string, updates: EventUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('events')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEvent(id: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
