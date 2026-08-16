import { supabase } from '@/lib/supabase/client'
import type { EntityRow } from '@/types/database'

export type SiteSettingRow = EntityRow<'site_settings'>
export type AnnouncementRow = EntityRow<'announcements'>

export async function getSiteSetting(key: string): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()
  return data?.value ?? null
}

export async function getSiteSettingsByCategory(category: string): Promise<SiteSettingRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', category)
  return (data ?? []) as SiteSettingRow[]
}

export async function updateSiteSetting(key: string, value: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAnnouncements(): Promise<AnnouncementRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true })
  return (data ?? []) as AnnouncementRow[]
}
