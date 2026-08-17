import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'

const labs = [
  {
    title: 'Pharmacology Lab',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900587/Pharmacology_Lab_kyx1x2.png',
    description:
      'Pharmacology Lab consists of equipment to investigate the activity of various drug samples, such as Rota Rod, Electro-convulsiometer, Analgesiometer, Histamine chamber and Actophotometer.',
  },
  {
    title: 'Pharmacognosy Lab',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900586/Pharmacognosy_Lab_f5a3cj.png',
    description:
      'Pharmacognosy Lab provides an opportunity for students to gain knowledge of physicochemical properties of natural products and natural medications — including identification tests, extraction, isolation, detection, determination and estimation of natural products, and quantitative and qualitative analysis of drugs.',
  },
  {
    title: 'Pharmaceutical Chemistry Lab',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900585/Pharmaceutical_Chemistry_Lab_cc7h33.png',
    description:
      'Studying Pharmaceutical Chemistry allows students to contribute to life-saving remedies, enhance the speed of delivery of new medications, and help others.',
  },
  {
    title: 'Pharmaceutics Lab',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900585/Pharmaceutics_Lab_hdx5fh.png',
    description:
      'Pharmaceutics Lab is the discipline of pharmacy that deals with the practical aspects of manufacturing, formulation and evaluation of various pharmaceutical dosage forms. The subject also helps students acquire knowledge and skill to apply quality assurance principles, including legal and ethical aspects.',
  },
  {
    title: 'Instrument Room',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900585/Instrument_Room_cbjdoo.jpg',
    description:
      'The Instrument Room has adequate instruments for conducting practical sessions in the course curriculum — including UV-VIS Spectrophotometer, Flame Photometer, Tablet Disintegration Apparatus, and Tablet Dissolution equipment.',
  },
  {
    title: 'Machine Room',
    image: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900585/Machine_Room_kro4j4.jpg',
    description:
      'Each machine has a separate platform with Standard Operating Procedure, Log Book, Standard Cleaning Procedure, and Calibration / Validation and Operation Manual.',
  },
]


const faculty: { sr: number; name: string; role: string; profileUrl?: string }[] = [
  { sr: 1,  name: 'Dr. Awdhut D. Pimple',   role: 'Principal', profileUrl: '/faculty/dr-awdhut-pimpale' },
  { sr: 2,  name: 'Mr. Lalit G. Pund',      role: 'Associate Professor', profileUrl: '/faculty/mr-lalit-pund' },
  { sr: 3,  name: 'Prof. Priyanka Waghmare', role: 'HoD', profileUrl: '/faculty/prof-priyanka-waghmare' },
  { sr: 4,  name: 'Prof. Krutika Warthi',    role: 'Assistant Professor', profileUrl: '/faculty/prof-krutika-warthi' },
  { sr: 5,  name: 'Prof. Neha Rumale',       role: 'Lecturer', profileUrl: '/faculty/prof-neha-rumale' },
  { sr: 6,  name: 'Prof. Pooja Patle',       role: 'Lecturer', profileUrl: '/faculty/prof-pooja-patle' },
  { sr: 7,  name: 'Prof. Samiksha Ajankar',  role: 'Lecturer', profileUrl: '/faculty/prof-samiksha-ajankar' },
  { sr: 8,  name: 'Prof. Vaishnavi Vaidya',  role: 'Assistant Professor', profileUrl: '/faculty/prof-vaishnavi-vaidya' },
  { sr: 9,  name: 'Prof. Tarun V. Pavale',   role: 'Assistant Professor' },
  { sr: 10, name: 'Prof. Akhil G. Mondhe',   role: 'Lecturer', profileUrl: '/faculty/prof-akhil-mondhe' },
  { sr: 11, name: 'Prof. Lankesh D. Sakhare',role: 'Lecturer' },
  { sr: 12, name: 'Prof. Ambika R. Watekar', role: 'Lecturer' },
  { sr: 13, name: 'Prof. Atul Nagdevte',     role: 'Vising Faculty (Mathematics)' },
  { sr: 14, name: 'Tejswini Mankar',         role: 'Assistant Professor', profileUrl: '/faculty/prof-tejaswini-mankar' },
  { sr: 15, name: 'Ashwini Shambharkar',     role: 'Lecturer', profileUrl: '/faculty/prof-ashwini-shambharkar' },
  { sr: 16, name: 'Shivani Sawarkar',        role: 'Lecturer', profileUrl: '/faculty/prof-shivani-sawarkar' },
  { sr: 17, name: 'Pallavi Zode',            role: 'Assistant Professor', profileUrl: '/faculty/prof-pallavi-zode' },
  { sr: 18, name: 'Bratati Bhattacharjee',   role: 'Assistant Professor', profileUrl: '/faculty/prof-bratati-bhattacharjee' },
  { sr: 19, name: 'Sejal Dhage',             role: 'Assistant Professor', profileUrl: '/faculty/prof-sejal-dhage' },
  { sr: 20, name: 'Heena Mahurkar',          role: 'Assistant Professor', profileUrl: '/faculty/prof-heena-mahurkar' },
  { sr: 21, name: 'Shejal Baghele',          role: 'Assistant Professor', profileUrl: '/faculty/prof-shejal-baghele' },
  { sr: 22, name: 'Mehawish Sheikh',         role: 'Lecturer', profileUrl: '/faculty/prof-mehawish-sheikh' },
]

function roleBadge(role: string) {
  if (role === 'Principal')           return 'bg-primary-600 text-white'
  if (role === 'HoD')                 return 'bg-emerald-600 text-white'
  if (role === 'Associate Professor') return 'bg-indigo-500 text-white'
  if (role === 'Assistant Professor') return 'bg-sky-500 text-white'
  return 'bg-gray-200 text-gray-700'   // Lecturer / Visiting
}

export default function Campus() {
  useSeo({
    title: 'Campus',
    description:
      'Campus and facilities at TGPCOP Nagpur — laboratories, library, classrooms, seminar hall, computer facilities and sports.',
  })

  return (
    <>
      <PageHeader
        title="Campus & Facilities"
        description="Infrastructure supporting quality pharmaceutical education at TGPCOP."
        breadcrumbItems={[{ label: 'Campus' }]}
      />

      {/* Labs Showcase */}
      <PageContainer className="py-12 md:py-16">
        <SectionHeading
          label="Our Laboratories"
          heading="State-of-the-art lab facilities"
          description="Purpose-built labs equipped to PCI norms, giving students hands-on experience with industry-standard instruments and techniques."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div
              key={lab.title}
              className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="relative h-52 overflow-hidden bg-navy-900">
                <img
                  src={lab.image}
                  alt={lab.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                <span className="absolute bottom-3 left-4 text-white text-sm font-heading font-semibold drop-shadow">
                  {lab.title}
                </span>
              </div>
              <div className="p-5">
                <p className="text-muted text-sm leading-relaxed">{lab.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Library Section */}
      <div className="bg-light-bg border-y border-border">
        <PageContainer className="py-12 md:py-16">
          <SectionHeading
            label="Library"
            heading="A knowledge hub for every learner"
            description="The learning process is supported by a rich and voluminous library with all-time internet facility for students and staff."
          />

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 rounded-2xl overflow-hidden">
            {[
              { src: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786901257/2_skyyrh.jpg', alt: 'Library view 1' },
              { src: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786901257/1_xj9qws.jpg', alt: 'Library view 2' },
              { src: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786901256/3_ls5kbf.jpg', alt: 'Library view 3' },
              { src: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786901256/4_sp342b.jpg', alt: 'Library view 4' },
            ].map((img) => (
              <div key={img.src} className="relative aspect-video overflow-hidden rounded-xl bg-navy-900 group">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Description + Salient Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="font-heading font-semibold text-lg text-navy-900 mb-3">About the Library</h3>
              <p className="text-muted text-sm leading-relaxed">
                Our library is supported by around <span className="font-medium text-navy-900">2,260 reference books</span>, national/international journals, periodicals and other readable articles accessible online through the internet. Library software guides students for easy issue and return of books. It is constructed with the help of many experts and immense hard work, dedicated solely to improving students with recent knowledge.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-navy-900 mb-3">Salient Features</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  'Capacity of more than 100 students at a time.',
                  'E-Library equipped with Wi-Fi for internet access on personal notebooks/laptops.',
                  'National and international printed journals available to students free of cost for literature surveys.',
                  'Open access for books is available.',
                  'Pleasant atmosphere is one of its highlights.',
                ].map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-primary-500/15 text-primary-600 flex items-center justify-center text-[10px] font-bold">→</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Faculty Members */}
      <PageContainer className="py-12 md:py-16">
        <SectionHeading
          label="Our Team"
          heading="Faculty Members"
          description="Meet the dedicated educators and staff who guide students on their pharmaceutical journey."
        />
        <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-950 text-white">
                <th className="py-3 px-4 text-left font-heading font-semibold w-12">#</th>
                <th className="py-3 px-4 text-left font-heading font-semibold">Name</th>
                <th className="py-3 px-4 text-left font-heading font-semibold">Designation</th>
                <th className="py-3 px-4 text-right font-heading font-semibold">Profile</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f, i) => (
                <tr
                  key={f.sr}
                  className={`border-t border-border transition-colors duration-150 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-light-bg'
                  } hover:bg-primary-50`}
                >
                  <td className="py-3 px-4 text-muted font-mono text-xs">{f.sr}</td>
                  <td className="py-3 px-4 font-medium text-navy-900">
                    {f.profileUrl ? (
                      <Link
                        to={f.profileUrl}
                        className="text-primary-700 hover:text-primary-800 hover:underline font-semibold"
                      >
                        {f.name}
                      </Link>
                    ) : (
                      f.name
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        roleBadge(f.role)
                      }`}
                    >
                      {f.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {f.profileUrl ? (
                      <Link
                        to={f.profileUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        View Profile →
                      </Link>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>

    </>
  )
}
