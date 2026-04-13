import React, {
  createContext, useContext, useState, useRef, useEffect, useCallback
} from 'react';
import { staticUrl } from '../api/api';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState(null);
  const [queue,       setQueue]       = useState([]);
  const [queueIdx,    setQueueIdx]    = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [progress,    setProgress]    = useState(0);   // giây hiện tại
  const [duration,    setDuration]    = useState(0);   // tổng giây
  const [volume,      setVolume]      = useState(0.8);

  /* Sync volume vào audio element */
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  /* Cập nhật progress theo timeupdate */
  useEffect(() => {
    const audio = audioRef.current;
    const onTime   = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded  = () => handleNext();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, queueIdx]);

  /* Load bài hát khi currentSong thay đổi */
  useEffect(() => {
    if (!currentSong) return;
    const audio = audioRef.current;
    const url = staticUrl(currentSong.audioUrl);
    if (!url) return;
    audio.src = url;
    audio.load();
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [currentSong]);

  /* Play 1 bài đơn lẻ (từ home / favorites) */
  const play = useCallback((song, songsContext = []) => {
    const q = songsContext.length > 0 ? songsContext : [song];
    const idx = q.findIndex(s => s._id === song._id);
    setQueue(q);
    setQueueIdx(idx >= 0 ? idx : 0);
    setProgress(0);
    setCurrentSong(song);
  }, []);

  /* Pause / Resume */
  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  /* Next / Prev */
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIdx = (queueIdx + 1) % queue.length;
    setQueueIdx(nextIdx);
    setProgress(0);
    setCurrentSong(queue[nextIdx]);
  }, [queue, queueIdx]);

  const handlePrev = useCallback(() => {
    if (queue.length === 0) return;
    const prevIdx = (queueIdx - 1 + queue.length) % queue.length;
    setQueueIdx(prevIdx);
    setProgress(0);
    setCurrentSong(queue[prevIdx]);
  }, [queue, queueIdx]);

  /* Seek */
  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  /* Kiểm tra bài đang phát */
  const isCurrentSong = useCallback((songId) => {
    return currentSong && currentSong._id === songId;
  }, [currentSong]);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, duration, volume,
      play, pause, resume, togglePlay, handleNext, handlePrev, seek,
      setVolume, isCurrentSong,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
