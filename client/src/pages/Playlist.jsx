import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playlistsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

// Trang danh sách tất cả playlist của user
const Playlist = () => {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) fetchPlaylists();
    else setLoading(false);
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await playlistsAPI.getAll();
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error('Lỗi tải playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tạo playlist mới
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      setCreating(true);
      await playlistsAPI.create(newName.trim());
      setNewName('');
      setShowForm(false);
      fetchPlaylists();
    } catch (err) {
      alert('Lỗi tạo playlist');
    } finally {
      setCreating(false);
    }
  };

  // Xóa playlist
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa playlist "${name}"?`)) return;
    try {
      await playlistsAPI.delete(id);
      fetchPlaylists();
    } catch (err) {
      alert('Lỗi xóa playlist');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 px-6">
        <span className="text-6xl">🎼</span>
        <h2 className="text-white text-xl font-bold">Playlist của bạn</h2>
        <p className="text-[#b3b3b3] text-sm">Đăng nhập để tạo và quản lý playlist</p>
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-bold">Playlist của tôi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Tạo playlist
        </button>
      </div>

      {/* Form tạo playlist mới */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-[#282828] rounded-xl p-4 mb-6 flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên playlist mới..."
            className="flex-1 bg-white/10 text-white placeholder-[#6b7280] px-4 py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-green-500 text-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2 rounded-lg transition-colors text-sm"
          >
            {creating ? 'Đang tạo...' : 'Tạo'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Hủy
          </button>
        </form>
      )}

      {/* Danh sách playlist dạng grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <div key={pl._id} className="bg-[#181818] hover:bg-[#282828] rounded-xl p-4 group transition-colors relative">
              {/* Ảnh bìa playlist */}
              <Link to={`/playlist/${pl._id}`}>
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-green-600 to-teal-500 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-green-500/20 transition-shadow">
                  {pl.songs?.[0]?.coverUrl ? (
                    <img src={pl.songs[0].coverUrl} alt={pl.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-4xl">🎵</span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm truncate">{pl.name}</p>
                <p className="text-[#b3b3b3] text-xs mt-0.5">{pl.songs?.length || 0} bài hát</p>
              </Link>

              {/* Nút phát tất cả */}
              {pl.songs?.length > 0 && (
                <button
                  onClick={() => playSong(pl.songs[0], pl.songs)}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-lg hover:bg-green-400 hover:scale-105"
                >
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}

              {/* Nút xóa playlist */}
              <button
                onClick={() => handleDelete(pl._id, pl.name)}
                className="absolute top-2 right-2 p-1 text-[#6b7280] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors rounded"
                title="Xóa playlist"
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
          <span className="text-6xl mb-4 block">🎼</span>
          <p className="text-white font-semibold text-lg">Chưa có playlist nào</p>
          <p className="text-[#b3b3b3] text-sm mt-1">Tạo playlist đầu tiên của bạn ngay!</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Tạo playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlist;
