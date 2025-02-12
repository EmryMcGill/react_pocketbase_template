import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { PbProvider } from './PbContext.jsx';

createRoot(document.getElementById('root')).render(
  <PbProvider>
    <App />
  </PbProvider>,
)
