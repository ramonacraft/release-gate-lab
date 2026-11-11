import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WatchApp } from './watch/WatchApp.tsx'

const isWatchDemo = window.location.pathname.startsWith('/watch')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isWatchDemo ? <WatchApp /> : <App />}</StrictMode>,
)
