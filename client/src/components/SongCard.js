import React, { useState, useCallback } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { staticUrl } from '../api/api';

export default function SongCard({ song, isFavorited, onFavoriteToggle, onAddToPlaylist, songsContext = [] }) {
  const { play, togglePlay, isPlaying, isCurrentSong } = usePlayer();
  const [imgError, setImgError] = useState(false);

  const active = isCurrentSong(song._id);
  const coverSrc = !imgError && staticUrl(song.coverUrl);

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (active) {
      togglePlay();
    } else {
      play(song, songsContext);
    }
  }, [active, play, togglePlay, song, songsContext]);

  const handleFav = useCallback((e) => {
    e.stopPropagation();
    onFavoriteToggle && onFavoriteToggle(song._id, isFavorited);
  }, [song._id, isFavorited, onFavoriteToggle]);

  const handleAddPlaylist = useCallback((e) => {
    e.stopPropagation();
    onAddToPlaylist && onAddToPlaylist(song._id);
  }, [song._id, onAddToPlaylist]);

  return (
    <div
      className={`song-card${active ? ' playing' : ''}`}
      onClick={handlePlay}
    >
      {/* Cover Image */}
      <div className="song-card-cover">
        {coverSrc ? (
          <img src={coverSrc} alt={song.title} onError={() => setImgError(true)} />
        ) : (
          <div className="song-card-cover-placeholder">🎵</div>
        )}

        {/* Playing indicator */}
        {active && (
          <div className="playing-indicator-cover">
            <div className="waveform">
              <span /><span /><span /><span />
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="song-card-overlay">
          {onAddToPlaylist && (
            <button className="song-card-icon-btn" onClick={handleAddPlaylist} title="Thêm vào playlist">
              ➕
            </button>
          )}
          {onFavoriteToggle && (
            <button
              className={`song-card-icon-btn${isFavorited ? ' favorited' : ''}`}
              onClick={handleFav}
              title={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              {isFavorited ? '❤️' : '🤍'}
            </button>
          )}
          <button className="song-card-play-btn" onClick={handlePlay}>
            {active && isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="song-card-info">
        <div className="song-card-title" title={song.title}>{song.title}</div>
        <div className="song-card-artist">{song.artist}</div>
        <div className="song-card-plays">
          <span>▶</span>
          <span>{(song.plays || 0).toLocaleString()} lượt nghe</span>
        </div>
      </div>
    </div>
  );
}
