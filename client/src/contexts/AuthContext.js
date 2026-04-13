import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  /* Kiểm tra session khi app khởi động */
  useEffect(() => {
    getMe()
      .then(res => {
        if (res.data.success) setUser(res.data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Đăng nhập email/password */
  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    if (res.data.success) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  }, []);

  /* Đăng ký */
  const register = useCallback(async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    if (res.data.success) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  }, []);

  /* Đăng xuất */
  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
