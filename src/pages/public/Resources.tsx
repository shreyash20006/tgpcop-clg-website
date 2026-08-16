import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Download, FileText, Link2 } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import Pagination from '@/components/ui/Pagination'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getResources, type ResourceCategory } from '@/services/resources'
import { supabase } from '@/lib/supabase/client'

interface ResourceItem {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  file_size: number
  course: string
  year: number | null
  semester: number | null
  subject: string | null
  category: string
  download_count: number
}

const PAGE_SIZE = 12

const categories = [
  { label: 'All', value: '' },
  { label: 'Notes', value: 'notes' },
  { label: 'Study Material', value: 'study_material' },
  { label: 'Question Papers', value: 'question_papers' },
  { label: 'Syllabus', value: 'syllabus' },
  { label: 'Previous Year Papers', value: 'previous_year' },
  { label: 'Useful Links', value: 'useful_links' },
]

function formatSize(bytes: number) {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(0)} ${units[i]}`
}

export default function Resources() {
  useSeo({
    title: 'Resources',
    description: 'Student resources at TGPCOP — notes, study material, question papers, syllabus and previous year papers.',
  })

  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'' | ResourceCategory>('')
  const [course, setCourse] = useState<'' | 'bpharm' | 'dpharm'>('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(false)
    getResources({
      category: category || undefined,
      course: course || undefined,
      page,
      pageSize: PAGE_SIZE,
    })
      .then(({ data, count }) => {
        const filtered = debouncedSearch
          ? (data as ResourceItem[]).filter((r) => {
              const q = debouncedSearch.toLowerCase()
              return (
                r.title.toLowerCase().includes(q) ||
                (r.subject?.toLowerCase().includes(q) ?? false)
              )
            })
          : (data as ResourceItem[])
        setResources(filtered)
        setTotal(count)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [debouncedSearch, category, course, page])

  return (
    <>
      <PageHeader
        title="Student Resources"
        description="Notes, study material, question papers and more — shared and reviewed by the college."
        breadcrumbItems={[{ label: 'Resources' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Search by title or subject..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as '' | ResourceCategory)
                setPage(1)
              }}
              className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
              aria-label="Filter by type"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={course}
              onChange={(e) => {
                setCourse(e.target.value as '' | 'bpharm' | 'dpharm')
                setPage(1)
              }}
              className="px-4 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
              aria-label="Filter by course"
            >
              <option value="">All Courses</option>
              <option value="bpharm">B.Pharm</option>
              <option value="dpharm">D.Pharm</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingState count={6} type="list" />
        ) : error ? (
          <ErrorState onRetry={() => setPage(page)} />
        ) : resources.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={search || category || course ? 'No resources found' : 'No resources yet'}
            description={
              search || category || course
                ? 'Try adjusting your filters.'
                : 'Approved resources shared by the college and students will appear here.'
            }
          />
        ) : (
          <>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white border border-border rounded-xl p-5 flex items-start sm:items-center gap-4 flex-col sm:flex-row"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    {resource.category === 'useful_links' ? (
                      <Link2 className="w-5 h-5 text-primary-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-navy-900">
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="text-muted text-sm mt-0.5 line-clamp-1">{resource.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <Badge variant="primary">{resource.category.replace(/_/g, ' ')}</Badge>
                      <Badge>{resource.course === 'bpharm' ? 'B.Pharm' : resource.course === 'dpharm' ? 'D.Pharm' : 'All Courses'}</Badge>
                      {resource.year && <Badge>Year {resource.year}</Badge>}
                      {resource.semester && <Badge>Sem {resource.semester}</Badge>}
                      {resource.subject && <Badge>{resource.subject}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {resource.file_size > 0 && (
                      <span className="text-xs text-muted hidden md:block">{formatSize(resource.file_size)}</span>
                    )}
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white text-xs font-heading font-medium rounded-md hover:bg-primary-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {resource.category === 'useful_links' ? 'Open' : 'Download'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} className="mt-8" />
          </>
        )}

        <div className="mt-12 bg-light-bg border border-border rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-sm text-navy-900 mb-1">
              Want to share a resource?
            </h3>
            <p className="text-muted text-sm">
              Sign in to the student portal to submit study material for review.
            </p>
          </div>
          <Link
            to="/student/resources"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-heading font-medium text-sm rounded-md hover:bg-primary-600 transition-colors shrink-0"
          >
            Submit Resource
          </Link>
        </div>
      </PageContainer>
    </>
  )
}
