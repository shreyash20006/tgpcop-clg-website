import { useState, type FormEvent } from 'react'
import { CheckCircle2, FileText, Phone, Mail, Info } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { useSeo } from '@/lib/seo'
import { submitEnquiry } from '@/services/enquiries'
import { supabase } from '@/lib/supabase/client'
import { SITE } from '@/lib/site'

const steps = [
  { step: 1, title: 'Check Eligibility', description: 'Review the eligibility criteria for your chosen program.' },
  { step: 2, title: 'CAP / Direct Admission', description: 'Apply through CAP counselling or contact the college for direct admission (Institute Level).' },
  { step: 3, title: 'Document Verification', description: 'Submit and verify the required documents at the admissions office.' },
  { step: 4, title: 'Fee Payment & Enrollment', description: 'Complete fee formalities and enroll in the program.' },
]

const documents = [
  '10th (SSC) Marksheet & Certificate',
  '12th (HSC) Marksheet & Certificate',
  'DTE CAP registration details (if applicable)',
  'Transfer Certificate',
  'Migration Certificate',
  'Caste Certificate (if applicable)',
  'Aadhaar Card',
  'Passport-size photographs',
]

export default function Admissions() {
  useSeo({
    title: 'Admissions',
    description:
      'Admissions 2026–27 at TGPCOP Nagpur — B.Pharm (100 seats) and D.Pharm (60 seats). Eligibility, process, documents and enquiry.',
  })

  const [form, setForm] = useState({ name: '', phone: '', email: '', course: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    else if (!/^[+\d][\d\s-]{7,14}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email'
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
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        course: form.course || undefined,
        message: form.message.trim() || undefined,
      })
      setSubmitted(true)
    } catch {
      setSubmitError(
        supabase
          ? 'Could not submit your enquiry right now. Please try again or contact the office directly.'
          : 'Online enquiry submission requires backend configuration. Please contact the admissions office directly.'
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
        title="Admissions 2026–27"
        description="Admissions open for B.Pharm and D.Pharm — Direct Admission & CAP Counselling."
        breadcrumbItems={[{ label: 'Admissions' }]}
      />

      <PageContainer className="py-12 md:py-16">
        {/* Overview + seats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {[
            { name: 'B.Pharm', seats: '100 Seats', note: 'Bachelor of Pharmacy' },
            { name: 'D.Pharm', seats: '60 Seats', note: 'Diploma in Pharmacy' },
          ].map((program) => (
            <div key={program.name} className="bg-white border border-border rounded-xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-xl text-navy-900">{program.name}</h3>
                <p className="text-muted text-sm">{program.note}</p>
              </div>
              <span className="px-4 py-2 bg-primary-50 text-primary-500 rounded-full font-heading font-semibold text-sm">
                {program.seats}
              </span>
            </div>
          ))}
        </div>

        {/* Process */}
        <SectionHeading label="Process" heading="How to apply" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {steps.map((s) => (
            <div key={s.step} className="bg-white border border-border rounded-xl p-6">
              <span className="w-9 h-9 rounded-full bg-primary-500 text-white font-heading font-bold text-sm flex items-center justify-center mb-4">
                {s.step}
              </span>
              <h3 className="font-heading font-semibold text-sm text-navy-900 mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Eligibility & documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
          <div>
            <SectionHeading label="Requirements" heading="Eligibility" />
            <div className="bg-light-bg border border-border rounded-xl p-5 flex gap-3">
              <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
              <p className="text-sm text-dark-text/80 leading-relaxed">
                Eligibility for B.Pharm and D.Pharm is as per the norms prescribed by the State CET
                Cell / DTE Maharashtra, DBATU and PCI. Candidates should refer to the official DTE
                information brochure for the current admission year, or contact the admissions
                office for guidance.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium">
                <Phone className="w-4 h-4" /> {SITE.phone}
              </a>
              <a href={SITE.emailHref} className="flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium break-all">
                <Mail className="w-4 h-4" /> {SITE.email}
              </a>
            </div>
          </div>
          <div>
            <SectionHeading label="Checklist" heading="Required documents" />
            <ul className="bg-white border border-border rounded-xl divide-y divide-border">
              {documents.map((doc) => (
                <li key={doc} className="flex items-center gap-3 px-5 py-3 text-sm text-dark-text/90">
                  <FileText className="w-4 h-4 text-muted shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enquiry form */}
        <div className="max-w-2xl">
          <SectionHeading
            label="Enquiry"
            heading="Have a question about admissions?"
            description="Fill in the form and the admissions office will get back to you."
          />
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-base text-navy-900 mb-1">
                  Enquiry submitted
                </h3>
                <p className="text-sm text-dark-text/80">
                  Thank you, {form.name.split(' ')[0]}. Our admissions team will contact you soon.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-6 space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass(errors.name)}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Phone <span className="text-error">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass(errors.phone)}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass(errors.email)}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                    Course of Interest
                  </label>
                  <select
                    id="course"
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className={inputClass()}
                  >
                    <option value="">Select a course</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="D.Pharm">D.Pharm</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-heading font-medium text-navy-900 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputClass()}
                  placeholder="Your question (optional)"
                />
              </div>
              {submitError && (
                <p className="text-error text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {submitError}
                </p>
              )}
              <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                Submit Enquiry
              </Button>
            </form>
          )}
        </div>

        {/* Fee info placeholder */}
        <div className="mt-14">
          <SectionHeading label="Fees" heading="Fee information" />
          <div className="bg-light-bg border border-border rounded-xl p-6 text-sm text-muted leading-relaxed">
            Fee structure for the current academic year is as per the Shikshan Shulka Samiti (Fee
            Regulating Authority) and DTE Maharashtra norms. Please contact the admissions office at{' '}
            <a href={SITE.phoneHref} className="text-primary-500 font-medium hover:underline">
              {SITE.phone}
            </a>{' '}
            for the detailed fee schedule.
          </div>
        </div>
      </PageContainer>
    </>
  )
}
