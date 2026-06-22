// src/components/layout/Layout.jsx
import { Sidebar } from './Sidebar';

export const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="navbar">
          <div style={{ paddingLeft: 0 }}>
            <div className="navbar-title">{title}</div>
            {subtitle && <div className="navbar-subtitle">{subtitle}</div>}
          </div>
        </header>
        <main className="page-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
};
