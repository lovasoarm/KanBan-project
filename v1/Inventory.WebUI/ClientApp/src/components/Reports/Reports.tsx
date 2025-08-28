import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import './Reports.css';
import '../Dashboard/Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricCardData {
  value: string;
  label: string;
}

interface BestCategoryData {
  category: string;
  turnover: string;
  increaseBy: string;
}

interface BestProductData {
  product: string;
  productId: string;
  category: string;
  remainingQuantity: string;
  turnover: string;
  increaseBy: string;
}

const Reports: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const chartRef = useRef<ChartJS<'line'>>(null);

  const overviewMetrics: MetricCardData[] = [
    { value: '₹142,231', label: 'Total Profit' },
    { value: '₹287,453', label: 'Revenue' },
    { value: '1,247', label: 'Sales' }
  ];

  const secondRowMetrics: MetricCardData[] = [
    { value: '₹89,450', label: 'Net Purchase Value' },
    { value: '₹234,670', label: 'Net Sales Value' },
    { value: '₹12,345', label: 'MoM Profit' },
    { value: '₹45,678', label: 'YoY Profit' }
  ];

  const bestCategories: BestCategoryData[] = [
    { category: 'Electronics', turnover: '₹125,453', increaseBy: '12.5%' },
    { category: 'Clothing', turnover: '₹89,234', increaseBy: '8.7%' },
    { category: 'Home & Garden', turnover: '₹67,890', increaseBy: '15.2%' },
    { category: 'Books', turnover: '₹45,123', increaseBy: '5.3%' },
    { category: 'Sports', turnover: '₹34,567', increaseBy: '9.1%' }
  ];

  const bestProducts: BestProductData[] = [
    { product: 'iPhone 15 Pro', productId: '001234', category: 'Electronics', remainingQuantity: '45 kg', turnover: '₹234,567', increaseBy: '18.5%' },
    { product: 'Samsung Galaxy S24', productId: '001235', category: 'Electronics', remainingQuantity: '32 kg', turnover: '₹189,123', increaseBy: '12.3%' },
    { product: 'Nike Air Jordan', productId: '001236', category: 'Sports', remainingQuantity: '67 kg', turnover: '₹145,890', increaseBy: '9.7%' },
    { product: 'MacBook Pro M3', productId: '001237', category: 'Electronics', remainingQuantity: '12 kg', turnover: '₹567,234', increaseBy: '22.1%' },
    { product: 'Sony WH-1000XM5', productId: '001238', category: 'Electronics', remainingQuantity: '89 kg', turnover: '₹78,456', increaseBy: '14.8%' }
  ];

  const monthlyData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 72000, 58000, 78000, 85000, 92000, 68000],
        borderColor: '#2979FF',
        backgroundColor: '#2979FF',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#2979FF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: false
      },
      {
        label: 'Profit',
        data: [35000, 42000, 28000, 48000, 55000, 62000, 38000],
        borderColor: '#FBC02D',
        backgroundColor: 'rgba(251, 192, 45, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#FBC02D',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [18000, 22000, 15000, 25000],
        borderColor: '#2979FF',
        backgroundColor: '#2979FF',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#2979FF',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: false
      },
      {
        label: 'Profit',
        data: [8000, 12000, 7000, 15000],
        borderColor: '#FBC02D',
        backgroundColor: 'rgba(251, 192, 45, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#FBC02D',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: '#F3F4F6',
          borderDash: [3, 3]
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value: any) {
            return '₹' + (value / 1000) + 'K';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: TooltipItem<'line'>[]) {
            return `This Month ${context[0]?.label || ''}`;
          },
          label: function(context: TooltipItem<'line'>) {
            const value = context.parsed.y;
            const formattedValue = value.toLocaleString();
            return `${context.dataset.label}: ₹${formattedValue}`;
          }
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 0
    }
  };

  return (
    <div className="reports-container">

      {/* Top Row - Overview and Best Selling Category side by side */}
      <div className="reports-top-row">
        {/* Overview Section */}
        <div className="overview-section">
          <h2 className="section-title mb-3">Overview</h2>
          
          {/* First Row - 3 columns */}
          <div className="overview-cards">
            {overviewMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Second Row - 4 columns */}
          <div className="overview-metrics">
            {secondRowMetrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Selling Category */}
        <div className="best-selling-section">
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">Best Selling Category</h3>
              <a href="#" className="see-all">See All</a>
            </div>
            <div className="table-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Turn Over</th>
                    <th>Increase By</th>
                  </tr>
                </thead>
                <tbody>
                  {bestCategories.map((category, index) => (
                    <tr key={index}>
                      <td>{category.category}</td>
                      <td className="price">{category.turnover}</td>
                      <td>
                        <span className="increase-badge">{category.increaseBy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Profit & Revenue Chart */}
      <div className="reports-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Profit & Revenue</h3>
            <div className="toggle-buttons">
              <button 
                className={`toggle-btn ${chartPeriod === 'weekly' ? 'active' : ''}`}
                onClick={() => setChartPeriod('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>
          <div className="chart-body">
            <div style={{ height: '240px', flexGrow: 1 }}>
              <Line 
                ref={chartRef}
                data={chartPeriod === 'monthly' ? monthlyData : weeklyData}
                options={chartOptions}
              />
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color revenue-color"></div>
                <span>Revenue</span>
              </div>
              <div className="legend-item">
                <div className="legend-color profit-color"></div>
                <span>Profit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Product */}
      <div className="reports-section">
        <div className="table-card">
          <div className="table-header">
            <h3 className="table-title">Best Selling Product</h3>
            <a href="#" className="see-all">See All</a>
          </div>
          <div className="table-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product ID</th>
                  <th>Category</th>
                  <th>Remaining Quantity</th>
                  <th>Turn Over</th>
                  <th>Increase By</th>
                </tr>
              </thead>
              <tbody>
                {bestProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="product-name">{product.product}</td>
                    <td>{product.productId}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className="quantity-remaining">{product.remainingQuantity}</span>
                    </td>
                    <td className="price">{product.turnover}</td>
                    <td>
                      <span className="increase-badge">{product.increaseBy}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
