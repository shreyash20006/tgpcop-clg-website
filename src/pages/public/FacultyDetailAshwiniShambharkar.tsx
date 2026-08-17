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
  Building2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Ashwini Sudhakar Shambharkar',
  designation: 'Lecturer',
  qualificationLine: 'M.Pharm (Pharmacology - UDPS Nagpur), GPAT Qualified (AICTE Fellow), B.Pharm',
  specialization: 'Pharmacology, Clinical Data Management & Neurobiology',
  languages: 'English, Marathi, Hindi',
  email: 'ashwinishambharkar123@gmail.com',
  objective:
    'To continuously enhance my knowledge, skills and experience by getting involved in a challenging work environment and utilize them for personal and organizational growth to the best of my ability.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm - Pharmacology)',
    college: 'Department of Pharmaceutical Sciences (UDPS), Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2014–2016',
    score: '68.80 %',
    grade: 'First Class',
  },
  {
    sr: 2,
    course: 'GPAT (Graduate Pharmacy Aptitude Test)',
    college: 'Awarded AICTE PG Scholarship (₹2.4 Lakh)',
    board: 'AICTE New Delhi',
    year: '2014',
    score: 'Qualified',
    grade: 'National Fellowship',
  },
  {
    sr: 3,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Institute of Pharmaceutical Education and Research (IPER), Wardha',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2009–2013',
    score: '58.04 %',
    grade: 'Higher Division',
  },
  {
    sr: 4,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'State Science Stream',
    board: 'Maharashtra State Board',
    year: '2009',
    score: '61.50 %',
    grade: 'First Class',
  },
  {
    sr: 5,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Central Board of Secondary Education',
    board: 'CBSE',
    year: '2007',
    score: '72.60 %',
    grade: 'First Class',
  },
]

const experience = [
  {
    sr: 1,
    role: 'Clinical Scientific Expert',
    organization: 'Novartis Healthcare Pvt. Ltd.',
    duration: '1 Year Industrial Clinical Experience',
    type: 'Global Clinical Operations',
    responsibilities: [
      'Hands-on expertise in clinical data review tools: OCRDC (Oracle Clinical Remote Data Capture), CREDI, ROD, and J Review (WBT).',
      'Advanced OC/RDC Data Review, query generation, resolution of data clarifications, and discrepancy management.',
      'Designed and executed edit check specifications, understood clinical database structures and Data Management Plans (DMP).',
      'Tracked progress of multi-centric clinical studies, ensuring protocols adhered strictly to ICH-GCP timelines and regulatory standards.',
      'Core Project: "Rainbow Extension Study" — Multi-center international clinical trial evaluating long-term efficacy and safety of Ranibizumab compared with laser therapy for premature infants with Retinopathy of Prematurity (ROP).',
    ],
  },
  {
    sr: 2,
    role: 'Assistant Professor in Pharmacy',
    organization: 'Agnihotri Institute of Pharmacy, Wardha',
    duration: '1 Year Academic Teaching Experience',
    type: 'Academic Faculty',
    responsibilities: [
      'Delivered lectures in Pharmacology, Human Anatomy & Physiology, and Pathophysiology for B.Pharm and D.Pharm students.',
      'Conducted laboratory practicals in experimental pharmacology, animal handling demonstrations, and physiological bio-assays.',
      'Guided student seminars, project work, and examination paper evaluation.',
    ],
  },
]

const thesis = {
  title: 'Studies on the role of cocaine- and amphetamine-regulated transcript peptide (CART) in attention deficit hyperactivity disorder (ADHD) in mice',
  supervisor: 'Dr. D. M. Kokare (Professor & Renowned Neuropharmacologist, UDPS RTMNU)',
  degree: 'M.Pharm Pharmacology Dissertation',
  description:
    'Explored neurochemical mechanisms of CART neuropeptide in the brain, evaluating locomotor hyperactivity, impulsivity, and cognitive deficits in murine ADHD models via stereotaxic cannula microinjections.',
}

const preclinicalSkills = [
  {
    category: 'Surgical & In-Vivo Techniques',
    skills: [
      'Stereotaxic cannulation for site-specific intra-hippocampal and intracerebroventricular (ICV) drug microinjections.',
      'Brain sectioning, tissue preservation, and immuno-histological staining (IHC / ICC).',
      'Blood sampling techniques: tail vein puncture, retro-orbital sinus bleeding, and cardiac puncture.',
      'Systemic drug delivery routes: Oral (gavage), ICV, Intraperitoneal (IP), Subcutaneous (SC), Intramuscular (IM), and Intravenous (IV).',
    ],
  },
  {
    category: 'Behavioral Pharmacology Animal Models',
    skills: [
      'T-Maze & Y-Maze (Spatial working memory and alternation behavior)',
      'Morris Water Maze (Spatial learning and reference memory)',
      'Elevated Plus Maze (EPM) & Open Field Test (OFT) for anxiety profiling',
      'Novel Object Recognition Task (NORT) for recognition memory',
      'Social Interaction Test and Beam Walk Test for motor coordination',
    ],
  },
]

const computerSkills = [
  'GraphPad Prism (Pharmacological curve fitting, ANOVA, t-tests, statistical plots)',
  'Morphometry & Optical Image Analysis in Immunocytochemical (ICC) studies',
  'Oracle Clinical Remote Data Capture (OCRDC) & J Review',
  'Adobe Photoshop & CorelDraw for scientific illustrations',
  'MS-CIT, Tally, and Government Typing Certifications in English, Hindi, and Marathi (Grade A)',
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'experience', label: 'Novartis & Teaching Experience', icon: Briefcase },
  { id: 'preclinical', label: 'Preclinical Research & Skills', icon: Microscope },
  { id: 'thesis', label: 'ADHD Dissertation', icon: FlaskConical },
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

export default function FacultyDetailAshwiniShambharkar() {
  useSeo({
    title: 'Prof. Ashwini Sudhakar Shambharkar — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Ashwini Sudhakar Shambharkar (Zadode), Lecturer at TGPCOP Nagpur — M.Pharm Pharmacology (UDPS Nagpur), Novartis Clinical Scientific Expert, AICTE GPAT Fellow, and Neuropharmacology specialist.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Neuropharmacology, Novartis clinical operations, in-vivo surgical models, and academic teaching."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Ashwini Shambharkar' },
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
          <div className="h-2.5 bg-gradient-to-r from-orange-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-orange-800 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              AS
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
                <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-semibold border border-orange-200">
                  Ex-Novartis Clinical Expert
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-orange-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-orange-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-orange-600" />
                  AICTE GPAT Fellow (₹2.4 Lakh Scholarship)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Building2 className="w-3.5 h-3.5 text-primary-600" />
                  Novartis Clinical Research Experience
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Microscope className="w-3.5 h-3.5 text-indigo-600" />
                  Stereotaxic Brain Cannulation & Behavioral Models
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-orange-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Post-graduation from the prestigious Department of Pharmaceutical Sciences, Nagpur.</p>
              </div>
              <Table
                headers={['#', 'Examination / Degree', 'Institute / College', 'University / Board', 'Year', 'Percentage / Status']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score])}
              />
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Languages & Areas of Interest</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Languages Known</span>
                  <strong className="text-navy-900">{profile.languages}</strong>
                </div>
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Areas of Interest</span>
                  <strong className="text-navy-900">Teaching, Clinical Trials, Pharmacovigilance</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Professional Industrial & Academic Experience</h2>
              <p className="text-sm text-muted">Corporate clinical research at Novartis Healthcare and academic pharmacy lecturing.</p>
            </div>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-orange-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold border border-orange-200">
                      {exp.role}
                    </span>
                    <span className="text-xs text-muted font-semibold">{exp.duration}</span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-navy-900 mb-1">
                    {exp.organization}
                  </h3>
                  <p className="text-xs text-primary-700 font-semibold mb-4">{exp.type}</p>

                  <ul className="space-y-2.5 text-sm text-navy-800">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Preclinical Skills */}
        {activeTab === 'preclinical' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Preclinical Pharmacology & Surgical Competencies</h2>
              <p className="text-sm text-muted">Specialized animal surgery, cannulation, and behavioral neuro-screening models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preclinicalSkills.map((sec, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-orange-600" />
                    {sec.category}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-navy-800">
                    {sec.skills.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Software & Statistical Analysis Tools
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-navy-900">
                {computerSkills.map((tool, idx) => (
                  <div key={idx} className="p-3 bg-light-bg rounded-xl border border-border/70 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Thesis */}
        {activeTab === 'thesis' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Neuropharmacology Thesis & ADHD Research</h2>
              <p className="text-sm text-muted">M.Pharm dissertation supervised by Dr. D. M. Kokare.</p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-semibold">
                  {thesis.degree}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                "{thesis.title}"
              </h3>
              <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100 text-xs font-semibold text-orange-950 mb-4">
                <strong>Research Supervisor:</strong> {thesis.supervisor}
              </div>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {thesis.description}
              </p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Scientific Events & Workshops</h3>
              <ul className="space-y-2 text-sm text-navy-800">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Volunteer at 2nd International Congress of Society for Ethnopharmacology (SFEC-2015), Department of Pharmaceutical Sciences, RTMNU.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span>Attended National Seminar on "Regulatory Affairs in Pharmaceutical Industry", UDPS RTMNU, Nagpur.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
