import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './StatsCards';
import ChartsSection from './ChartsSection';
import TablesSection from './TablesSection';
import PurchaseOverview from './PurchaseOverview';
import ProductSummary from './ProductSummary';
import { DashboardData } from '../../types/dashboard.types';
import { dashboardService } from '../../services/dashboardService';
import LoadingSpinner from '../Shared/LoadingSpinner';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="alert alert-danger">
          <h4>Error Loading Dashboard</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onRefresh={handleRefresh} />
        
        <Container fluid className="dashboard-content">
          {/* Statistics Cards Row */}
          <Row className="mb-4">
            <Col xs={12}>
              <StatsCards data={dashboardData?.stats} />
            </Col>
          </Row>

          {/* Charts Section */}
          <Row className="mb-4">
            <Col xs={12}>
              <ChartsSection data={dashboardData?.charts} />
            </Col>
          </Row>

          {/* Tables and Overview Section */}
          <Row className="mb-4">
            <Col lg={8}>
              <TablesSection data={dashboardData?.tables} />
            </Col>
            <Col lg={4}>
              <div className="side-panels">
                <PurchaseOverview data={dashboardData?.purchase} />
                <ProductSummary data={dashboardData?.summary} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
