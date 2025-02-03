import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './routes/Homepage.jsx'
import Learning from './routes/Learning.jsx'
import ChordDiagrams from './routes/ChordDiagrams.jsx'
import MySongs from './routes/MySongs.jsx'

const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/homepage', element: <Homepage />},
  {path: '/learning', element: <Learning />},
  {path: '/chord-diagrams', element: <ChordDiagrams />},
  {path: '/my-songs', element: <MySongs />}
]) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
