import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { playlistsAPI } from '../services/api';

// Component Sidebar - thanh điều hướng bên trái
const Sidebar = ({ playlists, onPlaylistCreated }) => {
  const { user, loginWithFacebook, logout } = useAuth();
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);

  // Hàm tạo playlist mới
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      setCreating(true);
      await playlistsAPI.create(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowNewPlaylist(false);
      onPlaylistCreated();
    } catch (error) {
      alert('Lỗi tạo playlist');
    } finally {
      setCreating(false);
    }
  };

  // Style cho NavLink đang active
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-[#b3b3b3] hover:text-white'
    }`;

  return (
    <aside className="sidebar flex flex-col h-full bg-black">
      {/* ============================ */}
      {/* LOGO */}
      {/* ============================ */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <span className="text-white font-bold text-xl">Paracy Music</span>
        </div>
      </div>

      {/* ============================ */}
      {/* MENU ĐIỀU HƯỚNG CHÍNH */}
      {/* ============================ */}
      <nav className="px-3 mb-6">
        <NavLink to="/" end className={navClass}>
          {/* Icon Home */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.03 2.59a1.5 1.5 0 011.94 0l7.5 6.363a1.5 1.5 0 01.53 1.144V19.5a1.5 1.5 0 01-1.5 1.5h-5.75a.75.75 0 01-.75-.75V14h-2v6.25a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5v-9.403c0-.44.194-.859.53-1.144l7.5-6.363z" />
          </svg>
          Trang chủ
        </NavLink>

        <NavLink to="/search" className={navClass}>
          {/* Icon Search */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          Tìm kiếm
        </NavLink>

        {user && (
          <NavLink to="/favorites" className={navClass}>
            {/* Icon Heart */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            Yêu thích
          </NavLink>
        )}

        {user && (
          <NavLink to="/playlists" className={navClass}>
            {/* Icon Playlist */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            Playlist
          </NavLink>
        )}
      </nav>

      {/* ============================ */}
      {/* PHẦN PLAYLIST */}
      {/* ============================ */}
      <div className="flex-1 px-3 overflow-y-auto">
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider">Playlist</span>
          {user && (
            <button
              onClick={() => setShowNewPlaylist(!showNewPlaylist)}
              className="text-[#b3b3b3] hover:text-white p-1 rounded transition-colors"
              title="Tạo playlist mới"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>

        {/* Form tạo playlist mới */}
        {showNewPlaylist && user && (
          <form onSubmit={handleCreatePlaylist} className="px-4 mb-3">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Tên playlist..."
              className="w-full bg-[#282828] text-white text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-green-500 placeholder-[#6b7280]"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 bg-green-500 hover:bg-green-400 text-black text-xs font-bold py-1.5 rounded-md transition-colors"
              >
                {creating ? 'Đang tạo...' : 'Tạo'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewPlaylist(false)}
                className="flex-1 bg-[#282828] hover:bg-[#3e3e3e] text-white text-xs py-1.5 rounded-md transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Danh sách playlist */}
        {user ? (
          playlists.length > 0 ? (
            <div className="space-y-0.5">
              {playlists.map((playlist) => (
                <NavLink
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded text-sm truncate transition-colors ${
                      isActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
                    }`
                  }
                >
                  {playlist.name}
                </NavLink>
              ))}
            </div>
          ) : (
            <p className="px-4 text-[#6b7280] text-xs">Chưa có playlist nào</p>
          )
        ) : (
          <p className="px-4 text-[#6b7280] text-xs">Đăng nhập để xem playlist</p>
        )}
      </div>

      {/* ============================ */}
      {/* KHU VỰC ĐĂNG NHẬP / PROFILE */}
      {/* ============================ */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 mt-2">
        {user ? (
          <div className="flex items-center gap-3 px-3">
            {/* Avatar user */}
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1db954&color=fff`}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <NavLink to="/profile" className="text-[#b3b3b3] text-xs hover:text-white transition-colors">
                Xem profile
              </NavLink>
            </div>
            {/* Nút đăng xuất */}
            <button
              onClick={logout}
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Đăng xuất"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black text-sm font-semibold py-2.5 rounded-full transition-colors"
          >
            Đăng nhập / Đăng ký
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
