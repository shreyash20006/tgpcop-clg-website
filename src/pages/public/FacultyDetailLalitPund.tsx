import { useState } from 'react'
import {
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  FlaskConical,
  FileText,
  Users,
  CalendarDays,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Profile Data ────────────────────────────────────────────────────── */

const profile = {
  name: 'Mr. Lalit G. Pund',
  designation: 'Associate Professor',
  qualificationLine: 'M.Pharm (Pharmaceutical Analysis), B.Pharm',
  languages: 'English, Hindi, Marathi',
  email: 'lalitsworld2007@gmail.com',
  objective:
    'I am seeking a challenging position with an institute that is rapidly expanding and offers good advancement potential. I would like a position that would help me in progress and bring the best out of me.',
}

const education = [
  {
    sr: 1,
    course: 'M.Pharm (Pharmaceutical Analysis)',
    board: 'The Tamil Nadu Dr. M.G.R. Medical University, Chennai, T.N.',
    year: '2006–2008',
    division: 'First Division',
  },
  {
    sr: 2,
    course: 'B.Pharm',
    board: 'Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    year: '1999–2003',
    division: 'Completed',
  },
]

const experience = [
  {
    sr: 1,
    post: 'Teaching & Academic Faculty',
    institute: 'Taywade College of Pharmacy, Koradi, Nagpur',
    duration: '16 Years',
    responsibilities: 'Teaching B.Pharm / D.Pharm, Student Mentorship & Laboratories',
  },
  {
    sr: 2,
    post: 'Training and Placement Officer (TPO)',
    institute: 'Taywade College of Pharmacy, Koradi, Nagpur',
    duration: 'Institutional Responsibility',
    responsibilities: 'Campus placement drives, industry-institute interactions & student training',
  },
  {
    sr: 3,
    post: 'Alumni Co-ordinator',
    institute: 'Taywade College of Pharmacy, Koradi, Nagpur',
    duration: 'Institutional Responsibility',
    responsibilities: 'Alumni networking, guest lectures & association activities',
  },
  {
    sr: 4,
    post: 'Paper Setter & Valuer (PCI Based Syllabus)',
    institute: 'R.T.M. Nagpur University, Nagpur',
    duration: 'University Appointment',
    responsibilities: 'Appointed as Paper Setter for Instrumental Methods of Analysis Sem VII (PCI syllabus) & Internal/External Examiner',
  },
]

const patents = [
  {
    sr: 1,
    title: 'AI Based Device for developing soft gelatin capsules',
    designNo: '427206-001',
    date: '16 August 2024',
    type: 'Patent / Design',
  },
  {
    sr: 2,
    title: 'Peptide Based Therapeutics Device for Alzheimer\'s disease',
    designNo: '423481-001',
    date: '17 July 2024',
    type: 'Patent / Design',
  },
]

const publications = [
  {
    sr: 1,
    type: 'International',
    title: 'Opportunities And Challenges in Lisinopril: An Overview',
    journal: 'World Journal of Pharmaceutical and Medical Research, Vol. 3(6)',
    date: 'June 2017',
  },
  {
    sr: 2,
    type: 'International',
    title: 'Recent Trends in Herbal Medicines',
    journal: 'International Journal of Scientific Research, Vol. 8(5)',
    date: 'May 2017',
  },
  {
    sr: 3,
    type: 'International',
    title: 'Nanocream: A Review on Nanotechnological Aspect',
    journal: 'EPH International Journal of Science and Environment, Vol. 2(4)',
    date: 'April 2017',
  },
  {
    sr: 4,
    type: 'National',
    title: 'Nanocream: A Review on Recent Nanotechnological Aspect',
    journal: 'Rashtrasant Tukadoji Maharaj Nagpur University Science Journal, Vol. XIV (ISSN-0972-6330)',
    date: '2018',
  },
]

const presentations = [
  {
    sr: 1,
    level: 'International',
    format: 'Poster Presentation',
    title: 'Nanochloroquine augmented delivery overwhelmed drug resistance in Plasmodium falciparum parasites',
    conference: '2nd International Conference on Fostering Interdisciplinary Research in Health Sciences (ICFIRHS 2019)',
    organizer: 'Confnext India and AIMST University, Kedah, Malaysia',
    date: '14–15 Sept 2019',
  },
  {
    sr: 2,
    level: 'National',
    format: 'Poster Presentation',
    title: 'Metal complexes on Novel Fluoroquinolines N Donar and its biological evaluation as Anti-Tubercular agent',
    conference: 'Young Scientists Conference ("End Tuberculosis Strategy: 2030")',
    organizer: 'DST SEED Division, Ministry of Science & Technology, Min. of Earth Sciences & MoHFW, Govt of India',
    place: 'Biswa Bangla Convention Centre, Kolkata',
    date: '5–8 Nov 2019',
  },
  {
    sr: 3,
    level: 'National',
    format: 'Oral Presentation',
    title: 'Synthesis, Characterization and Docking Study of Substituted Benzimidazole as Anti-Tubercular agent',
    conference: 'National Conference on Interdisciplinary Pharmaceutical Research',
    organizer: 'DST SEED Division, CSIR, ICMR, Anand, Ahmedabad',
    date: '10–11 Aug 2018',
  },
  {
    sr: 4,
    level: 'National',
    format: 'Poster Presentation',
    title: 'Solid dispersion comprising water dispersible tablet Rizatriptan benzoate in PEG 4000 and PEG 6000',
    conference: '69th Indian Pharmaceutical Congress (IPC 2017)',
    organizer: 'IPCA & Association of Pharmaceutical Teachers of India (APTI)',
    place: 'Chitkara University, Rajpura, Punjab',
    date: '22–24 Dec 2017',
  },
  {
    sr: 5,
    level: 'National',
    format: 'Poster Presentation',
    title: 'Using microbubbles as target drug delivery to improve aids',
    conference: '69th Indian Pharmaceutical Congress (IPC 2017)',
    organizer: 'IPCA & APTI, Chitkara University, Rajpura, Punjab',
    date: '22–24 Dec 2017',
  },
  {
    sr: 6,
    level: 'National',
    format: 'Poster Presentation',
    title: 'To mask the bitter taste of Rizatriptan benzoate and develop water dispersible tablets by using Indion 234 and alginic acid',
    conference: '69th Indian Pharmaceutical Congress (IPC 2017)',
    organizer: 'IPCA & APTI, Chitkara University, Rajpura, Punjab',
    date: '22–24 Dec 2017',
  },
  {
    sr: 7,
    level: 'National',
    format: 'Poster Presentation',
    title: 'Bioanalytical method development and bioequivalence studies of Tadalafil Tablet by HPLC',
    conference: '69th Indian Pharmaceutical Congress (IPC 2017)',
    organizer: 'IPCA & APTI, Chitkara University, Rajpura, Punjab',
    date: '22–24 Dec 2017',
  },
]

const conferencesAttended = [
  {
    sr: 1,
    name: 'Young Scientists Conference (India International Science Festival)',
    organizer: 'Ministry of Science & Tech, Ministry of Earth Sciences, MoHFW & Vigyan Prasar',
    place: 'Biswa Bangla Convention Centre, Kolkata',
    date: '5–8 Nov 2019',
  },
  {
    sr: 2,
    name: '2nd International Congress of Society for Ethnopharmacology (SEE-INDIA) — Validation of Medicinal Plants & Traditional Medicine',
    organizer: 'Dept of Pharmaceutical Sciences RTMNU Nagpur & Society for Ethnopharmacology',
    place: 'RTMNU, Nagpur',
    date: '20–22 Feb 2015',
  },
  {
    sr: 3,
    name: 'Pre-Conference Workshop: Validation of Medicinal Plants & Traditional Medicine',
    organizer: 'Dept of Pharmaceutical Sciences RTMNU Nagpur',
    place: 'RTMNU, Nagpur',
    date: '20–22 Feb 2015',
  },
  {
    sr: 4,
    name: '69th Indian Pharmaceutical Congress (IPC 2017)',
    organizer: 'IPCA & APTI',
    place: 'Chitkara University, Rajpura, Punjab',
    date: '22–24 Dec 2017',
  },
  {
    sr: 5,
    name: '72nd Indian Pharmaceutical Congress (IPC 2023)',
    organizer: 'IPCA & Department of Pharmaceutical Sciences, RTMNU Nagpur',
    place: 'RTMNU, Nagpur',
    date: '20–22 Jan 2023',
  },
]

const fdpList = [
  {
    sr: 1,
    title: 'Pedagogical Strategies for Fostering Innovations and Start-up: Empowering Educators',
    organizer: 'G. H. Raisoni University Saikheda, M.P. & DBCOP, Nagpur (Sponsored by MSME, Nagpur)',
    date: '18–23 March 2024',
  },
  {
    sr: 2,
    title: 'ICT-Blended Teaching / Learning Pedagogy',
    organizer: 'Smt. Kishoritai Bhoyar College of Pharmacy, Kamptee (Sponsored by APTI)',
    date: '1–13 July 2019',
  },
  {
    sr: 3,
    title: 'Moodle: Learning Management System (LMS)',
    organizer: 'Smt. Kashibai Navale College of Engineering, Pune in association with Spoken Tutorial, IIT Bombay',
    date: '16–22 May 2020',
  },
  {
    sr: 4,
    title: 'Redefining the Role of Educator in Covid-19 Outbreak Era — Assessment Process',
    organizer: 'Gujarat Technological University (GTU), Ahmedabad & Anand Pharmacy College',
    date: '13–17 May 2020',
  },
  {
    sr: 5,
    title: 'Target Based Drug Design Strategies utilising CADD Tools and Ecofriendly Microwave-assisted Green Synthesis',
    organizer: 'AICTE Sponsored 6-Days STTP by ISF College of Pharmacy, Moga, Punjab',
    date: '27 April – 2 May 2020',
  },
  {
    sr: 6,
    title: 'Effective Use of ICT Tools for Online Teaching and Learning',
    organizer: 'MSBTE sponsored M.C.E. Society\'s Institute of Pharmacy, Azam Campus, Pune',
    date: '20–25 April 2020',
  },
]

const workshops = [
  {
    sr: 1,
    title: 'Voice Care Workshop for Educators',
    organizer: 'Career Katta & Dept of Higher & Technical Education, Maharashtra',
    place: 'Dhanwate National College, Nagpur',
    date: '25 Dec 2023',
  },
  {
    sr: 2,
    title: 'New Education Policy: Result & Implementation',
    organizer: 'YC Pratishthan Divisional Centre, Nagpur',
    place: 'Taywade College, Koradi, Nagpur',
    date: '1 April 2022',
  },
  {
    sr: 3,
    title: 'Digital Transformation in Pharma Industry',
    organizer: 'Dept of Pharmaceutical Sciences, RTMNU, Nagpur & Nitika Pharmaceuticals',
    place: 'RTMNU, Nagpur',
    date: '6–7 March 2020',
  },
  {
    sr: 4,
    title: 'Pharma Start-Up Sponsored Seminar on Opportunities and Challenges',
    organizer: 'Dadasaheb Balpande College of Pharmacy, Besa, Nagpur & Pharmacy Students Association',
    place: 'Besa, Nagpur',
    date: '9 Jan 2019',
  },
  {
    sr: 5,
    title: '3rd Dr. A.K. Dorle Memorial Lecture Series 2018: Writing Manuscripts, Research Proposals & Extending Consultancies',
    organizer: 'Dept of Pharmaceutical Sciences RTMNU Nagpur & Dr. A.K. Dorle Memorial Trust',
    place: 'RTMNU, Nagpur',
    date: '14 March 2018',
  },
  {
    sr: 6,
    title: 'One Day National Seminar on "Paradigms of New Process of Assessment & Accreditation by NAAC"',
    organizer: 'IQAC, Taywade College, Koradi & APTI',
    place: 'Taywade College, Koradi, Nagpur',
    date: '22 March 2018',
  },
  {
    sr: 7,
    title: 'National Seminar on "Growth Opportunities for Pharma and Allied Sector in Central India Region"',
    organizer: 'Taywade College of Pharmacy & Central India Pharmacy Promotion and Research Association (CIPPARA)',
    place: 'Central Point Hotel, Nagpur',
    date: '18 Nov 2017',
  },
  {
    sr: 8,
    title: 'One Day Workshop on Novel Teaching Techniques & APTI-MS Annual Convention (MAHAPHARMA AWARDS 2016)',
    organizer: 'APTI Maharashtra State Branch & DBCOP Besa',
    place: 'Hotel Centre Point, Nagpur',
    date: '28 Feb 2017',
  },
  {
    sr: 9,
    title: 'National Seminar on "Nature to Futuristic Medicines"',
    organizer: 'Dept of Pharmaceutical Sciences, RTMNU Nagpur',
    place: 'St. Charles Centenary Auditorium, Nagpur',
    date: '20 Sept 2014',
  },
  {
    sr: 10,
    title: '11th National Webinar: Regulatory Affairs — An Interesting and Challenging Profession',
    organizer: 'Sharadchandra Pawar College of Pharmacy, Pune',
    place: 'Online',
    date: '5 June 2020',
  },
  {
    sr: 11,
    title: '9th National Webinar: Response Surface Methodology Software Minitab',
    organizer: 'Sharadchandra Pawar College of Pharmacy, Pune',
    place: 'Online',
    date: '3 June 2020',
  },
  {
    sr: 12,
    title: 'Pharmacist in 21st Century and Artificial Intelligence',
    organizer: 'Shri Prakashchand Jain College of Pharmacy & ISF, Palaskhede Jamner',
    place: 'Online',
    date: '28 May 2020',
  },
  {
    sr: 13,
    title: 'Future of Education System Post COVID-19 by Dr. Abhay Jere (Chief Innovation Officer, MHRD Govt of India)',
    organizer: 'MCE Society\'s Institute of Pharmacy, Azam Campus, Pune',
    place: 'Online',
    date: '28 May 2020',
  },
  {
    sr: 14,
    title: 'Effective Presentation Skills Using ICT Tools & Creating Educational Videos',
    organizer: 'Chemtoons YouTube Channel & Knowledge Publications',
    place: 'Online',
    date: '30 April 2020',
  },
]

/* ─── Tabs ───────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'education', label: 'Education & Career', icon: GraduationCap },
  { id: 'patents', label: 'Patents (2)', icon: Sparkles },
  { id: 'experience', label: 'Experience & Portfolios', icon: Briefcase },
  { id: 'publications', label: `Publications (${publications.length})`, icon: BookOpen },
  { id: 'presentations', label: `Presentations (${presentations.length})`, icon: Users },
  { id: 'fdp', label: 'FDP & Training', icon: Award },
  { id: 'conferences', label: 'Conferences & Workshops', icon: CalendarDays },
  { id: 'achievements', label: 'Achievements & Memberships', icon: FileText },
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

export default function FacultyDetailLalitPund() {
  useSeo({
    title: 'Mr. Lalit G. Pund — Faculty Profile | TGPCOP',
    description:
      'Detailed academic profile of Mr. Lalit G. Pund, Associate Professor at TGPCOP Nagpur — 16+ years teaching experience, 2 AI/Medical patents, M.Pharm (1st Div), publications and presentations.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('education')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic qualifications, patents, teaching experience, and research credentials."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Mr. Lalit G. Pund' },
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

        {/* ── Hero profile card ── */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-10">
          <div className="h-2.5 bg-gradient-to-r from-navy-950 via-primary-600 to-indigo-600" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar badge */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-900 to-primary-600 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              LP
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-900 leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                  {profile.designation}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold">
                  16+ Years Experience
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

              {/* Memberships & Accreditations */}
              <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-primary-600" />
                  Life Member of Association of Pharmacy Teachers of India (APTI)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Life Member of Maharashtra State Pharmacy Council (MSPC)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  2 Published Device Patents (AI & Alzheimer's)
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
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Career Objective</h2>
                <p className="text-sm text-navy-800 bg-light-bg p-4 rounded-xl border border-border/80 italic leading-relaxed">
                  "{profile.objective}"
                </p>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Educational Qualifications</h2>
                <p className="text-sm text-muted">Degrees and academic institutions attended.</p>
              </div>
              <Table
                headers={['#', 'Course / Degree', 'Board / University', 'Year', 'Division']}
                rows={education.map((e) => [e.sr, e.course, e.board, e.year, e.division])}
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

        {/* Tab 2: Patents */}
        {activeTab === 'patents' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Registered Device Patents</h2>
              <p className="text-sm text-muted">Intellectual property and innovative medical apparatuses designed.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patents.map((p) => (
                <div key={p.designNo} className="bg-white border-2 border-primary-100 rounded-2xl p-6 shadow-sm hover:border-primary-400 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                      {p.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
                      Design No: {p.designNo}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                    "{p.title}"
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted pt-3 border-t border-border">
                    <CalendarDays className="w-4 h-4 text-primary-600" />
                    <span>Registered Date: <strong>{p.date}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Experience */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching Experience & Institutional Responsibilities</h2>
              <p className="text-sm text-muted">Over 16 years of academic leadership, training and university duties.</p>
            </div>
            <Table
              headers={['#', 'Position / Responsibility', 'Institute / University', 'Duration', 'Role & Scope']}
              rows={experience.map((e) => [e.sr, e.post, e.institute, e.duration, e.responsibilities])}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                  Institutional Portfolios
                </h3>
                <ul className="space-y-2.5 text-sm text-navy-800">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span><strong>Training and Placement Officer (TPO):</strong> Spearheaded placement activities, campus interviews, and industry-oriented training at Taywade College of Pharmacy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span><strong>Alumni Co-ordinator:</strong> Established active alumni network, tracking career progression and organizing alumni interactions.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading font-semibold text-base text-navy-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  University Appointments (RTMNU)
                </h3>
                <ul className="space-y-2.5 text-sm text-navy-800">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Appointed as <strong>Paper Setter</strong> for Instrumental Methods of Analysis Sem VII (PCI-based syllabus) for B.Pharm at RTMNU, Nagpur.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Worked as <strong>Internal & External Examiner and Valuer</strong> for university examinations at RTMNU, Nagpur.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Publications */}
        {activeTab === 'publications' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                National & International Publications ({publications.length})
              </h2>
              <p className="text-sm text-muted">Peer-reviewed journal articles in pharmaceutical science and nanotechnology.</p>
            </div>
            <div className="space-y-3">
              {publications.map((p) => (
                <div
                  key={p.sr}
                  className="flex items-start gap-4 bg-white border border-border rounded-xl p-4 shadow-sm hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-navy-950 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {p.sr}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${p.type === 'International' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.type}
                      </span>
                      <span className="text-xs text-muted">{p.date}</span>
                    </div>
                    <p className="text-sm font-medium text-navy-900 leading-snug">
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
        )}

        {/* Tab 5: Presentations */}
        {activeTab === 'presentations' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                International & National Poster / Oral Presentations ({presentations.length})
              </h2>
              <p className="text-sm text-muted">Research presented at Indian Pharmaceutical Congress (IPC) and international symposiums.</p>
            </div>
            <div className="space-y-3">
              {presentations.map((p) => (
                <div
                  key={p.sr}
                  className="bg-white border border-border rounded-xl p-4 shadow-sm hover:border-primary-300 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${p.level === 'International' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                        {p.level} • {p.format}
                      </span>
                    </div>
                    <span className="text-xs text-muted font-medium">{p.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-navy-900 leading-snug mb-1.5">
                    "{p.title}"
                  </h3>
                  <p className="text-xs text-primary-700 font-medium">
                    {p.conference}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Organized by: {p.organizer} {p.place ? `• ${p.place}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: FDP */}
        {activeTab === 'fdp' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                Faculty Development Programmes & Short Term Training
              </h2>
              <p className="text-sm text-muted">AICTE, IIT Bombay, MSME, and university-sponsored pedagogy training.</p>
            </div>
            <Table
              headers={['#', 'FDP / STTP Programme Title', 'Organizing Body / Institute', 'Date / Duration']}
              rows={fdpList.map((f) => [f.sr, f.title, f.organizer, f.date])}
            />
          </div>
        )}

        {/* Tab 7: Conferences & Workshops */}
        {activeTab === 'conferences' && (
          <div className="space-y-8">
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Conferences Attended</h2>
                <p className="text-sm text-muted">Participation in national science festivals & Indian Pharmaceutical Congress.</p>
              </div>
              <Table
                headers={['#', 'Conference Name', 'Organizing Body', 'Venue', 'Date']}
                rows={conferencesAttended.map((c) => [c.sr, c.name, c.organizer, c.place, c.date])}
              />
            </div>

            <div>
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-navy-900">Workshops, Seminars & Webinars ({workshops.length})</h2>
                <p className="text-sm text-muted">Continuous learning in pharmaceutical instrumentation, AI, NEP, NAAC, and digital health.</p>
              </div>
              <Table
                headers={['#', 'Topic / Workshop Title', 'Organizing Institute', 'Venue / Mode', 'Date']}
                rows={workshops.map((w) => [w.sr, w.title, w.organizer, w.place, w.date])}
              />
            </div>
          </div>
        )}

        {/* Tab 8: Achievements & Memberships */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Notable Achievements & Distinguished Interactions</h2>
              <p className="text-sm text-muted">High-level scientific interactions and certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interaction with Dr. Kalam */}
              <div className="bg-white border-2 border-primary-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-navy-900">Interaction with Dr. A.P.J. Abdul Kalam</h3>
                    <p className="text-xs text-muted">Former President of India</p>
                  </div>
                </div>
                <p className="text-sm text-navy-800 leading-relaxed">
                  Interacted directly with <strong>Dr. A.P.J. Abdul Kalam</strong> during the National Seminar conducted by J.S.S. College of Pharmacy, Ooty, Tamil Nadu during the student interaction session.
                </p>
              </div>

              {/* Interaction with Dr. Vijay Bhatkar */}
              <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-navy-900">Interaction with Dr. Vijay Bhatkar</h3>
                    <p className="text-xs text-muted">Renowned Indian Computer Scientist & Supercomputer Architect</p>
                  </div>
                </div>
                <p className="text-sm text-navy-800 leading-relaxed">
                  Interacted with <strong>Dr. Vijay Bhatkar</strong> during the Young Scientists Conference held at Biswa Bangla Convention Centre, Kolkata (Govt. of India).
                </p>
              </div>
            </div>

            {/* Certifications & Professional Bodies */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Certifications & Professional Memberships
              </h3>
              <ul className="space-y-3 text-sm text-navy-800">
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>MOOC Certificate of Achievement:</strong> Completed 32 activities in <em>Learn Moodle 3.7 Basics</em> conducted by Moodle HQ (July 2019).
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Association of Pharmacy Teachers of India (APTI):</strong> Life Member.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Maharashtra State Pharmacy Council (MSPC):</strong> Life Member.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

      </PageContainer>
    </>
  )
}
