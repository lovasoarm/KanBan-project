import React, { useState, useMemo, useCallback } from 'react';
import { Badge } from 'react-bootstrap';
import { setupChartDefaults, barChartOptions, lineChartOptions } from '../../utils/chartConfig';
import { useOptimizedDashboard } from '../../hooks/useOptimizedDashboard';
import { MemoizedBarChart, MemoizedLineChart } from '../Common/MemoizedChart';
import './Dashboard.css';

// Initialiser la configuration Chart.js une seule fois
setupChartDefaults();

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  
  // Utiliser le hook optimisé pour les données du dashboard
  const { data: dashboardData, isLoading, error } = useOptimizedDashboard();

  // Callbacks mémorisés pour éviter les re-créations
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const changePeriod = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  // Utiliser les données avec fallback intégré dans le hook
  const salesStats = dashboardData?.stats || {};
  const purchaseStats = dashboardData?.purchase || {};
  const inventoryData = dashboardData?.summary || {};
  const topProducts = dashboardData?.tables?.topSellingStock || [];
  const lowStockItems = dashboardData?.tables?.lowQuantityStock || [];

  const staticChartData = useMemo(() => {
    const weeklyData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Purchase',
          data: [4200, 3800, 5100, 4600, 5300, 4900, 4400],
          backgroundColor: '#2F80ED',
          borderRadius: 6,
          barThickness: 20
        },
        {
          label: 'Sales',
          data: [5200, 4800, 6100, 5600, 6300, 5900, 5400],
          backgroundColor: '#34C759',
          borderRadius: 6,
          barThickness: 20
        }
      ]
    };
    
    const monthlyData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Purchase',
          data: [125000, 115000, 140000, 130000, 145000, 135000],
          backgroundColor: '#2F80ED',
          borderRadius: 6,
          barThickness: 20
        },
        {
          label: 'Sales',
          data: [150000, 142000, 165000, 155000, 170000, 160000],
          backgroundColor: '#34C759',
          borderRadius: 6,
          barThickness: 20
        }
      ]
    };
    
    return { weeklyData, monthlyData };
  }, []); // Pas de dépendances - données statiques

 
  const realChartData = useMemo(() => {
    if (dashboardData?.charts?.salesAndPurchase) {
      const chartData = dashboardData.charts.salesAndPurchase;
      return {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Purchase',
            data: [...chartData.purchaseData], 
            backgroundColor: '#2F80ED',
            borderRadius: 6,
            barThickness: 20
          },
          {
            label: 'Sales',
            data: [...chartData.salesData], 
            backgroundColor: '#34C759',
            borderRadius: 6,
            barThickness: 20
          }
        ]
      };
    }
    return null;
  }, [JSON.stringify(dashboardData?.charts?.salesAndPurchase)]); 

  // Données finales du graphique
  const salesChartData = useMemo(() => {
    if (realChartData) {
      return realChartData;
    }
    return selectedPeriod === 'weekly' ? staticChartData.weeklyData : staticChartData.monthlyData;
  }, [realChartData, selectedPeriod, staticChartData]);

  // Données statiques pour le graphique des commandes
  const staticOrderData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ordered',
        data: [450, 380, 520, 460, 580, 490],
        borderColor: '#2F80ED',
        backgroundColor: 'rgba(47, 128, 237, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Delivered',
        data: [420, 360, 480, 440, 540, 470],
        borderColor: '#34C759',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }), []); // Pas de dépendances - données statiques

  const orderChartData = useMemo(() => {
    // Si on a des données réelles, les utiliser
    if (dashboardData?.charts?.orderSummary) {
      const chartData = dashboardData.charts.orderSummary;
      return {
        labels: [...chartData.labels], // Clone
        datasets: [
          {
            label: 'Ordered',
            data: [...chartData.orderedData], // Clone
            borderColor: '#2F80ED',
            backgroundColor: 'rgba(47, 128, 237, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Delivered',
            data: [...chartData.deliveredData], // Clone
            borderColor: '#34C759',
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      };
    }

    // Utiliser les données statiques par défaut
    return staticOrderData;
  }, [JSON.stringify(dashboardData?.charts?.orderSummary), staticOrderData]);

  // Indicateur de chargement
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/images/logo.svg" alt="Logo" className="logo-img" />
            {!sidebarCollapsed && <span className="logo-text">Inventory</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <i className="fas fa-tachometer-alt"></i>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-boxes"></i>
            {!sidebarCollapsed && <span>Inventory</span>}
          </a>
          <a href="#" className="nav-item">
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
          <a href="#" className="nav-item">
            <i className="fas fa-cog"></i>
            {!sidebarCollapsed && <span>Settings</span>}
          </a>
          <a href="#" className="nav-item logout">
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Log Out</span>}
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

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Sales Overview */}
          <div className="card-group sales-overview">
            <h3 className="section-title">Sales Overview</h3>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.salesOverview?.value?.toLocaleString() || salesStats.totalSales?.toLocaleString() || '45,231'}</div>
                  <div className="stat-label">Total Sales</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{salesStats.totalOrders || '1,563'}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.avgOrderValue || '289'}</div>
                  <div className="stat-label">Avg Order Value</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-percentage"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{salesStats.conversion || '3.2'}%</div>
                  <div className="stat-label">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Overview */}
          <div className="card-group purchase-overview">
            <h3 className="section-title">Purchase Overview</h3>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{purchaseStats.purchase?.value?.toLocaleString() || purchaseStats.totalPurchase?.toLocaleString() || '32,450'}</div>
                  <div className="stat-label">Total Purchase</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-truck"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{purchaseStats.totalSuppliers || '45'}</div>
                  <div className="stat-label">Total Suppliers</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{purchaseStats.pendingOrders || '23'}</div>
                  <div className="stat-label">Pending Orders</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-hourglass-half"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{purchaseStats.avgLeadTime || '5.2'} days</div>
                  <div className="stat-label">Avg Lead Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales & Purchase Chart */}
          <div className="card chart-card sales-chart">
            <div className="card-header">
              <h4 className="card-title">Sales & Purchase</h4>
              <div className="chart-toggle">
                <button 
                  className={selectedPeriod === 'weekly' ? 'active' : ''}
                  onClick={() => changePeriod('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={selectedPeriod === 'monthly' ? 'active' : ''}
                  onClick={() => changePeriod('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div className="chart-container">
              <MemoizedBarChart 
                data={salesChartData} 
                options={barChartOptions} 
              />
            </div>
          </div>

          {/* Order Summary Chart */}
          <div className="card chart-card order-chart">
            <div className="card-header">
              <h4 className="card-title">Order Summary</h4>
            </div>
            <div className="chart-container">
              <MemoizedLineChart 
                data={orderChartData} 
                options={lineChartOptions} 
              />
            </div>
          </div>

          {/* Top Selling Stock */}
          <div className="card table-card top-selling">
            <div className="card-header">
              <h4 className="card-title">Top Selling Stock</h4>
              <a href="#" className="see-all">See All</a>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sold Quantity</th>
                    <th>Remaining Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="table-row">
                      <td className="product-name">{product.name}</td>
                      <td><span className="quantity-sold">{product.sold || product.soldQuantity}</span></td>
                      <td><span className="quantity-remaining">{product.remaining || product.remainingQuantity}</span></td>
                      <td className="price">{product.priceFormatted || `$${product.price}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Inventory Summary */}
            <div className="card summary-card">
              <div className="card-header">
                <h4 className="card-title">Inventory Summary</h4>
              </div>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="summary-value">{inventoryData.totalProducts || '2,456'}</span>
                  <span className="summary-label">Total Products</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value low">{inventoryData.lowStock || '45'}</span>
                  <span className="summary-label">Low Stock</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value out">{inventoryData.outOfStock || '12'}</span>
                  <span className="summary-label">Out of Stock</span>
                </div>
                <div className="summary-item">
                  <span className="summary-value">{inventoryData.categories || '24'}</span>
                  <span className="summary-label">Categories</span>
                </div>
              </div>
            </div>

            {/* Low Quantity Stock */}
            <div className="card low-stock-card">
              <div className="card-header">
                <h4 className="card-title">Low Quantity Stock</h4>
              </div>
              <div className="low-stock-list">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="low-stock-item">
                    <img src={item.image} alt={item.name} className="product-thumb" />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <div className="item-quantity">
                        <span>Remaining Quantity: {item.remaining}</span>
                        <Badge className="low-badge pulse">Low</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
