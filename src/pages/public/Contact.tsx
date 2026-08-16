import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Mail, BadgeCheck, CheckCircle2 } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { useSeo } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { supabase } from '@/lib/supabase/client'

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: `Contact TGPCOP Nagpur — ${SITE.address}. Phone ${SITE.phone}.`,
  })

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submitting || submitted) return
    setSubmitError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const { error } = await supabase!.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject.trim() || null,
        message: form.message.trim(),
      })
      if (error) throw error
      setSubmitted(true)
    } catch {
      setSubmitError(
        supabase
          ? 'Could not send your message right now. Please try again or reach us by phone or email.'
          : 'The contact form requires backend configuration. Please reach us by phone or email instead.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow font-body ${
      hasError ? 'border-error' : 'border-border'
    }`

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you — admissions queries, campus visits or general questions."
        breadcrumbItems={[{ label: 'Contact' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-border rounded-xl p-6 hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">Address</h3>
            <p className="text-muted text-sm leading-relaxed">{SITE.address}</p>
          </a>
          <a
            href={SITE.phoneHref}
            className="bg-white border border-border rounded-xl p-6 hover:shadow-md hover:border-primary-300 transition-all"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">Phone</h3>
            <p className="text-muted text-sm">{SITE.phone}</p>
          </a>
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
              <BadgeCheck className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">DTE Code</h3>
            <p className="text-muted text-sm">{SITE.dteCode}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <SectionHeading label="Message" heading="Send us a message" />
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-base text-navy-900 mb-1">
                    Message sent
                  </h3>
                  <p className="text-sm text-dark-text/80">
                    Thank you for reaching out. We'll respond as soon as possible.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass(errors.name)}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass(errors.email)}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-phone" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Phone
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass()}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-subject" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="c-subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputClass()}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-message" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass(errors.message)}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
                </div>
                {submitError && (
                  <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    {submitError}
                  </p>
                )}
                <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Map + email */}
          <div className="space-y-5">
            <div className="rounded-xl overflow-hidden border border-border h-72">
              <iframe
                title="TGPCOP location map"
                src={SITE.mapUrl}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={SITE.emailHref}
              className="bg-white border border-border rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-navy-900">Email</h3>
                <p className="text-muted text-sm break-all">{SITE.email}</p>
              </div>
            </a>
          </div>
        </div>
      </PageContainer>
    </>
  )
}
