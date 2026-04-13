import axios from 'axios';

// Cấu hình axios instance với base URL của backend
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Gửi cookie/session trong mỗi request
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================
// AUTH API
// ============================
export const authAPI = {
  // Lấy thông tin user hiện tại từ session
  getMe: () => api.get('/auth/me'),
  // Đăng xuất
  logout: () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  },
  // Đăng nhập Facebook (redirect)
  loginFacebook: () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  },
  // Đăng ký Local
  registerLocal: (data) => api.post('/auth/register', data),
  // Đăng nhập Local
  loginLocal: (data) => api.post('/auth/login', data)
};

// ============================
// SONGS API
// ============================
export const songsAPI = {
  // Lấy tất cả bài hát
  getAll: () => api.get('/api/songs'),
  // Tìm kiếm bài hát theo từ khóa
  search: (query) => api.get(`/api/songs/search?q=${encodeURIComponent(query)}`),
  // Lấy thông tin bài hát theo ID
  getById: (id) => api.get(`/api/songs/${id}`)
};

// ============================
// FAVORITES API
// ============================
export const favoritesAPI = {
  // Lấy danh sách yêu thích
  getAll: () => api.get('/api/favorites'),
  // Thêm bài hát vào yêu thích
  add: (songId) => api.post(`/api/favorites/${songId}`),
  // Xóa bài hát khỏi yêu thích
  remove: (songId) => api.delete(`/api/favorites/${songId}`)
};

// ============================
// PLAYLISTS API
// ============================
export const playlistsAPI = {
  // Lấy tất cả playlist của user
  getAll: () => api.get('/api/playlists'),
  // Tạo playlist mới
  create: (name) => api.post('/api/playlists', { name }),
  // Xóa playlist
  delete: (id) => api.delete(`/api/playlists/${id}`),
  // Thêm bài hát vào playlist
  addSong: (playlistId, songId) => api.post(`/api/playlists/${playlistId}/songs`, { songId }),
  // Xóa bài hát khỏi playlist
  removeSong: (playlistId, songId) => api.delete(`/api/playlists/${playlistId}/songs/${songId}`)
};

// ============================
// ADMIN API
// ============================
export const adminAPI = {
  // Quản lý Users
  getUsers: () => api.get('/api/admin/users'),
  updateUserRole: (id, role) => api.put(`/api/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Quản lý Songs
  createSong: (songData) => api.post('/api/admin/songs', songData),
  updateSong: (id, songData) => api.put(`/api/admin/songs/${id}`, songData),
  deleteSong: (id) => api.delete(`/api/admin/songs/${id}`)
};

export default api;
