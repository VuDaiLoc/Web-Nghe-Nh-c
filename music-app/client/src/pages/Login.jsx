import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithFacebook, loginWithLocal, registerUser } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginMode) {
        if (!email || !password) {
          setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu');
          setLoading(false);
          return;
        }
        const res = await loginWithLocal(email, password);
        if (res.success) {
          navigate('/');
        } else {
          setErrorMsg(res.message || 'Đăng nhập thất bại');
        }
      } else {
        if (!name || !email || !password) {
          setErrorMsg('Vui lòng điền đủ thông tin đăng ký');
          setLoading(false);
          return;
        }
        const res = await registerUser(name, email, password);
        if (res.success) {
          navigate('/');
        } else {
          setErrorMsg(res.message || 'Đăng ký thất bại');
        }
      }
    } catch (err) {
      setErrorMsg('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-6xl">🎵</span>
          <h1 className="text-white text-3xl font-black mt-4">Paracy Music</h1>
          <p className="text-[#b3b3b3] text-sm mt-2">Nghe nhạc không giới hạn</p>
        </div>

        {/* Card xác thực */}
        <div className="bg-[#181818] rounded-2xl p-8 border border-white/10 text-left relative">
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            {isLoginMode ? 'Đăng nhập vào Paracy' : 'Đăng ký tài khoản mới'}
          </h2>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLoginMode && (
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Tên hiển thị</label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#282828] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Email</label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#282828] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#282828] text-white px-4 py-3 rounded outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-full transition-colors mt-2"
            >
              {loading ? 'Đang xử lý...' : (isLoginMode ? 'Đăng Nhập' : 'Đăng Ký')}
            </button>
          </form>

          <div className="mt-6 text-center text-[#b3b3b3] text-sm">
            {isLoginMode ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-white font-bold hover:text-green-500 transition-colors underline"
            >
              {isLoginMode ? "Đăng ký ngay" : "Đăng nhập tại đây"}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#181818] px-4 text-[#6b7280] text-sm uppercase tracking-wider font-semibold">hoặc</span>
            </div>
          </div>

          {/* Login Facebook */}
          <button
            onClick={loginWithFacebook}
            className="w-full flex items-center justify-center gap-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-3.5 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Tiếp tục với Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
