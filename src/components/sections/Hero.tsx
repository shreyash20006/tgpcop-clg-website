import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, GraduationCap } from 'lucide-react'
import CampusHeroVideo from '@/components/hero/CampusHeroVideo'

const stats = [
  { value: '100', suffix: '+', label: 'B.Pharm Seats', accent: 'text-accent-400' },
  { value: '60', suffix: '', label: 'D.Pharm Seats', accent: 'text-cyan-300' },
  { value: '2023', suffix: '', label: 'Established', accent: 'text-accent-400' },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.15 } },
  }

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section className="relative overflow-hidden bg-navy-950 min-h-[620px] md:min-h-[650px] lg:min-h-[720px] flex items-center">
      {/* Campus video background (decorative, with navy-gradient fallback) */}
      <CampusHeroVideo />

      {/* Readability overlay: strong on the left where text sits, open on the right so the campus stays visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5, 20, 40, 0.88) 0%, rgba(5, 20, 40, 0.65) 45%, rgba(5, 20, 40, 0.30) 100%)',
        }}
      />
      {/* Subtle bottom fade anchoring the section edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, rgba(5, 20, 40, 0.75), transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-[720px]"
        >
          <motion.p
            variants={item}
            className="text-cyan-400 text-xs sm:text-sm font-heading font-semibold uppercase mb-4"
            style={{ letterSpacing: '0.18em' }}
          >
            Tulsiramji Gaikwad-Patil College of Pharmacy
          </motion.p>

          <motion.h1
            variants={item}
            className="font-heading font-bold text-white text-[2.5rem] leading-[1.08] sm:text-5xl lg:text-[4.25rem] mb-5"
          >
            Shaping the Future of
            <br />
            Pharmaceutical Sciences
          </motion.h1>

          <motion.p
            variants={item}
            className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-[650px] font-body"
          >
            Empowering future pharmaceutical professionals through quality education,
            innovation, research and industry-focused learning.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-white font-heading font-semibold rounded-md hover:bg-accent-600 transition-colors"
            >
              Explore TGPCOP
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.08] border border-white/35 text-white font-heading font-medium rounded-md hover:bg-white hover:text-navy-900 transition-colors"
            >
              Admissions 2026–27
            </Link>
            <Link
              to="/student"
              className="hidden sm:inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500/25 border border-cyan-400/40 text-cyan-300 font-heading font-medium rounded-md hover:bg-primary-500/40 hover:text-white transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 md:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg divide-x divide-white/15"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-white">
                  {stat.value}
                  {stat.suffix && <span className={stat.accent}>{stat.suffix}</span>}
                </div>
                <div className="text-white/65 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
