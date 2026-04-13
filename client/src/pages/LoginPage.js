import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { facebookLoginUrl } from '../api/api';

const WAVE_HEIGHTS = [24, 52, 36, 64, 28, 48, 18, 56, 40, 30, 60, 22, 44, 32, 58];

export default function LoginPage() {
  const [tab, setTab]           = useState('login'); // 'login' | 'register'
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  /* Login fields */
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  /* Register fields */
  const [regName,     setRegName]     = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!loginEmail || !loginPassword) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) navigate('/');
      else setError(res.message || 'Sai thông tin đăng nhập');
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError('Vui lòng nhập đầy đủ thông tin'); return;
    }
    if (regPassword !== regConfirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (regPassword.length < 6)     { setError('Mật khẩu tối thiểu 6 ký tự'); return; }
    setLoading(true);
    try {
      const res = await register(regName, regEmail, regPassword);
      if (res.success) navigate('/');
      else setError(res.message || 'Đăng ký thất bại');
    } catch (err) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra');
    } finally { setLoading(false); }
  };

  const handleFacebook = () => {
    window.location.href = facebookLoginUrl;
  };

  return (
    <div className="login-page">
      {/* Left Brand Panel */}
      <div className="login-brand">
        <div className="login-brand-logo">🎧</div>
        <div className="login-brand-name">Paracy</div>
        <div className="login-brand-tagline">Âm nhạc kết nối mọi người</div>

        {/* Decorative waveform */}
        <div className="login-waves">
          {WAVE_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="login-wave-bar"
              style={{ height: h, animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-side">
        <div className="login-card">
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            {tab === 'login' ? 'Chào mừng trở lại 👋' : 'Tạo tài khoản mới ✨'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            {tab === 'login'
              ? 'Đăng nhập để tiếp tục thưởng thức âm nhạc'
              : 'Tham gia cùng hàng triệu người dùng Paracy'}
          </p>

          {/* Tabs */}
          <div className="login-tabs">
            <button className={`login-tab${tab==='login'?' active':''}`} onClick={() => { setTab('login'); setError(''); }}>
              Đăng nhập
            </button>
            <button className={`login-tab${tab==='register'?' active':''}`} onClick={() => { setTab('register'); setError(''); }}>
              Đăng ký
            </button>
          </div>

          {/* Error / Success */}
          {error   && <div className="form-error">⚠️ {error}</div>}
          {success && <div className="form-success">✅ {success}</div>}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="form-submit-btn" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="form-submit-btn" disabled={loading}>
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          {/* Divider + Facebook */}
          <div className="form-divider">hoặc</div>
          <button className="facebook-btn" onClick={handleFacebook} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Tiếp tục với Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
