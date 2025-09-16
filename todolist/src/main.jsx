import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TodosProvider from './TodosContext'
import AuthProvider from "./context/AuthContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodosProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </TodosProvider>
  </StrictMode>
)
