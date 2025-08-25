import React from 'react';
import { Row, Col, Card, Alert, Button, Badge, Table } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import StatsCards from '../components/Dashboard/StatsCards';
import { useDashboard } from '../hooks/useDashboard';
import {
  createCategoryChartData,
  createStatusChartData, 
  createTrendChartData,
  createChartOptions,
  formatCurrency
} from '../utils/chartUtils';
import '../components/Dashboard/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="text-center p-4">
        <i className="fas fa-spinner fa-spin fa-2x"></i>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  if (!data) return null;

  const categoryChartData = createCategoryChartData(data.categoryData);
  const statusChartData = createStatusChartData(data.statusData);
  const trendChartData = createTrendChartData(data.monthlyTrends);
  const chartOptions = createChartOptions();

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title mb-1">
              <i className="fas fa-tachometer-alt me-2 text-primary"></i>
              Inventory Management Dashboard
            </h1>
            <p className="text-muted mb-0">Welcome back! Here's what's happening with your inventory today.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm">
              <i className="fas fa-download me-1"></i>
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={refetch}>
              <i className="fas fa-sync-alt me-1"></i>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Section Inventory prioritaire */}
      <div className="stats-section mb-4">
        <StatsCards data={data} />
      </div>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-bolt me-2 text-warning"></i>
                  Quick Actions
                </h5>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="fas fa-plus me-1"></i>
                    Add Product
                  </Button>
                  <Button variant="outline-success" size="sm">
                    <i className="fas fa-truck me-1"></i>
                    New Order
                  </Button>
                  <Button variant="outline-info" size="sm">
                    <i className="fas fa-file-alt me-1"></i>
                    Generate Report
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="chart-card">
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Products by Category
              </Card.Title>
            </Card.Header>
            <Card.Body style={{ height: '350px' }}>
              <Bar data={categoryChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="chart-card">
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Stock Status
              </Card.Title>
            </Card.Header>
            <Card.Body style={{ height: '350px' }}>
              <Doughnut data={statusChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="chart-card">
            <Card.Header>
              <Card.Title className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                Monthly Value Trends
              </Card.Title>
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <Line data={trendChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
