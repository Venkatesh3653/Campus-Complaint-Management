import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import { Login, Register } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import NewComplaintPage from './pages/NewComplaint'
import ComplaintDetail from './pages/ComplaintDetail'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
export default function App() {
  return <BrowserRouter><AppProvider><Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/app" element={<AppLayout />}><Route index element={<Dashboard />} /><Route path="complaints" element={<Complaints />} /><Route path="complaints/new" element={<NewComplaintPage />} />
      <Route path="complaints/:id" element={<ComplaintDetail />} /><Route path="notifications" element={<Notifications />} /><Route path="profile" element={<Profile />} /></Route>
  </Routes></AppProvider></BrowserRouter>
}
