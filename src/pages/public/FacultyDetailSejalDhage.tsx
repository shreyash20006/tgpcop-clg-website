import { useState } from 'react'
import {
  Mail,
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
  Building2,
  MapPin,
  Dna,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Prof. Sejal S. Dhage',
  designation: 'Assistant Professor',
  qualificationLine: 'M.Pharm (Pharmaceutical Chemistry - 8.86 CGPA), B.Pharm (7.97 CGPA)',
  specialization: 'Pharmaceutical Chemistry, Molecular Docking & Microwave Synthesis',
  languages: 'Marathi, Hindi, English',
  email: 'sejal.dhage2002@gmail.com',
  objective:
    'To be part of a leading organization that utilizes my abilities to the fullest extent possible, helps me realize and develop my potential, and be a part of a team that scales great heights through a continuous learning process and utmost dedication.',
}

const education = [
  {
    sr: 1,
    course: 'Master of Pharmacy (Pharmaceutical Chemistry)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2023–2025',
    score: '8.86 CGPA',
    grade: 'First Class with Distinction',
  },
  {
    sr: 2,
    course: 'Bachelor of Pharmacy (B.Pharm)',
    college: 'Kamla Nehru College of Pharmacy, Butibori, Nagpur',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '2019–2023',
    score: '7.97 CGPA',
    grade: 'First Class',
  },
  {
    sr: 3,
    course: 'Higher Secondary Certificate (HSC - 12th)',
    college: 'Santaji Mahavidyalaya, Nagpur',
    board: 'Maharashtra State Board',
    year: '2019',
    score: '59.38 %',
    grade: 'Higher Secondary',
  },
  {
    sr: 4,
    course: 'Secondary School Certificate (SSC - 10th)',
    school: 'Utkarsh Vidya Mandir, Khapri, Nagpur',
    board: 'Maharashtra State Board',
    year: '2017',
    score: '77.80 %',
    grade: 'First Class with Distinction',
  },
]

const project = {
  title: 'Design, Synthesis, Molecular Docking, Characterization, and Pharmacological Screening of Chalcone Containing Benzoxazole Derivatives',
  degree: 'M.Pharm Research Project in Medicinal Chemistry',
  scope:
    'In-silico rational drug design, target receptor molecular docking, green chemistry microwave-assisted synthesis of novel chalcone-benzoxazole hybrids, spectral characterization, and in-vitro pharmacological biological evaluation.',
}

const publication = {
  title: 'Formulation and Evaluation of Anti-Bacterial Gel from Extract of Butterfly Ash and Gold Bloom',
  type: 'Herbal Formulation Research Article',
  description:
    'Formulation, gel rheology, stability testing, and in-vitro zone of inhibition antibacterial assessment of novel plant extract-based topical formulations.',
}

const internship = {
  company: 'Asylum Pharmaceuticals Pvt. Ltd., Butibori, Nagpur',
  duration: '1 Month Industrial Internship',
  scope:
    'Practical industrial exposure to pharmaceutical manufacturing, quality control testing, documentation, and GMP operations.',
}

const skills = [
  {
    name: 'Molecular Docking & In-Silico Modeling',
    desc: 'Computational drug design, ligand-protein interaction studies, binding affinity scoring, and pharmacophore modeling.',
  },
  {
    name: 'Microwave Synthesis Reactor (Catalyst System)',
    desc: 'Green chemical synthesis, accelerated reaction optimization, and microwave-assisted heterocyclic derivative generation.',
  },
  {
    name: 'UV-Visible Spectrophotometer (Shimadzu)',
    desc: 'Photometric quantitative estimation, spectral scanning, and pharmaceutical assay validations.',
  },
  {
    name: 'Molecular Biology Techniques',
    desc: 'Hands-on training in Polymerase Chain Reaction (PCR), Agarose Gel Electrophoresis, and Automated Nucleic Acid Extraction.',
  },
]

const conferences = [
  {
    sr: 1,
    title: 'International Conference on Innovations in Chemical, Biological and Pharmaceutical Sciences (2024)',
    role: 'Participated and Presented Research',
  },
  {
    sr: 2,
    title: 'National Conference at Pharma Summit 2025: "Advancing Healthcare through Collaboration and Innovation"',
    role: 'Paper Presentation & Delegate',
  },
  {
    sr: 3,
    title: 'National Conference on Advancing Research Methodology and Technological Innovation (2025)',
    role: 'Participated',
  },
  {
    sr: 4,
    title: 'National Conference on Emerging Trends and Recent Advances in Pharmaceutical Sciences (ETRAPS-2023)',
    role: 'Participated and Presented',
  },
  {
    sr: 5,
    title: 'Advantage Vidarbha 2025 — Mega Industrial Exhibition, Business Conclave & Investment Summit',
    role: 'Summit Attendee',
  },
  {
    sr: 6,
    title: 'Hands-on Workshop on PCR, Agarose Gel Electrophoresis & Automated Nucleic Acid Extraction',
    role: 'Technical Laboratory Training',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Profile', icon: GraduationCap },
  { id: 'research', label: 'Medicinal Chemistry Research', icon: FlaskConical },
  { id: 'skills', label: 'In-Silico & Lab Skills', icon: Microscope },
  { id: 'conferences', label: `Conferences & Workshops (${conferences.length})`, icon: Award },
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

export default function FacultyDetailSejalDhage() {
  useSeo({
    title: 'Prof. Sejal S. Dhage — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Prof. Sejal S. Dhage, Assistant Professor at TGPCOP Nagpur — M.Pharm (8.86 CGPA Distinction, Kamla Nehru COP), Molecular docking, Microwave-assisted synthesis, and medicinal chemistry researcher.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed background in Pharmaceutical Chemistry, molecular docking, green microwave synthesis, and molecular biology techniques."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Prof. Sejal S. Dhage' },
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
          <div className="h-2.5 bg-gradient-to-r from-purple-600 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-900 to-primary-700 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              SD
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
                  M.Pharm Distinction (8.86 CGPA)
                </span>
              </div>

              <p className="text-navy-700 font-medium text-sm sm:text-base mt-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600 shrink-0" />
                {profile.qualificationLine}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 text-primary-600 hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0 text-purple-600" />
                    <span>{profile.email}</span>
                  </a>
                </div>
              </div>

              {/* Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Molecular Docking & Microwave Synthesis Expertise
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Dna className="w-3.5 h-3.5 text-indigo-600" />
                  PCR & Automated Nucleic Acid Extraction Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Building2 className="w-3.5 h-3.5 text-primary-600" />
                  Industrial Training at Asylum Pharmaceuticals
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
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === id ? 'text-purple-600' : 'text-muted'}`} />
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
                <p className="text-sm text-muted">Post-graduation in Pharmaceutical Chemistry with 8.86 CGPA from Kamla Nehru COP.</p>
              </div>
              <Table
                headers={['#', 'Degree / Course', 'Institution / Board / University', 'Year of Passing', 'Percentage / CGPA']}
                rows={education.map((e) => [e.sr, e.course, `${(e as any).college || (e as any).school}, ${e.board}`, e.year, e.score])}
              />
            </div>

            {/* Industrial Experience */}
            <div className="bg-white border-2 border-purple-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                  Industrial Internship
                </span>
                <span className="text-xs text-muted font-bold">{internship.duration}</span>
              </div>
              <h3 className="text-base font-heading font-bold text-navy-900 mb-2">
                {internship.company}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {internship.scope}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Research */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Medicinal Chemistry M.Pharm Project</h2>
                <p className="text-sm text-muted">Rational computer-aided drug design and microwave synthesis.</p>
              </div>

              <div className="bg-white border-2 border-purple-100 rounded-2xl p-6 shadow-sm">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold mb-3">
                  {project.degree}
                </span>
                <h3 className="text-base sm:text-lg font-heading font-bold text-navy-900 mb-2 leading-snug">
                  "{project.title}"
                </h3>
                <p className="text-sm text-muted leading-relaxed bg-light-bg p-4 rounded-xl border border-border/70">
                  {project.scope}
                </p>
              </div>
            </div>

            {/* Publication */}
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Research Publication</h2>
                <p className="text-sm text-muted">Herbal bioactive formulation and antibacterial assessment.</p>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-purple-300 transition-all">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 mb-2">
                  {publication.type}
                </span>
                <h3 className="text-base font-heading font-bold text-navy-900 mb-2">
                  "{publication.title}"
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {publication.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">In-Silico & Laboratory Capabilities</h2>
              <p className="text-sm text-muted">Computational drug design, green chemistry, and molecular biology instrumentation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {skills.map((s, idx) => (
                <div key={idx} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-purple-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <Microscope className="w-5 h-5 text-purple-600 shrink-0" />
                    <h3 className="font-heading font-bold text-base text-navy-900">
                      {s.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Conferences */}
        {activeTab === 'conferences' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Conferences, Summits & Technical Workshops</h2>
              <p className="text-sm text-muted">National/international paper presentations and advanced biotechnology workshops.</p>
            </div>

            <div className="space-y-3">
              {conferences.map((conf) => (
                <div key={conf.sr} className="bg-white border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                    #{conf.sr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-navy-900 mb-1">
                      {conf.title}
                    </h3>
                    <span className="inline-block text-xs text-primary-600 font-semibold">
                      {conf.role}
                    </span>
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
