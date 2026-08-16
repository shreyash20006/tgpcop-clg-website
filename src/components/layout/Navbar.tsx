import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollPosition } from '@/hooks/useScrollPosition'
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
      { label: 'Faculty', path: '/faculty' },
      { label: 'Departments', path: '/academics#departments' },
    ],
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
  const location = useLocation()

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-white transition-all duration-300',
        isScrolled ? 'shadow-md py-2' : 'shadow-sm py-3'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <BrandLogo variant="dark" />
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-navy-900 text-sm leading-tight">TGPCOP</div>
              <div className="text-muted text-xs leading-tight">Nagpur</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
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
                  {item.children && openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-border py-1 z-50"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2.5 text-sm text-dark-text hover:bg-light-bg hover:text-primary-500 transition-colors font-body"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center gap-3">
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
                <Link
                  to="/student"
                  className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Student Portal
                </Link>
                <Link
                  to="/admissions"
                  className="block w-full text-center px-4 py-3 text-sm font-heading font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
