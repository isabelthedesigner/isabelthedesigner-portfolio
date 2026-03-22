import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import HomePage from './pages/HomePage'
import InfoPage from './pages/InfoPage'
import OpEdPage from './pages/OpEdPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="work/op-ed-typeface" element={<OpEdPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
