import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './brand.css'
import './index.css'
import './fonts.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App initialPathname={window.location.pathname.replace(/\/$/, '') || '/'} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
