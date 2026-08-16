import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import AppRouter from '@/router'
import PharmacyLoader from '@/components/ui/PharmacyLoader'

export default function App() {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && (
        <PharmacyLoader onComplete={() => setShowLoader(false)} duration={2800} />
      )}
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

