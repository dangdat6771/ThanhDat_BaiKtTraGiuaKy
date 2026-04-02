import { useState, useEffect } from 'react'
import { getHealth } from '../api/index.js'

export default function HealthPage() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const check = async () => {
    setLoading(true); setError(null)
    try { setHealth(await getHealth()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { check() }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Health <em>Check</em></h1>
          <p className="page-subtitle">GET /health</p>
        </div>
        <button className="btn btn-ghost" onClick={check} disabled={loading}>
          {loading ? '...' : '↺ Refresh'}
        </button>
      </div>

      <div className="page-content">
        {error ? (
          <div className="alert alert-error">❌ {error}</div>
        ) : loading ? (
          <div className="card">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ marginBottom: '0.75rem', width: `${50 + i * 15}%` }} />
            ))}
          </div>
        ) : health ? (
          <>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <p className="card-label">Raw JSON response</p>
              <pre style={{
                fontFamily: 'var(--mono)', fontSize: '0.8rem',
                color: 'var(--accent)', background: 'rgba(255,255,255,0.03)',
                padding: '1rem', borderRadius: 'var(--radius)', overflowX: 'auto',
              }}>
                {JSON.stringify(health, null, 2)}
              </pre>
            </div>

            <div className="health-grid">
              {Object.entries(health).map(([k, v]) => (
                <div className="health-item" key={k}>
                  <div className="health-key">{k}</div>
                  <div className={`health-val ${v === 'ok' || v === 'connected' ? 'ok' : ''}`}>
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
