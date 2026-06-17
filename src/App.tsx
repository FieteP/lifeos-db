import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrainingDetailPage from './pages/TrainingDetailPage'
import SchoolPage from './pages/SchoolPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/training" element={<TrainingDetailPage />} />
      <Route path="/school" element={<SchoolPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
