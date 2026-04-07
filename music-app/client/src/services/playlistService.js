import axios from 'axios';

// Service xử lý các API liên quan đến playlist
const BASE_URL = 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

const playlistService = {
  // Lấy tất cả playlist của user
  getAll: () => api.get('/api/playlists'),

  // Tạo playlist mới theo tên
  create: (name) => api.post('/api/playlists', { name }),

  // Xóa playlist theo ID
  delete: (id) => api.delete(`/api/playlists/${id}`),

  // Thêm bài hát vào playlist
  addSong: (playlistId, songId) => api.post(`/api/playlists/${playlistId}/songs`, { songId }),

  // Xóa bài hát khỏi playlist
  removeSong: (playlistId, songId) => api.delete(`/api/playlists/${playlistId}/songs/${songId}`)
};

export default playlistService;
