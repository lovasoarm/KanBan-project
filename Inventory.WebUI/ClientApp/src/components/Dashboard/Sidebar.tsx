import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  path: string;
  icon: string;
  label: string;
  active?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { path: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { path: '/suppliers', icon: 'fas fa-truck', label: 'Suppliers' },
    { path: '/orders', icon: 'fas fa-shopping-cart', label: 'Orders' },
    { path: '/manage-store', icon: 'fas fa-store', label: 'Manage Store' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Implémentation logout
    console.log('Logout clicked');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo & Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="fas fa-boxes brand-icon"></i>
          {!collapsed && <span className="brand-text">Inventory Pro</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <i className={`fas fa-${collapsed ? 'angle-right' : 'angle-left'}`}></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <Nav className="sidebar-nav flex-column">
        {menuItems.map((item, index) => (
          <Nav.Link
            key={index}
            as={Link}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <i className={item.icon}></i>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {isActive(item.path) && <div className="active-indicator"></div>}
          </Nav.Link>
        ))}
      </Nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="user-section">
          <div className="user-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          )}
        </div>
        
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="Log Out"
        >
          <i className="fas fa-sign-out-alt"></i>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
