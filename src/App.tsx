import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import InfoPage from './pages/InfoPage'
import OpEdPage from './pages/OpEdPage'
import PhonofilePage from './pages/PhonofilePage'
import LeafMotion from './pages/LeafMotion'

export default function App() {
  return (
    <BrowserRouter unstable_useTransitions={false}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="work/op-ed-typeface" element={<OpEdPage />} />
          <Route path="work/phonofile" element={<PhonofilePage />} />
          <Route path="work/leaf-animation-tokens" element={<LeafMotion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
