import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Users } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import PageContainer from '@/components/layout/PageContainer'
import { getPrograms } from '@/services/programs'
import { supabase } from '@/lib/supabase/client'

interface ProgramCard {
  id: string
  name: string
  type: string
  duration: string | null
  seats: number | null
  eligibility: string | null
  description: string | null
}

const fallbackPrograms: ProgramCard[] = [
  {
    id: 'bpharm',
    name: 'B.Pharm',
    type: 'Bachelor of Pharmacy',
    duration: '4 Years',
    seats: 100,
    eligibility: 'As per DTE Maharashtra / DBATU norms',
    description:
      'A comprehensive undergraduate degree covering pharmaceutical sciences, from drug discovery to patient care.',
  },
  {
    id: 'dpharm',
    name: 'D.Pharm',
    type: 'Diploma in Pharmacy',
    duration: '2 Years',
    seats: 60,
    eligibility: 'As per DTE Maharashtra / PCI norms',
    description:
      'A practice-oriented diploma preparing students for careers in community and hospital pharmacy.',
  },
]

export default function ProgramsSection() {
  const reduceMotion = useReducedMotion()
  const [programs, setPrograms] = useState<ProgramCard[]>(fallbackPrograms)

  useEffect(() => {
    if (!supabase) return
    getPrograms().then((data) => {
      if (data && data.length > 0) {
        setPrograms(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.code,
            duration: p.duration,
            seats: p.seats,
            eligibility: p.eligibility,
            description: p.description,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.12 }}
              className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="bg-gradient-to-br from-navy-900 to-primary-600 h-36 flex items-center justify-center">
                <span className="font-heading font-bold text-white text-2xl">{program.name}</span>
              </div>
              <div className="p-6">
                <p className="text-cyan-500 text-xs font-heading font-semibold uppercase tracking-wider mb-2">
                  {program.type}
                </p>
                <p className="text-dark-text text-sm leading-relaxed mb-4">{program.description}</p>
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
                </div>
                <Link
                  to="/academics"
                  className="inline-flex items-center gap-1.5 text-sm font-heading font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  View Program
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
