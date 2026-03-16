import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthGate from './auth/AuthGate'
import LoginPage from './pages/LoginPage'
import AdminHome from './pages/AdminHome'
import CoachHome from './pages/CoachHome'
import StudentHome from './pages/StudentHome'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthGate />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/coach" element={<CoachHome />} />
                <Route path="/student" element={<StudentHome />} />
            </Routes>
        </BrowserRouter>
    )
}
