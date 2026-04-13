import React, { useCallback } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { staticUrl } from '../api/api';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player() {
  const {
    currentSong, isPlaying, progress, duration, volume,
    togglePlay, handleNext, handlePrev, seek, setVolume,
  } = usePlayer();

  const handleProgressClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * (duration || 0));
  }, [duration, seek]);

  const handleVolumeChange = useCallback((e) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  if (!currentSong) {
    /* Empty player bar */
    return (
      <div className="player-bar" style={{ justifyContent: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          🎵 Chọn một bài hát để bắt đầu nghe
        </span>
      </div>
    );
  }

  const coverSrc = staticUrl(currentSong.coverUrl);
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player-bar">
      {/* Left: song info */}
      <div className="player-song-info">
        <div className="player-cover">
          {coverSrc
            ? <img src={coverSrc} alt={currentSong.title} onError={e => { e.target.style.display='none'; }} />
            : <div className="player-cover-placeholder">🎵</div>
          }
        </div>
        <div className="player-meta">
          <div className="player-title">{currentSong.title}</div>
          <div className="player-artist">{currentSong.artist}</div>
        </div>
        {/* Waveform when playing */}
        {isPlaying && (
          <div className="waveform" style={{ marginLeft: 8 }}>
            <span /><span /><span /><span />
          </div>
        )}
      </div>

      {/* Center: controls + progress */}
      <div className="player-center">
        <div className="player-controls">
          <button className="ctrl-btn" onClick={handlePrev} title="Bài trước">⏮</button>
          <button className="ctrl-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Tạm dừng' : 'Phát'}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={handleNext} title="Bài tiếp">⏭</button>
        </div>

        <div className="player-progress">
          <span className="progress-time">{formatTime(progress)}</span>
          <div
            className="progress-bar-wrap"
            onClick={handleProgressClick}
            title="Nhấp để tua"
          >
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-time right">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="player-right">
        <span className="volume-icon">{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          title={`Âm lượng ${Math.round(volume * 100)}%`}
        />
      </div>
    </div>
  );
}
