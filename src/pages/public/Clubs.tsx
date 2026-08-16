import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import PageHeader from '@/components/layout/PageHeader'
import LoadingState from '@/components/ui/LoadingState'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import { useSeo } from '@/lib/seo'
import { getClubs } from '@/services/clubs'
import { supabase } from '@/lib/supabase/client'

interface Club {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string | null
  cover_url: string | null
  category: string | null
  member_count: number
}

const clubCategories = ['Technical', 'Cultural', 'Sports', 'Student Council', 'Pharmacy', 'Media', 'Social Initiatives']

export default function Clubs() {
  useSeo({
    title: 'Clubs',
    description: 'Student clubs at TGPCOP Nagpur — technical, cultural, sports, media and social initiative clubs.',
  })

  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    getClubs()
      .then((data) => setClubs(data as Club[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="Clubs & Student Activities"
        description="Join a club, pursue your interests and build skills beyond the classroom."
        breadcrumbItems={[{ label: 'Clubs' }]}
      />

      <PageContainer className="py-12 md:py-16">
        <div className="flex flex-wrap gap-2 mb-8">
          {clubCategories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-1.5 bg-light-bg border border-border rounded-full text-sm font-heading font-medium text-dark-text"
            >
              {cat}
            </span>
          ))}
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : clubs.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Clubs coming soon"
            description="Club pages with members, activities and galleries will be published as clubs are formally constituted."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-br from-navy-900 to-primary-600 h-32 flex items-center justify-center">
                  {club.logo_url ? (
                    <img src={club.logo_url} alt={`${club.name} logo`} className="w-16 h-16 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <Users className="w-10 h-10 text-white/25" aria-hidden="true" />
                  )}
                </div>
                <div className="p-5">
                  {club.category && <Badge variant="primary" className="mb-2">{club.category}</Badge>}
                  <h3 className="font-heading font-semibold text-base text-navy-900 mb-2">{club.name}</h3>
                  <p className="text-muted text-sm line-clamp-3 leading-relaxed mb-4">{club.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {club.member_count} members
                    </span>
                    <button className="px-4 py-2 bg-primary-50 text-primary-500 text-xs font-heading font-medium rounded-md hover:bg-primary-500 hover:text-white transition-colors">
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  )
}
