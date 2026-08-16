import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CalendarDays,
  Newspaper,
  Bell,
  BookOpen,
  GraduationCap,
  Images,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

interface AdminNavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const navGroups: { title: string; items: AdminNavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'People',
    items: [
      { to: '/admin/students', label: 'Students', icon: Users },
      { to: '/admin/verification', label: 'Verification', icon: ShieldCheck },
      { to: '/admin/faculty', label: 'Faculty', icon: GraduationCap },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/events', label: 'Events', icon: CalendarDays },
      { to: '/admin/news', label: 'News', icon: Newspaper },
      { to: '/admin/notices', label: 'Notices', icon: Bell },
      { to: '/admin/resources', label: 'Resources', icon: BookOpen },
      { to: '/admin/gallery', label: 'Gallery', icon: Images },
    ],
  },
  {
    title: 'Administration',
    items: [
      { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
      { to: '/admin/settings', label: 'Site Settings', icon: Settings },
    ],
  },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="font-heading font-bold text-white text-sm">TGPCOP Admin</div>
        <div className="text-white/50 text-xs">Content Management</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-4 mb-1.5 text-[11px] font-heading font-semibold uppercase tracking-wider text-white/30">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end ?? false}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-heading font-medium transition-colors',
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
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-heading font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Website
        </a>
        <div className="px-4 py-2">
          <p className="text-white/80 text-sm font-medium truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-heading font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
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
        <span className="font-heading font-bold text-white text-sm">TGPCOP Admin</span>
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
              className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white z-10"
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
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
