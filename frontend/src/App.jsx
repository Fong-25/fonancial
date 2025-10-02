
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  return (
    <>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}
