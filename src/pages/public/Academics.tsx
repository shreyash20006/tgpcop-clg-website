import { Link } from 'react-router-dom'
import { Clock, Users, BookOpen, FileText, CalendarDays, GraduationCap, ArrowRight } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'

const resources = [
  { icon: CalendarDays, label: 'Academic Calendar', note: 'Published by the university each year' },
  { icon: FileText, label: 'Syllabus', note: 'As per DBATU curriculum' },
  { icon: BookOpen, label: 'Study Resources', note: 'Notes and materials in the student portal', path: '/resources' },
  { icon: GraduationCap, label: 'Examinations', note: 'Conducted per DBATU norms' },
]

export default function Academics() {
  useSeo({
    title: 'Academics',
    description: 'Academic programs at TGPCOP — B.Pharm and D.Pharm, departments, faculty and academic resources.',
  })

  return (
    <>
      <PageHeader
        title="Academics"
        description="Programs, departments and academic resources at Tulsiramji Gaikwad-Patil College of Pharmacy."
        breadcrumbItems={[{ label: 'Academics' }]}
      />

      <PageContainer className="py-12 md:py-16">
        {/* Programs */}
        <SectionHeading
          label="Programs"
          heading="Courses offered at TGPCOP"
          description="The college offers two pharmacy programs approved by PCI and affiliated to DBATU, Lonere."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'B.Pharm',
              full: 'Bachelor of Pharmacy',
              duration: '4 Years (8 Semesters)',
              seats: '100 Seats',
              description:
                'Undergraduate degree program covering pharmaceutics, pharmacology, pharmaceutical chemistry, pharmacognosy and pharmacy practice.',
            },
            {
              name: 'D.Pharm',
              full: 'Diploma in Pharmacy',
              duration: '2 Years',
              seats: '60 Seats',
              description:
                'Diploma program focused on dispensing pharmacy, community pharmacy and hospital pharmacy practice.',
            },
          ].map((program) => (
            <div key={program.name} className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-navy-900 to-primary-600 px-6 py-5">
                <h3 className="font-heading font-bold text-xl text-white">{program.name}</h3>
                <p className="text-white/70 text-sm">{program.full}</p>
              </div>
              <div className="p-6">
                <p className="text-dark-text/80 text-sm leading-relaxed mb-5">{program.description}</p>
                <div className="space-y-2.5 text-sm text-muted mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {program.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Intake: {program.seats}
                  </div>
                </div>
                <Link
                  to="/admissions"
                  className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600"
                >
                  Admission details
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Departments */}
        <div id="departments" className="mt-14 scroll-mt-24">
          <SectionHeading
            label="Departments"
            heading="Academic departments"
            description="Department pages with faculty listings will be populated as information is published by the college."
          />
          <div className="bg-light-bg border border-border rounded-xl p-6 text-center text-muted text-sm">
            Department details will be updated with official information from the college administration.
          </div>
        </div>

        {/* Faculty link */}
        <div className="mt-14">
          <SectionHeading label="People" heading="Our Faculty" />
          <div className="bg-white border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-base text-navy-900 mb-1">
                Meet our teaching staff
              </h3>
              <p className="text-muted text-sm">
                Browse faculty profiles, qualifications and departments.
              </p>
            </div>
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-heading font-medium text-sm rounded-md hover:bg-primary-600 transition-colors shrink-0"
            >
              View Faculty
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Academic resources */}
        <div className="mt-14">
          <SectionHeading label="Resources" heading="Academic Resources" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource) =>
              resource.path ? (
                <Link
                  key={resource.label}
                  to={resource.path}
                  className="flex items-center gap-4 bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <resource.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-navy-900">{resource.label}</h4>
                    <p className="text-muted text-sm">{resource.note}</p>
                  </div>
                </Link>
              ) : (
                <div key={resource.label} className="flex items-center gap-4 bg-white border border-border rounded-xl p-5">
                  <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <resource.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-navy-900">{resource.label}</h4>
                    <p className="text-muted text-sm">{resource.note}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}
