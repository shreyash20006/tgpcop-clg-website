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
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

/* ─── Data ────────────────────────────────────────────────────────────── */

const profile = {
  name: 'Dr. Awdhut Dnyaneshwar Pimpale',
  designation: 'Associate Professor',
  qualificationLine: 'M.Pharm, Ph.D. (Pharmaceutical Sciences)',
  email: 'adityapimpale@gmail.com',
  photo: null as string | null,
}

const qualifications = [
  { sr: 1, course: 'B. Pharm.', board: 'S. G. B. Amravati University', year: '2008', percent: '65.75', division: 'First' },
  { sr: 2, course: 'M. Pharm. (Pharmaceutical Chemistry)', board: 'R. T. M. Nagpur University', year: '2010', percent: '64.77', division: 'First' },
  { sr: 3, course: 'Ph.D. (Pharmaceutical Sciences)', board: 'R. T. M. Nagpur University', year: '2022', percent: '—', division: '—' },
  { sr: 4, course: 'MS-CIT', board: 'M. S. B. T. E., Mumbai', year: '2010', percent: '83.00', division: 'First' },
]

const research = [
  {
    degree: 'Ph.D.',
    title: 'Stability-Indicating Assay Methods for Estimation of Some Multicomponent Pharmaceutical Preparations',
    guide: 'Dr. R. B. Kakde, Professor, Department of Pharmaceutical Sciences, R. T. M. Nagpur University, Nagpur.',
  },
  {
    degree: 'M. Pharm.',
    title: 'Synthesis and Evaluation of Antioxidant activity of Some Novel Flavanols',
    guide: 'Dr. Shailesh Wadher, Associate Professor, School of Pharmacy, Nanded.',
  },
]

const experience = [
  { sr: 1, post: 'Assistant Professor', institute: 'Dr. R. G. Bhoyar Institute of Pharmaceutical Education and Research, Borgaon (Meghe), Wardha', from: '01.01.2011', to: '30.08.2013' },
  { sr: 2, post: 'Senior Research Fellow', institute: 'Institute of Chemical Technology, Matunga, Mumbai', from: '10.09.2013', to: '18.05.2015' },
  { sr: 3, post: 'Assistant Professor', institute: 'Dr. Babasaheb Ambedkar Institute of Pharmacy, Sewagram', from: '01.06.2015', to: '30.06.2017' },
  { sr: 4, post: 'Assistant Professor', institute: 'Department of Pharmaceutical Sciences, RTMNU, Nagpur', from: '01.07.2017', to: '31.05.2020' },
  { sr: 5, post: 'Assistant Professor', institute: 'Datta Meghe College of Pharmacy, Wardha', from: '01.12.2020', to: '30.10.2022' },
  { sr: 6, post: 'Associate Professor', institute: 'Datta Meghe College of Pharmacy, Wardha', from: '01.11.2022', to: '31.07.2023' },
]

const fdp = [
  { sr: 1, training: 'Two Weeks AICTE sponsored Faculty Development Programme Phase-1 "Importance of Innovation and Research Culture to Inculcate Startup and Entrepreneurship"', place: 'Konkan Gyanpeeth Rahul Dharkar College of Pharmacy & Research Institute, Karjat, Dist. Raigad', date: '15–26 March 2021' },
  { sr: 2, training: 'Six days AICTE sponsored Short Term Training Programme "Innovation in Effective Teaching, Learning Pedagogy and Research Skill Development"', place: 'P.E. Society Modern College of Pharmacy, Nigdi, Pune', date: '17–23 March 2021' },
  { sr: 3, training: 'Two Weeks AICTE sponsored Faculty Development Programme Phase-2 "Innovation, Startup and Entrepreneurship Development in Pharmaceutical Sciences"', place: 'Konkan Gyanpeeth Rahul Dharkar College of Pharmacy & Research Institute, Karjat, Dist. Raigad', date: '20–29 May 2021' },
  { sr: 4, training: 'One week\'s AICTE sponsored "Quality Improvement Programme - Application of Machine Learning in Drug Discovery and Development"', place: 'Birla Institute of Technology, Mesra, Ranchi', date: '31 May–5 June 2021' },
  { sr: 5, training: 'Three days DMIHER sponsored Faculty Development Programme "Institutional Excellence through Quality Practices"', place: 'Datta Meghe College of Pharmacy, Wardha', date: '17–19 July 2023' },
  { sr: 6, training: 'Five days Pharmaceutical Sciences, VISTAS sponsored National e-Faculty Development Programme "Fostering the drug design via Artificial Intelligence and Sanctifying Molecular docking studies"', place: 'Pharmaceutical Sciences, VISTAS', date: '24–28 July 2023' },
]

const publications = [
  { sr: 1, title: 'Development and Validation for Simultaneous Estimation of Rosuvastatin Calcium and Clopidogrel Bisulfate in Pharmaceutical Dosage Form by Reverse Phase-High Performance Liquid Chromatography.', journal: 'International Journal of Pharmacy and Biological Sciences. 2020; 10(2):296-303.' },
  { sr: 2, title: 'Development and Validation of Stability-Indicating Assay Method by RPHPLC for Simultaneous Estimation of Rosuvastatin Calcium and Fenofibrate in Pharmaceutical Dosage Form.', journal: 'Journal of Drug Delivery & Therapeutics. 2020; 10(4):79-86.' },
  { sr: 3, title: 'Stability-Indicating Method Development and Validation for The Simultaneous Estimation of Rosuvastatin Calcium and Clopidogrel Bisulfate in Pharmaceutical Dosage Form by Reverse Phase-High Performance Liquid Chromatography.', journal: 'Asian Journal of Pharmaceutical and Clinical Research. 2020; 13(9):1-7.' },
  { sr: 4, title: 'A Stability-Indicating Method Development and Validation for The Estimation of Rosuvastatin Calcium in Pharmaceutical Dosage Form by Reverse Phase-High Performance Liquid Chromatography.', journal: 'International Journal of Chemistry Research. 2020; 4(4):9-16.' },
  { sr: 5, title: 'Stability-Indicating Method Development and Validation for Estimation of Clopidogrel Bisulfate in Pharmaceutical Dosage Form by Reverse-Phase High-Performance Liquid Chromatography.', journal: 'Asian Journal of Pharmaceutical Research. 2020; 10(4): 253-259.' },
  { sr: 6, title: 'Development and Validation for the Estimation of Clopidogrel Bisulfate in Pharmaceutical Dosage Form by Reverse-Phase High-Performance Liquid Chromatography.', journal: 'Journal of Advanced Scientific Research. 11(4): 161-165.' },
  { sr: 7, title: 'A Reversed-Phase HPLC Analytical Method for The Analysis of Rosuvastatin Calcium in Bulk Drug and Tablet Dosage Formulation.', journal: 'Journal of Pharmaceutical Research International. 2021; 33(31A): 164-171.' },
  { sr: 8, title: 'A Validated Reversed-Phase HPLC Analytical Method for The Analysis of Fenofibrate in Bulk Drug and Tablet Dosage Formulation.', journal: 'Journal of Pharmaceutical Research International. 2021; 33(45A): 306-312.' },
  { sr: 9, title: 'Preclinical Appraisal of Hematinic Potential of Mandura Bhasma for Treating Anaemia.', journal: 'Journal of Pharmaceutical Research International. 2021; 33(30B): 207-214.' },
  { sr: 10, title: 'Ethnomedicinal Plant — A Review.', journal: 'Journal of Pharmaceutical Research International. 2021; 33(29B): 17-30.' },
  { sr: 11, title: 'Formulation and evaluation of orodispersible tablet for anti-asthmatic drug.', journal: 'Journal of Pharmaceutical Research International. 2021; 33(51A): 187-199.' },
  { sr: 12, title: 'Development and Validation of Analytical Method by RPHPLC for Simultaneous Estimation of Rosuvastatin Calcium and Fenofibrate in Pharmaceutical Dosage Form.', journal: 'GP Globalized Research Journal of Chemistry. 4(1) July-Dec 2020.' },
  { sr: 13, title: 'A Validated Reversed-Phase High Performance Liquid Chromatography Analytical Method For The Analysis of Methylcobalamin in Bulk Drugs and Tablet Dosage Formulation.', journal: 'International Journal of Pharmaceutical Quality Assurance. 2022; 13(3).' },
  { sr: 14, title: 'Development and Validation for the Estimation of Fenofibrate in Pharmaceutical Dosage Form by Reversed-Phase High Performance Liquid Chromatography.', journal: 'International Journal of Drug Delivery Technology. 2022; 12(4).' },
  { sr: 15, title: 'Onosma Bacteatum Wall: A Review of its Phytochemical Constituents and Therapeutic Potentials.', journal: 'International Journal of Modern Pharmaceutical Research. 2022; 6(9): 28-33.' },
  { sr: 16, title: 'Quality by design-driven development of topical gel encompassing papain and bromelain to illicit wound healing.', journal: 'Indian Journal of Pharmaceutical Education and Research.' },
  { sr: 17, title: 'Advances and Prospects in Antimicrobial Research using Nanomedicines.', journal: 'Current Drug Therapy. 2023; 18: 194-204.' },
  { sr: 18, title: 'Development and Evaluation of Ramosetron Hydrochloride Mouth Dissolving Thin Film for Enhanced Therapeutic Efficacy and Palatability.', journal: 'International Journal of Applied Pharmaceutics.' },
  { sr: 19, title: 'A review on recent scenario of herbal cosmetics.', journal: 'Annals of Phytomedicine. July-Sep 2023; 87.' },
  { sr: 20, title: 'Nose to brain drug delivery: A targeted approach for delivering drug into brain.', journal: 'Asian Journal of Pharmaceutics. July-Sep 2023; 87.' },
  { sr: 21, title: 'Pharmaceutical Manufacturing Continuous Crystallization Procedures: A Review.', journal: 'Asian Journal of Pharmaceutics. July-Sep 2023; 89.' },
]

const posters = [
  { sr: 1, title: '“Standardization and evaluation of multi-Herbal formulation”', event: 'National Symposium on “Chromatography: An important tool for herbal pharmaceutical industry.” AICTE, IPER, Wardha', date: 'Jan 2009' },
  { sr: 2, title: '“Synthesis of novel flavanol and evaluation of its antioxidant & antimicrobial activity”', event: '61st IPC, Ahmedabad', date: '11–13 Dec 2009' },
  { sr: 3, title: '“Synthesis and Antioxidant activity of some New Flavanols”', event: 'International conference on Recent Paradigm and Innovations for the Safe and Efficacious Medicine, IPER, Wardha', date: '22–23 Feb 2019' },
  { sr: 4, title: '“Stability Indicating RP-HPLC method for estimation of Linagliptin and Metformin HCl in pharmaceutical preparations”', event: 'Vidarbha Young Scholars Conference-2019, RTMNU, Nagpur', date: '29–30 March 2019' },
  { sr: 5, title: '“Development and Validation of Analytical Method by RPHPLC for simultaneous Estimation of Rosuvastatin Calcium and Fenofibrate in Pharmaceutical Dosage Form”', event: 'Oral paper presented at ICAPCM-2020, RTMNU, Nagpur', date: '13–16 Feb 2020' },
]

const workshops = [
  { sr: 1, name: 'Seminar on National Symposium of “Chromatography: An important tool for Herbal Pharmaceutical industry”', place: 'IPER, Wardha', date: 'Jan 2009' },
  { sr: 2, name: 'Seminar on “Current Trends in Novel Research & Art of Scientific Writing”', place: 'Agnihotri College of Pharmacy, Wardha', date: 'Dec 2011' },
  { sr: 3, name: 'Workshop on IPR: “A Strategic Tool to Transform Innovations into Technologies”', place: 'Institute of Chemical Technology, Mumbai', date: 'Sept 2014' },
  { sr: 4, name: 'Workshop on “Latest Innovations on Pharmaceutical Science”', place: 'Dr. R. G. Bhoyar Institute of Pharmaceutical Education & Research, Wardha', date: 'Feb 2015' },
  { sr: 5, name: 'National workshop on “Relevance of Intellectual Property Rights in The Present Academic Scenario”', place: 'Dayanand Arya Kanya Mahavidyalaya, Nagpur', date: 'April 2019' },
  { sr: 6, name: 'National workshop on “Statistical Analysis for Pharmaceutical Research with MS-Excel”', place: 'Gurunanak College of Pharmacy, Nagpur', date: 'Sept 2019' },
  { sr: 7, name: 'International workshop on “Digital Transformation in Pharma Industry”', place: 'Department of Pharmaceutical Sciences, RTMNU, Nagpur', date: 'March 2020' },
  { sr: 8, name: 'International workshop on “Research Methodology in Drug Discovery and Life Sciences”', place: 'School of Pharmaceutical Sciences, Sanjay Ghodawat University, Kolhapur', date: 'May 2021' },
  { sr: 9, name: 'National workshop on “Intellectual Property Rights”', place: 'Sant Gadage Baba Amravati University, Amravati', date: 'Jan 2021' },
  { sr: 10, name: 'International e-Workshop on “Computational Approaches in Drug Design & Therapeutics”', place: 'Amity Institute of Biotechnology, Amity University Chhattisgarh', date: 'Feb 2021' },
  { sr: 11, name: 'Webinar on “Nutraceutical/Herbal Industry: Global Regulation and Prospective Opportunities”', place: 'Director Technical and Marketing Prakruiti Products Pvt Ltd. Bangalore', date: 'May 2021' },
  { sr: 12, name: 'National conference on “Intelligent Automation in Pharmaceutical Industry”', place: 'Kamla Nehru College of Pharmacy, Nagpur, RTM Nagpur University', date: 'July 2023' },
]

/* ─── Tab definitions ────────────────────────────────────────────────── */

const TABS = [
  { id: 'qualifications', label: 'Qualifications', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'research', label: 'Research & Dissertations', icon: FlaskConical },
  { id: 'publications', label: `Publications (${publications.length})`, icon: BookOpen },
  { id: 'fdp', label: 'FDP & Training', icon: Award },
  { id: 'presentations', label: 'Poster & Presentations', icon: Users },
  { id: 'workshops', label: 'Workshops & Seminars', icon: CalendarDays },
  { id: 'extras', label: 'Professional & Portfolios', icon: FileText },
] as const

type TabId = (typeof TABS)[number]['id']

/* ─── Helper: striped table wrapper ─────────────────────────────────── */
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

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function FacultyDetail() {
  useSeo({
    title: 'Dr. Awdhut D. Pimpale — Faculty Profile | TGPCOP',
    description:
      'Detailed profile of Dr. Awdhut Dnyaneshwar Pimpale, Associate Professor at TGPCOP Nagpur — qualifications, 21 research publications, FDPs, experience and portfolios.',
  })

  const [activeTab, setActiveTab] = useState<TabId>('qualifications')

  return (
    <>
      <PageHeader
        title="Faculty Profile"
        description="Detailed academic qualifications, research, publications, and professional background."
        breadcrumbItems={[
          { label: 'Campus', path: '/campus' },
          { label: 'Dr. Awdhut D. Pimpale' },
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
          <div className="h-2.5 bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500" />
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

            {/* Avatar badge */}
            <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-navy-900 to-primary-600 flex items-center justify-center text-white font-heading font-bold text-4xl shadow-md border-2 border-white">
              AD
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
                  Life Member of APTI (MA/LM-2958)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-light-bg text-navy-900 text-xs font-medium border border-border">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Maharashtra State Pharmacy Council — Reg. No. 91035
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs bar ── */}
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

        {activeTab === 'qualifications' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">Academic Qualifications</h2>
              <p className="text-sm text-muted">Educational milestones and degree credentials.</p>
            </div>
            <Table
              headers={['#', 'Course', 'Board / University', 'Passing Year', 'Percentage (%)', 'Division']}
              rows={qualifications.map((q) => [q.sr, q.course, q.board, q.year, q.percent, q.division])}
            />
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">Teaching, Administrative & Research Experience</h2>
              <p className="text-sm text-muted">Chronological history of academic and research appointments.</p>
            </div>
            <Table
              headers={['#', 'Post Held', 'Name of the Institute', 'From', 'To']}
              rows={experience.map((e) => [e.sr, e.post, e.institute, e.from, e.to])}
            />
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Research and Development (R&D)</h2>
              <p className="text-sm text-muted">Major research dissertations and thesis work.</p>
            </div>
            {research.map((r) => (
              <div key={r.degree} className="bg-white border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                    {r.degree} Thesis
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold text-navy-900 mb-3 leading-snug">
                  "{r.title}"
                </h3>
                <div className="bg-light-bg rounded-xl p-4 border border-border/60 text-sm text-muted">
                  <strong className="text-navy-900">Research Guide: </strong>
                  {r.guide}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'publications' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                National & International Publications ({publications.length})
              </h2>
              <p className="text-sm text-muted">Peer-reviewed journal articles and research papers.</p>
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
                    <p className="text-sm font-medium text-navy-900 leading-snug">
                      {p.title}
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

        {activeTab === 'fdp' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                Faculty Development Programmes (FDP) & STTP
              </h2>
              <p className="text-sm text-muted">AICTE and university-sponsored training programs attended.</p>
            </div>
            <Table
              headers={['#', 'Training / Programme Title', 'Organizing Institute / Place', 'Date / Duration']}
              rows={fdp.map((f) => [f.sr, f.training, f.place, f.date])}
            />
          </div>
        )}

        {activeTab === 'presentations' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                Poster & Oral Presentations
              </h2>
              <p className="text-sm text-muted">Presentations delivered at national and international conferences.</p>
            </div>
            <Table
              headers={['#', 'Title of Presentation', 'Event / Seminar', 'Date']}
              rows={posters.map((p) => [p.sr, p.title, p.event, p.date])}
            />
          </div>
        )}

        {activeTab === 'workshops' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl text-navy-900">
                Conferences, Seminars & Workshops Attended
              </h2>
              <p className="text-sm text-muted">Participation in national/international workshops and webinars.</p>
            </div>
            <Table
              headers={['#', 'Conferences / Seminars / Workshops', 'Place / Organizing Body', 'Date']}
              rows={workshops.map((w) => [w.sr, w.name, w.place, w.date])}
            />
          </div>
        )}

        {activeTab === 'extras' && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="font-heading font-bold text-xl text-navy-900">Portfolios & Extra-Curricular Engagements</h2>
              <p className="text-sm text-muted">Institutional responsibilities and university-level contributions.</p>
            </div>

            {/* Portfolios */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                Portfolios Handled (Dept. / Institute / University Level)
              </h3>
              <ul className="space-y-3 text-sm text-navy-800">
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900">AICTE:</strong> Co-ordination of AICTE web portal and statutory submission.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900">PCI:</strong> Co-ordination of Pharmacy Council of India (PCI) web portal and statutory submission.
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900">University:</strong> Activities related to student admission, enrollment, university examination, follow-ups, and academic administration.
                  </div>
                </li>
              </ul>
            </div>

            {/* Extra-Curricular */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                University Examination & Evaluator Roles
              </h3>
              <ul className="space-y-3 text-sm text-navy-800">
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    Worked as <strong>Co-convenor</strong> at Datta Meghe Institute of Higher Education & Research (DMIHER), Wardha for University examinations in Diploma in Pharmacy (D.Pharm) and Bachelor of Pharmacy (B.Pharm).
                  </div>
                </li>
                <li className="flex items-start gap-2.5 bg-light-bg p-3.5 rounded-xl border border-border/70">
                  <ChevronRight className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    Appointed as <strong>Examiner / Paper Setter / Valuer / External Examiner</strong> for Pharmaceutical Inorganic Chemistry, Pharmaceutical Organic Chemistry, Pharmaceutical Analysis, and Medicinal Chemistry at DMIHER, Wardha.
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
