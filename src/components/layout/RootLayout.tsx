import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useHashScroll } from '@/hooks/useHashScroll'
import Header from './Header'
import Footer from './Footer'

export default function RootLayout() {
  const location = useLocation()

  useHashScroll()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <div className="relative flex min-h-dvh flex-col max-w-[1440px] mx-auto">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
