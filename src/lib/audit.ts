import { supabase } from '@/lib/supabase/client'

interface AuditEntry {
  action: string
  entity?: string
  entity_id?: string
  details?: Record<string, unknown>
}

/** Append an audit log entry for important staff/admin actions. */
export async function logAction({ action, entity, entity_id, details }: AuditEntry) {
  if (!supabase) return
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      entity,
      entity_id,
      details: details ?? undefined,
    })
  } catch {
    // auditing must never break the main action
  }
}
