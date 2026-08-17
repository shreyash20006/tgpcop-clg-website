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
  ShieldCheck,
  Microscope,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Mrs. Neha Rumale',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmacology), B.Pharm, D.Pharm',
  specialization: 'Pharmacology',
  experienceYears: '2.5+ Years',
  email: 'madankarneha@gmail.com',
}

const qualifications = [
  {
    sr: 1,
    course: 'D.Pharm',
    board: 'MSBTE Mumbai',
    year: '2004–2006',
    score: '65 %',
    division: 'First Division',
  },
  {
    sr: 2,
    course: 'B.Pharm',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2006–2010',
    score: '66 %',
    division: 'First Division',
  },
  {
    sr: 3,
    course: 'M.Pharm (Pharmacology)',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2010–2012',
    score: '63 %',
    division: 'First Division',
  },
]

const dissertation = {
  degree: 'M.Pharm (Pharmacology)',
  title: 'Role of Cannabinoid system in nicotine analgesia, tolerance to analgesia and withdrawal algesia',
  description:
    'Investigated neuro-pharmacological pathways involving cannabinoid receptor interactions with nicotine-induced antinociception, development of analgesic tolerance, and withdrawal-induced hyperalgesia.',
}

const experience = [
  {
    sr: 1,
    post: 'IPQA Officer (In-Process Quality Assurance)',
    institute: 'Milan Laboratory, Navi Mumbai',
    from: 'Dec 2014',
    to: 'June 2015',
    duties: [
      'In-process Quality Assurance of tablet manufacturing, dispensing, and sampling of raw materials & packaging materials.',
      'Issuance and auditing of Batch Manufacturing Records (BMR), Batch Packaging Records (BPR), Process Validation Protocols (PVP), and Validation Reports (PVR).',
      'Control sample management, review, and QA regulatory compliance.',
    ],
  },
  {
    sr: 2,
    post: 'Quality Control (QC) Officer',
    institute: 'Oswal Pharmaceutical, Pune',
    from: 'June 2013',
    to: 'Dec 2013',
    duties: [
      'Timely chemical and physicochemical analyses of raw materials, in-process chemicals, and finished pharmaceutical products.',
      'Comprehensive sampling of raw materials and in-process production batches.',
      'Carried out routine chemical testing, standardizations, and assay verifications.',
      'Maintained QA/QC documentation, temperature logs, cleaning validations, and production sampling records.',
    ],
  },
  {
    sr: 3,
    post: 'Clinical Research Coordinator (CRC)',
    institute: 'Parakh Dermatology Center, Pune',
    from: 'Dec 2012',
    to: 'Dec 2013',
    duties: [
      'Conducted clinical trials on Atopic Dermatitis in strict accordance with Good Clinical Practice (GCP) guidelines.',
      'Maintained Site Master Files (SMF), investigator brochures, and regulatory binders.',
      'Managed clinical trial schedules for patient recruitment, scheduled visits, and protocol-specific follow-ups.',
      'Accountable for Investigational Product (IP) accountability, temperature-controlled storage, and documentation.',
    ],
  },
]

const conferences = [
  {
    sr: 1,
    event: 'IPSCON 2011 — Annual Conference of Indian Pharmacological Society',
    place: 'Manipal University, Manipal',
    year: '2011',
    presentation:
      'Poster Presentation: "Role of Cannabinoid system in nicotine analgesia, tolerance to analgesia and withdrawal algesia"',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'qualifications', label: 'Academic Qualifications', icon: GraduationCap },
  { id: 'research', label: 'Pharmacology Research', icon: FlaskConical },
  { id: 'experience', label: 'Industry & Clinical Experience', icon: Briefcase },
  { id: 'conferences', label: 'Conferences & Poster', icon: Award },
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

export default function FacultyDetailNehaRumale() {
  useSeo({
    title: 'Mrs. Neha Rumale — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Mrs. Neha Rumale, Assistant Professor in Pharmacology at TGPCOP Nagpur — M.Pharm in Pharmacology, IPQA/QC industry experience, and clinical research background.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('qualifications')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic background in Pharmacology, industry Quality Assurance experience, and clinical trial coordination."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Mrs. Neha Rumale' },
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
          <div className="h-2.5 bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-rose-900 to-purple-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              NR
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
                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                  Pharmacology Specialization
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
                <div className="flex items-center gap-2 text-navy-800 font-medium">
                  <Briefcase className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Experience: {profile.experienceYears}</span>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  M.Pharm First Division (Pharmacology)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Industrial IPQA & QC Expertise
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                  GCP Clinical Research Experience (CRC)
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

        {/* Tab 1: Qualifications */}
        {activeTab === 'qualifications' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications</h2>
              <p className="text-sm text-muted">Complete pharmaceutical education from MSBTE and RTM Nagpur University.</p>
            </div>
            <Table
              headers={['#', 'Course / Degree', 'Board / University', 'Year of Passing', 'Percentage (%)', 'Division']}
              rows={qualifications.map((q) => [q.sr, q.course, q.board, q.year, q.score, q.division])}
            />
          </div>
        )}

        {/* Tab 2: Research */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">M.Pharm Pharmacology Dissertation</h2>
              <p className="text-sm text-muted">Post-graduate neuropharmacology and analgesia research work.</p>
            </div>
            <div className="bg-white border-2 border-rose-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold">
                  {dissertation.degree}
                </span>
                <span className="text-xs text-muted font-medium">Neuropharmacology</span>
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

        {/* Tab 3: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Industrial Quality & Clinical Experience</h2>
              <p className="text-sm text-muted">Practical industry background in Pharmaceutical Quality Assurance, QC testing, and Clinical Trials.</p>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-rose-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                      {exp.post}
                    </span>
                    <span className="text-xs text-muted font-semibold">
                      {exp.from} – {exp.to}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-navy-900 mb-3">
                    {exp.institute}
                  </h3>

                  <ul className="space-y-2 text-sm text-navy-800">
                    {exp.duties.map((duty, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Conferences & Poster */}
        {activeTab === 'conferences' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Conferences & Poster Presentations</h2>
              <p className="text-sm text-muted">Scientific conference attendance and presentation of pharmacological findings.</p>
            </div>

            {conferences.map((conf) => (
              <div key={conf.sr} className="bg-white border-2 border-rose-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold">
                    Conference Presentation
                  </span>
                  <span className="text-xs text-muted font-bold">{conf.year}</span>
                </div>
                <h3 className="text-base font-heading font-bold text-navy-900 mb-1">
                  {conf.event}
                </h3>
                <p className="text-xs text-muted mb-3">{conf.place}</p>
                <div className="p-4 bg-light-bg rounded-xl border border-border/70 text-sm font-medium text-navy-900">
                  {conf.presentation}
                </div>
              </div>
            ))}
          </div>
        )}

      </PageContainer>
    </>
  )
}
