import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI, playlistsAPI } from '../services/api';

// Component hiển thị một bài hát trong danh sách
const SongCard = ({ song, songList = [], isFavorite = false, onFavoriteChange, playlists = [] }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  // Kiểm tra bài hát này có đang phát không
  const isCurrentSong = currentSong?._id === song._id;

  // Hàm phát bài hát này
  const handlePlay = () => {
    playSong(song, songList.length > 0 ? songList : [song]);
  };

  // Hàm thêm/xóa yêu thích
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) return alert('Vui lòng đăng nhập để thêm yêu thích');
    try {
      setLoadingFav(true);
      if (isFavorite) {
        await favoritesAPI.remove(song._id);
      } else {
        await favoritesAPI.add(song._id);
      }
      onFavoriteChange?.();
    } catch (error) {
      alert('Lỗi cập nhật yêu thích');
    } finally {
      setLoadingFav(false);
    }
  };

  // Hàm thêm vào playlist
  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistsAPI.addSong(playlistId, song._id);
      setShowMenu(false);
      alert('Đã thêm vào playlist!');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi thêm vào playlist');
    }
  };

  // Hàm định dạng thời gian
  const formatDuration = (duration) => {
    if (!duration) return '--:--';
    // Đã có sẵn định dạng "mm:ss" từ seed data thì giữ nguyên
    if (typeof duration === 'string' && duration.includes(':')) return duration;
    
    const seconds = Number(duration);
    if (isNaN(seconds)) return '--:--';
    
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`song-card flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer group relative ${
        isCurrentSong ? 'bg-white/10' : ''
      }`}
      onClick={handlePlay}
    >
      {/* ============================ */}
      {/* ẢNH BÌA + NÚT PLAY */}
      {/* ============================ */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-12 h-12 rounded-md object-cover"
        />
        {/* Nút play hiện khi hover */}
        <div className="song-play-btn absolute inset-0 bg-black/60 rounded-md flex items-center justify-center">
          {isCurrentSong && isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>

      {/* ============================ */}
      {/* THÔNG TIN BÀI HÁT */}
      {/* ============================ */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>
          {song.title}
        </p>
        <p className="text-[#b3b3b3] text-xs truncate">{song.artist}</p>
      </div>

      {/* THỂ LOẠI */}
      <span className="hidden md:block text-[#b3b3b3] text-xs px-2 py-0.5 bg-white/10 rounded-full">
        {song.genre}
      </span>

      {/* ============================ */}
      {/* CÁC NÚT ACTION */}
      {/* ============================ */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {/* Nút Yêu thích */}
        {user && (
          <button
            onClick={handleToggleFavorite}
            disabled={loadingFav}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorite ? 'text-green-500' : 'text-[#6b7280] opacity-0 group-hover:opacity-100 hover:text-white'
            }`}
            title={isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          >
            <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}

        {/* THỜI LƯỢNG */}
        <span className="text-[#b3b3b3] text-xs w-10 text-right">{formatDuration(song.duration)}</span>

        {/* Nút menu tùy chọn (Có Thêm vào playlist) */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-[#6b7280] opacity-0 group-hover:opacity-100 hover:text-white rounded-full transition-colors"
            title="Tùy chọn"
          >
            {/* Icon 3 chấm (More Options) */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 z-50 bg-[#282828] rounded-lg shadow-xl py-1 w-48 border border-white/10 shadow-black/50">
              {user ? (
                <>
                  <p className="px-3 py-1.5 text-[#b3b3b3] text-xs font-semibold uppercase tracking-wider border-b border-white/10">
                    Thêm vào playlist
                  </p>
                  {playlists && playlists.length > 0 ? (
                    playlists.map(pl => (
                      <button
                        key={pl._id}
                        onClick={() => handleAddToPlaylist(pl._id)}
                        className="w-full text-left px-3 py-2 text-white text-sm hover:bg-white/10 transition-colors truncate"
                      >
                        {pl.name}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-[#b3b3b3] text-sm italic">chưa có playlist nào...</p>
                  )}
                </>
              ) : (
                <p className="px-3 py-2 text-[#b3b3b3] text-sm text-center italic">Đăng nhập để thêm</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
