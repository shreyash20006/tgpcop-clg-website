import { useState } from 'react'
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Award,
  CalendarDays,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Microscope,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Krutika J. Warthi',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmaceutical Chemistry), B.Pharm',
  email: 'krutikawarthi14@gmail.com',
}

const qualifications = [
  {
    sr: 1,
    course: 'M.Pharm (Pharmaceutical Chemistry)',
    college: 'Department of Pharmaceutical Sciences, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2015',
    score: '74.87 %',
    grade: 'First Class',
  },
  {
    sr: 2,
    course: 'B.Pharm',
    college: 'Department of Pharmaceutical Sciences, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2012',
    score: '60.25 %',
    grade: 'First Class',
  },
]

const dissertation = {
  title: 'Determination of Garenoxacin in biological samples and pharmaceutical preparation',
  specialization: 'Pharmaceutical Chemistry & Bioanalytical Method Development',
  description:
    'Focused on developing and validating highly sensitive analytical and bioanalytical chromatographic assays for the quantitative estimation of Garenoxacin in dosage formulations and biological matrices.',
}

const instruments = [
  { name: 'HPLC (High-Performance Liquid Chromatography)', level: 'Advanced / Hands-on' },
  { name: 'HPTLC (High-Performance Thin-Layer Chromatography)', level: 'Advanced / Hands-on' },
  { name: 'UV-Visible Spectrophotometer', level: 'Hands-on Expertise' },
  { name: 'FTIR Spectrometer (Fourier-Transform Infrared)', level: 'Hands-on Expertise' },
  { name: 'Solid Phase Extractor (SPE)', level: 'Sample Preparation' },
  { name: 'Cooling Centrifuge', level: 'Biological Matrix Processing' },
]

const experience = [
  {
    sr: 1,
    post: 'Clinical Research Coordinator',
    institute: 'LMCC, Dhantoli, Nagpur',
    from: '10.08.2012',
    to: '05.06.2013',
    scope: 'Clinical trial co-ordination, patient records, protocol adherence & ICH-GCP compliance',
  },
  {
    sr: 2,
    post: 'Assistant Professor',
    institute: 'SDDVCOP, Panvel, Maharashtra',
    from: '01.08.2017',
    to: '30.12.2020',
    scope: 'Undergraduate pharmacy lecturing, Pharmaceutical Chemistry laboratory instruction, and academic guidance',
  },
]

const seminars = [
  {
    sr: 1,
    title: 'National Seminar on "Current trends in formulation development and regulatory affairs"',
    place: 'Department of Pharmaceutical Sciences, RTM Nagpur University, Nagpur',
    date: '3rd December 2013',
  },
  {
    sr: 2,
    title: 'National Seminar on "Current research strategies and future prospects for the management of diabetes mellitus"',
    place: 'Department of Pharmaceutical Sciences, RTM Nagpur University, Nagpur',
    date: '28th February 2014',
  },
  {
    sr: 3,
    title: 'National Seminar on "Bioanalytical Techniques: Approaches and Challenges"',
    place: 'Smt. Kishoritai Bhoyar College of Pharmacy (SKB), Kamptee, Nagpur',
    date: '15th November 2014',
  },
  {
    sr: 4,
    title: '2nd International Congress of Society for Ethnopharmacology on "Validation of Medicinal plants and Traditional Medicine – Global perspectives"',
    place: 'Department of Pharmaceutical Sciences, RTM Nagpur University, Nagpur',
    date: '20–22 February 2015',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'qualifications', label: 'Academic Qualifications', icon: GraduationCap },
  { id: 'instruments', label: 'Instruments & Research', icon: Microscope },
  { id: 'experience', label: 'Professional Experience', icon: Briefcase },
  { id: 'conferences', label: 'Conferences & Certifications', icon: Award },
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

export default function FacultyDetailKrutikaWarthi() {
  useSeo({
    title: 'Prof. Krutika J. Warthi — Faculty Profile | TGPCOP',
    description:
      'Detailed academic and professional profile of Prof. Krutika J. Warthi, Assistant Professor in Pharmaceutical Chemistry at TGPCOP Nagpur — M.Pharm First Class (UDPS RTMNU), instrument handling, research and experience.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('qualifications')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic background, analytical instrument expertise, and clinical/teaching experience."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Krutika J. Warthi' },
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
          <div className="h-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-primary-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-sky-900 to-indigo-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              KW
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200">
                  Pharmaceutical Chemistry
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-sky-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  M.Pharm First Class (74.87%) — UDPS Nagpur
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  ICH-GCP Certified (Clinical Research)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                  Hands-on HPLC, HPTLC, FTIR & UV-Vis
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-sky-600' : 'text-muted'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Tab View ── */}

        {/* Tab 1: Qualifications */}
        {activeTab === 'qualifications' && (
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications</h2>
                <p className="text-sm text-muted">University degrees from the Department of Pharmaceutical Sciences, Nagpur.</p>
              </div>
              <Table
                headers={['#', 'Degree / Course', 'College / Institute', 'Board / University', 'Year', 'Score (%)', 'Grade']}
                rows={qualifications.map((q) => [q.sr, q.course, q.college, q.board, q.year, q.score, q.grade])}
              />
            </div>

            {/* M.Pharm Dissertation Box */}
            <div className="bg-white border-2 border-sky-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold">
                  M.Pharm Dissertation
                </span>
                <span className="text-xs text-muted font-medium">{dissertation.specialization}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-navy-900 mb-2 leading-snug">
                "{dissertation.title}"
              </h3>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {dissertation.description}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Instruments */}
        {activeTab === 'instruments' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Analytical Instruments Hands-On Expertise</h2>
              <p className="text-sm text-muted">Practical instrumentation and spectral analysis competencies.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {instruments.map((inst, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                      <FlaskConical className="w-4 h-4" />
                    </span>
                    <h3 className="font-heading font-bold text-sm text-navy-900 mb-1 leading-snug">
                      {inst.name}
                    </h3>
                  </div>
                  <span className="mt-3 inline-block text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    {inst.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Professional & Clinical Experience</h2>
              <p className="text-sm text-muted">Experience across clinical trial research coordination and academic pharmacy instruction.</p>
            </div>
            <Table
              headers={['#', 'Post Held', 'Name of Institute', 'From', 'To', 'Scope & Duties']}
              rows={experience.map((e) => [e.sr, e.post, e.institute, e.from, e.to, e.scope])}
            />
          </div>
        )}

        {/* Tab 4: Conferences & Certifications */}
        {activeTab === 'conferences' && (
          <div className="space-y-8">
            {/* Certifications & Presentations Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <span className="text-xs text-muted font-medium block mb-1">Clinical Certification</span>
                <h3 className="font-heading font-bold text-base text-navy-900">ICH-GCP Training</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Completion Certificate Awarded</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <span className="text-xs text-muted font-medium block mb-1">Poster Presentations</span>
                <h3 className="font-heading font-bold text-base text-navy-900">1 National Seminar</h3>
                <p className="text-xs text-sky-600 font-semibold mt-1">Presented at National Level</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                <span className="text-xs text-muted font-medium block mb-1">Poster Presentations</span>
                <h3 className="font-heading font-bold text-base text-navy-900">1 International Conference</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-1">Presented at International Level</p>
              </div>
            </div>

            {/* Seminars List */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">National & International Seminars Attended</h2>
                <p className="text-sm text-muted">Participation in regulatory affairs, diabetes mellitus, bioanalytical techniques, and ethnopharmacology.</p>
              </div>
              <Table
                headers={['#', 'Conferences / Seminars / Workshops', 'Place / Organizing Body', 'Date']}
                rows={seminars.map((s) => [s.sr, s.title, s.place, s.date])}
              />
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
