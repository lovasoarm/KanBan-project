import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import StatsCard from '../components/StatsCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  salesTrend: number[];
  categoryDistribution: { category: string; count: number }[];
  topProducts: { name: string; sales: number }[];
  monthlyRevenue: number[];
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    salesTrend: [120, 150, 180, 220, 260, 300],
    categoryDistribution: [
      { category: 'Electronics', count: 45 },
      { category: 'Furniture', count: 30 },
      { category: 'Clothing', count: 25 }
    ],
    topProducts: [
      { name: 'Dell XPS Laptop', sales: 89 },
      { name: 'iPhone 15 Pro', sales: 76 },
      { name: 'Samsung TV', sales: 65 }
    ],
    monthlyRevenue: [15000, 18000, 22000, 25000, 28000, 32000]
  });

  const salesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Trend',
        data: analyticsData.salesTrend,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: analyticsData.categoryDistribution.map(item => item.category),
    datasets: [
      {
        data: analyticsData.categoryDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: analyticsData.monthlyRevenue,
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0, 
    },
    transitions: {
      active: {
        animation: {
          duration: 0 
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="analytics-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-chart-line me-2"></i>
          Analytics
        </h1>
      </div>

      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Total Sales"
            value="1,847"
            icon="fas fa-shopping-cart"
            color="success"
            trend="+12.5%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Average Order"
            value="$156.50"
            icon="fas fa-receipt"
            color="info"
            trend="+8.2%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Conversion Rate"
            value="3.24%"
            icon="fas fa-percentage"
            color="warning"
            trend="-2.1%"
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Customer Retention"
            value="78.5%"
            icon="fas fa-users"
            color="primary"
            trend="+15.3%"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Sales Trend</h5>
            </Card.Header>
            <Card.Body>
              <Line data={salesTrendData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Category Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={categoryData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Monthly Revenue</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={revenueData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Top Selling Products</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>
                        <span className="badge bg-primary">{product.sales}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;
