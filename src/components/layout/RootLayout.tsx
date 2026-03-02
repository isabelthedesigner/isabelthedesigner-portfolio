import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function RootLayout() {
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
