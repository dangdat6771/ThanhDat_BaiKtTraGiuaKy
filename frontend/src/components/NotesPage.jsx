import { useState, useEffect } from 'react'
import { getNotes, addNote, deleteNote } from '../api/index.js'

const TAGS = ['general', 'study', 'project', 'reminder', 'idea']

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', tag: 'general' })

  const load = async () => {
    setLoading(true)
    try { setNotes(await getNotes()) }
    catch (e) { setMsg({ type: 'error', text: e.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async e => {
    e.preventDefault()
    setPosting(true); setMsg(null)
    try {
      await addNote(form)
      setForm({ title: '', content: '', tag: 'general' })
      setMsg({ type: 'success', text: 'Đã thêm ghi chú!' })
      setTimeout(() => setMsg(null), 2500)
      await load()
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async id => {
    try {
      await deleteNote(id)
      setNotes(n => n.filter(x => x._id !== id))
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ghi <em>chú</em></h1>
          <p className="page-subtitle">GET /notes · POST /notes · DELETE /notes/:id</p>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          {notes.length} ghi chú
        </span>
      </div>

      <div className="page-content">
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <p className="card-label">Thêm ghi chú mới</p>
          <form className="form" onSubmit={handleAdd}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tiêu đề *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề ghi chú" required />
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select className="form-input" name="tag" value={form.tag} onChange={handleChange}>
                  {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nội dung *</label>
              <textarea className="form-textarea" name="content" value={form.content} onChange={handleChange} placeholder="Nhập nội dung ghi chú..." required />
            </div>
            <div>
              <button className="btn btn-primary" type="submit" disabled={posting}>
                {posting ? 'Đang lưu...' : '+ Thêm ghi chú'}
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div className="skeleton" style={{ height: '70px' }} />
            </div>
          ))
        ) : notes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📝</div>
            <p>Chưa có ghi chú nào. Hãy thêm ghi chú đầu tiên!</p>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map(n => (
              <div className="note-item" key={n._id}>
                <div className="note-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span className="note-title">{n.title}</span>
                    <span className="note-tag">{n.tag}</span>
                  </div>
                  <div className="note-content">{n.content}</div>
                  <div className="note-meta">
                    {new Date(n.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <button className="btn btn-danger" onClick={() => handleDelete(n._id)}>Xóa</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
