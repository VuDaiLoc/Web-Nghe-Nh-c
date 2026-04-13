import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/',          icon: '🏠', label: 'Trang chủ',   exact: true },
  { to: '/favorites', icon: '❤️', label: 'Yêu thích'  },
  { to: '/playlists', icon: '🎵', label: 'Playlist'    },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <NavLink to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
        <div className="sidebar-logo-icon">🎧</div>
        <span className="sidebar-logo-text">Paracy</span>
      </NavLink>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>

        {NAV_ITEMS.map(({ to, icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <span className="nav-section-label" style={{ marginTop: 8 }}>Quản trị</span>
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* User info + Logout */}
      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} onError={e => { e.target.style.display='none'; }} />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name" title={user.name}>{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
            ↪
          </button>
        </div>
      )}
    </aside>
  );
}
