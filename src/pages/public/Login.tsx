import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'

export default function Login() {
  useSeo({ title: 'Login', description: 'Sign in to the TGPCOP student portal.' })

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }

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
    const { error: err } = await signIn(email.trim(), password)
    if (err) {
      setError(
        err.includes('Invalid login')
          ? 'Incorrect email or password. Please try again.'
          : 'Sign in failed. Please check your credentials and try again.'
      )
      setSubmitting(false)
      return
    }
    navigate(location.state?.from || '/student', { replace: true })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-light-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-navy-900 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy-900">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to the TGPCOP student portal</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-body"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-body"
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
            </div>

            {error && (
              <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" loading={submitting} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-primary-500 hover:text-primary-600 font-medium">
              Forgot password?
            </Link>
            <Link to="/register" className="text-muted hover:text-primary-500">
              Create account
            </Link>
          </div>
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
