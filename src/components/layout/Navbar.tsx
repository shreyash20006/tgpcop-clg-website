import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'
import BrandLogo from './BrandLogo'

const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'About',
    children: [
      { label: 'About TGPCOP', path: '/about' },
      { label: 'Vision & Mission', path: '/about#vision' },
      { label: 'Principal\'s Message', path: '/about#principal' },
    ],
  },
  {
    label: 'Academics',
    children: [
      { label: 'Programs', path: '/academics' },
      { label: 'Faculty Directory', path: '/faculty' },
      { label: 'Departments', path: '/academics#departments' },
    ],
  },
  {
    label: 'Faculty',
    path: '/faculty',
  },
  {
    label: 'Admissions',
    path: '/admissions',
  },
  {
    label: 'Campus',
    path: '/campus',
  },
  {
    label: 'Students',
    children: [
      { label: 'Student Portal', path: '/student' },
      { label: 'Verify Student', path: '/student-verification' },
      { label: 'Resources', path: '/resources' },
      { label: 'Clubs', path: '/clubs' },
    ],
  },
  {
    label: 'Research',
    path: '/research',
  },
  {
    label: 'Events',
    path: '/events',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { isScrolled } = useScrollPosition()
  const { user, role } = useAuth()
  const location = useLocation()

  const staffRoles = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team', 'club_manager']
  const isStaff = Boolean(user && role && staffRoles.includes(role))

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-white transition-all duration-300',
        isScrolled ? 'shadow-md py-2' : 'shadow-sm py-3'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo — official lockup includes the college name */}
          <Link to="/" className="flex items-center shrink-0" aria-label="TGPCOP — Home">
            <BrandLogo variant="dark" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const children = item.children ? [...item.children] : []
              if (item.label === 'Students' && isStaff && !children.some(c => c.path === '/admin')) {
                children.push({ label: '⚡ Admin Portal', path: '/admin' })
                children.push({ label: '🖼️ Manage Gallery', path: '/admin/gallery' })
              }

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => children.length > 0 && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={cn(
                        'px-3 py-2 text-sm font-heading font-medium rounded-md transition-colors',
                        location.pathname === item.path
                          ? 'text-primary-500'
                          : 'text-dark-text hover:text-primary-500 hover:bg-light-bg'
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        'px-3 py-2 text-sm font-heading font-medium rounded-md transition-colors flex items-center gap-1',
                        location.pathname.startsWith('/about') && item.label === 'About' ? 'text-primary-500' : 'text-dark-text hover:text-primary-500 hover:bg-light-bg'
                      )}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 transition-transform',
                        openDropdown === item.label && 'rotate-180'
                      )} />
                    </button>
                  )}

                  <AnimatePresence>
                    {children.length > 0 && openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-border py-1 z-50"
                      >
                        {children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              'block px-4 py-2.5 text-sm transition-colors font-body',
                              child.path.startsWith('/admin')
                                ? 'text-primary-600 font-semibold bg-primary-50/50 hover:bg-primary-50'
                                : 'text-dark-text hover:bg-light-bg hover:text-primary-500'
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center gap-3">
            {isStaff ? (
              <>
                <Link
                  to="/admin"
                  className="px-3.5 py-2 text-sm font-heading font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  Admin Portal
                </Link>
                <Link
                  to="/student"
                  className="px-3.5 py-2 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
                >
                  Student Portal
                </Link>
              </>
            ) : user ? (
              <>
                <Link
                  to="/student"
                  className="px-4 py-2 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
                >
                  Student Portal
                </Link>
                <Link
                  to="/admissions"
                  className="px-4 py-2 text-sm font-heading font-semibold text-white bg-accent-500 rounded-md hover:bg-accent-600 transition-colors"
                >
                  Apply Now
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
                >
                  Portal Login
                </Link>
                <Link
                  to="/admissions"
                  className="px-4 py-2 text-sm font-heading font-semibold text-white bg-accent-500 rounded-md hover:bg-accent-600 transition-colors"
                >
                  Apply Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="xl:hidden p-2 rounded-md hover:bg-light-bg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6 text-navy-900" /> : <Menu className="w-6 h-6 text-navy-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl z-50 xl:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="font-heading font-bold text-navy-900">Menu</div>
                <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-light-bg rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {isStaff && (
                  <div className="mb-3 p-2.5 rounded-lg bg-primary-50 border border-primary-200">
                    <p className="text-xs font-heading font-semibold text-primary-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Staff Account ({role})
                    </p>
                    <Link
                      to="/admin"
                      className="mt-2 block w-full text-center py-2 bg-primary-600 text-white rounded-md text-xs font-heading font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      Open Admin Portal →
                    </Link>
                  </div>
                )}

                {navLinks.map((item) => (
                  <div key={item.label}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={cn(
                          'block px-4 py-3 rounded-lg text-sm font-heading font-medium transition-colors',
                          location.pathname === item.path
                            ? 'bg-primary-50 text-primary-500'
                            : 'text-dark-text hover:bg-light-bg'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-heading font-medium text-dark-text hover:bg-light-bg transition-colors"
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        >
                          {item.label}
                          <ChevronDown className={cn(
                            'w-4 h-4 transition-transform',
                            openDropdown === item.label && 'rotate-180'
                          )} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 space-y-1 pb-2">
                                {item.children?.map((child) => (
                                  <Link
                                    key={child.path}
                                    to={child.path}
                                    className="block px-4 py-2.5 rounded-lg text-sm font-body text-muted hover:bg-light-bg hover:text-primary-500 transition-colors"
                                    onClick={() => { setMobileOpen(false); setOpenDropdown(null) }}
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-3">
                {isStaff ? (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 text-sm font-heading font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShieldCheck className="w-4 h-4 text-cyan-300" />
                      Admin Portal
                    </Link>
                    <Link
                      to="/student"
                      className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Student Portal
                    </Link>
                  </>
                ) : user ? (
                  <>
                    <Link
                      to="/student"
                      className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Student Dashboard
                    </Link>
                    <Link
                      to="/admissions"
                      className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Portal Login
                    </Link>
                    <Link
                      to="/admissions"
                      className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
