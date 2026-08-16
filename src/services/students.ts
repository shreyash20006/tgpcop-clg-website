import { supabase } from '@/lib/supabase/client'
import type { EntityInsert, EntityRow, EntityUpdate } from '@/types/database'

export type StudentRow = EntityRow<'students'>
export type StudentInsert = EntityInsert<'students'>
export type StudentUpdate = EntityUpdate<'students'>
export type CourseFilter = 'bpharm' | 'dpharm'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'

export async function getStudents(filters?: {
  course?: CourseFilter
  year?: number
  verification_status?: VerificationStatus
  search?: string
  page?: number
  pageSize?: number
}) {
  if (!supabase) return { data: [] as StudentRow[], count: 0 }
  let query = supabase.from('students').select('*', { count: 'exact' })

  if (filters?.course) query = query.eq('course', filters.course)
  if (filters?.year) query = query.eq('year', filters.year)
  if (filters?.verification_status) query = query.eq('verification_status', filters.verification_status)
  if (filters?.search) query = query.ilike('full_name', `%${filters.search}%`)

  const from = ((filters?.page ?? 1) - 1) * (filters?.pageSize ?? 10)
  const to = from + (filters?.pageSize ?? 10) - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, count } = await query
  return { data: (data ?? []) as StudentRow[], count: count ?? 0 }
}

export async function getStudentByUserId(userId: string): Promise<StudentRow | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single()
  return (data as StudentRow) ?? null
}

export async function getStudentByPRN(prn: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('student_verifications')
    .select('*')
    .eq('prn', prn)
    .single()
  if (error) return null
  return data as {
    prn: string
    display_name: string
    course: 'bpharm' | 'dpharm'
    year: number
    verification_status: string
  } | null
}

export async function updateStudent(id: string, updates: StudentUpdate) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('students')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function verifyStudent(id: string, status: 'approved' | 'rejected') {
  return updateStudent(id, { verification_status: status })
}

export async function createStudentProfile(student: StudentInsert) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('students')
    .insert(student)
    .select()
    .single()
  if (error) throw error
  return data as StudentRow
}
