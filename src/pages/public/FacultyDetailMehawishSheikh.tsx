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
  FileCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Mehawish Ajim Sheikh',
  designation: 'Lecturer',
  qualificationLine: 'B.Pharm (73.03% Distinction, Gondwana University), M.Pharm (DBATU Lonere)',
  specialization: 'Pharmaceutics, Herbal Formulations & Hospital Pharmacy',
  languages: 'English, Hindi, Marathi, Urdu',
  email: 'mehawish.pharmacy@gpgit.com',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm)',
    board: 'Dr. Babasaheb Ambedkar Technological University (DBATU), Lonere',
    year: '2025–Present',
    score: 'Post-Graduation',
    grade: 'M.Pharm Scholar',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    board: 'Gondwana University, Gadchiroli (M.H.)',
    year: '2021–2025',
    score: '73.03 %',
    grade: 'First Division with Distinction',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Lecturer in Pharmacy',
    institute: 'Tulsiramji Gaikwad Patil College of Pharmacy, Mohgaon, Nagpur',
    duration: 'November 2025 – Present',
    scope: 'Instruction in Pharmaceutics, Pharmacognosy, student laboratory supervision, and academic coordination.',
  },
  {
    sr: 2,
    post: 'Hospital Pharmacist',
    institute: 'Bhausaheb Mulak Ayurvedic Hospital, College & Research Center, Butibori, Nagpur',
    duration: 'September 2025 – November 2025',
    scope: 'Inpatient dispensing, hospital formulary management, statutory compliance records, and patient counseling.',
  },
  {
    sr: 3,
    post: 'Pharmacy Trainee',
    institute: 'Maa Bhawani Medicos, Butibori, Nagpur',
    duration: 'June 2025 – August 2025',
    scope: 'Retail pharmacy operations, drug storage regulations, prescription audits, and customer dispensing.',
  },
  {
    sr: 4,
    post: 'Hospital Trainee',
    institute: 'Ishwar Multispeciality Hospital, Butibori, Nagpur',
    duration: 'May 2024 – July 2024',
    scope: 'Clinical ward rounds, emergency medicine inventory management, and therapeutic compliance checking.',
  },
]

const researchProjects = [
  {
    sr: 1,
    title: 'Formulation of Herbal Jatyadi Oil for Urinary Tract Infection and Piles by Using Extracted Herbs',
    guide: 'Miss. Ashwini C. Bhukya, Assistant Professor, Maharashtra Institute of Pharmacy, Betala, Brahmapuri',
    details:
      'Standardized herbal extraction of wound-healing phytochemicals, formulated soothing topical medicated oil, and conducted viscosity, acid value, saponification, and antimicrobial screening.',
  },
  {
    sr: 2,
    title: 'Recrystallization of Solid Amorphous Drugs',
    guide: 'Dr. Suhas N. Sakarkar, Associate Professor, Maharashtra Institute of Pharmacy, Betala, Brahmapuri',
    details:
      'Evaluated polymorphic transitions, crystallization solvent systems, supersaturation control, and dissolution rate enhancement of poorly soluble pharmaceutical compounds.',
  },
]

const achievements = [
  {
    sr: 1,
    title: 'National Council of Child Development Monitoring (NCICM) Committee',
    place: 'Bhausaheb Mulak Ayurvedic Hospital & Research Center, Butibori',
    date: '22nd – 23rd September 2025',
    points: [
      'Curriculum Monitoring: Supervised class schedules, syllabus completion, and adherence to university teaching plans.',
      'Inspection & Compliance: Verified institution adherence to MUHS, AICTE, and PCI regulations.',
      'Documentation & LIC Prep: Compiled Local Inquiry Committee (LIC) inspection records, teacher diaries, and workload statements.',
    ],
  },
  {
    sr: 2,
    title: 'Maharashtra University of Health Sciences (MUHS) LIC PG Inspection Committee',
    place: 'Bhausaheb Mulak Ayurvedic Hospital & Research Center, Butibori',
    date: '6th October 2025',
    points: [
      'Assisted in the statutory MUHS Local Inquiry Committee (LIC) inspection preparation for post-graduate affiliation continuance.',
    ],
  },
]

const workshops = [
  {
    sr: 1,
    title: 'Global Clinical Trials & Site Management Organization (SMO) Workshop',
    organizer: 'Canvass Clinical Research Services Pvt. Ltd., Ramdaspeth, Nagpur',
    date: '21st June 2025',
  },
  {
    sr: 2,
    title: 'State Level GPAT Guidance Webinar',
    organizer: 'Maharashtra Institute of Pharmacy, Chandrapur',
    date: '21st May 2025',
  },
  {
    sr: 3,
    title: 'National Pharmacy Education Day Online Scientific Competition',
    organizer: 'SSK College of Pharmacy, Wadzire, Nashik',
    date: '10th February 2024',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'experience', label: 'Teaching & Clinical Experience', icon: Briefcase },
  { id: 'research', label: 'Herbal & Solid State Projects', icon: FlaskConical },
  { id: 'committees', label: 'MUHS / LIC & Compliance', icon: FileCheck },
  { id: 'workshops', label: 'Workshops & Activities', icon: Award },
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

export default function FacultyDetailMehawishSheikh() {
  useSeo({
    title: 'Prof. Mehawish Ajim Sheikh — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Mehawish Ajim Sheikh, Lecturer at TGPCOP Nagpur — B.Pharm (73.03% Distinction, Gondwana University), herbal formulation researcher, and hospital pharmacy compliance specialist.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in herbal dosage formulation, solid amorphous drug recrystallization, hospital pharmacy, and institutional regulatory compliance."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Mehawish Sheikh' },
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
          <div className="h-2.5 bg-gradient-to-r from-emerald-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-900 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              MS
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
                  B.Pharm Distinction (73.03%)
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
                <div className="flex items-center gap-2 text-navy-800">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Languages: {profile.languages}</span>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Hospital Pharmacist Experience at Bhausaheb Mulak Ayurvedic Hospital
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                  MUHS & AICTE Institutional Inspection Documentation
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Anti-Ragging Committee Active Member
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

        {/* Tab 1: Education */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications</h2>
                <p className="text-sm text-muted">First class with distinction graduate in Pharmacy from Gondwana University.</p>
              </div>
              <Table
                headers={['#', 'Course / Degree', 'Board / University', 'Year of Passing', 'Percentage / Division']}
                rows={education.map((e) => [e.sr, e.course, e.board, e.year, `${e.score} (${e.grade})`])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching & Clinical Pharmacy Experience</h2>
              <p className="text-sm text-muted">Lecturing at TGPCOP and hospital clinical dispensing practice.</p>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-emerald-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                      {exp.post}
                    </span>
                    <span className="text-xs text-muted font-semibold">{exp.duration}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-1">
                    {exp.institute}
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
              <h2 className="font-heading font-bold text-xl text-navy-900">Research & Formulation Projects</h2>
              <p className="text-sm text-muted">Herbal bioactive extraction and amorphous drug recrystallization.</p>
            </div>

            <div className="space-y-4">
              {researchProjects.map((p) => (
                <div key={p.sr} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold mb-3">
                    B.Pharm Research Dissertation
                  </span>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2 leading-snug">
                    "{p.title}"
                  </h3>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-950 mb-3">
                    <strong>Project Guide:</strong> {p.guide}
                  </div>
                  <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                    {p.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Committees & Compliance */}
        {activeTab === 'committees' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Institutional Accreditation & Inspection Committees</h2>
              <p className="text-sm text-muted">MUHS, PCI, and AICTE compliance documentation and curriculum monitoring.</p>
            </div>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <div key={ach.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-navy-950 text-white">
                      {ach.date}
                    </span>
                    <span className="text-xs text-muted font-bold">#{ach.sr}</span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-navy-900 mb-1 leading-snug">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-primary-600 font-medium mb-3">
                    {ach.place}
                  </p>

                  <ul className="space-y-2 text-sm text-navy-800">
                    {ach.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Workshops */}
        {activeTab === 'workshops' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Workshops, Clinical Seminars & Institutional Service</h2>
              <p className="text-sm text-muted">Clinical research SMO training and anti-ragging committee responsibilities.</p>
            </div>

            <div className="space-y-3">
              {workshops.map((w) => (
                <div key={w.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    #{w.sr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-1">
                      {w.title}
                    </h3>
                    <p className="text-xs text-muted">
                      {w.organizer} • {w.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 mt-4">
              <h4 className="font-heading font-bold text-sm text-emerald-950 mb-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Anti-Ragging Committee Member
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Active member of the Institutional Anti-Ragging Committee at Maharashtra Institute of Pharmacy, maintaining campus discipline and student welfare.
              </p>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
