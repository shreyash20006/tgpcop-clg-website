import { useState } from 'react'
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  FlaskConical,
  CalendarDays,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Microscope,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Shivani R. Sawarkar',
  designation: 'Lecturer',
  qualificationLine: 'M.Pharm (Quality Assurance - 8.98 CGPA), GPAT & NIPER Qualified, B.Pharm (7.97 CGPA)',
  specialization: 'Pharmaceutical Quality Assurance & Analytical Method Validation',
  languages: 'English, Hindi, Marathi',
  email: 'shivanisawarkar786@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shivani-sawarkar-b8008015a',
  objective:
    'To grow as a professional through the process of continuous learning by working as a key player with an esteemed organization where capabilities are recognized and ample opportunities for growth are given.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (Quality Assurance)',
    college: 'All India Shri Shivaji Memorial Society (AISSMS) College of Pharmacy, Pune',
    board: 'Savitribai Phule Pune University (SPPU)',
    year: '2022',
    score: '8.98 CGPA',
    grade: 'First Class with Distinction',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Smt. Kishoritai Bhoyar College of Pharmacy (SKB), Kamptee, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2020',
    score: '7.97 CGPA',
    grade: 'First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Shri M. Mohata Science College, Nagpur',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2015',
    score: '76.77 %',
    grade: 'First Class with Distinction',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Nagar Parishad High School, Katol',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2013',
    score: '91.45 %',
    grade: 'Distinction',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Assistant Professor',
    institute: 'School of Pharmacy, G.H. Raisoni University, Amravati',
    duration: 'Academic Teaching Experience',
    scope: 'Instruction in Pharmaceutical Analysis, Quality Assurance protocols, and student laboratory mentorship.',
  },
  {
    sr: 2,
    post: 'Lecturer in Pharmacy',
    institute: 'Datta Meghe College of Pharmacy, Wardha',
    duration: 'Academic Faculty Experience',
    scope: 'Curriculum delivery in Pharmaceutical Quality Assurance, conducting practicals, and tutorial evaluations.',
  },
  {
    sr: 3,
    post: 'Lecturer (Visiting Faculty)',
    institute: 'Smt. Kusumtai Wankhede Institute of Pharmacy, Katol',
    duration: 'Visiting Faculty',
    scope: 'Specialized diploma pharmacy coursework instruction, student seminars, and examination duties.',
  },
]

const publications = [
  {
    sr: 1,
    title: 'Stability indicating HPLC method for estimation of Benzonatate in bulk and soft gelatin Capsule dosage form',
    journal: 'Indian Journal of Pharmaceutical Education and Research (IJPER) — Scopus Indexed',
    type: 'Scopus Indexed Research Article',
  },
  {
    sr: 2,
    title: 'Development and validation of Stability Indicating HPTLC method for Ceritinib in bulk and formulation',
    journal: 'Indian Drugs Journal — Peer Reviewed',
    type: 'Peer Reviewed Research Article',
  },
  {
    sr: 3,
    title: 'Development and Validation of UV Spectrophotometric method for Estimation of Benzonatate in bulk Soft gelatin Capsule dosage form',
    journal: 'Pharmaceutical Analytical Chemistry Series',
    type: 'Research Article',
  },
  {
    sr: 4,
    title: 'Comprehensive Review on various Analytical Methodologies for the Estimation for Lamivudine',
    journal: 'International Review of Pharmaceutical Analysis',
    type: 'Scopus Indexed Review Article',
  },
]

const researchProjects = [
  {
    sr: 1,
    title: 'Development and Validation of UV Spectrophotometric and Stability-Indicating HPLC method for Estimation of Benzonatate in Soft Gelatin Capsules',
    degree: 'M.Pharm Research Project (Guide: Dr. Santosh V. Gandhi, AISSMS Pune)',
    details:
      'Conducted forced degradation studies (acid, base, peroxide, thermal, photolytic) adhering strictly to ICH Q2(R1) guidelines, establishing linearity, precision, LOD/LOQ, and recovery parameters.',
  },
  {
    sr: 2,
    title: 'Stability-Indicating HPTLC Method Development and Validation of Ceritinib in Bulk and Formulation',
    degree: 'M.Pharm Research Project',
    details:
      'Developed high-performance thin-layer chromatographic densitometric assay using WinCATS software with validation of chromatographic resolution and degradation profiling.',
  },
  {
    sr: 3,
    title: 'Phytochemical Screening, HPTLC, and TLC Profile of Launaea pinnatifida Roots',
    degree: 'B.Pharm Undergraduate Project (SKB College of Pharmacy)',
    details:
      'Extracted active phytoconstituents, performed chemical characterization, and generated standardized chromatographic fingerprints.',
  },
]

const honours = [
  {
    title: 'AICTE GPAT 2020 Qualified',
    issuer: 'AICTE, New Delhi — National Fellowship for M.Pharm (Quality Assurance)',
  },
  {
    title: 'NIPER JEE 2020 Qualified',
    issuer: 'National Institute of Pharmaceutical Education and Research (NIPER)',
  },
  {
    title: 'JSW Foundation Scholarship 2022',
    issuer: 'JSW Foundation Merit Fellowship Award',
  },
  {
    title: 'Registered Copyright Filed: Combinatorial Chemistry',
    issuer: 'Copyright Office, Govt of India (Diary No: 14887/2023-CO/L)',
  },
  {
    title: 'APTI Life Member (MH/LM/3434)',
    issuer: 'Association of Pharmaceutical Teachers of India',
  },
]

const technicalSkills = [
  {
    category: 'Analytical Instruments',
    items: ['JASCO UV-Visible Spectrophotometer', 'HPLC Systems (Waters & Agilent)', 'CAMAG HPTLC System', 'Dissolution Test Apparatus', 'FTIR Spectrophotometer', 'Digital pH Meter'],
  },
  {
    category: 'Software Competencies',
    items: ['LabSolutions (FTIR Software)', 'Borwin (HPLC CDS Software)', 'WinCATS (HPTLC Densitometry)', 'Spectra Manager (JASCO UV)', 'MS Office (Word, Excel, PowerPoint)'],
  },
  {
    category: 'Certifications & Training',
    items: ['Drug Regulatory Affairs (ISO Certified, Global Academy Pune)', 'Good Clinical Practice (GCP, NIDA Clinical Trials Network)', 'Industrial Training at Murli Krishna Pharma Pvt. Ltd., Pune', 'Poster at MIPSCON-2022 & Delegate at IPC 2023'],
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'experience', label: 'Teaching Experience', icon: Briefcase },
  { id: 'publications', label: `Publications & Research (${publications.length})`, icon: BookOpen },
  { id: 'honours', label: 'Honours, GPAT & Copyright', icon: Award },
  { id: 'skills', label: 'Instruments & Software', icon: Microscope },
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

export default function FacultyDetailShivaniSawarkar() {
  useSeo({
    title: 'Prof. Shivani R. Sawarkar — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Shivani R. Sawarkar, Lecturer at TGPCOP Nagpur — M.Pharm (8.98 CGPA, AISSMS Pune), GPAT & NIPER Qualified, Scopus indexed publications, and HPTLC/HPLC method validation specialist.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutical Quality Assurance, Scopus publications, chromatography software, and GPAT credentials."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Shivani Sawarkar' },
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
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-800 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              SS
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  M.Pharm Distinction (8.98 CGPA)
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-primary-500" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AICTE GPAT 2020 & NIPER JEE 2020 Qualified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  Registered Copyright Filed (Diary: 14887/2023-CO/L)
                </span>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold border border-sky-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  LinkedIn Profile ↗
                </a>
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-primary-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Exemplary academic journey in Pharmacy from AISSMS Pune and SKB Nagpur.</p>
              </div>
              <Table
                headers={['#', 'Course / Examination', 'College / Institution', 'University / Board', 'Year', 'Percentage / CGPA']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score])}
              />
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Language Proficiency</h3>
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
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching & Academic Experience</h2>
              <p className="text-sm text-muted">Over 1 year 9 months of classroom and laboratory instruction across pharmacy colleges.</p>
            </div>

            <Table
              headers={['#', 'Post Held', 'Name of the Institute', 'Tenure / Duration', 'Academic Scope']}
              rows={experience.map((exp) => [exp.sr, exp.post, exp.institute, exp.duration, exp.scope])}
            />
          </div>
        )}

        {/* Tab 3: Publications & Research */}
        {activeTab === 'publications' && (
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">
                  Published Papers in Scopus Indexed & Peer-Reviewed Journals
                </h2>
                <p className="text-sm text-muted">Analytical method validation in IJPER and Indian Drugs.</p>
              </div>

              <div className="space-y-3">
                {publications.map((p) => (
                  <div
                    key={p.sr}
                    className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 shadow-sm hover:border-primary-300 transition-all"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-navy-950 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {p.sr}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                        {p.type}
                      </span>
                      <p className="text-sm font-semibold text-navy-900 leading-snug">
                        "{p.title}"
                      </p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {p.journal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Projects */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Academic Research Projects</h2>
                <p className="text-sm text-muted">Post-graduate dissertation under the guidance of Dr. Santosh V. Gandhi.</p>
              </div>

              <div className="space-y-4">
                {researchProjects.map((proj) => (
                  <div key={proj.sr} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold mb-2">
                      {proj.degree}
                    </span>
                    <h3 className="text-base font-heading font-bold text-navy-900 mb-2 leading-snug">
                      "{proj.title}"
                    </h3>
                    <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                      {proj.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Honours & Copyright */}
        {activeTab === 'honours' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">National Honours, Fellowships & Copyright</h2>
              <p className="text-sm text-muted">Competitive exam credentials and government copyright filings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {honours.map((item, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-primary-300 transition-all flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-navy-900 mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {item.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Instruments & Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Analytical Instruments & Specialized Software</h2>
              <p className="text-sm text-muted">Spectra Manager, WinCATS, Borwin, LabSolutions, and regulatory certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicalSkills.map((group, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    {group.category}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-navy-800">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
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
