import { Route, Routes } from './router'
import LandingPage from './pages/LandingPage'
import StudioPage from './pages/StudioPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
