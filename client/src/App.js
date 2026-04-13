import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { playlistsAPI } from './services/api';
import { useAuth } from './context/AuthContext';

// Import layout components
import Sidebar from './components/Sidebar';
import Player from './components/Player';

// Import pages
import Home from './pages/Home';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import PlaylistDetail from './pages/PlaylistDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Playlist from './pages/Playlist';

// Import Admin pages
import AdminLayout from './pages/admin/components/AdminLayout';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSongs from './pages/admin/ManageSongs';

// ============================
// INNER APP (cần useAuth nên phải bọc trong AuthProvider)
// ============================
const AppContent = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Tải playlist khi user đăng nhập
  useEffect(() => {
    if (user) fetchPlaylists();
    else setPlaylists([]);
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const res = await playlistsAPI.getAll();
      setPlaylists(res.data.data || []);
    } catch (error) {
      console.error('Lỗi tải playlist:', error);
    }
  };

  // NẾU LÀ ADMIN -> Chỉ render giao diện Admin, ẩn hoàn toàn Sidebar và Player của người dùng
  if (user && user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<ManageUsers />} />
          <Route path="songs" element={<ManageSongs />} />
        </Route>
        {/* Bất kỳ route nào khác đều chuyển hướng về /admin/users */}
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR - Thanh điều hướng bên trái */}
      {!isLoginPage && <Sidebar playlists={playlists} onPlaylistCreated={fetchPlaylists} />}

      {/* NỘI DUNG TRANG CHÍNH */}
      <main className="main-content bg-gradient-to-b from-[#1a1a2e] to-[#121212]">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Home playlists={playlists} />} />

          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Trang tìm kiếm */}
          <Route path="/search" element={<Search playlists={playlists} />} />

          {/* Trang yêu thích */}
          <Route path="/favorites" element={<Favorites playlists={playlists} />} />

          {/* Danh sách tất cả playlist */}
          <Route path="/playlists" element={<Playlist />} />

          {/* Chi tiết một playlist */}
          <Route
            path="/playlist/:id"
            element={<PlaylistDetail playlists={playlists} onPlaylistChanged={fetchPlaylists} />}
          />

          {/* Trang profile */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* PLAYER - Thanh phát nhạc cố định dưới cùng */}
      {!isLoginPage && <Player />}
    </div>
  );
};

// ============================
// APP GỐC - Bọc tất cả Providers
// ============================
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
