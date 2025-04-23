import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Registry from './Pages/Registry.jsx'

const root = document.getElementById('root')
if (root !== null) {
    createRoot(root).render(
        <StrictMode>
            <Registry />
        </StrictMode>
    )
}
