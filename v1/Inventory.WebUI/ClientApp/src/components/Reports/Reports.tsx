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
import { 
  ReportsResponse, 
  MetricCardData, 
  FormattedBestCategory, 
  FormattedBestProduct
} from '../../types/reports';
import { useReports } from '../../hooks/useReports';
import { formatINR, formatNumber, formatChartAxisValue } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Types importés depuis types/reports.ts

const Reports: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Utilisation du hook personnalisé pour gérer les données
  const { data: reportsData, loading, error, refetch } = useReports();

  // Les formatters sont maintenant importés depuis utils/formatters.ts

  // Prepare overview metrics
  const overviewMetrics: MetricCardData[] = reportsData ? [
    { value: formatINR(reportsData.overview.totalProfit), label: 'Total Profit' },
    { value: formatINR(reportsData.overview.revenue), label: 'Revenue' },
    { value: formatNumber(reportsData.overview.sales), label: 'Sales' }
  ] : [
    { value: '₹0', label: 'Total Profit' },
    { value: '₹0', label: 'Revenue' },
    { value: '0', label: 'Sales' }
  ];

  const secondRowMetrics: MetricCardData[] = reportsData ? [
    { value: formatINR(reportsData.overview.netPurchaseValue), label: 'Net Purchase Value' },
    { value: formatINR(reportsData.overview.netSalesValue), label: 'Net Sales Value' },
    { value: formatINR(reportsData.overview.momProfit), label: 'MoM Profit' },
    { value: formatINR(reportsData.overview.yoyProfit), label: 'YoY Profit' }
  ] : [
    { value: '₹0', label: 'Net Purchase Value' },
    { value: '₹0', label: 'Net Sales Value' },
    { value: '₹0', label: 'MoM Profit' },
    { value: '₹0', label: 'YoY Profit' }
  ];

  const bestCategories: FormattedBestCategory[] = reportsData?.bestCategories?.map(cat => ({
    category: cat.category,
    turnover: formatINR(cat.turnOver),
    increaseBy: cat.increaseBy
  })) || [];

  const bestProducts: FormattedBestProduct[] = reportsData?.bestProducts?.map(prod => ({
    product: prod.product,
    productId: prod.productId,
    category: prod.category,
    remainingQuantity: prod.remainingQuantity,
    turnover: formatINR(prod.turnOver),
    increaseBy: prod.increaseBy
  })) || [];

  // Prepare chart data based on API response
  const chartData = reportsData?.chartData || null;
  
  const monthlyData = {
    labels: chartData?.monthly?.labels || ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Revenue',
        data: chartData?.monthly?.revenue || [0, 0, 0, 0, 0, 0, 0],
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
        data: chartData?.monthly?.profit || [0, 0, 0, 0, 0, 0, 0],
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
    labels: chartData?.weekly?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: chartData?.weekly?.revenue || [0, 0, 0, 0],
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
        data: chartData?.weekly?.profit || [0, 0, 0, 0],
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
            return formatChartAxisValue(value);
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

  // Affichage conditionnel pour le chargement et les erreurs
  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des rapports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container">
        <div className="error-state">
          <h3>Erreur lors du chargement</h3>
          <p>{error}</p>
          <button onClick={refetch} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

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
                className={`toggle-btn ${chartPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setChartPeriod('monthly')}
              >
                Monthly
              </button>
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
