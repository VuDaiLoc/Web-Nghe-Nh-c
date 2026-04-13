import React from 'react';
import { useAuth } from '../context/AuthContext';

// Trang profile người dùng
const Profile = () => {
  const { user, loginWithFacebook, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 px-6">
        <span className="text-6xl">👤</span>
        <h2 className="text-white text-xl font-bold">Chưa đăng nhập</h2>
        <p className="text-[#b3b3b3] text-sm text-center">Đăng nhập để xem thông tin tài khoản</p>
        <button
          onClick={loginWithFacebook}
          className="flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Đăng nhập bằng Facebook
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in">
      <h1 className="text-white text-2xl font-bold mb-8">Trang cá nhân</h1>

      {/* Card thông tin user */}
      <div className="bg-gradient-to-br from-green-600/30 to-teal-700/30 rounded-2xl p-8 flex flex-col items-center max-w-md mb-8 border border-white/10">
        {/* Avatar */}
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=1db954&color=fff`}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow-xl mb-4"
        />
        {/* Tên */}
        <h2 className="text-white text-2xl font-bold mb-1">{user.name}</h2>
        {/* Email */}
        {user.email && (
          <p className="text-[#b3b3b3] text-sm mb-4">{user.email}</p>
        )}
        {/* Badge Facebook */}
        <div className="flex items-center gap-1.5 bg-[#1877f2] text-white text-xs px-3 py-1.5 rounded-full mb-6">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Đăng nhập qua Facebook
        </div>
        {/* Nút đăng xuất */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-[#282828] hover:bg-[#3e3e3e] text-white text-sm px-6 py-2.5 rounded-full border border-white/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Profile;
