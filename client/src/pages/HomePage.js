import React, { useState, useEffect, useCallback } from 'react';
import { getAllSongs, searchSongs, getFavorites, addFavorite, removeFavorite } from '../api/api';
import SongCard from '../components/SongCard';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  const [songs,      setSongs]      = useState([]);
  const [favorites,  setFavorites]  = useState([]); // mảng songId
  const [loading,    setLoading]    = useState(true);
  const [searchVal,  setSearchVal]  = useState('');
  const [searching,  setSearching]  = useState(false);
  const [playlistSongId, setPlaylistSongId] = useState(null); // bài đang chọn thêm vào playlist

  /* Fetch all songs + favorites */
  useEffect(() => {
    Promise.all([getAllSongs(), getFavorites()])
      .then(([songsRes, favRes]) => {
        if (songsRes.data.success) setSongs(songsRes.data.data);
        if (favRes.data.success)   setFavorites(favRes.data.data.map(s => s._id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Search */
  useEffect(() => {
    if (!searchVal.trim()) {
      // Reset về tất cả bài hát
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      searchSongs(searchVal.trim())
        .then(res => { if (res.data.success) setSongs(res.data.data); })
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchVal]);

  /* Reload all songs when search clears */
  useEffect(() => {
    if (!searchVal.trim()) {
      setLoading(true);
      getAllSongs()
        .then(res => { if (res.data.success) setSongs(res.data.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

  /* Toggle favorite */
  const handleFavoriteToggle = useCallback(async (songId, isFav) => {
    try {
      if (isFav) {
        await removeFavorite(songId);
        setFavorites(prev => prev.filter(id => id !== songId));
      } else {
        await addFavorite(songId);
        setFavorites(prev => [...prev, songId]);
      }
    } catch {}
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Xin chào, {user?.name?.split(' ').slice(-1)[0]} 👋
        </h1>
        <p className="page-subtitle">Khám phá âm nhạc hôm nay</p>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm bài hát, nghệ sĩ, thể loại..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
        {searching && (
          <div className="spinner" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, borderWidth: 2 }} />
        )}
      </div>

      {/* Section header */}
      <div className="section-header">
        <h2 className="section-title">
          {searchVal.trim() ? `Kết quả cho "${searchVal}"` : 'Tất cả bài hát'}
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {songs.length} bài
        </span>
      </div>

      {/* Loading */}
      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}

      {/* Empty */}
      {!loading && songs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎵</div>
          <div className="empty-state-title">
            {searchVal.trim() ? 'Không tìm thấy bài hát nào' : 'Chưa có bài hát nào'}
          </div>
          <div className="empty-state-text">
            {searchVal.trim()
              ? 'Thử tìm kiếm với từ khoá khác'
              : 'Admin có thể thêm bài hát trong trang Admin Panel'}
          </div>
        </div>
      )}

      {/* Songs Grid */}
      {!loading && songs.length > 0 && (
        <div className="songs-grid">
          {songs.map(song => (
            <SongCard
              key={song._id}
              song={song}
              isFavorited={favorites.includes(song._id)}
              onFavoriteToggle={handleFavoriteToggle}
              onAddToPlaylist={setPlaylistSongId}
              songsContext={songs}
            />
          ))}
        </div>
      )}

      {/* Add to playlist modal */}
      {playlistSongId && (
        <AddToPlaylistModal
          songId={playlistSongId}
          onClose={() => setPlaylistSongId(null)}
        />
      )}
    </div>
  );
}
