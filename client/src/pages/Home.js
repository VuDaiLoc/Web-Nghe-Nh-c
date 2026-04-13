import React, { useState, useEffect, useCallback } from 'react';
import { songsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI } from '../services/api';
import SongCard from '../components/SongCard';

// Trang chủ - hiển thị toàn bộ bài hát
const Home = ({ playlists }) => {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bài hát và yêu thích khi trang load
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const songsRes = await songsAPI.getAll();
      setSongs(songsRes.data.data || []);

      // Chỉ lấy yêu thích nếu đã đăng nhập
      if (user) {
        const favRes = await favoritesAPI.getAll();
        setFavorites((favRes.data.data || []).map(s => s._id));
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Callback khi thay đổi yêu thích để tải lại danh sách
  const handleFavoriteChange = useCallback(async () => {
    if (!user) return;
    try {
      const favRes = await favoritesAPI.getAll();
      setFavorites((favRes.data.data || []).map(s => s._id));
    } catch (err) {}
  }, [user]);

  // Chia bài hát theo thể loại để hiển thị section
  const genreGroups = {
    'Pop': songs.filter(s => s.genre === 'Pop'),
    'Ballad': songs.filter(s => s.genre === 'Ballad'),
    'EDM': songs.filter(s => s.genre === 'EDM'),
    'Rock': songs.filter(s => s.genre === 'Rock'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* Lời chào */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">
          {user ? `Chào buổi tối, ${user.name.split(' ').pop()}! 👋` : 'Chào mừng đến Paracy Music 🎵'}
        </h1>
        {!user && (
          <p className="text-[#b3b3b3] mt-2 text-sm">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
        )}
      </div>

      {/* Tất cả bài hát */}
      <section className="mb-8">
        <h2 className="text-white font-bold text-xl mb-4">🎧 Tất cả bài hát</h2>
        <div className="bg-[#181818] rounded-xl overflow-hidden">
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songList={songs}
              isFavorite={favorites.includes(song._id)}
              onFavoriteChange={handleFavoriteChange}
              playlists={playlists}
            />
          ))}
        </div>
      </section>

      {/* Bài hát theo thể loại */}
      {Object.entries(genreGroups).map(([genre, genreSongs]) =>
        genreSongs.length > 0 ? (
          <section key={genre} className="mb-8">
            <h2 className="text-white font-bold text-xl mb-4">
              {genre === 'Pop' ? '🎤' : genre === 'Ballad' ? '💙' : genre === 'EDM' ? '⚡' : '🎸'} {genre}
            </h2>
            <div className="bg-[#181818] rounded-xl overflow-hidden">
              {genreSongs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  songList={genreSongs}
                  isFavorite={favorites.includes(song._id)}
                  onFavoriteChange={handleFavoriteChange}
                  playlists={playlists}
                />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
};

export default Home;
