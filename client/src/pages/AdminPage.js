import React, { useState, useEffect, useCallback } from 'react';
import {
  getAdminUsers, updateUserRole, deleteUser,
  getAllSongs, createSong, updateSong, deleteSong
} from '../api/api';

const INITIAL_SONG = { title: '', artist: '', genre: '', lyrics: '', audioUrl: '', coverUrl: '', duration: '' };

export default function AdminPage() {
  const [tab, setTab] = useState('users'); // 'users' | 'songs'

  /* ── Users ── */
  const [users,       setUsers]       = useState([]);
  const [usersLoading,setUsersLoading]= useState(true);

  /* ── Songs ── */
  const [songs,       setSongs]       = useState([]);
  const [songsLoading,setSongsLoading]= useState(true);
  const [showSongForm,setShowSongForm]= useState(false);
  const [editingSong, setEditingSong] = useState(null); // null = create, object = edit
  const [songForm,    setSongForm]    = useState(INITIAL_SONG);
  const [formSaving,  setFormSaving]  = useState(false);
  const [formError,   setFormError]   = useState('');

  /* Load data */
  useEffect(() => {
    getAdminUsers()
      .then(r => { if (r.data.success) setUsers(r.data.data); })
      .catch(() => {})
      .finally(() => setUsersLoading(false));

    getAllSongs()
      .then(r => { if (r.data.success) setSongs(r.data.data); })
      .catch(() => {})
      .finally(() => setSongsLoading(false));
  }, []);

  /* ── User actions ── */
  const handleRoleChange = useCallback(async (id, role) => {
    await updateUserRole(id, role).catch(() => {});
    setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
  }, []);

  const handleDeleteUser = useCallback(async (id, name) => {
    if (!window.confirm(`Xóa người dùng "${name}"?`)) return;
    await deleteUser(id).catch(() => {});
    setUsers(prev => prev.filter(u => u._id !== id));
  }, []);

  /* ── Song actions ── */
  const openCreateForm = () => {
    setEditingSong(null);
    setSongForm(INITIAL_SONG);
    setFormError('');
    setShowSongForm(true);
  };

  const openEditForm = (song) => {
    setEditingSong(song);
    setSongForm({
      title: song.title || '',
      artist: song.artist || '',
      genre: song.genre || '',
      lyrics: song.lyrics || '',
      audioUrl: song.audioUrl || '',
      coverUrl: song.coverUrl || '',
      duration: song.duration || '',
    });
    setFormError('');
    setShowSongForm(true);
  };

  const handleSongFormChange = (field, val) => {
    setSongForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSongSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormError('');
    if (!songForm.title || !songForm.artist) {
      setFormError('Tên bài hát và nghệ sĩ là bắt buộc'); return;
    }
    setFormSaving(true);
    try {
      if (editingSong) {
        await updateSong(editingSong._id, songForm);
        setSongs(prev => prev.map(s => s._id === editingSong._id ? { ...s, ...songForm } : s));
      } else {
        const res = await createSong(songForm);
        if (res.data.success) setSongs(prev => [res.data.data, ...prev]);
      }
      setShowSongForm(false);
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Không thể lưu bài hát');
    } finally { setFormSaving(false); }
  }, [editingSong, songForm]);

  const handleDeleteSong = useCallback(async (id, title) => {
    if (!window.confirm(`Xóa bài hát "${title}"?`)) return;
    await deleteSong(id).catch(() => {});
    setSongs(prev => prev.filter(s => s._id !== id));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Panel</h1>
        <p className="page-subtitle">Quản lý người dùng và bài hát</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab${tab==='users'?' active':''}`} onClick={() => setTab('users')}>
          👥 Người dùng ({users.length})
        </button>
        <button className={`admin-tab${tab==='songs'?' active':''}`} onClick={() => setTab('songs')}>
          🎵 Bài hát ({songs.length})
        </button>
      </div>

      {/* ─── USERS TAB ─── */}
      {tab === 'users' && (
        <>
          {usersLoading && <div className="spinner-wrap"><div className="spinner" /></div>}
          {!usersLoading && users.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-title">Chưa có người dùng nào</div>
            </div>
          )}
          {!usersLoading && users.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Quyền</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td className="primary">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {u.avatar
                            ? <img src={u.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }} />
                            : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                                {(u.name||'?')[0].toUpperCase()}
                              </div>
                          }
                          {u.name || '—'}
                        </div>
                      </td>
                      <td>{u.email || <span style={{ color: 'var(--text-muted)' }}>Facebook</span>}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <select
                            className="select-input"
                            value={u.role}
                            onChange={e => handleRoleChange(u._id, e.target.value)}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            title="Xóa người dùng"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ─── SONGS TAB ─── */}
      {tab === 'songs' && (
        <>
          {/* Create form */}
          {showSongForm && (
            <div className="admin-form-card">
              <div className="admin-form-title">
                {editingSong ? '✏️ Chỉnh sửa bài hát' : '➕ Thêm bài hát mới'}
              </div>
              {formError && <div className="form-error">⚠️ {formError}</div>}
              <form onSubmit={handleSongSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">Tên bài hát *</label>
                    <input className="form-input" type="text" value={songForm.title} onChange={e => handleSongFormChange('title', e.target.value)} placeholder="Shape of You..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nghệ sĩ *</label>
                    <input className="form-input" type="text" value={songForm.artist} onChange={e => handleSongFormChange('artist', e.target.value)} placeholder="Ed Sheeran..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thể loại</label>
                    <input className="form-input" type="text" value={songForm.genre} onChange={e => handleSongFormChange('genre', e.target.value)} placeholder="Pop, R&B, Electronic..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thời lượng (giây)</label>
                    <input className="form-input" type="number" value={songForm.duration} onChange={e => handleSongFormChange('duration', e.target.value)} placeholder="233" />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">URL file âm thanh</label>
                    <input className="form-input" type="text" value={songForm.audioUrl} onChange={e => handleSongFormChange('audioUrl', e.target.value)} placeholder="https://... hoặc /uploads/audio/..." />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">URL ảnh bìa</label>
                    <input className="form-input" type="text" value={songForm.coverUrl} onChange={e => handleSongFormChange('coverUrl', e.target.value)} placeholder="https://... hoặc /uploads/images/..." />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Lời bài hát</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={songForm.lyrics}
                      onChange={e => handleSongFormChange('lyrics', e.target.value)}
                      placeholder="Nhập lời bài hát..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={formSaving}>
                    {formSaving ? 'Đang lưu...' : (editingSong ? 'Cập nhật' : 'Thêm bài hát')}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowSongForm(false)}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Toolbar */}
          {!showSongForm && (
            <div style={{ marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={openCreateForm}>
                ➕ Thêm bài hát
              </button>
            </div>
          )}

          {songsLoading && <div className="spinner-wrap"><div className="spinner" /></div>}

          {!songsLoading && songs.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎵</div>
              <div className="empty-state-title">Chưa có bài hát nào</div>
              <div className="empty-state-text">Nhấn "Thêm bài hát" để bắt đầu</div>
            </div>
          )}

          {!songsLoading && songs.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bài hát</th>
                    <th>Nghệ sĩ</th>
                    <th>Thể loại</th>
                    <th>Lượt nghe</th>
                    <th>Ngày thêm</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((s, idx) => (
                    <tr key={s._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td className="primary">{s.title}</td>
                      <td>{s.artist}</td>
                      <td>
                        {s.genre
                          ? <span style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent2)', fontSize: 11, padding: '2px 10px', borderRadius: 99, fontWeight: 600 }}>{s.genre}</span>
                          : <span style={{ color: 'var(--text-muted)' }}>—</span>
                        }
                      </td>
                      <td>{(s.plays || 0).toLocaleString()}</td>
                      <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString('vi-VN') : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-icon" onClick={() => openEditForm(s)} title="Chỉnh sửa">✏️</button>
                          <button className="btn-icon danger" onClick={() => handleDeleteSong(s._id, s.title)} title="Xóa">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
