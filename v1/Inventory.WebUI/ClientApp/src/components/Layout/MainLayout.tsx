import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FileText, Truck, ShoppingCart, 
  Store, Settings, LogOut, Search, Bell, User, Menu, X
} from 'lucide-react';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: Package, path: '/products' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, path: '/suppliers' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { id: 'store', label: 'Manage Store', icon: Store, path: '/store' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Package size={24} />
            </div>
            {!sidebarCollapsed && <span className="logo-text">InventoryPro</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <item.icon size={20} className="nav-icon" />
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
          
          <button 
            className="nav-item logout-btn"
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Log Out' : ''}
          >
            <LogOut size={20} className="nav-icon" />
            {!sidebarCollapsed && <span className="nav-label">Log Out</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search product, supplier, order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="topbar-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="user-avatar">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
