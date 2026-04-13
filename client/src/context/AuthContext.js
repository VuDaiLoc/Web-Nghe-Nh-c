import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Tạo context cho thông tin xác thực người dùng
const AuthContext = createContext(null);

// Provider component - bọc toàn bộ app để chia sẻ trạng thái auth
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng nhập bằng Facebook
  const loginWithFacebook = () => {
    authAPI.loginFacebook();
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    authAPI.logout();
  };

  // Hàm đăng nhập Local
  const loginWithLocal = async (email, password) => {
    try {
      const response = await authAPI.loginLocal({ email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      if (error.response && error.response.data) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Lỗi kết nối server' };
    }
  };

  // Hàm đăng ký Local
  const registerUser = async (name, email, password) => {
    try {
      const response = await authAPI.registerLocal({ name, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      if (error.response && error.response.data) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Lỗi kết nối server' };
    }
  };

  const value = {
    user,
    loading,
    loginWithFacebook,
    loginWithLocal,
    registerUser,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng trong AuthProvider');
  }
  return context;
};

export default AuthContext;
