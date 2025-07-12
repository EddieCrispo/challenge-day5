import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App.jsx'

import { AuthProvider } from './contexts/AuthContext'
import { TransactionProvider } from './contexts/TransactionContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
          <App />
    </BrowserRouter>
  </StrictMode>
)
