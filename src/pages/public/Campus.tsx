import { FlaskConical, Library, Presentation, MonitorSmartphone, Trophy, Building2 } from 'lucide-react'
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

const facilities = [
  {
    icon: FlaskConical,
    title: 'Laboratories',
    description:
      'Pharmaceutics, pharmacology, pharmaceutical chemistry and pharmacognosy labs built to PCI norms.',
  },
  {
    icon: Library,
    title: 'Library',
    description:
      'A growing collection of textbooks, reference books, journals and digital learning resources.',
  },
  {
    icon: Presentation,
    title: 'Classrooms & Seminar Hall',
    description:
      'Spacious, well-ventilated classrooms and a seminar hall for lectures and events.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Computer Facilities',
    description:
      'Computer lab with internet access supporting digital learning and e-resources.',
  },
  {
    icon: Trophy,
    title: 'Sports',
    description: 'Indoor and outdoor sports facilities encouraging physical activity and teamwork.',
  },
  {
    icon: Building2,
    title: 'Infrastructure',
    description:
      'A developing campus on NH-44, Wardha Road with modern academic infrastructure.',
  },
]

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

      {/* General Facilities */}
      <div className="bg-light-bg border-y border-border">
        <PageContainer className="py-12 md:py-16">
          <SectionHeading
            label="Infrastructure"
            heading="Explore our campus"
            description="Facilities at TGPCOP are designed to support both academic learning and student wellbeing."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((facility) => (
              <div
                key={facility.title}
                className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-br from-navy-900 to-primary-600 h-36 flex items-center justify-center">
                  <facility.icon className="w-10 h-10 text-white/25" aria-hidden="true" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white border border-border rounded-xl p-6 text-sm text-muted leading-relaxed">
            Hostel and cafeteria details will be published once officially confirmed by the college
            administration. For specific facility enquiries, please contact the college office.
          </div>
        </PageContainer>
      </div>
    </>
  )
}
