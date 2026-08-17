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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Priyanka S. Waghmare (Talwekar)',
  designation: 'Assistant Professor & HoD',
  qualificationLine: 'M.Pharm (Pharmaceutics), B.Pharm',
  email: 'waghmare456priyanka@gmail.com',
}

const qualifications = [
  {
    sr: 1,
    course: 'B.Pharm',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2016',
    score: '7.65 CGPA',
    division: 'First Division',
  },
  {
    sr: 2,
    course: 'M.Pharm (Pharmaceutics)',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2018',
    score: '68.38 %',
    division: 'First Division',
  },
]

const research = [
  {
    degree: 'M.Pharm (Pharmaceutics)',
    title:
      'Formulation, evaluation and validation of sustained release bilayer tablet for two Anti-diabetic Drugs',
    description:
      'Focused on novel oral drug delivery systems, specifically formulating bilayer matrices to control and sustain the release rate of dual anti-diabetic therapeutics for enhanced patient compliance.',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Assistant Professor',
    institute: 'Shree Swami Samarth Institute of Pharmacy, Dhamangaon',
    from: '01/07/2018',
    to: '30/04/2019',
    scope: 'Instruction in Pharmaceutics, practical lab sessions, and student mentoring',
  },
  {
    sr: 2,
    post: 'Assistant Professor',
    institute: 'Dr. R. G. Bhoyar Institute of Pharmacy, Wardha',
    from: '17/07/2019',
    to: '22/10/2022',
    scope: 'Undergraduate teaching, curriculum delivery, and departmental co-ordination',
  },
]

const extraCurricular = [
  {
    sr: 1,
    title: 'University Level Youth Festival',
    category: 'Inter-Collegiate Event',
    description:
      'Actively participated in Inter-Collegiate Youth Festival representing the institute at the university level.',
  },
  {
    sr: 2,
    title: 'Learn Moodle Basics',
    category: 'Online Faculty Development Programme',
    description:
      'Attended and completed the online Faculty Development Programme on Learn Moodle Basics for effective digital course delivery and learning management.',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'qualifications', label: 'Academic Qualifications', icon: GraduationCap },
  { id: 'experience', label: 'Teaching Experience', icon: Briefcase },
  { id: 'research', label: 'Research & Thesis', icon: FlaskConical },
  { id: 'extracurricular', label: 'FDP & Extracurricular', icon: Award },
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

export default function FacultyDetailPriyankaWaghmare() {
  useSeo({
    title: 'Prof. Priyanka S. Waghmare (Talwekar) — Faculty Profile | TGPCOP',
    description:
      'Faculty profile of Prof. Priyanka S. Waghmare (Talwekar), Assistant Professor & HoD at TGPCOP Nagpur — M.Pharm in Pharmaceutics (First Division), research and teaching experience.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('qualifications')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic qualifications, research background, and teaching experience."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Priyanka S. Waghmare' },
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
          <div className="h-2.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-600 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              PW
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                  HoD & Assistant Professor
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                  Pharmaceutics Specialization
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  M.Pharm First Division (Pharmaceutics)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  B.Pharm First Division (7.65 CGPA)
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-emerald-600' : 'text-muted'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Tab View ── */}

        {/* Tab 1: Qualifications */}
        {activeTab === 'qualifications' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications</h2>
              <p className="text-sm text-muted">Educational degrees from R.T.M. Nagpur University.</p>
            </div>
            <Table
              headers={['#', 'Course / Degree', 'Board / University', 'Year of Passing', 'Percentage / CGPA', 'Division']}
              rows={qualifications.map((q) => [q.sr, q.course, q.board, q.year, q.score, q.division])}
            />
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic Teaching Experience</h2>
              <p className="text-sm text-muted">History of teaching appointments at recognized pharmacy institutes.</p>
            </div>
            <Table
              headers={['#', 'Post Held', 'Name of the Institute', 'From', 'To', 'Scope & Duties']}
              rows={experience.map((e) => [e.sr, e.post, e.institute, e.from, e.to, e.scope])}
            />
          </div>
        )}

        {/* Tab 3: Research */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">M.Pharm Research & Thesis</h2>
              <p className="text-sm text-muted">Post-graduate dissertation in Pharmaceutics.</p>
            </div>
            {research.map((r) => (
              <div key={r.degree} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                    {r.degree} Thesis
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                  "{r.title}"
                </h3>
                <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Extracurricular & FDP */}
        {activeTab === 'extracurricular' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Extra-Curricular & Faculty Development</h2>
              <p className="text-sm text-muted">University-level events, cultural participations, and online FDPs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extraCurricular.map((item) => (
                <div key={item.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-muted">#{item.sr}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-600" />
                Additional Summary
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Prof. Priyanka S. Waghmare serves as Assistant Professor and Head of Department (HoD) at TGPCOP Nagpur, bringing valuable expertise in Pharmaceutics, formulation design of solid oral dosage forms, student engagement, and modern LMS-based pedagogy.
              </p>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
