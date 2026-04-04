import { useState } from 'react'
import AboutPage from './components/AboutPage.jsx'
import HealthPage from './components/HealthPage.jsx'

const PAGES = [
  { id: 'about',  label: 'Hồ sơ',      icon: '◈' },
  { id: 'health', label: 'Health',      icon: '◉' },
]

export default function App() {
  const [page, setPage] = useState('about')

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Student</span>
          Profile App
        </div>

        {PAGES.map(p => (
          <button
            key={p.id}
            className={`nav-btn ${page === p.id ? 'active' : ''}`}
            onClick={() => setPage(p.id)}
          >
            <span className="dot" />
            {p.label}
          </button>
        ))}

        <div className="sidebar-footer">
          React + Node.js<br />
          MongoDB + Docker
        </div>
      </aside>

      <main className="main">
        {page === 'about'  && <AboutPage />}
        {page === 'health' && <HealthPage />}
      </main>
    </div>
  )
}
