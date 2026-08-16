import { useEffect, useState, type FormEvent } from 'react'
import { ShieldCheck, ShieldAlert, Clock, Camera, Trash2, Upload, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import LoadingState from '@/components/ui/LoadingState'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'
import { getStudentByUserId, createStudentProfile, updateStudent } from '@/services/students'
import { supabase } from '@/lib/supabase/client'
import { compressImage } from '@/lib/imageCompress'

interface ProfileData {
  id?: string
  prn: string
  full_name: string
  phone: string
  course: 'bpharm' | 'dpharm'
  year: number
  semester: number
  verification_status?: string
  profile_image?: string | null
}

const emptyForm: ProfileData = {
  prn: '',
  full_name: '',
  phone: '',
  course: 'bpharm',
  year: 1,
  semester: 1,
}

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_PHOTO_BYTES = 10 * 1024 * 1024

export default function StudentProfile() {
  useSeo({ title: 'My Profile' })

  const { user } = useAuth()
  const [form, setForm] = useState<ProfileData>(emptyForm)
  const [existingId, setExistingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [photoMessage, setPhotoMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || !user) {
      setLoading(false)
      return
    }
    getStudentByUserId(user.id, user.email || undefined)
      .then((data) => {
        if (data) {
          setExistingId(data.id)
          setForm({
            prn: data.prn,
            full_name: data.full_name,
            phone: data.phone || '',
            course: data.course,
            year: data.year,
            semester: data.semester,
            verification_status: data.verification_status,
            profile_image: data.profile_image,
          })
        } else if (user.user_metadata?.full_name || user.email) {
          setForm((f) => ({
            ...f,
            full_name: (user.user_metadata?.full_name as string) || '',
          }))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saving) return
    setError(null)
    setSaved(false)

    if (!form.prn.trim() || !form.full_name.trim()) {
      setError('PRN and full name are required.')
      return
    }

    setSaving(true)
    try {
      if (existingId) {
        await updateStudent(existingId, {
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          course: form.course,
          year: Number(form.year),
          semester: Number(form.semester),
        })
      } else {
        const created = await createStudentProfile({
          user_id: user!.id,
          prn: form.prn.trim(),
          full_name: form.full_name.trim(),
          email: user!.email || '',
          phone: form.phone.trim() || undefined,
          course: form.course,
          year: Number(form.year),
          semester: Number(form.semester),
        })
        setExistingId(created.id)
      }
      setSaved(true)
    } catch {
      setError('Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  async function handlePhotoUpload(file: File) {
    if (!supabase || !user || photoBusy) return
    setPhotoMessage(null)
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoMessage('Please select a JPG, PNG or WEBP image.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoMessage('Image is too large. Please select an image below 10 MB.')
      return
    }
    setPhotoBusy(true)
    try {
      // Compress image client-side to keep storage lightweight and fast
      const compressed = await compressImage(file, 800, 0.85)
      const ext = compressed.type === 'image/png' ? 'png' : compressed.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('student-profiles')
        .upload(path, compressed, { contentType: compressed.type, upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('student-profiles').getPublicUrl(path)
      const url = `${urlData.publicUrl}?v=${Date.now()}`
      if (existingId) {
        await updateStudent(existingId, { profile_image: url })
      }
      await supabase.from('profiles').update({ avatar_url: url }).eq('user_id', user.id)
      setForm((f) => ({ ...f, profile_image: url }))
      setPhotoMessage('Profile photo updated.')
    } catch {
      setPhotoMessage('Could not upload the photo. Please try again.')
    } finally {
      setPhotoBusy(false)
    }
  }

  async function handleRemovePhoto() {
    if (!supabase || !user || photoBusy || !form.profile_image) return
    setPhotoBusy(true)
    setPhotoMessage(null)
    try {
      await supabase.storage.from('student-profiles').remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.webp`])
      if (existingId) {
        await updateStudent(existingId, { profile_image: null })
      }
      await supabase.from('profiles').update({ avatar_url: null }).eq('user_id', user.id)
      setForm((f) => ({ ...f, profile_image: null }))
      setPhotoMessage('Profile photo removed.')
    } catch {
      setPhotoMessage('Could not remove the photo.')
    } finally {
      setPhotoBusy(false)
    }
  }

  if (loading) {
    return <LoadingState count={1} type="text" />
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">My Profile</h1>
        <p className="text-muted text-sm">
          Keep your details up to date — verified profiles can be confirmed via public PRN lookup.
        </p>
      </div>

      {/* Verification status */}
      {existingId && form.verification_status && (
        <div
          className={`rounded-xl p-4 flex items-start gap-3 border ${
            form.verification_status === 'approved'
              ? 'bg-green-50 border-green-200'
              : form.verification_status === 'rejected'
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
          }`}
        >
          {form.verification_status === 'approved' ? (
            <ShieldCheck className="w-5 h-5 text-success shrink-0" />
          ) : form.verification_status === 'rejected' ? (
            <ShieldAlert className="w-5 h-5 text-error shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-warning shrink-0" />
          )}
          <div>
            <p className="text-sm font-heading font-semibold text-navy-900">
              Verification: {form.verification_status}
            </p>
            <p className="text-xs text-dark-text/70 mt-0.5">
              {form.verification_status === 'approved'
                ? 'Your identity has been verified by the college administration.'
                : form.verification_status === 'rejected'
                  ? 'Please contact the college office regarding your verification.'
                  : 'Your profile is awaiting verification by the college administration.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 space-y-5">
        {/* Profile photo */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-border">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-navy-900 to-primary-600 flex items-center justify-center shrink-0">
            {form.profile_image ? (
              <img src={form.profile_image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="font-heading font-bold text-white text-2xl">
                {(form.full_name || user?.email || 'S').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-heading font-medium text-navy-900">Profile Photo</p>
            <p className="text-muted text-xs mt-0.5 mb-2">JPG, PNG or WEBP · up to 5 MB</p>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-500 text-white text-xs font-heading font-medium rounded-md hover:bg-primary-600 transition-colors cursor-pointer">
                {photoBusy ? <Camera className="w-3.5 h-3.5 animate-pulse" /> : <Upload className="w-3.5 h-3.5" />}
                {form.profile_image ? 'Change Photo' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePhotoUpload(file)
                    e.target.value = ''
                  }}
                />
              </label>
              {form.profile_image && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={photoBusy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-border text-error text-xs font-heading font-medium rounded-md hover:bg-red-50 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>
            {photoMessage && <p className="text-muted text-xs mt-2">{photoMessage}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prn" className="flex items-center justify-between text-sm font-heading font-medium text-navy-900 mb-1.5">
              <span>PRN {existingId ? '' : <span className="text-error">*</span>}</span>
              {existingId && (
                <span className="inline-flex items-center gap-1 text-[11px] font-normal text-muted bg-gray-100 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              )}
            </label>
            <input
              id="prn"
              type="text"
              value={form.prn}
              disabled={!!existingId}
              readOnly={!!existingId}
              onChange={(e) => setForm({ ...form, prn: e.target.value })}
              className={`${inputClass} ${existingId ? 'bg-light-bg text-muted cursor-not-allowed border-dashed' : ''}`}
              placeholder="e.g. 2024B001"
              aria-readonly={!!existingId}
            />
            {existingId ? (
              <p className="text-muted text-xs mt-1">PRN is assigned by the college administration and cannot be changed.</p>
            ) : (
              <p className="text-muted text-xs mt-1">Enter your assigned PRN. This will become read-only once saved.</p>
            )}
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className={`${inputClass} bg-light-bg text-muted`}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="course" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Course
            </label>
            <select
              id="course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value as 'bpharm' | 'dpharm' })}
              className={inputClass}
            >
              <option value="bpharm">B.Pharm</option>
              <option value="dpharm">D.Pharm</option>
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Year
            </label>
            <select
              id="year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className={inputClass}
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="semester" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
              Semester
            </label>
            <select
              id="semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Sem {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
        )}
        {saved && (
          <p className="text-success text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            Profile saved successfully.
          </p>
        )}

        <Button type="submit" loading={saving}>
          {existingId ? 'Save Changes' : 'Create Profile'}
        </Button>
      </form>
    </div>
  )
}
