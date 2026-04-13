import axios from 'axios';

const BASE = 'http://localhost:5000';

const API = axios.create({
  baseURL: BASE,
  withCredentials: true,   // gửi cookie session theo mỗi request
});

/* ─── Auth ─────────────────────────────────────────────── */
export const getMe         = ()           => API.get('/auth/me');
export const login         = (data)       => API.post('/auth/login', data);
export const register      = (data)       => API.post('/auth/register', data);
export const logout        = ()           => API.get('/auth/logout');
// FB OAuth phải mở tab mới → không qua axios
export const facebookLoginUrl = `${BASE}/auth/facebook`;

/* ─── Songs ────────────────────────────────────────────── */
export const getAllSongs   = ()  => API.get('/api/songs');
export const searchSongs   = (q) => API.get('/api/songs/search', { params: { q } });
export const getSongById   = (id)=> API.get(`/api/songs/${id}`);

/* ─── Favorites ─────────────────────────────────────────── */
export const getFavorites   = ()      => API.get('/api/favorites');
export const addFavorite    = (songId) => API.post(`/api/favorites/${songId}`);
export const removeFavorite = (songId) => API.delete(`/api/favorites/${songId}`);

/* ─── Playlists ─────────────────────────────────────────── */
export const getPlaylists         = ()                   => API.get('/api/playlists');
export const createPlaylist       = (name)               => API.post('/api/playlists', { name });
export const deletePlaylist       = (id)                 => API.delete(`/api/playlists/${id}`);
export const addSongToPlaylist    = (id, songId)         => API.post(`/api/playlists/${id}/songs`, { songId });
export const removeSongFromPlaylist = (id, songId)       => API.delete(`/api/playlists/${id}/songs/${songId}`);

/* ─── Admin ─────────────────────────────────────────────── */
export const getAdminUsers  = ()           => API.get('/api/admin/users');
export const updateUserRole = (id, role)   => API.put(`/api/admin/users/${id}/role`, { role });
export const deleteUser     = (id)         => API.delete(`/api/admin/users/${id}`);

export const createSong = (data)     => API.post('/api/admin/songs', data);
export const updateSong = (id, data) => API.put(`/api/admin/songs/${id}`, data);
export const deleteSong = (id)       => API.delete(`/api/admin/songs/${id}`);

/* ─── Helper: build URL cho file tĩnh ───────────────────── */
export const staticUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE}/${path.replace(/^\//, '')}`;
};
