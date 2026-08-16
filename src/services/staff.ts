import { supabase } from '@/lib/supabase/client'
import type { EntityRow, EntityInsert, EntityUpdate } from '@/types/database'
import type { StaffRole } from '@/types/database'

export type StaffInvitationRow = EntityRow<'staff_invitations'>
export type StaffInvitationInsert = EntityInsert<'staff_invitations'>

export type StaffProfile = EntityRow<'profiles'>

export async function getStaffProfiles(): Promise<StaffProfile[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team'])
    .order('created_at', { ascending: false })
  return (data ?? []) as StaffProfile[]
}

export async function getInvitations(): Promise<StaffInvitationRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('staff_invitations')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as StaffInvitationRow[]
}

/**
 * Records a staff invitation. The invitee registers with this email and the
 * role is applied automatically by the signup trigger. Sending an actual
 * invitation email requires SMTP settings in Supabase Auth.
 */
export async function inviteStaffMember(
  invitation: Omit<StaffInvitationInsert, 'invited_by'>,
  invitedBy: string
): Promise<StaffInvitationRow> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('staff_invitations')
    .insert({ ...invitation, invited_by: invitedBy })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new Error('An invitation already exists for this email address.')
    }
    throw new Error('Could not create the invitation. Please try again.')
  }
  return data as StaffInvitationRow
}

export async function updateInvitation(id: string, updates: EntityUpdate<'staff_invitations'>) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase
    .from('staff_invitations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error('Could not update the invitation.')
  return data as StaffInvitationRow
}

export async function updateStaffProfileRole(userId: string, role: StaffRole) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) throw new Error('Could not change the staff role.')
}
