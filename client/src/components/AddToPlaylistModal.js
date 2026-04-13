import React, { useState, useEffect, useCallback } from 'react';
import { getPlaylists, addSongToPlaylist } from '../api/api';

export default function AddToPlaylistModal({ songId, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [adding,    setAdding]    = useState(null); // id đang thêm
  const [done,      setDone]      = useState([]);   // ids đã thêm thành công

  useEffect(() => {
    getPlaylists()
      .then(res => { if (res.data.success) setPlaylists(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(async (playlistId) => {
    setAdding(playlistId);
    try {
      await addSongToPlaylist(playlistId, songId);
      setDone(prev => [...prev, playlistId]);
    } catch {}
    setAdding(null);
  }, [songId]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">
          <span>🎵 Thêm vào playlist</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

        {!loading && playlists.length === 0 && (
          <div className="empty-state" style={{ padding: '24px 0' }}>
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">Chưa có playlist nào</div>
            <div className="empty-state-text">Hãy tạo playlist trước ở trang Playlist</div>
          </div>
        )}

        {!loading && playlists.map(pl => {
          const isDone = done.includes(pl._id);
          const isAdding = adding === pl._id;

          return (
            <div key={pl._id} className="modal-playlist-item" onClick={() => !isDone && !isAdding && handleAdd(pl._id)}>
              <div className="modal-playlist-icon">🎶</div>
              <div>
                <div className="modal-playlist-name">{pl.name}</div>
                <div className="modal-playlist-count">{(pl.songs || []).length} bài hát</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18 }}>
                {isDone    ? <span style={{ color: '#34d399' }}>✔</span>
                : isAdding ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                : <span style={{ color: 'var(--text-muted)' }}>+</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
