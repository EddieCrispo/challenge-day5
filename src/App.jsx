import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

// Components
import PublicLayout from './components/PublicLayout'

// Context
import { AuthProvider } from './contexts/AuthContext'

// Router
import { Route, Routes, Link } from 'react-router'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } />
          <Route path='/register' element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          } />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
