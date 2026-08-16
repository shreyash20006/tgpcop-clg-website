import { useEffect, useState } from 'react'
import { BookOpen, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { useSeo } from '@/lib/seo'
import { useDebounce } from '@/hooks/useDebounce'
import { getPendingResources, approveResource, rejectResource } from '@/services/resources'
import { supabase } from '@/lib/supabase/client'

interface ResourceRow {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  course: string
  subject: string | null
  category: string
  status: string
}

export default function AdminResources() {
  useSeo({ title: 'Manage Resources' })

  const [resources, setResources] = useState<ResourceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await getPendingResources()
      setResources(data as ResourceRow[])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    load()
  }, [])

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionId(id)
    try {
      if (action === 'approve') {
        await approveResource(id)
      } else {
        await rejectResource(id)
      }
      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch {
      load()
    } finally {
      setActionId(null)
    }
  }

  const filtered = debouncedSearch
    ? resources.filter((r) => r.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : resources

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-navy-900 mb-1">Resources</h1>
      <p className="text-muted text-sm mb-6">
        Review student-submitted resources. Only approved resources become publicly visible.
      </p>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search pending resources..."
        className="max-w-md mb-6"
      />

      {loading ? (
        <LoadingState count={3} type="list" />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? 'No matching resources' : 'No pending resources'}
          description={
            search
              ? 'Try a different search.'
              : 'Student submissions awaiting review will appear here.'
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((resource) => (
            <div key={resource.id} className="bg-white border border-amber-200 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 className="font-heading font-semibold text-base text-navy-900">
                      {resource.title}
                    </h3>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  {resource.description && (
                    <p className="text-muted text-sm mb-2">{resource.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary">{resource.category.replace(/_/g, ' ')}</Badge>
                    <Badge>{resource.course === 'bpharm' ? 'B.Pharm' : 'D.Pharm'}</Badge>
                    {resource.subject && <Badge>{resource.subject}</Badge>}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <a
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-border text-dark-text text-xs font-heading font-medium rounded-md hover:bg-light-bg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View File
                  </a>
                  <Button
                    size="sm"
                    onClick={() => handleAction(resource.id, 'approve')}
                    loading={actionId === resource.id}
                    className="flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleAction(resource.id, 'reject')}
                    disabled={actionId === resource.id}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
