import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Electron IPC is only available in the Electron renderer environment.
const electronIpc = (window as any).ipcRenderer
if (electronIpc && typeof electronIpc.on === 'function') {
  electronIpc.on('main-process-message', (_event: unknown, message: unknown) => {
    console.log(message)
  })
}
