import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
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
import { dashboardService } from '../services/api';

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

interface DashboardData {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  categoryData: any[];
  statusData: any[];
  monthlyTrends: any[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getDashboardData();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // CategoryChart
  const categoryChartData = {
    labels: data.categoryData.map(item => item.category),
    datasets: [{
      label: 'Products by Category',
      data: data.categoryData.map(item => item.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // StatusChart  
  const statusChartData = {
    labels: data.statusData.map(item => item.status),
    datasets: [{
      label: 'Stock Status',
      data: data.statusData.map(item => item.count),
      backgroundColor: [
        '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // TrendChart
  const trendChartData = {
    labels: data.monthlyTrends.map(item => item.month),
    datasets: [{
      label: 'Stock Value Trend',
      data: data.monthlyTrends.map(item => item.value),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title">
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h1>
        <button className="btn btn-outline-primary" onClick={fetchDashboardData}>
          <i className="fas fa-sync-alt me-1"></i>
          Refresh
        </button>
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
            value={`$${data.totalValue.toLocaleString()}`}
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
