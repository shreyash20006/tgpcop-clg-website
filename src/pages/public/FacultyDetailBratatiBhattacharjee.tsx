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
  Microscope,
  ShieldCheck,
  Building2,
  MapPin,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Bratati Bhattacharjee',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmaceutics - 77.63% Distinction, University 2nd Rank), B.Pharm',
  specialization: 'Pharmaceutics, Nanostructured Lipid Carriers (NLCs) & Drug Optimization',
  languages: 'English, Hindi, Bengali',
  email: 'bratatibhattacharjee@gmail.com',
  award: 'Honored with "Best Employee Award" (May 2018) at Griha Software Technologies, Bangalore',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (Pharmaceutics)',
    college: 'University Institute of Pharmacy',
    board: 'Pt. Ravishankar Shukla University (PRSU), Raipur (C.G.)',
    year: '2015',
    score: '77.63 %',
    grade: 'First Class with Distinction (Secured 2nd University Rank)',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Vidyabharati College of Pharmacy, Amravati',
    board: 'Sant Gadge Baba Amravati University (SGBAU)',
    year: '2013',
    score: '66.08 %',
    grade: 'First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Kendriya Vidyalaya, Chirimiri (C.G.)',
    board: 'CBSE',
    year: '2008',
    score: '56.80 %',
    grade: 'Higher Secondary',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Kendriya Vidyalaya, Chirimiri (C.G.)',
    board: 'CBSE',
    year: '2006',
    score: '61.08 %',
    grade: 'First Class',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Assistant Professor in Pharmaceutics',
    organization: 'Tulsiramji Gaikwad Patil College of Pharmacy, Nagpur',
    duration: 'August 2025 – Present',
    type: 'Academic Faculty',
    scope: 'Instruction in Advanced Pharmaceutics, dosage form design, physical pharmacy, and student laboratory mentoring.',
  },
  {
    sr: 2,
    post: 'Content Analyst (Inventory Services, Clinical)',
    organization: 'Griha Software Technologies Pvt. Ltd., Bangalore',
    duration: 'Sep 2016 – Oct 2018 (2 Years 1 Month)',
    type: 'Corporate Healthcare / Clinical Industry',
    scope: 'Clinical inventory data analysis, medical content standardization, and clinical workflow optimization. Honored with the prestigious "Best Employee Award" (May 2018).',
  },
  {
    sr: 3,
    post: 'Visiting Lecturer (Faculty of Pharmacy)',
    organization: 'K.B. Patel College of Nursing, Chirimiri (C.G.)',
    duration: 'Feb 2016 – June 2016',
    type: 'Academic Faculty',
    scope: 'Pharmacology and pharmaceutical basics lecture series for nursing and allied healthcare professionals.',
  },
  {
    sr: 4,
    post: 'Visiting Lecturer',
    organization: 'University Institute of Pharmacy, Pt. R.S.U., Raipur',
    duration: 'Nov 2015 – Dec 2015',
    type: 'University Faculty',
    scope: 'Undergraduate Pharmaceutics classroom teaching, student seminars, and practical laboratory instruction.',
  },
]

const research = {
  title:
    'Development and Characterization of gel containing cyclodextrin-complexed 5-fluorouracil loaded in nanostructured lipid carriers (NLCs)',
  guide: 'Dr. Amber Vyas, Assistant Professor, University Institute of Pharmacy, Pt. R.S.U., Raipur',
  degree: 'M.Pharm Dissertation in Novel Nanocarriers',
  scope:
    'Formulated lipidic nanocarriers combining cyclodextrin inclusion complexes with 5-fluorouracil for topical anticancer drug delivery, evaluating nanoparticle size, zeta potential via Malvern Zetasizer, entrapment efficiency, in-vitro Franz diffusion release, and rheological gel characterization.',
}

const conferencesAndFdp = [
  {
    sr: 1,
    title: '2nd National Pharma Conclave: "AI-Enabled Pharmaceutical Development and Entrepreneurial Prospects"',
    organizer: 'School of Pharmacy, GH Raisoni, Nagpur',
    date: '14th November 2025',
    type: 'National Conclave',
  },
  {
    sr: 2,
    title: '1-Week Online Faculty Development Program (FDP): "Systemic Approach to Transforming Research into Manuscript"',
    organizer: 'School of Pharmacy, GH Raisoni Skill Tech University, Nagpur',
    date: '13th – 18th October 2025',
    type: 'Faculty Development Program',
  },
  {
    sr: 3,
    title: 'Industrial Manufacturing Training (1 Month)',
    organizer: "Dey's Medical Stores (Manufacturing) Ltd., Calcutta",
    date: 'June 2012',
    type: 'Industrial Training',
  },
]

const instruments = [
  { name: 'Malvern Zetasizer', desc: 'Nanoparticle particle size, polydispersity index (PDI), and zeta potential determination' },
  { name: 'Franz Diffusion Cell Apparatus', desc: 'In-vitro and ex-vivo transdermal/topical drug release and permeation kinetics' },
  { name: 'Shimadzu UV-Visible Spectrophotometer', desc: 'Quantitative photometric assay and drug release concentration profiling' },
  { name: 'FTIR Spectrophotometer', desc: 'Drug-excipient compatibility, inclusion complex confirmation, and functional group analysis' },
  { name: 'HPLC (High Performance Liquid Chromatography)', desc: 'Chromatographic separation, purity evaluation, and active assay' },
  { name: 'Tablet Punching & Dissolution Apparatus', desc: 'Solid oral dosage compression, disintegration, and USP dissolution testing' },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'experience', label: 'Academic & Industry Experience', icon: Briefcase },
  { id: 'research', label: 'Nanocarrier Research', icon: FlaskConical },
  { id: 'instruments', label: 'Instruments & Software', icon: Microscope },
  { id: 'fdp', label: 'Conferences & FDPs', icon: Award },
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

export default function FacultyDetailBratatiBhattacharjee() {
  useSeo({
    title: 'Prof. Bratati Bhattacharjee — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Bratati Bhattacharjee, Assistant Professor at TGPCOP Nagpur — M.Pharm (77.63% Distinction, University 2nd Rank, PRSU Raipur), Best Employee Award recipient, and Nanostructured Lipid Carriers (NLC) specialist.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutics, Nanostructured Lipid Carriers (NLCs), clinical content analysis, and Design-Expert optimization."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Bratati Bhattacharjee' },
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
          <div className="h-2.5 bg-gradient-to-r from-teal-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-teal-900 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              BB
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  University 2nd Rank (77.63% Distinction)
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
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Best Employee Award (Griha Software Technologies, Bangalore)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Design-Expert Optimization & Malvern Zetasizer Nanotechnology
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Building2 className="w-3.5 h-3.5 text-primary-600" />
                  Industrial Training at Dey's Medical Stores, Calcutta
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
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Educational Qualifications</h2>
                <p className="text-sm text-muted">M.Pharm with 2nd Rank & Distinction from Pt. Ravishankar Shukla University.</p>
              </div>
              <Table
                headers={['#', 'Degree / Course', 'Institute / College', 'University / Board', 'Year', 'Marks / CGPA']}
                rows={education.map((e) => [e.sr, e.course, (e as any).college || (e as any).school, e.board, e.year, `${e.score} (${e.grade})`])}
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
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic & Healthcare Industry Experience</h2>
              <p className="text-sm text-muted">Over 2 years of corporate clinical analytics experience and pharmacy lecturing.</p>
            </div>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.sr} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-teal-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                      {exp.post}
                    </span>
                    <span className="text-xs text-muted font-semibold">{exp.duration}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-1">
                    {exp.organization}
                  </h3>
                  <p className="text-xs text-primary-700 font-semibold mb-3">{exp.type}</p>
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
              <h2 className="font-heading font-bold text-xl text-navy-900">Post-Graduation Nanotechnology Research Project</h2>
              <p className="text-sm text-muted">Nanostructured lipid carriers and cyclodextrin complexation for anticancer delivery.</p>
            </div>

            <div className="bg-white border-2 border-teal-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-semibold">
                  {research.degree}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                "{research.title}"
              </h3>
              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs font-semibold text-teal-950 mb-4">
                <strong>Research Guide:</strong> {research.guide}
              </div>
              <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                {research.scope}
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Instruments & Software */}
        {activeTab === 'instruments' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Instruments & Formulation Optimization Software Handled</h2>
              <p className="text-sm text-muted">Nanotechnology characterization and QbD software proficiency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instruments.map((inst, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-5 shadow-sm hover:border-teal-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <Microscope className="w-4 h-4 text-teal-600 shrink-0" />
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900">
                      {inst.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {inst.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5">
              <h4 className="font-heading font-bold text-sm text-teal-950 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Design-Expert Software Expertise
              </h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                Proficient in utilizing Design-Expert software for Response Surface Methodology (RSM), Central Composite Design (CCD), and Box-Behnken Design for statistical optimization of novel pharmaceutical nano-formulations.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: FDP & Conclaves */}
        {activeTab === 'fdp' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">National Conclaves, Workshops & FDPs</h2>
              <p className="text-sm text-muted">Recent development programs in AI in pharmacy and manuscript writing.</p>
            </div>

            <div className="space-y-4">
              {conferencesAndFdp.map((conf) => (
                <div key={conf.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    #{conf.sr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-1">
                      {conf.type}
                    </span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                      {conf.title}
                    </h3>
                    <p className="text-xs text-muted">
                      {conf.organizer} • {conf.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
