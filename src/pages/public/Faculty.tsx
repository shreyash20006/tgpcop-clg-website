import { useEffect, useState } from 'react'
import { UserRound, Mail, GraduationCap, Briefcase } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getFaculty } from '@/services/faculty'

interface FacultyMember {
  id: string
  name: string
  designation: string
  department: string | null
  qualification: string | null
  experience: string | null
  email: string | null
  photo_url: string | null
}

const PAGE_SIZE = 12

export default function Faculty() {
  useSeo({
    title: 'Faculty',
    description: 'Faculty at TGPCOP Nagpur — teaching staff, designations, qualifications and departments.',
  })

  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  const load = async (p = page) => {
    setLoading(true)
    setError(false)
    try {
      const { data, count } = await getFaculty({
        search: debouncedSearch || undefined,
        department: department || undefined,
        page: p,
        pageSize: PAGE_SIZE,
      })
      setFaculty(data as FacultyMember[])
      setTotal(count)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, department, page])

  const departments = Array.from(new Set(faculty.map((f) => f.department).filter(Boolean))) as string[]

  return (
    <>
      <PageHeader
        title="Faculty"
        description="Qualified educators guiding TGPCOP students across pharmaceutical sciences."
        breadcrumbItems={[{ label: 'Faculty' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search faculty by name..."
            className="flex-1"
          />
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={() => load(page)} />
        ) : faculty.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title={debouncedSearch || department ? 'No faculty found' : 'Faculty listing coming soon'}
            description={
              debouncedSearch || department
                ? 'Try adjusting your search or filters.'
                : 'Faculty profiles will be published once verified information is available from the college.'
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {faculty.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-navy-900 to-primary-600 flex items-center justify-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-heading font-bold text-white text-4xl">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-sm text-navy-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-primary-500 text-xs font-medium mt-0.5">{member.designation}</p>
                    {member.department && (
                      <p className="text-muted text-xs mt-1">{member.department}</p>
                    )}
                    <div className="mt-3 space-y-1.5 text-xs text-muted">
                      {member.qualification && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          {member.qualification}
                        </div>
                      )}
                      {member.experience && (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          {member.experience}
                        </div>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-1.5 text-primary-500 hover:text-primary-600 truncate"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </PageContainer>
    </>
  )
}
