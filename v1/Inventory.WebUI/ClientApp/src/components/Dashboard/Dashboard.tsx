import React, { useState, useMemo, useCallback } from 'react';
import { Badge } from 'react-bootstrap';
import { setupChartDefaults, barChartOptions, lineChartOptions } from '../../utils/chartConfig';
import { getProductImage, getStockStatus } from '../../utils/productImageUtils';
import { useOptimizedDashboard } from '../../hooks/useOptimizedDashboard';
import { MemoizedBarChart, MemoizedLineChart } from '../Common/MemoizedChart';
import TopSellingTable from './TopSellingTable';
import './Dashboard.css';


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

  // Données finales du graphique - uniquement weekly
  const salesChartData = useMemo(() => {
    if (realChartData) {
      return realChartData;
    }
    return staticChartData.weeklyData; // Toujours weekly
  }, [realChartData, staticChartData]);

  // Données statiques pour le graphique des commandes
  const staticOrderData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ordered',
        data: [450, 380, 520, 460, 580, 490],
        borderColor: '#FF9500', // Orange
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Delivered',
        data: [420, 360, 480, 440, 540, 470],
        borderColor: '#34C759', // Bleu clair
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
            borderColor: '#FF9500', // Orange
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Delivered',
            data: [...chartData.deliveredData], // Clone
            borderColor: '#34C759', // Bleu clair
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
          <a href="/dashboard" className="nav-item active">
            <i className="fas fa-tachometer-alt"></i>
            {!sidebarCollapsed && <span>Dashboard</span>}
          </a>
          <a href="/inventory" className="nav-item">
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

        {/* Dashboard Grid - 2 colonnes x 4 lignes */}
        <div className="dashboard-grid">
          {/* Sales Overview - 4 éléments : Sales, Revenue, Profit, Cost */}
          <div className="card-group sales-overview">
            <h3 className="section-title">Sales Overview</h3>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.sales?.value?.toLocaleString() || '45,231'}</div>
                  <div className="stat-label">Sales</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.revenue?.value?.toLocaleString() || '38,500'}</div>
                  <div className="stat-label">Revenue</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <i className="fas fa-coins"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.profit?.value?.toLocaleString() || '12,890'}</div>
                  <div className="stat-label">Profit</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-receipt"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{salesStats.cost?.value?.toLocaleString() || '25,641'}</div>
                  <div className="stat-label">Cost</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Overview - 4 éléments : Purchase, Cost, Cancel, Return */}
          <div className="card-group purchase-overview">
            <h3 className="section-title">Purchase Overview</h3>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon blue">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{purchaseStats.purchase?.value?.toLocaleString() || '32,450'}</div>
                  <div className="stat-label">Purchase</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">
                  <i className="fas fa-receipt"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">₹{purchaseStats.cost?.value?.toLocaleString() || '28,300'}</div>
                  <div className="stat-label">Cost</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{purchaseStats.cancel?.value?.toLocaleString() || '23'}</div>
                  <div className="stat-label">Cancel</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <i className="fas fa-undo"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{purchaseStats.return?.value?.toLocaleString() || '18'}</div>
                  <div className="stat-label">Return</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales & Purchase Graph - Vue uniquement en weekly */}
          <div className="card chart-card sales-chart">
            <div className="card-header">
              <h4 className="card-title">Sales & Purchase</h4>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#2F80ED'}}></span>
                  Purchase
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#34C759'}}></span>
                  Sales
                </span>
              </div>
            </div>
            <div className="chart-container">
              <MemoizedBarChart 
                data={salesChartData} 
                options={barChartOptions} 
              />
            </div>
          </div>

          {/* Order Summary - Ordered (orange), Delivered (bleu clair) */}
          <div className="card chart-card order-chart">
            <div className="card-header">
              <h4 className="card-title">Order Summary</h4>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#FF9500'}}></span>
                  Ordered
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#34C759'}}></span>
                  Delivered
                </span>
              </div>
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
            <TopSellingTable products={topProducts} />
          </div>

          {/* Inventory Summary - 2 éléments : Quantity in hand, To be received */}
          <div className="card summary-card inventory-summary">
            <div className="card-header">
              <h4 className="card-title">
                <i className="fas fa-boxes me-2"></i>
                Inventory Summary
              </h4>
            </div>
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-value">{salesStats.quantityInHand?.value?.toLocaleString() || '2,456'}</span>
                <span className="summary-label">Quantity in Hand</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{salesStats.toBeReceived?.value?.toLocaleString() || '189'}</span>
                <span className="summary-label">To be Received</span>
              </div>
            </div>
          </div>

          {/* Product Summary - 2 éléments : Number of suppliers, Number of categories */}
          <div className="card summary-card product-summary">
            <div className="card-header">
              <h4 className="card-title">
                <i className="fas fa-cube me-2"></i>
                Product Summary
              </h4>
            </div>
            <div className="summary-stats">
              <div className="summary-item">
                <span className="summary-value">{inventoryData.numberOfSuppliers || '24'}</span>
                <span className="summary-label">Number of Suppliers</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{inventoryData.numberOfCategories || '12'}</span>
                <span className="summary-label">Number of Categories</span>
              </div>
            </div>
          </div>

          {/* Low Quantity Stock avec bouton See all */}
          <div className="card low-stock-card">
            <div className="card-header">
              <h4 className="card-title">Low Quantity Stock</h4>
              <a href="#" className="see-all">See All</a>
            </div>
            <div className="low-stock-list">
              {lowStockItems.length > 0 ? lowStockItems.map((item, index) => (
                <div key={index} className="low-stock-item">
                  <img src={getProductImage(item.name)} alt={item.name} className="product-thumb" />
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <div className="item-quantity">
                      <span>Remaining quantity: {item.remaining} packets</span>
                      <Badge 
                        className="low-badge pulse" 
                        style={getStockStatus(item.remaining)}
                      >
                        {getStockStatus(item.remaining).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              )) : (
   
                [
                  { name: 'Wireless Headphones', remaining: 12 },
                  { name: 'Gaming Laptop', remaining: 3 },
                  { name: '4K Monitor', remaining: 8 },
                  { name: 'iPhone 15', remaining: 2 },
                  { name: 'Bluetooth Speaker', remaining: 15 }
                ].map((item, index) => (
                  <div key={index} className="low-stock-item">
                    <img src={getProductImage(item.name)} alt={item.name} className="product-thumb" />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <div className="item-quantity">
                        <span>Remaining quantity: {item.remaining} packets</span>
                        <Badge 
                          className="low-badge pulse" 
                          style={getStockStatus(item.remaining)}
                        >
                          {getStockStatus(item.remaining).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
