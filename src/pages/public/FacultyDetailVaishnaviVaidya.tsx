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
  name: 'Prof. Vaishnavi G. Vaidya',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (85.2%), B.Pharm (75.15% Distinction)',
  languages: 'English, Hindi, Marathi',
  email: 'vaishnavivaidya196@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vaishnavi-vaidya-8843bb259',
  objective:
    'To emerge as a professionally skilled person and give my best to help my organization grow by taking responsibility for making students and employees value-adding assets through dedicated hard-work and continuous learning.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (M.Pharm)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2020–2022',
    score: '85.20 %',
    grade: 'Distinction / First Class',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2016–2020',
    score: '75.15 %',
    grade: 'Distinction / First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'A.R. Fule Junior College, Nagpur',
    board: 'Maharashtra State Board',
    year: '2015–2016',
    score: '58.31 %',
    grade: 'Higher Secondary',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Pracharya Arunrao Kalode Vidyalaya, Nagpur',
    board: 'Maharashtra State Board',
    year: '2013–2014',
    score: '72.60 %',
    grade: 'First Class',
  },
]

const projects = [
  {
    type: 'M.Pharm Research Project',
    title: 'Self Emulsifying Drug Delivery System (SEDDS) for Antihypertensive Herbal Drugs',
    scope:
      'Formulation, pseudo-ternary phase diagram optimization, thermodynamic stability, and bioavailability enhancement studies of poorly water-soluble herbal antihypertensive bioactives using self-emulsifying lipidic nanocarriers.',
  },
  {
    type: 'B.Pharm Research Project',
    title: 'Design, Synthesis and Characterization of Novel Azo Dye Derivative',
    scope:
      'Chemical synthesis, recrystallization, TLC reaction monitoring, and spectral characterization of 2-(4-(Z-phenylethenyl)aminophenyl)diazenyl-naphthalen-1-ol with biological evaluation.',
  },
]

const publications = [
  {
    sr: 1,
    title: 'Self-Emulsifying Drug Delivery System: A Systematic Review',
    journal: 'European Journal of Biomedical and Pharmaceutical Sciences (EJBPS)',
    year: '2022',
    type: 'International Review Article',
  },
]

const certifications = [
  {
    sr: 1,
    title: 'Certificate Course in Clinical Research and Pharmacovigilance',
    issuer: 'Omasy Research Institute',
    type: 'Clinical Certification',
  },
  {
    sr: 2,
    title: 'Certificate Course in Optimization & Quality by Design (QbD)',
    issuer: 'Advanced Pharmaceutical Development Series',
    type: 'QbD Certification',
  },
  {
    sr: 3,
    title: 'International Conference on Emerging Trends in Drug Discovery and Development (ICTD3 – 2022)',
    issuer: 'ICTD3 Scientific Forum',
    type: 'International Conference',
  },
  {
    sr: 4,
    title: 'One-Week National Workshop on Intellectual Property Rights (IPR)',
    issuer: 'National IPR Cell',
    type: 'National Workshop',
  },
  {
    sr: 5,
    title: 'Vidarbha Student Parliament Event',
    issuer: 'Youth Leadership & Legislative Forum',
    type: 'Student Parliament Participation',
  },
]

const internships = [
  {
    role: 'Formulation & Manufacturing Trainee',
    company: 'Siddhayu Pharmaceutical Pvt. Ltd., Nagpur',
    duration: '1 Month Industrial Internship',
    details:
      'Completed practical industrial training in the formulation department, solid dosage processing, herbal extraction monitoring, and Good Manufacturing Practice (GMP) compliance.',
  },
]

const instruments = [
  'HPLC (High Performance Liquid Chromatography)',
  'UV-Visible Spectrophotometer',
  'Dissolution Apparatus with Autosampler (USP Type I & II)',
  'Tablet Compression Machine (Rotary Press)',
  'Precision Electronic Analytical Balance',
  'Digital pH Meter & Calibration Standards',
  'Thermostatic Hot Air Oven & Desiccators',
]

const domains = [
  'Research and Development (R&D)',
  'Quality Assurance & Quality by Design (QbD)',
  'Regulatory Affairs & Compliance',
  'Clinical Research & Clinical Trials',
  'Pharmacovigilance & Drug Safety',
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'projects', label: 'Research & Publications', icon: FlaskConical },
  { id: 'certifications', label: 'Certifications & Training', icon: Award },
  { id: 'instruments', label: 'Instruments & Domains', icon: Microscope },
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

export default function FacultyDetailVaishnaviVaidya() {
  useSeo({
    title: 'Prof. Vaishnavi G. Vaidya — Faculty Profile | TGPCOP',
    description:
      'Detailed academic profile of Prof. Vaishnavi G. Vaidya, Assistant Professor at TGPCOP Nagpur — M.Pharm (85.2% Distinction, Kamla Nehru COP), B.Pharm (75.15%), SEDDS research, and Pharmacovigilance certifications.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic background in Pharmaceutics & SEDDS research, industrial formulation training, and clinical research certifications."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Vaishnavi G. Vaidya' },
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
          <div className="h-2.5 bg-gradient-to-r from-sky-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-sky-800 to-primary-600 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              VV
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
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  M.Pharm Distinction (85.2%)
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
                  Published Review in European Journal of Biomedical Sciences
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Certified in Clinical Research & Pharmacovigilance
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-sky-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Academic record with consistent first-class distinction in B.Pharm & M.Pharm.</p>
              </div>
              <Table
                headers={['#', 'Course / Qualification', 'Institution / College', 'Board / University', 'Duration', 'Percentage', 'Grade']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score, e.grade])}
              />
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Key Strengths & Languages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Languages Known</span>
                  <strong className="text-navy-900">{profile.languages}</strong>
                </div>
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Key Strengths</span>
                  <strong className="text-navy-900">Quick learner, Problem-solving, Positive attitude</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Projects & Publications */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Academic Research Dissertations</h2>
                <p className="text-sm text-muted">Novel lipid-based drug delivery systems (SEDDS) and synthetic chemical design.</p>
              </div>

              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-white border-2 border-sky-100 rounded-2xl p-6 shadow-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-semibold mb-3">
                      {proj.type}
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-2 leading-snug">
                      "{proj.title}"
                    </h3>
                    <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                      {proj.scope}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Publications</h2>
                <p className="text-sm text-muted">Peer-reviewed international research publications.</p>
              </div>

              <div className="space-y-3">
                {publications.map((p) => (
                  <div
                    key={p.sr}
                    className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 shadow-sm hover:border-sky-300 transition-all"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-navy-950 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {p.sr}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 mb-1">
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
          </div>
        )}

        {/* Tab 3: Certifications & Training */}
        {activeTab === 'certifications' && (
          <div className="space-y-8">
            {/* Industrial Internship */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Industrial Training & Experience</h2>
                <p className="text-sm text-muted">Hands-on pharmaceutical formulation manufacturing experience.</p>
              </div>
              {internships.map((intern, i) => (
                <div key={i} className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                      {intern.role}
                    </span>
                    <span className="text-xs text-muted font-bold">{intern.duration}</span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-navy-900 mb-2">
                    {intern.company}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {intern.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Certifications List */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Specialized Certifications & Participations</h2>
                <p className="text-sm text-muted">Professional courses in Clinical Research, Pharmacovigilance, and Quality by Design (QbD).</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-sky-300 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        {cert.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-muted">#{cert.sr}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1 leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted">
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Instruments & Domains */}
        {activeTab === 'instruments' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Technical Abilities & Domain Expertise</h2>
              <p className="text-sm text-muted">Instrument handling, analytical laboratory tools, and focus areas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instruments */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-sky-600" />
                  Instruments Handled
                </h3>
                <ul className="space-y-2.5 text-sm text-navy-800">
                  {instruments.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas of Interest */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary-600" />
                  Areas of Interest
                </h3>
                <ul className="space-y-2.5 text-sm text-navy-800">
                  {domains.map((dom, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                      <span>{dom}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-border text-xs text-muted">
                  <strong>Computer Proficiency:</strong> MS Word, Excel, PowerPoint, and scientific data analysis.
                </div>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
