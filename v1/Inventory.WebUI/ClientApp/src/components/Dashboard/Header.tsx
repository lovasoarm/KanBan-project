import React, { useState } from 'react';
import { Navbar, Form, FormControl, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import './Header.css';

interface HeaderProps {
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implémentation de la recherche
    console.log('Search query:', searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Navbar className="dashboard-header" expand="lg">
      <div className="header-content">
        {/* Page Title */}
        <div className="page-title">
          <h1>Dashboard</h1>
          <span className="subtitle">Welcome back! Here's what's happening with your inventory.</span>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <Form onSubmit={handleSearchSubmit} className="search-form">
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Search product, supplier, order..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <InputGroup.Text className="search-btn">
                <i className="fas fa-search"></i>
              </InputGroup.Text>
            </InputGroup>
          </Form>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Refresh Button */}
          <button 
            className="header-btn refresh-btn"
            onClick={onRefresh}
            title="Refresh Dashboard"
          >
            <i className="fas fa-sync-alt"></i>
          </button>

          {/* Notifications */}
          <Dropdown align="end">
            <Dropdown.Toggle as="button" className="header-btn notification-btn">
              <i className="fas fa-bell"></i>
              <Badge bg="danger" className="notification-badge">3</Badge>
            </Dropdown.Toggle>
            <Dropdown.Menu className="notification-menu">
              <Dropdown.Header>Notifications</Dropdown.Header>
              <Dropdown.Item className="notification-item">
                <div className="notification-content">
                  <i className="fas fa-exclamation-triangle text-warning"></i>
                  <div className="notification-text">
                    <span className="notification-title">Low Stock Alert</span>
                    <span className="notification-desc">5 products need restocking</span>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="notification-item">
                <div className="notification-content">
                  <i className="fas fa-shopping-cart text-info"></i>
                  <div className="notification-text">
                    <span className="notification-title">New Order</span>
                    <span className="notification-desc">Order #12345 received</span>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="notification-item">
                <div className="notification-content">
                  <i className="fas fa-truck text-success"></i>
                  <div className="notification-text">
                    <span className="notification-title">Shipment Delivered</span>
                    <span className="notification-desc">Supplier delivery completed</span>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-center">
                <small>View all notifications</small>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle as="div" className="user-profile">
              <div className="user-avatar">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="User Avatar" 
                  className="avatar-img"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('d-none');
                  }}
                />
                <i className="fas fa-user-circle avatar-fallback d-none"></i>
              </div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Admin</span>
              </div>
              <i className="fas fa-chevron-down dropdown-arrow"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className="user-menu">
              <Dropdown.Item>
                <i className="fas fa-user me-2"></i>
                Profile
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="fas fa-cog me-2"></i>
                Settings
              </Dropdown.Item>
              <Dropdown.Item>
                <i className="fas fa-question-circle me-2"></i>
                Help
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
