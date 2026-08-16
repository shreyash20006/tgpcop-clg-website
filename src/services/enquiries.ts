import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow } from '@/types/database'

export type EnquiryRow = EntityRow<'admission_enquiries'>
export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed'

export async function getEnquiries(filters?: {
  status?: EnquiryStatus
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as EnquiryRow[], count: 0 }
  let query = supabase.from('admission_enquiries').select('*', { count: 'exact' })

  if (filters?.status) query = query.eq('status', filters.status)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 10)
  const to = from + (filters?.pageSize ?? 10) - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as EnquiryRow[], count: count ?? 0 }
}

export async function submitEnquiry(enquiry: EntityInsert<'admission_enquiries'>) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('admission_enquiries')
    .insert(enquiry)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('admission_enquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
