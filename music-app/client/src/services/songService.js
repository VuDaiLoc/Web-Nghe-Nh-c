import axios from 'axios';

// Service xử lý các API liên quan đến bài hát
const BASE_URL = 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL, withCredentials: true });

const songService = {
  // Lấy tất cả bài hát
  getAll: () => api.get('/api/songs'),

  // Tìm kiếm bài hát theo từ khóa
  search: (query) => api.get(`/api/songs/search?q=${encodeURIComponent(query)}`),

  // Lấy thông tin bài hát theo ID
  getById: (id) => api.get(`/api/songs/${id}`)
};

export default songService;
