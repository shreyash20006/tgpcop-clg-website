import { useEffect, useState } from 'react'
import { getAnnouncements } from '@/services/siteSettings'
import { Megaphone } from 'lucide-react'

interface Announcement {
  id: string
  content: string
  link: string | null
  priority: number
  is_active: boolean
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    getAnnouncements().then(setAnnouncements).catch(() => {})
  }, [])

  if (announcements.length === 0) return null

  return (
    <div
      className="bg-primary-500 text-white text-sm relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center">
        <div className="bg-accent-500 text-white px-4 py-2 font-heading font-semibold text-xs uppercase tracking-wider shrink-0 z-10 flex items-center gap-1.5">
          <Megaphone className="w-3.5 h-3.5" />
          Notice
        </div>
        <div className="overflow-hidden flex-1">
          <div
            className={`flex whitespace-nowrap ${paused ? '' : 'animate-marquee'}`}
            style={!paused ? {
              animation: `marquee ${announcements.length * 8}s linear infinite`,
            } : undefined}
          >
            {announcements.map((a) => (
              <span key={a.id} className="inline-block px-8">
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    {a.content}
                  </a>
                ) : (
                  a.content
                )}
              </span>
            ))}
            {announcements.map((a) => (
              <span key={`dup-${a.id}`} className="inline-block px-8">
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    {a.content}
                  </a>
                ) : (
                  a.content
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
