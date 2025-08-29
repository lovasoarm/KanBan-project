import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import OverallInventory from '../components/Inventory/OverallInventory';
import ProductsTable from '../components/Inventory/ProductsTable';
import AddProductModal from '../components/Inventory/AddProductModal';
import FiltersModal from '../components/Inventory/FiltersModal';
import '../components/Dashboard/Dashboard.css';
import './Inventory.css';

interface ProductFilters {
  category?: string;
  availability?: string;
  priceRange?: { min?: number; max?: number };
  quantityRange?: { min?: number; max?: number };
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const {
    products,
    inventoryMetrics,
    loading,
    error,
    totalPages,
    refetch
  } = useInventory({
    page: currentPage,
    size: pageSize,
    filters,
    search: searchTerm
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersApply = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
    setShowFiltersModal(false);
  };

  const handleDownloadAll = () => {
    console.log('Download all products');
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleProductAdded = () => {
    setShowAddModal(false);
    refetch();
  };

  if (loading && !products.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p className="mt-2">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <Button variant="outline-danger" size="sm" className="ms-2" onClick={refetch}>
            <i className="fas fa-sync-alt me-1"></i>
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="modern-dashboard">
      {}
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
          <a href="/inventory" className="nav-item active">
            <i className="fas fa-boxes"></i>
            {!sidebarCollapsed && <span>Inventory</span>}
          </a>
          <a href="/reports" className="nav-item">
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

      {}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {}
        <div className="topbar">
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search product, supplier, order"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {}
        <div className="inventory-content">
          {}
          <div className="inventory-metrics mb-4">
            <h2 className="section-title mb-3">Overall Inventory</h2>
            <OverallInventory metrics={inventoryMetrics} loading={loading} />
          </div>

          {}
          <div className="products-section">
            <div className="section-header mb-3">
              <h2 className="section-title">Products</h2>
              <div className="section-actions">
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={handleAddProduct}
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Product
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => setShowFiltersModal(true)}
                >
                  <i className="fas fa-filter me-1"></i>
                  Filters
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleDownloadAll}
                >
                  <i className="fas fa-download me-1"></i>
                  Download All
                </Button>
              </div>
            </div>

            {}
            <ProductsTable
              products={products}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {}
        <AddProductModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />

        <FiltersModal
          show={showFiltersModal}
          onHide={() => setShowFiltersModal(false)}
          filters={filters}
          onFiltersApply={handleFiltersApply}
        />

      </div>
    </div>
  );
};

export default Inventory;

