import { useEffect, useState } from 'react'
import { Award, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { supabase } from '@/lib/supabase/client'
import { updateProgram, type ProgramRow } from '@/services/programs'
import { logAction } from '@/lib/audit'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export default function AdminPrograms() {
  useSeo({ title: 'Manage Programs' })

  const [programs, setPrograms] = useState<ProgramRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      // Admins should see all programs, including unpublished ones
      if (supabase) {
        const { data } = await supabase.from('programs').select('*').order('created_at', { ascending: true })
        setPrograms((data ?? []) as ProgramRow[])
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function updateLocal(id: string, patch: Partial<ProgramRow>) {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  async function handleImage(program: ProgramRow, file: File) {
    if (!supabase) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' })
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMessage({ type: 'error', text: 'Image is too large. Please select an image below 10 MB.' })
      return
    }
    setSavingId(program.id)
    setMessage(null)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `programs/${program.type}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('campus-images')
        .upload(path, file, { contentType: file.type, upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('campus-images').getPublicUrl(path)
      await updateProgram(program.id, { image_url: urlData.publicUrl })
      updateLocal(program.id, { image_url: urlData.publicUrl })
      setMessage({ type: 'success', text: `${program.name} image updated.` })
    } catch {
      setMessage({ type: 'error', text: 'Image upload failed. Please try again.' })
    } finally {
      setSavingId(null)
    }
  }

  async function handleSave(program: ProgramRow) {
    setSavingId(program.id)
    setMessage(null)
    try {
      await updateProgram(program.id, {
        short_name: program.short_name || null,
        duration: program.duration || null,
        seats: program.seats ?? null,
        eligibility: program.eligibility || null,
        description: program.description || null,
        image_url: program.image_url || null,
        is_active: program.is_active,
      })
      await logAction({ action: 'program.update', entity: 'programs', entity_id: program.id })
      setMessage({ type: 'success', text: `${program.name} saved.` })
    } catch {
      setMessage({ type: 'error', text: 'Could not save the program. Check your permissions.' })
    } finally {
      setSavingId(null)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body'

  if (loading) return <LoadingState count={2} type="card" />
  if (error) return <ErrorState onRetry={load} />

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Programs</h1>
      <p className="text-muted text-sm mb-6">
        Edit program details shown on the homepage and academics pages. Images appear on the program cards.
      </p>

      {message && (
        <p
          className={`text-sm rounded-lg px-4 py-2.5 mb-6 border ${
            message.type === 'success'
              ? 'text-success bg-green-50 border-green-200'
              : 'text-error bg-red-50 border-red-200'
          }`}
        >
          {message.text}
        </p>
      )}

      {programs.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No programs configured"
          description="Program records are created during database seeding. Contact the developer if this persists."
        />
      ) : (
        <div className="space-y-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-lg text-navy-900">{program.name}</h2>
                  <p className="text-muted text-sm">{program.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={program.is_active ? 'success' : 'default'}>
                    {program.is_active ? 'Published' : 'Hidden'}
                  </Badge>
                  <button
                    onClick={() => updateLocal(program.id, { is_active: !program.is_active })}
                    className="text-xs font-heading font-medium text-primary-500 hover:text-primary-600"
                  >
                    {program.is_active ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image */}
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-navy-900 to-primary-600 mb-3">
                    {program.image_url ? (
                      <img src={program.image_url} alt={program.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-10 h-10 text-white/25" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <span className="sr-only">Upload {program.name} image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-muted border border-border rounded-lg px-3 py-2 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-500 file:text-xs file:font-heading file:cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImage(program, file)
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>

                {/* Fields */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">Short Name</label>
                    <input
                      type="text" value={program.short_name ?? ''} placeholder="B.Pharm"
                      onChange={(e) => updateLocal(program.id, { short_name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">Duration</label>
                    <input
                      type="text" value={program.duration ?? ''} placeholder="4 Years"
                      onChange={(e) => updateLocal(program.id, { duration: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">Seats / Intake</label>
                    <input
                      type="number" value={program.seats ?? ''} placeholder="100"
                      onChange={(e) => updateLocal(program.id, { seats: e.target.value ? Number(e.target.value) : null })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">Eligibility</label>
                    <input
                      type="text" value={program.eligibility ?? ''} placeholder="As per DTE / DBATU norms"
                      onChange={(e) => updateLocal(program.id, { eligibility: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-heading font-medium text-navy-900 mb-1.5">Description</label>
                    <textarea
                      rows={3} value={program.description ?? ''}
                      onChange={(e) => updateLocal(program.id, { description: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button onClick={() => handleSave(program)} loading={savingId === program.id}>
                      <Save className="w-4 h-4" />
                      Save {program.short_name || program.name}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
