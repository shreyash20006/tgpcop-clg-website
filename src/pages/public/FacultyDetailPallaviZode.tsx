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
  ShieldCheck,
  FileCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Pallavi Shankarrao Zode',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Quality Assurance - 8.69 CGPA), B.Pharm (7.71 CGPA)',
  specialization: 'Pharmaceutical Quality Assurance, Liposomal Drug Delivery & AI in Pharma',
  languages: 'Hindi, Marathi, English',
  email: 'pallavizode31@gmail.com',
  objective:
    'A creative and self-motivated individual able to use my interpersonal skills and knowledge for organization and personal growth as well as grow professionally.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (Quality Assurance)',
    college: 'Institute of Pharmaceutical Education and Research (IPER), Borgaon, Wardha',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2021–2023',
    score: '8.69 CGPA',
    grade: 'First Class with Distinction',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2017–2021',
    score: '7.71 CGPA',
    grade: 'First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Balaji Junior College, Butibori, Nagpur',
    board: 'Maharashtra State Board',
    year: '2016',
    score: '57.38 %',
    grade: 'Higher Secondary',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Balaji Convent, Butibori, Nagpur',
    board: 'Maharashtra State Board',
    year: '2014',
    score: '74.65 %',
    grade: 'First Class',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Assistant Professor',
    institute: 'Nagpur College of Pharmacy, Hingna, Wanadongri, Nagpur',
    duration: '7 Months Academic Faculty Experience',
    scope: 'Conducted undergraduate theory courses in Quality Assurance and Pharmaceutical Analysis, managed student mentoring and examination duties.',
  },
  {
    sr: 2,
    post: 'Assistant Professor',
    institute: 'School of Pharmacy, G.H. Raisoni University, Amravati',
    duration: '10 Months Academic Faculty Experience',
    scope: 'Delivered lectures in Quality Assurance, managed departmental laboratory setups, and supervised undergraduate student projects.',
  },
  {
    sr: 3,
    post: 'Quality Assurance Trainee',
    institute: 'Snehal Pharma and Surgical Pvt. Ltd., Butibori, Nagpur',
    duration: '3 Months Industrial QA Training',
    scope: 'Practical industrial QA operations, documentation control, batch manufacturing record (BMR) verification, and in-process quality testing.',
  },
]

const patentAndCopyrights = [
  {
    type: 'Patent Granted / Published',
    title: 'Polymeric Micelle Formulation for Co-Delivery of Chemotherapeutic Agents in Cancer Treatment',
    category: 'Nanotechnology & Oncology Drug Delivery',
  },
  {
    type: 'Registered Copyright',
    title: 'National Accreditation Board For Testing and Calibration Laboratories (NABL) QA Framework',
    category: 'Quality Systems & Accreditation',
  },
  {
    type: 'Registered Copyright',
    title: 'Intrauterine Drug Delivery System',
    category: 'Novel Drug Delivery Systems (NDDS)',
  },
  {
    type: 'Registered Copyright',
    title: 'Exploring Liposomes: An Innovative Approach to Drug Delivery System',
    category: 'Nanomedicine & Liposomal Technology',
  },
]

const publications = [
  {
    sr: 1,
    title: 'Domination of AI and Machine Learning in Pharmaceutical Biotechnology and Pharmacogenomics',
    journal: 'International Education and Research Journal (IERJ)',
    year: '2025',
    type: 'Research Article (AI in Pharma)',
  },
  {
    sr: 2,
    title: 'Review of Medicinal Plants Used to Treat Tuberculosis',
    journal: 'Research Journal of Pharmacognosy and Phytochemistry',
    year: '2025',
    type: 'Phytochemistry Review Article',
  },
]

const presentations = [
  {
    sr: 1,
    event: '21st International Symposium on Advances in Technology and Business Potential of New Drug Delivery Systems, NMIMS Mumbai',
    type: 'Poster Presentation',
    topic: 'Development and Estimation of Liposomes for the Treatment of Cervical Cancer',
  },
  {
    sr: 2,
    event: 'International Conference on Multidisciplinary Approach and Current Challenges for Sustainability (MACCS-2024), G.H. Raisoni University, Amravati',
    type: 'Oral Presentation',
    topic: 'Stability Indicating HPTLC Method for Determination of Deferasirox in Bulk and Tablet Dosage Form',
  },
  {
    sr: 3,
    event: 'National Conference on Advancing Healthcare Through Collaboration and Innovation, Nagpur College of Pharmacy, Nagpur',
    type: 'National Conference Delegate',
    topic: 'Healthcare Innovation & Quality Control',
  },
]

const certifications = [
  'Certificate Course in UV-Visible Spectroscopy (IPER Wardha)',
  'Certificate Course in Fourier Transform Infrared Spectroscopy - FTIR (IPER Wardha)',
  'APTI Life Member (Association of Pharmaceutical Teachers of India)',
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'experience', label: 'Teaching & QA Experience', icon: Briefcase },
  { id: 'patent', label: 'Patent & Copyrights (4)', icon: FileCheck },
  { id: 'publications', label: 'Publications & Presentations', icon: BookOpen },
  { id: 'skills', label: 'Certifications & Skills', icon: Award },
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

export default function FacultyDetailPallaviZode() {
  useSeo({
    title: 'Prof. Pallavi Shankarrao Zode — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Pallavi Shankarrao Zode, Assistant Professor at TGPCOP Nagpur — M.Pharm (8.69 CGPA Distinction, IPER Wardha), Cancer co-delivery patent holder, 3 registered copyrights, and AI in pharma researcher.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutical Quality Assurance, cancer drug delivery patent, registered copyrights, and AI in pharmacogenomics research."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Pallavi Zode' },
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
          <div className="h-2.5 bg-gradient-to-r from-rose-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-rose-800 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              PZ
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
                  Cancer Co-Delivery Patent Holder
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-rose-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Patent on Polymeric Micelle Co-Delivery in Cancer
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <FileCheck className="w-3.5 h-3.5 text-primary-600" />
                  3 Registered Copyrights (NABL, Intrauterine & Liposomes)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  M.Pharm Distinction (8.69 CGPA, IPER Wardha)
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-rose-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Post-graduation in Quality Assurance from IPER Wardha with 8.69 CGPA distinction.</p>
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
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching & Industrial Experience</h2>
              <p className="text-sm text-muted">Academic lecturing across pharmacy colleges and industrial QA training.</p>
            </div>

            <Table
              headers={['#', 'Designation / Role', 'College / Industry Name', 'Period / Duration', 'Key Scope & Responsibilities']}
              rows={experience.map((exp) => [exp.sr, exp.post, exp.institute, exp.duration, exp.scope])}
            />
          </div>
        )}

        {/* Tab 3: Patent & Copyrights */}
        {activeTab === 'patent' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Intellectual Property: Patents & Copyrights</h2>
              <p className="text-sm text-muted">Published cancer drug delivery patent and 3 registered copyright works.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {patentAndCopyrights.map((item, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-2xl p-6 shadow-sm ${
                    item.type.includes('Patent')
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-border hover:border-primary-300'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.type.includes('Patent')
                          ? 'bg-rose-600 text-white'
                          : 'bg-primary-50 text-primary-800 border border-primary-200'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs font-medium text-muted">{item.category}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2 leading-snug">
                    "{item.title}"
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Publications & Presentations */}
        {activeTab === 'publications' && (
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Published Research Papers</h2>
                <p className="text-sm text-muted">AI in pharmacogenomics and tuberculosis phytochemistry.</p>
              </div>

              <div className="space-y-3">
                {publications.map((p) => (
                  <div
                    key={p.sr}
                    className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 shadow-sm hover:border-rose-300 transition-all"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-navy-950 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {p.sr}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 mb-1">
                        {p.type}
                      </span>
                      <p className="text-sm font-semibold text-navy-900 leading-snug">
                        "{p.title}"
                      </p>
                      <p className="text-xs text-primary-600 font-medium mt-1">
                        {p.journal} • {p.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Conference Oral & Poster Presentations</h2>
                <p className="text-sm text-muted">Symposiums and international conference proceedings.</p>
              </div>

              <div className="space-y-3">
                {presentations.map((pres) => (
                  <div key={pres.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-950 text-white">
                        {pres.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-muted">#{pres.sr}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                      "{pres.topic}"
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {pres.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Certifications & Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Certifications, Memberships & Interpersonal Skills</h2>
              <p className="text-sm text-muted">Analytical spectroscopy credentials and professional memberships.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Award className="w-4 h-4 text-rose-600" />
                  Certifications & Memberships
                </h3>
                <ul className="space-y-3 text-sm text-navy-800">
                  {certifications.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  Core Strengths
                </h3>
                <ul className="space-y-3 text-sm text-navy-800">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Creative problem-solving and self-motivated research approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Attention to detail in analytical and HPTLC method execution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Active listening, academic teamwork, and classroom mentoring</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
