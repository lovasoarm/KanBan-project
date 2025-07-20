import React from 'react';
import { Row, Col, Card, Alert, Button } from 'react-bootstrap';
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
import StatsCard from '../components/StatsCard';
import { useDashboard } from '../hooks/useDashboard';
import {
  createCategoryChartData,
  createStatusChartData, 
  createTrendChartData,
  createChartOptions,
  formatCurrency
} from '../utils/chartUtils';

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title">
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h1>
        <Button variant="outline-primary" onClick={refetch}>
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </Button>
      </div>

      {/* StatsCards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Total Products"
            value={data.totalProducts}
            icon="fas fa-boxes"
            color="primary"
            trend="+5.2%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Low Stock"
            value={data.lowStockItems}
            icon="fas fa-exclamation-triangle"
            color="warning"
            trend="-2.1%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Out of Stock"
            value={data.outOfStockItems}
            icon="fas fa-times-circle"
            color="danger"
            trend="+1.3%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Total Value"
            value={formatCurrency(data.totalValue)}
            icon="fas fa-dollar-sign"
            color="success"
            trend="+8.7%"
          />
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
