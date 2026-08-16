import { useEffect, useState, type FormEvent } from 'react'
import { UserCog, UserPlus, Mail, Ban, CheckCircle2, Info } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { logAction } from '@/lib/audit'
import {
  getStaffProfiles,
  getInvitations,
  inviteStaffMember,
  updateInvitation,
  type StaffProfile,
  type StaffInvitationRow,
} from '@/services/staff'
import type { StaffRole } from '@/types/database'
import RoleBadge from '@/components/ui/RoleBadge'

const ROLE_OPTIONS: { value: StaffRole; label: string }[] = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'lab_assistant', label: 'Lab Assistant' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'media_team', label: 'Media Team' },
  { value: 'admin', label: 'Admin' },
]

const emptyForm = {
  full_name: '',
  email: '',
  role: 'teacher' as StaffRole,
  department: '',
  designation: '',
  phone: '',
}

export default function AdminStaff() {
  useSeo({ title: 'Staff Management' })
  const { user } = useAuth()

  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [invitations, setInvitations] = useState<StaffInvitationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const [profiles, invites] = await Promise.all([getStaffProfiles(), getInvitations()])
      setStaff(profiles)
      setInvitations(invites)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    load()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setFormError(null)
    if (!form.full_name.trim() || !form.email.trim()) {
      setFormError('Full name and email are required.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setFormError('Please enter a valid email address.')
      return
    }

    setSaving(true)
    try {
      await inviteStaffMember(
        {
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          department: form.department.trim() || null,
          designation: form.designation.trim() || null,
          phone: form.phone.trim() || null,
        },
        user!.id
      )
      await logAction({
        action: 'staff.invite',
        entity: 'staff_invitations',
        details: { email: form.email.trim().toLowerCase(), role: form.role },
      })
      setInvitedEmail(form.email.trim().toLowerCase())
      setForm(emptyForm)
      load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create the invitation.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRevoke(invite: StaffInvitationRow) {
    if (actionId) return
    if (!window.confirm(`Revoke the invitation for ${invite.email}?`)) return
    setActionId(invite.id)
    try {
      await updateInvitation(invite.id, { status: 'revoked' })
      await logAction({ action: 'staff.revoke_invite', entity: 'staff_invitations', entity_id: invite.id })
      load()
    } catch {
      load()
    } finally {
      setActionId(null)
    }
  }

  const q = debouncedSearch.toLowerCase()
  const filteredStaff = staff.filter(
    (s) =>
      !q ||
      (s.full_name ?? '').toLowerCase().includes(q) ||
      (s.email ?? '').toLowerCase().includes(q) ||
      (s.department ?? '').toLowerCase().includes(q)
  )
  const filteredInvites = invitations.filter(
    (i) => !q || i.full_name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q)
  )

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Staff</h1>
          <p className="text-muted text-sm">Create staff accounts and assign roles with secure permissions.</p>
        </div>
        <Button onClick={() => { setFormError(null); setInvitedEmail(null); setModalOpen(true) }}>
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      <div className="bg-primary-50 border border-primary-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
        <p className="text-sm text-dark-text/80 leading-relaxed">
          Invitations are recorded in the database with <strong>status = pending</strong>. When the staff
          member registers with the invited email, their role is applied automatically. To send
          automatic invitation emails, configure SMTP in <strong>Supabase → Authentication → Email
          Templates/SMTP</strong> — no credentials are ever stored in this app.
        </p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search staff or invitations..." className="max-w-md mb-6" />

      {loading ? (
        <LoadingState count={4} type="table" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-3">Active Staff ({filteredStaff.length})</h2>
            {filteredStaff.length === 0 ? (
              <EmptyState
                icon={UserCog}
                title="No staff accounts yet"
                description="Invited staff will appear here after they register."
              />
            ) : (
              <div className="bg-white border border-border rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-light-bg text-left">
                      <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Name</th>
                      <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Role</th>
                      <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Department</th>
                      <th className="px-5 py-3 font-heading font-semibold text-xs text-muted uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-light-bg/50">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-navy-900">{member.full_name ?? '—'}</p>
                          <p className="text-muted text-xs">{member.email ?? ''}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <RoleBadge
                            role={member.role}
                            className="!bg-primary-50 !text-primary-600 !border-primary-500/20"
                          />
                        </td>
                        <td className="px-5 py-3.5 text-muted">{member.department ?? '—'}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={member.status === 'active' ? 'success' : 'default'}>{member.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="font-heading font-semibold text-base text-navy-900 mb-3">
              Pending Invitations ({filteredInvites.filter((i) => i.status === 'pending').length})
            </h2>
            {filteredInvites.length === 0 ? (
              <p className="text-muted text-sm bg-light-bg border border-border rounded-lg px-4 py-3">
                No invitations yet.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredInvites.map((invite) => (
                  <div key={invite.id} className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-primary-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-navy-900 text-sm truncate">{invite.full_name}</p>
                        <p className="text-muted text-xs truncate">{invite.email}</p>
                      </div>
                    </div>
                    <RoleBadge
                      role={invite.role}
                      className="!bg-primary-50 !text-primary-600 !border-primary-500/20 self-start sm:self-center"
                    />
                    <Badge
                      variant={
                        invite.status === 'activated' ? 'success' : invite.status === 'revoked' ? 'error' : 'warning'
                      }
                    >
                      {invite.status.replace('_', ' ')}
                    </Badge>
                    {invite.status === 'pending' && (
                      <button
                        onClick={() => handleRevoke(invite)}
                        disabled={actionId === invite.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-heading font-medium text-error hover:bg-red-50 rounded-md disabled:opacity-40 shrink-0"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member" size="lg">
        {invitedEmail ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-sm text-navy-900">Invitation created</h3>
                <p className="text-sm text-dark-text/80 mt-1">
                  <span className="font-medium">{invitedEmail}</span> has been recorded as a pending staff
                  invitation with the selected role.
                </p>
              </div>
            </div>
            <div className="bg-light-bg border border-border rounded-xl p-4 text-sm text-dark-text/80 leading-relaxed">
              <p className="font-heading font-semibold text-navy-900 mb-1">Next step for the staff member:</p>
              Register at <span className="font-medium">/register</span> using exactly this email — the role
              is applied automatically on signup. Automatic invitation emails require SMTP configuration in
              Supabase Auth.
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Close</Button>
              <Button onClick={() => { setInvitedEmail(null); setForm(emptyForm) }}>
                <UserPlus className="w-4 h-4" />
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-name" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Full Name <span className="text-error">*</span>
                </label>
                <input id="s-name" type="text" value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="s-email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Email <span className="text-error">*</span>
                </label>
                <input id="s-email" type="email" value={form.email} placeholder="teacher@gmail.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                <p className="text-muted text-xs mt-1">Any valid email — a college domain is not required.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-role" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Role <span className="text-error">*</span>
                </label>
                <select id="s-role" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })} className={inputClass}>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="s-dept" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Department
                </label>
                <input id="s-dept" type="text" value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-desig" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Designation
                </label>
                <input id="s-desig" type="text" value={form.designation} placeholder="e.g. Assistant Professor"
                  onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="s-phone" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Phone (optional)
                </label>
                <input id="s-phone" type="tel" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
            </div>

            {formError && (
              <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{formError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={saving}>
                <Mail className="w-4 h-4" />
                Create Invitation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
