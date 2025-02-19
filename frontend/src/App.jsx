import { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemaStore } from './store/useThemaStore'
import {Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast'

function App() {
  const {authUser,checkAuth ,isChechingAuth,onlineUsers}=useAuthStore()
  const {theme}=useThemaStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  if(isChechingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center-h screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage />: <Navigate to="/login" />} />
        <Route path="/login" element={!authUser? <LoginPage />: <Navigate to="/" />} />
        <Route path="/signup" element={!authUser? <SignUpPage />: <Navigate to="/" />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
