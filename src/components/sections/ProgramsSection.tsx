import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Users, GraduationCap, Pill } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { getPrograms, type ProgramRow } from '@/services/programs'
import { supabase } from '@/lib/supabase/client'

interface ProgramCard {
  id: string
  name: string
  short_name: string
  type: string
  duration: string | null
  seats: number | null
  eligibility: string | null
  description: string | null
  image_url: string | null
  video_url: string | null
}

const fallbackPrograms: ProgramCard[] = [
  {
    id: 'bpharm',
    name: 'B.Pharm',
    short_name: 'Bachelor of Pharmacy',
    type: 'Bachelor of Pharmacy',
    duration: '4 Years',
    seats: 100,
    eligibility: 'As per DTE Maharashtra / DBATU norms',
    description:
      'A comprehensive undergraduate degree covering pharmaceutical sciences, from drug discovery to patient care.',
    image_url: 'https://res.cloudinary.com/dsqxboxoc/image/upload/v1786900000/tgpcop_nagpur_14050525_223357831_n9vrtj.jpg',
    video_url: null,
  },
  {
    id: 'dpharm',
    name: 'D.Pharm',
    short_name: 'Diploma in Pharmacy',
    type: 'Diploma in Pharmacy',
    duration: '2 Years',
    seats: 60,
    eligibility: 'As per DTE Maharashtra / PCI norms',
    description:
      'A practice-oriented diploma preparing students for careers in community and hospital pharmacy.',
    image_url: null,
    video_url: 'https://res.cloudinary.com/dsqxboxoc/video/upload/v1786899946/tgpcop_nagpur_14050525_223403863_y6o4tv.mp4',
  },
]

export default function ProgramsSection() {
  const reduceMotion = useReducedMotion()
  const [programs, setPrograms] = useState<ProgramCard[]>(fallbackPrograms)

  useEffect(() => {
    if (!supabase) return
    getPrograms().then((data: ProgramRow[]) => {
      if (data && data.length > 0) {
        setPrograms(
          data.map((p) => ({
            id: p.id,
            name: p.short_name || p.name,
            short_name: p.code,
            type: p.code,
            duration: p.duration,
            seats: p.seats,
            eligibility: p.eligibility,
            description: p.description,
            image_url: p.image_url,
            video_url: (p as any).video_url ?? null,
          }))
        )
      }
    })
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
      <PageContainer>
        <SectionHeading
          label="Academic Programs"
          heading="Programs built for future pharmacists"
          description="Two focused programs aligned with PCI and DBATU requirements, combining classroom learning with laboratory practice."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {programs.map((program, i) => {
            const isBpharm = program.name.toUpperCase().startsWith('B.')
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.12 }}
                className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Media */}
                <div
                  className={`h-52 relative overflow-hidden bg-gradient-to-br ${
                    isBpharm ? 'from-navy-900 to-primary-500' : 'from-primary-600 via-navy-800 to-accent-500'
                  }`}
                >
                  {program.video_url ? (
                    <video
                      src={program.video_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      aria-label={`${program.name} campus video`}
                    />
                  ) : program.image_url ? (
                    <img
                      src={program.image_url}
                      alt={program.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/25">
                      {isBpharm ? (
                        <GraduationCap className="w-14 h-14" aria-hidden="true" />
                      ) : (
                        <Pill className="w-14 h-14" aria-hidden="true" />
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/70 to-transparent p-4 pt-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-navy-900 text-xs font-heading font-bold">
                      {program.name}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p
                    className={`text-xs font-heading font-semibold uppercase tracking-wider mb-2 ${
                      isBpharm ? 'text-primary-500' : 'text-accent-500'
                    }`}
                  >
                    {program.short_name}
                  </p>
                  <p className="text-dark-text text-sm leading-relaxed mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  <div className="space-y-2 text-sm text-muted mb-5">
                    {program.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" />
                        Duration: {program.duration}
                      </div>
                    )}
                    {program.seats !== null && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 shrink-0" />
                        Intake: {program.seats} Seats
                      </div>
                    )}
                    {program.eligibility && (
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{program.eligibility}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/academics"
                    className={`inline-flex items-center gap-1.5 text-sm font-heading font-semibold transition-colors ${
                      isBpharm ? 'text-primary-500 hover:text-primary-600' : 'text-accent-500 hover:text-accent-600'
                    }`}
                  >
                    View Program
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </PageContainer>
    </section>
  )
}
