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
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Tejaswini Ambadas Mankar',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmacology - 8.85 CGPA), B.Pharm (8.01 CGPA)',
  specialization: 'Pharmacology',
  languages: 'Marathi, Hindi, English',
  email: 'tejumankar1999@gmail.com',
  objective:
    'To be a part of an organization where I will get a chance to use my knowledge and skill to contribute in the progress of the organization as well as myself.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm - Pharmacology)',
    college: 'Institute of Pharmaceutical Science and Research',
    board: 'Sardar Patel University, Balaghat',
    year: '2024',
    score: '8.85 CGPA',
    grade: 'Distinction / First Class',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2021',
    score: '8.01 CGPA',
    grade: 'Distinction / First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Jeevan Vikas Mahavidyalaya, Thugaondeo',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2017',
    score: '82.31 %',
    grade: 'First Class with Distinction',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Janata High School, Jalalkheda',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2015',
    score: '89.90 %',
    grade: 'Distinction',
  },
]

const project = {
  title: 'Antirheumatoid Activity of Ethanolic Extract of Rhizome Alpinia Calcarata by Formaldehyde Induced Rat Model',
  type: 'Pharmacology Research Dissertation',
  scope:
    'Evaluated in-vivo anti-arthritic and anti-rheumatoid potential of ethanolic rhizome extracts of Alpinia calcarata using formaldehyde-induced arthritis animal models, assessing paw volume edema reduction, inflammatory mediator modulation, and histopathological joint recovery.',
}

const experience = [
  {
    sr: 1,
    post: 'Lecturer in Pharmacy',
    institute: 'Shri Sai College of Pharmacy, Mouda, Nagpur',
    duration: 'Oct 2021 – Nov 2022 & Ongoing',
    scope:
      'Lecturing in Pharmacology, Human Anatomy & Physiology, conducting experimental pharmacology laboratory practicals, student mentoring, and departmental academic coordination.',
  },
]

const skills = [
  {
    category: 'Computer & Office Automation',
    items: ['MS-CIT Certified', 'Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint'],
  },
  {
    category: 'Academic & Professional',
    items: ['In-Vivo Experimental Pharmacology', 'Animal Model Handling', 'Organizational Skills', 'Classroom Leadership & Mentoring'],
  },
  {
    category: 'Key Strengths',
    items: ['Goal-Oriented Approach', 'Positive Attitude', 'Dedicated Work Ethic', 'Continuous Learning'],
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'experience', label: 'Academic Experience', icon: Briefcase },
  { id: 'project', label: 'Pharmacology Research', icon: FlaskConical },
  { id: 'skills', label: 'Skills & Strengths', icon: Award },
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

export default function FacultyDetailTejaswiniMankar() {
  useSeo({
    title: 'Prof. Tejaswini Ambadas Mankar — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Tejaswini Ambadas Mankar, Assistant Professor in Pharmacology at TGPCOP Nagpur — M.Pharm (8.85 CGPA), B.Pharm (8.01 CGPA), teaching experience and anti-arthritic research.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic background in Pharmacology, animal model research, and pharmacy teaching experience."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Tejaswini Mankar' },
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
          <div className="h-2.5 bg-gradient-to-r from-violet-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-violet-900 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              TM
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-violet-50 text-violet-800 text-xs font-semibold border border-violet-200">
                  Pharmacology Specialization
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-violet-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  M.Pharm Pharmacology (8.85 CGPA)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  B.Pharm Distinction (8.01 CGPA)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  MS-CIT Certified
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-violet-600' : 'text-muted'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Tab View ── */}

        {/* Tab 1: Education */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Career Objective</h2>
              <p className="text-sm text-navy-800 bg-light-bg p-4 rounded-xl border border-border/80 italic leading-relaxed">
                "{profile.objective}"
              </p>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Educational Qualifications</h2>
                <p className="text-sm text-muted">Consistent academic excellence across school, graduate, and master's programs.</p>
              </div>
              <Table
                headers={['#', 'Degree / Course', 'Institute / College', 'University / Board', 'Year', 'Score / CGPA', 'Grade']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score, e.grade])}
              />
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">
                Language Proficiency
              </h3>
              <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                <span className="text-muted text-xs block">Languages Known</span>
                <strong className="text-navy-900">{profile.languages}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching Experience</h2>
              <p className="text-sm text-muted">Pharmacy college teaching and experimental pharmacology laboratory facilitation.</p>
            </div>
            <Table
              headers={['#', 'Post Held', 'Name of Institute', 'Period / Duration', 'Scope & Responsibilities']}
              rows={experience.map((e) => [e.sr, e.post, e.institute, e.duration, e.scope])}
            />
          </div>
        )}

        {/* Tab 3: Project */}
        {activeTab === 'project' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Pharmacology Research Project</h2>
              <p className="text-sm text-muted">In-vivo herbal pharmacology and anti-arthritic activity investigation.</p>
            </div>

            <div className="bg-white border-2 border-violet-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-semibold">
                  {project.type}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                "{project.title}"
              </h3>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {project.scope}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Skills & Strengths */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Skills, Tools & Key Strengths</h2>
              <p className="text-sm text-muted">Technical proficiency, laboratory competencies, and core strengths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((group, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    {group.category}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-navy-800">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
