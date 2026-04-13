import React, { useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';

// Hàm chuyển đổi giây thành định dạng mm:ss
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Component Player - thanh phát nhạc cố định ở dưới cùng màn hình
const Player = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume
  } = usePlayer();

  // Tính phần trăm tiến trình để hiển thị trên thanh
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Xử lý khi kéo thanh tiến trình
  const handleSeek = useCallback((e) => {
    const time = parseFloat(e.target.value);
    seek(time);
  }, [seek]);

  return (
    <div className="player-bar bg-[#181818] border-t border-[#282828] px-4 py-3">
      <div className="flex items-center gap-4">
        {/* ============================ */}
        {/* THÔNG TIN BÀI HÁT (TRÁI) */}
        {/* ============================ */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          {currentSong ? (
            <>
              {/* Ảnh bìa bài hát */}
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-14 h-14 rounded-md object-cover shadow-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
                <p className="text-[#b3b3b3] text-xs truncate">{currentSong.artist}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Placeholder khi chưa phát bài nào */}
              <div className="w-14 h-14 rounded-md bg-[#282828] flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <p className="text-[#6b7280] text-sm">Chưa phát bài hát</p>
              </div>
            </div>
          )}
        </div>

        {/* ============================ */}
        {/* ĐIỀU KHIỂN PHÁT NHẠC (GIỮA) */}
        {/* ============================ */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          {/* Nút prev / play-pause / next */}
          <div className="flex items-center gap-4">
            {/* Nút Bài Trước */}
            <button
              onClick={playPrev}
              className="text-[#b3b3b3] hover:text-white transition-colors"
              disabled={!currentSong}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
              </svg>
            </button>

            {/* Nút Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!currentSong}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                currentSong
                  ? 'bg-white hover:scale-105 text-black'
                  : 'bg-[#404040] cursor-not-allowed text-[#6b7280]'
              }`}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Nút Bài Tiếp */}
            <button
              onClick={playNext}
              className="text-[#b3b3b3] hover:text-white transition-colors"
              disabled={!currentSong}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Thanh tiến trình thời gian */}
          <div className="flex items-center gap-2 w-full max-w-lg">
            <span className="text-[#b3b3b3] text-xs w-8 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
              {/* Thanh nền tiến trình */}
              <div className="absolute inset-y-1.5 inset-x-0 bg-[#4d4d4d] rounded-full" />
              {/* Thanh màu xanh (tiến độ) */}
              <div
                className="absolute inset-y-1.5 left-0 bg-white rounded-full pointer-events-none"
                style={{ width: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="relative w-full h-4 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[#b3b3b3] text-xs w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* ============================ */}
        {/* ÂM LƯỢNG (PHẢI) */}
        {/* ============================ */}
        <div className="flex items-center gap-2 w-32">
          {/* Icon loa */}
          <button className="text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0">
            {volume === 0 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>

          {/* Thanh kéo âm lượng */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-1.5 inset-x-0 bg-[#4d4d4d] rounded-full" />
            <div
              className="absolute inset-y-1.5 left-0 bg-white rounded-full pointer-events-none"
              style={{ width: `${volume * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="relative w-full h-4 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
