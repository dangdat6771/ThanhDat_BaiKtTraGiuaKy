import { useState, useEffect } from 'react'
import { getProfile, saveProfile } from '../api/index.js'

export default function AboutPage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  const [form, setForm] = useState({
    fullName: '', studentId: '', className: '',
    major: 'Công nghệ thông tin', email: '', bio: '',
  })

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await getProfile()
      setProfile(data)
      if (data) {
        setForm({
          fullName: data.fullName || '',
          studentId: data.studentId || '',
          className: data.className || '',
          major: data.major || '',
          email: data.email || '',
          bio: data.bio || '',
        })
      } else {
        setEditing(true)
      }
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProfile() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true); setMsg(null)
    try {
      const res = await saveProfile(form)
      setProfile(res.student)
      setEditing(false)
      setMsg({ type: 'success', text: res.message })
      setTimeout(() => setMsg(null), 3000)
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Thông tin <em>cá nhân</em></h1>
          <p className="page-subtitle">GET /about · POST /about</p>
        </div>
        {profile && !editing && (
          <button className="btn btn-ghost" onClick={() => setEditing(true)}>Chỉnh sửa</button>
        )}
      </div>

      <div className="page-content">
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {loading ? (
          <div className="card">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ marginBottom: '0.75rem', width: `${60 + i * 10}%` }} />
            ))}
          </div>
        ) : editing ? (
          <div className="card">
            <p className="card-label">{ profile ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới' }</p>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input className="form-input" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Nguyễn Văn A" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mã số sinh viên *</label>
                  <input className="form-input" name="studentId" value={form.studentId} onChange={handleChange} placeholder="2151012345" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Lớp *</label>
                  <input className="form-input" name="className" value={form.className} onChange={handleChange} placeholder="CNTT2021A" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Chuyên ngành</label>
                  <input className="form-input" name="major" value={form.major} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-textarea" name="bio" value={form.bio} onChange={handleChange} placeholder="Giới thiệu ngắn về bản thân..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                </button>
                {profile && (
                  <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>Hủy</button>
                )}
              </div>
            </form>
          </div>
        ) : profile ? (
          <div className="card">
            <p className="card-label">Hồ sơ sinh viên</p>
            <div className="profile-grid">
              <div className="profile-field">
                <div className="field-label">Họ và tên</div>
                <div className="field-value" style={{ fontSize: '1.15rem' }}>{profile.fullName}</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Mã số sinh viên</div>
                <div className="field-value accent">{profile.studentId}</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Lớp</div>
                <div className="field-value">{profile.className}</div>
              </div>
              <div className="profile-field">
                <div className="field-label">Chuyên ngành</div>
                <div className="field-value">{profile.major}</div>
              </div>
              {profile.email && (
                <div className="profile-field" style={{ gridColumn: '1/-1' }}>
                  <div className="field-label">Email</div>
                  <div className="field-value">{profile.email}</div>
                </div>
              )}
              {profile.bio && (
                <div className="profile-field" style={{ gridColumn: '1/-1' }}>
                  <div className="field-label">Bio</div>
                  <div className="field-value" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{profile.bio}</div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
