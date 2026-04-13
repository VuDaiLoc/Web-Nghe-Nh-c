import React, { useState } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Component nút yêu thích (trái tim) có thể gắn vào bất kỳ đâu
const FavoriteButton = ({ songId, isFavorite = false, onToggle, size = 'md' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!user) return alert('Vui lòng đăng nhập để thêm yêu thích');
    try {
      setLoading(true);
      if (isFavorite) {
        await favoritesAPI.remove(songId);
      } else {
        await favoritesAPI.add(songId);
      }
      onToggle?.();
    } catch (error) {
      alert('Lỗi cập nhật yêu thích');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
      className={`p-1.5 rounded-full transition-all duration-200 ${
        isFavorite
          ? 'text-green-500 hover:scale-110'
          : 'text-[#6b7280] hover:text-white hover:scale-110'
      } ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
    >
      <svg
        className={iconSize}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
