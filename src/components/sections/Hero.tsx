import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, GraduationCap } from 'lucide-react'

const stats = [
  { value: '100', suffix: '+', label: 'B.Pharm Seats' },
  { value: '60', suffix: '', label: 'D.Pharm Seats' },
  { value: '2023', suffix: '', label: 'Established' },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.15 } },
  }

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section className="relative bg-navy-900 overflow-hidden">
      {/* Navy gradient backdrop in lieu of a campus photo until official assets are supplied */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="py-24 md:py-32 lg:py-36 max-w-3xl"
        >
          <motion.p
            variants={item}
            className="text-cyan-400 text-xs sm:text-sm font-heading font-semibold uppercase tracking-[0.2em] mb-4"
          >
            Tulsiramji Gaikwad-Patil College of Pharmacy
          </motion.p>

          <motion.h1
            variants={item}
            className="font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5"
          >
            Shaping the Future of Pharmaceutical Sciences
          </motion.h1>

          <motion.p
            variants={item}
            className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
          >
            Empowering future pharmaceutical professionals through quality education, innovation,
            research and industry-focused learning.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white font-heading font-medium rounded-md hover:bg-primary-400 transition-colors"
            >
              Explore TGPCOP
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-navy-900 font-heading font-semibold rounded-md hover:bg-cyan-400 transition-colors"
            >
              Admissions 2026–27
            </Link>
            <Link
              to="/student"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/25 text-white font-heading font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 md:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg divide-x divide-white/10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-white">
                  {stat.value}
                  {stat.suffix && <span className="text-cyan-400">{stat.suffix}</span>}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
