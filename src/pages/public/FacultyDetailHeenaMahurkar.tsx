import { useState } from 'react'
import {
  Mail,
  GraduationCap,
  BookOpen,
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
  name: 'Prof. Heena Mahurkar',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmaceutics - RGPV Bhopal), B.Pharm (7.90 CGPA, DMIHER Wardha)',
  specialization: 'Pharmaceutics, Lipid-Based Drug Delivery Systems & Topical Formulations',
  languages: 'English, Hindi, Marathi',
  email: 'heenamahurkar881@gmail.com',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm - Pharmaceutics)',
    board: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
    year: '2024–2026',
    score: 'First Division',
    grade: 'Post-Graduation',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    board: 'Datta Meghe Institute of Higher Education and Research (DMIHER), Wardha',
    year: '2020–2024',
    score: '7.90 CGPA',
    grade: 'First Division',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    board: 'Board of Secondary Education, Bhopal (M.P.)',
    year: '2020',
    score: '79.80 %',
    grade: 'First Division with Distinction',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    board: 'Board of Secondary Education, Bhopal (M.P.)',
    year: '2018',
    score: '84.00 %',
    grade: 'First Division with Distinction',
  },
]

const publications = [
  {
    sr: 1,
    title: 'Recent advances & therapeutic applications of lipid based drug delivery system',
    journal: 'Asian Journal of Pharmaceutics (AJP)',
    type: 'International Review Article',
  },
  {
    sr: 2,
    title: 'Biological Barriers in Drug Delivery',
    journal: 'Asian Journal of Pharmaceutics (AJP)',
    type: 'International Review Article',
  },
  {
    sr: 3,
    title:
      'Innovations in Topical Drug Delivery: Recent Developments in Transdermal Formulations, Gels, and Patches as Topical Medication Delivery Methods',
    journal: 'Asian Journal of Pharmaceutics (AJP)',
    type: 'International Review Article',
  },
]

const presentations = [
  {
    sr: 1,
    title:
      'In vivo assessment of anthelmintic potential of Citrus limon and Indian bael fruit juice extract',
    event:
      'APTICON-2022 (National Convention of Association of Pharmaceutical Teachers of India), JSS College of Pharmacy, JSS AHER, Mysuru, Karnataka',
    type: 'National Poster Presentation',
  },
  {
    sr: 2,
    title: 'Recent Advances and Therapeutic Applications of Lipid-based Drug Delivery Systems',
    event: 'ITSEMC-2023, Yeshwantrao Chavan College of Engineering (YCCE), Nagpur, Maharashtra',
    type: 'Conference Poster Presentation',
  },
  {
    sr: 3,
    title: 'Unfold the Mystery of Chemistry',
    event: 'Datta Meghe College of Pharmacy, DMIHER, Wardha',
    type: 'Academic Symposium Presentation',
  },
]

const researchProject = {
  title: 'Formulation & Development of Herbal Gel for Mouth Ulcers',
  guide: 'Ms. Sunita Vaidya, Assistant Professor, Datta Meghe College of Pharmacy, Wardha',
  degree: 'B.Pharm Research Project',
  scope:
    'Formulated bio-adhesive topical herbal gel using natural plant extracts for oral buccal ulceration, conducting rheological characterization, pH stability, spreadability, in-vitro antimicrobial evaluation, and mucosal irritation studies.',
}

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'publications', label: `Publications (${publications.length})`, icon: BookOpen },
  { id: 'presentations', label: `Conferences & Posters (${presentations.length})`, icon: Award },
  { id: 'research', label: 'Herbal Formulation Research', icon: FlaskConical },
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

export default function FacultyDetailHeenaMahurkar() {
  useSeo({
    title: 'Prof. Heena Mahurkar — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Heena Mahurkar, Assistant Professor at TGPCOP Nagpur — M.Pharm Pharmaceutics (RGPV Bhopal), B.Pharm (7.90 CGPA, DMIHER Wardha), 3 publications in Asian Journal of Pharmaceutics, and APTICON poster presenter.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutics, lipid-based drug delivery systems, topical gel formulations, and international journal publications."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Heena Mahurkar' },
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
          <div className="h-2.5 bg-gradient-to-r from-amber-500 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-700 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              HM
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
                  Pharmaceutics Specialization
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
                <div className="flex items-center gap-2 text-navy-800">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Languages: {profile.languages}</span>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  3 Papers Published in Asian Journal of Pharmaceutics
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  APTICON-2022 Poster Presenter (JSS Mysuru)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  First Division in B.Pharm (7.90 CGPA) & HSC (79.8%)
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-amber-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">First-division academic performance across secondary, graduate, and post-graduate studies.</p>
              </div>
              <Table
                headers={['#', 'Course / Examination', 'Board / University', 'Year of Passing', 'Percentage / CGPA', 'Division']}
                rows={education.map((e) => [e.sr, e.course, e.board, e.year, e.score, e.grade])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Publications */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">International Journal Publications</h2>
              <p className="text-sm text-muted">Papers published in the Asian Journal of Pharmaceutics (AJP).</p>
            </div>

            <div className="space-y-4">
              {publications.map((p) => (
                <div
                  key={p.sr}
                  className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all flex items-start gap-4"
                >
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-navy-950 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {p.sr}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 mb-1">
                      {p.type}
                    </span>
                    <h3 className="text-base font-heading font-bold text-navy-900 mb-1 leading-snug">
                      "{p.title}"
                    </h3>
                    <p className="text-xs text-primary-600 font-semibold">
                      {p.journal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Presentations */}
        {activeTab === 'presentations' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Poster Presentations & Academic Seminars</h2>
              <p className="text-sm text-muted">National conventions and pharmaceutical research symposiums.</p>
            </div>

            <div className="space-y-4">
              {presentations.map((pres) => (
                <div key={pres.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-navy-950 text-white">
                      {pres.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-muted">#{pres.sr}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-2 leading-snug">
                    "{pres.title}"
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {pres.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Research Project */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Herbal Formulation & Mucosal Delivery Project</h2>
              <p className="text-sm text-muted">B.Pharm research thesis conducted at Datta Meghe College of Pharmacy.</p>
            </div>

            <div className="bg-white border-2 border-amber-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">
                  {researchProject.degree}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-2 leading-snug">
                "{researchProject.title}"
              </h3>
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-xs font-semibold text-amber-950 mb-4">
                <strong>Project Guide:</strong> {researchProject.guide}
              </div>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {researchProject.scope}
              </p>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
