import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import LoadingState from '@/components/ui/LoadingState'

// Public pages
const Home = lazy(() => import('@/pages/public/Home'))
const About = lazy(() => import('@/pages/public/About'))
const Academics = lazy(() => import('@/pages/public/Academics'))
const Admissions = lazy(() => import('@/pages/public/Admissions'))
const Faculty = lazy(() => import('@/pages/public/Faculty'))
const FacultyDetail = lazy(() => import('@/pages/public/FacultyDetail'))
const FacultyDetailLalitPund = lazy(() => import('@/pages/public/FacultyDetailLalitPund'))
const FacultyDetailPriyankaWaghmare = lazy(() => import('@/pages/public/FacultyDetailPriyankaWaghmare'))
const FacultyDetailKrutikaWarthi = lazy(() => import('@/pages/public/FacultyDetailKrutikaWarthi'))
const FacultyDetailNehaRumale = lazy(() => import('@/pages/public/FacultyDetailNehaRumale'))
const FacultyDetailPoojaPatle = lazy(() => import('@/pages/public/FacultyDetailPoojaPatle'))
const FacultyDetailSamikshaAjankar = lazy(() => import('@/pages/public/FacultyDetailSamikshaAjankar'))
const FacultyDetailVaishnaviVaidya = lazy(() => import('@/pages/public/FacultyDetailVaishnaviVaidya'))
const FacultyDetailAkhilMondhe = lazy(() => import('@/pages/public/FacultyDetailAkhilMondhe'))
const FacultyDetailTejaswiniMankar = lazy(() => import('@/pages/public/FacultyDetailTejaswiniMankar'))
const FacultyDetailAshwiniShambharkar = lazy(() => import('@/pages/public/FacultyDetailAshwiniShambharkar'))
const FacultyDetailShivaniSawarkar = lazy(() => import('@/pages/public/FacultyDetailShivaniSawarkar'))
const FacultyDetailPallaviZode = lazy(() => import('@/pages/public/FacultyDetailPallaviZode'))
const FacultyDetailBratatiBhattacharjee = lazy(() => import('@/pages/public/FacultyDetailBratatiBhattacharjee'))
const FacultyDetailSejalDhage = lazy(() => import('@/pages/public/FacultyDetailSejalDhage'))
const FacultyDetailHeenaMahurkar = lazy(() => import('@/pages/public/FacultyDetailHeenaMahurkar'))
const FacultyDetailShejalBaghele = lazy(() => import('@/pages/public/FacultyDetailShejalBaghele'))
const FacultyDetailMehawishSheikh = lazy(() => import('@/pages/public/FacultyDetailMehawishSheikh'))
const Campus = lazy(() => import('@/pages/public/Campus'))
const Events = lazy(() => import('@/pages/public/Events'))
const EventDetail = lazy(() => import('@/pages/public/EventDetail'))
const News = lazy(() => import('@/pages/public/News'))
const NewsDetail = lazy(() => import('@/pages/public/NewsDetail'))
const Notices = lazy(() => import('@/pages/public/Notices'))
const Resources = lazy(() => import('@/pages/public/Resources'))
const Clubs = lazy(() => import('@/pages/public/Clubs'))
const Research = lazy(() => import('@/pages/public/Research'))
const Placements = lazy(() => import('@/pages/public/Placements'))
const Gallery = lazy(() => import('@/pages/public/Gallery'))
const AlbumDetail = lazy(() => import('@/pages/public/AlbumDetail'))
const Contact = lazy(() => import('@/pages/public/Contact'))
const StudentVerification = lazy(() => import('@/pages/public/StudentVerification'))
const NotFound = lazy(() => import('@/pages/public/NotFound'))

// Auth pages
const Login = lazy(() => import('@/pages/public/Login'))
const StudentLogin = lazy(() => import('@/pages/public/StudentLogin'))
const Register = lazy(() => import('@/pages/public/Register'))
const ForgotPassword = lazy(() => import('@/pages/public/ForgotPassword'))

// Student portal
const StudentLayout = lazy(() => import('@/pages/student/Layout'))
const StudentDashboard = lazy(() => import('@/pages/student/Dashboard'))
const StudentProfile = lazy(() => import('@/pages/student/Profile'))
const StudentEvents = lazy(() => import('@/pages/student/Events'))
const StudentResources = lazy(() => import('@/pages/student/Resources'))
const StudentNotices = lazy(() => import('@/pages/student/Notices'))
const StudentCertificates = lazy(() => import('@/pages/student/Certificates'))

// Admin
const AdminLayout = lazy(() => import('@/pages/admin/Layout'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminStudents = lazy(() => import('@/pages/admin/Students'))
const AdminVerification = lazy(() => import('@/pages/admin/Verification'))
const AdminStaff = lazy(() => import('@/pages/admin/Staff'))
const AdminEvents = lazy(() => import('@/pages/admin/Events'))
const AdminNews = lazy(() => import('@/pages/admin/News'))
const AdminNotices = lazy(() => import('@/pages/admin/Notices'))
const AdminResources = lazy(() => import('@/pages/admin/Resources'))
const AdminFaculty = lazy(() => import('@/pages/admin/Faculty'))
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'))
const AdminPrograms = lazy(() => import('@/pages/admin/Programs'))
const AdminEnquiries = lazy(() => import('@/pages/admin/Enquiries'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

const STAFF_ROLES = ['admin', 'teacher', 'lab_assistant', 'librarian', 'media_team', 'club_manager'] as const

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingState count={1} type="card" className="w-72" />
    </div>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/faculty/dr-awdhut-pimpale" element={<FacultyDetail />} />
          <Route path="/faculty/mr-lalit-pund" element={<FacultyDetailLalitPund />} />
          <Route path="/faculty/prof-priyanka-waghmare" element={<FacultyDetailPriyankaWaghmare />} />
          <Route path="/faculty/prof-krutika-warthi" element={<FacultyDetailKrutikaWarthi />} />
          <Route path="/faculty/prof-neha-rumale" element={<FacultyDetailNehaRumale />} />
          <Route path="/faculty/prof-pooja-patle" element={<FacultyDetailPoojaPatle />} />
          <Route path="/faculty/prof-samiksha-ajankar" element={<FacultyDetailSamikshaAjankar />} />
          <Route path="/faculty/prof-vaishnavi-vaidya" element={<FacultyDetailVaishnaviVaidya />} />
          <Route path="/faculty/prof-akhil-mondhe" element={<FacultyDetailAkhilMondhe />} />
          <Route path="/faculty/prof-tejaswini-mankar" element={<FacultyDetailTejaswiniMankar />} />
          <Route path="/faculty/prof-ashwini-shambharkar" element={<FacultyDetailAshwiniShambharkar />} />
          <Route path="/faculty/prof-shivani-sawarkar" element={<FacultyDetailShivaniSawarkar />} />
          <Route path="/faculty/prof-pallavi-zode" element={<FacultyDetailPallaviZode />} />
          <Route path="/faculty/prof-bratati-bhattacharjee" element={<FacultyDetailBratatiBhattacharjee />} />
          <Route path="/faculty/prof-sejal-dhage" element={<FacultyDetailSejalDhage />} />
          <Route path="/faculty/prof-heena-mahurkar" element={<FacultyDetailHeenaMahurkar />} />
          <Route path="/faculty/prof-shejal-baghele" element={<FacultyDetailShejalBaghele />} />
          <Route path="/faculty/prof-mehawish-sheikh" element={<FacultyDetailMehawishSheikh />} />
          <Route path="/campus" element={<Campus />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/research" element={<Research />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<AlbumDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student-verification" element={<StudentVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="events" element={<StudentEvents />} />
          <Route path="resources" element={<StudentResources />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="certificates" element={<StudentCertificates />} />
        </Route>

        {/* Admin / staff routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[...STAFF_ROLES]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
