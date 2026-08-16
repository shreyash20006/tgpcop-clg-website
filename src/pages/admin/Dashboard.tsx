import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShieldCheck, CalendarDays, BookOpen, Mail, ClipboardList, Images, Plus, Camera } from 'lucide-react'
import LoadingState from '@/components/ui/LoadingState'
import { useSeo } from '@/lib/seo'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { getGalleryStats } from '@/services/galleryAlbums'
import { ROLE_DASHBOARD_TITLES } from '@/lib/adminRoles'
import RoleBadge from '@/components/ui/RoleBadge'

interface AdminStats {
  totalStudents: number
  pendingVerification: number
  upcomingEvents: number
  eventRegistrations: number
  pendingResources: number
  newEnquiries: number
}

interface GalleryStats {
  total: number
  published: number
  pending: number
  photos: number
}

export default function AdminDashboard() {
  useSeo({ title: 'Dashboard' })
  const { role, user } = useAuth()
  const isAdmin = role === 'admin'
  const isMediaLike = role === 'media_team' || role === 'lab_assistant' || role === 'librarian' || role === 'teacher'

  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    pendingVerification: 0,
    upcomingEvents: 0,
    eventRegistrations: 0,
    pendingResources: 0,
    newEnquiries: 0,
  })
  const [gallery, setGallery] = useState<GalleryStats>({ total: 0, published: 0, pending: 0, photos: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const galleryPromise = getGalleryStats(!isAdmin)
        if (isAdmin) {
          const [students, pending, events, regs, resources, enquiries, g] = await Promise.all([
            supabase!.from('students').select('*', { count: 'exact', head: true }),
            supabase!.from('students').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
            supabase!.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
            supabase!.from('event_registrations').select('*', { count: 'exact', head: true }),
            supabase!.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase!.from('admission_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
            galleryPromise,
          ])
          setStats({
            totalStudents: students.count ?? 0,
            pendingVerification: pending.count ?? 0,
            upcomingEvents: events.count ?? 0,
            eventRegistrations: regs.count ?? 0,
            pendingResources: resources.count ?? 0,
            newEnquiries: enquiries.count ?? 0,
          })
          setGallery(g)
        } else {
          setGallery(await galleryPromise)
        }
      } catch {
        // keep zeros
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  const firstName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  if (loading) {
    return <LoadingState count={6} type="card" />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-heading font-bold text-2xl text-navy-900">
          {ROLE_DASHBOARD_TITLES[role ?? ''] ?? 'Dashboard'}
        </h1>
        <RoleBadge role={role} className="!bg-primary-50 !text-primary-500 !border-primary-500/30" />
      </div>
      <p className="text-muted text-sm mb-6">Welcome back, {firstName}.</p>

      {isMediaLike && (
        <div className="bg-navy-900 rounded-xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-base text-white">Capture an event?</h2>
              <p className="text-white/60 text-sm mt-0.5">
                Create an album, select photos from your phone, choose a cover and upload.
              </p>
            </div>
          </div>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-500 text-white text-sm font-heading font-semibold rounded-md hover:bg-accent-600 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Album
          </Link>
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {(
            [
              { label: 'Total Students', value: stats.totalStudents, icon: Users, to: '/admin/students', highlight: false },
              { label: 'Pending Verification', value: stats.pendingVerification, icon: ShieldCheck, to: '/admin/verification', highlight: true },
              { label: 'Upcoming Events', value: stats.upcomingEvents, icon: CalendarDays, to: '/admin/events', highlight: false },
              { label: 'Event Registrations', value: stats.eventRegistrations, icon: ClipboardList, to: '/admin/events', highlight: false },
              { label: 'Pending Resources', value: stats.pendingResources, icon: BookOpen, to: '/admin/resources', highlight: true },
              { label: 'New Enquiries', value: stats.newEnquiries, icon: Mail, to: '/admin/enquiries', highlight: true },
            ] as { label: string; value: number; icon: typeof Users; to: string; highlight: boolean }[]
          ).map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className={`rounded-xl p-6 border transition-all hover:shadow-md ${
                card.highlight && card.value > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    card.highlight && card.value > 0 ? 'bg-amber-100' : 'bg-primary-50'
                  }`}
                >
                  <card.icon
                    className={`w-5 h-5 ${card.highlight && card.value > 0 ? 'text-amber-600' : 'text-primary-500'}`}
                  />
                </div>
                {card.highlight && card.value > 0 && (
                  <span className="text-xs font-heading font-semibold text-amber-600">Action needed</span>
                )}
              </div>
              <p className="font-heading font-bold text-2xl text-navy-900">{card.value}</p>
              <p className="text-muted text-sm">{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Gallery statistics — all roles */}
      <h2 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
        <Images className="w-4 h-4 text-primary-500" />
        Gallery
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(
          [
            { label: isAdmin ? 'Total Albums' : 'My Albums', value: gallery.total },
            { label: 'Published Albums', value: gallery.published },
            { label: 'Pending Approval', value: gallery.pending },
            { label: 'Total Photos', value: gallery.photos },
          ] as const
        ).map((card) => (
          <div key={card.label} className="bg-white border border-border rounded-xl p-5">
            <p className="font-heading font-bold text-xl text-navy-900">{card.value}</p>
            <p className="text-muted text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {!supabase && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          Supabase is not configured. Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono">.env</code>{' '}
          file to enable live data.
        </div>
      )}
    </div>
  )
}
