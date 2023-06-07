import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.tsx'
import './index.css'
import WagmiWrapper from './components/WagmiWrapper.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiWrapper>
      <App />
    </WagmiWrapper>
  </React.StrictMode>,
)
