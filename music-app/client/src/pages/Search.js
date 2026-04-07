import React, { useState, useCallback, useRef } from 'react';
import { songsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SongCard from '../components/SongCard';

// Trang tìm kiếm bài hát realtime
const Search = ({ playlists }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Dùng debounce để tránh gọi API quá nhiều khi gõ
  const debounceRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await songsAPI.search(value);
        setResults(res.data.data || []);
        setSearched(true);

        // Lấy danh sách yêu thích nếu đã đăng nhập
        if (user) {
          const favRes = await favoritesAPI.getAll();
          setFavorites((favRes.data.data || []).map(s => s._id));
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
      } finally {
        setLoading(false);
      }
    }, 400); // Delay 400ms sau khi ngừng gõ
  }, [user]);

  const handleFavoriteChange = useCallback(async () => {
    if (!user) return;
    try {
      const favRes = await favoritesAPI.getAll();
      setFavorites((favRes.data.data || []).map(s => s._id));
    } catch (err) {}
  }, [user]);

  return (
    <div className="px-6 py-8 animate-fade-in">
      <h1 className="text-white text-2xl font-bold mb-6">Tìm kiếm</h1>

      {/* Ô nhập từ khóa */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7280]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm tên bài hát, ca sĩ, thể loại..."
          className="w-full max-w-2xl bg-white text-black placeholder-[#6b7280] pl-12 pr-4 py-3.5 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-green-500"
          autoFocus
        />
        {/* Nút xóa nhanh */}
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      {/* ============================ */}
      {/* KẾT QUẢ TÌM KIẾM */}
      {/* ============================ */}
      {loading && (
        <div className="flex items-center gap-2 text-[#b3b3b3] ml-2">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Đang tìm kiếm...</span>
        </div>
      )}

      {!loading && searched && (
        <>
          <p className="text-[#b3b3b3] text-sm mb-4">
            {results.length > 0
              ? `Tìm thấy ${results.length} kết quả cho "${query}"`
              : `Không tìm thấy kết quả nào cho "${query}"`}
          </p>
          {results.length > 0 && (
            <div className="bg-[#181818] rounded-xl overflow-hidden">
              {results.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  songList={results}
                  isFavorite={favorites.includes(song._id)}
                  onFavoriteChange={handleFavoriteChange}
                  playlists={playlists}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Trạng thái mặc định khi chưa nhập */}
      {!searched && !loading && (
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-white font-semibold text-lg">Tìm kiếm nhạc yêu thích</p>
          <p className="text-[#b3b3b3] text-sm mt-1">Nhập tên bài hát, ca sĩ hoặc thể loại</p>
        </div>
      )}
    </div>
  );
};

export default Search;
