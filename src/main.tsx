import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/mulish/wght.css';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
