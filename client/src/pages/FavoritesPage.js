import React, { useState, useEffect, useCallback } from 'react';
import { getFavorites, removeFavorite } from '../api/api';
import SongCard from '../components/SongCard';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function FavoritesPage() {
  const [songs,   setSongs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistSongId, setPlaylistSongId] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(res => { if (res.data.success) setSongs(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Xóa khỏi favorites (không có add vì trang này chỉ hiện bài đã yêu thích) */
  const handleRemoveFavorite = useCallback(async (songId) => {
    await removeFavorite(songId).catch(() => {});
    setSongs(prev => prev.filter(s => s._id !== songId));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">❤️ Bài hát yêu thích</h1>
        <p className="page-subtitle">Những bài hát bạn đã thêm vào danh sách yêu thích</p>
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {!loading && songs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🤍</div>
          <div className="empty-state-title">Chưa có bài hát yêu thích</div>
          <div className="empty-state-text">
            Nhấn vào biểu tượng trái tim trên bài hát để thêm vào danh sách yêu thích
          </div>
        </div>
      )}

      {!loading && songs.length > 0 && (
        <>
          <div className="section-header">
            <h2 className="section-title">Danh sách</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{songs.length} bài</span>
          </div>
          <div className="songs-grid">
            {songs.map(song => (
              <SongCard
                key={song._id}
                song={song}
                isFavorited={true}
                onFavoriteToggle={() => handleRemoveFavorite(song._id)}
                onAddToPlaylist={setPlaylistSongId}
                songsContext={songs}
              />
            ))}
          </div>
        </>
      )}

      {playlistSongId && (
        <AddToPlaylistModal
          songId={playlistSongId}
          onClose={() => setPlaylistSongId(null)}
        />
      )}
    </div>
  );
}
