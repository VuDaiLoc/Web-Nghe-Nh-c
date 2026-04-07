import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const AdminLayout = () => {
  const { user, loginWithFacebook } = useAuth();

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      {/* Sidebar Admin */}
      <div className="w-64 bg-black flex flex-col p-6 border-r border-[#282828]">
        <div className="mb-10">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">⚙️</span> Admin Panel
          </h1>
        </div>

        <div className="flex-1 space-y-4">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-[#282828] text-white' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
              }`
            }
          >
            👥 Quản lý Người dùng
          </NavLink>
          <NavLink
            to="/admin/songs"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-[#282828] text-white' : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
              }`
            }
          >
            🎵 Quản lý Bài hát
          </NavLink>
        </div>

        {/* Thông tin Admin */}
        <div className="mt-auto pt-6 border-t border-[#282828]">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || 'https://via.placeholder.com/150'} alt="Admin" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-green-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = 'http://localhost:5000/auth/logout'}
            className="w-full mt-4 py-2 bg-[#282828] hover:bg-[#3E3E3E] rounded-md text-sm transition-colors text-white"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Vùng nội dung chính */}
      <div className="flex-1 bg-[#181818] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
