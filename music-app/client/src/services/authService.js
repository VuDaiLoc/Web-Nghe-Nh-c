import axios from 'axios';

// Service xử lý xác thực người dùng
const BASE_URL = 'http://localhost:5000';

const authService = {
  // Lấy thông tin user hiện tại từ session
  getMe: () => axios.get(`${BASE_URL}/auth/me`, { withCredentials: true }),

  // Đăng nhập bằng Facebook (redirect trình duyệt)
  loginFacebook: () => {
    window.location.href = `${BASE_URL}/auth/facebook`;
  },

  // Đăng xuất khỏi hệ thống
  logout: () => {
    window.location.href = `${BASE_URL}/auth/logout`;
  }
};

export default authService;
