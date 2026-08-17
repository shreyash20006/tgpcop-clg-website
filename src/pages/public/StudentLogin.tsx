import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, ShieldCheck, BookOpen, CalendarDays } from 'lucide-react'
import Button from '@/components/ui/Button'
import BrandLogo from '@/components/layout/BrandLogo'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'

export default function StudentLogin() {
  useSeo({ title: 'Student Login', description: 'Sign in to the TGPCOP student portal.' })

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const reduceMotion = useReducedMotion()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    const res = await signIn(email.trim(), password)
    if (res.error) {
      setError(
        res.error.includes('Invalid login')
          ? 'Incorrect email or password. Please try again.'
          : 'Sign in failed. Please check your credentials and try again.'
      )
      setSubmitting(false)
      return
    }

    const staffRoles = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team', 'club_manager']
    const isStaff = res.role && staffRoles.includes(res.role)
    const destination = location.state?.from || (isStaff ? '/admin' : '/student')
    navigate(destination, { replace: true })
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" aria-hidden="true" />

        <motion.div variants={item} initial="hidden" animate="show" className="relative">
          <BrandLogo variant="light" className="h-14" />
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="relative max-w-md">
          <motion.h1 variants={item} className="font-heading font-bold text-4xl text-white leading-tight mb-4">
            Your college experience,
            <br />
            in one portal.
          </motion.h1>
          <motion.p variants={item} className="text-white/65 text-base leading-relaxed mb-8">
            Notices, events, study resources and certificates — everything you need during your time
            at TGPCOP.
          </motion.p>
          <motion.ul variants={container} className="space-y-4">
            {[
              { icon: CalendarDays, text: 'Register for college events' },
              { icon: BookOpen, text: 'Access notes and study material' },
              { icon: ShieldCheck, text: 'Verified student profile' },
            ].map((row) => (
              <motion.li key={row.text} variants={item} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <row.icon className="w-4 h-4 text-cyan-400" />
                </span>
                {row.text}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.p variants={item} initial="hidden" animate="show" className="relative text-white/40 text-xs">
          Tulsiramji Gaikwad-Patil College of Pharmacy, Nagpur
        </motion.p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-8 bg-light-bg">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <motion.div variants={item} className="lg:hidden mb-8 flex justify-center">
            <div className="inline-flex bg-white rounded-xl px-3 py-2 shadow-sm">
              <BrandLogo variant="dark" className="h-12" />
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <motion.h2 variants={item} className="font-heading font-bold text-2xl text-navy-900">
              Student Portal
            </motion.h2>
            <motion.p variants={item} className="text-muted text-sm mt-1 mb-6">
              Access your academic resources, events and student services.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <motion.div variants={item}>
                <label htmlFor="sl-email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Email
                </label>
                <input
                  id="sl-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
                  placeholder="you@example.com"
                />
              </motion.div>

              <motion.div variants={item}>
                <label htmlFor="sl-password" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="sl-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.p
                  variants={item}
                  className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={item}>
                <Button type="submit" loading={submitting} className="w-full">
                  Login
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>

            <motion.div variants={item}>
              <SocialAuthButtons onError={(err) => setError(err)} />
            </motion.div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 font-medium">
                Forgot password?
              </Link>
              <Link to="/register" className="text-muted hover:text-primary-500">
                Create account
              </Link>
            </div>
          </motion.div>

          <motion.p variants={item} className="text-center text-muted text-sm mt-6">
            <Link to="/" className="hover:text-primary-500">← Back to website</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
