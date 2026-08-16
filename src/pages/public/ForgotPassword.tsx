import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, MailCheck } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useSeo } from '@/lib/seo'

export default function ForgotPassword() {
  useSeo({ title: 'Reset Password', description: 'Reset your TGPCOP student portal password.' })

  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting) return
    setError(null)
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    const { error: err } = await resetPassword(email.trim())
    if (err) {
      setError('Could not send reset email. Please try again.')
      setSubmitting(false)
      return
    }
    setSent(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-light-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-navy-900 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-navy-900">Reset password</h1>
          <p className="text-muted text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7 text-success" />
              </div>
              <h2 className="font-heading font-semibold text-lg text-navy-900 mb-2">Check your inbox</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                If an account exists for <span className="font-medium text-dark-text">{email}</span>,
                a password reset link has been sent.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-primary-500 text-white font-heading font-medium text-sm rounded-md hover:bg-primary-600 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
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
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}
              <Button type="submit" loading={submitting} className="w-full">
                Send Reset Link
              </Button>
              <p className="text-center text-sm">
                <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
