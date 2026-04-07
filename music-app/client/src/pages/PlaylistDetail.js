import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';

// Trang chi tiết playlist
const PlaylistDetail = ({ playlists, onPlaylistChanged }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPlaylist();
  }, [id, user]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      // Lấy tất cả playlist rồi lọc theo id
      const res = await playlistsAPI.getAll();
      const found = (res.data.data || []).find(p => p._id === id);
      setPlaylist(found || null);

      // Lấy danh sách yêu thích
      const favRes = await favoritesAPI.getAll();
      setFavorites((favRes.data.data || []).map(s => s._id));
    } catch (error) {
      console.error('Lỗi tải playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa playlist
  const handleDelete = async () => {
    if (!window.confirm(`Xóa playlist "${playlist.name}"?`)) return;
    try {
      await playlistsAPI.delete(id);
      onPlaylistChanged?.();
      navigate('/');
    } catch (error) {
      alert('Lỗi xóa playlist');
    }
  };

  // Xóa bài hát khỏi playlist
  const handleRemoveSong = async (songId) => {
    try {
      await playlistsAPI.removeSong(id, songId);
      fetchPlaylist();
    } catch (error) {
      alert('Lỗi xóa bài hát khỏi playlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-5xl">😕</span>
        <p className="text-white font-semibold">Không tìm thấy playlist</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* Header playlist */}
      <div className="flex items-end gap-6 mb-8 pb-6 border-b border-white/10">
        <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center shadow-2xl flex-shrink-0">
          <span className="text-6xl">🎵</span>
        </div>
        <div className="flex-1">
          <p className="text-[#b3b3b3] text-xs uppercase tracking-wider font-semibold">Playlist</p>
          <h1 className="text-white font-black text-4xl mt-1">{playlist.name}</h1>
          <p className="text-[#b3b3b3] text-sm mt-2">
            {user?.name} • {playlist.songs?.length || 0} bài hát
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* Nút phát tất cả */}
            {playlist.songs?.length > 0 && (
              <button
                onClick={() => playSong(playlist.songs[0], playlist.songs)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Phát tất cả
              </button>
            )}
            {/* Nút xóa playlist */}
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-[#b3b3b3] hover:text-white border border-white/20 hover:border-white/40 text-sm px-4 py-2 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Xóa playlist
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách bài hát trong playlist */}
      {playlist.songs?.length > 0 ? (
        <div className="bg-[#181818] rounded-xl overflow-hidden">
          {playlist.songs.map((song) => (
            <div key={song._id} className="flex items-center group">
              <div className="flex-1">
                <SongCard
                  song={song}
                  songList={playlist.songs}
                  isFavorite={favorites.includes(song._id)}
                  onFavoriteChange={fetchPlaylist}
                  playlists={playlists}
                />
              </div>
              {/* Nút xóa bài khỏi playlist */}
              <button
                onClick={() => handleRemoveSong(song._id)}
                className="mr-4 p-1.5 text-[#6b7280] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors rounded-full"
                title="Xóa khỏi playlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🎵</span>
          <p className="text-white font-semibold">Playlist này chưa có bài hát</p>
          <p className="text-[#b3b3b3] text-sm mt-1">Thêm bài hát từ trang chủ hoặc tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
