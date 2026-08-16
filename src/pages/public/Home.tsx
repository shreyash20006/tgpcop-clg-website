import Hero from '@/components/sections/Hero'
import QuickAccess from '@/components/sections/QuickAccess'
import AboutSection from '@/components/sections/AboutSection'
import ProgramsSection from '@/components/sections/ProgramsSection'
import WhyTgpcop from '@/components/sections/WhyTgpcop'
import EventsPreview from '@/components/sections/EventsPreview'
import NewsNoticesPreview from '@/components/sections/NewsNoticesPreview'
import StudentLifeSection from '@/components/sections/StudentLifeSection'
import ResearchSection from '@/components/sections/ResearchSection'
import PortalCta from '@/components/sections/PortalCta'
import GalleryPreview from '@/components/sections/GalleryPreview'
import ContactSection from '@/components/sections/ContactSection'
import { useSeo } from '@/lib/seo'

export default function Home() {
  useSeo({
    title: 'Home',
    description:
      'Tulsiramji Gaikwad-Patil College of Pharmacy (TGPCOP), Nagpur — PCI approved pharmacy college affiliated to DBATU. B.Pharm and D.Pharm admissions open.',
  })

  return (
    <>
      <Hero />
      <QuickAccess />
      <AboutSection />
      <ProgramsSection />
      <WhyTgpcop />
      <EventsPreview />
      <NewsNoticesPreview />
      <StudentLifeSection />
      <ResearchSection />
      <PortalCta />
      <GalleryPreview />
      <ContactSection />
    </>
  )
}
