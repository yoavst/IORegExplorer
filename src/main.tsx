import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Registry from './Pages/Registry'
import { Toaster } from 'sonner'

const root = document.getElementById('root')
if (root !== null) {
    createRoot(root).render(
        <StrictMode>
            <Registry />
            <Toaster theme="dark" duration={4000} />
        </StrictMode>
    )
}
