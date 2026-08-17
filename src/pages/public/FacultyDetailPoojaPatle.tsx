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
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Pooja Pralhad Patle',
  designation: 'Lecturer',
  qualificationLine: 'M.Pharm (Pharmaceutical Chemistry), B.Pharm (8.15 CGPA)',
  email: 'poojapatle000@gmail.com',
  languages: 'English, Marathi, Hindi',
  objective:
    'To work in an environment that encourages me to succeed and grow professionally and where I can utilize my skill and knowledge.',
}

const education = [
  {
    sr: 1,
    course: 'M.Pharm (Pharmaceutical Chemistry)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2022–2024',
    score: 'Post-Graduation',
    grade: 'First Division',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Manoharbhai Patel Institute of Bachelor of Pharmacy, Kudwa, Gondia',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2018–2022',
    score: '8.15 CGPA',
    grade: 'Distinction / First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Shantaben Manoharbhai Patel Junior College, Gondia',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2017',
    score: '71.69 %',
    grade: 'First Class',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Rabindranath Tagore High School, Gondia',
    board: 'Maharashtra State Board (Nagpur Division)',
    year: '2015',
    score: '88.00 %',
    grade: 'Distinction',
  },
]

const projects = [
  {
    type: 'PG Research Project (M.Pharm)',
    title:
      'DESIGN, SYNTHESIS, BIOLOGICAL EVALUATION, PHARMACOPHORE MAPPING AND IN-SILICO STUDIES ON PYRIMIDINE DERIVATIVES FOR ITS ANTIMICROBIAL AND ANTIOXIDANT ACTIVITY',
    scope:
      'In-silico molecular docking, rational drug design, organic synthesis, pharmacophore generation, and in-vitro antimicrobial & antioxidant bio-assays of novel pyrimidine scaffolds.',
  },
  {
    type: 'UG Research Project (B.Pharm)',
    title: 'FORMULATION AND EVALUATION OF HERBAL OINTMENT FOR ANTIMICROBIAL ACTIVITY',
    scope:
      'Phytochemical extraction from medicinal plant materials, ointment base formulation optimization, physical characterization, stability testing, and zone of inhibition antimicrobial assay.',
  },
]

const publications = [
  {
    sr: 1,
    title: 'Exploring the Dynamic Chemistry and Therapeutic Potential of Pyrimidine Derivatives',
    type: 'Published Review Article',
    journal: 'Pharmaceutical Chemistry Review Series',
  },
  {
    sr: 2,
    title: 'Formulation and Evaluation of Herbal Ointment for Antimicrobial Activity',
    type: 'Research Article',
    journal: 'International Journal of Creative Research Thoughts (IJCRT), Vol. 10 (ISSN: 2320-2882)',
    date: 'May 2022',
  },
  {
    sr: 3,
    title: 'In-silico Prediction of Phytoconstituent from Solanum Indicum for Antiepileptic Activity',
    type: 'Conference Publication',
    journal: 'National Conference on Recent Advancements in Science and Technology (ISBN: 978-19931-25-5)',
    date: 'Feb 2024',
  },
]

const certifications = [
  {
    sr: 1,
    title: 'Research Methodology in Natural Science',
    issuer: 'NPTEL (National Programme on Technology Enhanced Learning)',
    type: 'NPTEL Certification',
  },
  {
    sr: 2,
    title: 'Best Paper Award — AI in Pharmaceutical Education & Research',
    issuer: 'International Conference on Impact of AI in Revolutionizing Pharmaceutical Education and Research',
    type: 'International Best Paper Award',
    topic: 'In-Silico Prediction of Phytoconstituents from Leea asiatica for Anticancer Activity Targeting DNA Polymerase λ',
  },
  {
    sr: 3,
    title: 'Avishkar Research Convention Poster Presentation',
    issuer: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    type: 'University Research Convention',
  },
  {
    sr: 4,
    title: 'Hands-on Training on Sophisticated Analytical Instruments (HPLC & HPTLC)',
    issuer: 'Advanced Analytical Instrumentation Workshop (2-Days)',
    type: 'Instrumental Workshop',
  },
  {
    sr: 5,
    title: '3D Printing Impact on Pharmaceutical Science: Applications and Scientific Writing',
    issuer: 'International Faculty Development Program (3-Days)',
    type: 'International FDP',
  },
  {
    sr: 6,
    title: 'Delegate Participation in 72nd Indian Pharmaceutical Congress (IPC)',
    issuer: 'Department of Pharmaceutical Sciences, RTMNU Nagpur',
    type: 'National Congress Delegate',
  },
  {
    sr: 7,
    title: 'CPC Medical Coding Career Opportunities Workshop',
    issuer: 'Professional Development Series',
    type: 'Medical Coding Workshop',
  },
]

const skills = [
  { category: 'Analytical & Experimental', items: ['UV-Visible Spectroscopy', 'FTIR Spectrophotometer', 'HPLC & HPTLC Instrument Handling', 'Pharmacophore Mapping & In-Silico Docking'] },
  { category: 'Technical & Computing', items: ['Scientific Report Drafting', 'Technical Presentations', 'MS Office (Word, Excel, PowerPoint)', 'CADD & Molecular Modeling Tools'] },
  { category: 'Areas of Interest', items: ['Formulation & Development (F&D)', 'Quality Assurance / Quality Control (QA/QC)', 'Pharmaceutical R&D', 'Phytochemistry & Herbal Drug Evaluation'] },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'projects', label: 'Research Projects', icon: FlaskConical },
  { id: 'publications', label: `Publications (${publications.length})`, icon: BookOpen },
  { id: 'certifications', label: 'Awards & Certifications', icon: Award },
  { id: 'skills', label: 'Skills & Domains', icon: Microscope },
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

export default function FacultyDetailPoojaPatle() {
  useSeo({
    title: 'Prof. Pooja Pralhad Patle — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Pooja Pralhad Patle, Lecturer in Pharmaceutical Chemistry at TGPCOP Nagpur — M.Pharm (Kamla Nehru COP), B.Pharm (8.15 CGPA), Best Paper Award in AI, publications and in-silico drug design.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Academic background in Pharmaceutical Chemistry, in-silico molecular docking research, and analytical instrumentation."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Pooja Patle' },
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
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-700 to-primary-600 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              PP
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
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  Pharmaceutical Chemistry
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
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  Best Paper Award — AI in Pharmaceutical Research
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  NPTEL Certified (Research Methodology)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  B.Pharm Distinction (8.15 CGPA)
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
                <p className="text-sm text-muted">Complete academic timeline from secondary to post-graduate studies.</p>
              </div>
              <Table
                headers={['#', 'Degree / Qualification', 'Institution / College', 'Board / University', 'Year', 'Score', 'Division']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, e.score, e.grade])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic Research Projects</h2>
              <p className="text-sm text-muted">M.Pharm and B.Pharm experimental research & in-silico drug design.</p>
            </div>

            {projects.map((proj, idx) => (
              <div key={idx} className="bg-white border-2 border-primary-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                    {proj.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                  "{proj.title}"
                </h3>
                <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                  {proj.scope}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Publications */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                Research Publications ({publications.length})
              </h2>
              <p className="text-sm text-muted">Peer-reviewed review articles, journal papers, and national conference proceedings.</p>
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
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 mb-1">
                      {p.type}
                    </span>
                    <p className="text-sm font-semibold text-navy-900 leading-snug">
                      "{p.title}"
                    </p>
                    <p className="text-xs text-primary-600 font-medium mt-1">
                      {p.journal} {p.date ? `• ${p.date}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Certifications & Awards */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Awards, Certifications & Participations</h2>
              <p className="text-sm text-muted">Competitive research awards, FDPs, and analytical training certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {cert.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-muted">#{cert.sr}</span>
                    </div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-2 leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {cert.issuer}
                    </p>
                    {cert.topic && (
                      <div className="mt-3 p-3 bg-amber-50/60 rounded-lg border border-amber-100 text-xs text-amber-900 font-medium">
                        <strong>Paper:</strong> "{cert.topic}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Technical & Experimental Competencies</h2>
              <p className="text-sm text-muted">Laboratory instrumentation, software tools, and pharmaceutical domains.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((group, idx) => (
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

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-3">Languages & Personal Interests</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Languages Known</span>
                  <strong className="text-navy-900">{profile.languages}</strong>
                </div>
                <div className="p-3 bg-light-bg rounded-xl border border-border/60">
                  <span className="text-muted text-xs block">Interests & Hobbies</span>
                  <strong className="text-navy-900">Scientific reading, computer software, music & sports</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
