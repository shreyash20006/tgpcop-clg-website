import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  UserCircle,
  CalendarDays,
  BookOpen,
  Bell,
  Award,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
  { to: '/student/events', label: 'Events', icon: CalendarDays },
  { to: '/student/resources', label: 'Resources', icon: BookOpen },
  { to: '/student/notices', label: 'Notices', icon: Bell },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
]

export default function StudentLayout() {
  const { user, role, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const staffRoles = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team', 'club_manager']
  const isStaff = Boolean(role && staffRoles.includes(role))

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="font-heading font-bold text-white text-sm">Student Portal</div>
          <div className="text-white/50 text-xs">TGPCOP</div>
        </div>
      </div>

      {isStaff && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-br from-primary-900/60 to-primary-950 border border-primary-500/30">
          <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-heading font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Staff Account ({role})</span>
          </div>
          <p className="text-white/60 text-[11px] mt-1 mb-2.5 leading-snug">
            You have staff privileges to upload gallery photos, post notices & manage events.
          </p>
          <Link
            to="/admin"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-heading font-semibold transition-colors shadow-sm"
          >
            Open Admin Portal →
          </Link>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1" aria-label="Student navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-heading font-medium transition-colors',
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="px-4 py-3 mb-2">
          <p className="text-white/80 text-sm font-medium truncate">
            {user?.user_metadata?.full_name || user?.email}
          </p>
          <p className="text-white/40 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-heading font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-navy-900 z-40">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-navy-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          <span className="font-heading font-bold text-white text-sm">Student Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white/70 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-900">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="lg:pl-64">
        {isStaff && (
          <div className="bg-primary-50 border-b border-primary-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-primary-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>You are signed in with staff privileges ({role}).</span>
            </div>
            <Link
              to="/admin"
              className="font-heading font-semibold text-primary-700 hover:text-primary-800 underline underline-offset-2 flex items-center gap-1"
            >
              Open Admin Portal & Manage Gallery →
            </Link>
          </div>
        )}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
