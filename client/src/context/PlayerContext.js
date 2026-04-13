import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

// Tạo context cho music player toàn cục
const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  // Bài hát đang phát
  const [currentSong, setCurrentSong] = useState(null);
  // Danh sách hàng chờ phát
  const [queue, setQueue] = useState([]);
  // Vị trí bài hiện tại trong hàng chờ
  const [currentIndex, setCurrentIndex] = useState(0);
  // Trạng thái đang phát hay dừng
  const [isPlaying, setIsPlaying] = useState(false);
  // Thời gian hiện tại (giây)
  const [currentTime, setCurrentTime] = useState(0);
  // Tổng thời lượng (giây)
  const [duration, setDuration] = useState(0);
  // Âm lượng (0 đến 1)
  const [volume, setVolume] = useState(0.8);

  // Ref lưu instance Howl để kiểm soát audio
  const howlRef = useRef(null);
  // Ref lưu interval để cập nhật thời gian
  const intervalRef = useRef(null);

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (howlRef.current) howlRef.current.unload();
    };
  }, []);

  // Cập nhật âm lượng khi thay đổi
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  // Hàm phát bài hát từ URL
  const playSong = useCallback((song, songList = []) => {
    // Dừng và xóa bài cũ
    if (howlRef.current) {
      howlRef.current.unload();
    }
    if (intervalRef.current) clearInterval(intervalRef.current);

    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);

    // Nếu có danh sách, cập nhật hàng chờ
    if (songList.length > 0) {
      setQueue(songList);
      const idx = songList.findIndex(s => s._id === song._id);
      setCurrentIndex(idx >= 0 ? idx : 0);
    }

    // Tạo Howl instance mới để phát nhạc
    const howl = new Howl({
      src: [song.audioUrl],
      html5: true, // Dùng HTML5 audio để stream
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(howl.duration());
        // Cập nhật thanh tiến trình mỗi giây
        intervalRef.current = setInterval(() => {
          setCurrentTime(howl.seek() || 0);
        }, 500);
      },
      onpause: () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      onstop: () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      onend: () => {
        // Tự động phát bài tiếp theo khi kết thúc
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        playNext();
      },
      onloaderror: (id, err) => {
        console.error('❌ Lỗi tải audio:', err);
        setIsPlaying(false);
      }
    });

    howlRef.current = howl;
    howl.play();
  }, [volume]);

  // Phát/Dừng bài hát hiện tại
  const togglePlay = useCallback(() => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  }, [isPlaying]);

  // Phát bài tiếp theo trong hàng chờ
  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex], queue);
  }, [queue, currentIndex, playSong]);

  // Phát bài trước trong hàng chờ
  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex], queue);
  }, [queue, currentIndex, playSong]);

  // Tua đến vị trí cụ thể trên thanh tiến trình
  const seek = useCallback((time) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook để sử dụng PlayerContext
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer phải được dùng trong PlayerProvider');
  }
  return context;
};

export default PlayerContext;
