const BASE = '/api'   // proxied by nginx → backend:5000

export async function getProfile() {
  const res = await fetch(`${BASE}/about`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function saveProfile(data) {
  const res = await fetch(`${BASE}/about`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getHealth() {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
