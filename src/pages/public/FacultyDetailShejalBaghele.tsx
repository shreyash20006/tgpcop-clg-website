import { useState } from 'react'
import {
  Mail,
  GraduationCap,
  Briefcase,
  Award,
  FlaskConical,
  CalendarDays,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Shejal Deodas Baghele',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmaceutics), B.Pharm (7.11 CGPA, RTMNU), MS-CIT (97%)',
  specialization: 'Pharmaceutics, Targeted Nanoparticles & Clinical Pharmacy',
  languages: 'English, Hindi, Marathi',
  email: 'shejal.pharmacy@gpgit.com',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm - Pharmaceutics)',
    board: 'Sardar Patel University, Balaghat (M.P.)',
    year: '2024–2026',
    score: 'Post-Graduation',
    grade: 'M.Pharm Pursuing / Completed',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2020–2024',
    score: '7.11 CGPA',
    grade: 'First Division',
  },
  {
    sr: 3,
    course: 'MS-CIT (Information Technology Certification)',
    board: 'M.S.B.T.E., Mumbai',
    year: '2018',
    score: '97.00 %',
    grade: 'First Class with Distinction',
  },
]

const experience = [
  {
    sr: 1,
    role: 'Clinical Pharmacist',
    organization: 'Gayatri Clinic, Nagpur',
    duration: '01.01.2025 – 17.11.2025 (11 Months)',
    scope: 'Prescription handling, medicine dispensing, patient medication counseling, drug inventory management, and therapeutic compliance monitoring.',
  },
  {
    sr: 2,
    role: 'Hospital Pharmacy Trainee',
    organization: 'Seven Star Hospital, Nagpur',
    duration: '01.09.2024 – 31.12.2024 (4 Months)',
    scope: 'Clinical pharmacy rounds, inpatient dispensing, drug storage compliance, emergency medication preparation, and inventory audits.',
  },
  {
    sr: 3,
    role: 'Industrial Trainee',
    organization: 'Clarion Organic Limited, Dewadi (Tumsar)',
    duration: '01.06.2024 – 30.06.2024 (1 Month)',
    scope: 'Chemical synthesis unit observation, active pharmaceutical ingredient processing, raw material sampling, and GMP protocols.',
  },
]

const research = [
  {
    sr: 1,
    degree: 'M.Pharm Research',
    title: 'A Review Paper on Nanoparticles For Targeted Drug Delivery',
    guide: 'Dr. Atul, Assistant Professor, Sardar Patel University, Balaghat (M.P.)',
    scope:
      'Comprehensive review on surface-engineered nanoparticles, active targeting ligand conjugation, EPR effect in oncology, and bioavailability enhancement across biological barriers.',
  },
  {
    sr: 2,
    degree: 'B.Pharm Research',
    title: 'A Review Paper on Comparative Study of Labetalol Using Different Dosage Forms',
    guide: 'Ms. Suchita Bhoyar, Assistant Professor, Anurag College of Pharmacy, Warthi, Bhandara',
    scope:
      'Comparative evaluation of antihypertensive labetalol pharmacokinetics across conventional tablets, extended-release matrices, transdermal patches, and parenteral routes.',
  },
]

const certifications = [
  {
    title: '1-Month Specialized Course on Intellectual Property Rights (IPR)',
    issuer: 'IPR Certification Cell',
    type: 'Legal & Patent Certification',
  },
  {
    title: 'Delegate at 72nd Indian Pharmaceutical Congress (IPC 2023)',
    issuer: 'Department of Pharmaceutical Sciences, RTM Nagpur University',
    type: 'National Congress Delegate',
  },
  {
    title: 'MS-CIT Certification (97.00% Score)',
    issuer: 'Maharashtra State Board of Technical Education (MSBTE), Mumbai',
    type: 'Computer Proficiency Distinction',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'experience', label: 'Clinical & Industrial Experience', icon: Briefcase },
  { id: 'research', label: 'Pharmaceutics Research', icon: FlaskConical },
  { id: 'certifications', label: 'Certifications & Congress', icon: Award },
] as const

type TabId = (typeof TABS)[number]['id']

/* ─── Helper Table Component ─────────────────────────────────────────── */
function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-sm bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-950 text-white">
            {headers.map((h) => (
              <th key={h} className="py-3 px-4 text-left font-heading font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-border transition-colors ${
                i % 2 === 0 ? 'bg-white' : 'bg-light-bg'
              } hover:bg-primary-50`}
            >
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-navy-900 leading-snug">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Page Component ─────────────────────────────────────────────────── */

export default function FacultyDetailShejalBaghele() {
  useSeo({
    title: 'Prof. Shejal Deodas Baghele — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Shejal Deodas Baghele, Assistant Professor at TGPCOP Nagpur — M.Pharm Pharmaceutics, B.Pharm (RTMNU First Division), Clinical & Hospital pharmacy experience, and IPR certified.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutics, targeted nanoparticles, clinical dispensing, hospital pharmacy training, and IPR certifications."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Shejal Baghele' },
        ]}
      />

      <PageContainer className="py-10 md:py-14">
        {/* Back Link */}
        <Link
          to="/campus"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Campus & Faculty Directory
        </Link>

        {/* ── Hero Profile Card ── */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-10">
          <div className="h-2.5 bg-gradient-to-r from-cyan-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-cyan-900 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              SB
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-xs font-semibold border border-cyan-200">
                  Pharmaceutics & Clinical Pharmacy
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-cyan-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
                <div className="flex items-center gap-2 text-navy-800">
                  <Building2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Languages: {profile.languages}</span>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  Hospital Pharmacy at Seven Star Hospital, Nagpur
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  Certified in Intellectual Property Rights (IPR)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  MS-CIT Distinction (97%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Bar ── */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 pb-1">
          <div className="flex gap-1.5 min-w-max bg-gray-100/80 p-1.5 rounded-xl border border-border">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white text-navy-900 shadow-sm font-semibold'
                    : 'text-muted hover:text-navy-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-cyan-600' : 'text-muted'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Tab View ── */}

        {/* Tab 1: Education */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Educational Qualifications</h2>
                <p className="text-sm text-muted">B.Pharm first division from RTMNU and post-graduate studies in Pharmaceutics.</p>
              </div>
              <Table
                headers={['#', 'Course / Examination', 'Board / University', 'Year of Passing', 'Percentage / CGPA', 'Division']}
                rows={education.map((e) => [e.sr, e.course, e.board, e.year, e.score, e.grade])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Clinical, Hospital & Industrial Pharmacy Experience</h2>
              <p className="text-sm text-muted">Hands-on patient dispensing, hospital pharmacy rounds, and API manufacturing exposure.</p>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-cyan-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
                      {exp.role}
                    </span>
                    <span className="text-xs text-muted font-semibold">{exp.duration}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-2">
                    {exp.organization}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {exp.scope}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Research */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Pharmaceutics Research & Review Works</h2>
              <p className="text-sm text-muted">Nanoparticles in targeted drug delivery and comparative dosage forms.</p>
            </div>

            <div className="space-y-4">
              {research.map((r) => (
                <div key={r.sr} className="bg-white border-2 border-cyan-100 rounded-2xl p-6 shadow-sm">
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-semibold mb-3">
                    {r.degree}
                  </span>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2 leading-snug">
                    "{r.title}"
                  </h3>
                  <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-100 text-xs font-semibold text-cyan-950 mb-3">
                    <strong>Research Guide:</strong> {r.guide}
                  </div>
                  <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                    {r.scope}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Certifications & Professional Activities</h2>
              <p className="text-sm text-muted">Intellectual Property Rights course, national congress delegate, and IT qualifications.</p>
            </div>

            <div className="space-y-4">
              {certifications.map((c, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:border-cyan-300 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 mb-1">
                      {c.type}
                    </span>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-muted">
                      {c.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
