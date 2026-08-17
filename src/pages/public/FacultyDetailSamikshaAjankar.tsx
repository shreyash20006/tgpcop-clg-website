import { useState } from 'react'
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  FlaskConical,
  CalendarDays,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Microscope,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Samiksha Narendra Ajankar',
  designation: 'Lecturer',
  qualificationLine: 'M.Pharm (Quality Assurance - 8.05 CGPA), B.Pharm (7.68 CGPA)',
  email: 'sajankar2@gmail.com',
  linkedin: 'https://www.linkedin.com/in/samiksha-ajankar031a3619b',
  objective:
    'As a recent post-graduate, seeking a responsible and challenging opportunity that will utilize and enhance my skills, where I can actively devote my abilities through dedicated hard work.',
}

const education = [
  {
    sr: 1,
    course: 'M.Pharm (Quality Assurance)',
    college: 'Vidyabharti College of Pharmacy, Amravati',
    board: 'Sant Gadge Baba Amravati University (SGBAU)',
    year: '2021–2023',
    score: '8.05 CGPA',
    grade: 'Distinction / First Class',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Hi-Tech College of Pharmacy, Chandrapur / Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2017–2021',
    score: '7.68 CGPA',
    grade: 'First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Mahatma Gandhi Junior College, Nagpur',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2017',
    score: '60.77 %',
    grade: 'First Class',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Paranjape High School, Nagpur',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2015',
    score: '87.00 %',
    grade: 'Distinction',
  },
]

const projects = [
  {
    sr: 1,
    title: 'Quality Assessment of Topical Herbosomal Gel for Anti-inflammatory Activity',
    type: 'Major Experimental Project',
    scope:
      'Formulation of phospholipid-complexed herbosomal nanocarriers incorporating phytoconstituents for topical delivery, characterization of entrapment efficiency, in-vitro permeation, and in-vivo anti-inflammatory efficacy evaluation.',
  },
  {
    sr: 2,
    title: 'Review on Herbosome: The Most Recent Novel Drug Delivery System',
    type: 'Scientific Review Paper',
    scope:
      'Comprehensive exploration of herbosome technology, lipid-nanocarrier integration, bioavailability enhancement of poorly water-soluble phytomedicines, and pharmaceutical application pipelines.',
  },
  {
    sr: 3,
    title: 'A Review on Recent Advances in Microneedles in Vaccine Delivery System',
    type: 'Drug Delivery Review',
    scope:
      'Investigation of dissolvable and solid microneedle arrays for painless transdermal immunization, intradermal antigen targeting, and improved thermo-stability of vaccines.',
  },
  {
    sr: 4,
    title: 'A Review on Povidone Iodine Mouthwash: A Potential Antiseptic to Minimize the Risk of COVID-19',
    type: 'Antiseptic & Clinical Review',
    scope:
      'Literature assessment on virucidal efficacy of low-dose povidone-iodine oral rinses in reducing SARS-CoV-2 viral load and transmission in clinical and dental healthcare settings.',
  },
]

const certifications = [
  {
    sr: 1,
    title: 'Poster Presentation at 72nd Indian Pharmaceutical Congress (IPC)',
    issuer: 'Department of Pharmaceutical Sciences, RTM Nagpur University',
    year: 'Jan 2023',
    type: 'National Congress Poster',
  },
  {
    sr: 2,
    title: 'Poster Presentation on "Current and Future Scenario in Pharmaceutical Chemistry"',
    issuer: 'Vidyabharti College of Pharmacy, Amravati',
    year: 'National Conference',
    type: 'National Conference Poster',
  },
  {
    sr: 3,
    title: 'Advance Analytical Equipment Handling Certificate Course',
    issuer: 'Continuing Education Program (CEP)',
    year: '2022',
    type: 'Technical Certificate Course',
  },
  {
    sr: 4,
    title: 'Diploma in Advance Program in Clinical Research and Management (APCRM)',
    issuer: 'Clini India, Pune',
    year: 'Clinical Certification',
    type: 'Post-Graduate Clinical Diploma',
  },
  {
    sr: 5,
    title: 'Delegate in 2nd International Conference on "Invigorating Research in Pharmaceuticals: Reasonable Industrial Approach"',
    issuer: 'International Pharmaceutical Forum',
    year: '2020',
    type: 'International Conference Delegate',
  },
  {
    sr: 6,
    title: 'Workshop on "Way to Scientific Writing & Publishing"',
    issuer: 'Academic Publishing & Research Forum',
    year: '2018',
    type: 'Scientific Writing Workshop',
  },
]

const skills = [
  {
    category: 'Analytical Instrumentation',
    items: [
      'UV-Visible Spectrophotometer',
      'Rotary Vacuum Evaporator',
      'Ultracentrifugation',
      'Dissolution Test Apparatus (USP Type I & II)',
      'Tablet Disintegration Test Apparatus',
    ],
  },
  {
    category: 'IT & Computing',
    items: [
      'MS-CIT Certified',
      'Microsoft Office (Word, Excel, PowerPoint)',
      'Scientific Data Analysis & Presentation',
    ],
  },
  {
    category: 'Specialization Domains',
    items: [
      'Pharmaceutical Quality Assurance (QA)',
      'Novel Drug Delivery Systems (Herbosomes / Nanocarriers)',
      'Clinical Research & Trial Coordination',
      'Analytical Method Quality Control',
    ],
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'projects', label: `Research & Reviews (${projects.length})`, icon: FlaskConical },
  { id: 'certifications', label: 'Conferences & Certifications', icon: Award },
  { id: 'skills', label: 'Skills & Instruments', icon: Microscope },
  { id: 'activities', label: 'Social & Hobbies', icon: HeartHandshake },
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

export default function FacultyDetailSamikshaAjankar() {
  useSeo({
    title: 'Prof. Samiksha Narendra Ajankar — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Samiksha Narendra Ajankar, Lecturer in Quality Assurance at TGPCOP Nagpur — M.Pharm in Quality Assurance (8.05 CGPA), Clinical Research Diploma, Herbosomal formulation research.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic background in Quality Assurance, herbosomal novel drug delivery research, and clinical certifications."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Samiksha Ajankar' },
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
          <div className="h-2.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              SA
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
                <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                  Quality Assurance Specialization
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-teal-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  M.Pharm QA Distinction (8.05 CGPA)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  Diploma in Clinical Research & Management (Clini India)
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-teal-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Academic track record from secondary education to master's degree.</p>
              </div>
              <Table
                headers={['#', 'Course / Qualification', 'Institution / College', 'Board / University', 'Year', 'Score', 'Division']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score, e.grade])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Research & Review Projects</h2>
              <p className="text-sm text-muted">Novel drug delivery systems, microneedle vaccine delivery, and herbosomal quality assessments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((proj) => (
                <div key={proj.sr} className="bg-white border-2 border-teal-100 rounded-2xl p-6 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between">
                  <div>
                    <span className="inline-block mb-2 px-3 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
                      {proj.type}
                    </span>
                    <h3 className="text-base font-heading font-bold text-navy-900 mb-3 leading-snug">
                      "{proj.title}"
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {proj.scope}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Certifications */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Professional Development & Certifications</h2>
              <p className="text-sm text-muted">Poster presentations at Indian Pharmaceutical Congress and specialized certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-teal-300 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                      {cert.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-muted">#{cert.sr}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1 leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-muted">
                    {cert.issuer} {cert.year ? `• ${cert.year}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Laboratory Instruments & Technical Skills</h2>
              <p className="text-sm text-muted">Practical instrumentation in Quality Assurance and formulation evaluation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((group, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-base text-navy-900 mb-4 pb-2 border-b border-border flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    {group.category}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-navy-800">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Activities & Hobbies */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Social Contributions & Interests</h2>
              <p className="text-sm text-muted">Community health engagements, creative pursuits, and hobbies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Charitable trust */}
              <div className="bg-white border-2 border-teal-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-navy-900">Charitable Community Health</h3>
                    <p className="text-xs text-muted">Social Service & Healthcare Outreach</p>
                  </div>
                </div>
                <p className="text-sm text-navy-800 leading-relaxed">
                  Active member of a registered Charitable Trust, organizing and participating in free community medical camps, medicine distribution drives, and healthcare awareness programs.
                </p>
              </div>

              {/* Hobbies */}
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-navy-900">Creative Interests & Hobbies</h3>
                    <p className="text-xs text-muted">Personal & Cultural Pursuits</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Singing', 'Dancing', 'Painting', 'Scientific Reading'].map((hobby) => (
                    <span key={hobby} className="px-3 py-1.5 rounded-xl bg-light-bg text-navy-900 text-xs font-semibold border border-border">
                      🎨 {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
