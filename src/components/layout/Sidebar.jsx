// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, TrendingDown, Target,
  BarChart3, Download, LogOut, Moon, Sun, Wallet, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { useTheme } from '../../contexts/useTheme';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/income', icon: TrendingUp, label: 'Income' },
  { to: '/expenses', icon: TrendingDown, label: 'Expenses' },
  { to: '/budget', icon: Target, label: 'Budget' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/export', icon: Download, label: 'Export' },
];

export const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : currentUser?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <>
      {/* Mobile hamburger */}
      <button className="hamburger" onClick={() => setOpen(!open)}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 99 }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Wallet size={18} />
          </div>
          <div>
            <div className="logo-text">SmartTracker</div>
            <div className="logo-sub">Expense Manager</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-label">Menu</div>
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon className="nav-icon" size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="user-name">{currentUser?.displayName || 'User'}</div>
              <div className="user-email">{currentUser?.email}</div>
            </div>
          </div>

          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
