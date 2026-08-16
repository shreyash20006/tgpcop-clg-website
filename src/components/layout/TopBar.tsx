import { Phone, MapPin, ShieldCheck, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function TopBar() {
  const { user, role } = useAuth()
  const staffRoles = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team', 'club_manager']
  const isStaff = Boolean(user && role && staffRoles.includes(role))

  return (
    <div className="bg-navy-900 text-white/80 text-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
        <div className="flex items-center gap-6">
          <a href="https://maps.google.com/?q=NH-44+Mohgaon+Wardha+Road+Nagpur+441108" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            <span>NH-44, Mohgaon, Wardha Road, Nagpur – 441108</span>
          </a>
          <a href="tel:+919763711372" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 97637 11372</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60">DTE Code: <span className="text-cyan-400 font-medium">4673</span></span>
          <span className="text-white/20">|</span>
          <Link to="/student-verification" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Verify Student
          </Link>
          <span className="text-white/20">|</span>
          {isStaff ? (
            <Link to="/admin" className="text-amber-300 hover:text-amber-200 transition-colors font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          ) : user ? (
            <Link to="/student" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>
          ) : (
            <Link to="/login" className="text-white/70 hover:text-white transition-colors">
              Portal Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
