import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAuth } from './contexts/useAuth'
import { Toaster } from 'react-hot-toast'

import { Dashboard } from './pages/Dashboard'
import { Income } from './pages/Income'
import { Expenses } from './pages/Expenses'
import { Budget } from './pages/Budget'
import { Analytics } from './pages/Analytics'
import { Export } from './pages/Export'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

const RequireAuth = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />

            <Route path="/income" element={
              <RequireAuth>
                <Income />
              </RequireAuth>
            } />

            <Route path="/expenses" element={
              <RequireAuth>
                <Expenses />
              </RequireAuth>
            } />

            <Route path="/budget" element={
              <RequireAuth>
                <Budget />
              </RequireAuth>
            } />

            <Route path="/export" element={
              <RequireAuth>
                <Export />
              </RequireAuth>
            } />

            <Route path="/analytics" element={
              <RequireAuth>
                <Analytics />
              </RequireAuth>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}
