import React, { useState, useEffect, useCallback } from 'react';
import {
  getPlaylists, createPlaylist, deletePlaylist,
  removeSongFromPlaylist
} from '../api/api';
import { usePlayer } from '../contexts/PlayerContext';
import { staticUrl } from '../api/api';

export default function PlaylistsPage() {
  const [playlists,   setPlaylists]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState(null); // id đang expand
  const [creating,    setCreating]    = useState(false);
  const [newName,     setNewName]     = useState('');
  const [savingNew,   setSavingNew]   = useState(false);
  const [error,       setError]       = useState('');

  const { play, isCurrentSong } = usePlayer();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    setLoading(true);
    getPlaylists()
      .then(res => { if (res.data.success) setPlaylists(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  /* Tạo playlist */
  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSavingNew(true); setError('');
    try {
      const res = await createPlaylist(newName.trim());
      if (res.data.success) {
        setPlaylists(prev => [res.data.data, ...prev]);
        setNewName('');
        setCreating(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tạo playlist');
    } finally { setSavingNew(false); }
  }, [newName]);

  /* Xóa playlist */
  const handleDelete = useCallback(async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Xác nhận xóa playlist này?')) return;
    await deletePlaylist(id).catch(() => {});
    setPlaylists(prev => prev.filter(p => p._id !== id));
    if (expanded === id) setExpanded(null);
  }, [expanded]);

  /* Xóa bài khỏi playlist */
  const handleRemoveSong = useCallback(async (playlistId, songId) => {
    await removeSongFromPlaylist(playlistId, songId).catch(() => {});
    setPlaylists(prev =>
      prev.map(p =>
        p._id === playlistId
          ? { ...p, songs: p.songs.filter(s => s._id !== songId) }
          : p
      )
    );
  }, []);

  /* Cover art cho card playlist (lấy tối đa 4 bài) */
  const PlaylistCover = ({ songs }) => {
    const imgs = (songs || []).slice(0, 4).map(s => staticUrl(s.coverUrl)).filter(Boolean);
    if (imgs.length === 0) return <div className="playlist-card-cover single">🎶</div>;
    if (imgs.length < 4)   return <div className="playlist-card-cover single"><span style={{ fontSize: 56 }}>🎶</span></div>;
    return (
      <div className="playlist-card-cover">
        {imgs.map((src, i) => (
          <img key={i} className="playlist-cover-img" src={src} alt="" onError={e => { e.target.style.display='none'; }} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🎵 Playlist của bạn</h1>
        <p className="page-subtitle">Quản lý và nghe playlist cá nhân</p>
      </div>

      {/* Create playlist button */}
      <div style={{ marginBottom: 24 }}>
        {!creating ? (
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            ＋ Tạo playlist mới
          </button>
        ) : (
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 420 }}>
            <input
              className="form-input"
              style={{ flex: 1 }}
              type="text"
              placeholder="Tên playlist..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingNew}>
              {savingNew ? '...' : 'Tạo'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCreating(false); setNewName(''); setError(''); }}>
              Hủy
            </button>
          </form>
        )}
        {error && <p style={{ color: '#f87171', marginTop: 8, fontSize: 13 }}>⚠️ {error}</p>}
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && playlists.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎶</div>
          <div className="empty-state-title">Chưa có playlist nào</div>
          <div className="empty-state-text">Tạo playlist đầu tiên để tổ chức âm nhạc của bạn</div>
        </div>
      )}

      {!loading && playlists.length > 0 && (
        <div className="playlists-grid">
          {playlists.map(pl => {
            const isExpanded = expanded === pl._id;
            return (
              <div
                key={pl._id}
                className={`playlist-card${isExpanded ? ' expanded' : ''}`}
                onClick={() => setExpanded(isExpanded ? null : pl._id)}
              >
                {/* Cover */}
                <PlaylistCover songs={pl.songs} />

                {/* Info */}
                <div className="playlist-card-info">
                  <div className="playlist-card-name" title={pl.name}>{pl.name}</div>
                  <div className="playlist-card-count">
                    {(pl.songs || []).length} bài hát · {isExpanded ? 'Thu gọn ▲' : 'Xem ▼'}
                  </div>
                </div>

                {/* Actions */}
                <div className="playlist-card-actions" onClick={e => e.stopPropagation()}>
                  {(pl.songs || []).length > 0 && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={e => { e.stopPropagation(); play(pl.songs[0], pl.songs); }}
                    >
                      ▶ Phát
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDelete(pl._id, e)}
                  >
                    🗑 Xóa
                  </button>
                </div>

                {/* Expanded: song list */}
                {isExpanded && (
                  <div className="playlist-songs-list" onClick={e => e.stopPropagation()}>
                    {(pl.songs || []).length === 0 && (
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>Playlist trống</p>
                    )}
                    {(pl.songs || []).map(song => {
                      const active = isCurrentSong(song._id);
                      const cover  = staticUrl(song.coverUrl);
                      return (
                        <div
                          key={song._id}
                          className="playlist-song-row"
                          style={active ? { background: 'rgba(124,90,246,0.12)', borderRadius: 8 } : {}}
                          onClick={() => play(song, pl.songs)}
                        >
                          {cover
                            ? <img src={cover} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} onError={e => { e.target.style.display='none'; }} />
                            : <span className="playlist-song-icon">🎵</span>
                          }
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div className="playlist-song-title" style={active ? { color: 'var(--accent-light)' } : {}}>{song.title}</div>
                            <div className="playlist-song-artist">{song.artist}</div>
                          </div>
                          <button
                            className="btn-icon danger"
                            onClick={e => { e.stopPropagation(); handleRemoveSong(pl._id, song._id); }}
                            title="Xóa khỏi playlist"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
