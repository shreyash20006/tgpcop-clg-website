import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  GraduationCap,
  Mail,
  ChevronRight,
  Sparkles,
  Users,
} from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import { useSeo } from '@/lib/seo'

interface FacultyDirectoryMember {
  id: number
  name: string
  role: string
  department: string
  qualification: string
  specialization?: string
  email?: string
  profileUrl?: string
  avatarInitials: string
  avatarColor: string
}

const ALL_FACULTY: FacultyDirectoryMember[] = [
  {
    id: 1,
    name: 'Dr. Awdhut D. Pimpale',
    role: 'Principal & Associate Professor',
    department: 'Pharmaceutical Chemistry',
    qualification: 'M.Pharm, Ph.D.',
    specialization: 'Pharmaceutical Sciences & Analytical Stability',
    email: 'adityapimpale@gmail.com',
    profileUrl: '/faculty/dr-awdhut-pimpale',
    avatarInitials: 'AP',
    avatarColor: 'from-navy-950 to-primary-700',
  },
  {
    id: 2,
    name: 'Mr. Lalit G. Pund',
    role: 'Associate Professor',
    department: 'Pharmaceutical Analysis',
    qualification: 'M.Pharm (Analysis), B.Pharm',
    specialization: 'Method Development, Device Patents & TPO',
    email: 'lalitsworld2007@gmail.com',
    profileUrl: '/faculty/mr-lalit-pund',
    avatarInitials: 'LP',
    avatarColor: 'from-indigo-900 to-primary-600',
  },
  {
    id: 3,
    name: 'Prof. Priyanka S. Waghmare',
    role: 'Assistant Professor & HoD',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm (Pharmaceutics), B.Pharm',
    specialization: 'Dosage Form Design & Academic Leadership',
    email: 'waghmare456priyanka@gmail.com',
    profileUrl: '/faculty/prof-priyanka-waghmare',
    avatarInitials: 'PW',
    avatarColor: 'from-emerald-900 to-teal-700',
  },
  {
    id: 4,
    name: 'Prof. Krutika J. Warthi',
    role: 'Assistant Professor',
    department: 'Pharmaceutical Chemistry',
    qualification: 'M.Pharm (UDPS Nagpur), B.Pharm',
    specialization: 'Medicinal Synthesis & Clinical Research (ICH-GCP)',
    email: 'krutikawarthi14@gmail.com',
    profileUrl: '/faculty/prof-krutika-warthi',
    avatarInitials: 'KW',
    avatarColor: 'from-sky-900 to-blue-700',
  },
  {
    id: 5,
    name: 'Mrs. Neha Rumale',
    role: 'Assistant Professor',
    department: 'Pharmacology',
    qualification: 'M.Pharm (Pharmacology), B.Pharm, D.Pharm',
    specialization: 'In-vivo Screening, IPQA & Quality Control',
    email: 'madankarneha@gmail.com',
    profileUrl: '/faculty/prof-neha-rumale',
    avatarInitials: 'NR',
    avatarColor: 'from-rose-900 to-pink-700',
  },
  {
    id: 6,
    name: 'Prof. Pooja Pralhad Patle',
    role: 'Lecturer',
    department: 'Pharmaceutical Chemistry',
    qualification: 'M.Pharm, B.Pharm (8.15 CGPA)',
    specialization: 'AI in Pharma Research & International Best Paper Awardee',
    email: 'poojapatle000@gmail.com',
    profileUrl: '/faculty/prof-pooja-patle',
    avatarInitials: 'PP',
    avatarColor: 'from-amber-900 to-primary-700',
  },
  {
    id: 7,
    name: 'Prof. Samiksha Narendra Ajankar',
    role: 'Lecturer',
    department: 'Quality Assurance',
    qualification: 'M.Pharm (QA - 8.05 CGPA), B.Pharm',
    specialization: 'Quality Assurance, Analytical Validation & Clini India Graduate',
    email: 'sajankar2@gmail.com',
    profileUrl: '/faculty/prof-samiksha-ajankar',
    avatarInitials: 'SA',
    avatarColor: 'from-teal-900 to-cyan-700',
  },
  {
    id: 8,
    name: 'Prof. Vaishnavi G. Vaidya',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm (85.2% Distinction), B.Pharm (75.15%)',
    specialization: 'SEDDS Nanocarriers & Pharmacovigilance (Omasy)',
    email: 'vaishnavivaidya196@gmail.com',
    profileUrl: '/faculty/prof-vaishnavi-vaidya',
    avatarInitials: 'VV',
    avatarColor: 'from-sky-900 to-indigo-700',
  },
  {
    id: 9,
    name: 'Prof. Tarun V. Pavale',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm / B.Pharm',
    specialization: 'Pharmaceutics & Student Mentorship',
    avatarInitials: 'TP',
    avatarColor: 'from-gray-800 to-navy-700',
  },
  {
    id: 10,
    name: 'Prof. Akhil Gajananrao Mondhe',
    role: 'Lecturer',
    department: 'Quality Assurance',
    qualification: 'M.Pharm, GPAT Qualified (AIR 2148)',
    specialization: '5+ Years AR&D / QC (Hetero Labs & Inventys Research)',
    email: 'akhilmonde111@gmail.com',
    profileUrl: '/faculty/prof-akhil-mondhe',
    avatarInitials: 'AM',
    avatarColor: 'from-blue-900 to-cyan-700',
  },
  {
    id: 11,
    name: 'Prof. Lankesh D. Sakhare',
    role: 'Assistant Professor',
    department: 'Pharmaceutical Chemistry',
    qualification: 'M.Pharm / B.Pharm',
    specialization: 'Synthetic Chemistry & Laboratory Facilitation',
    avatarInitials: 'LS',
    avatarColor: 'from-gray-800 to-primary-800',
  },
  {
    id: 12,
    name: 'Prof. Ambika R. Watekar',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm / B.Pharm',
    specialization: 'Dosage Forms & Pharmaceutical Technology',
    avatarInitials: 'AW',
    avatarColor: 'from-emerald-950 to-teal-800',
  },
  {
    id: 13,
    name: 'Prof. Atul Nagdevte',
    role: 'Assistant Professor',
    department: 'Pharmacology',
    qualification: 'M.Pharm / B.Pharm',
    specialization: 'Pharmacological Testing & Hospital Training',
    avatarInitials: 'AN',
    avatarColor: 'from-purple-950 to-indigo-800',
  },
  {
    id: 14,
    name: 'Prof. Tejaswini Ambadas Mankar',
    role: 'Assistant Professor',
    department: 'Pharmacology',
    qualification: 'M.Pharm (Pharmacology - 8.85 CGPA), B.Pharm (8.01 CGPA)',
    specialization: 'Anti-Arthritic Bioassays & Experimental Pharmacology',
    email: 'tejumankar1999@gmail.com',
    profileUrl: '/faculty/prof-tejaswini-mankar',
    avatarInitials: 'TM',
    avatarColor: 'from-violet-900 to-purple-700',
  },
  {
    id: 15,
    name: 'Prof. Ashwini Sudhakar Shambharkar',
    role: 'Lecturer',
    department: 'Pharmacology',
    qualification: 'M.Pharm (UDPS Nagpur), GPAT Fellow (AICTE)',
    specialization: 'Novartis Clinical Scientific Expert & Neurobiology Research',
    email: 'ashwinishambharkar123@gmail.com',
    profileUrl: '/faculty/prof-ashwini-shambharkar',
    avatarInitials: 'AS',
    avatarColor: 'from-orange-950 to-amber-700',
  },
  {
    id: 16,
    name: 'Prof. Shivani R. Sawarkar',
    role: 'Lecturer',
    department: 'Quality Assurance',
    qualification: 'M.Pharm (QA - 8.98 CGPA), GPAT & NIPER Qualified',
    specialization: 'ICH Q2 R1 Method Validation & Copyright Holder',
    email: 'shivanisawarkar786@gmail.com',
    profileUrl: '/faculty/prof-shivani-sawarkar',
    avatarInitials: 'SS',
    avatarColor: 'from-primary-950 to-primary-700',
  },
  {
    id: 17,
    name: 'Prof. Pallavi Shankarrao Zode',
    role: 'Assistant Professor',
    department: 'Quality Assurance',
    qualification: 'M.Pharm (QA - 8.69 CGPA, IPER Wardha), B.Pharm',
    specialization: 'Cancer Co-Delivery Patent & 3 Registered Copyrights',
    email: 'pallavizode31@gmail.com',
    profileUrl: '/faculty/prof-pallavi-zode',
    avatarInitials: 'PZ',
    avatarColor: 'from-rose-950 to-rose-700',
  },
  {
    id: 18,
    name: 'Prof. Bratati Bhattacharjee',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm (77.63% Distinction, University 2nd Rank)',
    specialization: 'Nanostructured Lipid Carriers & Griha Software Best Employee',
    email: 'bratatibhattacharjee@gmail.com',
    profileUrl: '/faculty/prof-bratati-bhattacharjee',
    avatarInitials: 'BB',
    avatarColor: 'from-teal-950 to-emerald-700',
  },
  {
    id: 19,
    name: 'Prof. Sejal S. Dhage',
    role: 'Assistant Professor',
    department: 'Pharmaceutical Chemistry',
    qualification: 'M.Pharm (8.86 CGPA Distinction), B.Pharm',
    specialization: 'Molecular Docking, Microwave Synthesis & PCR Techniques',
    email: 'sejal.dhage2002@gmail.com',
    profileUrl: '/faculty/prof-sejal-dhage',
    avatarInitials: 'SD',
    avatarColor: 'from-purple-950 to-purple-700',
  },
  {
    id: 20,
    name: 'Prof. Heena Mahurkar',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm (RGPV Bhopal), B.Pharm (7.90 CGPA)',
    specialization: 'Lipid Drug Delivery, Herbal Gels & 3 Asian J. Pharm Papers',
    email: 'heenamahurkar881@gmail.com',
    profileUrl: '/faculty/prof-heena-mahurkar',
    avatarInitials: 'HM',
    avatarColor: 'from-amber-950 to-yellow-700',
  },
  {
    id: 21,
    name: 'Prof. Shejal Deodas Baghele',
    role: 'Assistant Professor',
    department: 'Pharmaceutics',
    qualification: 'M.Pharm (SPU Balaghat), B.Pharm (7.11 CGPA, RTMNU), MS-CIT (97%)',
    specialization: 'Nanoparticles for Targeted Delivery & Clinical Pharmacy',
    email: 'shejal.pharmacy@gpgit.com',
    profileUrl: '/faculty/prof-shejal-baghele',
    avatarInitials: 'SB',
    avatarColor: 'from-cyan-950 to-teal-700',
  },
  {
    id: 22,
    name: 'Prof. Mehawish Ajim Sheikh',
    role: 'Lecturer',
    department: 'Pharmaceutics',
    qualification: 'B.Pharm (73.03% Distinction, Gondwana Univ), M.Pharm Scholar',
    specialization: 'Herbal Topical Formulations & MUHS/PCI Statutory Compliance',
    email: 'mehawish.pharmacy@gpgit.com',
    profileUrl: '/faculty/prof-mehawish-sheikh',
    avatarInitials: 'MS',
    avatarColor: 'from-emerald-950 to-primary-700',
  },
]

function roleBadge(role: string) {
  if (role.includes('Principal')) {
    return 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
  }
  if (role.includes('HoD')) {
    return 'bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold'
  }
  if (role.includes('Associate Professor')) {
    return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold'
  }
  if (role.includes('Assistant Professor')) {
    return 'bg-emerald-100 text-emerald-900 border-emerald-300'
  }
  return 'bg-purple-100 text-purple-900 border-purple-300'
}

export default function Faculty() {
  useSeo({
    title: 'Faculty Directory — Teaching Staff & Academic Leadership | TGPCOP',
    description:
      'Explore the distinguished faculty of Tulsiramji Gaikwad Patil College of Pharmacy (TGPCOP), Nagpur — experienced professors, researchers, patent holders, and mentors in pharmaceutical sciences.',
  })

  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('All')

  const departments = useMemo(() => {
    const set = new Set(ALL_FACULTY.map((f) => f.department))
    return ['All', ...Array.from(set)]
  }, [])

  const filteredFaculty = useMemo(() => {
    return ALL_FACULTY.filter((f) => {
      const matchesSearch =
        search.trim() === '' ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.role.toLowerCase().includes(search.toLowerCase()) ||
        f.qualification.toLowerCase().includes(search.toLowerCase()) ||
        f.department.toLowerCase().includes(search.toLowerCase()) ||
        (f.specialization && f.specialization.toLowerCase().includes(search.toLowerCase()))

      const matchesDept = selectedDept === 'All' || f.department === selectedDept

      return matchesSearch && matchesDept
    })
  }, [search, selectedDept])

  return (
    <>
      <PageHeader
        title="Faculty Directory"
        description="Dedicated pharmaceutical educators, researchers, patent holders, and academic mentors at TGPCOP Nagpur."
        breadcrumbItems={[{ label: 'Faculty' }]}
      />

      <PageContainer className="py-10 md:py-14">
        {/* Top Summary Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-primary-950 to-navy-900 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-primary-800/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Academic Excellence & Research
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Our Distinguished Faculty
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mt-1.5 max-w-2xl leading-relaxed">
                Meet our 22 accomplished educators in Pharmaceutics, Pharmaceutical Chemistry, Quality Assurance, and Pharmacology. Click on any faculty member with a profile link to view their detailed academic background, patents, and research works.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3.5 rounded-xl border border-white/15">
              <Users className="w-6 h-6 text-amber-400" />
              <div>
                <div className="text-2xl font-bold font-heading text-white">{ALL_FACULTY.length}</div>
                <div className="text-xs text-gray-300 font-medium">Faculty Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty by name, qualification, specialization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-navy-900 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>

          {/* Department Filter Pills / Select */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  selectedDept === dept
                    ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                    : 'bg-white text-navy-800 border-border hover:bg-light-bg hover:border-gray-300'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-sm">
            <Users className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" />
            <h3 className="font-heading font-bold text-lg text-navy-900">No faculty members found</h3>
            <p className="text-sm text-muted mt-1">
              Try adjusting your search criteria or resetting the department filter.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedDept('All')
              }}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar & Badges */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.avatarColor} text-white flex items-center justify-center font-heading font-bold text-lg shadow-md shrink-0 border-2 border-white`}
                    >
                      {member.avatarInitials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${roleBadge(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-navy-900 leading-snug group-hover:text-primary-700 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs text-primary-600 font-semibold mt-0.5">
                        Dept. of {member.department}
                      </p>
                    </div>
                  </div>

                  {/* Qualification & Specialization */}
                  <div className="space-y-2.5 pt-3 border-t border-border/70 text-xs">
                    <div className="flex items-start gap-2 text-navy-800">
                      <GraduationCap className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-navy-900 block">Qualification:</span>
                        <span className="text-muted">{member.qualification}</span>
                      </div>
                    </div>

                    {member.specialization && (
                      <div className="flex items-start gap-2 text-navy-800">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-navy-900 block">Focus & Research:</span>
                          <span className="text-muted leading-relaxed">{member.specialization}</span>
                        </div>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-center gap-2 text-muted pt-1">
                        <Mail className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:underline hover:text-primary-600 truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  {member.profileUrl ? (
                    <Link
                      to={member.profileUrl}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white font-heading font-semibold text-xs sm:text-sm transition-all group-hover:shadow-sm"
                    >
                      View Complete Profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <div className="w-full text-center py-2 text-xs text-muted font-medium bg-light-bg rounded-xl border border-border/60">
                      Faculty Member • TGPCOP
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}
