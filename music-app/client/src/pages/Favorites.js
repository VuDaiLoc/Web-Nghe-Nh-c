import React, { useState, useEffect, useCallback } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SongCard from '../components/SongCard';

// Trang hiển thị danh sách bài hát yêu thích
const Favorites = ({ playlists }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFavorites();
    else setLoading(false);
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoritesAPI.getAll();
      const songs = res.data.data || [];
      setFavorites(songs);
      setFavoriteIds(songs.map(s => s._id));
    } catch (error) {
      console.error('Lỗi tải yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật lại danh sách khi thay đổi yêu thích
  const handleFavoriteChange = useCallback(async () => {
    await fetchFavorites();
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="text-6xl">💙</span>
        <h2 className="text-white text-xl font-bold">Màn hình Yêu Thích</h2>
        <p className="text-[#b3b3b3] text-sm">Đăng nhập để xem bài hát yêu thích của bạn</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8 pb-6 border-b border-white/10">
        {/* Ảnh nền gradient */}
        <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-purple-700 to-blue-500 flex items-center justify-center shadow-2xl flex-shrink-0">
          <span className="text-6xl">💙</span>
        </div>
        <div>
          <p className="text-[#b3b3b3] text-xs uppercase tracking-wider font-semibold">Playlist</p>
          <h1 className="text-white font-black text-4xl mt-1">Bài hát yêu thích</h1>
          <p className="text-[#b3b3b3] text-sm mt-2">
            {user.name} • {favorites.length} bài hát
          </p>
        </div>
      </div>

      {/* Danh sách bài hát yêu thích */}
      {favorites.length > 0 ? (
        <div className="bg-[#181818] rounded-xl overflow-hidden">
          {favorites.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songList={favorites}
              isFavorite={favoriteIds.includes(song._id)}
              onFavoriteChange={handleFavoriteChange}
              playlists={playlists}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">🎵</span>
          <p className="text-white font-semibold">Chưa có bài hát yêu thích</p>
          <p className="text-[#b3b3b3] text-sm mt-1">Nhấn vào biểu tượng tim để thêm bài hát</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
