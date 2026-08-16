import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, UserCircle, Bell, ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'

const items = [
  {
    icon: GraduationCap,
    title: 'Admissions',
    description: 'Eligibility, process, documents and important dates for B.Pharm and D.Pharm.',
    path: '/admissions',
  },
  {
    icon: BookOpen,
    title: 'Academic Programs',
    description: 'Explore our Bachelor of Pharmacy and Diploma in Pharmacy programs.',
    path: '/academics',
  },
  {
    icon: UserCircle,
    title: 'Student Portal',
    description: 'Notices, events, resources and certificates — all in one place.',
    path: '/student',
  },
  {
    icon: Bell,
    title: 'Latest Notices',
    description: 'Official announcements, circulars and important updates.',
    path: '/notices',
  },
]

export default function QuickAccess() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <PageContainer>
        <SectionHeading
          label="Quick Access"
          heading="Find what you need, fast"
          align="center"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group bg-white border border-border rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary-300"
            >
              <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary-500">
                <item.icon className="w-5 h-5 text-primary-500 transition-colors group-hover:text-white" />
              </div>
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{item.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-heading font-medium text-primary-500">
                Visit
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
