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
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Akhil Gajananrao Mondhe',
  designation: 'Lecturer',
  qualificationLine: 'M.Pharm, GPAT Qualified (AIR 2148), B.Pharm',
  specialization: 'Analytical Method Development & Validation (AR&D / QC)',
  experienceSummary: '5+ Years in AR&D & QC (Hetero Labs & Inventys Research)',
  languages: 'English, Hindi, Marathi',
  email: 'akhilmonde111@gmail.com',
  objective:
    'Looking forward to obtaining a challenging position in Analytical method development and validation, where I can strengthen the skills that I have and learn new skills to advance my career.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm)',
    board: 'Sant Gadge Baba Amravati University (SGBAU)',
    year: '2018',
    score: '6.71 CGPA',
    grade: 'Post-Graduation',
  },
  {
    sr: 2,
    course: 'GPAT (Graduate Pharmacy Aptitude Test)',
    board: 'AICTE, New Delhi',
    year: '2016',
    score: 'Score: 115',
    grade: 'AIR: 2148 (Qualified)',
  },
  {
    sr: 3,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2015',
    score: '61.16 %',
    grade: 'First Class',
  },
  {
    sr: 4,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2011',
    score: '57.17 %',
    grade: 'Higher Secondary',
  },
  {
    sr: 5,
    course: 'Secondary School Certificate (SSC - 10th)',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2009',
    score: '54.61 %',
    grade: 'Secondary School',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Research Associate-II',
    company: 'Hetero Pharmaceuticals Ltd., Hyderabad',
    duration: 'July 2022 – Present',
    scope:
      'Core Analytical Research Development (AR&D) and Analytical Method Validation (AMV) for formulations and Active Pharmaceutical Ingredients (APIs) using advanced Waters and Agilent HPLC/GC systems with Empower 3.',
  },
  {
    sr: 2,
    post: 'Quality Control Chemist',
    company: 'Inventys Research Company Pvt. Ltd., Nagpur',
    duration: 'September 2018 – July 2022',
    scope:
      'Finished product assays, related substances testing, residual solvent analyses, Karl Fischer moisture determinations, and routine analytical instrument calibration.',
  },
]

const project = {
  title:
    'Development and validation of stability indicating assay method of simultaneous estimation of anti-tubercular drug in bulk drug and marketed formulation',
  specialization: 'M.Pharm Research Project — Stability Indicating Analytical Methods',
  description:
    'Rigorously established and validated forced-degradation stability-indicating RP-HPLC assay protocols to simultaneously quantify anti-tubercular active therapeutics in both bulk active pharmaceutical ingredient form and finished tablet formulations adhering to ICH Q2(R1) guidelines.',
}

const instruments = [
  {
    category: 'HPLC Chromatography Systems',
    models: 'Waters ARC, Waters Alliance (UV, PDA, FLR detectors) & Agilent Technologies Infinity 1260',
    software: 'Waters Empower 3 Chromatography Data Software (CDS)',
  },
  {
    category: 'Gas Chromatography (GC)',
    models: 'Agilent Technologies 7020A GC System',
    software: 'Empower 3 Software (Residual Solvents Analysis)',
  },
  {
    category: 'FTIR Spectrophotometer',
    models: 'Agilent Technologies Cary 630 FTIR Spectrometer',
    software: 'MicroLab PC Software',
  },
  {
    category: 'UV-Visible Spectrophotometer',
    models: 'Thermo Scientific Evolution 201 UV-Vis Spectrophotometer',
    software: 'VISIONpro Spectral Software',
  },
  {
    category: 'Moisture Titrator & Balances',
    models: 'LABINDIA Karl Fischer (KF) Auto-Titrator & Micro Weighing Balances',
    software: 'Calibrated per Master Calibration Schedules',
  },
]

const responsibilities = [
  'Analytical Method Development (AMD) for Formulations and Active Pharmaceutical Ingredients (APIs) on HPLC.',
  'Analytical Method Validation (AMV) execution: Specificity, Linearity, Precision, Accuracy, Ruggedness & Robustness.',
  'Specialized support for Related Substances (RS), Assay, Dissolution Profiles, Blend Uniformity, Blend Assay, and Content Uniformity.',
  'Residual Solvents analysis using Gas Chromatography (GC).',
  'Periodic calibration of HPLC, GC, Karl Fischer titrators, UV-Vis, FTIR spectrometers, and analytical balances conforming to master calibration schedules.',
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'experience', label: 'Industry AR&D Experience', icon: Briefcase },
  { id: 'instruments', label: 'Instruments & Software', icon: Microscope },
  { id: 'project', label: 'Research & Technical Skills', icon: FlaskConical },
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

export default function FacultyDetailAkhilMondhe() {
  useSeo({
    title: 'Prof. Akhil Gajananrao Mondhe — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Akhil Gajananrao Mondhe, Lecturer at TGPCOP Nagpur — 5+ years industrial AR&D/QC experience at Hetero Pharmaceuticals, GPAT Qualified (AIR 2148), M.Pharm, HPLC/GC Empower 3 specialist.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed industrial experience in Analytical Research & Development (AR&D), method validation, chromatography, and academic qualifications."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Akhil G. Mondhe' },
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
          <div className="h-2.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              AM
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  GPAT Qualified (AIR 2148)
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-blue-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  5+ Years Pharma Industry Experience (Hetero Labs & Inventys)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                  HPLC, GC & FTIR Method Validation Specialist (Empower 3)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AICTE GPAT 2016 Qualified
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-blue-600' : 'text-muted'}`} />
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
                <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications & National Exam</h2>
                <p className="text-sm text-muted">Degrees and GPAT qualification credentials.</p>
              </div>
              <Table
                headers={['#', 'Qualification / Exam', 'Board / University', 'Year of Passing', 'Score / CGPA', 'Result / Status']}
                rows={education.map((e) => [e.sr, e.course, e.board, e.year, e.score, e.grade])}
              />
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Languages & Interests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Languages Known</span>
                  <strong className="text-navy-900">{profile.languages}</strong>
                </div>
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Personal Interests</span>
                  <strong className="text-navy-900">Cricket, Drawing, Music</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Pharmaceutical Industry Experience (5+ Years)</h2>
              <p className="text-sm text-muted">Method development, testing, and quality control at leading pharma manufacturing facilities.</p>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                      {exp.post}
                    </span>
                    <span className="text-xs text-muted font-semibold">{exp.duration}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {exp.scope}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Key Technical Responsibilities
              </h3>
              <ul className="space-y-2.5 text-sm text-navy-800">
                {responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Instruments */}
        {activeTab === 'instruments' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Sophisticated Analytical Instruments & Software</h2>
              <p className="text-sm text-muted">Extensive operation and calibration expertise across chromatography and spectroscopy systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {instruments.map((inst, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
                  <div>
                    <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200 inline-block mb-3">
                      {inst.category}
                    </span>
                    <h3 className="text-base font-heading font-bold text-navy-900 mb-2 leading-snug">
                      {inst.models}
                    </h3>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/70 text-xs text-primary-700 font-medium">
                    <strong>Software / Environment:</strong> {inst.software}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Project & Research */}
        {activeTab === 'project' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Post-Graduation Research Project</h2>
              <p className="text-sm text-muted">Stability-indicating assay method development and validation.</p>
            </div>

            <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                  M.Pharm Dissertation
                </span>
                <span className="text-xs text-muted font-medium">{project.specialization}</span>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                "{project.title}"
              </h3>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {project.description}
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Core Technical Competencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-navy-900">
                {[
                  'Method Development (HPLC / GC)',
                  'Method Validation (ICH Q2R1)',
                  'Forced Degradation Studies',
                  'Assay & Related Substances',
                  'Dissolution & Blend Uniformity',
                  'Calibration & GMP Compliance',
                ].map((skill) => (
                  <div key={skill} className="p-3 bg-light-bg rounded-xl border border-border/70 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
