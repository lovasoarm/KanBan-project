import React, { useState, useCallback } from 'react';
import { Reports as ReportsComponent } from '../components/Reports';
import Sidebar from '../components/Dashboard/Sidebar';

const Reports: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/images/logo.svg" alt="Logo" className="logo-img" />
            {!sidebarCollapsed && <span className="logo-text">KanBan</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">
            <i className="fas fa-tachometer-alt"></i>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </a>
          <a href="/inventory" className="nav-item">
            <i className="fas fa-boxes"></i>
            {!sidebarCollapsed && <span>Inventory</span>}
          </a>
          <a href="/reports" className="nav-item active">
            <i className="fas fa-chart-bar"></i>
            {!sidebarCollapsed && <span>Reports</span>}
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-truck"></i>
            {!sidebarCollapsed && <span>Suppliers</span>}
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-shopping-cart"></i>
            {!sidebarCollapsed && <span>Orders</span>}
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-store"></i>
            {!sidebarCollapsed && <span>Manage Store</span>}
          </a>
          <a href="#" className="nav-item settings-btn">
            <i className="fas fa-cog"></i>
            {!sidebarCollapsed && <span>Settings</span>}
          </a>
          <a href="#" className="nav-item logout">
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Logout</span>}
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Topbar */}
        <div className="topbar">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search product, supplier, order"
              className="search-input"
            />
          </div>
          <div className="topbar-actions">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
              <span className="notification-badge">3</span>
            </button>
            <div className="user-avatar">
              <img src="/icons/boy.png" alt="User" />
            </div>
          </div>
        </div>
        
        <ReportsComponent />
      </div>
    </div>
  );
};

export default Reports;
