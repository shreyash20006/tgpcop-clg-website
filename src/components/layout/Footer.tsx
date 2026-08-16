import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import BrandLogo from './BrandLogo'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Events', path: '/events' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
]

const academicLinks = [
  { label: 'B.Pharm', path: '/academics' },
  { label: 'D.Pharm', path: '/academics' },
  { label: 'Faculty', path: '/faculty' },
  { label: 'Research', path: '/research' },
  { label: 'Resources', path: '/resources' },
  { label: 'Placements', path: '/placements' },
]

const studentLinks = [
  { label: 'Student Portal', path: '/student' },
  { label: 'Verify Student', path: '/student-verification' },
  { label: 'Clubs', path: '/clubs' },
  { label: 'News & Notices', path: '/news' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* College Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <BrandLogo variant="light" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-md">
              Tulsiramji Gaikwad-Patil College of Pharmacy, affiliated to Dr. Babasaheb Ambedkar Technological University, Lonere, and approved by Pharmacy Council of India & DTE Maharashtra.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <a href="https://maps.google.com/?q=NH-44+Mohgaon+Wardha+Road+Nagpur+441108" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <MapPin className="w-4 h-4 shrink-0" />
                NH-44, Mohgaon, Wardha Road, Nagpur – 441108
              </a>
              <a href="tel:+919763711372" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +91 97637 11372
              </a>
              <a href="mailto:principal_pharmacy@gpgit.com" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                principal_pharmacy@gpgit.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-white/70 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Academics</h3>
            <ul className="space-y-2.5">
              {academicLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-white/70 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Services */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-4">Student Services</h3>
            <ul className="space-y-2.5">
              {studentLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-white/70 hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Tulsiramji Gaikwad-Patil College of Pharmacy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
            <Link to="/accessibility" className="hover:text-cyan-400 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
