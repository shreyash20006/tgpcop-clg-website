import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, MailCheck } from 'lucide-react'
import BrandLogo from '@/components/layout/BrandLogo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'

export default function Register() {
  useSeo({ title: 'Register', description: 'Create a TGPCOP student portal account.' })

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const passwordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)

    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    const { error: err } = await signUp(form.email.trim(), form.password, form.fullName.trim())
    if (err) {
      setError(
        err.includes('already')
          ? 'An account with this email already exists. Try signing in instead.'
          : 'Registration failed. Please check your details and try again.'
      )
      setSubmitting(false)
      return
    }
    setAwaitingConfirmation(true)
    setSubmitting(false)
  }

  if (awaitingConfirmation) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-light-bg">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <MailCheck className="w-8 h-8 text-success" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy-900 mb-2">Verify your email</h1>
          <p className="text-muted text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            We've sent a verification link to <span className="font-medium text-dark-text">{form.email}</span>.
            Click the link in the email to activate your account, then complete your student profile.
          </p>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Continue to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-light-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex bg-white rounded-xl px-3 py-2 shadow-sm mx-auto mb-4">
            <BrandLogo variant="dark" className="h-12" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy-900">Create your account</h1>
          <p className="text-muted text-sm mt-1">Register for the TGPCOP student portal</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body ${
                  errors.fullName ? 'border-error' : 'border-border'
                }`}
                placeholder="Your full name"
              />
              {errors.fullName && <p className="text-error text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body ${
                    errors.password ? 'border-error' : 'border-border'
                  }`}
                  placeholder="At least 8 characters"
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
              {form.password && (
                <div className="flex gap-1 mt-2" aria-label="Password strength">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength(form.password) >= level
                          ? ['bg-error', 'bg-warning', 'bg-cyan-500', 'bg-success'][
                              passwordStrength(form.password) - 1
                            ]
                          : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              )}
              {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body ${
                  errors.confirm ? 'border-error' : 'border-border'
                }`}
                placeholder="Re-enter password"
              />
              {errors.confirm && <p className="text-error text-xs mt-1">{errors.confirm}</p>}
            </div>

            {error && (
              <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" loading={submitting} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-muted text-sm mt-6">
          <Link to="/" className="hover:text-primary-500">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
