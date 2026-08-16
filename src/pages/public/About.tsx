import { motion, useReducedMotion } from 'framer-motion'
import { Target, Eye, ListChecks, ShieldCheck, Landmark, Building2 } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'
import { SITE } from '@/lib/site'

const objectives = [
  'Impart quality education in pharmaceutical sciences.',
  'Develop skilled, ethical and industry-ready pharmacy professionals.',
  'Promote research, innovation and entrepreneurship.',
  'Foster strong industry and community connections.',
]

export default function About() {
  useSeo({
    title: 'About',
    description:
      'About Tulsiramji Gaikwad-Patil College of Pharmacy, Nagpur — vision, mission, approvals and affiliations.',
  })
  const reduceMotion = useReducedMotion()

  return (
    <>
      {/* Page header */}
      <div className="bg-navy-900 py-14 md:py-20">
        <PageContainer>
          <div className="[&_nav]:text-white/60 [&_nav_a:hover]:text-cyan-400 [&_nav_span:last-child]:text-white">
            <Breadcrumb items={[{ label: 'About TGPCOP' }]} />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            About TGPCOP
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Tulsiramji Gaikwad-Patil College of Pharmacy, Nagpur — an institution dedicated to
            pharmaceutical education, research and professional excellence.
          </p>
        </PageContainer>
      </div>

      <PageContainer className="py-12 md:py-16">
        {/* Welcome */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4 text-dark-text/90 leading-relaxed font-body">
            <h2 className="font-heading font-bold text-2xl text-navy-900">Welcome</h2>
            <p>
              Tulsiramji Gaikwad-Patil College of Pharmacy (TGPCOP) was established in{' '}
              {SITE.established} by {SITE.parentTrust}. The college is affiliated to{' '}
              {SITE.university} and is approved by the Pharmacy Council of India (PCI) and the
              Directorate of Technical Education (DTE), Maharashtra.
            </p>
            <p>
              The college offers undergraduate programs in pharmacy — Bachelor of Pharmacy (B.Pharm)
              and Diploma in Pharmacy (D.Pharm) — with an intake sanctioned by the approving
              authorities. TGPCOP combines a rigorous academic curriculum with laboratory practice
              and mentorship to prepare students for careers in the pharmaceutical and healthcare
              sectors.
            </p>
            <p className="text-sm text-muted">
              DTE Code: <span className="font-medium text-navy-900">{SITE.dteCode}</span>
            </p>
          </div>

          {/* Institutional information */}
          <aside className="bg-light-bg border border-border rounded-xl p-6 h-fit">
            <h3 className="font-heading font-semibold text-base text-navy-900 mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-500" />
              Institutional Information
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted">Established</dt>
                <dd className="font-medium text-dark-text">{SITE.established}</dd>
              </div>
              <div>
                <dt className="text-muted">Parent Trust</dt>
                <dd className="font-medium text-dark-text">{SITE.parentTrust}</dd>
              </div>
              <div>
                <dt className="text-muted">Affiliated To</dt>
                <dd className="font-medium text-dark-text">{SITE.university}</dd>
              </div>
              <div>
                <dt className="text-muted">DTE Code</dt>
                <dd className="font-medium text-dark-text">{SITE.dteCode}</dd>
              </div>
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="font-medium text-dark-text">{SITE.address}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Vision & Mission */}
        <div id="vision" className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="bg-navy-900 rounded-xl p-8 text-white"
          >
            <div className="w-11 h-11 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Vision</h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed italic">
              “{SITE.vision}”
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
            className="bg-white border border-border rounded-xl p-8"
          >
            <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="font-heading font-bold text-xl text-navy-900 mb-3">Mission</h3>
            <ul className="space-y-2.5 text-dark-text/80 text-sm md:text-base leading-relaxed">
              <li className="flex gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                To provide quality higher education in pharmaceutical sciences.
              </li>
              <li className="flex gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                To promote research, innovation and entrepreneurship among students and faculty.
              </li>
              <li className="flex gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                To nurture ethical professionals committed to healthcare and community service.
              </li>
            </ul>
            <p className="text-xs text-muted mt-4">
              For the institution’s verbatim mission statement, refer to the official college
              prospectus or contact the office.
            </p>
          </motion.div>
        </div>

        {/* Principal's message */}
        <div id="principal" className="mt-14 scroll-mt-24">
          <SectionHeading
            label="Leadership"
            heading="Principal's Message"
          />
          <div className="bg-white border border-border rounded-xl p-8 flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-navy-900 to-primary-600 shrink-0 flex items-center justify-center">
              <span className="font-heading font-bold text-white text-2xl">P</span>
            </div>
            <div>
              <p className="text-dark-text/80 text-sm md:text-base leading-relaxed italic mb-4">
                “On behalf of the entire TGPCOP family, I welcome you to our institution. We are
                committed to nurturing competent, compassionate pharmaceutical professionals who
                will serve society with knowledge and integrity.”
              </p>
              <p className="text-muted text-sm">
                The Principal’s detailed message and photograph will be updated here with official
                content from the college administration.
              </p>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-14">
          <SectionHeading label="Goals" heading="Objectives" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {objectives.map((objective) => (
              <div
                key={objective}
                className="flex items-start gap-3 bg-light-bg border border-border rounded-lg p-4"
              >
                <ListChecks className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-sm text-dark-text/90 leading-relaxed">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Approvals & Affiliations */}
        <div className="mt-14">
          <SectionHeading
            label="Recognition"
            heading="Approvals & Affiliations"
            description="TGPCOP operates with the following institutional recognitions."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: 'Pharmacy Council of India', subtitle: 'Approval' },
              { icon: ShieldCheck, title: 'DTE Maharashtra', subtitle: 'Approval' },
              { icon: Landmark, title: 'DBATU, Lonere', subtitle: 'Affiliation' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-border rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-500" />
                </div>
                <p className="text-xs text-cyan-500 font-heading font-semibold uppercase tracking-wider mb-1">
                  {item.subtitle}
                </p>
                <h3 className="font-heading font-semibold text-sm text-navy-900">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </>
  )
}
